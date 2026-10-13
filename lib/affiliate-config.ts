import { Product } from './types';

export interface AffiliateConfig {
  amazonAssociateTag: string;
  skimlinksId: string;
  impactRadiusId: string;
  sephoraAffiliateId: string;
}

/**
 * Centralized affiliate configuration reading environment variables with production fallbacks
 */
export function getAffiliateConfig(): AffiliateConfig {
  return {
    amazonAssociateTag: process.env.AMAZON_ASSOCIATE_TAG || 'dermadupe-20',
    skimlinksId: process.env.SKIMLINKS_ID || '',
    impactRadiusId: process.env.IMPACT_RADIUS_ID || '',
    sephoraAffiliateId: process.env.SEPHORA_AFFILIATE_ID || '',
  };
}

/**
 * Builds a dynamically tagged affiliate URL based on retailer domain:
 * 1. Amazon: Appends ?tag=AMAZON_ASSOCIATE_TAG
 * 2. Sephora: Appends Sephora affiliate subID / parameters
 * 3. Target: Appends Impact Radius afid / subID
 * 4. General Merchants (Ulta, brand sites): Wraps with Skimlinks redirect if configured
 * 5. Fallback: Amazon Search link with Amazon Associate tag
 */
export function buildMonetizedUrl(product: Product, rawUrl?: string): string {
  const config = getAffiliateConfig();
  const urlToTransform = rawUrl || product.affiliateUrl;

  const fallbackAmazonSearch = `https://www.amazon.com/s?k=${encodeURIComponent(
    product.brand + ' ' + product.name
  )}&tag=${encodeURIComponent(config.amazonAssociateTag)}`;

  if (!urlToTransform || !urlToTransform.startsWith('http')) {
    return fallbackAmazonSearch;
  }

  try {
    const parsed = new URL(urlToTransform);
    const hostname = parsed.hostname.toLowerCase();

    // 1. Amazon
    if (hostname.includes('amazon.') || hostname.includes('amzn.to')) {
      parsed.searchParams.set('tag', config.amazonAssociateTag);
      return parsed.toString();
    }

    // 2. Sephora
    if (hostname.includes('sephora.')) {
      if (config.sephoraAffiliateId) {
        parsed.searchParams.set('subid', config.sephoraAffiliateId);
      }
      if (config.skimlinksId) {
        return `https://go.skimresources.com/?id=${encodeURIComponent(
          config.skimlinksId
        )}&url=${encodeURIComponent(parsed.toString())}`;
      }
      return parsed.toString();
    }

    // 3. Target
    if (hostname.includes('target.')) {
      if (config.impactRadiusId) {
        parsed.searchParams.set('afid', config.impactRadiusId);
      }
      if (config.skimlinksId) {
        return `https://go.skimresources.com/?id=${encodeURIComponent(
          config.skimlinksId
        )}&url=${encodeURIComponent(parsed.toString())}`;
      }
      return parsed.toString();
    }

    // 4. Skimlinks Universal Wrapper for other cosmetic retailers (Ulta, Dermstore, brand direct)
    if (config.skimlinksId) {
      return `https://go.skimresources.com/?id=${encodeURIComponent(
        config.skimlinksId
      )}&url=${encodeURIComponent(urlToTransform)}`;
    }

    // 5. Default: return clean direct store URL or Amazon fallback
    return urlToTransform;
  } catch {
    return fallbackAmazonSearch;
  }
}
