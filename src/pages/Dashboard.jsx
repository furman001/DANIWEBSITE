import React from 'react';
import { supabase, TABLES } from '@/api/supabaseClient';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { RefreshCw, Zap, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

import StatsGrid from '@/components/dashboard/StatsGrid';
import SpendingChart from '@/components/dashboard/SpendingChart';
import PlatformBreakdown from '@/components/dashboard/PlatformBreakdown';
import AIInsights from '@/components/dashboard/AIInsights';
import LiveOrderTracker from '@/components/dashboard/LiveOrderTracker';
import QuickActions from '@/components/dashboard/QuickActions';

export default function Dashboard() {
  const { user, session } = useAuth();

  const { data: orders = [], isLoading: loadingOrders, refetch: refetchOrders } = useQuery({
    queryKey: ['my-orders', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(TABLES.ORDERS)
        .select('*')
        .eq('user_id', session?.user?.id)
        .order('created_at', { ascending: false })
        .limit(200);
      if (error) throw error;
      return data || [];
    },
    enabled: !!session?.user?.id,
    refetchInterval: 30000,
  });

  const { data: transactions = [], isLoading: loadingTx, refetch: refetchTx } = useQuery({
    queryKey: ['my-transactions', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(TABLES.WALLET_TRANSACTIONS)
        .select('*')
        .eq('user_id', session?.user?.id)
        .order('created_at', { ascending: false })
        .limit(200);
      if (error) throw error;
      return data || [];
    },
    enabled: !!session?.user?.id,
    refetchInterval: 30000,
  });

  const walletBalance = user?.wallet_balance || 0;
  const isLoading = loadingOrders || loadingTx;

  const handleRefresh = () => {
    refetchOrders();
    refetchTx();
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-primary p-8 sm:p-12 shadow-2xl shadow-primary/20 group">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-10 -mb-10 blur-2xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/10"
            >
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{greeting}, {user?.name?.split(' ')[0] || 'Member'}</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-heading text-4xl sm:text-5xl font-black text-white tracking-tight leading-none"
            >
              Dashboard <br className="sm:hidden" /> Overview
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center gap-6 text-white/80"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-bold uppercase tracking-wider">{format(new Date(), 'EEEE, MMM d')}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-bold uppercase tracking-wider">Account Active</span>
              </div>
            </motion.div>
          </div>

          <div className="flex items-center gap-4">
             <Button 
                onClick={handleRefresh} 
                disabled={isLoading}
                className="h-16 px-8 rounded-2xl bg-white text-primary hover:bg-white/90 font-black text-lg shadow-xl"
             >
                <RefreshCw className={`w-5 h-5 mr-3 ${isLoading ? 'animate-spin' : ''}`} />
                REFRESH
             </Button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Stats Column */}
        <div className="lg:col-span-3 space-y-8">
          <StatsGrid
            walletBalance={walletBalance}
            orders={orders}
            transactions={transactions}
            isLoading={isLoading}
          />
          
          <QuickActions />

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card rounded-[2.5rem] border border-border/50 p-8 premium-shadow">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="font-heading font-black text-xl tracking-tight uppercase">Spending Trends</h3>
                 <div className="flex items-center gap-2 text-green-500 font-bold text-xs">
                    <ArrowUpRight className="w-4 h-4" />
                    +12% vs LW
                 </div>
              </div>
              <SpendingChart orders={orders} />
            </div>

            <div className="bg-card rounded-[2.5rem] border border-border/50 p-8 premium-shadow">
               <h3 className="font-heading font-black text-xl tracking-tight uppercase mb-8">Platform Usage</h3>
               <PlatformBreakdown orders={orders} />
            </div>
          </div>

          <div className="bg-card rounded-[2.5rem] border border-border/50 p-8 premium-shadow overflow-hidden">
             <h3 className="font-heading font-black text-xl tracking-tight uppercase mb-8">Live Activity Tracker</h3>
             <LiveOrderTracker orders={orders} isLoading={isLoading} />
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <AIInsights
            orders={orders}
            walletBalance={walletBalance}
            transactions={transactions}
          />
          
          {/* Custom Info Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/30 transition-colors" />
             <div className="relative z-10">
                <ShieldCheck className="w-10 h-10 text-primary mb-6" />
                <h4 className="font-heading font-black text-xl mb-2 tracking-tight uppercase leading-none">Security Verified</h4>
                <p className="text-white/60 text-xs font-bold leading-relaxed mb-6 uppercase tracking-wider">Your account is protected by enterprise-grade encryption.</p>
                <Button className="w-full bg-primary text-white font-black uppercase rounded-xl">View Log</Button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { ShieldCheck } from 'lucide-react';