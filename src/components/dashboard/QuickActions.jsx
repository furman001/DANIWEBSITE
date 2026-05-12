import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Wallet, ListOrdered, History, ArrowRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const actions = [
  {
    label: 'New Order',
    desc: 'Launch a new growth campaign',
    path: '/new-order',
    icon: Plus,
    color: 'bg-primary',
    textColor: 'text-primary-foreground',
    delay: 0.1
  },
  {
    label: 'Add Funds',
    desc: 'Instant wallet top-up via local methods',
    path: '/add-funds',
    icon: Wallet,
    color: 'bg-emerald-500',
    textColor: 'text-white',
    delay: 0.2
  },
  {
    label: 'Services',
    desc: 'Browse our full catalog of solutions',
    path: '/services',
    icon: ListOrdered,
    color: 'bg-amber-500',
    textColor: 'text-white',
    delay: 0.3
  },
  {
    label: 'Order History',
    desc: 'Track and manage your active orders',
    path: '/orders',
    icon: History,
    color: 'bg-indigo-500',
    textColor: 'text-white',
    delay: 0.4
  },
];

export default function QuickActions() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-black tracking-tight uppercase">Quick Command</h2>
        <div className="h-px flex-1 bg-border/50 mx-4" />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {actions.map((action) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: action.delay }}
          >
            <Link to={action.path} className="group block">
              <div className="premium-card p-6 rounded-[2.5rem] bg-card hover:bg-muted/50 transition-all duration-500 relative overflow-hidden h-full">
                {/* Accent line */}
                <div className={`absolute top-0 left-0 w-full h-1 ${action.color} opacity-20`} />
                
                <div className="flex flex-col h-full">
                  <div className={`w-12 h-12 rounded-2xl ${action.color} ${action.textColor} flex items-center justify-center mb-6 shadow-lg shadow-black/5 group-hover:scale-110 transition-transform duration-500`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-heading font-black text-lg tracking-tight leading-none group-hover:text-primary transition-colors">
                      {action.label}
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium line-clamp-2">
                      {action.desc}
                    </p>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-border/50 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-2 group-hover:translate-x-0">
                      Execute Action
                    </span>
                    <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}