'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  CheckCircle2,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  Bot,
  Zap,
  RotateCcw,
  ExternalLink,
} from 'lucide-react';

interface AIDupeResult {
  luxuryProduct: {
    brand: string;
    name: string;
    price: number;
    currency: string;
    category: string;
    heroActives: string[];
    benefits: string;
    texture: string;
    skinTypes: string[];
  };
  dupes: Array<{
    brand: string;
    name: string;
    price: number;
    matchPercentage: number;
    savingsAmount: number;
    savingsPercentage: number;
    heroActives: string[];
    whyItWorks: string;
    howToUse: string;
    affiliateSearchQuery: string;
  }>;
  expertSummary: string;
  source: 'gemini-live' | 'fallback-engine';
}

interface AIDupeFinderStudioProps {
  initialQuery?: string;
  isOpenModal?: boolean;
  onClose?: () => void;
}

export function AIDupeFinderStudio({
  initialQuery = '',
  isOpenModal = false,
  onClose,
}: AIDupeFinderStudioProps) {
  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<AIDupeResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  React.useEffect(() => {
    const handler = (e: any) => {
      if (e.detail) {
        setQuery(e.detail);
        handleSearch(e.detail);
      }
    };
    window.addEventListener('dermadupe-ai-query', handler);
    return () => window.removeEventListener('dermadupe-ai-query', handler);
  }, []);

  const sampleProducts = [
    'Augustinus Bader The Rich Cream',
    'Sisley Black Rose Skin Infusion Cream',
    'Dior Capture Totale Le Sérum',
    'Tatcha The Dewy Skin Cream',
    'Chanel Sublimage La Crème',
  ];

  const handleSearch = async (productToSearch?: string) => {
    const searchTerm = (productToSearch || query).trim();
    if (!searchTerm) return;

    setStatus('loading');
    setLoadingStep(0);
    setErrorMessage('');
    setResult(null);

    // Step animation for beauty consultant feel
    const timer1 = setTimeout(() => setLoadingStep(1), 700);
    const timer2 = setTimeout(() => setLoadingStep(2), 1500);

    try {
      const response = await fetch('/api/ai/find-dupe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchTerm }),
      });

      if (!response.ok) {
        throw new Error('AI analysis service is momentarily busy. Please try again.');
      }

      const data: AIDupeResult = await response.json();
      setResult(data);
      setStatus('success');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Something went wrong while consulting the AI.');
      setStatus('error');
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-5xl rounded-3xl border border-rose-200/80 bg-white/95 p-6 shadow-xl shadow-rose-900/5 backdrop-blur-md sm:p-10 dark:border-rose-900/60 dark:bg-[#1A1218]/95">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-rose-200/90 bg-rose-50/90 px-4 py-1.5 text-xs sm:text-sm font-semibold text-rose-800 shadow-2xs dark:border-rose-900/60 dark:bg-rose-950/60 dark:text-rose-300">
          <Bot className="h-4 w-4 text-rose-500 animate-bounce" />
          <span>Powered by Gemini AI • Real-Time Formulation Deconstructor</span>
        </div>

        <h2 className="mt-4 font-serif text-2xl font-normal tracking-tight text-[#2A1D24] sm:text-4xl dark:text-[#FDF8F9]">
          Have a Dream Cream at Home?{' '}
          <span className="block italic rose-gold-text sm:inline">
            Let AI Find Its Exact Twin.
          </span>
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-[#5F4B57] dark:text-[#D1BCC7]">
          Type in any luxury moisturizer, eye cream, or serum in the world. Our AI cosmetic engine analyzes its INCI ingredients, molecular actives, and texture to find the top verified drugstore alternatives.
        </p>
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="mt-8 flex flex-col sm:flex-row items-center gap-3"
      >
        <div className="relative w-full flex-1">
          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-rose-400">
            <Search className="h-5 w-5" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Augustinus Bader The Rich Cream, Sisley Black Rose, Dior..."
            className="w-full rounded-2xl border border-rose-200 bg-[#FAF6F5] py-4 pl-12 pr-4 text-sm sm:text-base text-[#2A1D24] shadow-inner outline-none transition placeholder:text-[#917A88] focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-200/30 dark:border-rose-900/60 dark:bg-[#140D13] dark:text-white dark:focus:bg-[#1D131B]"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading' || !query.trim()}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 px-7 py-4 text-sm sm:text-base font-semibold text-white shadow-lg shadow-rose-500/25 transition hover:brightness-105 active:scale-98 disabled:opacity-50"
        >
          {status === 'loading' ? (
            <>
              <Sparkles className="h-5 w-5 animate-spin" />
              <span>Analyzing Formula...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              <span>Ask AI For Dupes</span>
            </>
          )}
        </button>
      </form>

      {/* Popular Sample Pills */}
      <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-[#6B5563] dark:text-[#B69FAEC]">
        <span className="font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
          <Zap className="h-3.5 w-3.5" /> Try Instant Samples:
        </span>
        {sampleProducts.map((sample) => (
          <button
            key={sample}
            type="button"
            onClick={() => {
              setQuery(sample);
              handleSearch(sample);
            }}
            className="rounded-full border border-rose-200/70 bg-rose-50/60 px-3 py-1 font-medium text-[#4E3A47] transition hover:border-rose-300 hover:bg-rose-100 hover:text-rose-900 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-[#E2CED9] dark:hover:bg-rose-900/50"
          >
            {sample}
          </button>
        ))}
      </div>

      {/* Loading State with Progressive Steps */}
      {status === 'loading' && (
        <div className="mt-10 rounded-2xl border border-rose-200/80 bg-rose-50/50 p-8 text-center dark:border-rose-900/40 dark:bg-rose-950/20">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md text-rose-600 dark:bg-rose-900 dark:text-rose-200">
            <Sparkles className="h-7 w-7 animate-spin" />
          </div>
          <h3 className="mt-4 font-serif text-xl font-medium text-[#2A1D24] dark:text-[#FDF8F9]">
            Consulting Our Cosmetic Chemistry AI...
          </h3>

          <div className="mx-auto mt-6 max-w-md space-y-3 text-left text-sm text-[#5F4B57] dark:text-[#D1BCC7]">
            <div className={`flex items-center gap-3 transition-opacity ${loadingStep >= 0 ? 'opacity-100 font-semibold text-rose-700 dark:text-rose-300' : 'opacity-40'}`}>
              <CheckCircle2 className="h-5 w-5 text-rose-500" />
              <span>Deconstructing INCI actives and peptide matrix...</span>
            </div>
            <div className={`flex items-center gap-3 transition-opacity ${loadingStep >= 1 ? 'opacity-100 font-semibold text-rose-700 dark:text-rose-300' : 'opacity-40'}`}>
              <CheckCircle2 className="h-5 w-5 text-rose-500" />
              <span>Scanning 10,000+ drugstore & accessible formulas...</span>
            </div>
            <div className={`flex items-center gap-3 transition-opacity ${loadingStep >= 2 ? 'opacity-100 font-semibold text-rose-700 dark:text-rose-300' : 'opacity-40'}`}>
              <CheckCircle2 className="h-5 w-5 text-rose-500" />
              <span>Synthesizing beauty consultant verdicts & price savings...</span>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {status === 'error' && (
        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50/80 p-6 text-center text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
          <p className="font-semibold">{errorMessage}</p>
          <button
            onClick={() => handleSearch()}
            className="mt-3 inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700"
          >
            <RotateCcw className="h-4 w-4" /> Try Again
          </button>
        </div>
      )}

      {/* Success State: Dynamic AI Results */}
      {status === 'success' && result && (
        <div className="mt-10 space-y-8 animate-fadeIn">
          {/* Source Indicator Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-200/90 bg-rose-50/70 p-4 dark:border-rose-900/50 dark:bg-rose-950/40">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-rose-800 dark:text-rose-200">
              <Bot className="h-4 w-4 text-rose-500" />
              <span>
                {result.source === 'gemini-live'
                  ? '✨ Live Analysis Generated by Google Gemini Flash AI'
                  : '💎 Analyzed by DermaDupe Cosmetic Knowledge Base'}
              </span>
            </div>
            <span className="text-xs text-[#7D6674] dark:text-[#AA95A2]">
              Verified Cosmetic Active Equivalence
            </span>
          </div>

          {/* Luxury Reference Card */}
          <div className="rounded-2xl border border-rose-200/80 bg-[#FAF6F5] p-6 dark:border-rose-900/60 dark:bg-[#140D13]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  Original Luxury Target
                </span>
                <h3 className="mt-2 font-serif text-2xl font-bold text-[#2A1D24] dark:text-[#FDF8F9]">
                  {result.luxuryProduct.brand} — {result.luxuryProduct.name}
                </h3>
                <p className="mt-1 text-sm text-[#5F4B57] dark:text-[#D1BCC7]">
                  {result.luxuryProduct.category} • Texture: <span className="italic">{result.luxuryProduct.texture}</span>
                </p>
              </div>

              <div className="text-right">
                <div className="font-serif text-3xl font-bold text-[#2A1D24] dark:text-[#FDF8F9]">
                  {result.luxuryProduct.currency}{result.luxuryProduct.price}
                </div>
                <div className="text-xs text-[#7D6674] dark:text-[#AA95A2]">Retail Luxury Price</div>
              </div>
            </div>

            {/* Key Luxury Actives */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#5F4B57] dark:text-[#D1BCC7]">Hero Actives:</span>
              {result.luxuryProduct.heroActives.map((active, i) => (
                <span
                  key={i}
                  className="rounded-lg border border-rose-200 bg-white px-2.5 py-1 text-xs font-medium text-rose-800 shadow-2xs dark:border-rose-900/60 dark:bg-[#1E141C] dark:text-rose-300"
                >
                  {active}
                </span>
              ))}
            </div>
          </div>

          {/* Discovered Affordable Twins */}
          <div className="space-y-6">
            <h3 className="font-serif text-2xl font-normal text-[#2A1D24] dark:text-[#FDF8F9]">
              Top Verified Affordable Twins ({result.dupes.length} Discovered)
            </h3>

            <div className="grid gap-6 md:grid-cols-2">
              {result.dupes.map((dupe, index) => (
                <div
                  key={index}
                  className="relative flex flex-col justify-between rounded-3xl border border-rose-200/90 bg-white p-6 shadow-md shadow-rose-900/5 transition hover:shadow-xl hover:border-rose-300 dark:border-rose-900/60 dark:bg-[#1D131B]"
                >
                  {/* Badge Row */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                      <ShieldCheck className="h-4 w-4" />
                      {dupe.matchPercentage}% Formula Match
                    </span>

                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-800 dark:bg-rose-950/80 dark:text-rose-300">
                      <TrendingDown className="h-4 w-4" />
                      Save ${dupe.savingsAmount.toFixed(0)} ({dupe.savingsPercentage}%)
                    </span>
                  </div>

                  {/* Brand & Name */}
                  <div className="mt-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                      {dupe.brand}
                    </div>
                    <h4 className="mt-1 font-serif text-xl font-bold text-[#2A1D24] dark:text-[#FDF8F9]">
                      {dupe.name}
                    </h4>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="font-serif text-2xl font-bold text-[#2A1D24] dark:text-[#FDF8F9]">
                        ${dupe.price.toFixed(2)}
                      </span>
                      <span className="text-xs text-[#7D6674] line-through dark:text-[#AA95A2]">
                        vs ${result.luxuryProduct.price}
                      </span>
                    </div>
                  </div>

                  {/* Why It Works / Beauty Consultant Verdict */}
                  <div className="mt-4 rounded-2xl bg-rose-50/70 p-4 dark:bg-rose-950/30">
                    <div className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">
                      Beauty Consultant Verdict
                    </div>
                    <p className="mt-1.5 text-sm sm:text-base leading-relaxed text-[#4E3A47] dark:text-[#E2CED9]">
                      {dupe.whyItWorks}
                    </p>

                    <div className="mt-3 text-xs text-[#6B5563] dark:text-[#B69FAEC]">
                      <span className="font-semibold text-rose-700 dark:text-rose-400">Routine Tip: </span>
                      {dupe.howToUse}
                    </div>
                  </div>

                  {/* Shared Actives */}
                  <div className="mt-4">
                    <div className="text-xs font-bold text-[#5F4B57] dark:text-[#D1BCC7]">
                      Shared Hero Actives:
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {dupe.heroActives.map((active, i) => (
                        <span
                          key={i}
                          className="rounded-lg bg-rose-100/60 px-2 py-0.5 text-xs font-medium text-rose-800 dark:bg-rose-900/40 dark:text-rose-200"
                        >
                          {active}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA Outbound */}
                  <div className="mt-6 pt-4 border-t border-rose-100 dark:border-rose-900/40">
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent(dupe.brand + ' ' + dupe.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:brightness-105 active:scale-98"
                    >
                      <span>Check Availability & Price</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Expert Summary */}
          {result.expertSummary && (
            <div className="rounded-2xl border border-rose-200/80 bg-white p-6 shadow-sm dark:border-rose-900/50 dark:bg-[#1D131B]">
              <div className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                Editorial Takeaway
              </div>
              <p className="mt-2 text-sm sm:text-base leading-relaxed text-[#4E3A47] dark:text-[#E2CED9]">
                {result.expertSummary}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
