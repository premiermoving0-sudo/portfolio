import { Reveal } from '@/lib/motion';
import { ArrowRight } from 'lucide-react';
const steps = [
  { no: '01', title: 'Discover', desc: 'We talk through your goals, audience and challenges. I ask questions, listen, and define what success looks like for your business.' },
  { no: '02', title: 'Plan', desc: 'I map the scope, timeline and deliverables. You get a clear proposal with milestones and pricing — no surprises, no vague promises.' },
  { no: '03', title: 'Execute', desc: 'I get to work — whether it is support workflows, brand assets, a website or ad campaigns — with regular updates and open communication.' },
  { no: '04', title: 'Deliver & refine', desc: 'You receive the work, we review it together, and I refine based on your feedback until it is exactly right. Then we plan what is next.' }
];
export default function HowIWork() {
  return <section id="process" className="bg-[#0A0A0B] text-white py-24 md:py-36 overflow-hidden"><div className="mx-auto max-w-[1600px] px-5 md:px-10 lg:px-16">
    <Reveal><div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14 md:mb-20"><div><p className="section-kicker text-[#8DA6EF]">How I work</p><h2 className="section-title mt-5 text-white">A simple,<br /><span className="text-[#FF7040]">honest process.</span></h2></div><p className="max-w-[360px] text-white/70 leading-relaxed">No jargon, no mystery. Just a clear path from first conversation to finished work.</p></div></Reveal>
    <div className="grid md:grid-cols-4 gap-px bg-white/15 border border-white/15 rounded-2xl overflow-hidden">
      {steps.map((s, i) => <Reveal key={s.no} delay={i * 0.1} className="bg-[#0A0A0B]"><div className="p-7 lg:p-9 min-h-[260px] flex flex-col h-full"><div className="flex items-center justify-between"><span className="text-5xl font-black tracking-tighter text-white/40 group-hover:text-white/70 transition-colors">{s.no}</span>{i < steps.length - 1 && <ArrowRight className="text-[#FF7040]" size={22} />}</div><h3 className="mt-auto pt-10 text-2xl font-bold tracking-tight">{s.title}</h3><p className="mt-3 text-sm text-white/70 leading-relaxed">{s.desc}</p></div></Reveal>)}
    </div>
  </div></section>;
}