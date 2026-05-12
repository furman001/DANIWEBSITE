import React from 'react';
import { motion } from 'framer-motion';
import { Package, Users, ListChecks, Trophy } from 'lucide-react';

const stats = [
  { icon: Package, label: 'Orders Completed', value: '3,751,611', color: 'text-primary' },
  { icon: Users, label: 'Active Users', value: '23,412', color: 'text-primary' },
  { icon: ListChecks, label: 'Active Services', value: '735+', color: 'text-primary' },
  { icon: Trophy, label: 'Market Rank', value: '#1', color: 'text-primary' },
];

export default function StatsSection() {
  return (
    <section className="py-20 relative overflow-hidden bg-card">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,hsl(var(--primary)/0.03),transparent_40%)]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative group p-8 rounded-3xl bg-background border border-border/50 premium-shadow hover:border-primary/30 transition-all duration-500 overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
              
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                  <stat.icon className="w-7 h-7" />
                </div>
                
                <div className="space-y-1">
                  <motion.div 
                    initial={{ scale: 0.9 }}
                    whileInView={{ scale: 1 }}
                    className="font-heading text-3xl sm:text-4xl font-black tracking-tight"
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                    {stat.label}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}