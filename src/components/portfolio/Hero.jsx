import { useState } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { Magnetic, CountUp, Reveal } from '@/lib/motion';

const Word = ({ children, className = '' }) => {
  const [hover, setHover] = useState(false);
  return <span onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className={`inline-block transition-transform duration-300 ${hover ? '-skew-x-6 text-[#2A52BE]' : ''} ${className}`}>{children}</span>;
};

export default function Hero({ settings }) {
  const [focus, setFocus] = useState('');
  return <section id="top" className={`relative overflow-hidden pt-[76px] transition-colors duration-500 ${focus === 'agent' ? 'bg-[#E8EFFC]' : focus === 'architect' ? 'bg-[#FFF0E9]' : 'bg-[#F4F4F7]'}`}>
    <div className="absolute inset-0 pointer-events-none portfolio-grid opacity-40" />
    <div className="relative mx-auto max-w-[1600px] px-5 md:px-10 lg:px-16 pt-9 md:pt-14">
      <div className="flex items-center justify-between border-b border-black/15 pb-4 text-[11px] md:text-xs font-bold uppercase tracking-[.18em] text-[#575757]"><span>Independent professional / agency owner</span><span className="hidden sm:block">{settings.location}</span><span className="sm:hidden">Remote worldwide</span></div>
      <div className="relative pt-9 lg:pt-14 lg:min-h-[680px]">
        <p className="text-[11px] font-bold tracking-[.24em] uppercase text-[#2A52BE] mb-5">Hello, I&rsquo;m {settings.hero_name}</p>
        <h1 className="relative z-20 pointer-events-auto max-w-[1200px] font-black uppercase tracking-[-.085em] leading-[.82] text-[clamp(76px,12vw,200px)]">
          <Word>People</Word><span className="text-[#2A52BE]">.</span><br />
          <span className="lg:ml-[10%]"><Word>Pixels</Word><span className="text-[#FF4D00]">.</span></span><br />
          <Word>Progress</Word><span className="text-[#2A52BE]">.</span>
        </h1>
        <div className="relative z-30 mt-8 lg:mt-9 grid grid-cols-2 gap-2 max-w-[510px]" onMouseLeave={() => setFocus('')}>
          <button onMouseEnter={() => setFocus('agent')} onFocus={() => setFocus('agent')} onClick={() => setFocus('agent')} className={`text-left border-l-2 pl-4 py-2 transition-all ${focus === 'agent' ? 'border-[#2A52BE] text-[#2A52BE]' : 'border-black/25 text-[#575757]'}`}><span className="block text-[10px] uppercase tracking-[.18em] font-bold">01 / The agent</span><span className="block mt-1 text-sm font-semibold">Voice · Chat · USA support</span></button>
          <button onMouseEnter={() => setFocus('architect')} onFocus={() => setFocus('architect')} onClick={() => setFocus('architect')} className={`text-left border-l-2 pl-4 py-2 transition-all ${focus === 'architect' ? 'border-[#FF4D00] text-[#FF4D00]' : 'border-black/25 text-[#575757]'}`}><span className="block text-[10px] uppercase tracking-[.18em] font-bold">02 / The architect</span><span className="block mt-1 text-sm font-semibold">Brand · Web · Ads</span></button>
        </div>
        <div className="relative lg:absolute lg:right-[4%] lg:top-[4%] mt-9 lg:mt-0 w-full max-w-[390px] h-[430px] lg:h-[520px] mx-auto lg:mx-0 bg-[#0A0A0B] overflow-hidden rounded-t-[190px] rounded-b-[16px] shadow-[25px_25px_0_#E2E5ED] group">
          {!settings.cover_image_url && <div className="absolute inset-0 flex items-center justify-center text-white/15 text-[140px] font-black tracking-tighter select-none">{(settings.hero_name || '').split(' ').map(w => w[0]).slice(0, 2).join('')}</div>}
          <Image src={settings.cover_image_url} alt={`Portrait of ${settings.hero_name}`} className={`w-full h-full object-cover object-[center_25%] transition-all duration-700 group-hover:scale-105 ${focus === 'architect' ? 'sepia-[.18] contrast-125' : ''}`} focalPointX={0.5} focalPointY={0.25} />
          <div className="absolute inset-x-0 bottom-0 p-5 pt-16 bg-gradient-to-t from-black/85 to-transparent text-white"><span className="text-[10px] uppercase tracking-[.2em] font-bold text-white/70">The person behind the work</span><p className="text-xl font-bold">{settings.hero_name} <span className="text-[#FF4D00]">↗</span></p></div>
        </div>
        <div className="relative z-20 mt-8 lg:mt-10 pb-14 lg:pb-20 flex flex-col sm:flex-row sm:items-end gap-8 justify-between lg:max-w-[56%]">
          <div><p className="max-w-[460px] text-lg md:text-xl leading-relaxed text-[#45454B]">{settings.hero_subtext}</p>
            <Magnetic className="mt-7"><a href="#book" className="inline-flex gap-3 items-center bg-[#0A0A0B] text-white rounded-full px-7 py-4 text-sm font-bold hover:bg-[#2A52BE] transition-colors">Let&rsquo;s work together <ArrowUpRight size={18} /></a></Magnetic>
          </div>
          <a href="#about" className="flex shrink-0 items-center gap-2 uppercase text-[11px] tracking-[.2em] font-bold hover:text-[#2A52BE] transition-colors">Scroll to explore <ArrowDownRight size={18} /></a>
        </div>
      </div>
    </div>
    <div className="border-y border-black/15 bg-white/60"><div className="mx-auto max-w-[1600px] px-5 md:px-10 lg:px-16 grid grid-cols-2 md:grid-cols-4 divide-x divide-black/10">
      <Reveal><div className="py-6 pr-4"><strong className="text-2xl md:text-3xl font-black tracking-tighter"><CountUp to={8} suffix="+" /></strong><p className="text-[11px] uppercase tracking-widest text-[#575757] mt-1">Years across operations</p></div></Reveal>
      <Reveal delay={0.1}><div className="py-6 pl-4 md:pl-7"><strong className="text-2xl md:text-3xl font-black tracking-tighter"><CountUp to={2} pad={2} /></strong><p className="text-[11px] uppercase tracking-widest text-[#575757] mt-1">Ventures founded</p></div></Reveal>
      <Reveal delay={0.2}><div className="py-6 pr-4 md:pl-7 border-t md:border-t-0 border-black/10"><strong className="text-2xl md:text-3xl font-black tracking-tighter">USA</strong><p className="text-[11px] uppercase tracking-widest text-[#575757] mt-1">Customer support focus</p></div></Reveal>
      <Reveal delay={0.3}><div className="py-6 pl-4 md:pl-7 border-t md:border-t-0 border-black/10"><strong className="text-2xl md:text-3xl font-black tracking-tighter"><CountUp to={3} pad={2} /></strong><p className="text-[11px] uppercase tracking-widest text-[#575757] mt-1">Ways to collaborate</p></div></Reveal>
    </div></div>
  </section>;
}