import React, { useState } from 'react';
import { supabase, TABLES } from '@/api/supabaseClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  Wallet, Copy, CheckCircle2, Clock, XCircle, Loader2, User, Hash, ArrowRight, Shield
} from 'lucide-react';
import { motion } from 'framer-motion';

// ── Official Brand SVG Icons ──────────────────────────────────────────────────
const EasypaisaIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
    <rect width="48" height="48" rx="12" fill="#3BB54A"/>
    <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="Arial">EP</text>
  </svg>
);

const JazzcashIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
    <rect width="48" height="48" rx="12" fill="#D5202D"/>
    <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="Arial">JC</text>
  </svg>
);

// ── Payment Method Config (NEW ACCOUNT) ──────────────────────────────────────
const paymentMethods = [
  {
    id: 'easypaisa',
    name: 'EasyPaisa',
    accountTitle: 'Daniyal Ahmed',
    number: '03306976309',
    IconComponent: EasypaisaIcon,
    color: 'text-green-600',
    bg: 'bg-green-50',
    activeBg: 'bg-green-500/10',
    activeBorder: 'border-green-500',
    inactiveBorder: 'border-border/60',
    badge: 'bg-green-100 text-green-700',
    instructions: 'Open EasyPaisa app → Send Money → Enter account number below → Send amount → Copy Transaction ID and paste below.',
    gradient: 'from-green-500 to-green-600',
  },
  {
    id: 'jazzcash',
    name: 'JazzCash',
    accountTitle: 'Daniyal Ahmed',
    number: '03306976309',
    IconComponent: JazzcashIcon,
    color: 'text-red-600',
    bg: 'bg-red-50',
    activeBg: 'bg-red-500/10',
    activeBorder: 'border-red-500',
    inactiveBorder: 'border-border/60',
    badge: 'bg-red-100 text-red-700',
    instructions: 'Open JazzCash app → Send Money → Enter mobile number below → Send amount → Copy Transaction ID and paste below.',
    gradient: 'from-red-500 to-orange-500',
  },
];

