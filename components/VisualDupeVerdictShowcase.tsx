'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Heart, ShieldCheck, ShoppingCart } from 'lucide-react';

interface ShowcasePair {
  id: string;
  categoryLabel: string;
  tabLabel: string;
  luxuryProduct: {
    brand: string;
    name: string;
    price: number;
    imageUrl: string;
    slug: string;
  };
  dupeProduct: {
    brand: string;
    name: string;
    price: number;
    imageUrl: string;
    slug: string;
  };
  sharedHeroActives: string[];
  savingsUSD: number;
  consultantVerdict: string;
}

const SHOWCASE_PAIRS: ShowcasePair[] = [
  {
    id: 'estee-night-repair',
    categoryLabel: '🌙 Overnight Cellular Repair & Anti-Aging',
    tabLabel: 'Estée Lauder Twin',
    luxuryProduct: {
      brand: 'Estée Lauder',
      name: 'Advanced Night Repair Synchronized Multi-Recovery',
      price: 125,
      imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
      slug: 'estee-lauder-advanced-night-repair',
    },
    dupeProduct: {
      brand: 'Missha',
      name: 'Time Revolution Night Repair Ampoule 5X',
      price: 28,
      imageUrl: 'https://images.unsplash.com/photo-1608248597359-0f2b23616892?auto=format&fit=crop&w=600&q=80',
      slug: 'missha-time-revolution-night-repair-ampoule-5x',
    },
    sharedHeroActives: [
      'Bifida Ferment Lysate (Cellular DNA Repair)',
      'Hyaluronic Acid Complex (Plumping Hydration)',
      'Tripeptide-32 & Niacinamide (Firmness & Elasticity)',
    ],
    savingsUSD: 97,
    consultantVerdict:
      'Both serums rely on the identical concentration of fermented probiotic lysates and firming peptide complexes. The cellular nighttime recovery mechanism is biologically equivalent. The only difference is the heavy luxury glass bottle and prestige marketing budget. You save $97.',
  },
  {
    id: 'skinceuticals-ce',
    categoryLabel: '✨ Dark Spot Brightening & Antioxidant Shield',
    tabLabel: 'SkinCeuticals Twin',
    luxuryProduct: {
      brand: 'SkinCeuticals',
      name: 'C E Ferulic High-Potency Antioxidant Serum',
      price: 182,
      imageUrl: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=600&q=80',
      slug: 'skinceuticals-ce-ferulic',
    },
    dupeProduct: {
      brand: 'Geek & Gorgeous',
      name: 'C-Glow 15% Pure L-Ascorbic Acid + Ferulic Acid',
      price: 14,
      imageUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80',
      slug: 'geek-and-gorgeous-c-glow',
    },
    sharedHeroActives: [
      '15% Pure L-Ascorbic Acid (Clinically Proven Brightening)',
      '0.5% Ferulic Acid (Vitamin C Stabilization)',
      '1% Alpha-Tocopherol (Vitamin E Lipid Barrier)',
    ],
    savingsUSD: 168,
    consultantVerdict:
      'The famous Duke University patented antioxidant ratio (15% C + 1% E + 0.5% Ferulic Acid at pH 2.8) is replicated molecule-for-molecule in Geek & Gorgeous. You receive identical clinical photoprotection and collagen-stimulating power at a fraction of the cost.',
  },
  {
    id: 'la-mer-creme',
    categoryLabel: '💧 Ultra-Rich Moisture & Barrier Elixir',
    tabLabel: 'La Mer Twin',
    luxuryProduct: {
      brand: 'La Mer',
      name: 'Crème de la Mer Moisturizing Miracle Cream',
      price: 380,
      imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
      slug: 'la-mer-creme-de-la-mer',
    },
    dupeProduct: {
      brand: 'Avène',
      name: 'Cicalfate+ Restorative Protective Cream',
      price: 24,
      imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
      slug: 'avene-cicalfate-restorative-cream',
    },
    sharedHeroActives: [
      'Mineral Barrier Shield (Occlusive Moisture Lock)',
      'Thermal Spring Water & Magnesium Minerals',
      'Panthenol & Glycerin Repair Matrix',
    ],
    savingsUSD: 356,
    consultantVerdict:
      'La Mer\'s velvety barrier shield is fundamentally based on mineral lipids, occlusives, and trace minerals. This trusted pharmacy restorative cream delivers the same occlusive cocoon to immediately soothe dry, compromised skin while keeping $356 in your wallet.',
  },
];

