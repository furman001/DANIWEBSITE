import React from 'react';
import HeroSection from '../components/home/HeroSection';
import StatsSection from '../components/home/StatsSection';
import HowItWorks from '../components/home/HowItWorks';
import FeaturesSection from '../components/home/FeaturesSection';
import PaymentSection from '../components/home/PaymentSection';
import TestimonialsSection from '../components/home/TestimonialsSection';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <StatsSection />
      <HowItWorks />
      <FeaturesSection />
      <PaymentSection />
      <TestimonialsSection />
    </div>
  );
}