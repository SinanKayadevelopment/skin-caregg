'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, Check } from 'lucide-react';

export interface ConcernCategory {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  popularBrands: string;
  slugFilter: string[];
}

export const SKIN_CONCERNS: ConcernCategory[] = [
  {
    id: 'anti-aging',
    icon: '🌸',
    title: 'Fine Lines & Collagen (Anti-Aging)',
    subtitle: 'Estée Lauder, La Mer & Peptide Dupes',
    description: 'Smooth expression lines and restore youthful skin firmness with intensive nighttime repair formulas.',
    popularBrands: 'Estée Lauder, La Mer, Charlotte Tilbury',
    slugFilter: [
      'estee-lauder-advanced-night-repair',
      'la-mer-creme-de-la-mer',
      'drunken-elephant-protini-polypeptide-cream',
      'charlotte-tilbury-magic-cream',
      'sk-ii-facial-treatment-essence',
    ],
  },
  {
    id: 'vitamin-c',
    icon: '✨',
    title: 'Brightening Vitamin C & Dark Spots',
    subtitle: 'SkinCeuticals & Active Acid Dupes',
    description: 'Fade sun and age spots, even out skin tone, and restore a fresh, radiant glow with potent antioxidants.',
    popularBrands: 'SkinCeuticals, Sunday Riley, Paula\'s Choice',
    slugFilter: [
      'skinceuticals-ce-ferulic',
      'paulas-choice-skin-perfecting-2-bha-liquid-exfoliant',
      'sunday-riley-good-genes-all-in-one-lactic-acid',
      'biologique-recherche-lotion-p50',
    ],
  },
  {
    id: 'barrier-hydration',
    icon: '💧',
    title: 'Deep Hydration & Barrier Repair',
    subtitle: 'Triple Lipid, Clinique & Dry Skin Rescuers',
    description: 'Comfort tight, parched skin with ceramide-dense emollients and physiological barrier restorers.',
    popularBrands: 'SkinCeuticals 2:4:2, Clinique, Tatcha',
    slugFilter: [
      'skinceuticals-triple-lipid-restore-2-4-2',
      'clinique-moisture-surge-100h',
      'tatcha-the-water-cream',
      'dr-barbara-sturm-hyaluronic-serum',
    ],
  },
  {
    id: 'eye-firming',
    icon: '👁️',
    title: 'Eye Contour & Firming Care',
    subtitle: 'Dark Circles & Elasticity Recovery',
    description: 'Nourish delicate orbital skin, reduce morning puffiness, and smooth crow’s feet without irritation.',
    popularBrands: 'Estée Lauder Eye, Kiehl\'s, Shiseido',
    slugFilter: [
      'kiehls-midnight-recovery-concentrate',
      'sk-ii-facial-treatment-essence',
      'estee-lauder-advanced-night-repair',
    ],
  },
];

interface SkinConcernCategorySectionProps {
  onSelectConcern?: (slugs: string[]) => void;
  activeConcernId?: string | null;
}

export function SkinConcernCategorySection({
  onSelectConcern,
  activeConcernId,
}: SkinConcernCategorySectionProps) {
  const [selectedId, setSelectedId] = useState<string | null>(activeConcernId || null);

  const handleSelect = (concern: ConcernCategory) => {
    const nextId = selectedId === concern.id ? null : concern.id;
    setSelectedId(nextId);
    if (onSelectConcern) {
      onSelectConcern(nextId ? concern.slugFilter : []);
    }
  };

  return (
    <section className="mb-20">
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-rose-200/90 bg-rose-50/90 px-4 py-1.5 text-xs font-semibold text-rose-800 shadow-2xs dark:border-rose-900/60 dark:bg-rose-950/60 dark:text-rose-300">
          <Sparkles className="h-4 w-4 text-rose-500" />
          <span>Simple Selection • Discover By Skin Concern</span>
        </div>
        <h2 className="mt-3 font-serif text-2xl font-bold tracking-tight text-[#2A1D24] sm:text-3xl lg:text-4xl dark:text-[#FDF8F9]">
          What Does Your Skin Need Today?
        </h2>
        <p className="mt-2 text-sm sm:text-base text-[#65505E] dark:text-[#C5B0BD] max-w-2xl">
          No need to memorize chemical names. Select your primary skin goal below to instantly explore verified, budget-friendly formula twins.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SKIN_CONCERNS.map((concern) => {
          const isSelected = selectedId === concern.id;

          return (
            <div
              key={concern.id}
              onClick={() => handleSelect(concern)}
              className={`group relative flex cursor-pointer flex-col justify-between rounded-3xl border p-6 transition-all duration-300 ${
                isSelected
                  ? 'border-rose-400 bg-gradient-to-b from-rose-50/90 to-pink-50/70 shadow-lg ring-2 ring-rose-300/40 dark:border-rose-800 dark:from-rose-950/40 dark:to-pink-950/20'
                  : 'border-rose-100/90 bg-white/90 shadow-sm hover:-translate-y-1 hover:border-rose-300 hover:shadow-md dark:border-rose-950/60 dark:bg-[#1C121B]/90'
              }`}
            >
              <div>
                {/* Icon & Selection Indicator */}
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-100 to-pink-50 text-2xl shadow-inner dark:from-rose-950 dark:to-rose-900">
                    {concern.icon}
                  </div>
                  {isSelected && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-white shadow-2xs">
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </span>
                  )}
                </div>

                <h3 className="mt-4 font-serif text-lg font-bold text-[#2A1D24] dark:text-[#FDF8F9]">
                  {concern.title}
                </h3>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  {concern.subtitle}
                </div>

                <p className="mt-3 text-sm leading-relaxed text-[#5F4957] dark:text-[#C5B0BD]">
                  {concern.description}
                </p>
              </div>

              <div className="mt-5 border-t border-rose-100/70 pt-3 dark:border-rose-950/50">
                <span className="text-xs sm:text-sm font-semibold text-rose-700 group-hover:text-rose-800 dark:text-rose-300 flex items-center justify-between">
                  <span>{isSelected ? 'Clear Filter' : 'Explore Products'}</span>
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
