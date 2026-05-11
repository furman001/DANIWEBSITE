import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BarChart2 } from 'lucide-react';

const COLORS = ['#06b6d4', '#a855f7', '#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#ec4899', '#14b8a6'];

const PLATFORM_ICONS = {
  tiktok: '🎵',
  instagram: '📷',
  facebook: '📘',
  youtube: '▶️',
  twitter: '🐦',
  telegram: '✈️',
  whatsapp: '💬',
  spotify: '🎧',
  discord: '🎮',
  other: '🌐',
};

export default function PlatformBreakdown({ orders }) {
  const data = useMemo(() => {
    const map = {};
    orders.forEach(o => {
      const p = o.platform || 'other';
      map[p] = (map[p] || 0) + 1;
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value, icon: PLATFORM_ICONS[name] || '🌐' }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [orders]);

  if (data.length === 0) {
    return (
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="font-heading text-base flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-primary" />
            Platform Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[180px]">
          <p className="text-sm text-muted-foreground">No order data yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="font-heading text-base flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-primary" />
          Platform Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-4">
          <ResponsiveContainer width={130} height={130}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={35} outerRadius={60} dataKey="value" strokeWidth={2}>
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(val, name) => [`${val} orders`, name]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex-1 space-y-1.5">
            {data.map((item, i) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                <span className="text-xs capitalize flex-1">{item.icon} {item.name}</span>
                <span className="text-xs font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}