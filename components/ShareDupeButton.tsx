'use client';

import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';

interface ShareDupeButtonProps {
  productBrand: string;
  productName: string;
}

export function ShareDupeButton({ productBrand, productName }: ShareDupeButtonProps) {
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = `Found the best chemical dupe for ${productBrand} ${productName} on DermaDupe Atelier!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Best ${productBrand} ${productName} Dupe`,
          text: shareText,
          url,
        });
        return;
      } catch {
        // User cancelled or share failed, fallback to clipboard
      }
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setShowToast(true);
      setTimeout(() => {
        setCopied(false);
        setShowToast(false);
      }, 3000);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/80 bg-white/90 px-4 py-2 text-xs font-semibold text-[#3D2C37] shadow-2xs backdrop-blur-xs transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-800 dark:border-rose-900/60 dark:bg-[#1D131C] dark:text-[#E8D6E1] dark:hover:bg-rose-950/40"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
            <span className="text-rose-700 dark:text-rose-400 font-bold">Link Copied!</span>
          </>
        ) : (
          <>
            <Share2 className="h-3.5 w-3.5 text-rose-400" />
            <span>Share this Dupe</span>
          </>
        )}
      </button>

      {/* Floating Toast Notification */}
      {showToast && (
        <div className="absolute left-1/2 -top-12 z-50 -translate-x-1/2 whitespace-nowrap rounded-full border border-rose-200/30 bg-[#2A1D24] px-4 py-1.5 text-xs font-medium text-white shadow-xl dark:bg-white dark:text-[#2A1D24] animate-in fade-in slide-in-from-bottom-2">
          ✨ Dupe link copied to share!
        </div>
      )}
    </div>
  );
}
