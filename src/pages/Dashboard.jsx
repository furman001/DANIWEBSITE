import React from 'react';
import { supabase, TABLES } from '@/api/supabaseClient';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { RefreshCw, Zap, TrendingUp, Calendar, ArrowUpRight, ShieldCheck, Bell, Activity } from 'lucide-react';
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
    <div className="space-y-10 animate-reveal">
      {/* Top Status Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-3 bg-card border border-border/50 rounded-full premium-shadow">
         <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
               {[1,2,3].map(i => (
                 <div key={i} className="w-6 h-6 rounded-full border-2 border-background bg-primary/20" />
               ))}
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
               <span className="text-green-500">234</span> users active right now
            </p>
         </div>
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <Activity className="w-3 h-3 text-primary" />
               <span className="text-[10px] font-bold uppercase tracking-widest">System API: <span className="text-green-500">Stable</span></span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
               <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Live Sync On</span>
            </div>
         </div>
      </div>

      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-[3rem] bg-slate-950 p-10 sm:p-16 shadow-2xl shadow-black/20 group">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -mr-48 -mt-48 group-hover:bg-primary/20 transition-colors duration-700" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -ml-32 -mb-32" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
            >
              <Zap className="w-3.5 h-3.5 text-primary fill-current" />
              <span className="text-[10px] font-black text-white/80 uppercase tracking-[0.2em]">{greeting}, {user?.name?.split(' ')[0] || 'Member'}</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-heading text-5xl sm:text-7xl font-black text-white tracking-tighter leading-none"
            >
              Command <br />
              <span className="text-primary italic">Center</span>.
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center gap-8"
            >
              <div className="flex items-center gap-2 text-white/40">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">{format(new Date(), 'EEEE, MMMM do')}</span>
              </div>
              <div className="flex items-center gap-2 text-primary">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Growth Engine Active</span>
              </div>
            </motion.div>
          </div>

          <div className="flex items-center gap-4">
             <Button 
                onClick={handleRefresh} 
                disabled={isLoading}
                className="h-16 px-10 rounded-2xl bg-white text-slate-950 hover:bg-white/90 font-black text-lg shadow-2xl transition-all active:scale-95"
             >
                <RefreshCw className={`w-5 h-5 mr-3 ${isLoading ? 'animate-spin' : ''}`} />
                REFRESH
             </Button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-4 gap-10">
        {/* Stats Column */}
        <div className="lg:col-span-3 space-y-12">
          <StatsGrid
            walletBalance={walletBalance}
            orders={orders}
            transactions={transactions}
            isLoading={isLoading}
          />
          
          <QuickActions />

          <div className="grid md:grid-cols-2 gap-10">
            <div className="premium-card rounded-[3rem] bg-card p-10">
              <div className="flex items-center justify-between mb-10">
                 <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-primary rounded-full" />
                    <h3 className="font-heading font-black text-xl tracking-tight uppercase">Spending</h3>
                 </div>
                 <div className="flex items-center gap-2 text-green-500 font-bold text-[10px] uppercase tracking-widest bg-green-500/10 px-3 py-1 rounded-full">
                    <ArrowUpRight className="w-3 h-3" />
                    +12% Efficiency
                 </div>
              </div>
              {/* <SpendingChart orders={orders} /> */}
            </div>

            <div className="premium-card rounded-[3rem] bg-card p-10">
               <div className="flex items-center gap-3 mb-10">
                  <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                  <h3 className="font-heading font-black text-xl tracking-tight uppercase">Platform Mix</h3>
               </div>
               {/* <PlatformBreakdown orders={orders} /> */}
            </div>
          </div>

          <div className="premium-card rounded-[3rem] bg-card p-10">
             <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                   <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                   <h3 className="font-heading font-black text-xl tracking-tight uppercase">Real-time Activity</h3>
                </div>
                <div className="flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Streaming Live</span>
                </div>
             </div>
             <LiveOrderTracker orders={orders} isLoading={isLoading} />
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-10 sticky top-28">
          {/* <AIInsights
            orders={orders}
            walletBalance={walletBalance}
            transactions={transactions}
          /> */}
          
          {/* Security Card */}
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/30 transition-colors duration-500" />
             <div className="relative z-10 space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                   <ShieldCheck className="w-7 h-7 text-primary" />
                </div>
                <div>
                   <h4 className="font-heading font-black text-2xl mb-2 tracking-tight uppercase leading-none">Safe Core</h4>
                   <p className="text-white/40 text-xs font-bold leading-relaxed uppercase tracking-widest">Enterprise grade encryption active.</p>
                </div>
                <Button className="w-full bg-primary text-white font-black uppercase text-[10px] tracking-[0.2em] h-12 rounded-xl shadow-xl shadow-primary/20">System Integrity: OK</Button>
             </div>
          </div>

          <div className="p-8 rounded-[3rem] border-2 border-dashed border-border/50 flex flex-col items-center text-center space-y-4 group hover:border-primary/30 transition-colors">
             <Bell className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">No new notifications</p>
          </div>
        </div>
      </div>
    </div>
  );
}