import { Timestamp } from 'firebase/firestore'; // Importar Timestamp do Firestore

export interface UserProfile {
  uid: string; // Corresponde ao ID do documento, que é o Firebase Auth UID
  name: string;
  email: string; // Deve ser único e gerenciado pelo Firebase Auth
  roles: string[]; // Ex: ['user', 'admin']
  actual_course_id?: string[]; // ID dos cursos em que o usuário está inscrito
  createdAt: Timestamp;
}