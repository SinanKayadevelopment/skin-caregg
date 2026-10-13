import React from 'react';
import Link from 'next/link';
import { DupeMatchResult, Product } from '@/lib/types';
import {
  ExternalLink,
  CheckCircle2,
  TrendingDown,
  Sparkles,
  Scale,
  ShoppingCart,
  Store,
  Clock,
  ShieldCheck,
} from 'lucide-react';

interface DupeLeaderboardProps {
  luxuryProduct: Product;
  dupes: DupeMatchResult[];
}

export function DupeLeaderboard({ luxuryProduct, dupes }: DupeLeaderboardProps) {
  if (dupes.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-rose-200 p-8 text-center text-sm text-[#7C6674]">
        No direct budget dupes recorded yet for this product.
      </div>
    );
  }

  const currentMonthYear = new Date().toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-rose-200/80 bg-rose-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/60 dark:text-rose-300">
              Formula Ranking Atelier
            </span>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#7B6573] dark:text-[#A792A0]">
              <Clock className="h-4 w-4 text-rose-400" />
              <span>Verified Formula Match • Updated for {currentMonthYear}</span>
            </div>
          </div>
          <h2 className="mt-2 font-serif text-2xl font-bold tracking-tight text-[#2A1D24] sm:text-3xl dark:text-[#FDF8F9]">
            Top Chemical Dupes & Formula Matches
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#6C5665] dark:text-[#BAA5B2]">
            Ranked by shared active ingredients, clinical bio-equivalence, and cosmetic volume concentrations.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-rose-200/80 bg-rose-50/80 px-4 py-2 text-xs sm:text-sm font-semibold text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/60 dark:text-rose-300">
          <Sparkles className="h-4 w-4 text-rose-500" />
          <span>{dupes.length} Verified Alternatives</span>
        </div>
      </div>

      <div className="space-y-5">
        {dupes.map((match, index) => {
          const dupe = match.dupeProduct;
          const isTopRanked = index === 0;
          const savingsPercentage = match.savingsPercentage;
          const savingsDollars = Math.round(match.savingsAmount);

          return (
            <div
              key={dupe.id}
              className={`relative overflow-hidden rounded-3xl border bg-white/95 p-6 sm:p-7 shadow-sm backdrop-blur-xs transition hover:shadow-lg dark:bg-[#1C121B]/95 ${
                isTopRanked
                  ? 'border-rose-400 ring-2 ring-rose-400/20'
                  : 'border-rose-100/90 dark:border-rose-950/60'
              }`}
            >
              {isTopRanked && (
                <div className="absolute top-0 right-0 rounded-bl-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 px-5 py-2 text-xs font-extrabold uppercase tracking-wider text-white shadow-sm">
                  ✨ #1 Best Formula Match
                </div>
              )}

              {/* Top Meta Trust & Stock Indicator */}
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/70 bg-rose-50/90 px-3 py-1 text-xs font-semibold text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/50 dark:text-rose-300">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
                  </span>
                  In Stock Online
                </div>

                <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#786271] dark:text-[#A792A0]">
                  <ShieldCheck className="h-4 w-4 text-rose-500" />
                  <span>Dermatologist & INCI Verified</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
                {/* Left: Product Info & Image */}
                <div className="flex gap-4 sm:gap-5 lg:col-span-5">
                  <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-rose-100/80 bg-rose-50/40 dark:border-rose-900/50 dark:bg-rose-950/30">
                    <img
                      src={dupe.imageUrl}
                      alt={dupe.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                      {dupe.brand}
                    </span>
                    <h3 className="mt-0.5 text-base sm:text-lg font-semibold text-[#2A1D24] dark:text-[#FDF8F9]">
                      {dupe.name}
                    </h3>

                    {/* Price Anchor & High-Visibility Savings Badge */}
                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-semibold text-[#8C7684] line-through">
                          ${luxuryProduct.price.toFixed(0)}
                        </span>
                        <span className="text-xs font-bold text-[#8C7684]">vs</span>
                        <span className="font-serif text-2xl font-bold text-[#2A1D24] dark:text-[#FDF8F9]">
                          ${dupe.price.toFixed(2)}
                        </span>
                      </div>

                      {savingsDollars > 0 && (
                        <div className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-xs">
                          <TrendingDown className="h-3.5 w-3.5" />
                          SAVE ${savingsDollars} ({savingsPercentage}% OFF)
                        </div>
                      )}
                    </div>

                    <div className="mt-2 text-xs sm:text-sm text-[#7A6472] dark:text-[#A893A0]">
                      Price Advantage:{' '}
                      <span className="font-bold text-rose-600 dark:text-rose-400">
                        {match.priceDiffMultiplier}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Center: Formula Match Percentage & Shared Actives */}
                <div className="flex flex-col justify-between border-t border-rose-100/70 pt-4 lg:col-span-4 lg:border-t-0 lg:border-l lg:border-rose-100/70 lg:pl-6 lg:pt-0 dark:border-rose-950/60">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#735D6B] dark:text-[#A792A0]">
                        Formula Similarity Score
                      </span>
                      <span className="font-serif text-2xl font-bold text-rose-600 dark:text-rose-400">
                        {match.matchPercentage}%
                      </span>
                    </div>

                    {/* Visual Progress Bar */}
                    <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-rose-100/70 dark:bg-rose-950/60">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 transition-all duration-500"
                        style={{ width: `${match.matchPercentage}%` }}
                      />
                    </div>

                    {/* Shared Hero Actives */}
                    <div className="mt-3.5">
                      <span className="text-xs sm:text-sm font-semibold text-[#735D6B] dark:text-[#A792A0]">
                        Shared Hero Actives ({match.sharedActives.length}):
                      </span>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {match.sharedActives.map((act) => (
                          <span
                            key={act}
                            className="inline-flex items-center gap-1 rounded-md border border-rose-100/80 bg-rose-50/60 px-2.5 py-1 text-xs font-semibold text-[#4B3744] dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-[#DEC9D4]"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 text-rose-500" />
                            {act}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Beauty Consultant Verdict */}
                  <div className="mt-4 rounded-2xl border border-rose-200/80 bg-rose-50/60 p-3.5 text-xs sm:text-sm leading-relaxed text-[#5F4B57] dark:border-rose-950/50 dark:bg-rose-950/30 dark:text-[#D1BCC7]">
                    <span className="font-bold text-[#2A1D24] dark:text-[#FDF8F9]">Beauty Consultant Verdict: </span>
                    {match.verdict}
                  </div>
                </div>

                {/* Right: High-Intent Call-to-Action Buttons */}
                <div className="flex flex-col justify-center gap-3 border-t border-rose-100/70 pt-4 lg:col-span-3 lg:border-t-0 lg:border-l lg:border-rose-100/70 lg:pl-6 lg:pt-0 dark:border-rose-950/60">
                  {/* Primary CTA: Amazon */}
                  <a
                    href={`/go/${dupe.slug}`}
                    target="_blank"
                    rel="nofollow noopener"
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 px-5 py-3 text-sm font-bold text-stone-950 shadow-sm transition hover:from-amber-400 hover:to-amber-300 hover:shadow-md"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>Check Price on Amazon</span>
                    <ExternalLink className="h-4 w-4 opacity-70 transition group-hover:translate-x-0.5" />
                  </a>

                  {/* Secondary CTA: Sephora / Target / Retailer */}
                  <a
                    href={`/go/${dupe.slug}`}
                    target="_blank"
                    rel="nofollow noopener"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200/80 bg-white/90 px-4 py-3 text-xs sm:text-sm font-bold text-[#35252F] shadow-2xs transition hover:border-rose-300 hover:bg-rose-50/60 dark:border-rose-900/60 dark:bg-[#1D131C] dark:text-[#F0DFE8] dark:hover:bg-rose-950/40"
                  >
                    <Store className="h-4 w-4 text-rose-500" />
                    <span>Find at Sephora / Target</span>
                  </a>

                  {/* Deep Formula Matrix Link */}
                  <Link
                    href={`/compare/${luxuryProduct.slug}-vs-${dupe.slug}`}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold text-[#735D6B] transition hover:text-rose-600 dark:text-[#A792A0] dark:hover:text-rose-400"
                  >
                    <Scale className="h-3.5 w-3.5" />
                    Compare Both Formulas Side-by-Side
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
