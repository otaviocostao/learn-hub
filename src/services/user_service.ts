import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  Timestamp,
  serverTimestamp, // Para createdAt e updatedAt automáticos
  arrayUnion,     // Para adicionar itens a um array
  arrayRemove,    // Para remover itens de um array
} from 'firebase/firestore';
import { db } from './firebase_config'; // Seu arquivo de configuração do Firebase
import { UserProfile } from '../types/user'; // Sua interface UserProfile

const USERS_COLLECTION = 'users';

/**
 * Cria ou atualiza um perfil de usuário no Firestore.
 * Normalmente chamado após o registro bem-sucedido do usuário no Firebase Auth.
 * @param uid - O UID do Firebase Authentication do usuário.
 * @param userData - Dados parciais ou completos do perfil do usuário.
 */
export const createUserProfile = async (
  uid: string,
  userData: {
    email: string;
    name: string;
    roles?: string[];
    enrolledCourseIds?: string[];
  }
): Promise<void> => {
  const userRef = doc(db, USERS_COLLECTION, uid);
  const profileData: Omit<UserProfile, 'uid' | 'createdAt'> & { createdAt: Timestamp | any } = {
    name: userData.name,
    email: userData.email,
    roles: userData.roles || ['user'], // Padrão para 'user' se não fornecido
    actual_course_id: userData.enrolledCourseIds || [],
    createdAt: serverTimestamp(), // O Firestore preencherá com o timestamp do servidor
  };

  try {
    // Usar setDoc com merge: true pode ser útil se você quiser atualizar
    // sem sobrescrever o documento inteiro, ou se o documento já existir.
    // Se for uma criação garantida, setDoc sem merge é ok.
    await setDoc(userRef, profileData);
    console.log('Perfil do usuário criado/atualizado com ID: ', uid);
  } catch (error) {
    console.error('Erro ao criar/atualizar perfil do usuário: ', error);
    throw error; // Re-throw para que o chamador possa tratar
  }
};

/**
 * Obtém o perfil de um usuário do Firestore.
 * @param uid - O UID do Firebase Authentication do usuário.
 * @returns O perfil do usuário ou null se não encontrado.
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  if (!uid) {
    console.warn('UID do usuário não fornecido para getUserProfile.');
    return null;
  }
  const userRef = doc(db, USERS_COLLECTION, uid);
  try {
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      // Adiciona o uid ao objeto retornado, pois ele é o ID do documento
      return { uid, ...docSnap.data() } as UserProfile;
    } else {
      console.log('Nenhum perfil de usuário encontrado para o UID:', uid);
      return null;
    }
  } catch (error) {
    console.error('Erro ao buscar perfil do usuário: ', error);
    throw error;
  }
};

/**
 * Atualiza campos específicos do perfil de um usuário.
 * @param uid - O UID do Firebase Authentication do usuário.
 * @param updates - Um objeto com os campos a serem atualizados.
 */
export const updateUserProfile = async (
  uid: string,
  updates: Partial<Omit<UserProfile, 'uid' | 'email' | 'createdAt'>> // Email e createdAt geralmente não são atualizados aqui
): Promise<void> => {
  if (!uid) {
    throw new Error('UID do usuário é necessário para atualizar o perfil.');
  }
  const userRef = doc(db, USERS_COLLECTION, uid);
  try {
    await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp() // Opcional: adicionar um campo updatedAt
    });
    console.log('Perfil do usuário atualizado com sucesso.');
  } catch (error) {
    console.error('Erro ao atualizar perfil do usuário: ', error);
    throw error;
  }
};

/**
 * Adiciona um ID de curso ao array enrolledCourseIds do usuário.
 * @param uid - O UID do usuário.
 * @param courseId - O ID do curso a ser adicionado.
 */
export const addUserToCourse = async (uid: string, courseId: string): Promise<void> => {
  if (!uid || !courseId) {
    throw new Error('UID do usuário e ID do curso são necessários.');
  }
  const userRef = doc(db, USERS_COLLECTION, uid);
  try {
    await updateDoc(userRef, {
      enrolledCourseIds: arrayUnion(courseId),
      updatedAt: serverTimestamp() // Opcional
    });
    console.log(`Curso ${courseId} adicionado para o usuário ${uid}.`);
  } catch (error) {
    console.error('Erro ao adicionar curso ao usuário: ', error);
    throw error;
  }
};

/**
 * Remove um ID de curso do array enrolledCourseIds do usuário.
 * @param uid - O UID do usuário.
 * @param courseId - O ID do curso a ser removido.
 */
export const removeUserFromCourse = async (uid: string, courseId: string): Promise<void> => {
  if (!uid || !courseId) {
    throw new Error('UID do usuário e ID do curso são necessários.');
  }
  const userRef = doc(db, USERS_COLLECTION, uid);
  try {
    await updateDoc(userRef, {
      enrolledCourseIds: arrayRemove(courseId),
      updatedAt: serverTimestamp() // Opcional
    });
    console.log(`Curso ${courseId} removido para o usuário ${uid}.`);
  } catch (error) {
    console.error('Erro ao remover curso do usuário: ', error);
    throw error;
  }
};

/**
 * Adiciona uma role ao usuário.
 * @param uid - O UID do usuário.
 * @param role - A role a ser adicionada (ex: 'admin').
 */
export const addUserRole = async (uid: string, role: string): Promise<void> => {
    if (!uid || !role) {
        throw new Error('UID do usuário e role são necessários.');
    }
    const userRef = doc(db, USERS_COLLECTION, uid);
    try {
        await updateDoc(userRef, {
            roles: arrayUnion(role.toLowerCase()), // Garante minúsculas para consistência
            updatedAt: serverTimestamp()
        });
        console.log(`Role '${role}' adicionada para o usuário ${uid}.`);
    } catch (error) {
        console.error('Erro ao adicionar role ao usuário: ', error);
        throw error;
    }
};

/**
 * Remove uma role do usuário.
 * @param uid - O UID do usuário.
 * @param role - A role a ser removida.
 */
export const removeUserRole = async (uid: string, role: string): Promise<void> => {
    if (!uid || !role) {
        throw new Error('UID do usuário e role são necessários.');
    }
    const userRef = doc(db, USERS_COLLECTION, uid);
    try {
        await updateDoc(userRef, {
            roles: arrayRemove(role.toLowerCase()),
            updatedAt: serverTimestamp()
        });
        console.log(`Role '${role}' removida para o usuário ${uid}.`);
    } catch (error) {
        console.error('Erro ao remover role do usuário: ', error);
        throw error;
    }
};