'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export type Photo = { src: string; w: number; h: number; alt: string };

// Photos are not rendered (and not downloaded) until the visitor presses the button. Click a photo for full screen.
export default function PhotoReveal({ show, hide, photos }: { show: string; hide: string; photos: Photo[] }) {
  const [open, setOpen] = useState(false);
  const [big, setBig] = useState<number | null>(null);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setBig(null);
    addEventListener('keydown', k);
    return () => removeEventListener('keydown', k);
  }, []);
  return (
    <div>
      <button className="btn btn-amber" aria-expanded={open} onClick={() => { setOpen(!open); setBig(null); }}>{open ? hide : show}</button>
      {open && (
        <div className="photos">
          {photos.map((p, k) => (
            <figure key={p.src} className={`ph ph-${k}`} style={{ animationDelay: `${Math.min(k, 8) * 120}ms` }}>
              <button onClick={() => setBig(k)} aria-label={p.alt}>
                <Image src={p.src} alt={p.alt} width={p.w} height={p.h} sizes="(max-width:800px) 100vw, 45vw" />
              </button>
            </figure>
          ))}
        </div>
      )}
      {big !== null && photos[big] && (
        <div className="lb" role="dialog" aria-modal="true" onClick={() => setBig(null)}>
          <Image src={photos[big].src} alt={photos[big].alt} width={photos[big].w} height={photos[big].h} sizes="100vw" />
        </div>
      )}
    </div>
  );
}
