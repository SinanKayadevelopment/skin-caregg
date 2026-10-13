import React from 'react';
import { DupeMatchResult, Product } from '@/lib/types';
import { ShoppingCart } from 'lucide-react';

interface FloatingAffiliateBarProps {
  luxuryProduct: Product;
  topDupeMatch?: DupeMatchResult;
}

export function FloatingAffiliateBar({ luxuryProduct, topDupeMatch }: FloatingAffiliateBarProps) {
  if (!topDupeMatch) return null;
  const dupe = topDupeMatch.dupeProduct;
  const savingsDollars = Math.round(topDupeMatch.savingsAmount);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-rose-200/80 bg-white/95 p-3.5 shadow-2xl backdrop-blur-md dark:border-rose-950/60 dark:bg-[#1C121B]/95 sm:hidden">
      <div className="mx-auto flex max-w-md items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              #1 Dupe • {topDupeMatch.matchPercentage}% Match
            </span>
          </div>

          <div className="truncate text-xs sm:text-sm font-semibold text-[#2A1D24] dark:text-[#FDF8F9]">
            {dupe.brand} {dupe.name}
          </div>

          {/* Price Anchor & Savings */}
          <div className="flex items-baseline gap-2">
            <span className="text-xs font-semibold text-[#8C7684] line-through">
              ${luxuryProduct.price.toFixed(0)}
            </span>
            <span className="font-serif text-sm sm:text-base font-bold text-[#2A1D24] dark:text-[#FDF8F9]">
              ${dupe.price.toFixed(2)}
            </span>
            {savingsDollars > 0 && (
              <span className="rounded-full bg-gradient-to-r from-rose-600 to-pink-600 px-2 py-0.5 text-xs font-black uppercase text-white shadow-2xs">
                SAVE ${savingsDollars}
              </span>
            )}
          </div>
        </div>

        {/* High-Intent Sticky CTA */}
        <a
          href={`/go/${dupe.slug}`}
          target="_blank"
          rel="nofollow noopener"
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-2.5 text-xs sm:text-sm font-bold text-stone-950 shadow-md transition hover:from-amber-400 hover:to-amber-300"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>Check Price</span>
        </a>
      </div>
    </div>
  );
}
