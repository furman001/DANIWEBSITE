import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CreditCard, Smartphone, Building2, ArrowRight, ShieldCheck } from 'lucide-react';

const methods = [
  { icon: Smartphone, name: 'JazzCash', number: '+923333945955', color: 'text-primary' },
  { icon: Smartphone, name: 'Easypaisa', number: '+923333945955', color: 'text-primary' },
  { icon: Building2, name: 'Bank Transfer', number: 'Contact Support', color: 'text-primary' },
  { icon: CreditCard, name: 'Perfect Money', number: 'Available', color: 'text-primary' },
];

export default function PaymentSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-background">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-xl"
          >
            <div className="flex items-center gap-2 mb-6">
               <div className="h-px w-8 bg-primary" />
               <span className="text-xs font-bold text-primary uppercase tracking-[0.2em]">Secure Payments</span>
            </div>
            
            <h2 className="font-heading text-4xl sm:text-5xl font-black tracking-tight mb-8 leading-tight">
              Flexible & Secure <br />
              <span className="text-primary">Payment Options</span>
            </h2>
            
            <p className="text-lg text-muted-foreground font-medium mb-10 leading-relaxed">
              We've integrated Pakistan's most popular payment gateways to ensure 
              your transactions are fast, secure, and hassle-free.
            </p>
            
            <div className="space-y-4 mb-10">
              {[
                "Instant balance update",
                "No hidden transaction fees",
                "256-bit encrypted security",
                "24/7 dedicated payment support"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-sm font-semibold">{item}</span>
                </div>
              ))}
            </div>

            <Link to="/add-funds">
              <Button size="lg" className="h-16 px-10 text-lg font-bold rounded-2xl shadow-2xl shadow-primary/30 group">
                Add Funds Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {methods.map((method, i) => (
              <motion.div
                key={method.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative p-8 rounded-[2rem] bg-card border border-border/50 hover:border-primary/30 hover:shadow-2xl transition-all duration-500"
              >
                <div className="absolute top-4 right-4 w-12 h-12 bg-primary/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className={`w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500`}>
                  <method.icon className="w-7 h-7" />
                </div>
                
                <h3 className="font-heading font-black text-lg tracking-tight mb-2">{method.name}</h3>
                <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">{method.number}</p>
              </motion.div>
            ))}
            
            {/* Trust badge card */}
            <div className="sm:col-span-2 bg-primary/5 border border-primary/10 rounded-[2rem] p-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-sm">Verified Merchant</div>
                  <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Safe & Secure</div>
                </div>
              </div>
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted" />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}