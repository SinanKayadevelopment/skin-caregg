import { Product, DupeMatchResult, DifferingIngredient, IngredientCategory } from '../types';

/**
 * Normalizes ingredient names or INCI strings for fuzzy-exact cosmetic matching
 */
export function normalizeInciName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

/**
 * Determines weighting for an ingredient on the luxury target:
 * - Active ingredients: 5x
 * - Top 5 in formulation (Rank 1-5): 4x
 * - Base/inactive ingredients: 1x
 */
export function getIngredientWeight(rankOrder: number, isAct: boolean, category: IngredientCategory): number {
  if (isAct || category === 'ACTIVE') {
    return 5.0;
  }
  if (rankOrder <= 5) {
    return 4.0;
  }
  return 1.0;
}

/**
 * Weighted Cosmetic Similarity Algorithm
 *
 * Compares a Target Luxury Product (A) with a Candidate Dupe (B):
 * 1. Matches within Top 5 ingredients (rank 1-5) receive 4x weight
 * 2. Matches of categorized Active Ingredients receive 5x weight
 * 3. Inactive/base ingredients receive 1x weight
 *
 * Generates matchPercentage (0-100%), price difference multiplier,
 * shared active ingredients, differing ingredients, and dermatological verdict.
 */
export function calculateDupeMatch(luxury: Product, dupe: Product): DupeMatchResult {
  const luxuryMap = new Map<string, { rank: number; isAct: boolean; category: IngredientCategory; name: string; inci: string }>();
  const dupeMap = new Map<string, { rank: number; isAct: boolean; category: IngredientCategory; name: string; inci: string }>();

  luxury.ingredients.forEach((pi) => {
    const key = normalizeInciName(pi.ingredient.inciName || pi.ingredient.name);
    luxuryMap.set(key, {
      rank: pi.rankOrder,
      isAct: pi.isActiveIngredient || pi.ingredient.category === 'ACTIVE',
      category: pi.ingredient.category,
      name: pi.ingredient.name,
      inci: pi.ingredient.inciName,
    });
  });

  dupe.ingredients.forEach((pi) => {
    const key = normalizeInciName(pi.ingredient.inciName || pi.ingredient.name);
    dupeMap.set(key, {
      rank: pi.rankOrder,
      isAct: pi.isActiveIngredient || pi.ingredient.category === 'ACTIVE',
      category: pi.ingredient.category,
      name: pi.ingredient.name,
      inci: pi.ingredient.inciName,
    });
  });

  let totalLuxuryWeight = 0;
  let matchedWeight = 0;

  let activeMatchScore = 0;
  let top5MatchScore = 0;
  let baseMatchScore = 0;

  const sharedActives: string[] = [];
  const differingIngredients: DifferingIngredient[] = [];

  // Evaluate luxury ingredients against candidate dupe
  luxuryMap.forEach((luxData, key) => {
    const weight = getIngredientWeight(luxData.rank, luxData.isAct, luxData.category);
    totalLuxuryWeight += weight;

    if (dupeMap.has(key)) {
      const dupeData = dupeMap.get(key)!;
      let matchMultiplier = 1.0;

      // Bonus if matched in top 5 of both formulations
      if (luxData.rank <= 5 && dupeData.rank <= 5) {
        matchMultiplier = 1.0;
      } else if (luxData.rank <= 5 && dupeData.rank > 5) {
        // Ingredient is high in target but diluted in dupe
        matchMultiplier = 0.75;
      }

      const scoreContribution = weight * matchMultiplier;
      matchedWeight += scoreContribution;

      if (luxData.isAct || dupeData.isAct) {
        sharedActives.push(luxData.name);
        activeMatchScore += scoreContribution;
      } else if (luxData.rank <= 5) {
        top5MatchScore += scoreContribution;
      } else {
        baseMatchScore += scoreContribution;
      }
    } else {
      differingIngredients.push({
        name: luxData.name,
        inciName: luxData.inci,
        category: luxData.category,
        presentIn: 'luxury',
      });
    }
  });

  // Find ingredients unique to dupe
  dupeMap.forEach((dupeData, key) => {
    if (!luxuryMap.has(key)) {
      differingIngredients.push({
        name: dupeData.name,
        inciName: dupeData.inci,
        category: dupeData.category,
        presentIn: 'dupe',
      });
    }
  });

  // Calculate normalized percentage
  const rawRatio = totalLuxuryWeight > 0 ? (matchedWeight / totalLuxuryWeight) : 0;
  
  // Slight penalty if dupe adds many foreign fillers or lacks actives
  const sharedCount = luxury.ingredients.length - differingIngredients.filter(d => d.presentIn === 'luxury').length;
  const totalUnique = new Set([...Array.from(luxuryMap.keys()), ...Array.from(dupeMap.keys())]).size;
  const jaccardFactor = totalUnique > 0 ? (sharedCount / totalUnique) : 0;

  // Composite formulation score: 75% weighted target presence, 25% formulation cleanliness
  const compositePercentage = (rawRatio * 0.78 + jaccardFactor * 0.22) * 100;
  const matchPercentage = Math.min(100, Math.max(15, Math.round(compositePercentage * 10) / 10));

  // Calculate price difference multiplier
  let priceDiffMultiplier = 'Comparable price';
  const savingsAmount = Math.max(0, luxury.price - dupe.price);
  const savingsPercentage = luxury.price > 0 ? Math.round(((luxury.price - dupe.price) / luxury.price) * 100) : 0;

  if (dupe.price > 0 && luxury.price > dupe.price) {
    const ratio = luxury.price / dupe.price;
    priceDiffMultiplier = `${ratio.toFixed(1)}x cheaper`;
  } else if (dupe.price >= luxury.price && luxury.price > 0) {
    priceDiffMultiplier = `${(dupe.price / luxury.price).toFixed(1)}x higher`;
  }

  // Generate dermatological verdict
  const verdict = generateVerdict(matchPercentage, sharedActives, differingIngredients);

  return {
    dupeProduct: dupe,
    matchPercentage,
    priceDiffMultiplier,
    savingsPercentage,
    savingsAmount,
    sharedActives: Array.from(new Set(sharedActives)),
    differingIngredients,
    sharedIngredientCount: sharedCount,
    totalUniqueIngredients: totalUnique,
    verdict,
    scoreBreakdown: {
      activeMatchScore: Math.round(activeMatchScore * 10) / 10,
      top5MatchScore: Math.round(top5MatchScore * 10) / 10,
      baseMatchScore: Math.round(baseMatchScore * 10) / 10,
    },
  };
}

