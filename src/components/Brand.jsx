import { defaultPalette as p, defaultType as type } from '../theme.js';

// Wordmark — matches the apple-touch-icon's italic serif g in accent gold.
// Use this anywhere "GLOSSI" appeared as a header/wordmark.
export default function Brand({ size = 22, color, style }) {
  return (
    <span
      aria-label="Glossi"
      style={{
        fontFamily: type.display,
        fontStyle: 'italic',
        fontSize: size,
        fontWeight: type.displayWeight,
        color: color || p.accent,
        letterSpacing: '-0.02em',
        lineHeight: 1,
        ...style,
      }}
    >
      glossi
    </span>
  );
}
