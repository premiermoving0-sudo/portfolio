import { useState } from 'react';
import Header from '@/components/portfolio/Header';
import Hero from '@/components/portfolio/Hero';
import TrustStrip from '@/components/portfolio/TrustStrip';
import About from '@/components/portfolio/About';
import Services from '@/components/portfolio/Services';
import HowIWork from '@/components/portfolio/HowIWork';
import Gallery from '@/components/portfolio/Gallery';
import Experience from '@/components/portfolio/Experience';
import CaseStudies from '@/components/portfolio/CaseStudies';
import Testimonials from '@/components/portfolio/Testimonials';
import Pricing from '@/components/portfolio/Pricing';
import BookingCalendar from '@/components/portfolio/BookingCalendar';
import FAQ from '@/components/portfolio/FAQ';
import Contact from '@/components/portfolio/Contact';
import WhatsAppButton from '@/components/portfolio/WhatsAppButton';
import { useSiteSettings } from '@/lib/useSiteSettings';

export default function Home() {
  const { settings } = useSiteSettings();
  const [service, setService] = useState('');
  const [mode, setMode] = useState('Per project');
  const selectService = (value) => { setService(value); document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' }); };
  return <main className="text-[#0A0A0B] overflow-x-hidden">
    <Header />
    <Hero settings={settings} />
    <TrustStrip />
    <About settings={settings} />
    <Services onSelect={selectService} />
    <HowIWork />
    <Gallery />
    <Experience />
    <CaseStudies />
    <Testimonials />
    <Pricing mode={mode} setMode={setMode} settings={settings} />
    <BookingCalendar settings={settings} mode={mode} service={service} />
    <FAQ />
    <Contact service={service} setService={setService} mode={mode} setMode={setMode} settings={settings} />
    <WhatsAppButton number={settings.whatsapp} />
  </main>;
}