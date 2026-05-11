import React from 'react';
import { motion } from 'framer-motion';
import { Package, Users, ListChecks, Trophy } from 'lucide-react';

const stats = [
  { icon: Package, label: 'Orders Completed', value: '3,751,611', color: 'text-primary' },
  { icon: Users, label: 'Active Users', value: '23K+', color: 'text-green-500' },
  { icon: ListChecks, label: 'Active Services', value: '735', color: 'text-purple-500' },
  { icon: Trophy, label: 'World Position', value: '#1', color: 'text-yellow-500' },
];

export default function StatsSection() {
  return (
    <section className="py-12 bg-card border-y border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-muted mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="font-heading text-2xl sm:text-3xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}