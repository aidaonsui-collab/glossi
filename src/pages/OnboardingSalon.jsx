import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { useNarrow } from '../hooks.js';
import Modal from '../components/Modal.jsx';
import { useToast } from '../components/Toast.jsx';
import { useAuth } from '../store.jsx';
import GooglePlacesAutocomplete, { isGooglePlacesAvailable } from '../components/GooglePlacesAutocomplete.jsx';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { geocodeZip, ZIP_CENTROIDS } from '../lib/geocode.js';

// Canonical service catalog slugs (mirrors supabase/migrations/...service_catalog.sql)
const SERVICE_SLUGS = [
  { slug: 'haircut', l: 'Haircut' },
  { slug: 'hairstyle', l: 'Hairstyle' },
  { slug: 'color', l: 'Color' },
  { slug: 'nails', l: 'Nails' },
  { slug: 'lashes-brows', l: 'Lashes & Brows' },
  { slug: 'hair-removal', l: 'Hair Removal' },
  { slug: 'facials', l: 'Facials' },
  { slug: 'massage', l: 'Massage' },
  { slug: 'med-spa', l: 'Med Spa' },
  { slug: 'makeup', l: 'Makeup' },
  { slug: 'tanning', l: 'Tanning' },
];

const initialServices = [
  { name: 'Color & balayage', slug: 'color', from: 90, to: 160, durMin: 150, sel: true },
  { name: 'Cut & style', slug: 'haircut', from: 45, to: 75, durMin: 45, sel: true },
  { name: 'Hybrid lash set', slug: 'lashes-brows', from: 120, to: 180, durMin: 120, sel: false },
  { name: 'Brow lamination', slug: 'lashes-brows', from: 65, to: 95, durMin: 45, sel: false },
];

const slugify = s => (s || '')
  .toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'salon';

