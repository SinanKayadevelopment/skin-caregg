export type IngredientCategory =
  | 'ACTIVE'
  | 'EMOLLIENT'
  | 'HUMECTANT'
  | 'PRESERVATIVE'
  | 'SOLVENT'
  | 'SURFACTANT'
  | 'OTHER';

export type ConflictSeverity = 'WARNING' | 'DANGER' | 'SYNERGY';

export interface Ingredient {
  id: string;
  name: string;
  inciName: string;
  category: IngredientCategory;
  description: string;
}

export interface ProductIngredient {
  id?: string;
  productId?: string;
  ingredientId: string;
  rankOrder: number;
  isActiveIngredient: boolean;
  ingredient: Ingredient;
}

export interface Product {
  id: string;
  slug: string;
  brand: string;
  name: string;
  price: number;
  currency: string;
  imageUrl: string;
  affiliateUrl: string;
  isLuxuryTarget: boolean;
  ingredientsRaw: string;
  ingredients: ProductIngredient[];
  clicksCount?: number;
}

export interface IngredientConflict {
  id: string;
  ingredientAId: string;
  ingredientBId: string;
  severity: ConflictSeverity;
  explanation: string;
  ingredientA?: Ingredient;
  ingredientB?: Ingredient;
}

export interface DifferingIngredient {
  name: string;
  inciName: string;
  category: IngredientCategory;
  presentIn: 'luxury' | 'dupe';
}

export interface DupeMatchResult {
  dupeProduct: Product;
  matchPercentage: number;
  priceDiffMultiplier: string;
  savingsPercentage: number;
  savingsAmount: number;
  sharedActives: string[];
  differingIngredients: DifferingIngredient[];
  sharedIngredientCount: number;
  totalUniqueIngredients: number;
  verdict: string;
  scoreBreakdown: {
    activeMatchScore: number;
    top5MatchScore: number;
    baseMatchScore: number;
  };
}

export interface ConflictCheckItem {
  ingredientA: string;
  ingredientB: string;
  severity: ConflictSeverity;
  title: string;
  explanation: string;
  actionableGuidance: string;
}

export interface RoutineConflictReport {
  hasConflicts: boolean;
  hasSynergies: boolean;
  overallSafetyScore: number; // 0 - 100
  items: ConflictCheckItem[];
  summary: string;
}
