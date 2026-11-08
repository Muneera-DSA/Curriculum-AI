import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  Plus,
  X,
  Sparkles,
  SlidersHorizontal,
  RotateCcw,
  Clock,
  UtensilsCrossed,
  Info,
} from 'lucide-react';
import { UserConstraints } from '../types/chefsave';

interface InventoryInputProps {
  onAnalyze: (
    itemsText: string,
    imageBase64: string | null,
    imageMimeType: string | null,
    constraints: UserConstraints
  ) => void;
  isLoading: boolean;
}

export const SAMPLE_ITEMS = `- 1 bag of spinach (wilted)
- 3 eggs
- 1/2 block of cheddar cheese
- 1 tomato
- White bread`;

const QUICK_ADD_SUGGESTIONS = [
  'Half an avocado (browning)',
  '1/4 carton heavy cream',
  '2 scallions / green onions',
  '1/2 cup cooked jasmine rice',
  '1 soft bell pepper',
  'Handful of cilantro stems',
];

export const InventoryInput: React.FC<InventoryInputProps> = ({
  onAnalyze,
  isLoading,
}) => {
  const [itemsText, setItemsText] = useState<string>(SAMPLE_ITEMS);
  const [dietary, setDietary] = useState<string>('Vegetarian');
  const [maxCookingTime, setMaxCookingTime] = useState<number>(20);
  const [recipeCount, setRecipeCount] = useState<number>(2);
  const [notes, setNotes] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImagePreview(result);
      setImageMimeType(file.type);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageMimeType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addQuickItem = (item: string) => {
    setItemsText((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return `- ${item}`;
      return `${trimmed}\n- ${item}`;
    });
  };

  const handleResetSample = () => {
    setItemsText(SAMPLE_ITEMS);
    setDietary('Vegetarian');
    setMaxCookingTime(20);
    setRecipeCount(2);
    setNotes('');
    removeImage();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemsText.trim() && !imagePreview) {
      alert('Please provide food items in text or upload a photo of your fridge.');
      return;
    }
    onAnalyze(itemsText, imagePreview, imageMimeType, {
      dietary,
      maxCookingTime,
      recipeCount,
      notes,
    });
  };

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100 dark:border-stone-800">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <span>Fridge & Pantry Inventory Input</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-medium">
                Photo or Text
              </span>
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Enter ingredients or snap your crisper drawer. ChefSave prioritizes expiring items first.
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetSample}
            className="self-start sm:self-auto text-xs text-stone-600 dark:text-stone-400 hover:text-emerald-700 dark:hover:text-emerald-400 flex items-center gap-1 font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Sample Input</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Inventory Text & Quick Chips (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                  <span>Current Food Items & Conditions</span>
                  <span className="text-stone-400 font-normal">(one per line or bulleted)</span>
                </label>
                <span className="text-[11px] text-stone-400">
                  e.g. state condition like &quot;(wilted)&quot;
                </span>
              </div>
              <textarea
                value={itemsText}
                onChange={(e) => setItemsText(e.target.value)}
                placeholder="- 1 bag of spinach (wilted)&#10;- 3 eggs&#10;- 1/2 block of cheddar cheese&#10;- 1 tomato&#10;- White bread"
                rows={5}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-white text-xs sm:text-sm font-mono focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition-all outline-none resize-y"
              />
            </div>

            {/* Quick Add Perishables */}
            <div>
              <div className="text-[11px] font-medium text-stone-500 dark:text-stone-400 mb-1.5 flex items-center gap-1">
                <Plus className="w-3 h-3" /> Quick Add Common Expiring Items:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_ADD_SUGGESTIONS.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => addQuickItem(item)}
                    className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs transition-colors flex items-center gap-1"
                  >
                    <span>+</span> {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Photo Upload & Image drop (5 cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5 mb-1.5">
              <Camera className="w-3.5 h-3.5 text-emerald-600" />
              <span>Or Upload Fridge / Counter Photo</span>
              <span className="text-stone-400 font-normal">(Optional)</span>
            </label>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {imagePreview ? (
              <div className="relative rounded-xl overflow-hidden border border-emerald-300 dark:border-emerald-700 bg-stone-900 h-44 flex items-center justify-center group">
                <img
                  src={imagePreview}
                  alt="Fridge items preview"
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-600 text-white shadow-md hover:bg-rose-700 transition-colors"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px]">
                  Visual scan attached
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 min-h-[140px] rounded-xl border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-emerald-500 dark:hover:border-emerald-500 bg-stone-50/50 dark:bg-stone-800/40 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Click to browse or drop fridge photo
                </p>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Gemini 3.8 Flash automatically detects food items &amp; wilt levels
                </p>
              </div>
            )}
          </div>
        </div>

        {/* User Constraints & Cooking Options */}
        <div className="pt-3 border-t border-stone-100 dark:border-stone-800">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2.5 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500" />
            Cooking Constraints &amp; Goals
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Dietary Preference */}
            <div>
              <label className="text-xs font-medium text-stone-700 dark:text-stone-300 block mb-1.5">
                Dietary Preference
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {['Vegetarian', 'Vegan', 'Gluten-Free', 'Omnivore'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setDietary(option)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                      dietary === option
                        ? 'bg-emerald-700 text-white shadow-sm'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Cooking Time */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-stone-700 dark:text-stone-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-stone-500" /> Max Cooking Time
                </label>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  {maxCookingTime} minutes
                </span>
              </div>
              <div className="flex gap-1.5">
                {[10, 15, 20, 30].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setMaxCookingTime(mins)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      maxCookingTime === mins
                        ? 'bg-emerald-700 text-white shadow-sm'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-stone-400 mt-1">
                Rule: Keep instructions under 30m active time.
              </p>
            </div>

            {/* Recipe Options Goal */}
            <div>
              <label className="text-xs font-medium text-stone-700 dark:text-stone-300 block mb-1.5">
                Suggested Meals Goal
              </label>
              <div className="flex gap-1.5">
                {[1, 2, 3].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setRecipeCount(count)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      recipeCount === count
                        ? 'bg-emerald-700 text-white shadow-sm'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                    }`}
                  >
                    {count} {count === 1 ? 'Option' : 'Options'}
                  </button>
                ))}
              </div>
              <div className="mt-1 flex items-center gap-1 text-[11px] text-stone-400">
                <Info className="w-3 h-3 text-emerald-600" />
                <span>Pantry staples assumed available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm sm:text-base shadow-md shadow-emerald-700/20 hover:shadow-emerald-700/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-[0.99]"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>ChefSave Engine Analyzing Shelf Life &amp; Recipes...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-emerald-200" />
                <span>Run ChefSave Analysis &amp; Generate Fast Waste-Reduction Recipes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
