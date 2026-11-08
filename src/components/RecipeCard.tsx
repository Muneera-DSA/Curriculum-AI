import React, { useState } from 'react';
import {
  Clock,
  Flame,
  CheckSquare,
  Square,
  Volume2,
  VolumeX,
  ChefHat,
  Timer,
  Sparkles,
  Utensils,
  Share2,
  Check,
} from 'lucide-react';
import { Recipe } from '../types/chefsave';

interface RecipeCardProps {
  recipe: Recipe;
  recipeIndex: number;
  onStartTimer: (minutes: number, label: string) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  recipeIndex,
  onStartTimer,
}) => {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [checkedStaples, setCheckedStaples] = useState<Record<number, boolean>>({});
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);

  const totalTime = recipe.prep_time_minutes + recipe.cook_time_minutes;

  const toggleStep = (idx: number) => {
    setCompletedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleStaple = (idx: number) => {
    setCheckedStaples((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const speakInstructions = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToRead = `${recipe.recipe_name}. Prep time: ${recipe.prep_time_minutes} minutes. Cook time: ${recipe.cook_time_minutes} minutes. Expiring ingredients: ${recipe.expiring_ingredients_used.join(', ')}. Instructions: ${recipe.instructions.map((step, i) => `Step ${i + 1}: ${step}`).join('. ')}`;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Helper to extract minutes from step text, e.g., "cook for 3 minutes", "60 seconds", "1-2 minutes"
  const extractTimeFromStep = (text: string): number | null => {
    const secMatch = text.match(/(\d+)\s*(?:seconds|sec|s\b)/i);
    if (secMatch) return Math.ceil(parseInt(secMatch[1], 10) / 60);

    const rangeMatch = text.match(/(\d+)-(\d+)\s*(?:minutes|mins|min)/i);
    if (rangeMatch) return parseInt(rangeMatch[2], 10);

    const minMatch = text.match(/(\d+)\s*(?:minutes|mins|min)/i);
    if (minMatch) return parseInt(minMatch[1], 10);

    return null;
  };

  const copyRecipe = () => {
    const content = `=== ${recipe.recipe_name} ===
Total Time: ${totalTime} mins (Prep: ${recipe.prep_time_minutes}m, Cook: ${recipe.cook_time_minutes}m)

EXPIRING INGREDIENTS SAVED:
${recipe.expiring_ingredients_used.map((i) => `• ${i}`).join('\n')}

PANTRY STAPLES:
${recipe.additional_staples_needed.map((i) => `• ${i}`).join('\n')}

INSTRUCTIONS:
${recipe.instructions.map((step, i) => `${i + 1}. ${step}`).join('\n')}
`;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-950/50 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Recipe #{recipeIndex + 1} • Quick Waste Saver
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={speakInstructions}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
                isSpeaking
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-emerald-700/60 hover:bg-emerald-700 text-emerald-100'
              }`}
              title="Read recipe aloud (hands-free cooking)"
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" /> Stop Voice
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" /> Read Aloud
                </>
              )}
            </button>

            <button
              onClick={copyRecipe}
              className="p-1.5 rounded-lg text-xs font-medium bg-emerald-700/60 hover:bg-emerald-700 text-emerald-100 flex items-center gap-1 transition-colors"
              title="Copy recipe text"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
          {recipe.recipe_name}
        </h3>

        {/* Time badges */}
        <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-emerald-100/90 font-medium">
          <div className="flex items-center gap-1.5 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-600/40">
            <Clock className="w-3.5 h-3.5 text-emerald-300" />
            <span>Total: <strong>{totalTime} mins</strong></span>
          </div>
          <div className="flex items-center gap-1 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-600/40">
            <span>Prep: {recipe.prep_time_minutes}m</span>
            <span>•</span>
            <span>Cook: {recipe.cook_time_minutes}m</span>
          </div>
          <div className="text-emerald-200 text-xs flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-300" />
            <span>Fast stovetop</span>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Expiring Ingredients Saved */}
        <div className="bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/60 rounded-xl p-3.5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900 dark:text-rose-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              Expiring Ingredients Saved ({recipe.expiring_ingredients_used.length})
            </h4>
            <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-400">
              Zero Waste Target
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {recipe.expiring_ingredients_used.map((item, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-100 dark:bg-rose-900/60 text-rose-900 dark:text-rose-100 border border-rose-300/60 dark:border-rose-800 flex items-center gap-1"
              >
                <span>🌱</span> {item}
              </span>
            ))}
          </div>
        </div>

        {/* Pantry Staples Needed */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-stone-500" />
              Pantry Staples Needed
            </h4>
            <span className="text-[11px] text-stone-500">Tap to check off</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {recipe.additional_staples_needed.map((staple, idx) => {
              const isChecked = !!checkedStaples[idx];
              return (
                <button
                  key={idx}
                  onClick={() => toggleStaple(idx)}
                  className={`flex items-center gap-2 p-2 rounded-xl text-xs text-left transition-colors border ${
                    isChecked
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 line-through'
                      : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200/80 dark:border-stone-700/80 text-stone-800 dark:text-stone-200 hover:border-stone-300'
                  }`}
                >
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-stone-400 shrink-0" />
                  )}
                  <span className="leading-tight">{staple}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
              <ChefHat className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Cooking Instructions (Under {totalTime} min active)
            </h4>
            <span className="text-[11px] text-stone-500">
              {Object.values(completedSteps).filter(Boolean).length} / {recipe.instructions.length} done
            </span>
          </div>

          <div className="space-y-2.5">
            {recipe.instructions.map((step, idx) => {
              const isDone = !!completedSteps[idx];
              const stepTime = extractTimeFromStep(step);

              return (
                <div
                  key={idx}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                    isDone
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-900/60 opacity-80'
                      : 'bg-stone-50/50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800 hover:border-stone-300'
                  }`}
                >
                  <button
                    onClick={() => toggleStep(idx)}
                    className="mt-0.5 text-stone-400 hover:text-emerald-600 transition-colors shrink-0"
                    title={isDone ? 'Mark as incomplete' : 'Mark as completed'}
                  >
                    {isDone ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Square className="w-4 h-4 text-stone-400" />
                    )}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`text-xs sm:text-sm leading-relaxed ${
                          isDone
                            ? 'line-through text-stone-500 dark:text-stone-400'
                            : 'text-stone-800 dark:text-stone-200'
                        }`}
                      >
                        <strong className="font-semibold text-stone-900 dark:text-white mr-1.5">
                          Step {idx + 1}:
                        </strong>
                        {step}
                      </p>

                      {stepTime && (
                        <button
                          onClick={() =>
                            onStartTimer(stepTime, `${recipe.recipe_name.slice(0, 20)}... (Step ${idx + 1})`)
                          }
                          className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900 text-teal-700 dark:text-teal-300 text-[11px] font-semibold border border-teal-200 dark:border-teal-800 transition-all hover:scale-105"
                          title={`Start a ${stepTime} minute timer`}
                        >
                          <Timer className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                          <span>{stepTime}m Timer</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick timer helper */}
        <div className="pt-2 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 border-t border-stone-100 dark:border-stone-800">
          <span>Need a timer for the whole cook?</span>
          <button
            onClick={() => onStartTimer(recipe.cook_time_minutes, recipe.recipe_name)}
            className="font-medium text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <Timer className="w-3.5 h-3.5" /> Start {recipe.cook_time_minutes}m Cook Timer
          </button>
        </div>
      </div>
    </div>
  );
};
