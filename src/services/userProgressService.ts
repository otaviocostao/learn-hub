// src/
import {
  collection,
  doc,
  setDoc, // Usado para criar ou sobrescrever um documento com um ID específico
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  getDocs,
  serverTimestamp,
  Timestamp,
  arrayUnion,
  arrayRemove,
  DocumentReference,
  runTransaction, // Para lidar com o campo de referência do curso
} from 'firebase/firestore';
import { db } from './firebase_config';
import { UserProgress } from '../types/userProgress'; // Ajuste o caminho se UserProgress estiver em outro lugar
import { Course } from '../types/course'; // Para dados denormalizados do curso
import { getCourseById } from './course_service'; // Para buscar detalhes do curso

const USERS_COLLECTION = 'users';
const USER_PROGRESS_SUBCOLLECTION = 'userProgress'; // Ou o nome exato da sua subcoleção

/**
 * Cria ou atualiza o registro de progresso de um usuário para um curso específico.
 * Usado quando um usuário se inscreve em um curso ou o acessa pela primeira vez.
 * O ID do documento na subcoleção userProgress será o courseId.
 * @param userId - O UID do usuário.
 * @param courseId - O ID do curso.
 * @param initialProgressData - Dados opcionais para iniciar o progresso.
 */
export const setUserCourseProgress = async (
  userId: string,
  courseId: string,
  initialProgressData?: Partial<Omit<UserProgress, 'enrolled_at' | 'last_updated_at' | 'course_id'>>
): Promise<void> => {
  if (!userId || !courseId) {
    throw new Error('UID do usuário e ID do curso são necessários.');
  }
  try {
    const progressDocRef = doc(db, USERS_COLLECTION, userId, USER_PROGRESS_SUBCOLLECTION, courseId);
    
    // Buscar dados do curso para denormalização (opcional, mas útil)
    let courseDetails: Pick<Course, 'title' | 'image_url'> | null = null;
    try {
        const course = await getCourseById(courseId);
        if (course) {
            courseDetails = { title: course.title, image_url: course.image_url };
        }
    } catch (courseError) {
        console.warn(`Não foi possível buscar detalhes do curso ${courseId} para denormalização:`, courseError);
    }

    const dataToSet: UserProgress = {
      course_id: courseId, // Armazena o ID do curso como string
      // course_ref: doc(db, 'course', courseId), // Se você quiser armazenar a DocumentReference
      completed_lesson_ids: initialProgressData?.completed_lesson_ids || [],
      progress_percentage: initialProgressData?.progress_percentage || 0,
      last_accessed_lesson_id: initialProgressData?.last_accessed_lesson_id || undefined,
      enrolled_time: initialProgressData?.enrolled_time || serverTimestamp() as Timestamp, // Se não fornecido, usa agora
      last_updated_at: serverTimestamp() as Timestamp,
      courseTitle: initialProgressData?.courseTitle || courseDetails?.title,
      image_url: initialProgressData?.image_url || courseDetails?.image_url,
    };

    // Usamos setDoc porque o ID do documento (courseId) é conhecido.
    // merge: true pode ser útil se você quiser apenas atualizar campos específicos
    // sem sobrescrever outros que possam ter sido definidos por Cloud Functions, por exemplo.
    // Mas para criar/substituir, setDoc sem merge é mais direto.
    await setDoc(progressDocRef, dataToSet);
    console.log(`Progresso para o curso ${courseId} definido/atualizado para o usuário ${userId}.`);
  } catch (error) {
    console.error('Erro ao definir/atualizar progresso do curso:', error);
    throw error;
  }
};

/**
 * Obtém o progresso de um usuário para um curso específico.
 * @param userId - O UID do usuário.
 * @param courseId - O ID do curso.
 * @returns O objeto UserProgress ou null se não encontrado.
 */
export const getUserCourseProgress = async (
  userId: string,
  courseId: string
): Promise<UserProgress | null> => {
  if (!userId || !courseId) {
    console.warn('UID do usuário e ID do curso não fornecidos para getUserCourseProgress.');
    return null;
  }
  try {
    const progressDocRef = doc(db, USERS_COLLECTION, userId, USER_PROGRESS_SUBCOLLECTION, courseId);
    const docSnap = await getDoc(progressDocRef);

    if (docSnap.exists()) {
      // Mapear nomes de campos do Firestore para a interface, se necessário
      const data = docSnap.data();
      return {
        // id: docSnap.id, // O ID do documento é o courseId
        course_id: data.course_id || courseId, // Garante que o course_id string esteja lá
        // Se você armazenou course_id como DocumentReference:
        // course_id: (data.course_id as DocumentReference)?.id || courseId,
        completed_lesson_ids: data.completed_lesson_ids || [],
        last_accessed_lesson_id: data.last_accessed_lesson_id,
        progress_percentage: data.progress_percentage || 0,
        enrolled_time: data.enrolled_time || data['enrolled-at'], // Mapeia 'enrolled-at' se for o nome no DB
        last_updated_at: data.last_updated_at || data['last-updated-at'], // Mapeia 'last-updated-at'
        courseTitle: data.courseTitle,
        image_url: data.image_url,
      } as UserProgress;
    } else {
      console.log(`Nenhum progresso encontrado para o curso ${courseId} do usuário ${userId}.`);
      return null;
    }
  } catch (error) {
    console.error('Erro ao buscar progresso do curso:', error);
    throw error;
  }
};

