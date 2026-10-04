// Public content read on the server through the Admin SDK (rules stay closed to anonymous writes). Falls back to defaults.
import { adminDb } from './admin';
import { getDict, type Dict } from './i18n';
import { GRADES, SITE } from './site';

export const safeUrl = (u: string) => (/^(https:\/\/|tel:)/.test(u) ? u : '#');

export type Settings = {
  phone: string; whatsapp: string; telegram: string; instagram: string; address: string; hours: string; mapUrl: string;
  price11: number | null; price10: number | null; price9: number | null; uniPhoto0: string; uniPhoto1: string; uniCredit0: string; uniCredit1: string; heroPhoto: string;
};
const DEFAULTS: Settings = {
  phone: SITE.phone, whatsapp: SITE.whatsapp, telegram: SITE.telegram, instagram: SITE.instagram, address: '', hours: '', mapUrl: '',
  price11: GRADES[0].price, price10: GRADES[1].price, price9: GRADES[2].price, uniPhoto0: '', uniPhoto1: '', uniCredit0: '', uniCredit1: '', heroPhoto: '',
};

export async function getSettings(): Promise<Settings> {
  try {
    const d = await adminDb().doc('settings/site').get();
    return { ...DEFAULTS, ...(d.data() as Partial<Settings> | undefined) };
  } catch { return DEFAULTS; }
}

export async function getList<T = Record<string, unknown>>(name: string): Promise<(T & { id: string; order?: number })[]> {
  try {
    const q = await adminDb().collection(name).get();
    return q.docs.map((d) => ({ id: d.id, ...(d.data() as object) }) as T & { id: string; order?: number })
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  } catch { return []; }
}

// Site texts: defaults from the dictionary, overridden by whatever the admin saved in settings/content ({ru:{path:text}, tg:{...}}).
export async function getT(lang: string): Promise<Dict> {
  const base = structuredClone(getDict(lang)) as unknown as Record<string, unknown>;
  try {
    const d = await adminDb().doc('settings/content').get();
    const o = (d.data()?.[lang === 'tg' ? 'tg' : 'ru'] ?? {}) as Record<string, unknown>;
    for (const [path, val] of Object.entries(o)) {
      if (typeof val !== 'string' || !val.trim()) continue;
      const keys = path.split('.');
      if (keys.some((k) => k === '__proto__' || k === 'constructor' || k === 'prototype')) continue;
      let cur: Record<string, unknown> | undefined = base;
      for (const k of keys.slice(0, -1)) cur = cur && typeof cur[k] === 'object' ? (cur[k] as Record<string, unknown>) : undefined;
      const last = keys[keys.length - 1];
      if (cur && typeof cur[last] === 'string') cur[last] = val.slice(0, 500);
    }
  } catch { /* defaults */ }
  return base as unknown as Dict;
}
