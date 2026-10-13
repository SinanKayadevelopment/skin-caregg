'use client';

import React, { useState } from 'react';
import { checkRoutineConflicts } from '@/lib/algorithm/conflict-checker';
import { AlertOctagon, AlertTriangle, Sparkles, CheckCircle, Plus, X } from 'lucide-react';

const COMMON_ACTIVES = [
  'Retinol',
  'Salicylic Acid',
  'Ascorbic Acid (Vitamin C)',
  'Glycolic Acid',
  'Niacinamide',
  'Benzoyl Peroxide',
  'Ceramides',
  'Hyaluronic Acid',
  'Ferulic Acid',
  'Copper Peptides',
];

export function RoutineConflictCheckerWidget() {
  const [selectedActives, setSelectedActives] = useState<string[]>([
    'Retinol',
    'Salicylic Acid',
  ]);

  const report = checkRoutineConflicts(selectedActives);

  const toggleActive = (active: string) => {
    if (selectedActives.includes(active)) {
      setSelectedActives(selectedActives.filter((a) => a !== active));
    } else {
      setSelectedActives([...selectedActives, active]);
    }
  };

  return (
    <div className="rounded-3xl border border-rose-100/90 bg-white/90 p-6 shadow-sm sm:p-8 backdrop-blur-xs dark:border-rose-950/60 dark:bg-[#1C121B]">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-rose-200/80 bg-rose-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/60 dark:text-rose-300">
              Interactive Routine Guide
            </span>
            <span className="text-xs sm:text-sm text-[#7B6573] dark:text-[#A792A0]">Barrier Health & Layering Safety</span>
          </div>
          <h3 className="mt-2 font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#2A1D24] dark:text-[#FDF8F9]">
            Skincare Routine Safety & Synergy Checker
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-[#6C5665] dark:text-[#BAA5B2]">
            Select the active ingredients in your daily regimen to evaluate chemical clashes and radiant synergies.
          </p>
        </div>

        {/* Safety Score Meter */}
        <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-rose-100/80 bg-rose-50/60 p-4 sm:px-5 dark:border-rose-950/60 dark:bg-rose-950/30">
          <div className="text-right">
            <div className="text-xs font-bold uppercase tracking-wider text-[#735D6B] dark:text-[#A792A0]">Regimen Harmony</div>
            <div
              className={`font-serif text-2xl sm:text-3xl font-bold ${
                report.overallSafetyScore >= 80
                  ? 'text-rose-600 dark:text-rose-400'
                  : report.overallSafetyScore >= 50
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {report.overallSafetyScore}/100
            </div>
          </div>
        </div>
      </div>

      {/* Quick Select Buttons */}
      <div className="mt-6">
        <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#735D6B] dark:text-[#A792A0]">
          Toggle Actives in Your Regimen:
        </span>
        <div className="mt-3 flex flex-wrap gap-2">
          {COMMON_ACTIVES.map((active) => {
            const isSelected = selectedActives.includes(active);
            return (
              <button
                key={active}
                type="button"
                onClick={() => toggleActive(active)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition ${
                  isSelected
                    ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white shadow-xs'
                    : 'border border-rose-200/70 bg-white/80 text-[#4E3946] hover:border-rose-300 hover:bg-rose-50 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-[#E2CFDA] dark:hover:bg-rose-900/40'
                }`}
              >
                {isSelected ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5 text-rose-400" />}
                {active}
              </button>
            );
          })}
        </div>
      </div>

      {/* Conflict / Synergy Report Results */}
      <div className="mt-7 space-y-3.5">
        {report.items.length === 0 ? (
          <div className="flex items-center gap-3 rounded-2xl border border-rose-100/80 bg-rose-50/60 p-4 text-xs sm:text-sm font-medium text-rose-900 dark:border-rose-950/60 dark:bg-rose-950/30 dark:text-rose-200">
            <CheckCircle className="h-5 w-5 shrink-0 text-rose-500" />
            <span>Optimal Formulation Balance. No chemical clashes detected between these selected actives.</span>
          </div>
        ) : (
          report.items.map((item, idx) => {
            const isDanger = item.severity === 'DANGER';
            const isWarning = item.severity === 'WARNING';
            const isSynergy = item.severity === 'SYNERGY';

            return (
              <div
                key={idx}
                className={`rounded-2xl border p-4 sm:p-5 text-xs sm:text-sm ${
                  isDanger
                    ? 'border-rose-200 bg-rose-50/70 text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200'
                    : isWarning
                    ? 'border-amber-200 bg-amber-50/70 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/25 dark:text-amber-200'
                    : 'border-pink-200 bg-pink-50/70 text-pink-900 dark:border-pink-900/50 dark:bg-pink-950/25 dark:text-pink-200'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
                  {isDanger && <AlertOctagon className="h-4 w-4 text-rose-600 shrink-0" />}
                  {isWarning && <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />}
                  {isSynergy && <Sparkles className="h-4 w-4 text-pink-600 shrink-0" />}
                  <span>{item.title}</span>
                </div>
                <p className="mt-1.5 leading-relaxed opacity-90">{item.explanation}</p>
                <div className="mt-2.5 font-semibold">
                  <span className="font-bold">Guidance: </span>
                  {item.actionableGuidance}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
