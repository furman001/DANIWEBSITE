import React, { useState } from 'react';
import { supabase, TABLES } from '@/api/supabaseClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  approved: 'bg-green-500/10 text-green-600 border-green-500/20',
  rejected: 'bg-red-500/10 text-red-600 border-red-500/20',
};

export default function AdminFunds() {
  const [filter, setFilter] = useState('pending');
  const queryClient = useQueryClient();

  const { data: txns = [], isLoading } = useQuery({
    queryKey: ['admin-funds', filter],
    queryFn: async () => {
      let query = supabase.from(TABLES.WALLET_TRANSACTIONS).select('*').eq('type', 'deposit');
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
      const { error } = await supabase.from(TABLES.WALLET_TRANSACTIONS).update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Transaction updated');
      queryClient.invalidateQueries({ queryKey: ['admin-funds'] });
    },
  });

  return (
    <div>
      <div className="flex gap-3 mb-5">
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
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold">Rs {txn.amount?.toFixed(0)}</p>
                    <Badge variant="outline" className={`text-[10px] ${statusColors[txn.status] || ''}`}>{txn.status}</Badge>
                    <Badge variant="outline" className="text-[10px]">{txn.method}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
                    <span>{txn.created_by}</span>
                    {txn.reference && <span>Ref: {txn.reference}</span>}
                    {txn.notes && <span>{txn.notes}</span>}
                    <span>{txn.created_date ? format(new Date(txn.created_date), 'MMM d, HH:mm') : '—'}</span>
                  </div>
                </div>
                {txn.status === 'pending' && (
                  <div className="flex gap-2 flex-shrink-0">
                    <Button size="sm" className="h-8 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs" onClick={() => updateTxn.mutate({ id: txn.id, status: 'approved' })}>
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />Approve
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 text-destructive border-destructive/30 hover:bg-destructive/10 rounded-lg text-xs" onClick={() => updateTxn.mutate({ id: txn.id, status: 'rejected' })}>
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