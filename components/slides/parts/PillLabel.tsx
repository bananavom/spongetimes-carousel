import { COLORS, RADIUS } from '@/lib/tokens';
import type { PillColor } from '@/lib/tokens';

export function PillLabel({
  text,
  color,
  fontSize,
}: {
  text: string;
  color: PillColor;
  fontSize: number;
}) {
  const dark = color === 'dark';
  return (
    <span
      style={{
        display: 'inline-block',
        background: dark ? COLORS.cardDark : COLORS.cardYellow,
        color: dark ? COLORS.textOnDark : COLORS.textPrimary,
        fontSize,
        fontWeight: 600,
        letterSpacing: '0.02em',
        padding: `${Math.round(fontSize * 0.42)}px ${Math.round(fontSize * 1.0)}px`,
        borderRadius: RADIUS.pill,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </span>
  );
}
