import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TopicQueryBar } from './components/TopicQueryBar';
import { CourseOverviewCard } from './components/CourseOverviewCard';
import { ModuleCard } from './components/ModuleCard';
import { JsonModal } from './components/JsonModal';
import { ExportModal } from './components/ExportModal';
import {
  CurriculumAIResponse,
  UserCurriculumRequest,
} from './types/curriculum';
import {
  GraduationCap,
  BookOpen,
  Code2,
  Download,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export default function App() {
  const [data, setData] = useState<CurriculumAIResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [completedModules, setCompletedModules] = useState<
    Record<number, boolean>
  >({});

  // Modals state
  const [isJsonOpen, setIsJsonOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Initial load: Fetch or set baseline curriculum for Deep RL for Autonomous Systems
  useEffect(() => {
    handleGenerate({
      topic: 'Deep Reinforcement Learning for Autonomous Systems',
      target_level: 'Intermediate',
      goal: 'Generate a complete course syllabus covering math foundations, algorithms, key research papers (e.g., PPO, DQN), open-source web docs, and top YouTube/podcast explanations.',
    });
  }, []);

  const handleGenerate = async (request: UserCurriculumRequest) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/generate-curriculum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      const resJson = await response.json();

      if (resJson.success && resJson.data) {
        setData(resJson.data);
      }
    } catch (err: any) {
      console.error('Failed to generate curriculum:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleComplete = (moduleNum: number) => {
    setCompletedModules((prev) => ({
      ...prev,
      [moduleNum]: !prev[moduleNum],
    }));
  };

  const scrollToModule = (moduleNum: number) => {
    const el = document.getElementById(`module-${moduleNum}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const completedCount = Object.values(completedModules).filter(Boolean).length;
  const totalModules = data?.curriculum.length || 4;
  const progressPercent = Math.round((completedCount / totalModules) * 100);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Bar Contract (§2) */}
      <Header
        onOpenJson={() => setIsJsonOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onScrollToModule={scrollToModule}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Specification & Search Bar */}
        <TopicQueryBar
          onGenerate={handleGenerate}
          isLoading={isLoading}
          currentTopic={data?.course_overview.topic || ''}
        />

        {data && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Course Overview Card */}
            <CourseOverviewCard
              overview={data.course_overview}
              curriculum={data.curriculum}
            />

            {/* Study Progress Indicator */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                  {progressPercent}%
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Course Progression
                  </div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">
                    {completedCount} of {totalModules} modules mastered
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsExportOpen(true)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Syllabus</span>
                </button>

                <button
                  onClick={() => setIsJsonOpen(true)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Inspect JSON Schema</span>
                </button>
              </div>
            </div>

            {/* 4-Tier Modules Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Four-Tier Academic Roadmap
                </h2>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Foundations → Intermediate → Advanced → Practical Application
                </span>
              </div>

              {data.curriculum.map((module) => (
                <ModuleCard
                  key={module.module_number}
                  module={module}
                  isCompleted={!!completedModules[module.module_number]}
                  onToggleComplete={handleToggleComplete}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              CurriculumAI
            </span>
            <span>·</span>
            <span>Academic Course Designer &amp; Learning Architect</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <button
              onClick={() => setIsJsonOpen(true)}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Strict Schema JSON
            </button>
            <button
              onClick={() => setIsExportOpen(true)}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Markdown Export
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <JsonModal
        isOpen={isJsonOpen}
        onClose={() => setIsJsonOpen(false)}
        data={data}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        data={data}
      />
    </div>
  );
}
