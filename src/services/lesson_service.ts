// src/services/lesson_service.ts

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  runTransaction,
  WriteBatch, // Para deletar todas as aulas de um curso se necessário
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase_config';
import { Lesson } from '../types/lesson'; // Assumindo que você moveu a interface para cá
// Se a interface Lesson ainda estiver em '../types/course.ts', ajuste o import.

const COURSES_COLLECTION = 'course'; // Nome da coleção pai (singular, como corrigimos)
const LESSONS_SUBCOLLECTION = 'lesson'; // Nome da subcoleção de aulas (singular, como você indicou)

/**
 * Cria uma nova aula para um curso específico.
 * Atualiza lesson_count no documento do curso pai.
 * @param courseId - O ID do curso ao qual a aula pertence.
 * @param lessonData - Dados da aula a ser criada (sem id, course_id).
 * @returns O ID da aula criada.
 */
export const createLesson = async (
  courseId: string,
  lessonData: Omit<Lesson, 'id' | 'course_id'>
): Promise<string> => {
  if (!courseId) {
    throw new Error('ID do curso é necessário para criar uma aula.');
  }
  try {
    const courseRef = doc(db, COURSES_COLLECTION, courseId);
    const lessonsCollectionRef = collection(courseRef, LESSONS_SUBCOLLECTION);
    
    const lessonPayload = {
      ...lessonData,
      course_id: courseId, // Adiciona a referência ao ID do curso
      // createdAt: serverTimestamp(), // Opcional: se quiser rastrear criação da aula
    };

    // Usar uma transação para adicionar a aula e atualizar a contagem no curso
    const lessonId = await runTransaction(db, async (transaction) => {
      const courseDoc = await transaction.get(courseRef);
      if (!courseDoc.exists()) {
        throw new Error(`Curso com ID ${courseId} não encontrado para adicionar aula!`);
      }
      const currentLessonCount = courseDoc.data().lesson_count || 0;
      
      const newLessonRef = doc(lessonsCollectionRef); // Gera um novo ID de documento para a aula
      transaction.set(newLessonRef, lessonPayload);
      transaction.update(courseRef, { 
        lesson_count: currentLessonCount + 1, 
        updatedAt: serverTimestamp() // Atualiza o curso também
      });
      
      return newLessonRef.id;
    });
    
    console.log(`Aula criada com ID: ${lessonId} para o curso ${courseId}`);
    return lessonId;
  } catch (error) {
    console.error(`Erro ao criar aula para o curso ${courseId}: `, error);
    throw error;
  }
};

/**
 * Obtém todas as aulas de um curso específico, ordenadas por 'order'.
 * @param courseId - O ID do curso.
 * @returns Um array de objetos Lesson.
 */
export const getLessonsByCourseId = async (courseId: string): Promise<Lesson[]> => {
  if (!courseId) {
    console.warn('ID do curso não fornecido para getLessonsByCourseId.');
    return [];
  }
  try {
    const lessonsQuery = query(
      collection(db, COURSES_COLLECTION, courseId, LESSONS_SUBCOLLECTION),
      orderBy('order', 'asc') // Ordena as aulas pela propriedade 'order'
    );
    const querySnapshot = await getDocs(lessonsQuery);
    const lessons: Lesson[] = [];
    querySnapshot.forEach((doc) => {
      lessons.push({ id: doc.id, ...doc.data() } as Lesson);
    });
    return lessons;
  } catch (error) {
    console.error(`Erro ao buscar aulas do curso ${courseId}: `, error);
    throw error;
  }
};

/**
 * Obtém uma aula específica pelo seu ID e ID do curso.
 * @param courseId - O ID do curso.
 * @param lessonId - O ID da aula.
 * @returns O objeto Lesson ou null se não encontrado.
 */
export const getLessonById = async (courseId: string, lessonId: string): Promise<Lesson | null> => {
  if (!courseId || !lessonId) {
    console.warn('IDs do curso e da aula não fornecidos para getLessonById.');
    return null;
  }
  try {
    const lessonRef = doc(db, COURSES_COLLECTION, courseId, LESSONS_SUBCOLLECTION, lessonId);
    const docSnap = await getDoc(lessonRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Lesson;
    } else {
      console.log(`Nenhuma aula encontrada com o ID ${lessonId} no curso ${courseId}`);
      return null;
    }
  } catch (error) {
    console.error(`Erro ao buscar aula ${lessonId} do curso ${courseId}: `, error);
    throw error;
  }
};

