// src/services/course_service.ts

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
  writeBatch,
  runTransaction,
  DocumentReference, // Para tipar referências se necessário
} from 'firebase/firestore';
import { db } from './firebase_config'; // Seu arquivo de configuração do Firebase
import { Course} from '../types/course'; // Suas interfaces
import { Lesson} from '../types/lesson'; // Suas interfaces

const COURSES_COLLECTION = 'course';
const LESSONS_SUBCOLLECTION = 'lesson';

// --- Funções para Cursos ---

/**
 * Cria um novo curso.
 * @param courseData - Dados do curso a ser criado (sem o id).
 * @returns O ID do curso criado.
 */
export const createCourse = async (
  courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'lesson_count'>
): Promise<string> => {
  try {
    const coursePayload = {
      ...courseData,
      published: courseData.published !== undefined ? courseData.published : false, // Default para não publicado
      lesson_count: 0, // Inicializa a contagem de aulas
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, COURSES_COLLECTION), coursePayload);
    console.log('Curso criado com ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao criar curso: ', error);
    throw error;
  }
};

/**
 * Obtém todos os cursos (ou filtrados se 'publishedOnly' for true).
 * @param publishedOnly - Se true, retorna apenas cursos publicados.
 * @returns Um array de objetos Course.
 */
export const getAllCourses = async (publishedOnly: boolean = false): Promise<Course[]> => {
  try {
    console.log("TESTE: Buscando TODOS os cursos sem filtro 'published'...");
    // Remova temporariamente o filtro 'where'
    const coursesQuery = query(collection(db, COURSES_COLLECTION), orderBy('createdAt', 'desc'));
    
    const querySnapshot = await getDocs(coursesQuery);
    console.log("TESTE querySnapshot empty:", querySnapshot.empty);
    console.log("TESTE querySnapshot size:", querySnapshot.size);

    const courses: Course[] = [];
    querySnapshot.forEach((doc) => {
      console.log("TESTE Documento:", doc.id, "=>", doc.data());
      courses.push({ id: doc.id, ...doc.data() } as Course);
    });
    console.log("TESTE Cursos processados:", courses);
    return courses;
  } catch (error) {
    console.error('Erro no TESTE getAllCourses: ', error);
    throw error;
  }
};

/**
 * Obtém um curso específico pelo seu ID.
 * @param courseId - O ID do curso.
 * @returns O objeto Course ou null se não encontrado.
 */
export const getCourseById = async (courseId: string): Promise<Course | null> => {
  if (!courseId) {
    console.warn('ID do curso não fornecido para getCourseById.');
    return null;
  }
  try {
    const courseRef = doc(db, COURSES_COLLECTION, courseId);
    const docSnap = await getDoc(courseRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Course;
    } else {
      console.log('Nenhum curso encontrado com o ID:', courseId);
      return null;
    }
  } catch (error) {
    console.error('Erro ao buscar curso por ID: ', error);
    throw error;
  }
};

/**
 * Atualiza um curso existente.
 * @param courseId - O ID do curso a ser atualizado.
 * @param updates - Um objeto com os campos a serem atualizados.
 */
