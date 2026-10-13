import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, HeartHandshake } from 'lucide-react';
import { LUXURY_TARGETS } from '@/data/all-products';

export function Footer() {
  const popularLuxury = LUXURY_TARGETS.slice(0, 8);

  return (
    <footer className="border-t border-rose-100/70 bg-[#FAF4F2]/90 text-[#54414D] dark:border-rose-950/40 dark:bg-[#120B10] dark:text-[#CBB5C1] transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-300 text-white shadow-sm ring-1 ring-rose-200/50">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-[#2A1D24] dark:text-[#FDF8F9]">
                Derma<span className="italic font-normal text-rose-600 dark:text-rose-400">Dupe</span>
              </span>
            </div>
            <p className="mt-3.5 text-xs sm:text-sm leading-relaxed text-[#685360] dark:text-[#BAA3AF]">
              The transparent luxury skincare intelligence guide. We deconstruct prestige cosmetic formulas to reveal verified, budget-friendly formula twins with identical active concentrations.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs sm:text-sm text-rose-700 dark:text-rose-300 font-medium">
              <ShieldCheck className="h-4 w-4 text-rose-500 shrink-0" />
              <span>Independent cosmetic chemistry analysis</span>
            </div>
          </div>

          <div>
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#2A1D24] dark:text-[#FDF8F9]">
              Trending Holy Grail Dupes
            </h3>
            <ul className="mt-3.5 space-y-2.5 text-xs sm:text-sm">
              {popularLuxury.slice(0, 5).map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/dupes/${p.slug}`}
                    className="transition hover:text-rose-600 dark:hover:text-rose-400"
                  >
                    Best {p.brand} {p.name.slice(0, 22)} Dupes
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#2A1D24] dark:text-[#FDF8F9]">
              Skincare Routine Safety Guides
            </h3>
            <ul className="mt-3.5 space-y-2.5 text-xs sm:text-sm">
              {popularLuxury.slice(5, 8).map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/dupes/${p.slug}`}
                    className="transition hover:text-rose-600 dark:hover:text-rose-400"
                  >
                    {p.brand} Budget-Friendly Twins
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/conflicts/retinol-and-salicylic-acid"
                  className="transition hover:text-rose-600 dark:hover:text-rose-400"
                >
                  Can You Mix Retinol & Salicylic Acid?
                </Link>
              </li>
              <li>
                <Link
                  href="/conflicts/ascorbic-acid-and-retinol"
                  className="transition hover:text-rose-600 dark:hover:text-rose-400"
                >
                  Vitamin C & Retinol AM/PM Routine Order
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#2A1D24] dark:text-[#FDF8F9]">
              Dermatological & Affiliate Disclosure
            </h3>
            <p className="mt-3.5 text-xs sm:text-sm leading-relaxed text-[#685360] dark:text-[#BAA3AF]">
              DermaDupe is an independent research platform. Comparisons are calculated mathematically based on declared INCI ingredient lists under US and EU regulations.
            </p>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#685360] dark:text-[#BAA3AF]">
              <HeartHandshake className="inline h-4 w-4 mr-1 text-rose-500 align-text-bottom" />
              When you purchase through links on our site, we may earn an affiliate commission at no additional cost to you.
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-rose-100/70 pt-6 text-center text-xs sm:text-sm text-[#7E6975] dark:border-rose-950/40 dark:text-[#9F8A96]">
          <p>© {new Date().getFullYear()} DermaDupe Beauty Atelier. All rights reserved. Smart, budget-friendly luxury skincare.</p>
        </div>
      </div>
    </footer>
  );
}
