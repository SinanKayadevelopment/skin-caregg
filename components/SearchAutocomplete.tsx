'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, ArrowRight, X } from 'lucide-react';
import { Product } from '@/lib/types';

interface SearchAutocompleteProps {
  products: Product[];
}

export function SearchAutocomplete({ products }: SearchAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filtered = query.trim().length > 0
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.brand.toLowerCase().includes(query.toLowerCase()) ||
            p.ingredientsRaw.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 8)
    : [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (slug: string) => {
    setIsOpen(false);
    router.push(`/dupes/${slug}`);
  };

  const trendingQueries = [
    { label: 'Estée Lauder Night Repair', slug: 'estee-lauder-advanced-night-repair' },
    { label: 'La Mer Crème de la Mer', slug: 'la-mer-creme-de-la-mer' },
    { label: 'SkinCeuticals C E Ferulic', slug: 'skinceuticals-ce-ferulic' },
    { label: 'Paula\'s Choice 2% BHA', slug: 'paulas-choice-skin-perfecting-2-bha-liquid-exfoliant' },
    { label: 'Charlotte Tilbury Magic Cream', slug: 'charlotte-tilbury-magic-cream' },
  ];

  return (
    <div className="relative mx-auto w-full max-w-3xl" ref={dropdownRef}>
      <div className="relative flex items-center">
        <div className="pointer-events-none absolute left-4 text-rose-500">
          <Search className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        <input
          id="search-bar"
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Which luxury product are you looking for? (e.g. Estée Lauder, La Mer, Vitamin C)..."
          className="w-full rounded-2xl border border-rose-200/90 bg-white/95 py-4 pl-12 pr-12 text-sm sm:text-base text-[#2C1F25] shadow-lg shadow-rose-200/20 outline-none transition placeholder:text-[#917A88] focus:border-rose-400 focus:ring-4 focus:ring-rose-200/30 dark:border-rose-900/60 dark:bg-[#1D131B] dark:text-white dark:shadow-none"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 rounded-full p-1.5 text-rose-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/40"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-2xl border border-rose-100/90 bg-white/98 p-3 shadow-2xl backdrop-blur-md dark:border-rose-900/60 dark:bg-[#1B121A]/98">
          {filtered.length > 0 && (
            <>
              <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                Matching Formulations ({filtered.length})
              </div>
              <div className="divide-y divide-rose-50 dark:divide-rose-950/40">
                {filtered.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item.slug)}
                    className="group flex cursor-pointer items-center justify-between gap-3 rounded-xl p-3.5 transition hover:bg-rose-50/80 dark:hover:bg-rose-950/40"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-100 to-pink-50 text-xs font-bold text-rose-800 shadow-2xs dark:from-rose-950 dark:to-rose-900 dark:text-rose-200">
                        {item.brand.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-rose-700 dark:text-rose-400">
                            {item.brand}
                          </span>
                          {item.isLuxuryTarget && (
                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                              Holy Grail
                            </span>
                          )}
                        </div>
                        <p className="text-sm sm:text-base font-semibold text-[#2C1F25] group-hover:text-rose-800 dark:text-slate-100 dark:group-hover:text-rose-300">
                          {item.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3 text-right">
                      <div className="text-right">
                        <div className="text-sm font-bold text-[#2C1F25] dark:text-slate-100">
                          ${item.price.toFixed(2)}
                        </div>
                        <div className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                          {item.isLuxuryTarget ? 'Find Dupes' : 'View Match'}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-rose-400 transition group-hover:translate-x-1 group-hover:text-rose-600" />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Dynamic AI Dupe Search Action */}
          <div className="mt-2 border-t border-rose-100 pt-2 dark:border-rose-900/60">
            <a
              href={`#ai-finder`}
              onClick={() => {
                setIsOpen(false);
                // Dispatch event so AI studio receives query and focuses
                window.dispatchEvent(new CustomEvent('dermadupe-ai-query', { detail: query }));
              }}
              className="flex items-center justify-between gap-3 rounded-xl bg-gradient-to-r from-rose-50 to-pink-50/80 p-3.5 text-rose-900 transition hover:from-rose-100 hover:to-pink-100 dark:from-rose-950/60 dark:to-pink-950/40 dark:text-rose-200"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500 text-white shadow-sm">
                  <Sparkles className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                    AI Cosmetic Lab
                  </div>
                  <div className="text-sm font-bold">
                    Ask AI: Deconstruct & Find Dupes for &ldquo;{query}&rdquo;
                  </div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-rose-500" />
            </a>
          </div>
        </div>
      )}

      {/* Quick Trending Suggestions */}
      <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-[#6B5563] sm:justify-start">
        <span className="flex items-center gap-1 font-bold text-rose-600 dark:text-rose-400">
          <Sparkles className="h-3.5 w-3.5 text-rose-500" />
          Trending Holy Grails:
        </span>
        {trendingQueries.map((item) => (
          <button
            key={item.slug}
            type="button"
            onClick={() => handleSelect(item.slug)}
            className="rounded-full border border-rose-200/70 bg-white/90 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-[#4E3A47] shadow-2xs transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-[#E2CED9] dark:hover:bg-rose-900/40"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
