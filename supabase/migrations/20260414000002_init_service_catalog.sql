-- 20260414000002_init_service_catalog.sql
--
-- Canonical top-level services. Bilingual EN/ES from day one.
-- Referenced by business_services.service_slug and quote_requests.service_slugs.
-- Single source of truth — the SearchCard UI in src/components/search-card.tsx
-- mirrors these eleven slugs exactly.

create table if not exists public.service_catalog (
  slug         text primary key,
  label_en     text not null,
  label_es     text not null,
  icon         text not null,
  sort_order   int  not null default 0,
  active       boolean not null default true,
  created_at   timestamptz not null default now()
);

comment on table public.service_catalog is
  'Canonical top-level services. The SearchCard UI mirrors these slugs.';

-- Seed the eleven canonical services. `on conflict` makes this safe to
-- re-run when we tweak labels or reorder.
insert into public.service_catalog (slug, label_en, label_es, icon, sort_order) values
  ('haircut',      'Haircut',        'Corte',             '💇‍♀️',  10),
  ('hairstyle',    'Hairstyle',      'Peinado',           '💁‍♀️',  20),
  ('color',        'Color',          'Tinte',             '🎨',    30),
  ('nails',        'Nails',          'Uñas',              '💅',    40),
  ('lashes-brows', 'Lashes & Brows', 'Pestañas y Cejas',  '👁️',   50),
  ('hair-removal', 'Hair Removal',   'Depilación',        '🪒',    60),
  ('facials',      'Facials',        'Faciales',          '🧖‍♀️',  70),
  ('massage',      'Massage',        'Masaje',            '💆‍♀️',  80),
  ('med-spa',      'Med Spa',        'Spa Médico',        '💉',    90),
  ('makeup',       'Makeup',         'Maquillaje',        '💄',   100),
  ('tanning',      'Tanning',        'Bronceado',         '🌞',   110)
on conflict (slug) do update set
  label_en   = excluded.label_en,
  label_es   = excluded.label_es,
  icon       = excluded.icon,
  sort_order = excluded.sort_order,
  active     = true;
