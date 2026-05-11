import React, { useState } from 'react';
import { supabase, TABLES } from '@/api/supabaseClient';
import { useAuth } from '@/lib/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Search, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminUsers() {
  const { user: me } = useAuth();
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase.from(TABLES.USERS).select('*');
      if (error) throw error;
      return data || [];
    },
  });

  const updateRole = useMutation({
    mutationFn: async ({ userId, role }) => {
      const { error } = await supabase.from(TABLES.USERS).update({ role }).eq('id', userId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Role updated');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  const filtered = users.filter(u => !search || u.email?.toLowerCase().includes(search.toLowerCase()) || u.full_name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search users by name or email..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 rounded-xl" />
      </div>

      {isLoading ? (
        <div className="space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-muted/50 rounded-xl animate-pulse" />)}</div>
      ) : (
        <div className="space-y-2">
          {filtered.map(u => (
            <Card key={u.id} className="border-border/50">
              <div className="p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{u.full_name || 'No Name'}</p>
                  <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                </div>
                <Badge variant="outline" className={u.role === 'admin' ? 'bg-primary/10 text-primary border-primary/20 text-[10px]' : 'text-[10px]'}>
                  {u.role === 'admin' ? <><CheckCircle2 className="w-3 h-3 mr-1" />Admin</> : 'User'}
                </Badge>
                {u.id !== me?.id ? (
                  <Select value={u.role || 'user'} onValueChange={role => updateRole.mutate({ userId: u.id, role })}>
                    <SelectTrigger className="w-32 h-8 text-xs rounded-lg flex-shrink-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Set as User</SelectItem>
                      <SelectItem value="admin">Set as Admin</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="text-xs text-muted-foreground italic flex-shrink-0">(You)</span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}