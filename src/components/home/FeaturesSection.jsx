import React from 'react';
import { motion } from 'framer-motion';
import { Award, Layers, BadgeDollarSign, HeartHandshake, Zap, Headphones } from 'lucide-react';

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
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-xs font-semibold text-primary uppercase tracking-widest">Why Choose Us</span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mt-3 mb-4">
            Unlocking Our <span className="text-primary">Success</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Elevate your social media presence with the ultimate SMM panel provider.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-card rounded-2xl p-6 border border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:shadow-lg group-hover:shadow-primary/25 transition-all">
                <feature.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-heading font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}