export function VisualDupeVerdictShowcase() {
  const [activeTab, setActiveTab] = useState(0);
  const current = SHOWCASE_PAIRS[activeTab];

  return (
    <section className="mb-24 overflow-hidden rounded-3xl border border-rose-200/80 bg-gradient-to-br from-white via-rose-50/40 to-pink-50/30 p-6 sm:p-10 shadow-sm backdrop-blur-xs dark:border-rose-950/60 dark:from-[#1A1118] dark:via-[#160E14] dark:to-[#1C121B]">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-200/80 bg-rose-100/70 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/60 dark:text-rose-300">
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
            <span>Beauty Consultant Recommendation</span>
          </div>
          <h2 className="mt-3 font-serif text-2xl font-bold tracking-tight text-[#2A1D24] sm:text-3xl lg:text-4xl dark:text-[#FDF8F9]">
            The Only Difference Is The Price Tag
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#65505E] dark:text-[#C5B0BD] max-w-xl">
            Prestige cosmetic brands charge hundreds of dollars for formulas available for a fraction of the cost. Compare them side-by-side and decide for yourself.
          </p>
        </div>

        {/* Tab selection pills */}
        <div className="flex flex-wrap gap-2">
          {SHOWCASE_PAIRS.map((pair, idx) => (
            <button
              key={pair.id}
              onClick={() => setActiveTab(idx)}
              className={`rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                activeTab === idx
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'border border-rose-200/70 bg-white/80 text-[#543F4D] hover:bg-rose-50 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-[#DEC9D4]'
              }`}
            >
              {pair.tabLabel}
            </button>
          ))}
        </div>
      </div>

      {/* Main Side-by-Side Visual Card */}
      <div className="mt-8 rounded-3xl border border-rose-100/90 bg-white/95 p-6 sm:p-8 shadow-sm dark:border-rose-950/60 dark:bg-[#1E131C]">
        <div className="mb-4 inline-block rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
          {current.categoryLabel}
        </div>

        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-11">
          {/* Left: Luxury Product */}
          <div className="lg:col-span-5 flex flex-col items-center sm:flex-row sm:items-start gap-5 rounded-2xl border border-rose-100/80 bg-rose-50/30 p-5 dark:border-rose-900/40 dark:bg-rose-950/20">
            <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl border border-rose-100 bg-white p-2 shadow-xs dark:border-rose-900/50 dark:bg-rose-950/40">
              <img
                src={current.luxuryProduct.imageUrl}
                alt={current.luxuryProduct.name}
                className="h-full w-full rounded-xl object-cover"
              />
              <span className="absolute top-2 left-2 rounded-full bg-[#2A1D24]/80 px-2 py-0.5 text-[10px] font-bold text-white">
                Prestige Brand
              </span>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8A7482]">
                {current.luxuryProduct.brand}
              </span>
              <h4 className="mt-1 font-serif text-base sm:text-lg font-bold text-[#2A1D24] dark:text-[#FDF8F9]">
                {current.luxuryProduct.name}
              </h4>
              <div className="mt-2.5 flex items-baseline justify-center sm:justify-start gap-2">
                <span className="font-serif text-2xl font-bold text-[#2A1D24] dark:text-[#FDF8F9]">
                  ${current.luxuryProduct.price.toFixed(2)}
                </span>
                <span className="text-xs text-[#8A7482]">MSRP</span>
              </div>
              <p className="mt-2 text-xs text-[#7A6472] dark:text-[#A893A0]">
                Prestige packaging, exclusive department store markups.
              </p>
            </div>
          </div>

          {/* Center: VS Badge */}
          <div className="lg:col-span-1 flex flex-col items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 text-sm font-bold text-white shadow-md">
              VS
            </div>
            <div className="mt-2 hidden text-center lg:block">
              <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                Formula Match
              </span>
            </div>
          </div>

          {/* Right: Drugstore Twin */}
          <div className="lg:col-span-5 flex flex-col items-center sm:flex-row sm:items-start gap-5 rounded-2xl border-2 border-rose-300 bg-gradient-to-br from-rose-50/70 to-pink-50/50 p-5 shadow-sm dark:border-rose-800 dark:bg-rose-950/30">
            <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl border border-rose-200 bg-white p-2 shadow-xs dark:border-rose-900/50 dark:bg-rose-950/40">
              <img
                src={current.dupeProduct.imageUrl}
                alt={current.dupeProduct.name}
                className="h-full w-full rounded-xl object-cover"
              />
              <span className="absolute top-2 left-2 rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white">
                Smart Choice
              </span>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                {current.dupeProduct.brand}
              </span>
              <h4 className="mt-1 font-serif text-base sm:text-lg font-bold text-[#2A1D24] dark:text-[#FDF8F9]">
                {current.dupeProduct.name}
              </h4>
              <div className="mt-2.5 flex items-baseline justify-center sm:justify-start gap-2">
                <span className="font-serif text-2xl font-bold text-rose-600 dark:text-rose-400">
                  ${current.dupeProduct.price.toFixed(2)}
                </span>
                <span className="text-xs text-[#8A7482]">Verified Alternative</span>
              </div>
              <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-rose-600 px-3 py-1 text-xs font-bold text-white shadow-2xs">
                You Save: ${current.savingsUSD} ({Math.round((current.savingsUSD / current.luxuryProduct.price) * 100)}% OFF)
              </div>
            </div>
          </div>
        </div>

        {/* Shared Actives Box */}
        <div className="mt-7 border-t border-rose-100/80 pt-5 dark:border-rose-950/60">
          <div className="text-xs font-bold uppercase tracking-wider text-[#735D6B] dark:text-[#A792A0]">
            Core Active Ingredients Shared in Both Formulations:
          </div>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {current.sharedHeroActives.map((active, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/80 bg-rose-50/70 px-3.5 py-1 text-xs sm:text-sm font-semibold text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200"
              >
                <Check className="h-3.5 w-3.5 text-rose-600" />
                {active}
              </span>
            ))}
          </div>
        </div>

        {/* Beauty Consultant Verdict Box */}
        <div className="mt-6 rounded-2xl border border-rose-200/80 bg-rose-50/60 p-4 sm:p-5 dark:border-rose-900/50 dark:bg-rose-950/30">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-rose-600" />
            <span className="font-serif text-sm sm:text-base font-bold text-[#2A1D24] dark:text-[#FDF8F9]">
              Beauty Consultant Verdict:
            </span>
          </div>
          <p className="mt-2 text-sm sm:text-base leading-relaxed text-[#513C49] dark:text-[#D5C2CF]">
            {current.consultantVerdict}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-rose-200/60 dark:border-rose-900/40">
            <Link
              href={`/compare/${current.luxuryProduct.slug}-vs-${current.dupeProduct.slug}`}
              className="text-xs sm:text-sm font-bold text-rose-700 hover:text-rose-800 dark:text-rose-300 flex items-center gap-1"
            >
              <span>View In-Depth Formula Comparison</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href={`/dupes/${current.luxuryProduct.slug}`}
              className="rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-5 py-2 text-xs sm:text-sm font-bold text-stone-950 shadow-xs hover:from-amber-400 hover:to-amber-300 flex items-center gap-1.5"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              <span>Check {current.dupeProduct.brand} Price</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
