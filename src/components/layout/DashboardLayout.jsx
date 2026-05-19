import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  LayoutDashboard, ShoppingCart, History, Wallet, Plus,
  ListOrdered, Zap, Menu, LogOut, User, ChevronRight, Home, Shield, Bell
} from 'lucide-react';
import { supabase, TABLES } from '@/api/supabaseClient';
import useOrderSync from '@/hooks/useOrderSync';
import { useAuth } from '@/lib/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const sidebarLinks = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'New Order', path: '/new-order', icon: Plus },
  { label: 'Orders', path: '/orders', icon: History },
  { label: 'Services', path: '/services', icon: ListOrdered },
  { label: 'Add Funds', path: '/add-funds', icon: Wallet },
];

const bottomNavLinks = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'New Order', path: '/new-order', icon: Plus },
  { label: 'Orders', path: '/orders', icon: History },
  { label: 'Add Funds', path: '/add-funds', icon: Wallet },
];

function SidebarContent({ onNavigate }) {
  const location = useLocation();
  const { user, logout } = useAuth();

  const links = [
    ...sidebarLinks,
    ...(user?.role === 'admin' ? [{ label: 'Admin Panel', path: '/admin', icon: Shield }] : []),
  ];

  return (
    <div className="flex flex-col h-full bg-card border-r border-border/50">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 p-6 mb-2">
        <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/20">
          <Zap className="w-6 h-6 text-primary-foreground fill-current" />
        </div>
        <div className="flex flex-col">
          <span className="font-heading font-black text-lg tracking-tight leading-none">PAK SMM</span>
          <span className="font-heading text-[10px] font-bold text-primary tracking-[0.15em] uppercase leading-none mt-1">PORTAL</span>
        </div>
      </Link>

      {/* User Info */}
      {user && (
        <div className="px-4 mb-6">
          <div className="p-4 rounded-3xl bg-muted/50 border border-border/50 hover:bg-muted transition-colors group cursor-default">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate text-foreground">{user.name || 'User Account'}</p>
                <div className="flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                   <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Online</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nav Links */}
      <nav className="flex-1 px-4 space-y-1">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 group relative overflow-hidden ${
              location.pathname === link.path
                ? 'bg-primary text-primary-foreground shadow-2xl shadow-primary/30'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <link.icon className={`w-5 h-5 transition-transform duration-300 ${
              location.pathname === link.path ? 'scale-110' : 'group-hover:scale-110'
            }`} />
            <span className="flex-1">{link.label}</span>
            {location.pathname === link.path && (
               <motion.div layoutId="active-pill" className="absolute left-0 w-1 h-6 bg-white rounded-r-full" />
            )}
            <ChevronRight className={`w-4 h-4 transition-all duration-300 ${
              location.pathname === link.path ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
            }`} />
          </Link>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 mt-auto space-y-2">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all group"
        >
          <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
          Back to Home
        </Link>

        <button
          onClick={() => logout(true)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-destructive hover:bg-destructive/10 transition-all group"
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const [pendingDeposits, setPendingDeposits] = useState(0);
  const { user, isLoadingAuth, isAuthenticated, session, logout } = useAuth();
  const location = useLocation();
  const isAdmin = user?.role === 'admin' || localStorage.getItem('admin_session') === 'true';

  useOrderSync(user?.email, isAdmin);

  // Real-time pending deposit count for admin bell
  useEffect(() => {
    if (!isAdmin) return;
    const fetchPending = async () => {
      const { count } = await supabase
        .from(TABLES.WALLET_TRANSACTIONS)
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')
        .eq('type', 'deposit');
      setPendingDeposits(count || 0);
    };
    fetchPending();
    const channel = supabase
      .channel('layout-pending-deposits')
      .on('postgres_changes', { event: '*', schema: 'public', table: TABLES.WALLET_TRANSACTIONS }, fetchPending)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [isAdmin]);

  if (!isLoadingAuth && !session) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return (
    <div className="min-h-screen flex bg-background font-body antialiased">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 h-screen fixed inset-y-0 left-0 z-50">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-80 p-0 border-r-0">
          <SidebarContent onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-40 h-16 sm:h-20 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <Button variant="ghost" size="icon" onClick={() => setOpen(true)} className="lg:hidden rounded-full h-9 w-9">
               <Menu className="w-5 h-5" />
             </Button>
             <div className="flex flex-col">
                <h2 className="font-heading font-black text-base sm:text-xl tracking-tight leading-none uppercase">Account Panel</h2>
                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Management Console</p>
             </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-6">
             <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary/5 border border-primary/10">
                <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                <span className="text-xs sm:text-sm font-black">Rs {user?.wallet_balance?.toLocaleString() || '0'}</span>
             </div>
             
             <div className="flex items-center gap-1">
                <Link to={isAdmin ? '/admin' : '#'}>
                <Button variant="ghost" size="icon" className="rounded-full relative h-9 w-9">
                   <Bell className="w-4 h-4" />
                   {isAdmin && pendingDeposits > 0 ? (
                     <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-red-500 rounded-full border border-background flex items-center justify-center text-[9px] font-black text-white">
                       {pendingDeposits > 9 ? '9+' : pendingDeposits}
                     </span>
                   ) : (
                     <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full border border-background" />
                   )}
                </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 px-1.5 sm:px-2 rounded-full hover:bg-muted/50 h-9">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center font-black text-white text-sm uppercase shadow-md shadow-primary/20">
                        {(user?.name?.[0] || session?.user?.email?.[0] || 'U').toUpperCase()}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2">
                    <DropdownMenuLabel className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center font-black text-white text-base uppercase shadow-md shadow-primary/20">
                          {(user?.name?.[0] || session?.user?.email?.[0] || 'U').toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate">{user?.name || session?.user?.email?.split('@')[0] || 'User'}</p>
                          <p className="text-xs text-muted-foreground font-normal truncate">{user?.email || session?.user?.email}</p>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2.5">
                      <Link to="/dashboard" className="flex items-center gap-2 w-full">
                        <LayoutDashboard className="w-4 h-4" />
                        <span className="font-semibold">Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2.5">
                      <Link to="/add-funds" className="flex items-center gap-2 w-full">
                        <Wallet className="w-4 h-4" />
                        <span className="font-semibold">Add Funds</span>
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2.5">
                        <Link to="/admin" className="flex items-center gap-2 w-full">
                          <Shield className="w-4 h-4" />
                          <span className="font-semibold">Admin Panel</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => logout(true)}
                      className="rounded-xl cursor-pointer py-2.5 text-destructive focus:text-destructive focus:bg-destructive/10"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      <span className="font-semibold">Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
             </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 lg:p-10 pb-24 lg:pb-10 animate-reveal">
           <Outlet />
        </main>

        {/* Footer info — hidden on mobile */}
        <footer className="hidden sm:block p-6 border-t border-border/50 text-center">
           <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">&copy; {new Date().getFullYear()} Pak SMM Portal • All Systems Operational</p>
        </footer>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border/60 safe-area-pb">
        <div className="flex items-center justify-around px-2 py-2">
          {bottomNavLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-200 min-w-0 flex-1 ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                <div className={`relative flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-200 ${
                  isActive ? 'bg-primary/10 scale-105' : 'hover:bg-muted/60'
                }`}>
                  {isActive && link.path === '/new-order' ? (
                    <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                      <link.icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                  ) : (
                    <link.icon className={`w-5 h-5 ${ isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                  )}
                  {isActive && (
                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full" />
                  )}
                </div>
                <span className={`text-[10px] font-bold truncate transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}