import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

const sections = [
  {
    title: 'Acceptance of Terms',
    content: 'By accessing and using DM Social Panel, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our services.',
  },
  {
    title: 'Services Description',
    content: 'PakSMMPortal provides social media marketing services including but not limited to followers, likes, views, and engagement for various platforms. We act as a reseller and cannot guarantee permanent results.',
  },
  {
    title: 'Account Responsibility',
    content: 'You are responsible for maintaining the confidentiality of your account credentials. Any activity under your account is your responsibility. Do not share your login details.',
  },
  {
    title: 'Payment Policy',
    content: 'All payments are non-refundable once deposited into your wallet. Funds can only be used to purchase services on our platform. We accept JazzCash, Easypaisa, and Bank Transfer.',
  },
  {
    title: 'Prohibited Use',
    content: 'You agree not to use our services for illegal purposes, spam, or any activity that violates the terms of social media platforms. We reserve the right to suspend accounts violating these terms.',
  },
  {
    title: 'Service Delivery',
    content: 'We strive to deliver all orders within the estimated timeframe. However, delivery times may vary based on demand and platform updates. We are not responsible for delays caused by third-party platforms.',
  },
  {
    title: 'Limitation of Liability',
    content: 'DM Social Panel shall not be held liable for any indirect, incidental, or consequential damages arising from the use of our services. Our total liability is limited to the amount paid for the specific service.',
  },
  {
    title: 'Changes to Terms',
    content: 'We reserve the right to modify these terms at any time. Continued use of our services after changes constitutes acceptance of the updated terms.',
  },
];

export default function Terms() {
  return (
    <div className="py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold">Terms of Service</h1>
          <p className="text-muted-foreground mt-2">Last updated: April 2026</p>
        </div>

        <div className="space-y-4">
          {sections.map((section, i) => (
            <Card key={i} className="border-border/50">
              <CardContent className="p-6">
                <h2 className="font-heading font-bold text-lg mb-2">
                  {i + 1}. {section.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}