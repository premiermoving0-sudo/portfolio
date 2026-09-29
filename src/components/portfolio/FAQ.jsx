import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
const faqs = [
  { q: 'What time zone do you work in?', a: 'I overlap with USA business hours (Eastern Time) and can align my schedule to your team. For Pakistan-based tasks I am available throughout the day.' },
  { q: 'How do we get started?', a: 'Pick a time from the calendar above or send a message. We will have a short call to understand your needs, then I send a clear proposal with scope, timeline and pricing.' },
  { q: 'Do you work hourly, per project or full-time?', a: 'All three. Hourly for flexible support, per project for defined deliverables, and full-time for ongoing dedicated work. See the pricing section for starting rates.' },
  { q: 'How do you take payment?', a: 'Local US bank transfer, Wise, Remitly or Payoneer — whichever is easiest for you. Details are shared once we agree on scope.' },
  { q: 'Can you handle both support and creative work?', a: 'Yes. My background covers customer experience, branding, web development and ads — so you can work with one partner instead of several freelancers.' }
];
export default function FAQ() {
  const [open, setOpen] = useState(0);
  return <section id="faq" className="bg-[#F4F4F7] py-24 md:py-36"><div className="mx-auto max-w-[1100px] px-5 md:px-10 lg:px-16"><div className="text-center mb-12"><p className="section-kicker">Questions</p><h2 className="section-title mt-4">Good to know.</h2></div><div className="divide-y divide-black/10 border-y border-black/10">{faqs.map((f, i) => (<div key={i}><button onClick={() => setOpen(open === i ? -1 : i)} className="w-full flex items-center justify-between gap-6 py-6 text-left"><span className="text-lg md:text-xl font-bold tracking-tight">{f.q}</span><span className="shrink-0 text-[#2A52BE]">{open === i ? <Minus size={22} /> : <Plus size={22} />}</span></button><AnimatePresence initial={false}>{open === i && <motion.div key="c" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }} className="overflow-hidden"><p className="pb-6 text-[#45454B] leading-relaxed max-w-[760px]">{f.a}</p></motion.div>}</AnimatePresence></div>))}</div></div></section>;
}