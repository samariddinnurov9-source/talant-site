// Dependency-free SVG charts (fast, no extra bundle).
export function Ring({ value, max = 500, label, unit }: { value: number; max?: number; label: string; unit?: string }) {
  const r = 70, c = 2 * Math.PI * r;
  return (
    <div className="ring">
      <svg viewBox="0 0 180 180" width="180" height="180" role="img" aria-label={`${value} / ${max}`}>
        <circle cx="90" cy="90" r={r} fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="14" />
        <circle cx="90" cy="90" r={r} fill="none" stroke="var(--amber)" strokeWidth="14" strokeLinecap="round" strokeDasharray={c}
          strokeDashoffset={c * (1 - Math.min(value, max) / max)} transform="rotate(-90 90 90)" className="ring-arc" />
      </svg>
      <div className="ring-txt"><small>{label}</small><b>{value}{unit ?? ''}{!unit && <i> / {max}</i>}</b></div>
    </div>
  );
}

export function LineChart({ points, max = 500 }: { points: { label: string; value: number }[]; max?: number }) {
  const W = 640, H = 260, P = 34;
  if (!points.length) return null;
  const x = (i: number) => P + (points.length === 1 ? (W - 2 * P) / 2 : (i * (W - 2 * P)) / (points.length - 1));
  const y = (v: number) => H - P - (Math.min(v, max) / max) * (H - 2 * P);
  const d = points.map((p, i) => `${i ? 'L' : 'M'}${x(i)} ${y(p.value)}`).join(' ');
  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="chart">
      {[0, max / 2, max].map((g) => (<g key={g}><line x1={P} x2={W - P} y1={y(g)} y2={y(g)} stroke="rgba(255,255,255,.14)" /><text x={4} y={y(g) + 4} fontSize="11" fill="var(--muted)">{g}</text></g>))}
      <path d={`${d} L${x(points.length - 1)} ${H - P} L${x(0)} ${H - P}Z`} fill="var(--blue)" opacity=".12" />
      <path d={d} fill="none" stroke="var(--blue)" strokeWidth="3" strokeLinejoin="round" pathLength={1} className="chart-line" />
      {points.map((p, i) => (<g key={i}><circle cx={x(i)} cy={y(p.value)} r="5" fill="var(--amber)" stroke="#fff" strokeWidth="2" />
        {points.length <= 10 && <text x={x(i)} y={H - 10} fontSize="10" textAnchor="middle" fill="var(--muted)">{p.label}</text>}</g>))}
    </svg>
  );
}
