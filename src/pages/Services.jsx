import React, { useState } from 'react';
import { supabase, TABLES } from '@/api/supabaseClient';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import {
  Search, Globe, Zap, Filter, Info, ChevronRight, TrendingUp, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const platformFilters = [
  { id: 'all', label: 'All Platform', icon: <Globe className="w-4 h-4" />, color: 'bg-slate-500' },
  { id: 'tiktok', label: 'TikTok', icon: '🎵', color: 'bg-[#FE2C55]' },
  { id: 'instagram', label: 'Instagram', icon: '📷', color: 'bg-[#E1306C]' },
  { id: 'facebook', label: 'Facebook', icon: '📘', color: 'bg-[#1877F2]' },
  { id: 'youtube', label: 'YouTube', icon: '▶️', color: 'bg-[#FF0000]' },
  { id: 'twitter', label: 'Twitter', icon: '🐦', color: 'bg-[#1DA1F2]' },
];

export default function Services() {
  const [search, setSearch] = useState('');
  const [activePlatform, setActivePlatform] = useState('all');

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services'],
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

  const filtered = services.filter(s => {
    const matchesPlatform = activePlatform === 'all' || s.platform?.toLowerCase() === activePlatform.toLowerCase();
    const matchesSearch = !search || s.name?.toLowerCase().includes(search.toLowerCase()) || s.category?.toLowerCase().includes(search.toLowerCase());
    return matchesPlatform && matchesSearch && s.is_active !== false;
  });

  const grouped = filtered.reduce((acc, s) => {
    const cat = s.category || 'Premium Services';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-12 pb-24">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-[3rem] bg-slate-950 p-12 lg:p-20 shadow-2xl">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -ml-32 -mb-32" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          <div className="max-w-2xl space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Global Service Directory</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-heading text-5xl lg:text-7xl font-black text-white tracking-tighter leading-none"
            >
              Unlock Unlimited <br />
              <span className="text-primary italic">Growth</span> Potential.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white/60 text-lg lg:text-xl font-medium leading-relaxed max-w-xl"
            >
              Browse our curated collection of high-performance SMM services. 
              Built for speed, reliability, and massive results.
            </motion.p>
          </div>
          
          <div className="flex flex-col gap-6 lg:w-96">
             <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-[2.5rem] space-y-6">
                <div className="flex items-center justify-between">
                   <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Total Active Services</div>
                   <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                <div className="text-4xl font-black text-white">{services.length}</div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                   <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '85%' }}
                      className="h-full bg-primary" 
                   />
                </div>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">99% uptime guarantee across all platforms</p>
             </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Modern Sidebar Filters */}
        <aside className="lg:w-80 w-full sticky top-28 space-y-8">
           <div className="premium-card p-8 rounded-[2.5rem] bg-card space-y-8">
              <div className="flex items-center gap-2">
                 <Filter className="w-4 h-4 text-primary" />
                 <h3 className="font-heading font-black text-sm uppercase tracking-wider">Service Filter</h3>
              </div>

              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Search service..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-11 h-14 rounded-2xl bg-muted/30 border-transparent focus:bg-background focus:border-primary/20 transition-all text-sm font-bold"
                />
              </div>

              <div className="space-y-3">
                 <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Choose Platform</div>
                 <div className="grid grid-cols-1 gap-2">
                    {platformFilters.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setActivePlatform(p.id)}
                        className={`flex items-center gap-4 p-4 rounded-2xl text-sm font-bold transition-all relative overflow-hidden group ${
                          activePlatform === p.id
                            ? 'bg-slate-900 text-white shadow-xl scale-[1.02]'
                            : 'bg-muted/30 text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-xl ${p.color} flex items-center justify-center text-white shadow-sm`}>
                           {p.icon}
                        </div>
                        <span className="flex-1 text-left">{p.label}</span>
                        {activePlatform === p.id && <Zap className="w-3 h-3 fill-primary text-primary" />}
                      </button>
                    ))}
                 </div>
              </div>
           </div>

           <div className="p-8 rounded-[2.5rem] bg-primary/5 border border-primary/10 space-y-4">
              <div className="flex items-center gap-2">
                 <Info className="w-4 h-4 text-primary" />
                 <h4 className="font-heading font-black text-[10px] uppercase tracking-widest">Support Note</h4>
              </div>
              <p className="text-xs text-muted-foreground font-medium leading-relaxed italic">
                All services are verified for quality. Average time is updated every 60 minutes based on real system performance.
              </p>
           </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 w-full space-y-12">
           {isLoading ? (
             <div className="space-y-10">
                {[...Array(3)].map((_, i) => (
                   <div key={i} className="space-y-4">
                      <Skeleton className="h-10 w-64 rounded-full" />
                      <Skeleton className="h-[400px] w-full rounded-[3rem]" />
                   </div>
                ))}
             </div>
           ) : Object.keys(grouped).length === 0 ? (
             <div className="p-20 text-center bg-card rounded-[3rem] border border-border/50">
                <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-8">
                   <Globe className="w-10 h-10 text-muted-foreground/30" />
                </div>
                <h3 className="font-heading font-black text-2xl uppercase tracking-tight mb-2">No Match Found</h3>
                <p className="text-muted-foreground font-medium max-w-sm mx-auto">Try refining your search or clearing platform filters.</p>
                <Button variant="outline" onClick={() => { setSearch(''); setActivePlatform('all'); }} className="mt-8 rounded-full">Reset All Filters</Button>
             </div>
           ) : (
             <div className="space-y-16">
                {Object.entries(grouped).map(([category, items], idx) => (
                  <motion.div 
                    key={category}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-6">
                       <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                       <h3 className="font-heading font-black text-2xl tracking-tighter uppercase leading-none">{category}</h3>
                       <div className="flex-1 h-px bg-gradient-to-r from-border/50 to-transparent" />
                       <Badge variant="secondary" className="bg-primary/10 text-primary border-transparent font-black px-4 py-1.5 rounded-full text-[10px] uppercase">{items.length} Options</Badge>
                    </div>

                    <div className="premium-card rounded-[3rem] bg-card overflow-hidden border border-border/30">
                       <div className="overflow-x-auto">
                          <table className="w-full text-left">
                             <thead>
                                <tr className="bg-muted/20 border-b border-border/30">
                                   <th className="px-10 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] w-24">Code</th>
                                   <th className="px-6 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Service Description</th>
                                   <th className="px-6 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] w-32 text-center">Rate/1K</th>
                                   <th className="px-6 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] w-48">Delivery</th>
                                   <th className="px-10 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] w-32">Action</th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-border/20">
                                {items.map((service) => (
                                  <tr key={service.id} className="group hover:bg-primary/[0.02] transition-colors">
                                     <td className="px-10 py-8">
                                        <div className="inline-flex items-center justify-center min-w-[3rem] h-8 rounded-lg bg-primary/5 text-primary text-[10px] font-black border border-primary/10">
                                           {service.service_id || '—'}
                                        </div>
                                     </td>
                                     <td className="px-6 py-8">
                                        <div className="space-y-2">
                                           <div className="font-bold text-sm leading-snug group-hover:text-primary transition-colors pr-10">{service.name}</div>
                                           <div className="flex flex-wrap gap-4 items-center">
                                              <div className="flex items-center gap-1.5">
                                                 <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                                 <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Min: {service.min_quantity?.toLocaleString() || 10}</span>
                                              </div>
                                              <div className="flex items-center gap-1.5">
                                                 <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                                 <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Max: {service.max_quantity?.toLocaleString() || '1M'}</span>
                                              </div>
                                           </div>
                                        </div>
                                     </td>
                                     <td className="px-6 py-8">
                                        <div className="text-center">
                                           <div className="text-lg font-black text-foreground">Rs {service.rate_per_1000}</div>
                                           <div className="text-[8px] font-black text-primary uppercase tracking-widest mt-1">Best Value</div>
                                        </div>
                                     </td>
                                     <td className="px-6 py-8">
                                        <div className="space-y-3">
                                           <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider">
                                              <div className="flex items-center gap-1.5">
                                                 <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                                                 <span>Avg: {service.avg_time || 'Instant'}</span>
                                              </div>
                                              <span className="text-primary">85% Speed</span>
                                           </div>
                                           <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                                              <motion.div 
                                                 initial={{ width: 0 }}
                                                 whileInView={{ width: '85%' }}
                                                 className="h-full bg-primary rounded-full" 
                                              />
                                           </div>
                                        </div>
                                     </td>
                                     <td className="px-10 py-8">
                                        <Link to={`/new-order?service=${service.id}`}>
                                           <Button className="h-11 px-8 rounded-2xl bg-slate-900 text-white hover:bg-primary hover:text-white transition-all font-black uppercase text-[10px] tracking-widest shadow-xl shadow-black/5 hover:shadow-primary/30">
                                              Order
                                           </Button>
                                        </Link>
                                     </td>
                                  </tr>
                                ))}
                             </tbody>
                          </table>
                       </div>
                    </div>
                  </motion.div>
                ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
}