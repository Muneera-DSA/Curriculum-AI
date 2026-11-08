import React from 'react';
import { AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface SafetyAdvisoryProps {
  warnings: string[];
}

export const SafetyAdvisory: React.FC<SafetyAdvisoryProps> = ({ warnings }) => {
  if (!warnings || warnings.length === 0) return null;

  return (
    <div className="bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 rounded-2xl p-4 sm:p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 rounded-xl shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2 flex-wrap mb-1.5">
            <h3 className="font-semibold text-amber-950 dark:text-amber-100 text-sm sm:text-base flex items-center gap-2">
              Food Safety & Spoilage Inspection Advisory
            </h3>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-200/60 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Chef Verified Safe-Use Protocol
            </span>
          </div>

          <p className="text-xs text-amber-900/80 dark:text-amber-200/80 mb-3">
            ChefSave prioritized high-risk items below. Before cooking, perform a quick 5-second sensory check:
          </p>

          <ul className="space-y-2">
            {warnings.map((warning, idx) => (
              <li
                key={idx}
                className="text-xs sm:text-sm text-amber-900 dark:text-amber-200/90 bg-white/70 dark:bg-amber-900/20 p-2.5 rounded-xl border border-amber-200/60 dark:border-amber-850/60 flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
