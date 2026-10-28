'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface HeroSlide {
  image: string;
  /** Falls back to the headline for alt text when omitted. */
  alt?: string;
  label: string;
  title: string;
  ctaLabel: string;
  ctaHref: string;
}

const AUTOPLAY_MS = 6000;

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const count = slides.length;

  const go = React.useCallback(
    (dir: number) => setActive((current) => (current + dir + count) % count),
    [count],
  );

  // Advance one slide per interval; the timer is keyed on `active`, so manual
  // navigation restarts the countdown instead of firing mid-view.
  React.useEffect(() => {
    if (paused || count <= 1) return;
    const id = setTimeout(() => setActive((current) => (current + 1) % count), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [active, paused, count]);

  const current = slides[active];
  if (!current) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Campaign highlights"
      className="relative h-[70vh] min-h-[420px] overflow-hidden bg-black text-ink"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Image layers — crossfade, with a slow Ken-Burns zoom on the active one */}
      {slides.map((slide, index) => (
        <div
          key={slide.image + index}
          aria-hidden={index !== active}
          className={cn(
            'absolute inset-0 transition-opacity duration-1000 ease-out',
            index === active ? 'opacity-100' : 'opacity-0',
          )}
        >
          <Image
            src={slide.image}
            alt={slide.alt ?? slide.title}
            fill
            priority={index === 0}
            sizes="100vw"
            className={cn(
              'object-cover object-center transition-transform ease-out duration-[6000ms]',
              index === active ? 'scale-110' : 'scale-100',
            )}
          />
        </div>
      ))}

      {/* Legibility overlay */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10"
      />

      {/* Caption — remounts per slide (keyed on `active`) so it re-animates in */}
      <div className="relative flex h-full items-end">
        <div
          key={active}
          className="container pb-20 duration-700 ease-out animate-in fade-in slide-in-from-bottom-6"
        >
          <p className="label-utility text-gold">{current.label}</p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-bold md:text-6xl">
            {current.title}
          </h1>
          <Link
            href={current.ctaHref}
            className="label-utility mt-6 inline-block rounded border border-gold/60 bg-black/50 px-6 py-3 text-gold backdrop-blur-sm transition-colors hover:bg-gold hover:text-ivory"
          >
            {current.ctaLabel}
          </Link>
        </div>
      </div>

      {/* Prev / next */}
      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full border border-ink/30 bg-black/30 p-2 text-ink backdrop-blur-sm transition-colors hover:border-gold hover:text-gold md:flex"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full border border-ink/30 bg-black/30 p-2 text-ink backdrop-blur-sm transition-colors hover:border-gold hover:text-gold md:flex"
          >
            <ChevronRight size={20} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.image + index}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === active}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  index === active
                    ? 'w-8 bg-gold'
                    : 'w-2.5 bg-ink/40 hover:bg-ink/70',
                )}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
