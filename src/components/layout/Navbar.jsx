import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X, Zap, Globe, FileText, Shield, Code, ChevronRight, LogIn, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';

const navLinks = [
  { label: 'Services', path: '/services', icon: Globe },
  { label: 'Refund Policy', path: '/refund-policy', icon: Shield },
  { label: 'Terms', path: '/terms', icon: FileText },
  { label: 'API', path: '/api-docs', icon: Code },
];

export default function Navbar() {
  const location = useLocation();
  const { isAuthenticated, session } = useAuth();
  const isLoggedIn = isAuthenticated || !!session;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 py-2 shadow-lg shadow-black/5' 
        : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/20 group-hover:scale-110 transition-transform duration-500">
              <Zap className="w-6 h-6 text-primary-foreground fill-current" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-black text-xl tracking-tighter leading-none">DM SOCIAL</span>
              <span className="font-heading text-[10px] font-bold text-primary tracking-[0.2em] uppercase leading-none mt-1">PANEL</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 text-sm font-semibold transition-colors classic-link ${
                    location.pathname === link.path
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="h-6 w-px bg-border/60 mx-2" />

            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="font-bold rounded-full hover:bg-primary/10">
                  Sign In
                </Button>
              </Link>
              <Link to="/login?mode=register">
                <Button variant="outline" size="sm" className="font-bold rounded-full border-primary/30 text-primary hover:bg-primary/10">
                  Sign Up
                </Button>
              </Link>
              {isLoggedIn && (
                <Link to="/dashboard">
                  <Button size="sm" className="font-bold px-6 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all rounded-full group">
                    Dashboard
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-80 p-0 border-l-0">
              <div className="flex flex-col h-full bg-background">
                <div className="p-6 border-b border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                      <Zap className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="font-heading font-bold text-lg tracking-tight">DM SOCIAL</span>
                  </div>
                </div>
                
                <div className="flex-1 p-6 space-y-2 overflow-y-auto">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                        location.pathname === link.path
                          ? 'bg-primary/10 text-primary border border-primary/20'
                          : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${
                          location.pathname === link.path ? 'bg-primary/20' : 'bg-muted'
                        }`}>
                          <link.icon className="w-5 h-5" />
                        </div>
                        <span className="font-semibold">{link.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </Link>
                  ))}
                </div>

                <div className="p-6 border-t border-border/50 bg-muted/20 space-y-2">
                  <Link to="/login" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full h-12 text-base font-bold rounded-2xl gap-2">
                      <LogIn className="w-4 h-4" /> Sign In
                    </Button>
                  </Link>
                  <Link to="/login?mode=register" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full h-12 text-base font-bold rounded-2xl gap-2 border-primary/30 text-primary hover:bg-primary/10">
                      <UserPlus className="w-4 h-4" /> Sign Up
                    </Button>
                  </Link>
                  {isLoggedIn && (
                    <Link to="/dashboard" onClick={() => setOpen(false)}>
                      <Button className="w-full h-14 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20">
                        Go to Dashboard
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
