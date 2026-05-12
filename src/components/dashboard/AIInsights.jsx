import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCw, TrendingUp, AlertCircle, Lightbulb, BrainCircuit, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIInsights({ orders, walletBalance, transactions }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateInsights = async () => {
    setLoading(true);
    // Simulate thinking
    await new Promise(r => setTimeout(r, 1200));

    const totalSpent = orders.reduce((s, o) => s + (o.amount || 0), 0);
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const successRate = orders.length > 0 ? Math.round((completedOrders / orders.length) * 100) : 0;
    const platformCounts = orders.reduce((acc, o) => { acc[o.platform || 'other'] = (acc[o.platform || 'other'] || 0) + 1; return acc; }, {});
    const topPlatform = Object.entries(platformCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'none';

    const generatedInsights = [
      {
        type: 'success',
        title: 'Spending Efficiency',
        description: totalSpent > 0 ? `You've invested Rs ${totalSpent.toLocaleString()} across ${orders.length} orders. Performance is currently at ${successRate}% efficiency.` : 'Start your first growth campaign to see analytics.',
        icon: TrendingUp
      },
      {
        type: 'tip',
        title: 'Growth Strategy',
        description: topPlatform !== 'none' ? `Dominating on ${topPlatform.toUpperCase()}. We recommend diversifying to Instagram for maximum brand exposure.` : 'Analyze top trending services to kickstart your presence.',
        icon: Lightbulb
      },
      {
        type: walletBalance < 500 ? 'warning' : 'success',
        title: 'Liquidity Check',
        description: walletBalance > 500 ? `Your balance of Rs ${walletBalance.toLocaleString()} is healthy for scaling operations.` : `Balance is low (Rs ${walletBalance.toLocaleString()}). Top up soon to avoid interruption.`,
        icon: AlertCircle
      }
    ];

    setInsights(generatedInsights);
    setLoading(false);
  };

  useEffect(() => {
    generateInsights();
  }, [orders.length, walletBalance]);

  const colorMap = {
    tip: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    warning: 'text-red-500 bg-red-500/10 border-red-500/20',
    success: 'text-primary bg-primary/10 border-primary/20',
  };

  return (
    <div className="premium-card rounded-[2.5rem] bg-card overflow-hidden">
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-primary" />
             </div>
             <div>
                <h3 className="font-heading font-black text-sm uppercase tracking-wider">AI Assistant</h3>
                <div className="flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                   <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Insight</span>
                </div>
             </div>
          </div>
          <Button variant="ghost" size="icon" onClick={generateInsights} disabled={loading} className="rounded-full hover:bg-muted">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                   <Skeleton className="h-4 w-1/3" />
                   <Skeleton className="h-12 w-full rounded-2xl" />
                </div>
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <div className="space-y-4">
                {insights?.map((ins, i) => (
                  <motion.div
                    key={ins.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group"
                  >
                    <div className="p-5 rounded-3xl bg-muted/30 border border-transparent hover:border-primary/20 hover:bg-muted/50 transition-all duration-300">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorMap[ins.type]}`}>
                          <ins.icon className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                             <h4 className="text-xs font-black uppercase tracking-tight">{ins.title}</h4>
                             <div className="px-1.5 py-0.5 rounded bg-primary/10 text-[8px] font-bold text-primary uppercase">New</div>
                          </div>
                          <p className="text-xs text-muted-foreground font-medium leading-relaxed group-hover:text-foreground transition-colors">
                            {ins.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>

        <button className="w-full py-4 px-6 rounded-2xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 group">
           Explore Insights Analytics
           <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}