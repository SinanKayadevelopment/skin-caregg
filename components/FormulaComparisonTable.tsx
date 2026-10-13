import React from 'react';
import { Product } from '@/lib/types';
import { normalizeInciName } from '@/lib/algorithm/dupe-matcher';
import { Check, X, Sparkles } from 'lucide-react';

interface FormulaComparisonTableProps {
  productA: Product;
  productB: Product;
}

export function FormulaComparisonTable({ productA, productB }: FormulaComparisonTableProps) {
  const mapA = new Set(productA.ingredients.map((i) => normalizeInciName(i.ingredient.name)));
  const mapB = new Set(productB.ingredients.map((i) => normalizeInciName(i.ingredient.name)));

  return (
    <div className="overflow-hidden rounded-3xl border border-rose-100/90 bg-white/90 shadow-sm backdrop-blur-xs dark:border-rose-950/60 dark:bg-[#1C121B]">
      <div className="border-b border-rose-100/80 bg-rose-50/50 p-5 sm:p-6 dark:border-rose-950/60 dark:bg-rose-950/20">
        <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2A1D24] dark:text-[#FDF8F9]">
          Side-by-Side INCI Formulation Matrix
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-[#7B6573] dark:text-[#A792A0]">
          Cosmetic ingredient concentration order comparison (highest concentration ranked 1).
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-rose-100/70 bg-rose-50/30 text-xs font-semibold uppercase tracking-wider text-[#735D6B] dark:border-rose-950/40 dark:bg-rose-950/15">
            <tr>
              <th className="py-4 px-4 sm:px-6">Rank</th>
              <th className="py-4 px-4 sm:px-6">
                {productA.brand} ({productA.name.slice(0, 22)})
              </th>
              <th className="py-4 px-4 sm:px-6">Function</th>
              <th className="py-4 px-4 sm:px-6">
                {productB.brand} ({productB.name.slice(0, 22)})
              </th>
              <th className="py-4 px-4 sm:px-6">Formula Match Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rose-50/80 text-xs sm:text-sm dark:divide-rose-950/40">
            {productA.ingredients.map((pi, idx) => {
              const ing = pi.ingredient;
              const key = normalizeInciName(ing.name);
              const existsInB = mapB.has(key);
              const dupeIngredientAtRank = productB.ingredients[idx];

              return (
                <tr
                  key={pi.id || idx}
                  className={`transition hover:bg-rose-50/50 dark:hover:bg-rose-950/20 ${
                    pi.isActiveIngredient ? 'bg-rose-50/60 dark:bg-rose-950/25' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 sm:px-6 font-mono font-medium text-[#8D7684]">
                    #{pi.rankOrder}
                  </td>

                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="font-semibold text-[#2A1D24] dark:text-[#FDF8F9]">
                      {ing.name}
                    </div>
                    <div className="font-mono text-xs text-[#8D7684]">{ing.inciName}</div>
                  </td>

                  <td className="py-3.5 px-4 sm:px-6">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                        pi.isActiveIngredient
                          ? 'border border-rose-200/80 bg-rose-100 text-rose-800 dark:border-rose-900/60 dark:bg-rose-950 dark:text-rose-300'
                          : 'border border-rose-100/70 bg-rose-50/50 text-[#6B5563] dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-[#C5B0BD]'
                      }`}
                    >
                      {pi.isActiveIngredient && <Sparkles className="h-3 w-3 text-rose-500" />}
                      {ing.category}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 sm:px-6">
                    {dupeIngredientAtRank ? (
                      <div>
                        <div className="font-medium text-[#2A1D24] dark:text-[#FDF8F9]">
                          {dupeIngredientAtRank.ingredient.name}
                        </div>
                        <div className="font-mono text-xs text-[#8D7684]">
                          {dupeIngredientAtRank.ingredient.inciName}
                        </div>
                      </div>
                    ) : (
                      <span className="text-rose-300">-</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 sm:px-6">
                    {existsInB ? (
                      <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-rose-700 dark:text-rose-300">
                        <Check className="h-4 w-4 text-rose-500" /> Shared Active / Base
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs sm:text-sm text-[#937C8B]">
                        <X className="h-4 w-4 text-rose-300" /> Exclusive to {productA.brand}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
