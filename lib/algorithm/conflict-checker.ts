import { ConflictCheckItem, RoutineConflictReport, ConflictSeverity, Product } from '../types';
import { normalizeInciName } from './dupe-matcher';

export interface KnownConflictRule {
  ingredientA: string;
  ingredientB: string;
  severity: ConflictSeverity;
  title: string;
  explanation: string;
  actionableGuidance: string;
}

export const KNOWN_CONFLICT_RULES: KnownConflictRule[] = [
  {
    ingredientA: 'Retinol',
    ingredientB: 'Salicylic Acid',
    severity: 'DANGER',
    title: 'High Risk: Chemical Barrier Compromise',
    explanation: 'Combining Retinol (cellular turnover accelerator) with Salicylic Acid (lipophilic BHA exfoliant) severely taxes the stratum corneum, stripping lipid barriers and causing micro-inflammation.',
    actionableGuidance: 'Do Not Mix in Same Routine. Use Salicylic Acid in the AM or on alternate nights, reserving Retinol for PM application.',
  },
  {
    ingredientA: 'Retinol',
    ingredientB: 'Glycolic Acid',
    severity: 'DANGER',
    title: 'High Risk: Over-Exfoliation & Barrier Rupture',
    explanation: 'Both ingredients accelerate epidermal renewal. Stacking them destabilizes the acid mantle, provoking erythema, flaking, and contact dermatitis.',
    actionableGuidance: 'Do Not Mix in Same Routine. Alternate on separate evenings or practice Skin Cycling (Night 1: Exfoliate, Night 2: Retinol, Nights 3-4: Recovery).',
  },
  {
    ingredientA: 'Ascorbic Acid',
    ingredientB: 'Retinol',
    severity: 'WARNING',
    title: 'pH Conflict & Irritation Potential',
    explanation: 'Pure L-Ascorbic Acid operates optimally at low pH (< 3.5), whereas Retinol converts enzymatically at pH 5.5–6.5. Layering simultaneously reduces retinol efficacy and multiplies sensitivity.',
    actionableGuidance: 'Alternate AM / PM. Apply Vitamin C in the morning for UV free-radical defense; apply Retinol at night for cellular repair.',
  },
  {
    ingredientA: 'Benzoyl Peroxide',
    ingredientB: 'Retinol',
    severity: 'DANGER',
    title: 'Oxidative Neutralization & Extreme Dryness',
    explanation: 'Benzoyl Peroxide is a potent oxidizing agent that chemically deactivates standard retinol molecules upon contact, leaving zero anti-aging benefit while compounding severe irritation.',
    actionableGuidance: 'Do Not Mix in Same Routine. Use Benzoyl Peroxide spot treatments in the morning and Retinol strictly in the evening.',
  },
  {
    ingredientA: 'Ascorbic Acid',
    ingredientB: 'Ferulic Acid',
    severity: 'SYNERGY',
    title: 'Synergistic Combination: 8x Photoprotection Multiplier',
    explanation: 'Ferulic acid stabilizes the notoriously oxidation-prone L-ascorbic acid and tocopherol (Vitamin E), quadrupling antioxidant longevity and boosting skin photoprotection by eight-fold.',
    actionableGuidance: 'Synergistic Combination (Enhanced Results). Apply together under broad-spectrum SPF 30+ every morning.',
  },
  {
    ingredientA: 'Niacinamide',
    ingredientB: 'Salicylic Acid',
    severity: 'SYNERGY',
    title: 'Synergistic Combination: Complete Pore Clarification',
    explanation: 'Salicylic acid dissolves sebum inside follicular walls while Niacinamide soothes inflammation and regulates sebaceous gland output, offering double-action acne control with reduced redness.',
    actionableGuidance: 'Synergistic Combination (Enhanced Results). Can be safely layered in both AM and PM routines.',
  },
  {
    ingredientA: 'Ceramides',
    ingredientB: 'Hyaluronic Acid',
    severity: 'SYNERGY',
    title: 'Synergistic Combination: Gold Standard Moisture Lock',
    explanation: 'Hyaluronic acid binds water in the intercellular matrix while ceramides seal the lipid bilayer, preventing transepidermal water loss (TEWL) and rebuilding sensitized skin barriers.',
    actionableGuidance: 'Synergistic Combination (Enhanced Results). Ideal for post-procedure or barrier recovery routines.',
  },
  {
    ingredientA: 'Copper Peptides',
    ingredientB: 'Ascorbic Acid',
    severity: 'WARNING',
    title: 'Metallic Ion Oxidation Risk',
    explanation: 'Direct acidic L-ascorbic acid can chelate copper ions in peptides, causing discoloration, breaking peptide bonds, and diminishing collagen-stimulating activity.',
    actionableGuidance: 'Alternate AM / PM. Use Vitamin C in the AM and Copper Peptides at night, or alternate every other evening.',
  },
  {
    ingredientA: 'Niacinamide',
    ingredientB: 'Retinol',
    severity: 'SYNERGY',
    title: 'Synergistic Combination: Barrier-Buffered Anti-Aging',
    explanation: 'Niacinamide promotes natural ceramide synthesis and reduces erythema, neutralizing common retinol-induced peeling and purging without inhibiting retinoid receptors.',
    actionableGuidance: 'Synergistic Combination (Enhanced Results). Apply Niacinamide 2-3 minutes before or mixed with Retinol for superior tolerability.',
  },
  {
    ingredientA: 'Glycolic Acid',
    ingredientB: 'Salicylic Acid',
    severity: 'WARNING',
    title: 'Moderate Over-Exfoliation Caution',
    explanation: 'Combining deep-penetrating AHA with pore-clearing BHA increases trans-epidermal water loss unless properly buffered with soothing humectants.',
    actionableGuidance: 'Use buffered dual-acid formulas or alternate days to prevent skin sensitization.',
  },
];

