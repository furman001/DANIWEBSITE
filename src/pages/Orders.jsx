import React, { useState, useEffect } from 'react';
import { supabase, TABLES } from '@/api/supabaseClient';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/AuthContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Search, Package, Clock, CheckCircle2, XCircle, AlertTriangle, Loader2, ShieldAlert, RefreshCw, ExternalLink, Zap, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20', icon: Clock },
  in_progress: { label: 'Processing', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: Loader2 },
  completed: { label: 'Completed', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', color: 'bg-rose-500/10 text-rose-600 border-rose-500/20', icon: XCircle },
  partial: { label: 'Partial', color: 'bg-orange-500/10 text-orange-600 border-orange-500/20', icon: AlertTriangle },
  failed: { label: 'Failed', color: 'bg-red-500/10 text-red-600 border-red-500/20', icon: XCircle },
  admin_review: { label: 'Reviewing', color: 'bg-purple-500/10 text-purple-600 border-purple-500/20', icon: ShieldAlert },
};

export default function Orders() {
  const { session } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: orders = [], isLoading, refetch, isFetching } = useQuery({
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
    refetchInterval: 60 * 1000,
  });

  const filtered = orders.filter(o => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesSearch = !search || 
      o.service_name?.toLowerCase().includes(search.toLowerCase()) || 
      o.order_number?.toLowerCase().includes(search.toLowerCase()) || 
      o.link?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[3rem] bg-slate-950 p-6 sm:p-12 lg:p-16 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-48 -mt-48" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary/20 border border-primary/30 mb-3 sm:mb-6">
              <Package className="w-3 h-3 text-primary" />
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-primary">Logistics Console</span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-none">
              Campaign <span className="text-primary italic">History</span>.
            </h1>
          </div>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => refetch()} 
            disabled={isFetching} 
            className="w-full sm:w-auto h-12 sm:h-16 px-6 sm:px-10 rounded-2xl bg-white text-slate-950 hover:bg-white/90 font-black text-sm sm:text-lg shadow-2xl transition-all active:scale-95"
          >
            <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 ${isFetching ? 'animate-spin' : ''}`} />
            {isFetching ? 'Syncing System...' : 'Refresh Status'}
          </Button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-4 p-4 bg-card border border-border/50 rounded-[2rem] premium-shadow">
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search orders, IDs, or links..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 h-12 sm:h-14 rounded-2xl bg-card border-border/50 text-sm font-bold"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full lg:w-64 h-14 rounded-2xl bg-muted/30 border-transparent font-bold">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <SelectValue placeholder="All Status" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="partial">Partial</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="admin_review">Reviewing</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders View */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-32 rounded-[2rem]" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-20 text-center bg-card rounded-[3rem] border border-dashed border-border/50">
          <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
             <Package className="w-8 h-8 text-muted-foreground/30" />
          </div>
          <h3 className="font-heading font-black text-xl uppercase tracking-tight mb-2">Null Set</h3>
          <p className="text-muted-foreground font-medium">
            {orders.length === 0 ? "You haven't initialized any campaigns yet." : "No deployments match your current query."}
          </p>
          {orders.length === 0 && (
             <Button className="mt-8 rounded-full h-12 px-10" asChild>
                <a href="/new-order">Initialize First Order</a>
             </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((order, idx) => {
              const sc = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = sc.icon;
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div key={order.id} className="group relative bg-card border border-border/50 rounded-2xl sm:rounded-[2.5rem] overflow-hidden hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 p-5 sm:p-10">
                    <div className={`absolute top-0 left-0 w-2 h-full ${sc.color.split(' ')[0]}`} />
                    
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-8">
                       <div className="flex-1 min-w-0 space-y-2 sm:space-y-4">
                          <div className="flex flex-wrap items-center gap-2">
                             <div className="px-2.5 py-1 rounded-lg bg-primary/5 border border-primary/10 text-[10px] font-black text-primary">
                                #{order.order_number}
                             </div>
                             <Badge variant="outline" className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${sc.color} border-transparent shadow-sm`}>
                                <StatusIcon className={`w-3 h-3 mr-1.5 ${order.status === 'in_progress' ? 'animate-spin' : ''}`} />
                                {sc.label}
                             </Badge>
                             <div className="text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                {order.created_at ? format(new Date(order.created_at), 'MMM d • HH:mm') : '—'}
                             </div>
                          </div>

                          <h3 className="font-heading font-black text-base sm:text-xl tracking-tight leading-tight group-hover:text-primary transition-colors">
                             {order.service_name}
                          </h3>

                          <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-8 gap-y-1 sm:gap-y-3">
                             <div className="flex items-center gap-1.5">
                                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                <div className="text-[10px] sm:text-xs font-bold uppercase tracking-tight">Qty: <span className="text-foreground">{order.quantity?.toLocaleString()}</span></div>
                             </div>
                             <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                <div className="text-[10px] sm:text-xs font-bold uppercase tracking-tight">Remains: <span className="text-foreground">{order.remains?.toLocaleString() || 0}</span></div>
                             </div>
                             {order.panel_order_id && (
                                <div className="flex items-center gap-1.5">
                                   <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
                                   <div className="text-[10px] sm:text-xs font-bold uppercase tracking-tight text-blue-500">Panel #{order.panel_order_id}</div>
                                </div>
                             )}
                          </div>

                          <div className="pt-1 sm:pt-4 flex items-center gap-2">
                             <div className="p-1.5 rounded-lg bg-muted/50 flex-shrink-0">
                                <ExternalLink className="w-3 h-3 text-muted-foreground" />
                             </div>
                             <p className="text-[10px] sm:text-xs font-bold text-muted-foreground truncate italic group-hover:text-foreground transition-colors">{order.link}</p>
                          </div>
                       </div>

                       <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-2 sm:gap-3 shrink-0">
                          <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] hidden lg:block">Investment Value</div>
                          <div className="text-xl sm:text-3xl font-black tracking-tighter text-foreground">Rs {order.amount?.toLocaleString()}</div>
                          <Button size="sm" variant="ghost" className="rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 hover:text-primary h-8">
                             Details
                          </Button>
                       </div>
                    </div>

                    {order.panel_error && (
                       <div className="mt-6 p-4 rounded-2xl bg-destructive/5 border border-destructive/10 flex items-center gap-3 text-destructive">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Protocol Error: {order.panel_error}</span>
                       </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}