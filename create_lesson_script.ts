import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { createLesson } from './src/services/lesson_service.js'; // .js extension needed for ES modules
import { firebaseConfig } from './src/services/firebase_config.js'; // .js extension needed for ES modules

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const run = async () => {
  const courseId = "4";
  const newLessonData = {
    title: "Como configurar uma impressora no Windows 11",
    description: "Configurar uma impressora no Windows 11 é uma tarefa relativamente simples, mas pode ser um pouco confusa para os iniciantes. Neste capítulo, vamos orientá-lo passo a passo sobre como configurar uma impressora no Windows 11, seja ela uma impressora local ou uma impressora de rede.",
    order: 4,
    model: "ebook",
    ebook_url: "public/markdown/aula_impressora.md",
  };

  try {
    console.log(`Attempting to create lesson for course ID: ${courseId}`);
    const newLessonId = await createLesson(courseId, newLessonData);
    console.log("Nova aula adicionada com sucesso! ID:", newLessonId);
  } catch (error) {
    console.error("Erro ao adicionar nova aula:", error);
  } finally {
    // It's generally not necessary to explicitly terminate a Node.js script
    // that uses Firebase SDK, as it manages its own connections.
    // However, if you encounter issues with the script hanging, you might
    // consider adding process.exit() or similar cleanup.
  }
};

run();
