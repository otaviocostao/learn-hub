import { Timestamp, DocumentReference } from 'firebase/firestore';

export interface UserProgress {
  // O ID do documento na subcoleção userProgress é o courseId
  // Não precisamos de um campo 'id' separado aqui se usarmos courseId como ID.
  // Se você preferir um ID auto-gerado para o doc de progresso e ter courseId como campo, ajuste.
  
  course_id: string; // ID do curso (pode ser redundante se for o ID do doc, mas bom para clareza)
  // Se course_id e user_id fossem referências no Firestore:
  // course_ref?: DocumentReference; // Referência ao documento do curso
  // user_ref?: DocumentReference;   // Referência ao documento do usuário

  completed_lesson_ids: string[]; // Array de IDs das aulas completas
  last_accessed_lesson_id?: string;
  progress_percentage: number; // De 0 a 100
  enrolled_time: Timestamp; // Nome consistente (camelCase)
  last_updated_at: Timestamp; // Nome consistente (camelCase)

  // Opcional: denormalizar alguns dados do curso para facilitar a exibição
  // em listas como "Meus Cursos" sem buscas extras.
  courseTitle?: string;
  courseCoverImageUrl?: string;
}