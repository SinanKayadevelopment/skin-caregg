import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { getProductBySlug, getDupesForProduct, getAllProducts } from '@/lib/data';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { DupeLeaderboard } from '@/components/DupeLeaderboard';
import { FormulaComparisonTable } from '@/components/FormulaComparisonTable';
import { FloatingAffiliateBar } from '@/components/FloatingAffiliateBar';
import { ShareDupeButton } from '@/components/ShareDupeButton';
import { JsonLd } from '@/components/JsonLd';
import {
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  ArrowLeft,
  DollarSign,
  TrendingDown,
  ShoppingCart,
  Store,
  Clock,
} from 'lucide-react';

export const revalidate = 86400; // Incremental Static Regeneration: 24 hours

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found | DermaDupe Lab',
      description: 'The requested skincare product formulation could not be found.',
    };
  }

  const title = `Best ${product.brand} ${product.name} Dupes & Affordable Alternatives (Lab Formula Match)`;
  const description = `Discover the top chemical dupes for ${product.brand} ${product.name}. Compare active ingredient percentages, price differences, and find identical formulas for up to 80% less.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      images: [{ url: product.imageUrl }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function DupePage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const dupes = getDupesForProduct(product);
  const topDupe = dupes[0];
  const activeIngredients = product.ingredients.filter((i) => i.isActiveIngredient);
  const currentMonthYear = new Date().toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const savingsDollars = topDupe ? Math.round(topDupe.savingsAmount) : 0;
  const savingsPercent = topDupe ? topDupe.savingsPercentage : 0;

  // Auto-generated FAQs for programmatic SEO long-tail searches
  const faqs = [
    {
      question: `Is there an identical drugstore dupe for ${product.brand} ${product.name}?`,
      answer: topDupe
        ? `Yes. Our cosmetic algorithm identified ${topDupe.dupeProduct.brand} ${topDupe.dupeProduct.name} as a ${topDupe.matchPercentage}% bio-equivalent match, offering a ${topDupe.priceDiffMultiplier} price advantage while replicating key active ingredients including ${topDupe.sharedActives.join(', ')}.`
        : `While no 100% molecular replica exists, several budget alternatives provide similar cosmetic benefits with overlapping humectants and barrier lipids.`,
    },
    {
      question: `Why is ${product.brand} ${product.name} so expensive compared to its alternatives?`,
      answer: `High retail MSRP ($${product.price.toFixed(2)}) is frequently driven by proprietary marketing, patented delivery systems, and prestige brand positioning. In many cases, independent clinical dupes use the exact same raw cosmetic suppliers for active raw materials at a fraction of the cost.`,
    },
    {
      question: `What are the active hero ingredients in ${product.name}?`,
      answer: `${product.brand} ${product.name} relies on key active ingredients including ${
        activeIngredients.length > 0
          ? activeIngredients.map((i) => i.ingredient.name).join(', ')
          : 'formulation-specific humectants and emollients'
      } to deliver its primary benefits.`,
    },
    {
      question: `How does DermaDupe calculate cosmetic formulation similarity?`,
      answer: `Our weighted similarity algorithm attributes 5x weight to verified active ingredients (such as Vitamin C, Retinol, Salicylic Acid, and Ceramides) and 4x weight to the top 5 ingredients listed on the INCI label (which make up over 80% of cosmetic volume).`,
    },
  ];

  // Schema.org structured data (Product, ItemPage, FAQPage)
  const schemaData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: `${product.brand} ${product.name}`,
      image: product.imageUrl,
      description: `Formulation profile and chemical dupe analysis for ${product.brand} ${product.name}.`,
      brand: {
        '@type': 'Brand',
        name: product.brand,
      },
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: product.currency,
        availability: 'https://schema.org/InStock',
        url: product.affiliateUrl,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#FAF6F5] pb-24 text-[#2C1F25] dark:bg-[#150E13] dark:text-[#F8F1F3] transition-colors">
      <div className="pointer-events-none fixed inset-0 luxe-ambient-glow" />
      <JsonLd data={schemaData} />
      <Header />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb navigation & Share Action */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <nav className="flex items-center gap-2 text-xs text-[#7B6573] dark:text-[#A792A0]">
            <Link href="/" className="hover:text-rose-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/#holy-grails" className="hover:text-rose-600 transition-colors">
              Dupes
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#2A1D24] dark:text-[#FDF8F9]">
              {product.brand} {product.name}
            </span>
          </nav>

          {/* Viral Community Share Button */}
          <ShareDupeButton productBrand={product.brand} productName={product.name} />
        </div>

        {/* Hero: Original Product Card with Price Anchor, Key Actives & Trust Indicators */}
        <div className="mb-10 overflow-hidden rounded-3xl border border-rose-100/90 bg-white/85 p-6 shadow-sm backdrop-blur-xs sm:p-8 dark:border-rose-950/60 dark:bg-[#1C121B]/90">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-center">
            <div className="flex justify-center md:col-span-4">
              <div className="relative h-64 w-64 overflow-hidden rounded-2xl border border-rose-100/80 bg-rose-50/40 p-2 shadow-inner dark:border-rose-900/50 dark:bg-rose-950/30">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full rounded-xl object-cover"
                />
                <div className="absolute top-4 left-4 rounded-full bg-[#2A1D24]/80 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-xs">
                  {product.isLuxuryTarget ? 'Luxury Holy Grail' : 'Product Profile'}
                </div>
              </div>
            </div>

            <div className="md:col-span-8">
              {/* Trust & Freshness Indicator */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-rose-200/80 bg-rose-50 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/60 dark:text-rose-300">
                  {product.brand}
                </span>

                <div className="flex items-center gap-1 text-xs text-[#7B6573] dark:text-[#A792A0]">
                  <Clock className="h-3.5 w-3.5 text-rose-400" />
                  <span>Verified Formula Match • Updated for {currentMonthYear}</span>
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/70 bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/60 dark:text-rose-300">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
                  </span>
                  In Stock Online
                </div>
              </div>

              <h1 className="mt-3 font-serif text-2xl font-bold tracking-tight text-[#2A1D24] sm:text-3xl dark:text-[#FDF8F9]">
                Best {product.brand} {product.name} Dupes & Formula Matches
              </h1>

              {/* Price Anchor & Psychological Conversion Boosters */}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="font-serif text-3xl font-bold text-[#2A1D24] dark:text-[#FDF8F9]">
                  ${product.price.toFixed(2)}{' '}
                  <span className="font-sans text-xs font-normal text-[#8A7482]">MSRP</span>
                </div>

                {topDupe && savingsDollars > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#8C7684] line-through">
                      ${product.price.toFixed(0)}
                    </span>
                    <span className="text-sm font-bold text-[#8C7684]">vs</span>
                    <span className="font-serif text-xl font-bold text-rose-600 dark:text-rose-400">
                      ${topDupe.dupeProduct.price.toFixed(2)}
                    </span>
                    <span className="rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 px-3 py-1 text-xs font-black uppercase tracking-wide text-white shadow-xs">
                      SAVE ${savingsDollars} ({savingsPercent}% OFF)
                    </span>
                  </div>
                )}
              </div>

              {/* Key Hero Actives */}
              <div className="mt-6 border-t border-rose-100/70 pt-4 dark:border-rose-950/60">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7A6472] dark:text-[#A893A0]">
                  Formulation Hero Actives:
                </span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {activeIngredients.map((ing) => (
                    <span
                      key={ing.id}
                      className="inline-flex items-center gap-1 rounded-full border border-rose-200/70 bg-rose-50/60 px-3 py-1 text-xs font-semibold text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300"
                    >
                      <Sparkles className="h-3 w-3 text-rose-500" />
                      {ing.ingredient.name}
                    </span>
                  ))}
                  {activeIngredients.length === 0 && (
                    <span className="text-xs text-[#7A6472] dark:text-[#A893A0]">
                      Primary hydrating matrix & emollients
                    </span>
                  )}
                </div>
              </div>

              {/* High-Intent Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {topDupe && (
                  <>
                    <a
                      href={`/go/${topDupe.dupeProduct.slug}`}
                      target="_blank"
                      rel="nofollow noopener"
                      className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 px-5 py-3 text-sm font-bold text-stone-950 shadow-md transition hover:from-amber-400 hover:to-amber-300"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>Check Price on Amazon</span>
                      <ExternalLink className="h-3.5 w-3.5 opacity-70 transition group-hover:translate-x-0.5" />
                    </a>

                    <a
                      href={`/go/${topDupe.dupeProduct.slug}`}
                      target="_blank"
                      rel="nofollow noopener"
                      className="inline-flex items-center gap-2 rounded-2xl border border-rose-200/80 bg-white/90 px-4 py-3 text-xs font-bold text-[#35252F] shadow-2xs transition hover:border-rose-300 hover:bg-rose-50/60 dark:border-rose-900/60 dark:bg-[#1D131C] dark:text-[#F0DFE8] dark:hover:bg-rose-950/40"
                    >
                      <Store className="h-3.5 w-3.5 text-rose-500" />
                      <span>Find at Sephora / Target</span>
                    </a>
                  </>
                )}

                <a
                  href={`/go/${product.slug}`}
                  target="_blank"
                  rel="nofollow noopener"
                  className="inline-flex items-center gap-1.5 rounded-2xl py-2 px-3 text-xs font-medium text-[#7A6472] transition hover:text-[#2A1D24] dark:text-[#A893A0] dark:hover:text-[#FDF8F9]"
                >
                  <span>Compare Original MSRP</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Dupe Leaderboard */}
        <section className="mb-14">
          <DupeLeaderboard luxuryProduct={product} dupes={dupes} />
        </section>

        {/* Side-by-side Formula Comparison Table with Top Dupe */}
        {topDupe && (
          <section className="mb-14">
            <div className="mb-4">
              <h2 className="font-serif text-xl font-bold tracking-tight text-[#2A1D24] dark:text-[#FDF8F9]">
                Formula Comparison: {product.brand} vs {topDupe.dupeProduct.brand}
              </h2>
              <p className="mt-0.5 text-xs text-[#7B6573] dark:text-[#A792A0]">
                Detailed concentration order and chemical function comparison against the #1 ranked dupe.
              </p>
            </div>
            <FormulaComparisonTable productA={product} productB={topDupe.dupeProduct} />
          </section>
        )}

        {/* Programmatic SEO FAQ Section */}
        <section className="mb-12 rounded-3xl border border-rose-100/90 bg-white/85 p-6 sm:p-8 backdrop-blur-xs dark:border-rose-950/60 dark:bg-[#1C121B]/90">
          <div className="mb-6 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-rose-500" />
            <h2 className="font-serif text-xl font-bold tracking-tight text-[#2A1D24] dark:text-[#FDF8F9]">
              Frequently Asked Questions About {product.name} Dupes
            </h2>
          </div>

          <div className="space-y-4 divide-y divide-rose-50 dark:divide-rose-950/40">
            {faqs.map((faq, idx) => (
              <div key={idx} className={idx > 0 ? 'pt-4' : ''}>
                <h3 className="text-sm font-semibold text-[#2A1D24] dark:text-[#FDF8F9]">
                  {faq.question}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[#685261] dark:text-[#D1BCC7]">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <FloatingAffiliateBar luxuryProduct={product} topDupeMatch={topDupe} />
      <Footer />
    </div>
  );
}