export const updateCourse = async (
  courseId: string,
  updates: Partial<Omit<Course, 'id' | 'createdAt'>>
): Promise<void> => {
  if (!courseId) {
    throw new Error('ID do curso é necessário para atualizar.');
  }
  try {
    const courseRef = doc(db, COURSES_COLLECTION, courseId);
    await updateDoc(courseRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    console.log('Curso atualizado com sucesso.');
  } catch (error) {
    console.error('Erro ao atualizar curso: ', error);
    throw error;
  }
};

/**
 * Deleta um curso e todas as suas aulas (usando batch write).
 * @param courseId - O ID do curso a ser deletado.
 */
export const deleteCourse = async (courseId: string): Promise<void> => {
  if (!courseId) {
    throw new Error('ID do curso é necessário para deletar.');
  }
  try {
    const batch = writeBatch(db);
    const courseRef = doc(db, COURSES_COLLECTION, courseId);

    // Deletar todas as aulas da subcoleção
    const lessonsSnapshot = await getDocs(collection(courseRef, LESSONS_SUBCOLLECTION));
    lessonsSnapshot.forEach((lessonDoc) => {
      batch.delete(lessonDoc.ref);
    });

    // Deletar o documento do curso
    batch.delete(courseRef);

    await batch.commit();
    console.log('Curso e suas aulas deletados com sucesso.');
  } catch (error) {
    console.error('Erro ao deletar curso: ', error);
    throw error;
  }
};


// --- Funções para Aulas (Lessons) ---

/**
 * Cria uma nova aula para um curso específico.
 * Atualiza lesson_count no documento do curso.
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
      // createdAt: serverTimestamp(), // Opcional para aulas
    };

    // Usar uma transação para adicionar a aula e atualizar a contagem no curso
    const lessonId = await runTransaction(db, async (transaction) => {
      const courseDoc = await transaction.get(courseRef);
      if (!courseDoc.exists()) {
        throw new Error("Curso não encontrado para adicionar aula!");
      }
      const currentLessonCount = courseDoc.data().lesson_count || 0;
      
      // Adiciona a nova aula e obtém sua referência (Firestore gera ID automaticamente se não fornecido no add)
      // Para obter o ID antes, poderíamos gerar um doc() sem dados e depois setar, mas addDoc é mais simples
      // e podemos pegar o ID depois se a transação for bem sucedida.
      // No entanto, para obter o ID dentro da transação para retornar, é melhor gerar um ref primeiro.
      const newLessonRef = doc(lessonsCollectionRef); // Gera um novo ID de documento
      transaction.set(newLessonRef, lessonPayload);
      transaction.update(courseRef, { lesson_count: currentLessonCount + 1, updatedAt: serverTimestamp() });
      
      return newLessonRef.id;
    });
    
    console.log(`Aula criada com ID: ${lessonId} para o curso ${courseId}`);
    return lessonId;
  } catch (error) {
    console.error('Erro ao criar aula: ', error);
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
    console.error('Erro ao buscar aulas do curso: ', error);
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
      console.log('Nenhuma aula encontrada com o ID:', lessonId);
      return null;
    }
  } catch (error) {
    console.error('Erro ao buscar aula por ID: ', error);
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
      // updatedAt: serverTimestamp(), // Opcional para aulas
    });
    console.log('Aula atualizada com sucesso.');
  } catch (error) {
    console.error('Erro ao atualizar aula: ', error);
    throw error;
  }
};

/**
 * Deleta uma aula específica.
 * Atualiza lesson_count no documento do curso.
 * @param courseId - O ID do curso.
 * @param lessonId - O ID da aula a ser deletada.
 */
export const deleteLesson = async (courseId: string, lessonId: string): Promise<void> => {
  if (!courseId || !lessonId) {
    throw new Error('IDs do curso e da aula são necessários para deletar.');
  }
  try {
    const courseRef = doc(db, COURSES_COLLECTION, courseId);
    const lessonRef = doc(courseRef, LESSONS_SUBCOLLECTION, lessonId);

    await runTransaction(db, async (transaction) => {
      const courseDoc = await transaction.get(courseRef);
      if (!courseDoc.exists()) {
        throw new Error("Curso não encontrado para deletar aula!");
      }
      const currentLessonCount = courseDoc.data().lesson_count || 0;
      
      transaction.delete(lessonRef);
      transaction.update(courseRef, { 
        lesson_count: Math.max(0, currentLessonCount - 1), // Garante que não seja negativo
        updatedAt: serverTimestamp() 
      });
    });
    console.log('Aula deletada com sucesso.');
  } catch (error) {
    console.error('Erro ao deletar aula: ', error);
    throw error;
  }
};

export type { Course };
