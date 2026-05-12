import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { Wallet, Package, Clock, CheckCircle2, TrendingUp, DollarSign, ArrowUpRight } from 'lucide-react';

export default function StatsGrid({ walletBalance, orders, transactions, isLoading }) {
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'in_progress').length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const totalSpent = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
  const successRate = orders.length > 0 ? Math.round((completedOrders / orders.length) * 100) : 0;

  const stats = [
    {
      label: 'Wallet Balance',
      value: `Rs ${walletBalance.toFixed(0)}`,
      icon: Wallet,
      color: 'text-primary',
      bg: 'bg-primary/5',
      trend: 'Top Up Available',
      gradient: 'from-primary/10 to-transparent'
    },
    {
      label: 'Orders Placed',
      value: orders.length,
      icon: Package,
      color: 'text-blue-500',
      bg: 'bg-blue-500/5',
      trend: 'Lifetime Activity',
      gradient: 'from-blue-500/10 to-transparent'
    },
    {
      label: 'Processing',
      value: pendingOrders,
      icon: Clock,
      color: 'text-amber-500',
      bg: 'bg-amber-500/5',
      trend: 'Live Orders',
      gradient: 'from-amber-500/10 to-transparent'
    },
    {
      label: 'Completed',
      value: completedOrders,
      icon: CheckCircle2,
      color: 'text-green-500',
      bg: 'bg-green-500/5',
      trend: `${successRate}% Success`,
      gradient: 'from-green-500/10 to-transparent'
    },
    {
      label: 'Total Investment',
      value: `Rs ${totalSpent.toFixed(0)}`,
      icon: DollarSign,
      color: 'text-purple-500',
      bg: 'bg-purple-500/5',
      trend: 'Account Value',
      gradient: 'from-purple-500/10 to-transparent'
    },
    {
      label: 'Platform Rank',
      value: 'Elite',
      icon: TrendingUp,
      color: 'text-indigo-500',
      bg: 'bg-indigo-500/5',
      trend: 'Tier Status',
      gradient: 'from-indigo-500/10 to-transparent'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
        >
          <div className="group relative premium-card p-6 rounded-[2rem] overflow-hidden bg-card">
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="p-2 rounded-full bg-muted/50 group-hover:bg-primary/10 transition-colors">
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>

              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="font-heading text-2xl font-black tracking-tight">{stat.value}</div>
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</div>
                  </div>
                  <div className="pt-3 mt-3 border-t border-border/50">
                    <span className="text-[10px] font-bold text-primary/70 uppercase tracking-wider">{stat.trend}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}