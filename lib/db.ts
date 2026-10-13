import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

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
  if (process.env.DATABASE_URL) {
    try {
      await prisma.clickLog.create({
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
