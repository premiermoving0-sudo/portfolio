import { api } from '@/lib/api';

import { useState } from 'react';
import { ArrowUpRight, Mail, Phone, Loader2, Check, MessageCircle } from 'lucide-react';
import { Reveal } from '@/lib/motion';

import GlobalBridge from '@/components/portfolio/GlobalBridge';
const modes = ['Per hour', 'Per project', 'Full-time'];
const socials = [['LinkedIn', 'https://www.linkedin.com/in/mianadeelhafeez/'], ['Facebook', 'https://www.facebook.com/MianMAdeelHafeez'], ['Instagram', 'https://www.instagram.com/mmahwrites/']];
export default function Contact({ service, setService, mode, setMode, settings }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');
  const waText = encodeURIComponent(`Hi Adeel, I'm interested in ${mode.toLowerCase()} work${service ? ` (${service})` : ''}.`);
  const submit = async () => {
    if (!form.name || !form.email || !form.message) return;
    setStatus('loading');
    try {
      await api.contact.send({ name: form.name, email: form.email, mode, service, message: form.message });
      setStatus('done');
    } catch { setStatus('error'); }
  };
  return <footer id="contact" className="bg-[#0A0A0B] text-white pt-24 md:pt-36 overflow-hidden"><div className="mx-auto max-w-[1600px] px-5 md:px-10 lg:px-16">
    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
      <Reveal><div><p className="section-kicker text-[#8DA6EF]">Let&rsquo;s make it happen</p><h2 className="text-[clamp(53px,7vw,110px)] font-black tracking-[-.075em] leading-[.98] mt-6">Your next<br /><span className="text-[#FF4D00]">move starts</span><br />here.</h2><p className="text-white/70 max-w-[430px] mt-8 leading-relaxed">Available remotely for flexible collaborations with businesses in the USA and beyond. Tell me what you&rsquo;re building.</p>
        <div className="mt-8 space-y-3"><a href={`mailto:${settings.email}`} className="flex items-center gap-2 text-sm hover:text-[#FF7040]"><Mail size={16} /> {settings.email}</a><a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-sm hover:text-[#FF7040]"><Phone size={16} /> {settings.phone}</a></div>
      </div></Reveal>
      <Reveal delay={0.1}><div className="lg:pt-12">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-white/60 mb-5">01 — How would you like to work?</p>
        <div className="flex flex-wrap gap-2 mb-8">{modes.map(m => <button key={m} onClick={() => setMode(m)} aria-pressed={mode === m} className={`rounded-full px-5 py-3 text-sm font-bold border transition-colors ${mode === m ? 'bg-white text-black border-white' : 'border-white/25 hover:border-white'}`}>{m}</button>)}</div>
        <label htmlFor="service" className="block text-xs font-bold uppercase tracking-[.18em] text-white/60 mb-3">02 — What do you need help with?</label>
        <select id="service" value={service} onChange={e => setService(e.target.value)} className="w-full bg-transparent border border-white/25 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#8DA6EF] appearance-none mb-6"><option value="" className="text-black">Choose an area (optional)</option><option value="Customer support" className="text-black">Customer support</option><option value="Brand & marketing" className="text-black">Brand & marketing</option><option value="Website & design" className="text-black">Website & design</option></select>
        {status === 'done' ? <div className="rounded-2xl bg-[#00D26A]/10 border border-[#00D26A]/30 p-6 text-center"><Check className="text-[#00D26A] mx-auto" size={28} /><p className="mt-3 font-bold">Thanks, {form.name.split(' ')[0]}! I&rsquo;ll reply soon.</p><button onClick={() => { setStatus('idle'); setForm({ name: '', email: '', message: '' }); }} className="mt-3 text-sm text-[#8DA6EF] font-bold">Send another</button></div>
        : <div className="space-y-3"><div className="grid sm:grid-cols-2 gap-3"><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name *" className="rounded-xl border border-white/25 bg-transparent px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#8DA6EF]" /><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email *" className="rounded-xl border border-white/25 bg-transparent px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#8DA6EF]" /></div><textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Tell me about your project *" rows={3} className="w-full rounded-xl border border-white/25 bg-transparent px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#8DA6EF]" /><button onClick={submit} disabled={status === 'loading' || !form.name || !form.email || !form.message} className="w-full rounded-xl bg-[#FF4D00] hover:bg-[#D93F00] disabled:opacity-40 text-white py-4 font-bold flex items-center justify-center gap-2 transition-colors">{status === 'loading' ? <><Loader2 size={18} className="animate-spin" /> Sending…</> : <>Send message <ArrowUpRight size={18} /></>}</button>
        <a href={`https://wa.me/${settings.whatsapp}?text=${waText}`} target="_blank" rel="noopener noreferrer" className="w-full rounded-xl border border-[#25D366]/50 text-[#25D366] py-4 font-bold flex items-center justify-center gap-2 hover:bg-[#25D366] hover:text-white transition-colors"><MessageCircle size={18} /> Or chat on WhatsApp</a>
        {status === 'error' && <p className="text-sm text-red-400 text-center">Something went wrong. Please email me directly.</p>}
        </div>}
      </div></Reveal>
    </div>
    <GlobalBridge />
    <div className="pt-8 pb-9 grid md:grid-cols-3 gap-8"><div><span className="text-[11px] uppercase tracking-[.18em] text-white/55">Direct line</span><a href={`mailto:${settings.email}`} className="flex items-center gap-2 mt-3 text-sm hover:text-[#FF7040]"><Mail size={16} /> {settings.email}</a><a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 mt-3 text-sm hover:text-[#FF7040]"><Phone size={16} /> {settings.phone}</a></div><div><span className="text-[11px] uppercase tracking-[.18em] text-white/55">Connect online</span><div className="flex flex-wrap gap-4 mt-3">{socials.map(([label, url]) => <a key={label} href={url} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-[#FF7040]">{label} ↗</a>)}</div></div><div className="md:text-right"><span className="text-[11px] uppercase tracking-[.18em] text-white/55">{settings.location}</span><p className="text-xs text-white/55 mt-3">© {new Date().getFullYear()} {settings.hero_name}</p></div></div>
  </div></footer>;
}