export default function OnboardingSalon() {
  const isPhone = useNarrow();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const step = 2;

  // Business basics
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [phone, setPhone] = useState('');
  const [instagram, setInstagram] = useState('');
  const [priceTier, setPriceTier] = useState('$$');

  // Prefill name from auth user once loaded
  useEffect(() => {
    if (!name && user?.name && user.name !== 'Casa de Belleza') setName(user.name);
  }, [user, name]);

  // Auto-fill city when ZIP resolves
  useEffect(() => {
    if (!zip || zip.length !== 5) return;
    const c = ZIP_CENTROIDS[zip];
    if (c && !city) setCity(c.city);
  }, [zip, city]);

  // Services
  const [items, setItems] = useState(initialServices);
  const [showAdd, setShowAdd] = useState(false);
  const [draft, setDraft] = useState({ name: '', slug: 'haircut', from: 50, to: 90, durMin: 60 });

  // Photos
  const [photos, setPhotos] = useState([]);
  const photoInputRef = useRef(null);

  const [submitting, setSubmitting] = useState(false);

  // Pulls a Google Place into the form. We grab name + address parts +
  // phone + up to 6 photo URLs. Bio is left for the salon to write —
  // Google doesn't have one, and a generated one would feel canned.
  const handlePlaceSelect = place => {
    if (!place || !place.name) return;
    setName(place.name);

    const components = place.address_components || [];
    const get = (...types) => components.find(c => types.every(t => c.types.includes(t)));
    const streetNumber = get('street_number')?.long_name || '';
    const route = get('route')?.short_name || get('route')?.long_name || '';
    const street = [streetNumber, route].filter(Boolean).join(' ');
    const cityComp = get('locality') || get('postal_town') || get('administrative_area_level_3');
    const zipComp = get('postal_code');

    if (street) setAddress(street);
    if (cityComp) setCity(cityComp.long_name);
    if (zipComp) setZip(zipComp.long_name);
    if (place.formatted_phone_number) setPhone(place.formatted_phone_number);

    // If their website is an Instagram URL, autofill the handle too.
    if (place.website) {
      const m = place.website.match(/instagram\.com\/([A-Za-z0-9._]+)/);
      if (m) setInstagram(m[1].replace(/\/$/, ''));
    }

    // Google photos come back as Photo objects; getUrl returns a CDN URL.
    // Cap at 6 — onboarding lets you upload up to 8, so the salon still
    // has room to add their own. Stable for ~12 hours per Google's docs;
    // before going to production we should rehost into Supabase Storage.
    if (Array.isArray(place.photos) && place.photos.length) {
      const urls = place.photos.slice(0, 6).map(p => p.getUrl({ maxWidth: 1600, maxHeight: 1200 }));
      setPhotos(urls);
    }

    toast(`Imported ${place.name} from Google. Review and edit anything below.`, { tone: 'success' });
  };

  const onPhotoPick = e => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    Promise.all(files.map(f => new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(f);
    }))).then(dataUrls => {
      setPhotos(curr => [...curr, ...dataUrls].slice(0, 8));
      toast(`${dataUrls.length} photo${dataUrls.length === 1 ? '' : 's'} added.`, { tone: 'success' });
    });
    e.target.value = '';
  };

  const toggle = i => setItems(curr => curr.map((it, idx) => idx === i ? { ...it, sel: !it.sel } : it));
  const updateField = (i, field, value) => setItems(curr => curr.map((it, idx) => idx === i ? { ...it, [field]: value } : it));
  const updatePrice = (i, field, raw) => {
    const n = raw === '' ? 0 : Math.max(0, parseInt(raw.replace(/\D/g, ''), 10) || 0);
    updateField(i, field, n);
  };
  const addService = () => {
    if (!draft.name.trim()) { toast('Service needs a name.', { tone: 'warn' }); return; }
    if (draft.to <= draft.from) { toast('Max price must be higher than min.', { tone: 'warn' }); return; }
    setItems(curr => [...curr, { ...draft, sel: true }]);
    toast(`${draft.name} added.`, { tone: 'success' });
    setShowAdd(false);
    setDraft({ name: '', slug: 'haircut', from: 50, to: 90, durMin: 60 });
  };

  const onContinue = async () => {
    if (!name.trim()) { toast('Salon name required.', { tone: 'warn' }); return; }
    if (!address.trim()) { toast('Address required.', { tone: 'warn' }); return; }
    if (!city.trim()) { toast('City required.', { tone: 'warn' }); return; }
    const centroid = geocodeZip(zip);
    if (!centroid) { toast('ZIP must be in TX (Dallas, Austin, San Antonio, RGV).', { tone: 'warn' }); return; }
    const selected = items.filter(i => i.sel);
    if (selected.length === 0) { toast('Pick at least one service.', { tone: 'warn' }); return; }

    if (!isSupabaseConfigured) {
      toast('Supabase not configured — listing saved locally only.', { tone: 'warn' });
      try { localStorage.setItem('glossi.salon.gallery', JSON.stringify(photos)); } catch { /* noop */ }
      navigate('/salon');
      return;
    }

    setSubmitting(true);
    try {
      // Pick a unique slug. The RPC will fail if it collides; append a short suffix on retry.
      const baseSlug = slugify(name);
      const trySlug = baseSlug + '-' + Math.random().toString(36).slice(2, 6);

      const { data: bizId, error } = await supabase.rpc('create_business', {
        p_slug: trySlug,
        p_name: name.trim(),
        p_bio: bio || null,
        p_address: address.trim(),
        p_city: city.trim(),
        p_postal_code: zip,
        p_lat: centroid.lat,
        p_lng: centroid.lng,
        p_phone: phone || null,
        p_website: null,
        p_instagram: instagram || null,
        p_price_tier: priceTier || null,
        p_service_slugs: selected.map(s => s.slug),
        p_service_prices_cents: selected.map(s => Math.max(0, s.from || 0) * 100),
        p_service_durations: selected.map(s => Math.max(15, s.durMin || 60)),
      });

      if (error) {
        console.error('create_business error', error);
        toast(error.message || 'Failed to create salon listing.', { tone: 'warn' });
        return;
      }

      // Photos are still local-only for now (no Storage bucket wired yet).
      try { localStorage.setItem(`glossi.salon.gallery.${bizId}`, JSON.stringify(photos)); } catch { /* noop */ }
      toast(`${name} is live. ${selected.length} service${selected.length === 1 ? '' : 's'} listed.`, { tone: 'success' });
      navigate('/salon/inbox');
    } catch (err) {
      console.error(err);
      toast(err?.message || 'Something went wrong creating your salon.', { tone: 'warn' });
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: 12,
    border: `0.5px solid ${p.line}`, background: p.surface,
    fontFamily: type.body, fontSize: 14, color: p.ink, outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{ background: p.bg, minHeight: '100vh', color: p.ink, fontFamily: type.body, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: isPhone ? '18px' : '24px 40px', display: 'flex', alignItems: 'center', gap: 14, borderBottom: `0.5px solid ${p.line}` }}>
        <Link to="/" style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 26, fontWeight: type.displayWeight, letterSpacing: '-0.02em', color: p.accent, textDecoration: 'none' }}>glossi</Link>
        <span style={{ fontSize: 10, color: p.accent, fontWeight: 700, letterSpacing: '0.18em' }}>FOR SALONS</span>
        <div style={{ flex: 1 }} />
        <div style={{ fontFamily: type.mono, fontSize: 11, color: p.inkMuted, fontWeight: 600 }}>STEP {step} / 4 · BUSINESS</div>
        <div style={{ width: 80, height: 3, borderRadius: 2, background: p.line, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, width: `${(step / 4) * 100}%`, background: p.accent }} />
        </div>
      </div>

      <div style={{ padding: isPhone ? '28px 18px 60px' : '60px 64px 80px', maxWidth: 760, margin: '0 auto', width: '100%' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: p.accent }}>YOUR SALON</div>
        <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 40 : 60, fontWeight: type.displayWeight, letterSpacing: '-0.03em', lineHeight: 0.95, margin: '12px 0 0' }}>Set up your listing.</h1>
        <p style={{ fontSize: isPhone ? 15 : 16, color: p.inkSoft, lineHeight: 1.55, margin: '12px 0 0', maxWidth: 540 }}>
          Customers within 5–25 miles will see your salon and your services when they post a request. You can edit anything later.
        </p>

        {/* Google Places auto-fill — pulls name, address, phone, photos
            from a public Google Maps listing in one click. Hidden entirely
            when VITE_GOOGLE_MAPS_API_KEY isn't set, so the manual form
            below remains the source of truth in those environments. */}
        {isGooglePlacesAvailable && (
          <section style={{ marginTop: 28, padding: '18px 18px 16px', background: p.surface, borderRadius: 14, border: `0.5px dashed ${p.line}` }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.accent }}>FIND YOUR BUSINESS</div>
            <p style={{ fontSize: 12.5, color: p.inkSoft, lineHeight: 1.5, margin: '6px 0 12px' }}>
              Search Google to auto-fill your name, address, phone, and up to six photos. Edit anything you don't like — nothing is saved until you finish.
            </p>
            <GooglePlacesAutocomplete
              placeholder="e.g. Casa de Belleza Pharr"
              biasBounds={{ sw: { lat: 25.84, lng: -106.65 }, ne: { lat: 36.50, lng: -93.51 } }}
              style={inputStyle}
              onSelect={handlePlaceSelect}
            />
          </section>
        )}

        {/* Business basics */}
        <section style={{ marginTop: 28 }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>01 · BASICS</div>
          <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: isPhone ? '1fr' : '1fr 1fr', gap: 12 }}>
            <label style={{ gridColumn: '1 / -1' }}>
              <div style={{ fontSize: 11.5, color: p.inkSoft, marginBottom: 6, fontWeight: 600 }}>Salon name</div>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Casa de Belleza" style={inputStyle} />
            </label>
            <label style={{ gridColumn: '1 / -1' }}>
              <div style={{ fontSize: 11.5, color: p.inkSoft, marginBottom: 6, fontWeight: 600 }}>Address</div>
              <input value={address} onChange={e => setAddress(e.target.value)} placeholder="1612 N Cage Blvd" style={inputStyle} />
            </label>
            <label>
              <div style={{ fontSize: 11.5, color: p.inkSoft, marginBottom: 6, fontWeight: 600 }}>City</div>
              <input value={city} onChange={e => setCity(e.target.value)} placeholder="Pharr" style={inputStyle} />
            </label>
            <label>
              <div style={{ fontSize: 11.5, color: p.inkSoft, marginBottom: 6, fontWeight: 600 }}>ZIP</div>
              <input value={zip} onChange={e => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))} inputMode="numeric" placeholder="78577" style={{ ...inputStyle, fontFamily: type.mono, letterSpacing: '0.1em' }} />
            </label>
            <label>
              <div style={{ fontSize: 11.5, color: p.inkSoft, marginBottom: 6, fontWeight: 600 }}>Phone (optional)</div>
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="(956) 555-0124" style={inputStyle} />
            </label>
            <label>
              <div style={{ fontSize: 11.5, color: p.inkSoft, marginBottom: 6, fontWeight: 600 }}>Instagram (optional)</div>
              <input value={instagram} onChange={e => setInstagram(e.target.value.replace(/^@/, ''))} placeholder="casadebelleza" style={inputStyle} />
            </label>
            <label style={{ gridColumn: '1 / -1' }}>
              <div style={{ fontSize: 11.5, color: p.inkSoft, marginBottom: 6, fontWeight: 600 }}>Bio (optional)</div>
              <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} placeholder="Two chairs, real warmth, twelve years of color in Pharr." style={{ ...inputStyle, fontFamily: type.body, lineHeight: 1.5, resize: 'vertical' }} />
            </label>
            <div>
              <div style={{ fontSize: 11.5, color: p.inkSoft, marginBottom: 6, fontWeight: 600 }}>Price tier</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {['$', '$$', '$$$', '$$$$'].map(t => {
                  const a = priceTier === t;
                  return (
                    <button key={t} type="button" onClick={() => setPriceTier(t)} style={{
                      flex: 1, padding: '11px 8px', borderRadius: 10,
                      background: a ? p.ink : p.surface, color: a ? p.bg : p.ink,
                      border: `0.5px solid ${a ? p.ink : p.line}`,
                      cursor: 'pointer', fontFamily: type.mono, fontSize: 13, fontWeight: 600,
                    }}>{t}</button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section style={{ marginTop: 32 }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>02 · SERVICES</div>
          <p style={{ fontSize: 13, color: p.inkSoft, lineHeight: 1.5, margin: '6px 0 14px', maxWidth: 560 }}>Pick the services you offer. Customers see your starting price next to every bid you send.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {items.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, background: s.sel ? p.surface : 'transparent', border: `0.5px solid ${s.sel ? p.ink : p.line}`, color: p.ink }}>
                <button onClick={() => toggle(i)} aria-label={s.sel ? 'Unselect' : 'Select'} style={{ width: 22, height: 22, borderRadius: 4, background: s.sel ? p.ink : 'transparent', border: `1.5px solid ${s.sel ? p.ink : p.inkMuted}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: p.bg, flexShrink: 0, cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
                  {s.sel && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M5 13l4 4L19 7" /></svg>}
                </button>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <input value={s.name} onChange={e => updateField(i, 'name', e.target.value)} style={{ background: 'transparent', border: 0, outline: 0, fontSize: 14, fontWeight: 600, fontFamily: type.body, color: p.ink, padding: 0, width: '100%' }} />
                  <select value={s.slug} onChange={e => updateField(i, 'slug', e.target.value)} style={{ marginTop: 4, background: 'transparent', border: 0, outline: 0, fontSize: 11, color: p.inkMuted, padding: 0, fontFamily: type.body, cursor: 'pointer' }}>
                    {SERVICE_SLUGS.map(o => <option key={o.slug} value={o.slug}>{o.l}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: type.mono, fontSize: 13, fontWeight: 600, color: p.ink, flexShrink: 0 }}>
                  <span>$</span>
                  <input inputMode="numeric" value={s.from} onChange={e => updatePrice(i, 'from', e.target.value)} style={{ width: 50, background: p.bg, border: `0.5px solid ${p.line}`, borderRadius: 6, outline: 0, padding: '4px 6px', textAlign: 'right', fontFamily: type.mono, fontSize: 13, fontWeight: 600, color: p.ink }} />
                  <span style={{ color: p.inkMuted }}>·</span>
                  <input inputMode="numeric" value={s.durMin} onChange={e => updatePrice(i, 'durMin', e.target.value)} style={{ width: 38, background: p.bg, border: `0.5px solid ${p.line}`, borderRadius: 6, outline: 0, padding: '4px 6px', textAlign: 'right', fontFamily: type.mono, fontSize: 12, fontWeight: 600, color: p.ink }} />
                  <span style={{ color: p.inkMuted, fontSize: 11 }}>min</span>
                </div>
              </div>
            ))}
            <button onClick={() => setShowAdd(true)} style={{ alignSelf: 'flex-start', background: 'transparent', border: `0.5px dashed ${p.inkMuted}`, color: p.inkSoft, cursor: 'pointer', padding: '10px 16px', borderRadius: 12, fontSize: 13, fontWeight: 500, fontFamily: 'inherit' }}>+ Add another service</button>
          </div>
        </section>

        {/* Photos */}
        <section style={{ marginTop: 32 }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>03 · PHOTOS · {photos.length}/8</div>
          <p style={{ fontSize: 13, color: p.inkSoft, lineHeight: 1.5, margin: '6px 0 12px' }}>Add a few shots of your space and recent work — the more the better.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 8 }}>
            {photos.map((src, i) => (
              <div key={i} style={{ position: 'relative', aspectRatio: '1/1', borderRadius: 10, overflow: 'hidden', backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <button type="button" onClick={() => setPhotos(curr => curr.filter((_, idx) => idx !== i))} aria-label="Remove photo" style={{ position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: 99, border: 0, background: 'rgba(0,0,0,0.55)', color: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
              </div>
            ))}
            {photos.length < 8 && (
              <button type="button" onClick={() => photoInputRef.current?.click()} style={{ aspectRatio: '1/1', borderRadius: 10, background: p.surface, border: `0.5px dashed ${p.inkMuted}`, color: p.inkSoft, cursor: 'pointer', fontSize: 11, fontWeight: 600, fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+ Add</button>
            )}
          </div>
          <input ref={photoInputRef} type="file" accept="image/*" multiple onChange={onPhotoPick} style={{ display: 'none' }} />
        </section>

        {/* CTA */}
        <div style={{ marginTop: 32, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, cursor: 'pointer', padding: '14px 18px', borderRadius: 99, fontSize: 13.5, fontWeight: 600, fontFamily: 'inherit', color: p.ink }}>← Back</button>
          <button onClick={onContinue} disabled={submitting} style={{ background: submitting ? p.line : p.accent, color: p.ink, border: 0, padding: '14px 22px', borderRadius: 99, fontSize: 14.5, fontWeight: 600, cursor: submitting ? 'wait' : 'pointer', fontFamily: 'inherit' }}>
            {submitting ? 'Publishing…' : 'Publish salon →'}
          </button>
        </div>
      </div>

      {/* Add service modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add a service" eyebrow="MENU" footer={
        <>
          <button onClick={() => setShowAdd(false)} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, cursor: 'pointer', padding: '11px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, fontFamily: 'inherit', color: p.ink }}>Cancel</button>
          <button onClick={addService} style={{ background: p.accent, color: p.ink, border: 0, cursor: 'pointer', padding: '11px 22px', borderRadius: 99, fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>Add</button>
        </>
      }>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label>
            <div style={{ fontSize: 11.5, color: p.inkSoft, marginBottom: 6, fontWeight: 600 }}>Service name</div>
            <input value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} placeholder="Brazilian blowout" style={inputStyle} />
          </label>
          <label>
            <div style={{ fontSize: 11.5, color: p.inkSoft, marginBottom: 6, fontWeight: 600 }}>Category</div>
            <select value={draft.slug} onChange={e => setDraft({ ...draft, slug: e.target.value })} style={inputStyle}>
              {SERVICE_SLUGS.map(o => <option key={o.slug} value={o.slug}>{o.l}</option>)}
            </select>
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <label>
              <div style={{ fontSize: 11.5, color: p.inkSoft, marginBottom: 6, fontWeight: 600 }}>From $</div>
              <input inputMode="numeric" value={draft.from} onChange={e => setDraft({ ...draft, from: parseInt(e.target.value.replace(/\D/g, ''), 10) || 0 })} style={{ ...inputStyle, fontFamily: type.mono }} />
            </label>
            <label>
              <div style={{ fontSize: 11.5, color: p.inkSoft, marginBottom: 6, fontWeight: 600 }}>To $</div>
              <input inputMode="numeric" value={draft.to} onChange={e => setDraft({ ...draft, to: parseInt(e.target.value.replace(/\D/g, ''), 10) || 0 })} style={{ ...inputStyle, fontFamily: type.mono }} />
            </label>
            <label>
              <div style={{ fontSize: 11.5, color: p.inkSoft, marginBottom: 6, fontWeight: 600 }}>Min</div>
              <input inputMode="numeric" value={draft.durMin} onChange={e => setDraft({ ...draft, durMin: parseInt(e.target.value.replace(/\D/g, ''), 10) || 0 })} style={{ ...inputStyle, fontFamily: type.mono }} />
            </label>
          </div>
        </div>
      </Modal>
    </div>
  );
}
