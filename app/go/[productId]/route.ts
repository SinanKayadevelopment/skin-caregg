import { NextRequest, NextResponse } from 'next/server';
import { getProductById } from '@/lib/data';
import { buildMonetizedUrl } from '@/lib/affiliate-config';
import { recordClickLog } from '@/lib/db';

/**
 * Cloaked Affiliate Redirection Layer & Monetization Engine
 * - Appends affiliate tracking IDs based on merchant (Amazon, Sephora, Target, Skimlinks)
 * - Falls back to dynamically generated Amazon search URL with AMAZON_ASSOCIATE_TAG
 * - Records click in ClickLog database model (productId, targetUrl, referrer, userAgent, timestamp)
 * - Returns X-Robots-Tag: noindex, nofollow
 * - Dispatches HTTP 307 Temporary Redirect
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
  const product = getProductById(productId);

  const referrer = request.headers.get('referer') || request.headers.get('referrer') || 'direct';
  const userAgent = request.headers.get('user-agent') || 'unknown';

  if (!product) {
    const fallbackAmazonTag = process.env.AMAZON_ASSOCIATE_TAG || 'dermadupe-20';
    const fallbackSearch = `https://www.amazon.com/s?k=${encodeURIComponent(
      productId
    )}&tag=${encodeURIComponent(fallbackAmazonTag)}`;

    return NextResponse.redirect(fallbackSearch, {
      status: 307,
      headers: {
        'X-Robots-Tag': 'noindex, nofollow',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  }

  // Generate monetized target URL
  const targetUrl = buildMonetizedUrl(product, product.affiliateUrl);

  // Persist click event to database asynchronously
  await recordClickLog({
    productId: product.id,
    targetUrl,
    referrer,
    userAgent,
  });

  return NextResponse.redirect(targetUrl, {
    status: 307,
    headers: {
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
