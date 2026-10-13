import { PrismaClient, IngredientCategory, ConflictSeverity } from '@prisma/client';
import { ALL_PRODUCTS } from '../data/all-products';
import { KNOWN_CONFLICT_RULES } from '../lib/algorithm/conflict-checker';

const prisma = new PrismaClient();

async function main() {
  console.log('🧪 Starting Skincare Dupe & Ingredient Match Engine Database Seed...');

  if (!process.env.DATABASE_URL) {
    console.log('ℹ️ DATABASE_URL not set. Running in standalone static catalog mode.');
    console.log(`✅ Verified ${ALL_PRODUCTS.length} curated products ready in data/all-products.ts.`);
    console.log('To sync directly with Supabase/PostgreSQL, configure DATABASE_URL in your .env file and rerun `npm run seed`.');
    return;
  }

  console.log(`Connecting to database at ${process.env.DATABASE_URL.replace(/:[^:]*@/, ':****@')}...`);

  // 1. Seed Ingredients
  const ingredientMap = new Map<string, string>();
  for (const product of ALL_PRODUCTS) {
    for (const pi of product.ingredients) {
      const ing = pi.ingredient;
      if (!ingredientMap.has(ing.name)) {
        const createdIng = await prisma.ingredient.upsert({
          where: { id: ing.id },
          update: {
            name: ing.name,
            inciName: ing.inciName,
            category: ing.category as IngredientCategory,
            description: ing.description,
          },
          create: {
            id: ing.id,
            name: ing.name,
            inciName: ing.inciName,
            category: ing.category as IngredientCategory,
            description: ing.description,
          },
        });
        ingredientMap.set(ing.name, createdIng.id);
      }
    }
  }
  console.log(`✅ Seeded ${ingredientMap.size} unique cosmetic ingredients.`);

  // 2. Seed Products & Link ProductIngredients
  for (const product of ALL_PRODUCTS) {
    const createdProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        brand: product.brand,
        name: product.name,
        price: product.price,
        currency: product.currency,
        imageUrl: product.imageUrl,
        affiliateUrl: product.affiliateUrl,
        isLuxuryTarget: product.isLuxuryTarget,
        ingredientsRaw: product.ingredientsRaw,
      },
      create: {
        id: product.id,
        slug: product.slug,
        brand: product.brand,
        name: product.name,
        price: product.price,
        currency: product.currency,
        imageUrl: product.imageUrl,
        affiliateUrl: product.affiliateUrl,
        isLuxuryTarget: product.isLuxuryTarget,
        ingredientsRaw: product.ingredientsRaw,
      },
    });

    // Clear and re-insert product ingredients
    await prisma.productIngredient.deleteMany({
      where: { productId: createdProduct.id },
    });

    for (const pi of product.ingredients) {
      const dbIngredientId = ingredientMap.get(pi.ingredient.name) || pi.ingredient.id;
      await prisma.productIngredient.create({
        data: {
          productId: createdProduct.id,
          ingredientId: dbIngredientId,
          rankOrder: pi.rankOrder,
          isActiveIngredient: pi.isActiveIngredient,
        },
      });
    }
  }
  console.log(`✅ Seeded ${ALL_PRODUCTS.length} products with complete rank-ordered INCI mappings.`);

  // 3. Seed Ingredient Conflicts & Synergies
  for (const rule of KNOWN_CONFLICT_RULES) {
    const ingAId = ingredientMap.get(rule.ingredientA) || `ing-${rule.ingredientA.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    const ingBId = ingredientMap.get(rule.ingredientB) || `ing-${rule.ingredientB.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

    // Ensure dummy ingredients exist if not matched
    await prisma.ingredient.upsert({
      where: { id: ingAId },
      update: {},
      create: {
        id: ingAId,
        name: rule.ingredientA,
        inciName: rule.ingredientA,
        category: 'ACTIVE',
        description: 'Key active ingredient',
      },
    });

    await prisma.ingredient.upsert({
      where: { id: ingBId },
      update: {},
      create: {
        id: ingBId,
        name: rule.ingredientB,
        inciName: rule.ingredientB,
        category: 'ACTIVE',
        description: 'Key active ingredient',
      },
    });

    await prisma.ingredientConflict.upsert({
      where: {
        ingredientAId_ingredientBId: {
          ingredientAId: ingAId,
          ingredientBId: ingBId,
        },
      },
      update: {
        severity: rule.severity as ConflictSeverity,
        explanation: `${rule.title} - ${rule.explanation} Guidance: ${rule.actionableGuidance}`,
      },
      create: {
        ingredientAId: ingAId,
        ingredientBId: ingBId,
        severity: rule.severity as ConflictSeverity,
        explanation: `${rule.title} - ${rule.explanation} Guidance: ${rule.actionableGuidance}`,
      },
    });
  }
  console.log(`✅ Seeded ${KNOWN_CONFLICT_RULES.length} clinical routine conflict & synergy rules.`);

  console.log('🎉 Seed complete! Reddit Top 50 Skincare Holy Grails and Drugstore Dupes successfully initialized.');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
