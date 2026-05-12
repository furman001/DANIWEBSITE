import React, { useState } from 'react';
import { supabase, TABLES } from '@/api/supabaseClient';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import {
  Search, Globe, Eye, ArrowRight, Zap, Star, ShieldCheck, Filter, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const platformFilters = [
  { id: 'all', label: 'All', icon: <Globe className="w-4 h-4" /> },
  { id: 'tiktok', label: 'TikTok', icon: '🎵' },
  { id: 'instagram', label: 'Instagram', icon: '📷' },
  { id: 'facebook', label: 'Facebook', icon: '📘' },
  { id: 'youtube', label: 'YouTube', icon: '▶️' },
  { id: 'twitter', label: 'Twitter', icon: '🐦' },
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
    <div className="space-y-12 pb-20">
      {/* Page Header */}
      <div className="relative p-10 sm:p-16 rounded-[3rem] bg-slate-950 text-white overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/20 px-4 py-2 rounded-full border border-primary/30">
               <Zap className="w-4 h-4 text-primary" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Live Service Directory</span>
            </div>
            <h1 className="font-heading text-4xl sm:text-6xl font-black tracking-tighter leading-none">
              Premium <span className="text-primary">SMM</span> <br />
              Solutions Provider.
            </h1>
            <p className="text-white/60 text-lg font-medium leading-relaxed">
              Explore Pakistan's most comprehensive catalog of social media growth services. 
              Real-time pricing, instant activation, and guaranteed quality.
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
             <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <ShieldCheck className="w-6 h-6 text-primary" />
                <div>
                   <div className="font-black text-sm uppercase tracking-tight">Verified Services</div>
                   <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">99.9% Success Rate</div>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-72 space-y-8">
          <div className="bg-card rounded-[2rem] border border-border/50 p-8 premium-shadow">
            <div className="flex items-center gap-2 mb-6">
               <Filter className="w-4 h-4 text-primary" />
               <h3 className="font-heading font-black text-sm uppercase tracking-wider">Refine Search</h3>
            </div>
            
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-11 h-14 rounded-2xl bg-muted/30 border-transparent focus:bg-background focus:border-primary/30 transition-all"
              />
            </div>

            <div className="space-y-2">
               <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4 px-2">Platforms</div>
               <div className="grid grid-cols-1 gap-1">
                 {platformFilters.map((p) => (
                   <button
                     key={p.id}
                     onClick={() => setActivePlatform(p.id)}
                     className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                       activePlatform === p.id
                         ? 'bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-[1.02]'
                         : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                     }`}
                   >
                     <span className="text-lg leading-none">{p.icon}</span>
                     <span className="flex-1 text-left">{p.label}</span>
                     {activePlatform === p.id && <Zap className="w-3 h-3 fill-current" />}
                   </button>
                 ))}
               </div>
            </div>
          </div>

          <div className="bg-primary/5 rounded-[2rem] p-8 border border-primary/10">
             <div className="flex items-center gap-2 mb-4">
                <Info className="w-4 h-4 text-primary" />
                <h4 className="font-heading font-black text-xs uppercase tracking-wider">Service Note</h4>
             </div>
             <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                Avg. time is calculated based on last 50 orders. Rates are subject to change.
             </p>
          </div>
        </aside>

        {/* Services Main List */}
        <div className="flex-1 space-y-10">
          {isLoading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-3">
                   <Skeleton className="h-12 w-48 rounded-xl" />
                   <Skeleton className="h-64 w-full rounded-[2rem]" />
                </div>
              ))}
            </div>
          ) : Object.keys(grouped).length === 0 ? (
            <div className="bg-card rounded-[3rem] p-20 text-center border border-border/50">
              <Globe className="w-16 h-16 text-muted-foreground/20 mx-auto mb-6" />
              <h3 className="font-heading font-black text-2xl uppercase tracking-tight mb-2">No results found</h3>
              <p className="text-muted-foreground font-medium">Try adjusting your filters or search keywords.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(grouped).map(([category, items], catIdx) => (
                <motion.div 
                  key={category}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: catIdx * 0.1 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-4 px-2">
                     <div className="h-2 w-2 rounded-full bg-primary" />
                     <h3 className="font-heading font-black text-xl tracking-tight uppercase">{category}</h3>
                     <div className="flex-1 h-px bg-border/60" />
                     <Badge variant="outline" className="rounded-full border-primary/30 text-primary font-black uppercase text-[10px] px-3">{items.length} Services</Badge>
                  </div>

                  <div className="bg-card rounded-[2.5rem] border border-border/50 overflow-hidden premium-shadow">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-muted/30 border-b border-border/50">
                            <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest w-20">ID</th>
                            <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Service Details</th>
                            <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest w-32">Rate/1K</th>
                            <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest w-40">Performance</th>
                            <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest w-32">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                          {items.map((service) => (
                            <tr key={service.id} className="hover:bg-muted/10 transition-colors group">
                              <td className="px-8 py-6">
                                <span className="text-xs font-black text-primary bg-primary/5 px-2 py-1 rounded-md">{service.service_id || '—'}</span>
                              </td>
                              <td className="px-8 py-6">
                                <div className="space-y-1">
                                  <div className="font-bold text-sm leading-tight group-hover:text-primary transition-colors">{service.name}</div>
                                  <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                     <span>Min: {service.min_quantity?.toLocaleString() || 10}</span>
                                     <span className="w-1 h-1 rounded-full bg-border" />
                                     <span>Max: {service.max_quantity?.toLocaleString() || '1M'}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-6">
                                <div className="font-black text-sm text-foreground">Rs {service.rate_per_1000}</div>
                              </td>
                              <td className="px-8 py-6">
                                <div className="space-y-1.5">
                                   <div className="flex items-center gap-2">
                                      <Zap className="w-3 h-3 text-yellow-500 fill-current" />
                                      <span className="text-[10px] font-black uppercase text-foreground">{service.avg_time || '—'} Avg.</span>
                                   </div>
                                   <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                                      <div className="h-full bg-primary w-3/4 rounded-full" />
                                   </div>
                                </div>
                              </td>
                              <td className="px-8 py-6">
                                <Link to={`/new-order?service=${service.id}`}>
                                  <Button size="sm" className="h-10 px-6 font-black uppercase text-[10px] rounded-xl shadow-xl shadow-primary/10 hover:shadow-primary/30 transition-all">
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