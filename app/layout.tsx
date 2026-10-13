import type { Metadata } from 'next';
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
  title: 'DermaDupe Lab | Skincare Dupe & Ingredient Match Engine',
  description: 'Find verified chemical dupes for luxury skincare products with weighted INCI cosmetic matching.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://dermadupe.com'),
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
      </body>
    </html>
  );
}
