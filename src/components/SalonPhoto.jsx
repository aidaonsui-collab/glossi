import { PHOTOS } from '../theme.js';

const TINTS = [
  'linear-gradient(180deg, rgba(122,90,63,0), rgba(31,24,22,.35))',
  'linear-gradient(180deg, rgba(178,117,104,0), rgba(31,24,22,.30))',
  'linear-gradient(180deg, rgba(168,132,95,0), rgba(31,24,22,.30))',
  'linear-gradient(180deg, rgba(82,89,94,0), rgba(20,18,16,.45))',
  'linear-gradient(180deg, rgba(126,90,38,0), rgba(31,24,22,.40))',
  'linear-gradient(180deg, rgba(122,56,37,0), rgba(31,24,22,.40))',
  'linear-gradient(180deg, rgba(168,132,95,0), rgba(31,24,22,.30))',
  'linear-gradient(180deg, rgba(82,55,40,0), rgba(31,24,22,.40))',
];

export default function SalonPhoto({ mood = 0, h = 96, style = {}, children }) {
  return (
    <div style={{
      height: h, borderRadius: 14, position: 'relative', overflow: 'hidden',
      backgroundImage: `url(${PHOTOS[mood % PHOTOS.length]})`,
      backgroundSize: 'cover', backgroundPosition: 'center',
      ...style,
    }}>
      <div style={{ position: 'absolute', inset: 0, background: TINTS[mood % TINTS.length] }} />
      {children}
    </div>
  );
}
