import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';
import { TrendingUp } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border/50 rounded-xl p-3 shadow-lg text-sm">
        <p className="font-semibold mb-1">{label}</p>
        <p className="text-primary">Rs {payload[0]?.value?.toFixed(0)} spent</p>
        <p className="text-muted-foreground">{payload[1]?.value} orders</p>
      </div>
    );
  }
  return null;
};

export default function SpendingChart({ orders }) {
  const chartData = useMemo(() => {
    const last14 = Array.from({ length: 14 }, (_, i) => {
      const day = startOfDay(subDays(new Date(), 13 - i));
      const dayOrders = orders.filter(o => {
        if (!o.created_date) return false;
        return startOfDay(new Date(o.created_date)).getTime() === day.getTime();
      });
      return {
        date: format(day, 'MMM d'),
        spent: dayOrders.reduce((s, o) => s + (o.amount || 0), 0),
        orders: dayOrders.length,
      };
    });
    return last14;
  }, [orders]);

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="font-heading text-base flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          Spending — Last 14 Days
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="spent"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#spendGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}