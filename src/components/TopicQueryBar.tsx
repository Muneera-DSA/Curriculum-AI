import React, { useState } from 'react';
import { Search, Sparkles, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { UserCurriculumRequest } from '../types/curriculum';

interface TopicQueryBarProps {
  onGenerate: (request: UserCurriculumRequest) => void;
  isLoading: boolean;
  currentTopic: string;
}

const PRESET_TOPICS = [
  {
    topic: 'Deep Reinforcement Learning for Autonomous Systems',
    level: 'Intermediate' as const,
    goal: 'Cover math foundations, algorithms, key research papers (e.g. PPO, DQN), open-source web docs, and top YouTube/podcast explanations.',
  },
  {
    topic: 'Vision-Language-Action Models for Mobile Robotics',
    level: 'Advanced' as const,
    goal: 'Spatial perception, diffusion policies, robotic transformer architectures, and real-world deployment.',
  },
  {
    topic: 'Distributed Systems & Consensus Protocols',
    level: 'Intermediate' as const,
    goal: 'Raft, Paxos, Byzantine fault tolerance, linearizability, and distributed database engineering.',
  },
  {
    topic: 'Quantum Information & Algorithmic Computing',
    level: 'Beginner' as const,
    goal: 'Qubit linear algebra, Shor and Grover algorithms, Qiskit implementations, and NISQ applications.',
  },
];

export const TopicQueryBar: React.FC<TopicQueryBarProps> = ({
  onGenerate,
  isLoading,
  currentTopic,
}) => {
  const [topic, setTopic] = useState('Deep Reinforcement Learning for Autonomous Systems');
  const [targetLevel, setTargetLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [goal, setGoal] = useState(
    'Generate a complete course syllabus covering math foundations, algorithms, key research papers (e.g., PPO, DQN), open-source web docs, and top YouTube/podcast explanations.'
  );
  const [isCustomizing, setIsCustomizing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onGenerate({
      topic: topic.trim(),
      target_level: targetLevel,
      goal: goal.trim(),
    });
  };

  const handleSelectPreset = (preset: typeof PRESET_TOPICS[0]) => {
    setTopic(preset.topic);
    setTargetLevel(preset.level);
    setGoal(preset.goal);
    onGenerate({
      topic: preset.topic,
      target_level: preset.level,
      goal: preset.goal,
    });
  };

  const handleResetDefault = () => {
    handleSelectPreset(PRESET_TOPICS[0]);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Curriculum Specification &amp; Academic Scope
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Define the academic field to construct a rigorous 4-tier instructional study plan.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCustomizing(!isCustomizing)}
              className="text-xs text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 font-medium transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{isCustomizing ? 'Hide Options' : 'Customize Goals'}</span>
            </button>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <button
              type="button"
              onClick={handleResetDefault}
              className="text-xs text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset DRL Topic</span>
            </button>
          </div>
        </div>

        {/* Input Bar */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Deep Reinforcement Learning for Autonomous Systems"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition-all font-medium"
            />
          </div>

          {/* Level Segmented Selector */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0">
            {(['Beginner', 'Intermediate', 'Advanced'] as const).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setTargetLevel(level)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  targetLevel === level
                    ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading || !topic.trim()}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 cursor-pointer active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Architecting Course...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Generate Course</span>
              </>
            )}
          </button>
        </div>

        {/* Extended customization drawer */}
        {isCustomizing && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
              Curriculum Focus &amp; Special Requirements:
            </label>
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              rows={2}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
              placeholder="Specify requirements, seminal papers to emphasize, or target practical projects."
            />
          </div>
        )}

        {/* Quick Presets */}
        <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
          <span className="text-slate-400 font-medium">Academic Presets:</span>
          {PRESET_TOPICS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className={`px-2.5 py-1 rounded-md text-xs transition-colors border ${
                currentTopic === preset.topic
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-semibold'
                  : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              {preset.topic.length > 32 ? `${preset.topic.slice(0, 30)}...` : preset.topic}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
};
