import { api } from '@/lib/api';

import { useEffect, useState } from 'react';
import { CalendarClock, Check, Loader2 } from 'lucide-react';
import { Reveal } from '@/lib/motion';

const SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
const fmtDay = (d) => ({ key: d.toISOString().slice(0, 10), label: d.toLocaleDateString('en-US', { weekday: 'short' }), num: d.getDate(), month: d.toLocaleDateString('en-US', { month: 'short' }), dow: d.getDay() });
function nextWeekdays(n) { const out = []; const t = new Date(); t.setHours(0, 0, 0, 0); let i = 1; while (out.length < n && i < 40) { const d = new Date(t); d.setDate(t.getDate() + i); const dow = d.getDay(); if (dow !== 0 && dow !== 6) out.push(fmtDay(d)); i++; } return out; }
function nyOffsetMinutes(dateStr) { try { const d = new Date(`${dateStr}T12:00:00Z`); const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', timeZoneName: 'longOffset' }).formatToParts(d); const tz = parts.find(p => p.type === 'timeZoneName')?.value || 'GMT-04:00'; const m = tz.match(/GMT([+-])(\d{2}):?(\d{2})/); if (m) return (m[1] === '-' ? -1 : 1) * (parseInt(m[2]) * 60 + parseInt(m[3])); } catch {} return -240; }
function etToLocal(dateStr, timeStr) { const offset = nyOffsetMinutes(dateStr); const [h, mi] = timeStr.split(':').map(Number); const utc = new Date(`${dateStr}T00:00:00Z`); utc.setUTCMinutes(h * 60 + mi - offset); return utc.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }
function localTzLabel() { try { return Intl.DateTimeFormat().resolvedOptions().timeZone.split('/').pop().replace('_', ' '); } catch { return 'your time'; } }

export default function BookingCalendar({ settings, mode, service }) {
  const days = nextWeekdays(12);
  const [day, setDay] = useState(days[0].key);
  const [slot, setSlot] = useState('');
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [errMsg, setErrMsg] = useState('');
  const [taken, setTaken] = useState(() => new Set());
  const loadTaken = () => api.bookings.taken().then(list => setTaken(new Set(list.map(t => `${t.date}|${t.time}`)))).catch(() => {});
  useEffect(() => { loadTaken(); }, []);
  useEffect(() => { if (slot && taken.has(`${day}|${slot}`)) setSlot(''); }, [day, taken, slot]);

  const submit = async () => {
    if (!form.name || !form.email || !slot) return;
    setStatus('loading');
    try {
      const svc = `${mode}${service ? ` / ${service}` : ''}`;
      await api.entities.Booking.create({ client_name: form.name, client_email: form.email, service: svc, date: day, time: slot, message: form.message });
      setStatus('done');
    } catch (e) { setErrMsg(e.status === 409 ? 'That slot was just taken — please pick another one.' : ''); setStatus('error'); loadTaken(); }
  };

  const card = (
    <div className="rounded-2xl bg-white border border-black/10 p-5 md:p-7 shadow-[0_24px_50px_-24px_rgba(10,10,11,.2)]">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold uppercase tracking-[.13em] text-[#575757] mb-4"><span className="flex items-center gap-2"><CalendarClock size={16} className="text-[#2A52BE]" /> Pick a day · weekdays only</span><span className="text-[10px] text-[#8a8a8f] normal-case tracking-normal">Slots shown in {localTzLabel()} time</span></div>
      <div className="flex gap-2 overflow-x-auto pb-3 -mx-1 px-1">{days.map(d => <button key={d.key} onClick={() => setDay(d.key)} className={`shrink-0 w-16 rounded-xl border py-3 text-center transition-colors ${day === d.key ? 'bg-[#0A0A0B] text-white border-[#0A0A0B]' : 'border-black/15 hover:border-black'}`}><span className="block text-[10px] uppercase tracking-wider opacity-70">{d.label}</span><span className="block text-xl font-black">{d.num}</span><span className="block text-[10px] uppercase">{d.month}</span></button>)}</div>
      <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-2">{SLOTS.map(s => <button key={s} onClick={() => setSlot(s)} disabled={taken.has(`${day}|${s}`)} className={`rounded-lg border py-2.5 text-sm font-bold transition-colors disabled:opacity-30 disabled:line-through disabled:cursor-not-allowed ${slot === s ? 'bg-[#2A52BE] text-white border-[#2A52BE]' : 'border-black/15 hover:border-[#2A52BE] hover:text-[#2A52BE]'}`}><span className="block">{etToLocal(day, s)}</span><span className="block text-[9px] font-medium opacity-60 normal-case">{s} ET</span></button>)}</div>
      <div className="mt-5 grid sm:grid-cols-2 gap-3"><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name *" className="rounded-xl border border-black/15 px-4 py-3 text-sm focus:outline-none focus:border-[#2A52BE]" /><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email *" className="rounded-xl border border-black/15 px-4 py-3 text-sm focus:outline-none focus:border-[#2A52BE]" /></div>
      <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="What do you need help with? (optional)" rows={2} className="mt-3 w-full rounded-xl border border-black/15 px-4 py-3 text-sm focus:outline-none focus:border-[#2A52BE]" />
      <button onClick={submit} disabled={status === 'loading' || !form.name || !form.email || !slot} className="mt-4 w-full rounded-xl bg-[#FF4D00] hover:bg-[#D93F00] disabled:opacity-40 text-white py-4 font-bold flex items-center justify-center gap-2 transition-colors">{status === 'loading' ? <><Loader2 size={18} className="animate-spin" /> Sending…</> : <>Request this slot</>}</button>
      {status === 'error' && <p className="mt-3 text-sm text-red-600 text-center">{errMsg || 'Something went wrong. Please try again or email me directly.'}</p>}
      <p className="mt-3 text-xs text-[#8a8a8f] text-center">Your request is saved and I&rsquo;m notified instantly — no external booking links.</p>
    </div>
  );
  const done = (
    <div className="rounded-2xl bg-white border border-black/10 p-10 text-center">
      <div className="w-14 h-14 rounded-full bg-[#00D26A]/15 mx-auto flex items-center justify-center"><Check className="text-[#00D26A]" size={28} /></div>
      <h3 className="mt-5 text-2xl font-bold">Request received!</h3>
      <p className="mt-2 text-[#45454B] max-w-md mx-auto">Thanks {form.name.split(' ')[0]}. I&rsquo;ll email you shortly to confirm. Need it sooner? Message me on WhatsApp.</p>
      <button onClick={() => { setStatus('idle'); setSlot(''); setForm({ name: '', email: '', message: '' }); }} className="mt-5 text-sm font-bold text-[#2A52BE]">Book another slot</button>
    </div>
  );
  return <section id="book" className="bg-[#F4F4F7] py-24 md:py-36"><div className="mx-auto max-w-[1600px] px-5 md:px-10 lg:px-16"><div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
    <Reveal className="lg:col-span-4 lg:sticky lg:top-28"><div><p className="section-kicker">Book a call</p><h2 className="section-title mt-5">Let&rsquo;s talk<br /><span className="text-[#2A52BE]">directly.</span></h2><p className="mt-7 max-w-[340px] text-[#45454B] leading-relaxed">Pick a time that works for you. Times show in your local timezone — no mental math, no external booking links.</p><p className="mt-5 text-xs text-[#8a8a8f] max-w-[300px] leading-relaxed">Don&rsquo;t see a suitable time? <a href="#contact" className="font-bold text-[#2A52BE] underline">Send a message</a> and we&rsquo;ll find a slot.</p></div></Reveal>
    <div className="lg:col-span-8">{status === 'done' ? done : card}</div>
  </div></div></section>;
}