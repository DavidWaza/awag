// Shared measurement definitions so the customizer form and the bag summary
// stay in sync on field names and labels.

export interface MeasurementField {
  name: string;
  label: string;
}

export interface Measurements {
  fit: string;
  notes: string;
  values: Record<string, string>;
}

export const UPPER_BODY: MeasurementField[] = [
  { name: 'neck', label: 'Neck' },
  { name: 'shoulder', label: 'Shoulder' },
  { name: 'chest', label: 'Chest' },
  { name: 'stomach', label: 'Stomach' },
  { name: 'topLength', label: 'Top Length' },
  { name: 'sleeveLength', label: 'Sleeve Length' },
  { name: 'roundSleeve', label: 'Round Sleeve' },
  { name: 'wrist', label: 'Wrist / Cuff' },
];

export const LOWER_BODY: MeasurementField[] = [
  { name: 'waist', label: 'Trouser Waist' },
  { name: 'hip', label: 'Hip / Seat' },
  { name: 'thigh', label: 'Thigh' },
  { name: 'trouserLength', label: 'Trouser Length' },
  { name: 'trouserMouth', label: 'Trouser Mouth' },
];

export const MEASUREMENT_FIELDS: MeasurementField[] = [...UPPER_BODY, ...LOWER_BODY];

export const MEASUREMENT_LABELS: Record<string, string> = Object.fromEntries(
  MEASUREMENT_FIELDS.map((field) => [field.name, field.label]),
);

export const FIT_OPTIONS = ['Slim', 'Tailored', 'Relaxed'] as const;

/** Non-empty measurement values, in display order — for the bag summary. */
export function filledMeasurements(measurements: Measurements): [string, string][] {
  return MEASUREMENT_FIELDS.map(
    (field) => [field.label, measurements.values[field.name] ?? ''] as [string, string],
  ).filter(([, value]) => value.trim() !== '');
}
