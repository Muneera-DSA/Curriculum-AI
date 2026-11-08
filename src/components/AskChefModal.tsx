import React, { useState, useEffect } from 'react';
import { X, Sparkles, Send, ChefHat, MessageSquare } from 'lucide-react';

interface AskChefModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialItem?: string;
}

export const AskChefModal: React.FC<AskChefModalProps> = ({
  isOpen,
  onClose,
  initialItem = '',
}) => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialItem) {
      setQuestion(`How do I keep ${initialItem} fresh or revive it?`);
      fetchChefTip(initialItem);
    } else {
      setResponse(null);
    }
  }, [initialItem, isOpen]);

  const fetchChefTip = async (itemOrQuery: string) => {
    setLoading(true);
    setResponse(null);
    try {
      const res = await fetch('/api/chef-tip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredient: itemOrQuery, question: itemOrQuery }),
      });
      const data = await res.json();
      setResponse(data.tip || 'Keep chilled and check freshness prior to cooking.');
    } catch (err) {
      setResponse('Store in cool dry conditions or freeze for later usage to eliminate food waste.');
    } finally {
      setLoading(false);
    }
  };

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    fetchChefTip(question);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-lg w-full p-5 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
              <ChefHat className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-stone-900 dark:text-white">
                ChefSave Preservation &amp; Substitution Advice
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Quick culinary answers for ingredient longevity
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input */}
        <form onSubmit={handleAsk} className="mb-4">
          <div className="relative">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. Can I freeze cheddar cheese? or substitute oil for butter?"
              className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 outline-none"
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="absolute right-2 top-2 p-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white disabled:opacity-40 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Answer Box */}
        {loading ? (
          <div className="py-8 flex flex-col items-center justify-center gap-2 text-stone-500">
            <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-medium">ChefSave is formulating the best preservation advice...</span>
          </div>
        ) : response ? (
          <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-stone-800 dark:text-stone-200 text-xs sm:text-sm leading-relaxed space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300 text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Chef Recommendation:
            </div>
            <p>{response}</p>
          </div>
        ) : (
          <div className="text-center py-6 text-stone-400 text-xs">
            Ask any question about how to salvage expiring ingredients, substitutes, or freezing techniques.
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
