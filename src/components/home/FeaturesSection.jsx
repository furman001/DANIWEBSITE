import React from 'react';
import { motion } from 'framer-motion';
import { Award, Layers, BadgeDollarSign, HeartHandshake, Zap, Headphones, CheckCircle2, ArrowRight } from 'lucide-react';

const features = [
  { icon: Award, title: 'Established Excellence', desc: 'Recognized as the leading SMM panel, consistently delivering exceptional results over the years.' },
  { icon: Layers, title: 'Diverse Services', desc: 'From Facebook to TikTok, our comprehensive range of services caters to all your social media needs.' },
  { icon: BadgeDollarSign, title: 'Budget-Friendly Rates', desc: 'High-quality services that strike a perfect balance between affordability and excellence.' },
  { icon: HeartHandshake, title: 'Customer-Focused', desc: 'We prioritize your needs, customizing our services to align with your specific goals.' },
  { icon: Zap, title: 'Swift Outcomes', desc: 'Delivering rapid results — crafting our services to align with your specific goals and timelines.' },
  { icon: Headphones, title: 'Exceptional Support', desc: 'Providing unmatched support tailored to meet your specific goals and ensure satisfaction.' },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-muted/30" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-widest">Why Choose Us</span>
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl font-black tracking-tight mb-6 leading-[1.1]">
              Unlocking Your <br />
              <span className="text-primary">Social Success</span>
            </h2>
            <p className="text-lg text-muted-foreground font-medium max-w-xl">
              Elevate your presence with the world's most trusted SMM panel. 
              We combine cutting-edge technology with unmatched service.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="hidden md:block"
          >
             <div className="bg-primary px-8 py-4 rounded-3xl text-primary-foreground font-bold shadow-2xl shadow-primary/30">
                100% Satisfaction Guaranteed
             </div>
          </motion.div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group p-10 rounded-[2.5rem] bg-card border border-border/50 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 relative overflow-hidden"
            >
              {/* Card Decoration */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 group-hover:bg-primary/10 transition-colors" />
              
              <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-sm">
                <feature.icon className="w-6 h-6" />
              </div>
              
              <h3 className="font-heading font-black text-xl mb-4 tracking-tight group-hover:text-primary transition-colors">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed font-medium">
                {feature.desc}
              </p>
              
              <div className="mt-8 pt-8 border-t border-border/50 flex items-center text-primary font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                Learn more <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}