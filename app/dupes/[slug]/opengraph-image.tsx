import { ImageResponse } from 'next/og';
import { getProductBySlug, getDupesForProduct } from '@/lib/data';

export const alt = 'DermaDupe Lab - Chemical Formula Match & Savings';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

interface ImageProps {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: ImageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#090d16',
            color: '#ffffff',
            fontSize: 48,
            fontWeight: 800,
          }}
        >
          <span>DermaDupe Lab • Skincare Match Engine</span>
        </div>
      ),
      { ...size }
    );
  }

  const dupes = getDupesForProduct(product);
  const topDupe = dupes[0];

  const matchPercentage = topDupe ? topDupe.matchPercentage : 90;
  const dupeName = topDupe ? topDupe.dupeProduct.name : 'Top Drugstore Dupe';
  const dupeBrand = topDupe ? topDupe.dupeProduct.brand : 'Verified Alternative';
  const dupePrice = topDupe ? topDupe.dupeProduct.price : Math.round(product.price * 0.2);
  const savingsDollars = Math.round(product.price - dupePrice);
  const savingsPercent = Math.round(((product.price - dupePrice) / product.price) * 100);

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#090d16',
          padding: '44px 50px',
          fontFamily: 'sans-serif',
          color: '#ffffff',
        }}
      >
        {/* Top Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                display: 'flex',
                backgroundColor: '#059669',
                color: '#ffffff',
                padding: '6px 14px',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: 800,
                letterSpacing: '1px',
              }}
            >
              DERMADUPE LAB
            </div>
            <div
              style={{
                display: 'flex',
                color: '#10b981',
                fontSize: '16px',
                fontWeight: 700,
                letterSpacing: '2px',
                textTransform: 'uppercase',
              }}
            >
              Chemical Formula Match Engine
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              padding: '6px 16px',
              borderRadius: '999px',
              fontSize: '15px',
              fontWeight: 600,
              color: '#94a3b8',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            Reddit Community Verified
          </div>
        </div>

        {/* Center Comparison Showcase */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            margin: '16px 0',
            width: '100%',
          }}
        >
          {/* Left Card: Luxury Target */}
          <div
            style={{
              flex: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '24px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: '13px',
                fontWeight: 800,
                color: '#f59e0b',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                marginBottom: '4px',
              }}
            >
              Luxury Holy Grail
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: '22px',
                fontWeight: 800,
                color: '#cbd5e1',
                marginBottom: '4px',
              }}
            >
              {product.brand}
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: '20px',
                fontWeight: 600,
                color: '#ffffff',
                height: '52px',
                overflow: 'hidden',
                lineHeight: '1.3',
              }}
            >
              {product.name}
            </div>
            <div
              style={{
                marginTop: '16px',
                display: 'flex',
                alignItems: 'baseline',
                gap: '8px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  fontSize: '36px',
                  fontWeight: 900,
                  color: '#f87171',
                  textDecoration: 'line-through',
                }}
              >
                ${product.price.toFixed(0)}
              </div>
              <div style={{ display: 'flex', fontSize: '14px', color: '#94a3b8' }}>MSRP</div>
            </div>
          </div>

          {/* Center Match Badge */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '180px',
              height: '180px',
              borderRadius: '999px',
              backgroundColor: '#064e3b',
              border: '4px solid #10b981',
              textAlign: 'center',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: '44px',
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: '1',
              }}
            >
              {matchPercentage}%
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: '12px',
                fontWeight: 800,
                color: '#6ee7b7',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                marginTop: '4px',
              }}
            >
              Formula Match
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: '11px',
                fontWeight: 700,
                color: '#ffffff',
                backgroundColor: '#047857',
                padding: '2px 8px',
                borderRadius: '6px',
                marginTop: '6px',
              }}
            >
              Active Equivalence
            </div>
          </div>

          {/* Right Card: Verified Dupe */}
          <div
            style={{
              flex: 1,
              backgroundColor: 'rgba(16, 185, 129, 0.08)',
              border: '2px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '24px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: '13px',
                fontWeight: 800,
                color: '#34d399',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                marginBottom: '4px',
              }}
            >
              Verified Drugstore Dupe
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: '22px',
                fontWeight: 800,
                color: '#a7f3d0',
                marginBottom: '4px',
              }}
            >
              {dupeBrand}
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: '20px',
                fontWeight: 600,
                color: '#ffffff',
                height: '52px',
                overflow: 'hidden',
                lineHeight: '1.3',
              }}
            >
              {dupeName}
            </div>
            <div
              style={{
                marginTop: '16px',
                display: 'flex',
                alignItems: 'baseline',
                gap: '8px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  fontSize: '40px',
                  fontWeight: 900,
                  color: '#10b981',
                }}
              >
                ${dupePrice.toFixed(0)}
              </div>
              <div
                style={{
                  display: 'flex',
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 800,
                  padding: '4px 10px',
                  borderRadius: '8px',
                }}
              >
                SAVE ${savingsDollars} ({savingsPercent}% OFF)
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            borderRadius: '16px',
            padding: '14px 24px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            width: '100%',
          }}
        >
          <div
            style={{
              fontSize: '16px',
              fontWeight: 700,
              color: '#e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>💰 Price Anchor:</span>
            <span style={{ color: '#f87171' }}>${product.price.toFixed(0)}</span>
            <span>vs</span>
            <span style={{ color: '#34d399' }}>${dupePrice.toFixed(0)}</span>
            <span>• Save ${savingsDollars} on identical chemical actives</span>
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: '15px',
              fontWeight: 700,
              color: '#10b981',
            }}
          >
            dermadupe.com/dupes/{product.slug}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
