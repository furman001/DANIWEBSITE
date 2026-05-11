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
  Search, Globe, Eye, ArrowRight
} from 'lucide-react';

const platformFilters = [
  { id: 'all', label: 'All', icon: '🌐' },
  { id: 'tiktok', label: 'TikTok', icon: '🎵' },
  { id: 'instagram', label: 'Instagram', icon: '📷' },
  { id: 'facebook', label: 'Facebook', icon: '📘' },
  { id: 'youtube', label: 'YouTube', icon: '▶️' },
  { id: 'twitter', label: 'Twitter', icon: '🐦' },
  { id: 'telegram', label: 'Telegram', icon: '✈️' },
  { id: 'whatsapp', label: 'WhatsApp', icon: '💬' },
  { id: 'spotify', label: 'Spotify', icon: '🎧' },
  { id: 'discord', label: 'Discord', icon: '🎮' },
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
    const matchesPlatform = activePlatform === 'all' || s.platform === activePlatform;
    const matchesSearch = !search || s.name?.toLowerCase().includes(search.toLowerCase()) || s.category?.toLowerCase().includes(search.toLowerCase());
    return matchesPlatform && matchesSearch && s.is_active !== false;
  });

  // Group by category
  const grouped = filtered.reduce((acc, s) => {
    const cat = s.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-2">
            DM Social Panel — Best SMM Services in Pakistan
          </h1>
          <p className="text-muted-foreground">
            Here you can get any social media services. We provide top notch services working 99% according to description.
          </p>
        </div>

        {/* Platform Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {platformFilters.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePlatform(p.id)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                activePlatform === p.id
                  ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20'
                  : 'bg-card border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground'
              }`}
            >
              <span>{p.icon}</span>
              {p.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-12 rounded-xl bg-card border-border/50"
          />
        </div>

        {/* Services Table */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : Object.keys(grouped).length === 0 ? (
          <Card className="p-12 text-center">
            <Globe className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-heading font-semibold text-lg mb-1">No services found</h3>
            <p className="text-sm text-muted-foreground">Try a different search or filter.</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <div className="bg-primary/10 border border-primary/20 rounded-xl px-5 py-3 mb-2">
                  <h3 className="font-heading font-bold text-sm text-primary">{category}</h3>
                </div>
                <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
                  {/* Table Header */}
                  <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <div className="col-span-1">ID</div>
                    <div className="col-span-4">Service</div>
                    <div className="col-span-2">Rate/1000</div>
                    <div className="col-span-1">Min</div>
                    <div className="col-span-1">Max</div>
                    <div className="col-span-2">Avg Time</div>
                    <div className="col-span-1"></div>
                  </div>
                  {/* Table Rows */}
                  {items.map((service) => (
                    <div
                      key={service.id}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-5 py-3.5 border-t border-border/30 hover:bg-muted/20 transition-colors items-center"
                    >
                      <div className="sm:col-span-1 text-xs text-primary font-semibold">
                        {service.service_id || '—'}
                      </div>
                      <div className="sm:col-span-4 text-sm font-medium">{service.name}</div>
                      <div className="sm:col-span-2 text-sm font-semibold text-primary">
                        Rs {service.rate_per_1000}
                      </div>
                      <div className="sm:col-span-1 text-xs text-muted-foreground">{service.min_quantity || 10}</div>
                      <div className="sm:col-span-1 text-xs text-muted-foreground">{service.max_quantity?.toLocaleString() || '1M'}</div>
                      <div className="sm:col-span-2 text-xs text-muted-foreground">{service.avg_time || '—'}</div>
                      <div className="sm:col-span-1">
                        <Link to={`/new-order?service=${service.id}`}>
                          <Button size="sm" className="h-7 text-xs px-3 rounded-lg">
                            Order
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}