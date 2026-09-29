import { motion, useReducedMotion } from 'framer-motion';
export default function GlobalBridge() {
  const reduce = useReducedMotion();
  const draw = reduce ? { pathLength: 1 } : { pathLength: 1 };
  return <div className="mt-24 border-y border-white/20 py-8 md:py-12" aria-label="Remote collaboration between Lahore and the USA">
    <div className="flex items-center justify-between text-[11px] uppercase tracking-[.18em] font-bold text-white/55 mb-8"><span>Based in Lahore</span><span className="hidden md:block">Working across borders</span><span>Focused on the USA</span></div>
    <div className="relative h-[110px] md:h-[160px] overflow-hidden">
      <div className="absolute inset-0 opacity-[.12]" style={{ backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)', backgroundSize: '7% 36px' }} />
      <svg viewBox="0 0 1200 160" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" aria-hidden="true">
        <motion.path d="M110 116 C 360 -25, 800 -25, 1090 116" fill="none" stroke="#8DA6EF" strokeWidth="1.5" strokeDasharray="5 6" initial={{ pathLength: 0 }} whileInView={draw} viewport={{ once: true }} transition={{ duration: 2, ease: 'easeInOut' }} />
        <path d="M110 116 L1090 116" fill="none" stroke="white" strokeOpacity=".14" />
        <motion.circle cx="110" cy="116" r="6" fill="#FF4D00" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.4 }} style={{ transformOrigin: '110px 116px' }} />
        <motion.circle cx="1090" cy="116" r="6" fill="#00D26A" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 1.6, duration: 0.4 }} style={{ transformOrigin: '1090px 116px' }} />
      </svg>
      <span className="absolute left-[3%] bottom-0 text-xs font-bold">Lahore, PK</span><span className="absolute right-[2%] bottom-0 text-xs font-bold">USA market</span>
    </div>
  </div>;
}