import { Reveal } from '@/lib/motion';
import { ArrowUpRight } from 'lucide-react';
const roles = [
  { year: '2025 — NOW', role: 'QA Officer · Amazon North America Campaign', company: 'Ibex Global', detail: 'Promoted from customer service agent; monitor voice and chat quality, coach agents and support CSAT and compliance.' },
  { year: '2024 — 2025', role: 'Founder / CEO', company: 'Godfather Burgers', detail: 'Built a food brand from concept, leading branding, operations, marketing and the team.' },
  { year: '2023 — 2024', role: 'Founder / CEO', company: 'Emirates WebMaster LLC', detail: 'Founded a UAE digital agency delivering websites, SEO and social media for small businesses.' },
  { year: '2018 — 2023', role: 'Regional Operations Manager', company: 'Leopards Courier Services', detail: 'Led regional delivery operations and KPI tracking; earned multiple Shields of Appreciation.' },
  { year: '2013 — 2018', role: 'SE Officer', company: 'TCS / Sentiments Express', detail: 'Coordinated courier operations; recognized with an Excellence Performance Award.' }
];
export default function Experience() {
  return <section id="experience" className="bg-[#F4F4F7] py-24 md:py-36"><div className="mx-auto max-w-[1600px] px-5 md:px-10 lg:px-16 grid lg:grid-cols-12 gap-10 lg:gap-16">
    <Reveal className="lg:col-span-4"><div><p className="section-kicker">A track record of doing</p><h2 className="section-title mt-5">Built through<br /><span className="text-[#D93F00]">experience.</span></h2><p className="mt-7 max-w-[350px] text-[#45454B] leading-relaxed">A career spanning customer care, entrepreneurship, digital services and operations.</p><a href="#contact" className="inline-flex gap-2 items-center mt-7 text-sm font-bold border-b border-black pb-2 hover:text-[#2A52BE]">Let&rsquo;s talk <ArrowUpRight size={17} /></a></div></Reveal>
    <div className="lg:col-span-8 border-t border-black/20">{roles.map((r, i) => <Reveal key={r.year} delay={i * 0.08}><div className="group border-b border-black/20 py-7 md:py-9 grid md:grid-cols-[130px_1fr_24px] gap-3 md:gap-6 transition-transform duration-300 hover:translate-x-2"><span className="text-[11px] font-bold tracking-[.12em] text-[#575757] pt-1">{r.year}</span><div><h3 className="text-xl md:text-[28px] tracking-tight leading-tight font-bold group-hover:text-[#2A52BE] transition-colors">{r.role}</h3><p className="text-xs font-bold uppercase tracking-[.13em] text-[#D93F00] mt-2">{r.company}</p><p className="text-sm text-[#45454B] leading-relaxed mt-3 max-w-[560px]">{r.detail}</p></div><ArrowUpRight className="hidden md:block text-[#A0A0A0] group-hover:text-[#2A52BE] group-hover:rotate-45 transition-all duration-300" size={20} /></div></Reveal>)}</div>
  </div></section>;
}