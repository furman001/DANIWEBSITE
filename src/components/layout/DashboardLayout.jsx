import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  LayoutDashboard, ShoppingCart, History, Wallet, Plus,
  ListOrdered, Zap, Menu, LogOut, User, ChevronRight, Home, Shield
} from 'lucide-react';
import { supabase } from '@/api/supabaseClient';
import useOrderSync from '@/hooks/useOrderSync';
import { useAuth } from '@/lib/AuthContext';

const sidebarLinks = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'New Order', path: '/new-order', icon: Plus },
  { label: 'Orders', path: '/orders', icon: History },
  { label: 'Services', path: '/services', icon: ListOrdered },
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
    <div className="flex flex-col h-full">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 p-5 border-b border-border/50">
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <Zap className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="font-heading font-bold text-base leading-tight">PAK SMM</span>
          <span className="font-heading text-[9px] font-semibold text-primary leading-none tracking-widest uppercase">PORTAL</span>
        </div>
      </Link>

      {/* User Info */}
      {user && (
        <div className="p-4 mx-3 mt-3 rounded-xl bg-accent/50 border border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name || 'User'}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav Links */}
      <nav className="flex-1 p-3 space-y-0.5 mt-2">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
              location.pathname === link.path
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <link.icon className="w-4 h-4" />
            <span className="flex-1">{link.label}</span>
            <ChevronRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${
              location.pathname === link.path ? 'opacity-100' : ''
            }`} />
          </Link>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-border/50 space-y-1">
        <Link
          to="/"
          onClick={onNavigate}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>

        {(() => {
          const hasLocalAdminSession = (() => {
            try {
              return localStorage.getItem('admin_session') === 'true';
            } catch {
              return false;
            }
          })();

          const isAdmin = user?.role === 'admin' || hasLocalAdminSession;

          if (!user) return null;

          if (!isAdmin) return null;

          return (
            <Link
              to="/admin"
              onClick={onNavigate}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all w-fit"
            >
              <Shield className="w-4 h-4" />
              Admin Panel
            </Link>
          );
        })()}

        <button
          onClick={() => logout(true)}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}

function OrderSyncManager() {
  const { user } = useAuth();
  useOrderSync(user?.email, user?.role === 'admin');
  return null;
}

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-background font-body">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-card border-r border-border/50 fixed h-screen overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SidebarContent onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border/50 px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-sm">PAK SMM PORTAL</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => logout(true)} className="text-destructive hover:bg-destructive/10">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <OrderSyncManager />
          <Outlet />
        </div>
      </div>
    </div>
  );
}