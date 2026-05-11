import React from 'react';
import { supabase, TABLES } from '@/api/supabaseClient';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { RefreshCw, Zap } from 'lucide-react';
import { format } from 'date-fns';

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
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">Dashboard</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold">
            {greeting}, <span className="text-primary">{user?.name?.split(' ')[0] || 'User'}</span> 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {format(new Date(), 'EEEE, MMMM d yyyy')} • Auto-refreshes every 30s
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading} className="gap-1.5 mt-1">
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>

      {/* Stats */}
      <StatsGrid
        walletBalance={walletBalance}
        orders={orders}
        transactions={transactions}
        isLoading={isLoading}
      />

      {/* Quick Actions */}
      <QuickActions />

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2">
          <SpendingChart orders={orders} />
        </div>
        <div>
          <PlatformBreakdown orders={orders} />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <LiveOrderTracker orders={orders} isLoading={isLoading} />
        </div>
        <div>
          <AIInsights
            orders={orders}
            walletBalance={walletBalance}
            transactions={transactions}
          />
        </div>
      </div>
    </div>
  );
}