/**
 * Checks a list of ingredient names or full products for clinical conflicts and synergies.
 */
export function checkRoutineConflicts(
  ingredientNames: string[],
  products: Product[] = []
): RoutineConflictReport {
  // Aggregate all ingredient keys
  const collectedKeys = new Set<string>();

  ingredientNames.forEach((n) => collectedKeys.add(normalizeInciName(n)));

  products.forEach((prod) => {
    prod.ingredients.forEach((pi) => {
      collectedKeys.add(normalizeInciName(pi.ingredient.name));
      if (pi.ingredient.inciName) {
        collectedKeys.add(normalizeInciName(pi.ingredient.inciName));
      }
    });
  });

  const items: ConflictCheckItem[] = [];
  let dangerCount = 0;
  let warningCount = 0;
  let synergyCount = 0;

  KNOWN_CONFLICT_RULES.forEach((rule) => {
    const keyA = normalizeInciName(rule.ingredientA);
    const keyB = normalizeInciName(rule.ingredientB);

    // Check if both ingredients are present in the routine
    let hasA = false;
    let hasB = false;

    collectedKeys.forEach((k) => {
      if (k.includes(keyA) || keyA.includes(k)) hasA = true;
      if (k.includes(keyB) || keyB.includes(k)) hasB = true;
    });

    if (hasA && hasB) {
      items.push({
        ingredientA: rule.ingredientA,
        ingredientB: rule.ingredientB,
        severity: rule.severity,
        title: rule.title,
        explanation: rule.explanation,
        actionableGuidance: rule.actionableGuidance,
      });

      if (rule.severity === 'DANGER') dangerCount++;
      if (rule.severity === 'WARNING') warningCount++;
      if (rule.severity === 'SYNERGY') synergyCount++;
    }
  });

  let safetyScore = 100;
  safetyScore -= dangerCount * 35;
  safetyScore -= warningCount * 15;
  safetyScore = Math.max(10, Math.min(100, safetyScore));

  let summary = 'No harmful interactions detected in this formulation set.';
  if (dangerCount > 0) {
    summary = `Detected ${dangerCount} severe formulation clash(es). Mixing these actives in the same application window risks acute barrier damage.`;
  } else if (warningCount > 0) {
    summary = `Detected ${warningCount} moderate interaction(s). Splitting between AM and PM routines is strongly advised.`;
  } else if (synergyCount > 0) {
    summary = `Discovered ${synergyCount} proven synergistic pairing(s). These actives amplify each other's therapeutic efficacy.`;
  }

  return {
    hasConflicts: dangerCount > 0 || warningCount > 0,
    hasSynergies: synergyCount > 0,
    overallSafetyScore: safetyScore,
    items,
    summary,
  };
}
