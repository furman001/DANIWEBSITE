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
import { Search, Package, Clock, CheckCircle2, XCircle, AlertTriangle, Loader2, ShieldAlert, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20', icon: Clock },
  in_progress: { label: 'Processing', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: Loader2 },
  completed: { label: 'Completed', color: 'bg-green-500/10 text-green-600 border-green-500/20', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', color: 'bg-red-500/10 text-red-600 border-red-500/20', icon: XCircle },
  partial: { label: 'Partial', color: 'bg-orange-500/10 text-orange-600 border-orange-500/20', icon: AlertTriangle },
  failed: { label: 'Failed', color: 'bg-red-500/10 text-red-600 border-red-500/20', icon: XCircle },
  admin_review: { label: 'Admin Review', color: 'bg-purple-500/10 text-purple-600 border-purple-500/20', icon: ShieldAlert },
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
    const matchesSearch = !search || o.service_name?.toLowerCase().includes(search.toLowerCase()) || o.order_number?.toLowerCase().includes(search.toLowerCase()) || o.link?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold">Order History</h1>
          <p className="text-muted-foreground mt-1">Track all your orders and their status.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="rounded-xl flex-shrink-0 mt-1">
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isFetching ? 'animate-spin' : ''}`} />
          {isFetching ? 'Syncing...' : 'Refresh'}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 rounded-xl"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-44 h-10 rounded-xl">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="partial">Partial</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="admin_review">Admin Review</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center border-border/50">
          <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <h3 className="font-heading font-semibold text-lg mb-1">No orders found</h3>
          <p className="text-sm text-muted-foreground">
            {orders.length === 0 ? "You haven't placed any orders yet." : "No orders match your filters."}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const sc = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = sc.icon;
            return (
              <Card key={order.id} className="border-border/50 hover:border-primary/20 transition-all">
                <div className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold truncate">{order.service_name}</p>
                        <Badge variant="outline" className={`text-[10px] ${sc.color} flex items-center gap-1 flex-shrink-0`}>
                          <StatusIcon className={`w-2.5 h-2.5 ${order.status === 'in_progress' ? 'animate-spin' : ''}`} />
                          {sc.label}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span>#{order.order_number}</span>
                        <span>Qty: {order.quantity?.toLocaleString()}</span>
                        {order.remains != null && <span>Remains: {order.remains?.toLocaleString()}</span>}
                        {order.panel_order_id && <span className="text-primary font-medium">Panel #{order.panel_order_id}</span>}
                        <span>{order.created_date ? format(new Date(order.created_date), 'MMM d, yyyy HH:mm') : '—'}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-muted-foreground truncate">{order.link}</p>
                        {order.panel_error && (
                          <span className="text-[10px] text-red-500 truncate">⚠ {order.panel_error}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-heading font-bold text-lg">Rs {order.amount?.toFixed(0)}</p>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}