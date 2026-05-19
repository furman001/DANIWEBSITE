import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase, TABLES } from '@/api/supabaseClient';
import { queryClientInstance } from '@/lib/query-client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings, setAppPublicSettings] = useState(null);

  useEffect(() => {
    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (session) {
        fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setIsLoadingAuth(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Real-time: keep `user` in sync with the DB row (e.g. wallet_balance after admin approval)
  useEffect(() => {
    const uid = session?.user?.id;
    if (!uid) return;
    const channel = supabase
      .channel(`user-profile-${uid}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: TABLES.USERS, filter: `id=eq.${uid}` },
        (payload) => {
          if (payload.new) setUser(payload.new);
        }
      )
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [session?.user?.id]);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (session) {
        await fetchUserProfile(session.user.id);
      } else {
        setIsLoadingAuth(false);
      }
      
      await loadPublicSettings();
    } catch (error) {
      console.error('Session check error:', error);
      setIsLoadingAuth(false);
      setIsLoadingPublicSettings(false);
    }
  };

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUser(data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('fetchUserProfile error:', error.code, error.message);
      await createUserProfile(userId);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const createUserProfile = async (userId) => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      const displayName = authUser?.user_metadata?.name
        || authUser?.raw_user_meta_data?.name
        || authUser?.email?.split('@')[0]
        || 'User';

      const { data, error } = await supabase
        .from(TABLES.USERS)
        .upsert({
          id: userId,
          email: authUser?.email || 'user@example.com',
          name: displayName,
          role: 'user',
          wallet_balance: 0
        }, { onConflict: 'id' })
        .select()
        .single();

      if (error) throw error;
      setUser(data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error creating user profile:', error);
      setIsLoadingAuth(false);
    }
  };

  const loadPublicSettings = async () => {
    try {
      const { data, error } = await supabase
        .from(TABLES.APP_SETTINGS)
        .select('*');

      if (error) throw error;
      
      const settings = {};
      data?.forEach(item => {
        settings[item.key] = item.value;
      });
      
      setAppPublicSettings({
        id: 'app-1',
        public_settings: settings
      });
    } catch (error) {
      console.error('Error loading public settings:', error);
    } finally {
      setIsLoadingPublicSettings(false);
    }
  };

  const signUp = async (email, password, name) => {
    try {
      setAuthError(null);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } }
      });

      if (error) throw error;

      if (data.user) {
        // Upsert so it doesn't conflict with the auth trigger that auto-creates profiles
        await supabase.from(TABLES.USERS).upsert({
          id: data.user.id,
          email: data.user.email,
          name: name || email.split('@')[0],
          role: 'user',
          wallet_balance: 0
        }, { onConflict: 'id' });
      }

      return { success: true, data };
    } catch (error) {
      console.error('Sign up error:', error);
      setAuthError({ type: 'signup', message: error.message });
      return { success: false, error };
    }
  };

  const signIn = async (email, password) => {
    try {
      setAuthError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Sign in error:', error);
      setAuthError({ type: 'signin', message: error.message });
      return { success: false, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      // Clear all cached query data so the next user doesn't see stale info
      queryClientInstance.clear();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const logout = async (shouldRedirect = true) => {
    // Clear local admin session (used by AdminLogin/Admin page gating)
    try {
      localStorage.removeItem('admin_session');
    } catch {}
    try {
      await signOut();
    } finally {
      if (shouldRedirect) {
        window.location.href = '/';
      }
    }
  };

  const navigateToLogin = () => {
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session,
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      signUp,
      signIn,
      signOut,
      logout,
      navigateToLogin,
      checkSession
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
