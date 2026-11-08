import React, { useState } from 'react';
import { CurriculumModule } from '../types/curriculum';
import { ResourceSection } from './ResourceSection';
import {
  CheckCircle2,
  Circle,
  Code,
  Terminal,
  Target,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ModuleCardProps {
  module: CurriculumModule;
  isCompleted: boolean;
  onToggleComplete: (moduleNum: number) => void;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  isCompleted,
  onToggleComplete,
}) => {
  const [completedObjectives, setCompletedObjectives] = useState<
    Record<number, boolean>
  >({});
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleObjective = (idx: number) => {
    setCompletedObjectives((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const completedCount = Object.values(completedObjectives).filter(Boolean).length;
  const totalCount = module.learning_objectives.length;

  return (
    <section
      id={`module-${module.module_number}`}
      className={`bg-white dark:bg-slate-900 border rounded-2xl overflow-hidden transition-all duration-200 ${
        isCompleted
          ? 'border-emerald-300 dark:border-emerald-800 shadow-sm'
          : 'border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      {/* Module Header */}
      <div className="p-6 sm:p-7 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            {/* Unboxed Metadata Line */}
            <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">
              <span>Tier {String(module.module_number).padStart(2, '0')}</span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-slate-500 dark:text-slate-400 font-medium normal-case">
                {completedCount} of {totalCount} objectives achieved
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {module.module_title}
            </h3>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              onClick={() => onToggleComplete(module.module_number)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isCompleted
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Module Mastered</span>
                </>
              ) : (
                <>
                  <Circle className="w-3.5 h-3.5 text-slate-400" />
                  <span>Mark as Completed</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
              title={isExpanded ? 'Collapse section' : 'Expand section'}
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Core Theoretical Concepts (§1.A Zero-Pill Unboxed Text with Separators) */}
        <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
          <span className="font-semibold text-slate-900 dark:text-white shrink-0">
            Core Concepts:
          </span>
          {module.core_concepts.map((concept, idx) => (
            <React.Fragment key={idx}>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {concept}
              </span>
              {idx < module.core_concepts.length - 1 && (
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">
                  /
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {isExpanded && (
        <div className="p-6 sm:p-7 space-y-7">
          {/* Learning Objectives Checklist */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Instructional Milestones &amp; Learning Objectives</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {module.learning_objectives.map((obj, idx) => {
                const checked = !!completedObjectives[idx];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleObjective(idx)}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border text-left text-xs sm:text-sm leading-relaxed transition-all ${
                      checked
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200'
                        : 'bg-slate-50/50 dark:bg-slate-850/40 border-slate-200/70 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div className="shrink-0 mt-0.5">
                      {checked ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <span className={checked ? 'line-through opacity-80' : ''}>
                      {obj}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Curated Named Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Curated Primary Sources &amp; Search Vectors</span>
            </h4>

            <ResourceSection resources={module.resources} />
          </div>

          {/* Practical Milestone Project */}
          <div className="rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/60 via-slate-50/40 to-white dark:from-indigo-950/30 dark:via-slate-900 dark:to-slate-900 p-5 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Tier Milestone Project: Practical Autonomous System Lab</span>
              </h4>
              <span className="text-[11px] font-medium text-indigo-700 dark:text-indigo-400">
                Hands-on Engineering
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-mono bg-white/70 dark:bg-slate-950/70 p-3.5 rounded-lg border border-indigo-100 dark:border-indigo-950">
              {module.practical_milestone_project}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
