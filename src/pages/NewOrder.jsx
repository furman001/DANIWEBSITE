import React, { useState, useMemo } from 'react';
import { supabase, TABLES } from '@/api/supabaseClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Link as LinkIcon, Hash, DollarSign, AlertCircle, CheckCircle2, Loader2
} from 'lucide-react';

export default function NewOrder() {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const urlParams = new URLSearchParams(window.location.search);
  const preselectedServiceId = urlParams.get('service');

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState(preselectedServiceId || '');
  const [link, setLink] = useState('');
  const [quantity, setQuantity] = useState('');

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(TABLES.SERVICES)
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(500);
      if (error) throw error;
      return data || [];
    },
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['my-transactions', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(TABLES.WALLET_TRANSACTIONS)
        .select('*')
        .eq('user_id', session?.user?.id)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      return data || [];
    },
    enabled: !!session?.user?.id,
  });

  const walletBalance = user?.wallet_balance || 0;

  const categories = useMemo(() => {
    const cats = [...new Set(services.filter(s => s.is_active !== false).map(s => s.category || 'Other'))];
    return cats.sort();
  }, [services]);

  const filteredServices = useMemo(() => {
    return services.filter(s =>
      s.is_active !== false &&
      (selectedCategory ? (s.category || 'Other') === selectedCategory : true)
    );
  }, [services, selectedCategory]);

  const selectedService = services.find(s => s.id === selectedServiceId);

  const totalCost = selectedService && quantity
    ? (selectedService.rate_per_1000 / 1000) * Number(quantity)
    : 0;

  const createOrder = useMutation({
    mutationFn: async () => {
      if (!selectedService) throw new Error('Select a service');
      if (!link.trim()) throw new Error('Enter a link');
      if (!quantity || Number(quantity) < (selectedService.min_quantity || 10)) {
        throw new Error(`Minimum quantity is ${selectedService.min_quantity || 10}`);
      }
      if (Number(quantity) > (selectedService.max_quantity || 1000000)) {
        throw new Error(`Maximum quantity is ${selectedService.max_quantity || 1000000}`);
      }
      if (totalCost > walletBalance) throw new Error('Insufficient balance. Please add funds.');

      // Create deduction transaction
      const { error: txError } = await supabase.from(TABLES.WALLET_TRANSACTIONS).insert({
        user_id: session?.user?.id,
        type: 'deduction',
        amount: totalCost,
        method: 'system',
        status: 'approved',
        reference: `Order for ${selectedService.name}`,
        balance_after: walletBalance - totalCost,
      });
      if (txError) throw txError;

      // Create order record
      const { data: order, error: orderError } = await supabase.from(TABLES.ORDERS).insert({
        order_number: `ORD-${Date.now()}`,
        user_id: session?.user?.id,
        service_id: selectedService.service_id,
        service_name: selectedService.name,
        platform: selectedService.platform,
        link: link.trim(),
        quantity: Number(quantity),
        amount: totalCost,
        status: 'pending',
        remains: Number(quantity),
        retry_count: 0,
      }).select().single();
      if (orderError) throw orderError;

      // Call SMM Panel API
      let panelResult = null;
      try {
        const formData = new URLSearchParams();
        formData.append('key', '1f881bf3954b1d4bd6bad99d3944abef6085c169');
        formData.append('action', 'add');
        formData.append('service', selectedService.service_id || selectedService.id);
        formData.append('link', link.trim());
        formData.append('quantity', String(Number(quantity)));

        const response = await fetch('https://www.paksmmportal.com/api/v2', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString(),
        });
        panelResult = await response.json();
      } catch (e) {
        panelResult = { error: e.message };
      }

      // Update order with panel response
      const updateData = panelResult?.order ? {
        panel_order_id: String(panelResult.order),
        panel_status: 'In progress',
        panel_response: JSON.stringify(panelResult),
        panel_submitted_at: new Date().toISOString(),
        status: 'in_progress',
      } : {
        panel_error: panelResult?.error || 'No order ID returned from panel',
        panel_response: JSON.stringify(panelResult),
        panel_submitted_at: new Date().toISOString(),
        status: 'admin_review',
      };

      await supabase.from(TABLES.ORDERS).update(updateData).eq('id', order.id);

      return order;
    },
    onSuccess: () => {
      toast.success('✅ Order placed & submitted to panel!');
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      queryClient.invalidateQueries({ queryKey: ['my-transactions'] });
      navigate('/orders');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to place order');
    },
  });

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold">Place New Order</h1>
        <p className="text-muted-foreground mt-1">Select a service and enter your details.</p>
      </div>

      {/* Balance Card */}
      <Card className="mb-6 border-primary/20 bg-primary/5">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Available Balance</p>
              <p className="font-heading font-bold text-lg">Rs {walletBalance.toFixed(0)}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/add-funds')} className="text-xs">
            Add Funds
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="font-heading flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            Order Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Category */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Category</Label>
            <Select value={selectedCategory} onValueChange={(val) => {
              setSelectedCategory(val);
              setSelectedServiceId('');
            }}>
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Service */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Service</Label>
            <Select value={selectedServiceId} onValueChange={setSelectedServiceId}>
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder="Select service" />
              </SelectTrigger>
              <SelectContent>
                {filteredServices.map(s => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name} — Rs {s.rate_per_1000}/1K
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Service Info */}
          {selectedService && (
            <div className="bg-muted/50 rounded-xl p-4 text-sm space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rate per 1000</span>
                <span className="font-semibold">Rs {selectedService.rate_per_1000}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Min / Max</span>
                <span>{selectedService.min_quantity || 10} — {(selectedService.max_quantity || 1000000).toLocaleString()}</span>
              </div>
              {selectedService.avg_time && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Time</span>
                  <span>{selectedService.avg_time}</span>
                </div>
              )}
              {selectedService.description && (
                <p className="text-xs text-muted-foreground pt-2 border-t border-border/50">
                  {selectedService.description}
                </p>
              )}
            </div>
          )}

          {/* Link */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Link</Label>
            <div className="relative">
              <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Enter your profile or post link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="pl-10 h-11 rounded-xl"
              />
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Quantity</Label>
            <div className="relative">
              <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="number"
                placeholder={`Min: ${selectedService?.min_quantity || 10}`}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="pl-10 h-11 rounded-xl"
              />
            </div>
          </div>

          {/* Total */}
          {totalCost > 0 && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
              <span className="font-medium">Total Cost</span>
              <span className="font-heading text-xl font-bold text-primary">Rs {totalCost.toFixed(2)}</span>
            </div>
          )}

          {totalCost > walletBalance && totalCost > 0 && (
            <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-3 flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              Insufficient balance. Please add funds first.
            </div>
          )}

          <Button
            onClick={() => createOrder.mutate()}
            disabled={!selectedService || !link || !quantity || totalCost > walletBalance || createOrder.isPending}
            className="w-full h-12 rounded-xl font-heading font-semibold text-base shadow-lg shadow-primary/25"
          >
            {createOrder.isPending ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
            ) : (
              <><CheckCircle2 className="w-4 h-4 mr-2" /> Place Order</>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}