// ── Status Config ─────────────────────────────────────────────────────────────
const statusConfig = {
  pending: { color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20', icon: Clock, label: 'Pending' },
  approved: { color: 'bg-green-500/10 text-green-600 border-green-500/20', icon: CheckCircle2, label: 'Approved' },
  rejected: { color: 'bg-red-500/10 text-red-600 border-red-500/20', icon: XCircle, label: 'Rejected' },
};

export default function AddFunds() {
  const { user, session } = useAuth();
  const queryClient = useQueryClient();
  const [selectedMethod, setSelectedMethod] = useState('easypaisa');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [copiedTitle, setCopiedTitle] = useState(false);

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['my-transactions'],
    queryFn: async () => {
      const { data: { session: freshSession } } = await supabase.auth.getSession();
      const uid = freshSession?.user?.id ?? user?.id ?? session?.user?.id;
      const { data, error } = await supabase
        .from(TABLES.WALLET_TRANSACTIONS)
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data || [];
    },
    enabled: !!(user?.id ?? session?.user?.id),
    retry: 1,
    staleTime: 0,
  });

  const walletBalance = transactions.reduce((bal, tx) => {
    if (tx.status !== 'approved') return bal;
    if (tx.type === 'deposit' || tx.type === 'refund') return bal + (tx.amount || 0);
    if (tx.type === 'deduction') return bal - (tx.amount || 0);
    return bal;
  }, 0);

  const method = paymentMethods.find(m => m.id === selectedMethod);

  const copyText = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'number') {
      setCopiedNumber(true);
      setTimeout(() => setCopiedNumber(false), 2000);
    } else {
      setCopiedTitle(true);
      setTimeout(() => setCopiedTitle(false), 2000);
    }
    toast.success('Copied to clipboard!');
  };

  const submitDeposit = useMutation({
    mutationFn: async () => {
      // Always get a fresh session — avoids stale React state issues
      const { data: { session: freshSession } } = await supabase.auth.getSession();
      const uid = freshSession?.user?.id ?? user?.id ?? session?.user?.id;
      if (!uid) throw new Error('Not logged in. Please refresh the page and log in.');
      const amt = Number(amount);
      if (!amt || amt <= 0) throw new Error('Please enter a valid amount');
      if (amt < 50) throw new Error('Minimum deposit amount is Rs 50');
      if (!reference.trim()) throw new Error('Please enter your Transaction ID');
      if (reference.trim().length < 4) throw new Error('Transaction ID seems too short');

      const { error } = await supabase.from(TABLES.WALLET_TRANSACTIONS).insert({
        user_id: uid,
        type: 'deposit',
        amount: amt,
        method: selectedMethod,
        status: 'pending',
        reference: reference.trim(),
        notes: `Deposit via ${method.name} | Account: ${method.number} | Title: ${method.accountTitle}`,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('✅ Deposit request submitted! Admin will approve within a few hours.');
      setAmount('');
      setReference('');
      queryClient.invalidateQueries({ queryKey: ['my-transactions'] });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to submit deposit');
    },
  });

  const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

  return (
    <div className="max-w-2xl mx-auto pb-10">

      {/* Header */}
      <div className="mb-6">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold">Add Funds</h1>
        <p className="text-muted-foreground mt-1 text-sm">Top up your wallet to start placing orders.</p>
      </div>

      {/* Balance Card */}
      <div className={`mb-6 rounded-2xl p-5 bg-gradient-to-r from-primary to-cyan-500 text-white shadow-lg shadow-primary/25`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-xs font-medium uppercase tracking-wider">Current Balance</p>
            <p className="font-heading text-3xl font-bold mt-1">Rs {walletBalance.toFixed(0)}</p>
            <p className="text-white/60 text-xs mt-1">{user?.email ?? session?.user?.email ?? '—'}</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Step 1 — Select Method */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">1</div>
          <p className="font-heading font-semibold">Select Payment Method</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {paymentMethods.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMethod(m.id)}
              className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                selectedMethod === m.id
                  ? `${m.activeBorder} ${m.activeBg} shadow-md`
                  : `${m.inactiveBorder} hover:border-border bg-card hover:shadow-sm`
              }`}
            >
              {selectedMethod === m.id && (
                <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </span>
              )}
              <m.IconComponent />
              <p className="font-heading font-bold text-sm mt-2">{m.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{m.accountTitle}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2 — Account Details */}
      {method && (
        <motion.div
          key={selectedMethod}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">2</div>
            <p className="font-heading font-semibold">Send Payment To</p>
          </div>

          <Card className="border-border/50 overflow-hidden">
            {/* Brand header */}
            <div className={`bg-gradient-to-r ${method.gradient} px-5 py-3 flex items-center gap-3`}>
              <method.IconComponent />
              <div>
                <p className="text-white font-heading font-bold">{method.name}</p>
                <p className="text-white/70 text-xs">Official Payment Account</p>
              </div>
            </div>

            <CardContent className="p-4 space-y-3">
              {/* Instructions */}
              <div className="bg-muted/50 rounded-xl p-3 text-xs text-muted-foreground leading-relaxed">
                <p className="font-semibold text-foreground mb-1">📋 How to send:</p>
                {method.instructions}
              </div>

              {/* Account Title */}
              <div className="flex items-center gap-3 bg-muted/30 rounded-xl p-3.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Account Title</p>
                  <p className="font-heading font-bold text-sm">{method.accountTitle}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyText(method.accountTitle, 'title')}
                  className="h-8 px-3 gap-1.5 text-xs"
                >
                  {copiedTitle ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                  {copiedTitle ? 'Copied!' : 'Copy'}
                </Button>
              </div>

              {/* Account Number */}
              <div className="flex items-center gap-3 bg-muted/30 rounded-xl p-3.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Hash className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Account Number</p>
                  <p className="font-heading font-bold text-lg tracking-wide">{method.number}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyText(method.number, 'number')}
                  className="h-9 px-4 gap-1.5 text-xs font-semibold"
                >
                  {copiedNumber ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedNumber ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 3 — Deposit Form */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">3</div>
          <p className="font-heading font-semibold">Enter Deposit Details</p>
        </div>

        <Card className="border-border/50">
          <CardContent className="p-5 space-y-4">
            {/* Quick Amounts */}
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Quick Select Amount (PKR)</Label>
              <div className="grid grid-cols-3 gap-2">
                {quickAmounts.map((qa) => (
                  <button
                    key={qa}
                    onClick={() => setAmount(String(qa))}
                    className={`py-2 rounded-xl text-sm font-semibold border transition-all ${
                      amount === String(qa)
                        ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                        : 'bg-muted/40 border-border/40 hover:border-primary/40 hover:bg-muted/60'
                    }`}
                  >
                    Rs {qa.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Amount (PKR) <span className="text-destructive">*</span></Label>
              <Input
                type="number"
                placeholder="Enter amount (min Rs 50)"
                value={amount}
                min={50}
                onChange={(e) => setAmount(e.target.value)}
                className="h-11 rounded-xl text-base font-semibold"
              />
            </div>

            {/* Transaction ID */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Transaction ID <span className="text-destructive">*</span></Label>
              <Input
                placeholder="Paste your payment Transaction ID here"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="h-11 rounded-xl"
              />
              <p className="text-[11px] text-muted-foreground">Copy the Transaction ID from your {method?.name} app after sending payment.</p>
            </div>

            {/* Security Note */}
            <div className="flex items-start gap-2 bg-amber-500/5 border border-amber-500/20 rounded-xl p-3">
              <Shield className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Secure & Verified.</span> Your deposit will be manually verified by admin. Funds are added within 1-3 hours after confirmation.
              </p>
            </div>

            {/* Submit */}
            <Button
              onClick={() => submitDeposit.mutate()}
              disabled={!amount || !reference.trim() || submitDeposit.isPending}
              className="w-full h-12 rounded-xl font-heading font-semibold text-base shadow-lg shadow-primary/25 gap-2"
            >
              {submitDeposit.isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Submitting Request...</>
              ) : (
                <>Submit Deposit Request <ArrowRight className="w-4 h-4" /></>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="font-heading text-base flex items-center gap-2">
            <Wallet className="w-4 h-4 text-primary" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <div className="divide-y divide-border/30">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="p-4"><Skeleton className="h-10" /></div>
            ))
          ) : transactions.length === 0 ? (
            <div className="p-10 text-center">
              <Wallet className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No transactions yet.</p>
            </div>
          ) : (
            transactions.slice(0, 20).map((tx) => {
              const sc = statusConfig[tx.status] || statusConfig.pending;
              const StatusIcon = sc.icon;
              const isDeposit = tx.type === 'deposit' || tx.type === 'refund';
              const methodLabel = tx.method === 'easypaisa' ? 'EasyPaisa' : tx.method === 'jazzcash' ? 'JazzCash' : tx.method;
              return (
                <div key={tx.id} className="px-4 py-3.5 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isDeposit ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                    {isDeposit
                      ? <CheckCircle2 className="w-4 h-4 text-green-500" />
                      : <Wallet className="w-4 h-4 text-red-500" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold capitalize">
                      {tx.type === 'deposit' ? '💰 Deposit' : tx.type === 'refund' ? '↩️ Refund' : '💸 Deduction'}
                      {methodLabel ? ` — ${methodLabel}` : ''}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                      {tx.reference && <span>Ref: {tx.reference} • </span>}
                      {tx.created_at ? format(new Date(tx.created_at), 'MMM d, yyyy HH:mm') : '—'}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-sm font-bold ${isDeposit ? 'text-green-500' : 'text-red-500'}`}>
                      {isDeposit ? '+' : '-'}Rs {tx.amount?.toFixed(0)}
                    </p>
                    <Badge variant="outline" className={`text-[9px] mt-1 ${sc.color} flex items-center gap-1`}>
                      <StatusIcon className="w-2.5 h-2.5" />
                      {sc.label}
                    </Badge>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
}