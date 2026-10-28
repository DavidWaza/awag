'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CategorySlide {
  slug: string;
  name: string;
  image: string;
}

export function CategorySlider({ categories }: { categories: CategorySlide[] }) {
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = React.useState(false);
  const [canNext, setCanNext] = React.useState(false);

  const updateArrows = React.useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanPrev(scrollLeft > 8);
    setCanNext(scrollLeft + clientWidth < scrollWidth - 8);
  }, []);

  React.useEffect(() => {
    updateArrows();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    return () => {
      el.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
    };
  }, [updateArrows]);

  function page(direction: number) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' });
  }

  const hasOverflow = canPrev || canNext;

  return (
    <section className="container py-16">
      <div className="flex items-end justify-between">
        <h2 className="font-display text-2xl font-bold text-ink">Shop by Category</h2>
        {hasOverflow && (
          <div className="flex gap-2">
            <ArrowButton
              direction="prev"
              disabled={!canPrev}
              onClick={() => page(-1)}
            />
            <ArrowButton
              direction="next"
              disabled={!canNext}
              onClick={() => page(1)}
            />
          </div>
        )}
      </div>

      <div
        ref={scrollerRef}
        className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/${category.slug}`}
            className="group relative flex aspect-square w-[44%] shrink-0 snap-start items-end overflow-hidden rounded-md bg-muted p-4 sm:w-[31%] md:w-[23%] lg:w-[19%]"
          >
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes="(min-width: 1024px) 19vw, (min-width: 768px) 23vw, (min-width: 640px) 31vw, 44vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent"
            />
            <span className="label-utility relative text-ink">{category.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ArrowButton({
  direction,
  disabled,
  onClick,
}: {
  direction: 'prev' | 'next';
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'prev' ? 'Scroll categories left' : 'Scroll categories right'}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink transition-colors',
        'hover:border-forest hover:text-forest disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-border disabled:hover:text-ink',
      )}
    >
      {direction === 'prev' ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
    </button>
  );
}
