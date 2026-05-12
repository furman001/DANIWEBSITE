import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Heart } from 'lucide-react';

const testimonials = [
  {
    name: 'Ahmed Khan',
    role: 'TikTok Creator',
    text: 'Pak SMM Portal transformed my social media game! Their TikTok services are incredibly fast and affordable. Got 10K followers within hours!',
    rating: 5,
    avatar: 'A'
  },
  {
    name: 'Sarah Ali',
    role: 'Instagram Influencer',
    text: 'Best SMM panel in Pakistan hands down. The Instagram likes and followers are real quality. Customer support is amazing too!',
    rating: 5,
    avatar: 'S'
  },
  {
    name: 'Hassan Raza',
    role: 'Business Owner',
    text: 'We use Pak SMM Portal for all our clients. The API integration is smooth, prices are the cheapest, and delivery is always on time.',
    rating: 5,
    avatar: 'H'
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-32 relative overflow-hidden bg-background">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -ml-48 -mb-48" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4"
          >
            <Heart className="w-3 h-3 text-primary fill-current" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Trusted by 23K+ Users</span>
          </motion.div>
          <h2 className="font-heading text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Loved by <span className="text-primary italic">Creators</span> & <br className="hidden sm:block" /> Businesses Alike.
          </h2>
          <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our community has to say about their growth journey with us.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group relative bg-card p-10 rounded-[3rem] border border-border/50 hover:border-primary/30 premium-shadow hover:-translate-y-2 transition-all duration-500"
            >
              <div className="absolute top-8 right-8">
                 <Quote className="w-12 h-12 text-primary/5 group-hover:text-primary/10 transition-colors" />
              </div>
              
              <div className="flex items-center gap-1 mb-8">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              
              <p className="text-lg font-medium text-foreground leading-relaxed mb-10 relative z-10 italic">
                "{t.text}"
              </p>
              
              <div className="flex items-center gap-4 pt-8 border-t border-border/50">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary text-xl group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="font-heading font-black text-base tracking-tight leading-none mb-1">{t.name}</h4>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}