/**
 * Obtém todos os registros de progresso de um usuário (todos os cursos em que está inscrito/progredindo).
 * @param userId - O UID do usuário.
 * @returns Um array de objetos UserProgress.
 */
export const getAllUserProgress = async (userId: string): Promise<UserProgress[]> => {
  if (!userId) {
    console.warn('UID do usuário não fornecido para getAllUserProgress.');
    return [];
  }
  try {
    const progressCollectionRef = collection(db, USERS_COLLECTION, userId, USER_PROGRESS_SUBCOLLECTION);
    // Você pode querer ordenar aqui, ex: por last_updated_at
    // const q = query(progressCollectionRef, orderBy('last_updated_at', 'desc'));
    const querySnapshot = await getDocs(progressCollectionRef); // ou getDocs(q)

    const progresses: UserProgress[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      progresses.push({
        course_id: data.course_id || docSnap.id, // O ID do documento é o courseId
        completed_lesson_ids: data.completed_lesson_ids || [],
        last_accessed_lesson_id: data.last_accessed_lesson_id,
        progress_percentage: data.progress_percentage || 0,
        enrolled_time: data.enrolled_time || data['enrolled-at'],
        last_updated_at: data.last_updated_at || data['last-updated-at'],
        courseTitle: data.courseTitle,
        image_url: data.image_url,
      } as UserProgress);
    });
    return progresses;
  } catch (error) {
    console.error('Erro ao buscar todos os progressos do usuário:', error);
    throw error;
  }
};

/**
 * Atualiza campos específicos do progresso de um usuário em um curso.
 * @param userId - O UID do usuário.
 * @param courseId - O ID do curso.
 * @param updates - Um objeto com os campos a serem atualizados.
 */
export const updateUserCourseProgress = async (
  userId: string,
  courseId: string,
  updates: Partial<Omit<UserProgress, 'enrolled_at' | 'course_id'>> // Não atualizamos enrolled_at nem course_id aqui
): Promise<void> => {
  if (!userId || !courseId) {
    throw new Error('UID do usuário e ID do curso são necessários para atualizar o progresso.');
  }
  try {
    const progressDocRef = doc(db, USERS_COLLECTION, userId, USER_PROGRESS_SUBCOLLECTION, courseId);
    
    // Prepara os updates para o Firestore, mapeando nomes se necessário
    const firestoreUpdates: any = { ...updates, last_updated_at: serverTimestamp() };
    if (updates.last_updated_at) delete firestoreUpdates.lastUpdatedAt; // Evita enviar undefined
    if (updates.enrolled_time) delete firestoreUpdates.enrolledAt;
    // Adicione mapeamentos para snake_case se seus campos no Firestore usarem isso
    // Ex: if (updates.lastAccessedLessonId) firestoreUpdates['last_accessed_lesson_id'] = updates.lastAccessedLessonId;

    await updateDoc(progressDocRef, firestoreUpdates);
    console.log(`Progresso para o curso ${courseId} atualizado para o usuário ${userId}.`);
  } catch (error) {
    console.error('Erro ao atualizar progresso do curso:', error);
    throw error;
  }
};

/**
 * Adiciona um ID de aula à lista de aulas completas.
 * @param userId - O UID do usuário.
 * @param courseId - O ID do curso.
 * @param lessonId - O ID da aula a ser marcada como completa.
 * @param totalLessonsInCourse - O número total de aulas no curso (para calcular porcentagem).
 */