/**
 * Generates an automated clinical cosmetic verdict based on formulation analysis
 */
function generateVerdict(
  matchScore: number,
  sharedActives: string[],
  differing: DifferingIngredient[]
): string {
  const activeCount = sharedActives.length;
  const dupeAdditions = differing.filter((d) => d.presentIn === 'dupe');
  const luxExclusives = differing.filter((d) => d.presentIn === 'luxury');

  if (matchScore >= 92) {
    if (activeCount > 0) {
      return `Bio-equivalent formulation match. Delivers the identical ${sharedActives.slice(0, 2).join(' and ')} active complex within a near-identical solvent and carrier matrix.`;
    }
    return 'Near-identical formulation matrix with virtually indistinguishable base emollients and humectants.';
  }

  if (matchScore >= 82) {
    if (activeCount > 0) {
      return `Exceptional functional dupe. Preserves the core therapeutic ${sharedActives.slice(0, 2).join(' + ')} complex with minor differences in cosmetic texture agents.`;
    }
    return 'High-affinity chemical alternative. Shares the primary hydrating matrix with an updated preservative system.';
  }

  if (matchScore >= 70) {
    const dupeHero = dupeAdditions.find((d) => d.category === 'ACTIVE')?.name;
    const additionText = dupeHero ? ` while supplementing with soothing ${dupeHero}` : '';
    return `Effective budget alternative. Replicates key active targets${additionText}, using modern lighter emollients.`;
  }

  if (matchScore >= 55) {
    return `Partial formulation overlap. Emulates the core performance benefits of the luxury target but relies on a different emulsification base.`;
  }

  return 'Complementary alternative with shared single actives, though overall carrier vehicle and viscosity differ noticeably.';
}
