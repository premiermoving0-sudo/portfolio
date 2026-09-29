import { api } from '@/lib/api';

import { useEffect, useState } from 'react';
import { Loader2, Star } from 'lucide-react';

import { Reveal } from '@/lib/motion';
const initials = (name) => name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
export default function Testimonials() {
  const [items, setItems] = useState(null);
  useEffect(() => { (async () => { try { const list = await api.entities.Testimonial.list('-order_index', 20); setItems(list); } catch { setItems([]); } })(); }, []);
  return <section id="testimonials" className="bg-white py-24 md:py-36"><div className="mx-auto max-w-[1600px] px-5 md:px-10 lg:px-16">
    <Reveal><div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 md:mb-16"><div><p className="section-kicker">Kind words</p><h2 className="section-title mt-5">What clients<br /><span className="text-[#D93F00]">say about me.</span></h2></div><p className="max-w-[360px] text-[#45454B] leading-relaxed">Real feedback from people I&rsquo;ve worked with across support, branding and digital.</p></div></Reveal>
    {!items ? <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#2A52BE]" size={28} /></div> : items.length === 0 ? <Reveal><div className="text-center max-w-md mx-auto py-12"><p className="text-lg font-bold text-[#0A0A0B]">References available on request</p><p className="mt-3 text-sm text-[#45454B] leading-relaxed">I&rsquo;m happy to connect you with past clients and colleagues for honest feedback. Reach out and I&rsquo;ll share the right reference for your project.</p><a href="#book" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#0A0A0B] text-white px-5 py-3 text-sm font-bold hover:bg-[#2A52BE] transition-colors">Request a reference</a></div></Reveal>
    : <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7">{items.map((t, i) => <Reveal key={t.id} delay={(i % 3) * 0.1} className="h-full"><figure className="h-full bg-[#F4F4F7] rounded-2xl p-7 lg:p-8 flex flex-col border border-black/8"><div className="flex gap-1 mb-5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} className={i < (t.rating || 5) ? 'fill-[#D93F00] text-[#D93F00]' : 'text-black/15'} />)}</div><blockquote className="text-lg leading-relaxed text-[#1a1a1f] flex-1">“{t.quote}”</blockquote><figcaption className="mt-6 flex items-center gap-3 border-t border-black/10 pt-5"><span className="w-11 h-11 rounded-full bg-[#0A0A0B] text-white flex items-center justify-center font-bold text-sm">{initials(t.client_name)}</span><span><span className="block font-bold text-sm">{t.client_name}</span>{t.role && <span className="block text-xs text-[#45454B]">{t.role}</span>}</span></figcaption></figure></Reveal>)}</div>}
  </div></section>;
}