import React, { useState } from 'react';
import {
  Clock,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Flame,
  Sparkles,
  ArrowDownUp,
  Tag,
} from 'lucide-react';
import { InventoryItem, SpoilageRisk } from '../types/chefsave';

interface InventoryRadarProps {
  items: InventoryItem[];
  onAskChef: (item: string) => void;
}

export const InventoryRadar: React.FC<InventoryRadarProps> = ({ items, onAskChef }) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'urgency' | 'name' | 'shelfLife'>('urgency');

  const categories = ['all', ...Array.from(new Set(items.map((i) => i.category)))];

  const getRiskBadge = (risk: SpoilageRisk) => {
    switch (risk?.toLowerCase()) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300/60 dark:border-rose-800">
            <Flame className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 animate-pulse" />
            High Risk (Cook ASAP)
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300/60 dark:border-amber-800">
            <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            Medium Risk (2-4 days)
          </span>
        );
      case 'low':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Low Risk (Stable)
          </span>
        );
    }
  };

  const getShelfLifeVisual = (days: number, risk: SpoilageRisk) => {
    // 0 to 14 days scale
    const percent = Math.min(100, Math.max(10, (days / 14) * 100));
    let barColor = 'bg-emerald-500';
    if (days <= 2 || risk === 'High') barColor = 'bg-rose-500';
    else if (days <= 5 || risk === 'Medium') barColor = 'bg-amber-500';

    return (
      <div className="w-full">
        <div className="flex justify-between items-center text-xs mb-1">
          <span className="text-stone-500 dark:text-stone-400 font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" /> Shelf Life:
          </span>
          <span className="font-semibold text-stone-800 dark:text-stone-200">
            {days <= 0 ? 'Today only' : days === 1 ? '1 day left' : `${days} days left`}
          </span>
        </div>
        <div className="w-full bg-stone-200 dark:bg-stone-700 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full ${barColor} transition-all duration-500 rounded-full`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    );
  };

  const filteredItems = items
    .filter((item) => filterCategory === 'all' || item.category === filterCategory)
    .sort((a, b) => {
      if (sortBy === 'urgency') {
        const riskOrder: Record<string, number> = { High: 0, Medium: 1, Low: 2 };
        const diff = (riskOrder[a.spoilage_risk] ?? 2) - (riskOrder[b.spoilage_risk] ?? 2);
        if (diff !== 0) return diff;
        return a.estimated_shelf_life_days - b.estimated_shelf_life_days;
      }
      if (sortBy === 'shelfLife') {
        return a.estimated_shelf_life_days - b.estimated_shelf_life_days;
      }
      return a.item_name.localeCompare(b.item_name);
    });

  const highRiskCount = items.filter((i) => i.spoilage_risk === 'High').length;

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-100 dark:border-stone-800">
        <div>
          <h2 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <span>Detected Food Inventory & Shelf-Life Radar</span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
              {items.length} items tracked
            </span>
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Ranked by expiration urgency to prevent household food waste
          </p>
        </div>

        {/* Filters and sorting */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400 bg-stone-50 dark:bg-stone-800/60 px-2 py-1 rounded-lg border border-stone-200/60 dark:border-stone-700/60">
            <ArrowDownUp className="w-3 h-3" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent border-none text-stone-800 dark:text-stone-200 font-medium focus:ring-0 cursor-pointer text-xs p-0 pr-1"
            >
              <option value="urgency" className="bg-white dark:bg-stone-800">
                Sort: Expiration Urgency
              </option>
              <option value="shelfLife" className="bg-white dark:bg-stone-800">
                Sort: Days Left
              </option>
              <option value="name" className="bg-white dark:bg-stone-800">
                Sort: Alphabetical
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      {categories.length > 2 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                filterCategory === cat
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-600 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700'
              }`}
            >
              {cat === 'all' ? 'All Items' : cat}
            </button>
          ))}
        </div>
      )}

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredItems.map((item, index) => {
          const isHigh = item.spoilage_risk === 'High';
          return (
            <div
              key={index}
              className={`relative rounded-xl p-3.5 border transition-all ${
                isHigh
                  ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60 shadow-sm ring-1 ring-rose-300/40'
                  : 'bg-stone-50/50 dark:bg-stone-850/50 border-stone-200 dark:border-stone-800 hover:border-stone-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="font-semibold text-stone-900 dark:text-white text-sm">
                      {item.item_name}
                    </h4>
                  </div>
                  <span className="inline-block mt-0.5 text-[11px] font-medium text-stone-500 dark:text-stone-400">
                    Category: {item.category}
                  </span>
                </div>
                <div className="shrink-0">{getRiskBadge(item.spoilage_risk)}</div>
              </div>

              {getShelfLifeVisual(item.estimated_shelf_life_days, item.spoilage_risk)}

              <div className="mt-3 pt-2.5 border-t border-stone-200/60 dark:border-stone-800/80 flex items-center justify-between">
                <span className="text-[11px] text-stone-500 dark:text-stone-400">
                  {isHigh ? '🚨 Prioritized in recipes' : 'Ready to use'}
                </span>
                <button
                  onClick={() => onAskChef(item.item_name)}
                  className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 flex items-center gap-1 hover:underline"
                >
                  <Sparkles className="w-3 h-3" />
                  Preservation tip
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
