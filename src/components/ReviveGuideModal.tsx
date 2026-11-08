import React from 'react';
import { X, Leaf, CheckCircle2, AlertOctagon, HelpCircle } from 'lucide-react';

interface ReviveGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const REVIVE_GUIDES = [
  {
    item: 'Wilted Leafy Greens (Spinach, Kale, Herbs)',
    revive:
      'Submerge leaves in a bowl of ice-cold water for 10–15 minutes. Cell walls rehydrate via osmosis and regain crispness! Alternatively, saute directly with oil/garlic.',
    discard:
      'If leaves have turned slimy, darkened into black mush, or smell sour, do NOT eat—discard immediately.',
  },
  {
    item: 'Stale Bread',
    revive:
      'Spritz bread lightly with water and toast for 3–5 minutes at 350°F (175°C) or in a skillet with butter. Or turn into croutons, bread pudding, or savory French toast (eggy bread).',
    discard:
      'If you see ANY green, white, or black mold spores, discard the whole loaf; porous bread allows invisible fungal hyphae to penetrate.',
  },
  {
    item: 'Soft / Wrinkled Tomatoes',
    revive:
      'Soft tomatoes are actually at peak sweetness! Cook down into a quick skillet sauce, burst them with olive oil and pasta, or slice for a hot cheese melt.',
    discard:
      'Discard if skin has black mold spots, weeping rotten gashes, or fermented alcohol odor.',
  },
  {
    item: 'Hard Block Cheese (Cheddar, Parmesan)',
    revive:
      'Surface dryness or white calcium lactate crystals are completely natural and tasty.',
    discard:
      'If small surface mold appears on HARD block cheese, the USDA permits slicing 1 inch around and below the mold spot. For soft shredded cheese or cream cheese, discard entirely if moldy.',
  },
  {
    item: 'Eggs',
    revive:
      'Do the water float test: Place egg in a glass of water. If it sinks to the bottom flat, it is very fresh. If it stands on one end, it is older but safe to cook. If it floats, discard.',
    discard:
      'Discard if egg floats, or upon cracking smells sulfurous, or has pinkish/iridescent albumen.',
  },
];

export const ReviveGuideModal: React.FC<ReviveGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-100 dark:border-stone-800 bg-emerald-950 text-white">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-800 text-emerald-200">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">
                Revive or Toss? Household Food Rescue Guide
              </h3>
              <p className="text-xs text-emerald-200/80">
                Safe culinary practices to prevent domestic food waste
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-emerald-900 text-emerald-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-5 space-y-4">
          {REVIVE_GUIDES.map((guide, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/80 space-y-2.5"
            >
              <h4 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-1.5">
                <span>🥕</span> {guide.item}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-200">
                  <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Safe to Revive &amp; Cook:
                  </div>
                  <p className="leading-relaxed">{guide.revive}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-950 dark:text-rose-200">
                  <div className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1 mb-1">
                    <AlertOctagon className="w-3.5 h-3.5" />
                    When to Discard:
                  </div>
                  <p className="leading-relaxed">{guide.discard}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors"
          >
            Got it, thanks Chef!
          </button>
        </div>
      </div>
    </div>
  );
};
