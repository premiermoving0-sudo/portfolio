import { api } from '@/lib/api';

import { useEffect, useState } from 'react';
import { ArrowUpRight, Loader2 } from 'lucide-react';

import { Image } from '@/components/ui/image';
import { Reveal } from '@/lib/motion';
export default function Gallery() {
  const [projects, setProjects] = useState(null);
  const [filter, setFilter] = useState('All');
  useEffect(() => { (async () => { try { const list = await api.entities.Project.list('-order_index', 50); setProjects(list); } catch { setProjects([]); } })(); }, []);
  const categories = ['All', ...new Set((projects || []).map(p => p.category).filter(Boolean))];
  const shown = (projects || []).filter(p => filter === 'All' || p.category === filter);
  return <section id="work" className="bg-white py-24 md:py-36"><div className="mx-auto max-w-[1600px] px-5 md:px-10 lg:px-16">
    <Reveal><div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10 md:mb-14"><div><p className="section-kicker">Selected work</p><h2 className="section-title mt-5">Things I&rsquo;ve<br /><span className="text-[#2A52BE]">built & shaped.</span></h2></div>{projects && categories.length > 1 && <div className="flex flex-wrap gap-2">{categories.map(c => <button key={c} onClick={() => setFilter(c)} className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[.1em] border transition-colors ${filter === c ? 'bg-[#0A0A0B] text-white border-[#0A0A0B]' : 'border-black/15 hover:border-black'}`}>{c}</button>)}</div>}</div></Reveal>
    {!projects ? <div className="flex justify-center py-24"><Loader2 className="animate-spin text-[#2A52BE]" size={28} /></div> : shown.length === 0 ? <p className="text-center text-[#575757] py-20">Projects coming soon.</p> :
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7">{shown.map((p, i) => <Reveal key={p.id} delay={(i % 3) * 0.1} className="h-full"><article className="group h-full bg-white rounded-2xl overflow-hidden border border-black/8 hover:shadow-[0_24px_50px_-20px_rgba(10,10,11,.25)] hover:-translate-y-1 transition-all duration-300">
      <div className="relative h-56 overflow-hidden bg-[#E2E5ED]">{p.image_url && <Image src={p.image_url} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" fittingType="fill" focalPointX={0.5} focalPointY={0.5} />}{p.category && <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-[.1em] bg-white/90 text-[#0A0A0B] rounded-full px-3 py-1.5 backdrop-blur transition-transform duration-300 group-hover:-translate-y-0.5">{p.category}</span>}</div>
      <div className="p-6"><h3 className="text-xl font-bold tracking-tight">{p.title}</h3>{p.description && <p className="mt-2 text-sm text-[#45454B] leading-relaxed line-clamp-3">{p.description}</p>}
      {p.link ? <a href={p.link.startsWith('http') ? p.link : `https://${p.link}`} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[.13em] text-[#2A52BE] hover:text-[#D93F00]">View project <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></a>
      : <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[.13em] text-[#8a8a8f]">Case on request <ArrowUpRight size={15} /></span>}
      </div></article></Reveal>)}</div>}
  </div></section>;
}