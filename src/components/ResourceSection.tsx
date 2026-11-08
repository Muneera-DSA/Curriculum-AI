import React, { useState } from 'react';
import { ModuleResources } from '../types/curriculum';
import {
  BookOpen,
  FileText,
  Globe,
  Tv,
  ExternalLink,
  Copy,
  Check,
  Search,
} from 'lucide-react';

interface ResourceSectionProps {
  resources: ModuleResources;
}

export const ResourceSection: React.FC<ResourceSectionProps> = ({ resources }) => {
  const [activeTab, setActiveTab] = useState<
    'papers' | 'books' | 'web' | 'media'
  >('papers');
  const [copiedQuery, setCopiedQuery] = useState<string | null>(null);

  const handleCopy = (query: string) => {
    navigator.clipboard.writeText(query);
    setCopiedQuery(query);
    setTimeout(() => setCopiedQuery(null), 2000);
  };

  const openScholarSearch = (query: string) => {
    const url = `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const openArxivSearch = (query: string) => {
    const url = `https://arxiv.org/search/?query=${encodeURIComponent(query)}&searchtype=all`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const openGoogleSearch = (query: string) => {
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const openYouTubeSearch = (query: string) => {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-4">
      {/* Segmented resource category selector (§1.A Functional Buttons) */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('papers')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'papers'
              ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Research Papers ({resources.research_papers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('books')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'books'
              ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Textbooks &amp; PDFs ({resources.textbooks_and_pdfs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('web')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'web'
              ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Web Docs ({resources.web_content.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('media')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'media'
              ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Tv className="w-3.5 h-3.5" />
          <span>Lectures &amp; Podcasts ({resources.audio_visual_and_podcasts.length})</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'papers' && (
        <div className="space-y-3">
          {resources.research_papers.map((paper, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {paper.title}
                  </h4>
                  {/* Unboxed metadata line */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    <span>{paper.authors}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                      {paper.venue_or_journal}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openScholarSearch(paper.search_query)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800 transition-colors"
                    title="Find on Google Scholar"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Google Scholar</span>
                  </button>

                  <button
                    onClick={() => openArxivSearch(paper.search_query)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
                    title="Find on arXiv"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>arXiv</span>
                  </button>
                </div>
              </div>

              {/* Exact Search Vector Box */}
              <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-300">
                <div className="truncate flex items-center gap-1.5">
                  <span className="text-slate-400 font-sans font-medium shrink-0">
                    Exact Vector:
                  </span>
                  <span className="select-all truncate">{paper.search_query}</span>
                </div>
                <button
                  onClick={() => handleCopy(paper.search_query)}
                  className="p-1 hover:text-indigo-600 dark:hover:text-indigo-400 shrink-0 text-slate-400 transition-colors"
                  title="Copy search query"
                >
                  {copiedQuery === paper.search_query ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'books' && (
        <div className="space-y-3">
          {resources.textbooks_and_pdfs.map((book, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {book.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    <span>{book.author_or_institution}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                      {book.type}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => openGoogleSearch(book.search_query)}
                  className="self-start sm:self-auto flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800 transition-colors shrink-0"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Find Book / PDF</span>
                </button>
              </div>

              <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-300">
                <div className="truncate flex items-center gap-1.5">
                  <span className="text-slate-400 font-sans font-medium shrink-0">
                    Exact Vector:
                  </span>
                  <span className="select-all truncate">{book.search_query}</span>
                </div>
                <button
                  onClick={() => handleCopy(book.search_query)}
                  className="p-1 hover:text-indigo-600 dark:hover:text-indigo-400 shrink-0 text-slate-400 transition-colors"
                >
                  {copiedQuery === book.search_query ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'web' && (
        <div className="space-y-3">
          {resources.web_content.map((web, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {web.platform_or_site}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {web.content_description}
                  </p>
                </div>

                <button
                  onClick={() => openGoogleSearch(web.search_query)}
                  className="self-start sm:self-auto flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800 transition-colors shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Guide</span>
                </button>
              </div>

              <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-300">
                <div className="truncate flex items-center gap-1.5">
                  <span className="text-slate-400 font-sans font-medium shrink-0">
                    Exact Vector:
                  </span>
                  <span className="select-all truncate">{web.search_query}</span>
                </div>
                <button
                  onClick={() => handleCopy(web.search_query)}
                  className="p-1 hover:text-indigo-600 dark:hover:text-indigo-400 shrink-0 text-slate-400 transition-colors"
                >
                  {copiedQuery === web.search_query ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'media' && (
        <div className="space-y-3">
          {resources.audio_visual_and_podcasts.map((media, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {media.title_or_channel}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                      {media.media_type}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => openYouTubeSearch(media.search_query)}
                  className="self-start sm:self-auto flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800 transition-colors shrink-0"
                >
                  <Tv className="w-3.5 h-3.5" />
                  <span>Watch on YouTube</span>
                </button>
              </div>

              <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-300">
                <div className="truncate flex items-center gap-1.5">
                  <span className="text-slate-400 font-sans font-medium shrink-0">
                    Exact Vector:
                  </span>
                  <span className="select-all truncate">{media.search_query}</span>
                </div>
                <button
                  onClick={() => handleCopy(media.search_query)}
                  className="p-1 hover:text-indigo-600 dark:hover:text-indigo-400 shrink-0 text-slate-400 transition-colors"
                >
                  {copiedQuery === media.search_query ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
