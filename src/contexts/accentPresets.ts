export type AccentPreset = { label: string; hex: string; rgb: string };

export const accentPresets: AccentPreset[] = [
  { label: 'Purple', hex: '#6931F5', rgb: '105 49 245' },
  { label: 'Blue', hex: '#2563EB', rgb: '37 99 235' },
  { label: 'Cyan', hex: '#06B6D4', rgb: '6 182 212' },
  { label: 'Teal', hex: '#14B8A6', rgb: '20 184 166' },
  { label: 'Green', hex: '#10B981', rgb: '16 185 129' },
  { label: 'Amber', hex: '#F59E0B', rgb: '245 158 11' },
  { label: 'Orange', hex: '#F97316', rgb: '249 115 22' },
  { label: 'Red', hex: '#EF4444', rgb: '239 68 68' },
  { label: 'Pink', hex: '#EC4899', rgb: '236 72 153' },
];

export const DEFAULT_ACCENT = accentPresets[0];
