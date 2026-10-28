// PLP state lives entirely in the URL — parse + serialise here, used by the
// server (to fetch) and the client controls (to navigate) alike.

export interface PlpQuery {
  sort: 'new' | 'price_asc' | 'price_desc' | 'brand';
  size: string[];
  colour: string[];
  brand: string[];
  min?: number;
  max?: number;
  page: number;
}

const list = (v?: string | null) => (v ? v.split(',').filter(Boolean) : []);
const num = (v?: string | null) => (v ? Number(v) : undefined);

export function parsePlpQuery(sp: URLSearchParams): PlpQuery {
  return {
    sort: (sp.get('sort') as PlpQuery['sort']) ?? 'new',
    size: list(sp.get('size')),
    colour: list(sp.get('colour')),
    brand: list(sp.get('brand')),
    min: num(sp.get('min')),
    max: num(sp.get('max')),
    page: Number(sp.get('page') ?? '1'),
  };
}

/** Immutable helper: patch one key, always reset to page 1 on any change. */
export function withPlpParam(
  sp: URLSearchParams,
  patch: Partial<Record<keyof PlpQuery, string | undefined>>,
): string {
  const next = new URLSearchParams(sp);
  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined || value === '') next.delete(key);
    else next.set(key, value);
  }
  if (!('page' in patch)) next.set('page', '1'); // any filter/sort change resets pagination
  return next.toString();
}
