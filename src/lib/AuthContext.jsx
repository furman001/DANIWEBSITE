import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase, TABLES } from '@/api/supabaseClient';

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
      if (error.code === 'PGRST116') {
        await createUserProfile(userId);
      }
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const createUserProfile = async (userId) => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .insert({
          id: userId,
          email: authUser?.email || 'user@example.com',
          name: authUser?.email?.split('@')[0] || 'User',
          role: 'user',
          wallet_balance: 0
        })
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
        await supabase.from(TABLES.USERS).insert({
          id: data.user.id,
          email: data.user.email,
          name: name || email.split('@')[0],
          role: 'user',
          wallet_balance: 0
        });
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
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const logout = (shouldRedirect = true) => {
    signOut();
    if (shouldRedirect) {
      window.location.href = '/';
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
