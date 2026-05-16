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
  ShoppingCart, Link as LinkIcon, Hash, DollarSign, AlertCircle, CheckCircle2, Loader2, Zap, Sparkles, ShieldCheck, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
      if (!link.trim()) throw new Error('Enter a valid target link');
      if (!quantity || Number(quantity) < (selectedService.min_quantity || 10)) {
        throw new Error(`Minimum requirement: ${selectedService.min_quantity || 10} units`);
      }
      if (Number(quantity) > (selectedService.max_quantity || 1000000)) {
        throw new Error(`Maximum limit: ${selectedService.max_quantity || 1000000} units`);
      }
      if (totalCost > walletBalance) throw new Error('Insufficient liquidity. Please top up your wallet.');

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

      // Call SMM Panel API (Simulated for this tool, real logic remains)
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

      const updateData = panelResult?.order ? {
        panel_order_id: String(panelResult.order),
        panel_status: 'In progress',
        panel_response: JSON.stringify(panelResult),
        panel_submitted_at: new Date().toISOString(),
        status: 'in_progress',
      } : {
        panel_error: panelResult?.error || 'System Latency: Admin Review Required',
        panel_response: JSON.stringify(panelResult),
        panel_submitted_at: new Date().toISOString(),
        status: 'admin_review',
      };

      await supabase.from(TABLES.ORDERS).update(updateData).eq('id', order.id);
      return order;
    },
    onSuccess: () => {
      toast.success('Campaign Initialized Successfully!');
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      queryClient.invalidateQueries({ queryKey: ['my-transactions'] });
      navigate('/orders');
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return (
    <div className="max-w-4xl mx-auto pb-24 space-y-10">
      {/* Header */}
      <div className="text-center space-y-4">
         <motion.div 
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
         >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">New Deployment</span>
         </motion.div>
         <h1 className="font-heading text-4xl sm:text-5xl font-black tracking-tight leading-none">Initialize <span className="text-primary italic">Growth</span>.</h1>
         <p className="text-muted-foreground font-medium max-w-lg mx-auto">Select your target parameters and launch your social campaign in seconds.</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6 sm:gap-10 items-start">
         {/* Form Area */}
         <div className="lg:col-span-3 space-y-6 sm:space-y-8">
            <div className="premium-card bg-card p-5 sm:p-10 rounded-2xl sm:rounded-[3rem]">
               <div className="space-y-6 sm:space-y-10">
                  <div className="space-y-4 sm:space-y-6">
                     <div className="flex items-center gap-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                           <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                        </div>
                        <h2 className="font-heading font-black text-base sm:text-xl tracking-tight uppercase">Service Config</h2>
                     </div>

                     <div className="grid gap-6">
                        <div className="space-y-3">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Market Category</Label>
                          <Select value={selectedCategory} onValueChange={(val) => {
                            setSelectedCategory(val);
                            setSelectedServiceId('');
                          }}>
                            <SelectTrigger className="h-14 rounded-2xl bg-muted/30 border-transparent focus:ring-2 focus:ring-primary/20 transition-all font-bold">
                              <SelectValue placeholder="Select platform category" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl">
                              {categories.map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Service Solution</Label>
                          <Select value={selectedServiceId} onValueChange={setSelectedServiceId}>
                            <SelectTrigger className="h-14 rounded-2xl bg-muted/30 border-transparent focus:ring-2 focus:ring-primary/20 transition-all font-bold">
                              <SelectValue placeholder="Select specific service" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl">
                              {filteredServices.map(s => (
                                <SelectItem key={s.id} value={s.id}>
                                  <div className="flex flex-col py-1">
                                     <span className="font-bold">{s.name}</span>
                                     <span className="text-[10px] text-primary/70 font-black uppercase">Rs {s.rate_per_1000}/1K</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                     <div className="flex items-center gap-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                           <LinkIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                        </div>
                        <h2 className="font-heading font-black text-base sm:text-xl tracking-tight uppercase">Target Parameters</h2>
                     </div>

                     <div className="grid gap-6">
                        <div className="space-y-3">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Deployment URL / Link</Label>
                          <div className="relative group">
                            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                              placeholder="https://..."
                              value={link}
                              onChange={(e) => setLink(e.target.value)}
                              className="pl-11 h-14 rounded-2xl bg-muted/30 border-transparent focus:bg-background focus:border-primary/20 transition-all font-bold"
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Units / Quantity</Label>
                          <div className="relative group">
                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                              type="number"
                              placeholder={`Range: ${selectedService?.min_quantity || '—'} to ${selectedService?.max_quantity?.toLocaleString() || '—'}`}
                              value={quantity}
                              onChange={(e) => setQuantity(e.target.value)}
                              className="pl-11 h-14 rounded-2xl bg-muted/30 border-transparent focus:bg-background focus:border-primary/20 transition-all font-bold"
                            />
                          </div>
                        </div>
                     </div>
                  </div>

                  {/* Mobile cost strip — visible only on mobile */}
                  {selectedService && quantity && (
                     <div className="lg:hidden flex items-center justify-between p-4 rounded-2xl bg-slate-950 text-white">
                        <div>
                           <div className="text-[9px] font-black uppercase tracking-widest text-white/40">Total Cost</div>
                           <div className="text-xl font-black text-primary">Rs {totalCost.toFixed(2)}</div>
                        </div>
                        <div className="text-right">
                           <div className="text-[9px] font-black uppercase tracking-widest text-white/40">Balance After</div>
                           <div className={`text-sm font-black ${totalCost > walletBalance ? 'text-destructive' : 'text-white/70'}`}>Rs {(walletBalance - totalCost).toFixed(0)}</div>
                        </div>
                     </div>
                  )}

                  <Button
                    onClick={() => createOrder.mutate()}
                    disabled={!selectedService || !link || !quantity || totalCost > walletBalance || createOrder.isPending}
                    className="w-full h-12 sm:h-16 rounded-2xl sm:rounded-[2rem] font-heading font-black text-sm sm:text-lg uppercase tracking-wider shadow-2xl shadow-primary/30 transition-all active:scale-95 group"
                  >
                    {createOrder.isPending ? (
                      <><Loader2 className="w-5 h-5 mr-3 animate-spin" /> Finalizing Node...</>
                    ) : (
                      <><Zap className="w-5 h-5 mr-3 fill-current" /> Initialize Deployment <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </Button>
               </div>
            </div>
         </div>

         {/* Stats Sidebar — hidden on mobile (cost shown inline above) */}
         <div className="hidden lg:block lg:col-span-2 space-y-8 sticky top-28">
            <div className="premium-card p-10 rounded-[3rem] bg-slate-950 text-white space-y-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl -mr-16 -mt-16" />
               <div className="relative z-10 space-y-8">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-primary" />
                     </div>
                     <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Available Balance</div>
                        <div className="text-2xl font-black tracking-tight">Rs {walletBalance.toLocaleString()}</div>
                     </div>
                  </div>

                  <div className="pt-8 border-t border-white/10 space-y-6">
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Est. Investment</span>
                        <span className="text-xl font-black text-primary">Rs {totalCost.toLocaleString()}</span>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Post-Order Balance</span>
                        <span className="text-sm font-bold text-white/60">Rs {(walletBalance - totalCost).toLocaleString()}</span>
                     </div>
                  </div>

                  {totalCost > walletBalance && (
                     <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-start gap-3 text-destructive">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span className="text-[10px] font-black uppercase tracking-widest leading-relaxed">Insufficient liquidity. Top up to proceed.</span>
                     </div>
                  )}

                  <Button variant="outline" className="w-full h-14 rounded-2xl bg-white/5 border-white/10 text-white font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-slate-950" onClick={() => navigate('/add-funds')}>
                     Add Funds Now
                  </Button>
               </div>
            </div>

            {selectedService && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="premium-card p-10 rounded-[3rem] bg-card border border-primary/20 space-y-6"
               >
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-primary" />
                     </div>
                     <h3 className="font-heading font-black text-sm uppercase tracking-wider">Service Specs</h3>
                  </div>

                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Average Time</span>
                        <span className="text-xs font-bold text-primary">{selectedService.avg_time || 'Instant'}</span>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Integrity Rank</span>
                        <div className="flex items-center gap-1.5">
                           <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                           <span className="text-xs font-bold">Verified</span>
                        </div>
                     </div>
                     {selectedService.description && (
                        <div className="pt-4 mt-4 border-t border-border/50">
                           <p className="text-[10px] font-bold text-muted-foreground leading-relaxed italic">{selectedService.description}</p>
                        </div>
                     )}
                  </div>
               </motion.div>
            )}
         </div>
      </div>
    </div>
  );
}