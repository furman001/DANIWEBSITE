import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCw, TrendingUp, AlertCircle, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIInsights({ orders, walletBalance, transactions }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateInsights = async () => {
    setLoading(true);
    const totalSpent = orders.reduce((s, o) => s + (o.amount || 0), 0);
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const successRate = orders.length > 0 ? Math.round((completedOrders / orders.length) * 100) : 0;
    const platformCounts = orders.reduce((acc, o) => { acc[o.platform || 'other'] = (acc[o.platform || 'other'] || 0) + 1; return acc; }, {});
    const topPlatform = Object.entries(platformCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'none';

    // Generate local insights instead of using LLM
    const generatedInsights = [
      {
        icon: TrendingUp,
        title: 'Spending Overview',
        text: totalSpent > 0 ? `You've spent Rs ${totalSpent.toFixed(0)} on SMM services. ${successRate > 70 ? 'Great success rate!' : 'Keep optimizing your orders.'}` : 'Start your first order to see spending insights!'
      },
      {
        icon: Lightbulb,
        title: 'Platform Preference',
        text: topPlatform !== 'none' ? `Your most used platform is ${topPlatform}. Consider exploring other platforms for more growth.` : 'Place orders to discover your top platform.'
      },
      {
        icon: AlertCircle,
        title: 'Account Status',
        text: walletBalance > 500 ? `Wallet balance: Rs ${walletBalance.toFixed(0)}. Ready for new orders!` : `Low balance: Rs ${walletBalance.toFixed(0)}. Add funds to continue ordering.`
      }
    ];

    setInsights(generatedInsights);
    setLoading(false);
  };

  useEffect(() => {
    if (orders.length >= 0) generateInsights();
  }, []);

  const iconMap = {
    tip: <Lightbulb className="w-4 h-4 text-amber-500" />,
    warning: <AlertCircle className="w-4 h-4 text-red-500" />,
    success: <TrendingUp className="w-4 h-4 text-green-500" />,
  };
  const bgMap = {
    tip: 'bg-amber-500/5 border-amber-500/20',
    warning: 'bg-red-500/5 border-red-500/20',
    success: 'bg-green-500/5 border-green-500/20',
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="font-heading text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            AI Insights
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={generateInsights} disabled={loading} className="h-7 text-xs gap-1">
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        {loading && !insights ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-muted/50 animate-pulse" />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {insights?.map((ins, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-xl border p-3 ${bgMap[ins.type] || bgMap.tip}`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex-shrink-0">{iconMap[ins.type] || iconMap.tip}</div>
                  <div>
                    <p className="text-sm font-semibold leading-tight">{ins.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{ins.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </CardContent>
    </Card>
  );
}