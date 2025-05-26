// src/pages/LessonPage.tsx

import React, { useState, useEffect, useCallback } from 'react'; // Adicionado useCallback
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import LessonCard from '@/components/LessonCard';
import LessonPlayer from '@/components/LessonPlayer';
import EbookRenderer from '@/components/EbookRenderer';
import { getCourseById, Course } from '@/services/course_service';
import { getLessonsByCourseId } from '@/services/lesson_service';
import type { Lesson } from '@/services/lesson_service';
import { 
  getUserCourseProgress, 
  markLessonAsComplete, 
  UserProgress,
  setUserCourseProgress, // Para criar o progresso se não existir
  updateUserCourseProgress
} from '@/services/userProgressService'; // Importar UserProgress e as funções
import { useAuth } from '@/context/AuthContext'; // Para obter o usuário logado
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle } from 'lucide-react'; // Adicionado CheckCircle

const Lesson: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { currentUser } = useAuth(); // Obter usuário logado
  const navigate = useNavigate();

  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null); // Estado para progresso
  const [ebookMarkdown, setEbookMarkdown] = useState<string | null>(null);

  const [loadingCourse, setLoadingCourse] = useState<boolean>(true);
  const [loadingLessons, setLoadingLessons] = useState<boolean>(true);
  const [loadingProgress, setLoadingProgress] = useState<boolean>(true); // Estado de loading para progresso
  const [loadingEbook, setLoadingEbook] = useState<boolean>(false);
  const [markingComplete, setMarkingComplete] = useState(false); // Para o botão de próxima aula

  const [error, setError] = useState<string | null>(null);
  const [ebookFetchError, setEbookFetchError] = useState<string | null>(null);

  // Buscar curso e aulas
  useEffect(() => {
    if (!courseId) {
      setError("ID do curso não fornecido.");
      setLoadingCourse(false); setLoadingLessons(false);
      return;
    }

    const fetchCourseAndLessons = async () => {
      setLoadingCourse(true); setLoadingLessons(true); setError(null);
      try {
        const courseData = await getCourseById(courseId);
        if (!courseData) throw new Error("Curso não encontrado.");
        setCurrentCourse(courseData);
        
        const courseLessons = await getLessonsByCourseId(courseId);
        setLessons(courseLessons);
        if (courseLessons.length > 0) {
          // Lógica para definir a aula atual (primeira não concluída ou primeira da lista)
          // será feita após buscar o progresso.
        } else {
          setCurrentLesson(null);
        }
      } catch (err) {
        console.error("Erro ao buscar curso ou aulas:", err);
        setError(err instanceof Error ? err.message : "Falha ao carregar dados do curso.");
      } finally {
        setLoadingCourse(false); setLoadingLessons(false);
      }
    };
    fetchCourseAndLessons();
  }, [courseId]);

  // Buscar progresso do usuário e definir a aula atual
  useEffect(() => {
    if (!currentUser || !courseId || !currentCourse || lessons.length === 0) {
      // Se não há usuário, cursoId, detalhes do curso carregados ou aulas, não busca progresso
      // ou define a primeira aula se não houver usuário (visualização anônima?)
      if (lessons.length > 0 && !currentLesson) { // Define a primeira aula se ainda não foi definida
          setCurrentLesson(lessons[0]);
      }
      setLoadingProgress(false);
      return;
    }

    const fetchUserProgressAndSetInitialLesson = async () => {
      setLoadingProgress(true);
      try {
        let progressData = await getUserCourseProgress(currentUser.uid, courseId);
        
        // Se não houver progresso, cria um registro inicial
        if (!progressData) {
          console.log("Nenhum progresso encontrado, criando registro inicial...");
          await setUserCourseProgress(currentUser.uid, courseId, {
            completed_lesson_ids: [],
            progress_percentage: 0,
          });
          progressData = await getUserCourseProgress(currentUser.uid, courseId); // Busca novamente
        }
        setUserProgress(progressData);

        // Definir a aula atual:
        // 1. Última acessada (se tivermos essa informação)
        // 2. Ou a primeira aula não concluída
        // 3. Ou a primeira aula da lista
        if (progressData?.last_accessed_lesson_id) {
          const lastAccessed = lessons.find(l => l.id === progressData.last_accessed_lesson_id);
          if (lastAccessed) {
            setCurrentLesson(lastAccessed);
            return; // Sai mais cedo
          }
        }
        
        const firstUncompletedLesson = lessons.find(
          l => !progressData?.completed_lesson_ids?.includes(l.id)
        );
        setCurrentLesson(firstUncompletedLesson || lessons[0] || null);

      } catch (err) {
        console.error("Erro ao buscar ou inicializar progresso do usuário:", err);
        // Não define erro principal, pois a página ainda pode funcionar sem progresso
        if (lessons.length > 0 && !currentLesson) setCurrentLesson(lessons[0]); // Fallback
      } finally {
        setLoadingProgress(false);
      }
    };

    if (currentCourse && lessons.length > 0) { // Garante que temos curso e aulas antes de buscar progresso
        fetchUserProgressAndSetInitialLesson();
    }

  }, [currentUser, courseId, currentCourse, lessons]); // Adicionado lessons e currentCourse

  // Carregar e-book
  useEffect(() => {
    if (currentLesson && currentLesson.model === 'ebook' && currentLesson.ebook_url) {
      // ... (lógica de fetch do e-book como antes) ...
      const fetchEbookContent = async () => {
        setLoadingEbook(true); setEbookMarkdown(null); setEbookFetchError(null);
        try {
          const response = await fetch(currentLesson.ebook_url!);
          if (!response.ok) throw new Error(`HTTP error ${response.status}`);
          const markdownText = await response.text();
          setEbookMarkdown(markdownText);
        } catch (err) {
          console.error("Falha ao carregar e-book:", err);
          setEbookFetchError(err instanceof Error ? err.message : "Falha ao carregar conteúdo do e-book.");
        } finally {
          setLoadingEbook(false);
        }
      };
      fetchEbookContent();
    } else {
      setEbookMarkdown(null); setEbookFetchError(null);
    }
  }, [currentLesson]);

  const handleLessonClick = useCallback(async (lesson: Lesson) => {
    setCurrentLesson(lesson);
    // Atualizar last_accessed_lesson_id
    if (currentUser && courseId) {
      try {
        await updateUserCourseProgress(currentUser.uid, courseId, { 
          last_accessed_lesson_id: lesson.id 
        });
        // Atualizar o estado local do progresso se quiser refletir imediatamente (opcional)
        // setUserProgress(prev => prev ? {...prev, last_accessed_lesson_id: lesson.id} : null);
      } catch (error) {
        console.error("Erro ao atualizar última aula acessada:", error);
      }
    }
  }, [currentUser, courseId]);

  const handleMarkLessonCompleteAndAdvance = useCallback(async () => {
    if (!currentUser || !courseId || !currentLesson || !currentCourse || currentCourse.lesson_count === undefined) {
      console.warn("Não é possível marcar aula como completa: dados ausentes.");
      advanceToNextLesson(); // Tenta avançar mesmo assim se algo estiver faltando
      return;
    }
    
    setMarkingComplete(true);
    try {
      await markLessonAsComplete(currentUser.uid, courseId, currentLesson.id, currentCourse.lesson_count);
      const updatedProgress = await getUserCourseProgress(currentUser.uid, courseId); // Busca o progresso atualizado
      setUserProgress(updatedProgress);
      advanceToNextLesson();
    } catch (err) {
      console.error("Erro ao marcar aula como completa e avançar:", err);
      // Exibir erro para o usuário
      alert("Erro ao salvar seu progresso. Tente novamente.");
    } finally {
      setMarkingComplete(false);
    }
  }, [currentUser, courseId, currentLesson, currentCourse, lessons]); // 'lessons' para advanceToNextLesson

  const advanceToNextLesson = useCallback(() => {
    if (!currentLesson || lessons.length === 0) return;
    const currentIndex = lessons.findIndex(l => l.id === currentLesson.id);
    if (currentIndex !== -1 && currentIndex < lessons.length - 1) {
      const nextLesson = lessons[currentIndex + 1];
      handleLessonClick(nextLesson); // Usa handleLessonClick para também atualizar last_accessed
    } else {
      alert("Parabéns! Você concluiu todas as aulas deste curso!");
      navigate(`/curso/${courseId}`); // Volta para a página de detalhes do curso
    }
  }, [lessons, currentLesson, handleLessonClick, courseId, navigate]);


  const handleVideoEnd = () => {
    console.log(`Vídeo "${currentLesson?.title}" terminou.`);
    handleMarkLessonCompleteAndAdvance();
  };

  const handleEbookComplete = () => {
    console.log(`E-book "${currentLesson?.title}" marcado como concluído.`);
    handleMarkLessonCompleteAndAdvance();
  };

  const renderMainContent = () => {
    // ... (lógica de renderMainContent como antes, usando currentLesson.youtubeVideoId (camelCase)) ...
    // Certifique-se que currentLesson.youtubeVideoId está correto se antes era youtube_video_id
    if (loadingCourse || loadingLessons || loadingProgress && !currentLesson ) {
        return <div className="p-8 text-center text-xl min-h-[300px] flex items-center justify-center bg-black/20 rounded-lg">Carregando dados da aula...</div>;
    }
    // ... (resto da sua lógica de renderMainContent)
    // Ajuste para currentLesson.youtubeVideoId se você padronizou para camelCase na interface Lesson
    if (currentLesson?.model === 'video') {
      if (!currentLesson.youtube_video_id) { // Era youtube_video_id
        return <div className="p-8 text-center text-red-500">ID do vídeo não encontrado para esta aula.</div>;
      }
      return <LessonPlayer videoId={currentLesson.youtube_video_id} onVideoEnd={handleVideoEnd} />;
    }

    if (currentLesson?.model === 'ebook') {
      // ... (lógica do ebook como antes)
       if (loadingEbook) return <div className="p-8 text-center text-xl min-h-[300px] flex items-center justify-center">Carregando e-book...</div>;
      if (ebookFetchError) return <div className="p-8 text-center text-red-500 min-h-[300px] flex items-center justify-center">Erro: {ebookFetchError}</div>;
      if (ebookMarkdown) {
        return (
          <>
            <EbookRenderer markdownContent={ebookMarkdown} />
            <div className="mt-6 text-right">
              <Button onClick={handleEbookComplete} disabled={markingComplete}>
                {markingComplete ? "Salvando..." : "Próxima Aula"}
              </Button>
            </div>
          </>
        );
      }
      return <div className="p-8 text-center text-xl min-h-[300px] flex items-center justify-center">Conteúdo do e-book indisponível ou URL inválida.</div>;
    }
     if (!currentLesson && lessons.length === 0) {
      return <div className="p-8 text-center text-xl min-h-[300px] flex items-center justify-center bg-black/20 rounded-lg">Nenhuma aula disponível para este curso.</div>;
    }
    if (!currentLesson && lessons.length > 0) {
        return <div className="p-8 text-center text-xl min-h-[300px] flex items-center justify-center bg-black/20 rounded-lg">Selecione uma aula da lista para começar.</div>;
    }
    return <p className="p-8">Selecione uma aula ou tipo de conteúdo desconhecido.</p>;
  };

  // Estados de carregamento principais
  if (loadingCourse || (!currentCourse && !error)) {
    return <div className="flex items-center justify-center min-h-screen text-white"><p className="text-xl">Carregando informações do curso...</p></div>;
  }
  if (error) { // Erro ao carregar curso ou aulas
    return <div className="flex items-center justify-center min-h-screen text-red-500"><p className="text-xl">Erro: {error}</p></div>;
  }
  if (!currentCourse) { // Curso não encontrado após tentativa de carregamento
    return <div className="flex items-center justify-center min-h-screen text-white"><p className="text-xl">Curso não encontrado.</p></div>;
  }

  return (
    <div className="animate-fade-in text-white p-4 md:p-6 lg:p-8">
      <div className="mb-6 md:mb-8">
        <RouterLink to={currentUser ? "/my-courses" : "/discover"} className="inline-flex items-center text-sm text-sky-400 hover:text-sky-300 mb-3 transition-colors">
          <ArrowLeft size={16} className="mr-1" />
          {currentUser ? "Voltar para Meus Cursos" : "Ver outros cursos"}
        </RouterLink>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">{currentCourse.title}</h1>
        {currentLesson && <p className="text-white/70 text-sm">Aula: {currentLesson.order}. {currentLesson.title}</p>}
      </div>
      
      <section className='flex flex-col lg:flex-row w-full gap-6 lg:gap-8'>
        <main className='flex-grow lg:w-2/3 xl:w-3/4 box-border'> {/* Ajustei a proporção */}
          {renderMainContent()}
          {currentLesson && (
            <div className="mt-6 p-4 bg-black/20 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2 text-white">Sobre esta aula</h3>
              <div className="text-gray-300 text-sm prose prose-sm prose-invert max-w-none">
                {currentLesson.description ? (
                    <EbookRenderer markdownContent={currentLesson.description} />
                ) : (
                    "Nenhuma descrição adicional para esta aula."
                )}
              </div>
            </div>
          )}
        </main>

        <aside className='bg-black/20 rounded-lg shadow-md lg:w-1/3 xl:w-1/4 w-full box-border p-3 sm:p-4 flex flex-col max-h-[70vh] lg:max-h-[calc(100vh-180px)]'>
          <div className="mb-3 sm:mb-4 flex-shrink-0">
            <h2 className="text-lg sm:text-xl font-semibold text-white">Aulas ({lessons.length})</h2>
          </div>  
          <div className="flex-1 min-h-0 overflow-y-auto space-y-2 custom-scrollbar p-1"> {/* Removido pr-1 extra se custom-scrollbar já lida com isso */}
            {loadingLessons || loadingProgress ? ( // Mostra carregando se aulas ou progresso estiverem carregando
              <p className="text-white/70 p-2">Carregando lista de aulas...</p>
            ) : lessons.length > 0 ? (
              lessons.map(lessonItem => (
                <LessonCard
                  key={lessonItem.id}
                  lesson={lessonItem}
                  onClick={() => handleLessonClick(lessonItem)} // Simplificado
                  isActive={currentLesson?.id === lessonItem.id}
                  // Adiciona a prop isCompleted
                  isCompleted={!!userProgress?.completed_lesson_ids?.includes(lessonItem.id)}
                  className="bg-white/5 border-transparent"
                />
              ))
            ) : (
              <p className="text-white/70 text-center py-4">Nenhuma aula encontrada.</p>
            )}
          </div>
        </aside>
      </section>
    </div>
  );
};

export default Lesson;