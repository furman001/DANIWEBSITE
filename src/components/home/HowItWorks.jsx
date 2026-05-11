import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserPlus, Wallet, ShoppingCart, PartyPopper, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Create Your Account',
    desc: 'Create your account by entering your Username, Email, and Password — begin your journey to success.',
  },
  {
    number: '02',
    icon: Wallet,
    title: 'Add Funds Securely',
    desc: 'Power up your success journey via JazzCash, Easypaisa, or Bank Transfer payment options.',
  },
  {
    number: '03',
    icon: ShoppingCart,
    title: 'Place Your Order',
    desc: 'Select your services and enter your profile or desired service link correctly, then submit.',
  },
  {
    number: '04',
    icon: PartyPopper,
    title: 'Enjoy Your Results',
    desc: 'Sit back, relax, and experience the transformation unfold as your success journey begins!',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-xs font-semibold text-primary uppercase tracking-widest">How it works?</span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mt-3 mb-4">
            Your Success Journey in <span className="text-primary">Four Simple Steps</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Getting famous on big social media platforms is everyone's dream. With a few clicks, you can do this from our website.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative bg-card rounded-2xl p-6 border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:shadow-lg group-hover:shadow-primary/25 transition-all duration-300">
                  <step.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <span className="font-heading text-4xl font-black text-muted/80">{step.number}</span>
              </div>
              <h3 className="font-heading font-bold text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/dashboard">
            <Button size="lg" className="font-heading font-semibold shadow-lg shadow-primary/25 px-8">
              Create An Account
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}