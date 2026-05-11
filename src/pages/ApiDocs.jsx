import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Code, Key, Globe, Zap, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const endpoints = [
  {
    method: 'POST',
    path: '/api/v2',
    name: 'Add Order',
    params: 'key, action=add, service, link, quantity',
  },
  {
    method: 'POST',
    path: '/api/v2',
    name: 'Order Status',
    params: 'key, action=status, order',
  },
  {
    method: 'POST',
    path: '/api/v2',
    name: 'Multiple Order Status',
    params: 'key, action=status, orders (comma separated)',
  },
  {
    method: 'POST',
    path: '/api/v2',
    name: 'Services List',
    params: 'key, action=services',
  },
  {
    method: 'POST',
    path: '/api/v2',
    name: 'Add Funds',
    params: 'key, action=balance',
  },
];

export default function ApiDocs() {
  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied!');
  };

  return (
    <div className="py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Code className="w-6 h-6 text-primary" />
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold">API Documentation</h1>
          <p className="text-muted-foreground mt-2">Integrate DM Social Panel with your own panel.</p>
        </div>

        {/* Overview */}
        <Card className="mb-6 border-border/50">
          <CardContent className="p-6">
            <h2 className="font-heading font-bold text-xl mb-3 flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" /> Overview
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Our API allows you to integrate DM Social Panel services directly into your own SMM panel or application. 
              You can place orders, check status, and manage your account programmatically.
            </p>
            <div className="bg-muted/50 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">API URL</span>
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono text-primary">https://dmsocialpanel.com/api/v2</code>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyText('https://dmsocialpanel.com/api/v2')}>
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">HTTP Method</span>
                <code className="text-sm font-mono">POST</code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Response Format</span>
                <code className="text-sm font-mono">JSON</code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Key */}
        <Card className="mb-6 border-border/50">
          <CardContent className="p-6">
            <h2 className="font-heading font-bold text-xl mb-3 flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" /> Authentication
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You need an API key to authenticate requests. You can find your API key in your dashboard settings. 
              Include it as the <code className="bg-muted px-1.5 py-0.5 rounded text-xs">key</code> parameter in all requests.
            </p>
          </CardContent>
        </Card>

        {/* Endpoints */}
        <Card className="border-border/50">
          <CardContent className="p-6">
            <h2 className="font-heading font-bold text-xl mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" /> Endpoints
            </h2>
            <div className="space-y-4">
              {endpoints.map((ep, i) => (
                <div key={i} className="bg-muted/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-mono font-bold">{ep.method}</span>
                    <code className="text-sm font-mono">{ep.path}</code>
                    <span className="text-xs text-muted-foreground ml-auto">{ep.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <strong>Parameters:</strong> {ep.params}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}