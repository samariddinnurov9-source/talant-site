// Hand-drawn SVG illustrations (no external images): subject medallions and English backdrop.
const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.4, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export function SubjectArt({ kind }: { kind: 'chem' | 'bio' | 'phys' | 'tj' | 'en' }) {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
      {kind === 'bio' && (<g {...S}>
        <path d="M22 4C46 16 46 24 32 32 18 40 18 48 42 60" /><path d="M42 4C18 16 18 24 32 32 46 40 46 48 22 60" />
        {[[28, 36, 12.3], [23, 41, 19.5], [24, 40, 26], [24, 40, 38], [23, 41, 44.5], [28, 36, 51.7]].map(([a, b, y]) => (<path key={y} d={`M${a} ${y}H${b}`} strokeWidth="1.8" />))}
      </g>)}
      {kind === 'chem' && (<g {...S}>
        <path d="M26 6h12M28 6v18L12 52a6 6 0 005 9h30a6 6 0 005-9L36 24V6" />
        <path d="M17 44h30l5 9c1.5 3-.3 6-3.6 6H15.6c-3.3 0-5.1-3-3.6-6z" fill="currentColor" opacity=".35" stroke="none" />
        <circle cx="29" cy="48" r="2.4" /><circle cx="37" cy="42" r="1.8" /><circle cx="33" cy="30" r="1.8" /><circle cx="35" cy="17" r="1.5" />
      </g>)}
      {kind === 'phys' && (<g {...S}>
        {[0, 60, 120].map((r) => (<ellipse key={r} cx="32" cy="32" rx="26" ry="10" transform={`rotate(${r} 32 32)`} />))}
        <circle cx="32" cy="32" r="4.5" fill="currentColor" /><circle cx="58" cy="32" r="2.6" fill="currentColor" /><circle cx="19" cy="9.5" r="2.6" fill="currentColor" /><circle cx="19" cy="54.5" r="2.6" fill="currentColor" />
      </g>)}
      {kind === 'en' && (<g {...S}>
        <path d="M12 10h40a6 6 0 016 6v22a6 6 0 01-6 6H34L22 56V44H12a6 6 0 01-6-6V16a6 6 0 016-6z" />
        <path d="M17 36l7-16 7 16M19.5 31h9" strokeWidth="2.2" /><path d="M37 28h10M37 34h7" strokeWidth="2" />
      </g>)}
      {kind === 'tj' && (<g {...S}>
        <path d="M8 16c8-3 16-3 24 2 8-5 16-5 24-2v36c-8-3-16-3-24 2-8-5-16-5-24-2z" /><path d="M32 18v36" />
        <path d="M32 3l5 5-5 5-5-5z" fill="currentColor" /><path d="M15 26h10M15 33h10M39 26h10M39 33h10" strokeWidth="1.8" />
      </g>)}
    </svg>
  );
}

export function EnglishArt() {
  return (
    <svg className="en-art" viewBox="0 0 400 260" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round">
      <rect x="150" y="14" width="190" height="78" rx="28" /><path d="M200 92l-14 26 40-26" />
      <rect x="20" y="104" width="170" height="70" rx="26" /><path d="M60 174l-10 24 36-24" />
      <rect x="196" y="156" width="190" height="78" rx="28" /><path d="M330 234l16 20-6-20" />
      <g fill="currentColor" stroke="none" fontFamily="var(--f-serif), serif" fontWeight="800">
        <text x="245" y="64" fontSize="34">Hello</text><text x="52" y="152" fontSize="32">Salom</text><text x="232" y="206" fontSize="34">Привет</text>
      </g>
      <circle cx="60" cy="40" r="26" /><path d="M34 40h52M60 14c-18 18-18 34 0 52M60 14c18 18 18 34 0 52" strokeWidth="2" />
    </svg>
  );
}
