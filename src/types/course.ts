
import { Timestamp, DocumentReference } from 'firebase/firestore';

// Interface para os dados de um Curso
export interface Course {
  id: string; // ID do documento do curso
  title: string;
  description: string;
  instructorName?: string; // Adicionando para consistência com o que discutimos antes
  category?: string;       // Adicionando para consistência
  image_url?: string;  // Renomeado de image_url para clareza
  hours?: number;          // Duração total estimada
  lesson_count?: number;   // Contagem de aulas (denormalizado)
  rating?: number;         // Avaliação média do curso
  students?: number;       // Número de estudantes inscritos (pode ser complexo de manter em tempo real)
  published?: boolean;     // Adicionando para controlar visibilidade
  createdAt: Timestamp;
  updatedAt?: Timestamp;   // Adicionando para rastrear atualizações
  tags?: string[];         // Adicionando para busca/filtragem
  // lessons?: Lesson[]; // Aulas geralmente são uma subcoleção, não um array no documento do curso
}