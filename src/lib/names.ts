// Name normalisation shared by the server and the browser. Used to match Excel rows with accounts.
export const normName = (s: string) =>
  s.normalize('NFC').replace(/\s+/g, ' ').trim().split(' ')
    .map((w) => w.split('-').map((p) => (p ? p[0].toLocaleUpperCase('ru') + p.slice(1).toLocaleLowerCase('ru') : p)).join('-')).join(' ');

const MAP: Record<string, string> = { ё: 'е', ӣ: 'и', ӯ: 'у', қ: 'к', ғ: 'г', ҳ: 'х', ҷ: 'ч', й: 'и' };
/** Comparison key: lowercase, Tajik letters folded, word order ignored ("Иванов Иван" == "Иван Иванов"). */
export const nameKey = (s: string) =>
  normName(s).toLowerCase().replace(/[ёӣӯқғҳҷй]/g, (c) => MAP[c]).replace(/[^\p{L}\s-]/gu, '').split(/\s+/).filter(Boolean).sort().join(' ');
