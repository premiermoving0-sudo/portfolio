import { Reveal } from '@/lib/motion';
import { ArrowUpRight } from 'lucide-react';
const skills = [['Support', ['Voice & chat (USA)', 'QA & coaching', 'CSAT & compliance']], ['Creative', ['Brand identity', 'Web design', 'Ad campaigns']], ['Operations', ['Team leadership', 'Vendor management', 'KPI tracking']]];
export default function About({ settings }) {
  return <section id="about" className="bg-[#0A0A0B] text-white py-24 md:py-36 overflow-hidden">
    <div className="mx-auto max-w-[1600px] px-5 md:px-10 lg:px-16 grid lg:grid-cols-12 gap-10 lg:gap-16">
      <Reveal className="lg:col-span-4"><div><p className="section-kicker text-[#8DA6EF]">The dual perspective</p><div className="mt-10 grid grid-cols-3 gap-3">{skills.map(([group, items]) => <div key={group}><span className="text-[10px] uppercase tracking-[.16em] font-bold text-[#FF7040]">{group}</span><ul className="mt-3 space-y-1.5">{items.map(it => <li key={it} className="text-xs text-white/70 leading-snug">{it}</li>)}</ul></div>)}</div><p className="mt-8 text-white/60 max-w-xs text-sm leading-relaxed">Built on the belief that great experiences need both a human touch and sharp execution.</p></div></Reveal>
      <Reveal className="lg:col-span-8" delay={0.1}><div><h2 className="text-[clamp(44px,6vw,96px)] font-black tracking-[-.07em] leading-[1.04]">The agent who <span className="text-[#8DA6EF]">listens.</span><br />The owner who <span className="text-[#FF7040]">builds.</span></h2><div className="mt-10 grid md:grid-cols-2 gap-8 border-t border-white/20 pt-8 text-white/75 text-base leading-[1.75]"><p>{settings.about_text_1}</p><p>{settings.about_text_2}</p></div>{settings.resume_url && <a href={settings.resume_url} target="_blank" rel="noopener noreferrer" className="mt-9 inline-flex items-center gap-2 border-b border-white pb-2 text-sm font-bold hover:text-[#FF7040] transition-colors">View my CV <ArrowUpRight size={17} /></a>}</div></Reveal>
    </div>
  </section>;
}