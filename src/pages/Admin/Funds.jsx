import React, { useState, useEffect, useRef } from 'react';
import { supabase, TABLES } from '@/api/supabaseClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { CheckCircle2, XCircle, Clock, Bell, User as UserIcon, Mail } from 'lucide-react';
import { toast } from 'sonner';

const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  approved: 'bg-green-500/10 text-green-600 border-green-500/20',
  rejected: 'bg-red-500/10 text-red-600 border-red-500/20',
};

export default function AdminFunds() {
  const [filter, setFilter] = useState('pending');
  const queryClient = useQueryClient();
  const isFirstLoad = useRef(true);

  // ── Real-time subscription: auto-refresh when any deposit changes ──
  useEffect(() => {
    const channel = supabase
      .channel('admin-wallet-txns')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: TABLES.WALLET_TRANSACTIONS },
        (payload) => {
          if (payload.eventType === 'INSERT' && payload.new?.type === 'deposit') {
            if (!isFirstLoad.current) {
              toast('💰 New deposit request!', {
                description: `Rs ${payload.new.amount} via ${payload.new.method} — waiting for approval`,
                duration: 8000,
              });
            }
          }
          isFirstLoad.current = false;
          queryClient.invalidateQueries({ queryKey: ['admin-funds'] });
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [queryClient]);

  const { data: txns = [], isLoading } = useQuery({
    queryKey: ['admin-funds', filter],
    queryFn: async () => {
      let query = supabase
        .from(TABLES.WALLET_TRANSACTIONS)
        .select('*, users:user_id(name, email)')
        .eq('type', 'deposit');
      if (filter !== 'all') {
        query = query.eq('status', filter);
      }
      const { data, error } = await query.order('created_at', { ascending: false }).limit(200);
      if (error) throw error;
      return data || [];
    },
  });

  const updateTxn = useMutation({
    mutationFn: async ({ id, status }) => {
      // Atomic RPC: status update + balance credit/debit happen in a single DB transaction.
      // Idempotent: re-clicking Approve won't double-credit.
      const fnName = status === 'approved' ? 'approve_deposit' : 'reject_deposit';
      const { data, error } = await supabase.rpc(fnName, { txn_id: id });
      if (error) throw error;
      return data;
    },
    onSuccess: (data, vars) => {
      if (data?.status === 'already_approved') {
        toast.info('Already approved — no double credit applied.');
      } else if (data?.status === 'already_rejected') {
        toast.info('Already rejected.');
      } else {
        toast.success(vars.status === 'approved' ? '✅ Approved & balance credited!' : '❌ Transaction rejected');
      }
      queryClient.invalidateQueries({ queryKey: ['admin-funds'] });
      queryClient.invalidateQueries({ queryKey: ['my-transactions'] });
    },
    onError: (err) => {
      toast.error(err.message || 'Action failed');
    },
  });

  const pendingCount = txns.filter(t => t.status === 'pending').length;

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-44 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Deposits</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        {filter === 'pending' && pendingCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
            <Bell className="w-3.5 h-3.5 text-yellow-600 animate-pulse" />
            <span className="text-xs font-bold text-yellow-600">{pendingCount} pending</span>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
      ) : txns.length === 0 ? (
        <Card className="p-10 text-center border-border/50">
          <Clock className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No deposit requests found.</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {txns.map(txn => (
            <Card key={txn.id} className="border-border/50">
              <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  {/* Depositor identity */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-[11px] font-black uppercase shadow-sm">
                      {(txn.users?.name?.[0] || txn.users?.email?.[0] || '?').toUpperCase()}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold truncate">{txn.users?.name || 'Unknown user'}</span>
                      <span className="text-[11px] text-muted-foreground truncate">{txn.users?.email || txn.user_id}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold">Rs {txn.amount?.toFixed(0)}</p>
                    <Badge variant="outline" className={`text-[10px] ${statusColors[txn.status] || ''}`}>{txn.status}</Badge>
                    <Badge variant="outline" className="text-[10px]">{txn.method}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
                    {txn.reference && <span>Ref: {txn.reference}</span>}
                    <span>{txn.created_at ? format(new Date(txn.created_at), 'MMM d, HH:mm') : '—'}</span>
                  </div>
                </div>
                {txn.status === 'pending' && (
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      className="h-8 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs"
                      disabled={updateTxn.isPending}
                      onClick={() => updateTxn.mutate({ id: txn.id, status: 'approved' })}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-destructive border-destructive/30 hover:bg-destructive/10 rounded-lg text-xs"
                      disabled={updateTxn.isPending}
                      onClick={() => updateTxn.mutate({ id: txn.id, status: 'rejected' })}
                    >
                      <XCircle className="w-3.5 h-3.5 mr-1" />Reject
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}