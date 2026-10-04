'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Global micro-interactions: scroll reveal, count-up, header state, parallax variable, button ripple.
export default function Fx() {
  const path = usePathname();
  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { (e.target as HTMLElement).classList.add('in'); io.unobserve(e.target); }
    }), { threshold: 0.15 });
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => io.observe(el));

    const co = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      co.unobserve(e.target);
      const el = e.target as HTMLElement; const to = Number(el.dataset.count);
      if (reduce) { el.textContent = String(to); return; }
      const t0 = performance.now();
      const tick = (t: number) => {
        const k = Math.min(1, (t - t0) / 1400);
        el.textContent = String(Math.round(to * (1 - Math.pow(1 - k, 3))));
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }), { threshold: 0.6 });
    document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => co.observe(el));

    const onScroll = () => {
      const y = scrollY;
      document.documentElement.style.setProperty('--sy', String(Math.min(y, 900)));
      document.querySelector('.hdr')?.classList.toggle('scrolled', y > 20);
      const h = document.documentElement.scrollHeight - innerHeight;
      document.documentElement.style.setProperty('--p', String(h > 0 ? Math.min(1, y / h) : 0));
    };
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });

    const onClick = (ev: MouseEvent) => {
      const b = (ev.target as HTMLElement).closest<HTMLElement>('.btn');
      if (!b || reduce) return;
      const r = b.getBoundingClientRect(); const d = Math.max(r.width, r.height) * 2;
      const s = document.createElement('span'); s.className = 'ripple';
      s.style.cssText = `width:${d}px;height:${d}px;left:${ev.clientX - r.left - d / 2}px;top:${ev.clientY - r.top - d / 2}px`;
      b.appendChild(s); setTimeout(() => s.remove(), 700);
    };
    document.addEventListener('click', onClick);
    const onMove = (ev: PointerEvent) => {
      const c = (ev.target as HTMLElement).closest<HTMLElement>('.glow-card'); if (!c) return;
      const r = c.getBoundingClientRect(); c.style.setProperty('--mx', `${ev.clientX - r.left}px`); c.style.setProperty('--my', `${ev.clientY - r.top}px`);
    };
    document.addEventListener('pointermove', onMove);
    return () => {
      document.removeEventListener('pointermove', onMove); io.disconnect(); co.disconnect(); removeEventListener('scroll', onScroll); document.removeEventListener('click', onClick); };
  }, [path]);
  return null;
}
