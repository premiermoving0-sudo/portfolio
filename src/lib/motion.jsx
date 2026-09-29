import { motion, useInView, useReducedMotion, useMotionValue, useSpring, animate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export function Reveal({ children, delay = 0, y = 28, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const reduce = useReducedMotion();
  return (
    <motion.div ref={ref} className={className}
      initial={reduce ? false : { opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

export function CountUp({ to, duration = 1.6, suffix = '', pad = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) { setVal(to); return; }
    const controls = animate(0, to, { duration, ease: 'easeOut', onUpdate: v => setVal(v) });
    return () => controls.stop();
  }, [inView, to, reduce]);
  const n = Math.round(val);
  const s = pad ? String(n).padStart(pad, '0') : String(n);
  return <span ref={ref}>{s}{suffix}</span>;
}

export function Magnetic({ children, strength = 0.25, className = '' }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.3 });
  if (reduce) return <span className={className} style={{ display: 'inline-block' }}>{children}</span>;
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  return (
    <motion.span ref={ref} style={{ x: sx, y: sy, display: 'inline-block' }} onMouseMove={onMove} onMouseLeave={() => { x.set(0); y.set(0); }} className={className}>
      {children}
    </motion.span>
  );
}