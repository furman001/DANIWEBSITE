import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Star } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/30 py-16 sm:py-24 lg:py-28">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/3 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">#1 SMM Panel in Pakistan</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-6">
              Pakistan's{' '}
              <span className="text-primary relative">
                Best
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path d="M2 8C50 2 150 2 198 8" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" opacity="0.4"/>
                </svg>
              </span>{' '}
              <br />
              <span className="text-primary">SMM Panel</span>{' '}
              <br className="hidden sm:block" />
              Provider
            </h1>

            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
              Welcome to <strong className="text-foreground">DM Social Panel</strong> — your go-to destination for high-quality, 
              cheapest social media marketing services at unbeatable prices for Instagram, TikTok, YouTube, Facebook, and more.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/dashboard">
                <Button size="lg" className="font-heading font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all px-8">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" size="lg" className="font-heading font-semibold px-8">
                  View Services
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-6 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="flex -space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="font-medium">4.9/5</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <span>23K+ Active Users</span>
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=600&fit=crop&crop=center"
                alt="Social Media Marketing"
                className="rounded-3xl shadow-2xl w-full max-w-md mx-auto object-cover aspect-square"
              />
              {/* Floating Cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-card rounded-2xl shadow-xl p-4 border border-border/50"
              >
                <div className="text-2xl font-heading font-bold text-primary">120K+</div>
                <div className="text-xs text-muted-foreground font-medium">Orders Completed</div>
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                className="absolute -bottom-4 -left-4 bg-card rounded-2xl shadow-xl p-4 border border-border/50"
              >
                <div className="text-2xl font-heading font-bold text-primary">735+</div>
                <div className="text-xs text-muted-foreground font-medium">Active Services</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}