export interface CourseOverview {
  topic: string;
  target_level: 'Beginner' | 'Intermediate' | 'Advanced';
  estimated_completion_time_weeks: number;
  summary: string;
}

export interface TextbookResource {
  title: string;
  author_or_institution: string;
  type: 'Open-access PDF' | 'Textbook' | 'Manual' | string;
  search_query: string;
}

export interface ResearchPaperResource {
  title: string;
  authors: string;
  venue_or_journal: string;
  search_query: string;
}

export interface WebContentResource {
  platform_or_site: string;
  content_description: string;
  search_query: string;
}

export interface AudioVisualResource {
  title_or_channel: string;
  media_type: 'YouTube Lecture Series' | 'Podcast Episode' | 'Conference Talk' | string;
  search_query: string;
}

export interface ModuleResources {
  textbooks_and_pdfs: TextbookResource[];
  research_papers: ResearchPaperResource[];
  web_content: WebContentResource[];
  audio_visual_and_podcasts: AudioVisualResource[];
}

export interface CurriculumModule {
  module_number: number;
  module_title: string;
  learning_objectives: string[];
  core_concepts: string[];
  resources: ModuleResources;
  practical_milestone_project: string;
}

export interface CurriculumAIResponse {
  course_overview: CourseOverview;
  curriculum: CurriculumModule[];
}

export interface UserCurriculumRequest {
  topic: string;
  target_level: 'Beginner' | 'Intermediate' | 'Advanced';
  goal?: string;
  additional_notes?: string;
}
