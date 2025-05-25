export interface Lesson {
  id: string; // ID do documento da aula
  course_id: string; // ID do curso pai (para referência, embora já esteja no path)
  title: string;
  description?: string;
  order: number; // Adicionando 'order' para ordenar as aulas
  model: 'video' | 'ebook';
  instructor?: string; // Pode ser herdado do curso ou específico da aula
  category?: string;   // Pode ser herdado do curso
  duration_minutes?: number;
  youtube_video_id?: string; // Se model for 'video'
  ebook_url?: string;       // Se model for 'ebook'
}