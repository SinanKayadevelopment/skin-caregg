import { ALL_PRODUCTS, LUXURY_TARGETS, DUPE_PRODUCTS } from '../data/all-products';
import { calculateDupeMatch } from './algorithm/dupe-matcher';
import { KNOWN_CONFLICT_RULES, KnownConflictRule } from './algorithm/conflict-checker';
import { Product, DupeMatchResult } from './types';

export function getAllProducts(): Product[] {
  return ALL_PRODUCTS;
}

export function getLuxuryTargets(): Product[] {
  return LUXURY_TARGETS;
}

export function getDupeCandidates(): Product[] {
  return DUPE_PRODUCTS;
}

export function getProductBySlug(slug: string): Product | undefined {
  return ALL_PRODUCTS.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
}

export function getProductById(id: string): Product | undefined {
  return ALL_PRODUCTS.find((p) => p.id === id || p.slug === id);
}

/**
 * Calculates and returns ranked dupes for a luxury product
 */
export function getDupesForProduct(luxuryProduct: Product): DupeMatchResult[] {
  // If the product is itself a dupe or not marked luxury, we can still match against all other products
  const candidates = ALL_PRODUCTS.filter((p) => p.id !== luxuryProduct.id);

  const results: DupeMatchResult[] = candidates
    .map((candidate) => calculateDupeMatch(luxuryProduct, candidate))
    // Keep matches with meaningful similarity or lower price
    .filter((match) => match.matchPercentage >= 35 || match.savingsAmount > 0)
    .sort((a, b) => b.matchPercentage - a.matchPercentage);

  return results;
}

/**
 * Autocomplete search across all products (Brand + Name + Key Ingredients)
 */
export function searchProducts(query: string, limit = 10): Product[] {
  if (!query || query.trim().length === 0) return [];
  const q = query.toLowerCase().trim();

  return ALL_PRODUCTS.filter((p) => {
    return (
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.ingredientsRaw.toLowerCase().includes(q)
    );
  }).slice(0, limit);
}

/**
 * Helper to get popular comparison pairs for pSEO routes
 */
export function getPopularComparePairs(): { productA: Product; productB: Product; slug: string }[] {
  const pairs: { productA: Product; productB: Product; slug: string }[] = [];

  LUXURY_TARGETS.forEach((target) => {
    const dupes = getDupesForProduct(target).slice(0, 2);
    dupes.forEach((dupe) => {
      pairs.push({
        productA: target,
        productB: dupe.dupeProduct,
        slug: `${target.slug}-vs-${dupe.dupeProduct.slug}`,
      });
    });
  });

  return pairs;
}

/**
 * Helper to get ingredient conflict pairings for pSEO routes
 */
export function getAllConflictRoutes(): { ingredientA: string; ingredientB: string; slug: string; rule: KnownConflictRule }[] {
  return KNOWN_CONFLICT_RULES.map((rule) => {
    const slugA = rule.ingredientA.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const slugB = rule.ingredientB.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return {
      ingredientA: rule.ingredientA,
      ingredientB: rule.ingredientB,
      slug: `${slugA}-and-${slugB}`,
      rule,
    };
  });
}
