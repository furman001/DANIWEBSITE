import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Star, Zap, Shield, Trophy } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background pt-20 pb-16 sm:pt-32 sm:pb-24 lg:pt-40 lg:pb-32">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,hsl(var(--primary)/0.15),transparent_70%)]" />
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-full px-4 py-2 mb-8 glass animate-reveal"
          >
            <div className="flex -space-x-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-5 h-5 rounded-full border-2 border-background bg-primary/20 flex items-center justify-center overflow-hidden">
                   <Star className="w-2.5 h-2.5 text-primary fill-current" />
                </div>
              ))}
            </div>
            <span className="text-xs font-bold text-primary uppercase tracking-[0.15em]">Rated #1 SMM Provider in Pakistan</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading text-5xl sm:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight mb-8"
          >
            Scale Your Social <br />
            <span className="text-primary inline-block relative">
              Presence
              <div className="absolute -bottom-2 left-0 w-full h-3 bg-primary/10 -skew-x-12 -z-10" />
            </span> <br />
            With Confidence.
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-12 max-w-2xl font-medium"
          >
            Experience the next generation of social media marketing. 
            Instant delivery, unbeatable prices, and 24/7 premium support 
            for all your social growth needs.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link to="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:h-16 sm:px-10 text-lg font-bold rounded-2xl shadow-2xl shadow-primary/30 group">
                Get Started Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/services" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:h-16 sm:px-10 text-lg font-bold rounded-2xl border-2 glass transition-all">
                View All Services
              </Button>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 w-full border-t border-border/50 pt-10"
          >
            {[
              { icon: Zap, label: "Instant Delivery", sub: "Within minutes" },
              { icon: Shield, label: "Secure Payments", sub: "100% Protection" },
              { icon: Trophy, label: "Premium Support", sub: "24/7 Live Help" },
              { icon: Star, label: "Top Quality", sub: "Real engagement" }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <div className="font-bold text-sm">{item.label}</div>
                  <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{item.sub}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}