export const markLessonAsComplete = async (
  userId: string,
  courseId: string,
  lessonId: string,
  totalLessonsInCourse: number
): Promise<void> => {
  if (!userId || !courseId || !lessonId) {
    throw new Error('UID do usuário, ID do curso e ID da aula são necessários.');
  }
  try {
    const progressDocRef = doc(db, USERS_COLLECTION, userId, USER_PROGRESS_SUBCOLLECTION, courseId);

    // Usar transação para garantir atomicidade ao ler e escrever
    await runTransaction(db, async (transaction) => {
        const progressDoc = await transaction.get(progressDocRef);
        let completedLessons: string[] = [];
        if (progressDoc.exists()) {
            completedLessons = progressDoc.data().completed_lesson_ids || [];
        }

        // Adiciona lessonId apenas se não estiver já presente
        if (!completedLessons.includes(lessonId)) {
            completedLessons.push(lessonId);
        }

        const newProgressPercentage = totalLessonsInCourse > 0 
            ? Math.round((completedLessons.length / totalLessonsInCourse) * 100) 
            : 0;
        
        const updates = {
            completed_lesson_ids: completedLessons, // Firestore lida com arrayUnion implicitamente em set/update com array
            progress_percentage: newProgressPercentage,
            last_accessed_lesson_id: lessonId, // Atualiza a última aula acessada
            last_updated_at: serverTimestamp(),
        };

        if (progressDoc.exists()) {
            transaction.update(progressDocRef, updates);
        } else {
            // Se o progresso não existe, cria-o (pode acontecer se o usuário pular direto para uma aula)
            // Busca dados do curso para denormalização
            let courseDetails: Pick<Course, 'title' | 'image_url'> | null = null;
            try {
                const course = await getCourseById(courseId); // Esta chamada é fora da transação, idealmente os dados do curso já seriam conhecidos
                if (course) courseDetails = { title: course.title, image_url: course.image_url };
            } catch (e) { console.warn("Não foi possível buscar curso para denormalizar em markLessonAsComplete") }

            transaction.set(progressDocRef, {
                course_id: courseId,
                enrolled_at: serverTimestamp(),
                courseTitle: courseDetails?.title,
                image_url: courseDetails?.image_url,
                ...updates
            });
        }
    });

    console.log(`Aula ${lessonId} do curso ${courseId} marcada como completa para o usuário ${userId}.`);
  } catch (error) {
    console.error('Erro ao marcar aula como completa:', error);
    throw error;
  }
};

/**
 * Remove um ID de aula da lista de aulas completas.
 * @param userId - O UID do usuário.
 * @param courseId - O ID do curso.
 * @param lessonId - O ID da aula a ser marcada como incompleta.
 * @param totalLessonsInCourse - O número total de aulas no curso.
 */
export const markLessonAsIncomplete = async (
  userId: string,
  courseId: string,
  lessonId: string,
  totalLessonsInCourse: number
): Promise<void> => {
  if (!userId || !courseId || !lessonId) {
    throw new Error('UID do usuário, ID do curso e ID da aula são necessários.');
  }
  try {
    const progressDocRef = doc(db, USERS_COLLECTION, userId, USER_PROGRESS_SUBCOLLECTION, courseId);
    
    const progressDocSnap = await getDoc(progressDocRef);
    if (!progressDocSnap.exists()) {
        console.warn(`Nenhum progresso encontrado para desmarcar a aula ${lessonId} do curso ${courseId} para o usuário ${userId}.`);
        return; // Ou criar um registro de progresso com 0%? Depende da lógica.
    }

    const currentCompletedLessons: string[] = progressDocSnap.data().completed_lesson_ids || [];
    const updatedCompletedLessons = currentCompletedLessons.filter(id => id !== lessonId);

    const newProgressPercentage = totalLessonsInCourse > 0 
        ? Math.round((updatedCompletedLessons.length / totalLessonsInCourse) * 100) 
        : 0;

    await updateDoc(progressDocRef, {
      completed_lesson_ids: arrayRemove(lessonId), // Remove a aula específica
      progress_percentage: newProgressPercentage,
      last_updated_at: serverTimestamp(),
    });
    console.log(`Aula ${lessonId} do curso ${courseId} marcada como incompleta para o usuário ${userId}.`);
  } catch (error) {
    console.error('Erro ao marcar aula como incompleta:', error);
    throw error;
  }
};


/**
 * Deleta o registro de progresso de um usuário para um curso específico.
 * Usado quando um usuário "desinscreve-se" de um curso.
 * @param userId - O UID do usuário.
 * @param courseId - O ID do curso.
 */
export const deleteUserCourseProgress = async (
  userId: string,
  courseId: string
): Promise<void> => {
  if (!userId || !courseId) {
    throw new Error('UID do usuário e ID do curso são necessários para deletar o progresso.');
  }
  try {
    const progressDocRef = doc(db, USERS_COLLECTION, userId, USER_PROGRESS_SUBCOLLECTION, courseId);
    await deleteDoc(progressDocRef);
    console.log(`Progresso para o curso ${courseId} deletado para o usuário ${userId}.`);
  } catch (error) {
    console.error('Erro ao deletar progresso do curso:', error);
    throw error;
  }
};

export type { UserProgress };
