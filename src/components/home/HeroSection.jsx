import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Zap, Shield, Trophy } from 'lucide-react';

const headlineWords = [
  { text: 'Scale', delay: 0.1 },
  { text: 'Your', delay: 0.18 },
  { text: 'Social', delay: 0.26 },
];
const headlineWords2 = [{ text: 'Presence', delay: 0.36 }];
const headlineWords3 = [
  { text: 'With', delay: 0.46 },
  { text: 'Confidence.', delay: 0.54 },
];

const WordReveal = ({ text, delay, className = '' }) => (
  <motion.span
    initial={{ opacity: 0, y: 48, filter: 'blur(8px)' }}
    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    className={`inline-block ${className}`}
  >
    {text}
  </motion.span>
);

export default function HeroSection() {
  return (
    <section
      className="relative pt-24 pb-0 sm:pt-36 lg:pt-44"
      style={{
        backgroundImage: "url('/hero-bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundColor: '#040d1c',
      }}
    >
      {/* Background layers — overflow hidden only on this container */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Dark overlay / fallback gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #040d1c 0%, #0a1628 40%, #091220 70%, #040d1c 100%)',
          }}
        />
        {/* Semi-transparent layer over the image */}
        <div className="absolute inset-0 bg-slate-950/60" />
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse_at_50%_0%,hsl(var(--primary)/0.22),transparent_65%)] pointer-events-none" />
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/15 rounded-full blur-[140px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] animate-pulse delay-1000 pointer-events-none" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-md rounded-full px-4 py-2 mb-8"
          >
            <div className="flex -space-x-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-5 h-5 rounded-full border-2 border-white/20 bg-primary/40 flex items-center justify-center overflow-hidden">
                  <Star className="w-2.5 h-2.5 text-primary fill-current" />
                </div>
              ))}
            </div>
            <span className="text-xs font-bold text-white/90 uppercase tracking-[0.15em]">Rated #1 SMM Provider in Pakistan</span>
          </motion.div>

          {/* Headline — word-by-word stagger */}
          <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl font-black leading-[1.0] tracking-tight mb-6 text-white">
            <span className="flex flex-wrap justify-center gap-x-4 gap-y-1">
              {headlineWords.map((w) => (
                <WordReveal key={w.text} text={w.text} delay={w.delay} />
              ))}
            </span>
            <span className="block mt-1">
              {headlineWords2.map((w) => (
                <WordReveal
                  key={w.text}
                  text={w.text}
                  delay={w.delay}
                  className="text-primary relative"
                />
              ))}
            </span>
            <span className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-1">
              {headlineWords3.map((w) => (
                <WordReveal key={w.text} text={w.text} delay={w.delay} />
              ))}
            </span>
          </h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.66, ease: 'easeOut' }}
            className="text-lg sm:text-xl text-white/70 leading-relaxed mb-12 max-w-2xl font-medium"
          >
            Experience the next generation of social media marketing.
            Instant delivery, unbeatable prices, and 24/7 premium support
            for all your social growth needs.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.78 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link to="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:h-16 sm:px-10 text-lg font-bold rounded-2xl shadow-2xl shadow-primary/40 group">
                Get Started Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/services" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:h-16 sm:px-10 text-lg font-bold rounded-2xl border-2 border-white/25 text-white bg-white/5 backdrop-blur-sm hover:bg-white/15 transition-all"
              >
                View All Services
              </Button>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 w-full border-t border-white/10 pt-10 pb-14 sm:pb-20"
          >
            {[
              { icon: Zap, label: 'Instant Delivery', sub: 'Within minutes' },
              { icon: Shield, label: 'Secure Payments', sub: '100% Protection' },
              { icon: Trophy, label: 'Premium Support', sub: '24/7 Live Help' },
              { icon: Star, label: 'Top Quality', sub: 'Real engagement' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-center">
                  <div className="font-bold text-sm text-white">{item.label}</div>
                  <div className="text-[10px] text-white/50 font-semibold uppercase tracking-wider">{item.sub}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}