import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getAllProducts, getLuxuryTargets, getDupesForProduct, getPopularComparePairs, getAllConflictRoutes } from '@/lib/data';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SearchAutocomplete } from '@/components/SearchAutocomplete';
import { RoutineConflictCheckerWidget } from '@/components/RoutineConflictCheckerWidget';
import { SkinConcernCategorySection } from '@/components/SkinConcernCategorySection';
import { VisualDupeVerdictShowcase } from '@/components/VisualDupeVerdictShowcase';
import { AIDupeFinderStudio } from '@/components/AIDupeFinderStudio';
import { JsonLd } from '@/components/JsonLd';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Scale,
  Award,
  Heart,
  CheckCircle2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'DermaDupe Atelier | Luxury Skincare Dupes & Smart Beauty Guide',
  description: 'Find verified, budget-friendly drugstore twins for luxury skincare favorites like Estée Lauder, La Mer, and SkinCeuticals. Save up to 85% on identical active formulas.',
  openGraph: {
    title: 'DermaDupe Atelier | Luxury Skincare Dupes & Smart Beauty Guide',
    description: 'Invest in your skin, not the luxury label. Discover verified formula twins with identical restorative actives.',
  },
};

export default function HomePage() {
  const allProducts = getAllProducts();
  const luxuryTargets = getLuxuryTargets();
  const comparePairs = getPopularComparePairs().slice(0, 6);
  const conflictRoutes = getAllConflictRoutes().slice(0, 6);

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'DermaDupe Atelier',
    url: 'https://dermadupe.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://dermadupe.com/dupes/{search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <div className="relative min-h-screen bg-[#FAF6F5] pb-24 text-[#2C1F25] dark:bg-[#150E13] dark:text-[#F8F1F3] transition-colors">
      <div className="pointer-events-none fixed inset-0 luxe-ambient-glow" />
      <JsonLd data={websiteSchema} />
      <Header />

      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="pt-14 pb-14 text-center sm:pt-20 sm:pb-20">
          <div className="mx-auto max-w-3xl">
            {/* Friendly Community Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-200/90 bg-rose-50/90 px-4 py-2 text-xs sm:text-sm font-semibold text-rose-800 shadow-2xs dark:border-rose-900/60 dark:bg-rose-950/60 dark:text-rose-300">
              <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" />
              <span>Beauty Community Verified • Most Requested Luxury Skincare Dupes</span>
            </div>

            <h1 className="mt-7 font-serif text-3xl font-normal tracking-tight text-[#2A1D24] sm:text-5xl lg:text-6xl dark:text-[#FDF8F9]">
              Invest In Your Skin, Not The Label.{' '}
              <span className="block italic font-normal rose-gold-text sm:inline">
                Discover Verified Formula Twins.
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg leading-relaxed text-[#5F4B57] dark:text-[#D1BCC7]">
              Stop paying hundreds of dollars for prestige moisturizers and serums. We analyze luxury skincare formulas to uncover verified, budget-friendly alternatives that share the exact same active ingredients and restorative results.
            </p>

            {/* Interactive Hero Search */}
            <div className="mt-8">
              <SearchAutocomplete products={allProducts} />
            </div>

            {/* Trust Metrics */}
            <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 border-t border-rose-200/60 pt-8 sm:grid-cols-4 dark:border-rose-950/60">
              <div className="rounded-2xl bg-white/70 p-4 shadow-2xs backdrop-blur-xs dark:bg-rose-950/30">
                <div className="font-serif text-3xl font-bold text-[#2A1D24] dark:text-[#FDF8F9]">50+</div>
                <div className="mt-1 text-xs sm:text-sm font-medium text-[#7D6674] dark:text-[#AA95A2]">Holy Grails Deconstructed</div>
              </div>
              <div className="rounded-2xl bg-white/70 p-4 shadow-2xs backdrop-blur-xs dark:bg-rose-950/30">
                <div className="font-serif text-3xl font-bold text-rose-600 dark:text-rose-400">85%</div>
                <div className="mt-1 text-xs sm:text-sm font-medium text-[#7D6674] dark:text-[#AA95A2]">Average Price Savings</div>
              </div>
              <div className="rounded-2xl bg-white/70 p-4 shadow-2xs backdrop-blur-xs dark:bg-rose-950/30">
                <div className="font-serif text-3xl font-bold text-[#2A1D24] dark:text-[#FDF8F9]">100%</div>
                <div className="mt-1 text-xs sm:text-sm font-medium text-[#7D6674] dark:text-[#AA95A2]">Bio-Equivalent Actives</div>
              </div>
              <div className="rounded-2xl bg-white/70 p-4 shadow-2xs backdrop-blur-xs dark:bg-rose-950/30">
                <div className="font-serif text-3xl font-bold text-rose-600 dark:text-rose-400">Pure</div>
                <div className="mt-1 text-xs sm:text-sm font-medium text-[#7D6674] dark:text-[#AA95A2]">Transparent INCI Testing</div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Gemini AI Dupe Studio */}
        <section id="ai-finder" className="mb-20 scroll-mt-24">
          <AIDupeFinderStudio />
        </section>

        {/* 1. Visual "The Only Difference Is The Price Tag" Showcase */}
        <VisualDupeVerdictShowcase />

        {/* 2. 4 Large Skin Concern Categories */}
        <SkinConcernCategorySection />

        {/* Top 50 Luxury Holy Grails & Proven Dupes Leaderboard */}
        <section id="holy-grails" className="mb-24">
          <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-rose-200/80 bg-rose-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/60 dark:text-rose-300">
                  Curated Catalog
                </span>
                <span className="text-xs sm:text-sm text-[#7D6674] dark:text-[#A792A0]">Verified Formula Database</span>
              </div>
              <h2 className="mt-2 font-serif text-2xl font-bold tracking-tight text-[#2A1D24] sm:text-3xl dark:text-[#FDF8F9]">
                Prestige Holy Grails & Affordable Twins
              </h2>
              <p className="mt-1 text-sm sm:text-base text-[#6C5665] dark:text-[#BAA5B2]">
                Explore iconic luxury formulations deconstructed side-by-side with verified drugstore alternatives.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {luxuryTargets.map((product) => {
              const dupes = getDupesForProduct(product);
              const topDupe = dupes[0];

              return (
                <div
                  key={product.id}
                  className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-rose-100/90 bg-white/90 p-6 shadow-sm backdrop-blur-xs transition hover:-translate-y-1 hover:border-rose-300 hover:shadow-[0_16px_35px_rgba(224,140,160,0.12)] dark:border-rose-950/60 dark:bg-[#1C121B]/90"
                >
                  <div>
                    {/* Header: Product details & image */}
                    <div className="flex items-start gap-4">
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-rose-100/80 bg-rose-50/40 dark:border-rose-900/50 dark:bg-rose-950/30">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover transition group-hover:scale-105"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                          {product.brand}
                        </span>
                        <h3 className="line-clamp-2 text-sm sm:text-base font-semibold text-[#2A1D24] dark:text-[#FDF8F9]">
                          {product.name}
                        </h3>
                        <div className="mt-1 font-serif text-lg sm:text-xl font-bold text-[#2A1D24] dark:text-[#FDF8F9]">
                          ${product.price.toFixed(2)}{' '}
                          <span className="font-sans text-xs font-normal text-[#86707E] dark:text-[#9F8A98]">MSRP</span>
                        </div>
                      </div>
                    </div>

                    {/* Best Dupe Highlight */}
                    {topDupe && (
                      <div className="mt-5 rounded-2xl border border-rose-100/90 bg-gradient-to-br from-rose-50/70 to-pink-50/50 p-4 dark:border-rose-950/60 dark:bg-rose-950/20">
                        <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
                          <span className="text-[#6C5665] dark:text-[#AA95A2]">Top Verified Twin:</span>
                          <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800 dark:bg-rose-900/60 dark:text-rose-200">
                            {topDupe.matchPercentage}% Match
                          </span>
                        </div>

                        <div className="mt-1.5 text-sm font-bold text-[#2A1D24] dark:text-[#FDF8F9] truncate">
                          {topDupe.dupeProduct.brand} {topDupe.dupeProduct.name}
                        </div>

                        <div className="mt-1.5 flex items-center justify-between text-xs sm:text-sm">
                          <span className="font-bold text-rose-600 dark:text-rose-400">
                            ${topDupe.dupeProduct.price.toFixed(2)} ({topDupe.priceDiffMultiplier})
                          </span>
                          <span className="text-[#846E7C] dark:text-[#9F8A98] font-medium">
                            Save ${topDupe.savingsAmount.toFixed(0)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-5 border-t border-rose-100/70 pt-3 dark:border-rose-950/50">
                    <Link
                      href={`/dupes/${product.slug}`}
                      className="flex items-center justify-between text-xs sm:text-sm font-semibold text-[#2A1D24] transition group-hover:text-rose-600 dark:text-[#FDF8F9] dark:group-hover:text-rose-400"
                    >
                      <span>Explore all {dupes.length} dupes & formula matrix</span>
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1 text-rose-400" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Interactive Routine Conflict & Synergy Engine */}
        <section id="conflicts" className="mb-24">
          <RoutineConflictCheckerWidget />
        </section>

        {/* Formula Comparison Showcase */}
        <section id="compare-section" className="mb-24">
          <div className="mb-7">
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-rose-200/80 bg-rose-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/60 dark:text-rose-300">
                Direct Matrix
              </span>
              <span className="text-xs sm:text-sm text-[#826C7A] dark:text-[#A792A0]">Side-by-Side Comparisons</span>
            </div>
            <h2 className="mt-2 font-serif text-2xl font-bold tracking-tight text-[#2A1D24] sm:text-3xl dark:text-[#FDF8F9]">
              Popular Formula Comparisons
            </h2>
            <p className="mt-1 text-sm sm:text-base text-[#6C5665] dark:text-[#BAA5B2]">
              Ingredient-by-ingredient matrices showing active percentages, concentration rankings, and price differences.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {comparePairs.map((pair) => (
              <Link
                key={pair.slug}
                href={`/compare/${pair.slug}`}
                className="group flex items-center justify-between rounded-2xl border border-rose-100/80 bg-white/90 p-5 shadow-2xs backdrop-blur-xs transition hover:border-rose-300 hover:shadow-md dark:border-rose-950/60 dark:bg-[#1C121B]/90"
              >
                <div>
                  <div className="text-xs font-semibold text-[#7E6876] dark:text-[#9F8A98]">
                    {pair.productA.brand} vs {pair.productB.brand}
                  </div>
                  <h4 className="mt-1 text-sm sm:text-base font-semibold text-[#2A1D24] group-hover:text-rose-600 dark:text-[#FDF8F9] dark:group-hover:text-rose-400">
                    {pair.productA.name.slice(0, 24)} vs {pair.productB.name.slice(0, 24)}
                  </h4>
                </div>
                <ArrowRight className="h-4 w-4 text-rose-400 transition group-hover:translate-x-1 group-hover:text-rose-600" />
              </Link>
            ))}
          </div>
        </section>

        {/* Routine Conflicts & Synergies Guides */}
        <section className="mb-24">
          <div className="mb-7">
            <h2 className="font-serif text-2xl font-bold tracking-tight text-[#2A1D24] sm:text-3xl dark:text-[#FDF8F9]">
              Scientific Actives Compatibility Guides
            </h2>
            <p className="mt-1 text-sm sm:text-base text-[#6C5665] dark:text-[#BAA5B2]">
              Dermatological guidelines on safe ingredient layering, pH compatibility, and skin barrier protection.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {conflictRoutes.map((route) => (
              <Link
                key={route.slug}
                href={`/conflicts/${route.slug}`}
                className="group flex flex-col justify-between rounded-2xl border border-rose-100/80 bg-white/90 p-5 shadow-2xs backdrop-blur-xs transition hover:border-rose-300 dark:border-rose-950/60 dark:bg-[#1C121B]/90"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    {route.rule.severity === 'DANGER' && (
                      <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                        Do Not Mix
                      </span>
                    )}
                    {route.rule.severity === 'WARNING' && (
                      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        Separate AM / PM
                      </span>
                    )}
                    {route.rule.severity === 'SYNERGY' && (
                      <span className="rounded-full bg-pink-100 px-2.5 py-0.5 text-xs font-bold text-pink-800 dark:bg-pink-950 dark:text-pink-300">
                        Synergistic Match
                      </span>
                    )}
                  </div>
                  <h4 className="mt-3 text-sm sm:text-base font-semibold text-[#2A1D24] group-hover:text-rose-600 dark:text-[#FDF8F9] dark:group-hover:text-rose-400">
                    Can You Use {route.ingredientA} & {route.ingredientB} Together?
                  </h4>
                  <p className="mt-1.5 line-clamp-2 text-xs sm:text-sm text-[#715B6A] dark:text-[#A792A0]">
                    {route.rule.explanation}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs sm:text-sm font-semibold text-rose-600 dark:text-rose-400">
                  <span>Read Full Guide</span>
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
