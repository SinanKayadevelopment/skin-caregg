import type { Metadata } from 'next';
import Script from 'next/script';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const playfairDisplay = Playfair_Display({
  variable: '--font-serif',
  subsets: ['latin'],
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

const gscVerification = process.env.NEXT_PUBLIC_GSC_VERIFICATION;

export const metadata: Metadata = {
  title: 'DermaDupe Atelier | Luxury Skincare Dupes & Smart Beauty Guide',
  description: 'Discover verified affordable drugstore twins for luxury skincare favorites like Estée Lauder, La Mer, and SkinCeuticals. Save up to 85% on identical restorative formulas.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://skin-caregg.vercel.app'),
  verification: gscVerification ? { google: gscVerification } : undefined,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#FAF6F5] text-[#2C1F25] selection:bg-rose-200 selection:text-rose-950 dark:bg-[#150E13] dark:text-[#F8F1F3]">
        {children}
        <Script
          id="skimlinks-script"
          strategy="afterInteractive"
          src="https://s.skimresources.com/js/311002X1799493.skimlinks.js"
        />
      </body>
    </html>
  );
}
