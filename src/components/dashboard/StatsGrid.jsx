import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { Wallet, Package, Clock, CheckCircle2, TrendingUp, DollarSign } from 'lucide-react';

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
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      trend: '+Available',
    },
    {
      label: 'Total Orders',
      value: orders.length,
      icon: Package,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      border: 'border-primary/20',
      trend: 'All time',
    },
    {
      label: 'In Progress',
      value: pendingOrders,
      icon: Clock,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      trend: 'Active now',
    },
    {
      label: 'Completed',
      value: completedOrders,
      icon: CheckCircle2,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      border: 'border-green-500/20',
      trend: `${successRate}% success rate`,
    },
    {
      label: 'Total Spent',
      value: `Rs ${totalSpent.toFixed(0)}`,
      icon: DollarSign,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      trend: 'All orders',
    },
    {
      label: 'Success Rate',
      value: `${successRate}%`,
      icon: TrendingUp,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
      trend: 'Completion rate',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
        >
          <Card className={`border ${stat.border} hover:shadow-md transition-all`}>
            <CardContent className="p-4">
              {isLoading ? (
                <Skeleton className="h-14" />
              ) : (
                <>
                  <div className={`w-8 h-8 rounded-lg ${stat.bgColor} flex items-center justify-center mb-3`}>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <div className="font-heading text-xl font-bold leading-tight">{stat.value}</div>
                  <div className="text-[10px] text-muted-foreground mt-1 font-medium uppercase tracking-wider">{stat.label}</div>
                  <div className="text-[10px] text-muted-foreground/60 mt-0.5">{stat.trend}</div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}