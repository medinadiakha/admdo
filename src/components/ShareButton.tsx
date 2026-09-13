import React, { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';

interface ShareButtonProps {
  pageTitle: string;
  pagePath: string; // e.g., 'accueil', 'actualites', 'sections/forage-solaire'
  label?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'pill';
  size?: 'sm' | 'md';
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  pageTitle,
  pagePath,
  label = 'Partager ce lien',
  variant = 'secondary',
  size = 'md',
}) => {
  const [copied, setCopied] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const getFullShareUrl = () => {
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const hash = pagePath.startsWith('#') ? pagePath : `#${pagePath}`;
    return `${origin}${pathname}${hash}`;
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = getFullShareUrl();

    // Check if navigator.share is supported
    if (navigator.share) {
      try {
        await navigator.share({
          title: `ADMDO - ${pageTitle}`,
          text: `Consultez cette page officielle de l'ADMDO (Medina Diakha Wouly) : ${pageTitle}`,
          url: url,
        });
        setFeedbackMessage('Lien partagé !');
        setTimeout(() => setFeedbackMessage(null), 3000);
        return;
      } catch (err: any) {
        // Fallback to clipboard if share was cancelled or denied
        if (err.name === 'AbortError') return;
      }
    }

    // Fallback: Clipboard API
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        // Old fallback
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      setCopied(true);
      setFeedbackMessage('Lien copié dans le presse-papier !');
      setTimeout(() => {
        setCopied(false);
        setFeedbackMessage(null), 3000;
      }, 3000);
    } catch (error) {
      console.error('Impossible de copier le lien:', error);
      setFeedbackMessage('Lien : ' + url);
    }
  };

  const baseClasses =
    'inline-flex items-center gap-1.5 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 rounded-lg cursor-pointer select-none';

  const sizeClasses =
    size === 'sm'
      ? 'text-xs px-2.5 py-1.5'
      : 'text-sm px-3.5 py-2';

  const variantClasses = {
    primary:
      'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow active:scale-95',
    secondary:
      'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 hover:border-slate-300 active:scale-95',
    ghost:
      'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 active:scale-95',
    pill:
      'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full px-3 py-1 text-xs',
  }[variant];

  return (
    <div className="relative inline-block">
      <button
        type="button"
        id={`share-btn-${pagePath.replace(/[^a-zA-Z0-9_-]/g, '-')}`}
        onClick={handleShare}
        className={`${baseClasses} ${sizeClasses} ${variantClasses}`}
        title={`Partager le lien officiel de : ${pageTitle}`}
        aria-label={`Partager le lien officiel de : ${pageTitle}`}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-emerald-600 animate-in zoom-in-75 duration-150" />
            <span className="font-semibold text-emerald-700">Lien copié !</span>
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4" />
            <span>{label}</span>
          </>
        )}
      </button>

      {/* Floating notification tooltip */}
      {feedbackMessage && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900 text-white text-xs rounded-md shadow-lg whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 duration-150 flex items-center gap-1.5 pointer-events-none">
          <Copy className="w-3.5 h-3.5 text-emerald-400" />
          <span>{feedbackMessage}</span>
        </div>
      )}
    </div>
  );
};
