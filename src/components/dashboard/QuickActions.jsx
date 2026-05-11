import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Wallet, ListOrdered, History, ArrowRight } from 'lucide-react';

const actions = [
  {
    label: 'Get Followers',
    desc: 'Social media followers',
    icon: Plus,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    hoverBg: 'group-hover:bg-blue-500',
    hoverText: 'group-hover:text-white',
    hoverArrow: 'group-hover:text-blue-500',
    to: '/services?category=followers',
  },
  {
    label: 'New Order',
    desc: '735+ services',
    icon: Plus,
    color: 'text-primary',
    bg: 'bg-primary/10',
    hoverBg: 'group-hover:bg-primary',
    hoverText: 'group-hover:text-primary-foreground',
    hoverArrow: 'group-hover:text-primary',
    to: '/new-order',
  },
  {
    label: 'Add Funds',
    desc: 'JazzCash & more',
    icon: Wallet,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    hoverBg: 'group-hover:bg-emerald-500',
    hoverText: 'group-hover:text-white',
    hoverArrow: 'group-hover:text-emerald-500',
    to: '/add-funds',
  },
  {
    label: 'Services',
    desc: 'Browse all',
    icon: ListOrdered,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    hoverBg: 'group-hover:bg-purple-500',
    hoverText: 'group-hover:text-white',
    hoverArrow: 'group-hover:text-purple-500',
    to: '/services',
  },
  {
    label: 'Order History',
    desc: 'View all orders',
    icon: History,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    hoverBg: 'group-hover:bg-orange-500',
    hoverText: 'group-hover:text-white',
    hoverArrow: 'group-hover:text-orange-500',
    to: '/orders',
  },
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {actions.map((action) => (
        <Link key={action.to} to={action.to}>
          <Card className="border-border/50 hover:border-border hover:shadow-md transition-all cursor-pointer group h-full">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${action.bg} flex items-center justify-center transition-all ${action.hoverBg} flex-shrink-0`}>
                <action.icon className={`w-4 h-4 ${action.color} transition-colors ${action.hoverText}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold font-heading leading-tight">{action.label}</p>
                <p className="text-[10px] text-muted-foreground">{action.desc}</p>
              </div>
              <ArrowRight className={`w-3.5 h-3.5 text-muted-foreground/40 transition-colors ${action.hoverArrow} flex-shrink-0`} />
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}