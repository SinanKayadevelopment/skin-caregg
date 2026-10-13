import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { getProductBySlug, getPopularComparePairs, getAllProducts } from '@/lib/data';
import { calculateDupeMatch } from '@/lib/algorithm/dupe-matcher';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FormulaComparisonTable } from '@/components/FormulaComparisonTable';
import { JsonLd } from '@/components/JsonLd';
import { Scale, ArrowRight, ExternalLink, CheckCircle2, TrendingDown, Sparkles } from 'lucide-react';

export const revalidate = 86400; // ISR: 24h

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const pairs = getPopularComparePairs();
  return pairs.map((pair) => ({
    slug: pair.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const parts = slug.split('-vs-');
  if (parts.length !== 2) {
    return { title: 'Product Comparison | DermaDupe' };
  }

  const productA = getProductBySlug(parts[0]);
  const productB = getProductBySlug(parts[1]);

  if (!productA || !productB) {
    return { title: 'Product Comparison Not Found | DermaDupe' };
  }

  const title = `${productA.brand} ${productA.name} vs ${productB.brand} ${productB.name}: Formula Comparison & Verdict`;
  const description = `Direct cosmetic chemistry comparison between ${productA.brand} ${productA.name} and ${productB.brand} ${productB.name}. Compare active ingredients, concentration ranking, and price difference.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      images: [{ url: productA.imageUrl }, { url: productB.imageUrl }],
    },
  };
}

export default async function ComparePage({ params }: PageProps) {
  const { slug } = await params;
  const parts = slug.split('-vs-');
  if (parts.length !== 2) {
    notFound();
  }

  const productA = getProductBySlug(parts[0]);
  const productB = getProductBySlug(parts[1]);

  if (!productA || !productB) {
    notFound();
  }

  const match = calculateDupeMatch(productA, productB);

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'ItemPage',
    name: `${productA.name} vs ${productB.name} Formulation Analysis`,
    description: `Detailed chemical ingredient comparison between ${productA.brand} and ${productB.brand}.`,
  };

  return (
    <div className="relative min-h-screen bg-[#FAF6F5] pb-24 text-[#2C1F25] dark:bg-[#150E13] dark:text-[#F8F1F3] transition-colors">
      <div className="pointer-events-none fixed inset-0 luxe-ambient-glow" />
      <JsonLd data={schemaData} />
      <Header />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-[#7B6573] dark:text-[#A792A0]">
          <Link href="/" className="hover:text-rose-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/#compare-section" className="hover:text-rose-600 transition-colors">
            Compare
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#2A1D24] dark:text-[#FDF8F9]">
            {productA.brand} vs {productB.brand}
          </span>
        </nav>

        {/* Hero Title */}
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/80 bg-rose-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/60 dark:text-rose-300">
            <Scale className="h-3.5 w-3.5 text-rose-500" />
            Head-to-Head Formulation Breakdown
          </div>
          <h1 className="mt-3 font-serif text-2xl font-bold tracking-tight text-[#2A1D24] sm:text-4xl dark:text-[#FDF8F9]">
            {productA.brand} {productA.name} <span className="italic font-normal text-rose-600 dark:text-rose-400">vs</span>{' '}
            {productB.brand} {productB.name}
          </h1>
          <p className="mt-2 text-sm text-[#6C5665] dark:text-[#BAA5B2]">
            Laboratory formula comparison, active ingredient bio-equivalence, and value verdict.
          </p>
        </div>

        {/* Side by side product cards */}
        <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Product A */}
          <div className="rounded-3xl border border-rose-100/90 bg-white/85 p-6 shadow-sm backdrop-blur-xs dark:border-rose-950/60 dark:bg-[#1C121B]/90">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-rose-100/80 bg-rose-50/40 dark:border-rose-900/50 dark:bg-rose-950/30">
                <img
                  src={productA.imageUrl}
                  alt={productA.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A7482]">
                  {productA.brand}
                </span>
                <h3 className="text-base font-semibold text-[#2A1D24] dark:text-[#FDF8F9]">
                  {productA.name}
                </h3>
                <div className="mt-1 font-serif text-xl font-bold text-[#2A1D24] dark:text-[#FDF8F9]">
                  ${productA.price.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <a
                href={`/go/${productA.slug}`}
                target="_blank"
                rel="nofollow noopener"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-rose-200/80 bg-white/90 px-4 py-2.5 text-xs font-bold text-[#35252F] shadow-2xs transition hover:bg-rose-50/60 dark:border-rose-900/60 dark:bg-[#1D131C] dark:text-[#F0DFE8]"
              >
                Check Price
                <ExternalLink className="h-3.5 w-3.5 text-rose-400" />
              </a>
              <Link
                href={`/dupes/${productA.slug}`}
                className="inline-flex items-center justify-center rounded-2xl border border-rose-200/80 px-3.5 py-2.5 text-xs font-semibold text-[#543F4D] transition hover:bg-rose-50 dark:border-rose-900/60 dark:text-[#D8C4CF]"
              >
                All Dupes
              </Link>
            </div>
          </div>

          {/* Product B */}
          <div className="rounded-3xl border border-rose-100/90 bg-white/85 p-6 shadow-sm backdrop-blur-xs dark:border-rose-950/60 dark:bg-[#1C121B]/90">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-rose-100/80 bg-rose-50/40 dark:border-rose-900/50 dark:bg-rose-950/30">
                <img
                  src={productB.imageUrl}
                  alt={productB.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  {productB.brand}
                </span>
                <h3 className="text-base font-semibold text-[#2A1D24] dark:text-[#FDF8F9]">
                  {productB.name}
                </h3>
                <div className="mt-1 font-serif text-xl font-bold text-[#2A1D24] dark:text-[#FDF8F9]">
                  ${productB.price.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <a
                href={`/go/${productB.slug}`}
                target="_blank"
                rel="nofollow noopener"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:opacity-95"
              >
                Check Price
                <ExternalLink className="h-3.5 w-3.5 opacity-80" />
              </a>
              <Link
                href={`/dupes/${productB.slug}`}
                className="inline-flex items-center justify-center rounded-2xl border border-rose-200/80 px-3.5 py-2.5 text-xs font-semibold text-[#543F4D] transition hover:bg-rose-50 dark:border-rose-900/60 dark:text-[#D8C4CF]"
              >
                All Dupes
              </Link>
            </div>
          </div>
        </div>

        {/* Verdict & Match Metrics Banner */}
        <div className="mb-10 rounded-3xl border border-rose-200/70 bg-gradient-to-br from-rose-50/70 to-pink-50/50 p-6 sm:p-8 backdrop-blur-xs dark:border-rose-950/60 dark:bg-rose-950/20">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#7A6472] dark:text-[#A893A0]">
                Formulation Similarity
              </span>
              <div className="mt-1 font-serif text-3xl font-bold text-rose-600 dark:text-rose-400">
                {match.matchPercentage}%
              </div>
              <p className="mt-1 text-xs text-[#6C5665] dark:text-[#BAA5B2]">
                Weighted algorithmic score based on active complex and top 5 concentration volume.
              </p>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#7A6472] dark:text-[#A893A0]">
                Price Difference
              </span>
              <div className="mt-1 font-serif text-3xl font-bold text-[#2A1D24] dark:text-[#FDF8F9]">
                {match.priceDiffMultiplier}
              </div>
              <p className="mt-1 text-xs text-[#6C5665] dark:text-[#BAA5B2]">
                {match.savingsPercentage > 0
                  ? `Save ${match.savingsPercentage}% ($${match.savingsAmount.toFixed(2)}) choosing ${productB.brand}.`
                  : 'Comparable cost profile.'}
              </p>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#7A6472] dark:text-[#A893A0]">
                Shared Hero Actives
              </span>
              <div className="mt-1 font-serif text-3xl font-bold text-[#2A1D24] dark:text-[#FDF8F9]">
                {match.sharedActives.length} Actives
              </div>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {match.sharedActives.map((a) => (
                  <span
                    key={a}
                    className="inline-flex items-center gap-1 rounded-full border border-rose-100 bg-white/90 px-2.5 py-0.5 text-[11px] font-medium text-rose-800 shadow-2xs dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300"
                  >
                    <CheckCircle2 className="h-3 w-3 text-rose-500" />
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-rose-200/60 pt-4 dark:border-rose-900/40">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2A1D24] dark:text-[#FDF8F9]">
              Clinical Chemist Verdict:
            </span>
            <p className="mt-1 text-sm font-medium leading-relaxed text-[#4A3644] dark:text-[#D1BCC7]">
              {match.verdict}
            </p>
          </div>
        </div>

        {/* Detailed Side-by-side Table */}
        <section className="mb-14">
          <div className="mb-4">
            <h2 className="font-serif text-xl font-bold tracking-tight text-[#2A1D24] dark:text-[#FDF8F9]">
              Full INCI Breakdown Matrix
            </h2>
            <p className="mt-0.5 text-xs text-[#7B6573] dark:text-[#A792A0]">
              Ingredient order comparison showing active functions and chemical category mapping.
            </p>
          </div>
          <FormulaComparisonTable productA={productA} productB={productB} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
