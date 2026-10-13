import React from 'react';
import Link from 'next/link';
import { Sparkles, Layers, ShieldCheck } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-rose-100/70 bg-[#FAF6F5]/90 backdrop-blur-md dark:border-rose-950/40 dark:bg-[#150E13]/90 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-95">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-300 text-white shadow-[0_4px_14px_rgba(224,118,140,0.3)] ring-1 ring-rose-200/50">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="flex items-baseline">
            <span className="font-serif text-2xl font-bold tracking-tight text-[#2B1D24] dark:text-[#FDF8F9]">
              Derma<span className="italic font-normal text-rose-600 dark:text-rose-400">Dupe</span>
            </span>
            <span className="ml-2.5 hidden rounded-full border border-rose-200/70 bg-rose-50/90 px-3 py-0.5 text-xs font-bold uppercase tracking-widest text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/50 dark:text-rose-300 sm:inline-block">
              Beauty Atelier
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <Link
            href="/#ai-finder"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-rose-700 transition-colors hover:text-rose-900 dark:text-rose-300 dark:hover:text-white"
          >
            <Sparkles className="h-4 w-4 text-rose-500 animate-spin" />
            <span>AI Dupe Studio</span>
            <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800 dark:bg-rose-950 dark:text-rose-200">Free</span>
          </Link>
          <Link
            href="/#holy-grails"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#4E3944] transition-colors hover:text-rose-600 dark:text-[#DEC8D2] dark:hover:text-rose-400"
          >
            <Sparkles className="h-4 w-4 text-rose-500" />
            Top 50 Holy Grails
          </Link>
          <Link
            href="/#compare-section"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#4E3944] transition-colors hover:text-rose-600 dark:text-[#DEC8D2] dark:hover:text-rose-400"
          >
            <Layers className="h-4 w-4 text-amber-500" />
            Formula Compare
          </Link>
          <Link
            href="/#conflicts"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#4E3944] transition-colors hover:text-rose-600 dark:text-[#DEC8D2] dark:hover:text-rose-400"
          >
            <ShieldCheck className="h-4 w-4 text-rose-500" />
            Routine Safety
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/#search-bar"
            className="rounded-full border border-rose-300/80 bg-gradient-to-r from-rose-50 to-pink-50/80 px-4 py-2 text-xs sm:text-sm font-bold text-rose-800 shadow-2xs transition hover:border-rose-400 hover:bg-rose-100 hover:shadow-xs dark:border-rose-800/60 dark:bg-rose-950/40 dark:text-rose-200"
          >
            ✨ Find a Dupe
          </Link>
        </div>
      </div>
    </header>
  );
}
