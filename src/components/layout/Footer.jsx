import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Mail, Phone, MapPin, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-foreground text-background/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <span className="font-heading font-bold text-lg text-background">DM SOCIAL PANEL</span>
              </div>
            </div>
            <p className="text-sm text-background/60 leading-relaxed">
              Pakistan's best and cheapest SMM panel provider for all social media platforms. Powered by DM Social Panel.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-background mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/services" className="hover:text-primary transition-colors">Services</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
              <li><Link to="/add-funds" className="hover:text-primary transition-colors">Add Funds</Link></li>
              <li><Link to="/orders" className="hover:text-primary transition-colors">Orders</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-heading font-semibold text-background mb-4">Support</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/refund-policy" className="hover:text-primary transition-colors">Refund Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/api-docs" className="hover:text-primary transition-colors">API Documentation</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-background mb-4">Contact Us</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                +92 333 3945955
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                support@dmsocialpanel.com
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Pakistan
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/40">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <p>&copy; {new Date().getFullYear()} DM Social Panel. All rights reserved.</p>
            <div className="flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 hover:border-primary/30 transition-colors group">
              <Shield className="w-3.5 h-3.5 text-primary/60 group-hover:text-primary transition-colors" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-background/40 group-hover:text-background/60 transition-colors">Admin Panel</span>
              <div className="w-px h-3 bg-white/10" />
              <div className="flex items-center gap-3">
                <Link to="/admin-login" className="text-[11px] font-semibold hover:text-primary transition-colors">Sign In</Link>
                <span className="opacity-20 text-[10px]">|</span>
                <Link to="/admin-signup" className="text-[11px] font-semibold hover:text-primary transition-colors">Sign Up</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}