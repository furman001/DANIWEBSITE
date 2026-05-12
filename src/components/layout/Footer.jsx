import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Mail, Phone, MapPin, Shield, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-24 pb-12 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-48 -mb-48" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/20 group-hover:scale-110 transition-transform duration-500">
                <Zap className="w-6 h-6 text-primary-foreground fill-current" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-black text-xl tracking-tighter leading-none text-white">DM SOCIAL</span>
                <span className="font-heading text-[10px] font-bold text-primary tracking-[0.2em] uppercase leading-none mt-1">PANEL</span>
              </div>
            </Link>
            <p className="text-sm font-medium leading-relaxed max-w-xs">
              Pakistan's premier destination for high-performance social media marketing solutions. 
              Cheapest rates, instant delivery, and 24/7 expert support.
            </p>
            <div className="flex items-center gap-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <button key={i} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:pl-10">
            <h4 className="font-heading font-black text-xs uppercase tracking-[0.2em] text-white mb-8">Navigation</h4>
            <ul className="space-y-4">
              {['Services', 'Dashboard', 'Add Funds', 'Orders'].map((link) => (
                <li key={link}>
                  <Link to={`/${link.toLowerCase().replace(' ', '-')}`} className="text-sm font-bold hover:text-primary transition-colors flex items-center gap-2 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-heading font-black text-xs uppercase tracking-[0.2em] text-white mb-8">Resources</h4>
            <ul className="space-y-4">
              {['Refund Policy', 'Terms of Service', 'API Documentation'].map((link) => (
                <li key={link}>
                  <Link to={`/${link.toLowerCase().split(' ')[0]}`} className="text-sm font-bold hover:text-primary transition-colors flex items-center gap-2 group">
                     <div className="w-1.5 h-1.5 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
                     {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-black text-xs uppercase tracking-[0.2em] text-white mb-8">Contact Us</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <div>
                   <div className="text-[10px] font-black uppercase tracking-widest mb-1">WhatsApp</div>
                   <div className="text-sm font-bold text-white">+92 333 3945955</div>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div>
                   <div className="text-[10px] font-black uppercase tracking-widest mb-1">Email Support</div>
                   <div className="text-sm font-bold text-white uppercase">support@dmsocial.com</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            &copy; {new Date().getFullYear()} DM Social Panel • All Rights Reserved
          </p>
          
          <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:border-primary/30 transition-colors group">
            <Shield className="w-3.5 h-3.5 text-primary/60 group-hover:text-primary transition-colors" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-300 transition-colors">Security Node</span>
            <div className="w-px h-3 bg-white/10" />
            <div className="flex items-center gap-4">
              <Link to="/admin-login" className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">Sign In</Link>
              <Link to="/admin-signup" className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">Sign Up</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}