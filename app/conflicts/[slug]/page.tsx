import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { getAllConflictRoutes, getAllProducts } from '@/lib/data';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';
import {
  AlertTriangle,
  AlertOctagon,
  Sparkles,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sun,
  Moon,
} from 'lucide-react';

export const revalidate = 86400; // ISR: 24h

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const routes = getAllConflictRoutes();
  return routes.map((r) => ({
    slug: r.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const routes = getAllConflictRoutes();
  const match = routes.find((r) => r.slug === slug);

  if (!match) {
    return { title: 'Routine Guide Not Found | DermaDupe' };
  }

  const { ingredientA, ingredientB } = match;
  const title = `Can You Use ${ingredientA} and ${ingredientB} Together? Routine Guide`;
  const description = `Dermatological safety guide for layering ${ingredientA} and ${ingredientB}. Learn about pH stability, irritation risk, barrier compatibility, and AM vs PM application order.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
    },
  };
}

export default async function ConflictGuidePage({ params }: PageProps) {
  const { slug } = await params;
  const routes = getAllConflictRoutes();
  const match = routes.find((r) => r.slug === slug);

  if (!match) {
    notFound();
  }

  const { ingredientA, ingredientB, rule } = match;
  const isDanger = rule.severity === 'DANGER';
  const isWarning = rule.severity === 'WARNING';
  const isSynergy = rule.severity === 'SYNERGY';

  // Products containing ingredient A or B
  const allProducts = getAllProducts();
  const relatedProductsA = allProducts
    .filter((p) =>
      p.ingredients.some(
        (pi) =>
          pi.ingredient.name.toLowerCase().includes(ingredientA.toLowerCase()) ||
          pi.ingredient.inciName.toLowerCase().includes(ingredientA.toLowerCase())
      )
    )
    .slice(0, 3);

  const relatedProductsB = allProducts
    .filter((p) =>
      p.ingredients.some(
        (pi) =>
          pi.ingredient.name.toLowerCase().includes(ingredientB.toLowerCase()) ||
          pi.ingredient.inciName.toLowerCase().includes(ingredientB.toLowerCase())
      )
    )
    .slice(0, 3);

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: `Can You Use ${ingredientA} and ${ingredientB} Together?`,
    description: rule.explanation,
    aspect: ['Cosmetic safety', 'Skincare routine compatibility', 'Dermatological guide'],
  };

  return (
    <div className="relative min-h-screen bg-[#FAF6F5] pb-24 text-[#2C1F25] dark:bg-[#150E13] dark:text-[#F8F1F3] transition-colors">
      <div className="pointer-events-none fixed inset-0 luxe-ambient-glow" />
      <JsonLd data={schemaData} />
      <Header />

      <main className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-[#7B6573] dark:text-[#A792A0]">
          <Link href="/" className="hover:text-rose-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/#conflicts" className="hover:text-rose-600 transition-colors">
            Routine Conflicts
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#2A1D24] dark:text-[#FDF8F9]">
            {ingredientA} + {ingredientB}
          </span>
        </nav>

        {/* Severity Banner */}
        <div
          className={`mb-8 overflow-hidden rounded-3xl border p-6 sm:p-8 ${
            isDanger
              ? 'border-rose-300 bg-rose-50/80 dark:border-rose-900/50 dark:bg-rose-950/20'
              : isWarning
              ? 'border-amber-200 bg-amber-50/80 dark:border-amber-900/50 dark:bg-amber-950/20'
              : 'border-pink-200 bg-pink-50/80 dark:border-pink-900/50 dark:bg-pink-950/20'
          }`}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                  isDanger
                    ? 'bg-rose-600 text-white'
                    : isWarning
                    ? 'bg-amber-500 text-white'
                    : 'bg-gradient-to-tr from-rose-500 to-pink-500 text-white'
                }`}
              >
                {isDanger && <AlertOctagon className="h-6 w-6" />}
                {isWarning && <AlertTriangle className="h-6 w-6" />}
                {isSynergy && <Sparkles className="h-6 w-6" />}
              </div>

              <div>
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${
                    isDanger
                      ? 'text-rose-700 dark:text-rose-300'
                      : isWarning
                      ? 'text-amber-800 dark:text-amber-300'
                      : 'text-pink-800 dark:text-pink-300'
                  }`}
                >
                  {isDanger
                    ? '🚨 DANGER: DO NOT MIX IN SAME ROUTINE'
                    : isWarning
                    ? '⚠️ CAUTION: SEPARATE AM / PM WINDOWS'
                    : '✨ SYNERGISTIC RADIANCE (ENHANCED RESULTS)'}
                </span>
                <h1 className="mt-1 font-serif text-2xl font-bold tracking-tight text-[#2A1D24] sm:text-3xl dark:text-[#FDF8F9]">
                  Can You Mix {ingredientA} and {ingredientB}?
                </h1>
              </div>
            </div>

            <div className="shrink-0">
              <span
                className={`inline-block rounded-full px-4 py-1.5 text-xs font-extrabold ${
                  isDanger
                    ? 'bg-rose-200 text-rose-900 dark:bg-rose-900 dark:text-rose-100'
                    : isWarning
                    ? 'bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-100'
                    : 'bg-pink-200 text-pink-900 dark:bg-pink-900 dark:text-pink-100'
                }`}
              >
                {rule.title}
              </span>
            </div>
          </div>

          <div className="mt-6 border-t border-rose-200/60 pt-4 dark:border-rose-900/40">
            <h2 className="text-sm font-bold text-[#2A1D24] dark:text-[#FDF8F9]">
              Actionable Clinical Guidance:
            </h2>
            <p className="mt-1 text-sm font-semibold text-[#483542] dark:text-[#E8D6E1]">
              {rule.actionableGuidance}
            </p>
          </div>
        </div>

        {/* Deep Scientific Explanation */}
        <section className="mb-10 rounded-3xl border border-rose-100/90 bg-white/85 p-6 sm:p-8 shadow-sm backdrop-blur-xs dark:border-rose-950/60 dark:bg-[#1C121B]/90">
          <h2 className="font-serif text-xl font-bold tracking-tight text-[#2A1D24] dark:text-[#FDF8F9]">
            The Cosmetic Chemistry Breakdown
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#685261] dark:text-[#D1BCC7]">
            {rule.explanation}
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-rose-100/80 bg-rose-50/50 p-5 dark:border-rose-950/60 dark:bg-rose-950/20">
              <div className="flex items-center gap-2 font-bold text-[#2A1D24] dark:text-[#FDF8F9]">
                <Sun className="h-4 w-4 text-amber-500" />
                Morning (AM) Routine Protocol
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[#685261] dark:text-[#D1BCC7]">
                {isDanger || isWarning
                  ? `Apply ${ingredientA === 'Retinol' ? ingredientB : ingredientA} in the morning, followed by a broad-spectrum SPF 30+ to protect sensitized barrier lipids.`
                  : `Both ${ingredientA} and ${ingredientB} can be safely applied together in your morning sequence under sunscreen.`}
              </p>
            </div>

            <div className="rounded-2xl border border-rose-100/80 bg-rose-50/50 p-5 dark:border-rose-950/60 dark:bg-rose-950/20">
              <div className="flex items-center gap-2 font-bold text-[#2A1D24] dark:text-[#FDF8F9]">
                <Moon className="h-4 w-4 text-rose-500" />
                Evening (PM) Routine Protocol
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[#685261] dark:text-[#D1BCC7]">
                {isDanger || isWarning
                  ? `Reserve ${ingredientA === 'Retinol' ? ingredientA : ingredientB} strictly for PM application to minimize phototoxicity and allow skin cells to repair undisturbed.`
                  : `In the evening, layering these actives enhances cellular turnover and fortifies moisture retention while you sleep.`}
              </p>
            </div>
          </div>
        </section>

        {/* Featured Products Featuring These Actives */}
        <section className="mb-12">
          <h2 className="font-serif text-xl font-bold tracking-tight text-[#2A1D24] dark:text-[#FDF8F9]">
            Popular Formulations Containing {ingredientA} & {ingredientB}
          </h2>
          <p className="mt-0.5 text-xs text-[#7B6573] dark:text-[#A792A0]">
            Browse verified lab dupes and find affordable options for each active.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {relatedProductsA.concat(relatedProductsB).slice(0, 4).map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-2xl border border-rose-100/80 bg-white/85 p-4 shadow-2xs backdrop-blur-xs dark:border-rose-950/60 dark:bg-[#1C121B]/90"
              >
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                    {p.brand}
                  </span>
                  <h4 className="text-sm font-semibold text-[#2A1D24] dark:text-[#FDF8F9]">{p.name}</h4>
                  <div className="font-serif text-xs font-bold text-[#2A1D24] dark:text-[#FDF8F9]">
                    ${p.price.toFixed(2)}
                  </div>
                </div>

                <Link
                  href={`/dupes/${p.slug}`}
                  className="rounded-full border border-rose-200/80 bg-rose-50/70 px-3.5 py-1.5 text-xs font-semibold text-rose-800 transition hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/50 dark:text-rose-300"
                >
                  View Dupes →
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
