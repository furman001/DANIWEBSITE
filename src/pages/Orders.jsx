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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Logistics Console</span>
           </div>
           <h1 className="font-heading text-3xl sm:text-4xl font-black tracking-tight leading-none">Campaign <span className="text-primary italic">History</span>.</h1>
           <p className="text-muted-foreground font-medium mt-2">Manage and monitor all your active growth deployments.</p>
        </div>
        <Button 
          variant="outline" 
          size="lg" 
          onClick={() => refetch()} 
          disabled={isFetching} 
          className="h-14 px-8 rounded-2xl premium-shadow font-bold gap-3"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          {isFetching ? 'Syncing System...' : 'Refresh Status'}
        </Button>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-4 p-4 bg-card border border-border/50 rounded-[2rem] premium-shadow">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search orders, IDs, or links..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 h-14 rounded-2xl bg-muted/30 border-transparent focus:bg-background focus:border-primary/20 transition-all font-bold text-sm"
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
                  <div className="premium-card bg-card p-6 sm:p-8 rounded-[2.5rem] relative overflow-hidden group">
                    <div className={`absolute top-0 left-0 w-2 h-full ${sc.color.split(' ')[0]}`} />
                    
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                       <div className="flex-1 min-w-0 space-y-4">
                          <div className="flex flex-wrap items-center gap-3">
                             <div className="px-3 py-1 rounded-lg bg-primary/5 border border-primary/10 text-[10px] font-black text-primary">
                                #{order.order_number}
                             </div>
                             <Badge variant="outline" className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${sc.color} border-transparent shadow-sm`}>
                                <StatusIcon className={`w-3 h-3 mr-2 ${order.status === 'in_progress' ? 'animate-spin' : ''}`} />
                                {sc.label}
                             </Badge>
                             <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                {order.created_at ? format(new Date(order.created_at), 'MMM d, yyyy • HH:mm') : '—'}
                             </div>
                          </div>

                          <h3 className="font-heading font-black text-xl tracking-tight leading-tight group-hover:text-primary transition-colors">
                             {order.service_name}
                          </h3>

                          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                             <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                                <div className="text-xs font-bold uppercase tracking-tight">Quantity: <span className="text-foreground">{order.quantity?.toLocaleString()}</span></div>
                             </div>
                             <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                <div className="text-xs font-bold uppercase tracking-tight">Remains: <span className="text-foreground">{order.remains?.toLocaleString() || 0}</span></div>
                             </div>
                             {order.panel_order_id && (
                                <div className="flex items-center gap-2">
                                   <ExternalLink className="w-4 h-4 text-blue-500" />
                                   <div className="text-xs font-bold uppercase tracking-tight text-blue-500">Panel Reference: {order.panel_order_id}</div>
                                </div>
                             )}
                          </div>

                          <div className="pt-4 flex items-center gap-3">
                             <div className="p-2 rounded-lg bg-muted/50">
                                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                             </div>
                             <p className="text-xs font-bold text-muted-foreground truncate italic group-hover:text-foreground transition-colors">{order.link}</p>
                          </div>
                       </div>

                       <div className="lg:text-right space-y-3 shrink-0">
                          <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Investment Value</div>
                          <div className="text-3xl font-black tracking-tighter text-foreground">Rs {order.amount?.toLocaleString()}</div>
                          <Button size="sm" variant="ghost" className="rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 hover:text-primary">
                             View Node Data
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