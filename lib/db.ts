import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export function getPrismaClient(): PrismaClient | null {
  if (typeof window !== 'undefined') return null;
  if (!process.env.DATABASE_URL) return null;

  try {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      });
    }
    return globalForPrisma.prisma;
  } catch (err) {
    console.warn('[PrismaClient Warning]: Unable to initialize Prisma Client:', err);
    return null;
  }
}

// Resilient proxy so code referencing `prisma.*` does not throw during build or when database is offline
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    if (!client) {
      return () => Promise.resolve(null);
    }
    return (client as any)[prop];
  },
});

export interface LogClickParams {
  productId: string;
  targetUrl: string;
  referrer?: string | null;
  userAgent?: string | null;
}

/**
 * Records an affiliate redirection event into ClickLog.
 * Gracefully handles offline development and standalone mode if no database is connected.
 */
export async function recordClickLog(params: LogClickParams): Promise<void> {
  const timestamp = new Date();

  // If DATABASE_URL is configured, persist to database
  const client = getPrismaClient();
  if (client) {
    try {
      await client.clickLog.create({
        data: {
          productId: params.productId,
          targetUrl: params.targetUrl,
          referrer: params.referrer || 'direct',
          userAgent: params.userAgent || 'unknown',
          timestamp,
        },
      });
      return;
    } catch (err) {
      console.error('[DB ClickLog Error]: Failed to save click event to database:', err);
    }
  }

  // Standalone logging fallback
  console.log(
    `[AFFILIATE CLICK LOGGED] Product: ${params.productId} | Target: ${params.targetUrl} | Ref: ${
      params.referrer || 'direct'
    } | Time: ${timestamp.toISOString()}`
  );
}
