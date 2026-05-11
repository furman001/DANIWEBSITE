import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CreditCard, Smartphone, Building2, ArrowRight } from 'lucide-react';

const methods = [
  { icon: Smartphone, name: 'JazzCash', number: '+923333945955', color: 'text-red-500', bg: 'bg-red-500/10' },
  { icon: Smartphone, name: 'Easypaisa', number: '+923333945955', color: 'text-green-500', bg: 'bg-green-500/10' },
  { icon: Building2, name: 'Bank Transfer', number: 'Contact Support', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { icon: CreditCard, name: 'Perfect Money', number: 'Available', color: 'text-purple-500', bg: 'bg-purple-500/10' },
];

export default function PaymentSection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">Payment Options</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mt-3 mb-4">
              Seamless <span className="text-primary">Transactions</span>
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              We know different people have various payment options so we've covered most of them. 
              Whether you use Easypaisa, JazzCash, Perfect Money, or Bank Transfer — we've got you covered.
            </p>
            <Link to="/add-funds">
              <Button size="lg" className="font-heading font-semibold shadow-lg shadow-primary/25 px-8">
                Add Funds Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {methods.map((method, i) => (
              <motion.div
                key={method.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-5 border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all"
              >
                <div className={`w-11 h-11 rounded-xl ${method.bg} flex items-center justify-center mb-3`}>
                  <method.icon className={`w-5 h-5 ${method.color}`} />
                </div>
                <h3 className="font-heading font-bold text-sm">{method.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{method.number}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}