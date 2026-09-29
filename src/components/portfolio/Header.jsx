import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
const links = [['About', '#about'], ['Expertise', '#services'], ['Work', '#work'], ['Experience', '#experience'], ['Contact', '#contact']];
const sectionIds = ['about', 'services', 'work', 'experience', 'contact'];
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState('');
  const [active, setActive] = useState('');
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    const updateTime = () => setTime(new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', hour12: true }).format(new Date()));
    onScroll(); updateTime();
    window.addEventListener('scroll', onScroll, { passive: true });
    const interval = setInterval(updateTime, 60000);
    const obs = new IntersectionObserver((entries) => { entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }); }, { rootMargin: '-45% 0px -50% 0px' });
    sectionIds.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => { window.removeEventListener('scroll', onScroll); clearInterval(interval); obs.disconnect(); };
  }, []);
  const linkCls = (href) => `relative pb-1 transition-colors hover:text-black ${active === href.slice(1) ? 'text-black' : 'text-[#575757]'}`;
  return <header className={`fixed top-0 inset-x-0 z-50 border-b border-black/10 bg-[#F4F4F7]/90 backdrop-blur-xl transition-all duration-300 ${scrolled ? 'shadow-[0_6px_24px_-12px_rgba(10,10,11,.25)]' : ''}`}>
    <div className={`mx-auto max-w-[1600px] flex items-center justify-between gap-6 px-5 md:px-10 lg:px-16 transition-all duration-300 ${scrolled ? 'h-16' : 'h-[76px]'}`}>
      <a href="#top" className="relative z-10 font-black tracking-[-0.08em] leading-none transition-all duration-300" style={{ fontSize: scrolled ? 22 : 26 }}>AH<span className="text-[#FF4D00]">.</span></a>
      <nav className="hidden md:flex items-center gap-7 text-[11px] font-bold tracking-[.14em] uppercase">{links.map(([label, href]) => <a key={href} href={href} className={linkCls(href)}>{label}<span className={`absolute left-0 -bottom-0.5 h-[2px] bg-[#FF4D00] transition-all duration-300 ${active === href.slice(1) ? 'w-full' : 'w-0'}`} /></a>)}</nav>
      <div className="hidden lg:flex items-center gap-3 text-[10px] font-bold tracking-[.1em] uppercase text-[#575757]"><span className="w-2 h-2 rounded-full bg-[#00D26A] shadow-[0_0_12px_#00D26A]" />{scrolled ? `NY ${time} · Available` : 'Available for remote work'}</div>
      <a href="#book" className="hidden md:inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#0A0A0B] text-white text-xs font-bold hover:bg-[#2A52BE] transition-colors">Hire Adeel <ArrowUpRight size={15} /></a>
      <button className="md:hidden p-2" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>{open ? <X size={23} /> : <Menu size={23} />}</button>
    </div>
    {open && <nav className="md:hidden border-t border-black/10 px-5 py-5 flex flex-col gap-5 bg-[#F4F4F7] text-sm font-bold uppercase tracking-widest">{links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}</nav>}
  </header>;
}