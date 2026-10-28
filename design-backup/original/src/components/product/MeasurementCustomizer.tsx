'use client';

import * as React from 'react';
import { Check, Ruler } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import {
  FIT_OPTIONS,
  LOWER_BODY,
  UPPER_BODY,
  type MeasurementField,
} from '@/lib/catalog/measurements';
import { readMeasurements, saveMeasurements } from '@/lib/store/measurements';

export function MeasurementCustomizer({ productName }: { productName: string }) {
  const [open, setOpen] = React.useState(false);
  const [fit, setFit] = React.useState<string>('Tailored');
  const [notes, setNotes] = React.useState('');
  const [values, setValues] = React.useState<Record<string, string>>({});
  const [saved, setSaved] = React.useState(false);

  // Prefill from the reusable profile.
  React.useEffect(() => {
    const profile = readMeasurements();
    if (!profile) return;
    setFit(profile.fit ?? 'Tailored');
    setNotes(profile.notes ?? '');
    setValues(profile.values ?? {});
    setSaved(true);
  }, []);

  const setValue = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveMeasurements({ fit, notes, values });
    setSaved(true);
  };

  return (
    <div className="mt-3">
      <Button
        type="button"
        variant="secondary"
        size="lg"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="measurements-panel"
        className="w-full"
      >
        <Ruler size={16} />
        Customize — Made to Measure
      </Button>

      {open && (
        <form
          id="measurements-panel"
          onSubmit={onSubmit}
          className="mt-4 rounded-md border border-border bg-white p-5 duration-300 animate-in fade-in slide-in-from-top-2"
        >
          <p className="text-sm text-ink/70">
            Enter your measurements in inches and our tailor cuts{' '}
            <span className="font-medium text-ink">{productName}</span> to fit.
          </p>

          <div className="mt-4">
            <p className="label-utility text-ink/70">Preferred fit</p>
            <div className="mt-2 flex gap-2">
              {FIT_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setFit(option);
                    setSaved(false);
                  }}
                  aria-pressed={fit === option}
                  className={cn(
                    'h-9 flex-1 rounded-sm border text-sm transition-colors',
                    fit === option
                      ? 'border-forest bg-forest text-ivory'
                      : 'border-border text-ink hover:bg-muted',
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <MeasurementGroup
            title="Upper Body"
            fields={UPPER_BODY}
            values={values}
            onChange={setValue}
          />
          <MeasurementGroup
            title="Lower Body"
            fields={LOWER_BODY}
            values={values}
            onChange={setValue}
          />

          <div className="mt-6">
            <label htmlFor="tailor-notes" className="label-utility text-ink/70">
              Notes for the tailor
            </label>
            <textarea
              id="tailor-notes"
              value={notes}
              onChange={(event) => {
                setNotes(event.target.value);
                setSaved(false);
              }}
              rows={2}
              placeholder="e.g. slightly loose sleeves, embroidery in gold…"
              className="mt-1.5 w-full rounded border border-border bg-white p-3 font-body text-sm text-ink placeholder:text-ink/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
            />
          </div>

          <Button type="submit" size="lg" className="mt-6 w-full">
            {saved ? (
              <>
                <Check size={16} />
                Measurements saved
              </>
            ) : (
              'Save measurements'
            )}
          </Button>
          <p className="mt-2 text-center text-xs text-ink/50">
            Saved to your profile and attached when you add this item to your bag.
          </p>
        </form>
      )}
    </div>
  );
}

function MeasurementGroup({
  title,
  fields,
  values,
  onChange,
}: {
  title: string;
  fields: MeasurementField[];
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
}) {
  return (
    <fieldset className="mt-6">
      <legend className="label-utility text-ink/50">{title}</legend>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {fields.map((field) => (
          <Input
            key={field.name}
            name={field.name}
            label={`${field.label} (in)`}
            type="number"
            inputMode="decimal"
            min={0}
            step={0.5}
            value={values[field.name] ?? ''}
            onChange={(event) => onChange(field.name, event.target.value)}
          />
        ))}
      </div>
    </fieldset>
  );
}
