import { Timestamp, DocumentReference } from 'firebase/firestore';

export interface UserProgress {

  course_id: string; 
  completed_lesson_ids: string[];
  last_accessed_lesson_id?: string;
  progress_percentage: number; 
  enrolled_time: Timestamp; 
  last_updated_at: Timestamp; 
  courseTitle?: string;
  image_url?: string;
}