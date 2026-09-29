import { Reveal } from '@/lib/motion';
import { Check } from 'lucide-react';
const split = (s) => (s || '').split('\n').map(x => x.trim()).filter(Boolean);
const payouts = ['Local US Bank', 'Wise', 'Remitly', 'Payoneer'];
export default function Pricing({ mode, setMode, settings }) {
  const plans = [
    { name: 'Per Hour', price: settings.hourly_price, unit: '/ hour', tag: 'Flexible support', accent: '#2A52BE', features: split(settings.hourly_features) },
    { name: 'Per Project', price: settings.project_price, unit: 'quote', tag: 'Most popular', accent: '#D93F00', popular: true, features: split(settings.project_features) },
    { name: 'Full-Time', price: settings.fulltime_price, unit: '/ month', tag: 'Dedicated', accent: '#0A0A0B', features: split(settings.fulltime_features) }
  ];
  return <section id="pricing" className="bg-white py-24 md:py-36"><div className="mx-auto max-w-[1600px] px-5 md:px-10 lg:px-16">
    <Reveal><div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 md:mb-16"><div><p className="section-kicker">Clear, flexible pricing</p><h2 className="section-title mt-5">Pick how<br /><span className="text-[#D93F00]">we work.</span></h2></div><p className="max-w-[360px] text-[#45454B] leading-relaxed">Transparent rates for every kind of collaboration. Need something specific? Let&rsquo;s talk.</p></div></Reveal>
    <div className="grid md:grid-cols-3 gap-5 lg:gap-7">
      {plans.map((p, i) => <Reveal key={p.name} delay={i * 0.1} className="h-full"><article className={`h-full rounded-2xl p-7 lg:p-9 flex flex-col border transition-all duration-300 hover:-translate-y-1 ${p.popular ? 'bg-[#0A0A0B] text-white border-[#0A0A0B] md:-translate-y-4 shadow-[0_30px_60px_-20px_rgba(10,10,11,.4)]' : 'bg-[#F4F4F7] border-black/10 hover:border-black/30'}`}>
        {p.popular && <span className="absolute -top-3 left-7 bg-[#D93F00] text-white text-[10px] font-bold uppercase tracking-[.15em] px-3 py-1.5 rounded-full">{p.tag}</span>}
        <div className="flex items-baseline justify-between"><h3 className="text-xl font-bold">{p.name}</h3>{!p.popular && <span className="text-[10px] uppercase tracking-[.15em] font-bold text-[#575757]">{p.tag}</span>}</div>
        <div className="mt-6 flex items-end gap-1"><span className="text-4xl md:text-5xl font-black tracking-tighter" style={{ color: p.popular ? '#fff' : p.accent }}>{p.price}</span><span className={`text-sm font-semibold mb-1.5 ${p.popular ? 'text-white/55' : 'text-[#575757]'}`}>{p.unit}</span></div>
        <ul className="mt-7 space-y-3 flex-1">{p.features.map(f => <li key={f} className="flex gap-3 text-sm leading-relaxed"><Check size={18} className="shrink-0 mt-0.5" style={{ color: p.popular ? '#FF7040' : p.accent }} /><span className={p.popular ? 'text-white/80' : 'text-[#45454B]'}>{f}</span></li>)}</ul>
        <button onClick={() => setMode(p.name)} aria-pressed={mode === p.name} className={`mt-8 w-full rounded-full py-4 text-sm font-bold transition-colors ${mode === p.name ? 'bg-[#D93F00] text-white' : p.popular ? 'bg-white text-black hover:bg-[#D93F00] hover:text-white' : 'bg-[#0A0A0B] text-white hover:bg-[#2A52BE]'}`}>{mode === p.name ? 'Selected ✓' : `Choose ${p.name}`}</button>
      </article></Reveal>)}
    </div>
    <Reveal delay={0.2}><div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-[#F4F4F7] border border-black/10 px-6 py-5"><p className="text-sm text-[#45454B]"><span className="font-bold text-[#0A0A0B]">Ways to pay:</span> {payouts.join(' · ')}</p><p className="text-xs text-[#575757]">Rates are starting estimates — <a href="#book" className="font-bold text-[#2A52BE] hover:underline">book a call</a> for a quote.</p></div></Reveal>
  </div></section>;
}