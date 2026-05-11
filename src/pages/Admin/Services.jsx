import React, { useState } from 'react';
import { supabase, TABLES } from '@/api/supabaseClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';

const platforms = ['tiktok','instagram','facebook','youtube','twitter','telegram','snapchat','spotify','discord','whatsapp','other'];
const empty = { name:'', category:'', platform:'tiktok', rate_per_1000:'', min_quantity:10, max_quantity:1000000, avg_time:'', description:'', is_active:true, service_id:'' };

export default function AdminServices() {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const queryClient = useQueryClient();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['admin-services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(TABLES.SERVICES)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);
      if (error) throw error;
      return data || [];
    },
  });

  const save = useMutation({
    mutationFn: async (data) => {
      if (editing) {
        const { error } = await supabase.from(TABLES.SERVICES).update(data).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(TABLES.SERVICES).insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editing ? 'Service updated' : 'Service created');
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      setOpen(false);
    },
    onError: (err) => {
      toast.error('Error: ' + err.message);
      console.error(err);
    }
  });

  const remove = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from(TABLES.SERVICES).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Service deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
    },
  });

  const openEdit = (svc) => { setEditing(svc); setForm({ ...svc }); setOpen(true); };
  const openNew = () => { setEditing(null); setForm(empty); setOpen(true); };
  const handleSubmit = () => save.mutate({ ...form, rate_per_1000: Number(form.rate_per_1000), min_quantity: Number(form.min_quantity), max_quantity: Number(form.max_quantity) });

  const filtered = services.filter(s => !search || s.name?.toLowerCase().includes(search.toLowerCase()) || s.category?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search services..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 rounded-xl" />
        </div>
        <Button onClick={openNew} className="rounded-xl"><Plus className="w-4 h-4 mr-1" />Add Service</Button>
      </div>

      <div className="space-y-2">
        {isLoading ? [...Array(5)].map((_, i) => <div key={i} className="h-16 bg-muted/50 rounded-xl animate-pulse" />) :
          filtered.map(svc => (
            <Card key={svc.id} className="border-border/50">
              <div className="p-4 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold truncate">{svc.name}</p>
                    <Badge variant="outline" className="text-[10px]">{svc.platform}</Badge>
                    {!svc.is_active && <Badge variant="outline" className="text-[10px] text-red-500">Inactive</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">{svc.category} · Rs {svc.rate_per_1000}/1K · Min {svc.min_quantity} · Max {svc.max_quantity?.toLocaleString()}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(svc)}><Pencil className="w-3.5 h-3.5" /></Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => remove.mutate(svc.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            </Card>
          ))
        }
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Service' : 'Add Service'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            {[['Service ID', 'service_id'], ['Name', 'name'], ['Category', 'category'], ['Rate/1000 (PKR)', 'rate_per_1000'], ['Min Quantity', 'min_quantity'], ['Max Quantity', 'max_quantity'], ['Avg Time', 'avg_time']].map(([label, key]) => (
              <div key={key} className="space-y-1.5">
                <Label>{label}</Label>
                <Input value={form[key] || ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="rounded-xl" />
              </div>
            ))}
            <div className="space-y-1.5">
              <Label>Platform</Label>
              <Select value={form.platform} onValueChange={v => setForm(f => ({ ...f, platform: v }))}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>{platforms.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.is_active ? 'active' : 'inactive'} onValueChange={v => setForm(f => ({ ...f, is_active: v === 'active' }))}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="rounded-xl" rows={3} />
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleSubmit} disabled={save.isPending}>{save.isPending ? 'Saving...' : 'Save'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}