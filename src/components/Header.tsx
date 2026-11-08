import React from 'react';
import { BookOpen, Code2, Download, GraduationCap } from 'lucide-react';

interface HeaderProps {
  onOpenJson: () => void;
  onOpenExport: () => void;
  onScrollToModule: (moduleNum: number) => void;
  activeModule?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenJson,
  onOpenExport,
  onScrollToModule,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
            CurriculumAI
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => onScrollToModule(1)}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap"
          >
            01. Foundations
          </button>
          <button
            onClick={() => onScrollToModule(2)}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap"
          >
            02. Intermediate
          </button>
          <button
            onClick={() => onScrollToModule(3)}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap"
          >
            03. Advanced
          </button>
          <button
            onClick={() => onScrollToModule(4)}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap"
          >
            04. Research &amp; Practice
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
            title="Export syllabus to Markdown or print"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Syllabus</span>
          </button>

          <button
            onClick={onOpenJson}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Inspect raw strict schema JSON"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Strict Schema JSON</span>
          </button>
        </div>
      </div>
    </header>
  );
};
