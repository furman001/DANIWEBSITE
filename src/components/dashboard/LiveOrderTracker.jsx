import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Activity, Clock, CheckCircle2, XCircle, AlertTriangle, Loader2, ShoppingCart, ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20', icon: Clock, dot: 'bg-amber-400' },
  in_progress: { label: 'In Progress', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: Loader2, dot: 'bg-blue-400 animate-pulse' },
  completed: { label: 'Completed', color: 'bg-green-500/10 text-green-600 border-green-500/20', icon: CheckCircle2, dot: 'bg-green-400' },
  cancelled: { label: 'Cancelled', color: 'bg-red-500/10 text-red-600 border-red-500/20', icon: XCircle, dot: 'bg-red-400' },
  partial: { label: 'Partial', color: 'bg-orange-500/10 text-orange-600 border-orange-500/20', icon: AlertTriangle, dot: 'bg-orange-400' },
};

const PLATFORM_ICONS = {
  tiktok: '🎵', instagram: '📷', facebook: '📘', youtube: '▶️',
  twitter: '🐦', telegram: '✈️', whatsapp: '💬', spotify: '🎧', discord: '🎮',
};

export default function LiveOrderTracker({ orders, isLoading }) {
  const recentOrders = orders.slice(0, 8);

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="font-heading text-base flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            Live Order Tracker
            <span className="inline-flex items-center gap-1 ml-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] text-green-500 font-normal">Live</span>
            </span>
          </CardTitle>
          <Link to="/orders">
            <Button variant="ghost" size="sm" className="text-xs h-7 gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {recentOrders.length === 0 ? (
          <div className="py-10 text-center">
            <ShoppingCart className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No orders yet.</p>
            <Link to="/new-order">
              <Button size="sm" className="mt-3 h-8 text-xs">Place First Order</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {recentOrders.map((order, i) => {
              const sc = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = sc.icon;
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="text-xl flex-shrink-0">{PLATFORM_ICONS[order.platform] || '🌐'}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate leading-tight">{order.service_name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Qty: {order.quantity?.toLocaleString()} •{' '}
                      {order.created_date ? format(new Date(order.created_date), 'MMM d, HH:mm') : '—'}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold">Rs {order.amount?.toFixed(0)}</p>
                    <Badge variant="outline" className={`text-[9px] mt-0.5 ${sc.color} flex items-center gap-1`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} flex-shrink-0`} />
                      {sc.label}
                    </Badge>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}