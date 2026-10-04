const P: Record<string, string> = {
  shield: 'M12 2l8 3v6c0 5-3.4 9.2-8 11-4.6-1.8-8-6-8-11V5zM8.5 12l2.5 2.5L16 9.5',
  cap: 'M2 9l10-5 10 5-10 5zM6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5M22 9v6',
  chat: 'M4 5h16v11H9l-5 4zM8 9.5h8M8 12.5h5',
  check: 'M5 4h14v16H5zM8.5 10l2 2 4-4.5M8.5 16h7',
  target: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 8a4 4 0 100 8 4 4 0 000-8zM12 12l7-7',
};
export default function Icon({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={P[name] ?? P.check} />
    </svg>
  );
}
