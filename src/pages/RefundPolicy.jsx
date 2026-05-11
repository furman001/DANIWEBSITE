import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

export default function RefundPolicy() {
  return (
    <div className="py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold">Refund Policy</h1>
          <p className="text-muted-foreground mt-2">Our commitment to fair service delivery.</p>
        </div>

        <div className="space-y-6">
          <Card className="border-border/50">
            <CardContent className="p-6">
              <h2 className="font-heading font-bold text-xl mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" /> General Policy
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                At DM Social Panel, we strive to deliver all orders as described. If any service fails to deliver within the expected timeframe, or if the order is cancelled by our system, a full refund will be credited to your wallet balance.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6">
              <h2 className="font-heading font-bold text-xl mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" /> Processing Time
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span> Refunds are processed within 24-72 hours.</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span> The refunded amount will be added back to your wallet balance.</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span> Cash refunds are not available — all refunds go to your panel balance.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6">
              <h2 className="font-heading font-bold text-xl mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" /> Non-Refundable Cases
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span> Orders that have already been completed and delivered.</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span> Drops after delivery — some services naturally experience follower/like drops.</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span> Wrong link or private account submitted by user.</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span> Partial orders — you will be charged only for the delivered amount.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6">
              <h2 className="font-heading font-bold text-xl mb-3">Contact Support</h2>
              <p className="text-sm text-muted-foreground">
                For refund requests or any issues, contact our support team via WhatsApp at <strong className="text-foreground">+92 330 6976309</strong> or through the support ticket system.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}