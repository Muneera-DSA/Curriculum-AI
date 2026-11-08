import React from 'react';
import { CourseOverview, CurriculumModule } from '../types/curriculum';
import { BookOpen, Calendar, Layers, Award, FileText } from 'lucide-react';

interface CourseOverviewCardProps {
  overview: CourseOverview;
  curriculum: CurriculumModule[];
}

export const CourseOverviewCard: React.FC<CourseOverviewCardProps> = ({
  overview,
  curriculum,
}) => {
  const totalPapers = curriculum.reduce(
    (acc, m) => acc + m.resources.research_papers.length,
    0
  );
  const totalBooks = curriculum.reduce(
    (acc, m) => acc + m.resources.textbooks_and_pdfs.length,
    0
  );
  const totalMedia = curriculum.reduce(
    (acc, m) => acc + m.resources.audio_visual_and_podcasts.length,
    0
  );

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="max-w-4xl space-y-4">
        {/* Unboxed Metadata Line (§1.A Zero-Pill Discipline) */}
        <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
            {overview.target_level} Level
          </span>
          <span aria-hidden="true">·</span>
          <span>{overview.estimated_completion_time_weeks} Weeks Estimated</span>
          <span aria-hidden="true">·</span>
          <span>{curriculum.length} Modular Progression Stages</span>
          <span aria-hidden="true">·</span>
          <span>{totalPapers} Seminal Papers</span>
          <span aria-hidden="true">·</span>
          <span>{totalBooks} Textbooks &amp; PDFs</span>
        </div>

        {/* Course Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          {overview.topic}
        </h1>

        {/* Instructional Summary */}
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          {overview.summary}
        </p>

        {/* 4-Tier Progression Strip */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {curriculum.map((mod) => (
              <div
                key={mod.module_number}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80"
              >
                <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 mb-0.5">
                  Tier 0{mod.module_number}
                </div>
                <div className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-1">
                  {mod.module_title.split(':')[0]}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  {mod.core_concepts.length} core concepts · 1 lab
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