/**
 * Atualiza uma aula existente.
 * @param courseId - O ID do curso.
 * @param lessonId - O ID da aula a ser atualizada.
 * @param updates - Um objeto com os campos a serem atualizados.
 */
export const updateLesson = async (
  courseId: string,
  lessonId: string,
  updates: Partial<Omit<Lesson, 'id' | 'course_id'>>
): Promise<void> => {
  if (!courseId || !lessonId) {
    throw new Error('IDs do curso e da aula são necessários para atualizar.');
  }
  try {
    const lessonRef = doc(db, COURSES_COLLECTION, courseId, LESSONS_SUBCOLLECTION, lessonId);
    await updateDoc(lessonRef, {
      ...updates,
      // updatedAt: serverTimestamp(), // Opcional: se quiser rastrear atualização da aula
    });
    // Também pode ser necessário atualizar o 'updatedAt' do curso pai
    const courseRef = doc(db, COURSES_COLLECTION, courseId);
    await updateDoc(courseRef, { updatedAt: serverTimestamp() });
    console.log(`Aula ${lessonId} do curso ${courseId} atualizada com sucesso.`);
  } catch (error) {
    console.error(`Erro ao atualizar aula ${lessonId} do curso ${courseId}: `, error);
    throw error;
  }
};

/**
 * Deleta uma aula específica.
 * Atualiza lesson_count no documento do curso pai.
 * @param courseId - O ID do curso.
 * @param lessonId - O ID da aula a ser deletada.
 */
export const deleteLesson = async (courseId: string, lessonId: string): Promise<void> => {
  if (!courseId || !lessonId) {
    throw new Error('IDs do curso e da aula são necessários para deletar.');
  }
  try {
    const courseRef = doc(db, COURSES_COLLECTION, courseId);
    const lessonRef = doc(courseRef, LESSONS_SUBCOLLECTION, lessonId); // Atalho para doc(db, COURSES_COLLECTION, courseId, LESSONS_SUBCOLLECTION, lessonId)

    await runTransaction(db, async (transaction) => {
      const courseDoc = await transaction.get(courseRef);
      if (!courseDoc.exists()) {
        throw new Error(`Curso com ID ${courseId} não encontrado para deletar aula!`);
      }
      const currentLessonCount = courseDoc.data().lesson_count || 0;
      
      transaction.delete(lessonRef);
      transaction.update(courseRef, { 
        lesson_count: Math.max(0, currentLessonCount - 1), // Garante que não seja negativo
        updatedAt: serverTimestamp() 
      });
    });
    console.log(`Aula ${lessonId} do curso ${courseId} deletada com sucesso.`);
  } catch (error) {
    console.error(`Erro ao deletar aula ${lessonId} do curso ${courseId}: `, error);
    throw error;
  }
};

/**
 * Deleta TODAS as aulas de um curso específico.
 * Não atualiza lesson_count aqui, pois geralmente é usado quando o curso inteiro está sendo deletado.
 * Se usado isoladamente, você precisaria atualizar lesson_count para 0 no curso.
 * @param courseId - O ID do curso cujas aulas serão deletadas.
 */
export const deleteAllLessonsForCourse = async (courseId: string): Promise<void> => {
  if (!courseId) {
    throw new Error('ID do curso é necessário para deletar todas as aulas.');
  }
  try {
    const lessonsSnapshot = await getDocs(collection(db, COURSES_COLLECTION, courseId, LESSONS_SUBCOLLECTION));
    if (lessonsSnapshot.empty) {
      console.log(`Nenhuma aula encontrada para deletar no curso ${courseId}.`);
      return;
    }

    const batch = writeBatch(db);
    lessonsSnapshot.forEach((lessonDoc) => {
      batch.delete(lessonDoc.ref);
    });
    await batch.commit();
    console.log(`Todas as aulas do curso ${courseId} deletadas com sucesso.`);
    // Considere atualizar o lesson_count do curso para 0 aqui se esta função for usada isoladamente.
    // await updateDoc(doc(db, COURSES_COLLECTION, courseId), { lesson_count: 0, updatedAt: serverTimestamp() });
  } catch (error) {
    console.error(`Erro ao deletar todas as aulas do curso ${courseId}: `, error);
    throw error;
  }
};

export type { Lesson };
