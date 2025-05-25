// src/pages/LessonPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import LessonCard from '@/components/LessonCard';
import LessonPlayer from '@/components/LessonPlayer';
import EbookRenderer from '@/components/EbookRenderer';
import { getCourseById, Course } from '@/services/course_service';
import { getLessonsByCourseId, Lesson } from '@/services/lesson_service';
import { Button } from '@/components/ui/button'; // Para o botão de próxima aula
import { ArrowLeft } from 'lucide-react'; // Para botão de voltar

const LessonPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [ebookMarkdown, setEbookMarkdown] = useState<string | null>(null);

  const [loadingCourse, setLoadingCourse] = useState<boolean>(true);
  const [loadingLessons, setLoadingLessons] = useState<boolean>(true);
  const [loadingEbook, setLoadingEbook] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // Erro geral para curso/aulas
  const [ebookFetchError, setEbookFetchError] = useState<string | null>(null); // Erro específico do fetch do ebook

  useEffect(() => {
    if (!courseId) {
      setError("ID do curso não fornecido.");
      setLoadingCourse(false);
      setLoadingLessons(false);
      return;
    }

    const fetchCourseAndLessons = async () => {
      setLoadingCourse(true);
      setLoadingLessons(true);
      setError(null);
      try {
        const courseData = await getCourseById(courseId);
        if (!courseData) {
          throw new Error("Curso não encontrado.");
        }
        setCurrentCourse(courseData);
        setLoadingCourse(false);

        const courseLessons = await getLessonsByCourseId(courseId);
        setLessons(courseLessons);
        if (courseLessons.length > 0) {
          setCurrentLesson(courseLessons[0]); // Seleciona a primeira aula por padrão
        } else {
            setCurrentLesson(null); // Nenhuma aula, nenhum currentLesson
        }
      } catch (err) {
        console.error("Erro ao buscar curso ou aulas:", err);
        setError(err instanceof Error ? err.message : "Falha ao carregar dados do curso.");
      } finally {
        setLoadingCourse(false);
        setLoadingLessons(false);
      }
    };

    fetchCourseAndLessons();
  }, [courseId]);

  useEffect(() => {
    if (currentLesson && currentLesson.model === 'ebook' && currentLesson.ebook_url) {
      const fetchEbookContent = async () => {
        setLoadingEbook(true);
        setEbookMarkdown(null);
        setEbookFetchError(null);
        try {
          const response = await fetch(currentLesson.ebook_url); // ebookUrl já deve ser o caminho correto /markdown/...
          if (!response.ok) {
            throw new Error(`HTTP error ${response.status} ao buscar o e-book.`);
          }
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
      setEbookMarkdown(null);
      setEbookFetchError(null);
    }
  }, [currentLesson]);

  const handleLessonClick = (lesson: Lesson) => {
    setCurrentLesson(lesson);
  };

  const advanceToNextLesson = () => {
    if (!currentLesson || lessons.length === 0) return;
    const currentIndex = lessons.findIndex(l => l.id === currentLesson.id);
    if (currentIndex !== -1 && currentIndex < lessons.length - 1) {
      setCurrentLesson(lessons[currentIndex + 1]);
    } else {
      // TODO: Mostrar mensagem de conclusão do curso ou opção de voltar
      alert("Você concluiu todas as aulas deste curso!");
      navigate(`/my-courses`); // Ou para a página do curso
    }
  };

  const handleVideoEnd = () => advanceToNextLesson();
  const handleEbookComplete = () => advanceToNextLesson();

  const renderMainContent = () => {
    if (!currentLesson && !loadingLessons && lessons.length === 0) {
      return <div className="p-8 text-center text-xl min-h-[300px] flex items-center justify-center bg-black/20 rounded-lg">Nenhuma aula disponível para este curso.</div>;
    }
    if (!currentLesson && !loadingLessons && lessons.length > 0) {
        return <div className="p-8 text-center text-xl min-h-[300px] flex items-center justify-center bg-black/20 rounded-lg">Selecione uma aula da lista para começar.</div>;
    }
    if (!currentLesson) { // Pode ser o estado inicial enquanto as aulas carregam
         return <div className="p-8 text-center text-xl min-h-[300px] flex items-center justify-center bg-black/20 rounded-lg">Carregando aula...</div>;
    }


    if (currentLesson.model === 'video') {
      if (!currentLesson.youtube_video_id) {
        return <div className="p-8 text-center text-red-500">ID do vídeo não encontrado para esta aula.</div>;
      }
      return <LessonPlayer videoId={currentLesson.youtube_video_id} onVideoEnd={handleVideoEnd} />;
    }

    if (currentLesson.model === 'ebook') {
      if (loadingEbook) return <div className="p-8 text-center text-xl min-h-[300px] flex items-center justify-center">Carregando e-book...</div>;
      if (ebookFetchError) return <div className="p-8 text-center text-red-500 min-h-[300px] flex items-center justify-center">Erro: {ebookFetchError}</div>;
      if (ebookMarkdown) {
        return (
          <>
            <EbookRenderer markdownContent={ebookMarkdown} />
            <div className="mt-6 text-right">
              <Button onClick={handleEbookComplete}>
                Próxima Aula
              </Button>
            </div>
          </>
        );
      }
      return <div className="p-8 text-center text-xl min-h-[300px] flex items-center justify-center">Conteúdo do e-book indisponível ou URL inválida.</div>;
    }
    return <p className="p-8">Tipo de conteúdo desconhecido.</p>;
  };

  if (loadingCourse) {
    return <div className="flex items-center justify-center min-h-screen text-white"><p className="text-xl">Carregando informações do curso...</p></div>;
  }
  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500"><p className="text-xl">Erro: {error}</p></div>;
  }
  if (!currentCourse) {
    return <div className="flex items-center justify-center min-h-screen text-white"><p className="text-xl">Curso não encontrado.</p></div>;
  }

  return (
    <div className="animate-fade-in text-white p-4 md:p-6 lg:p-8">
      <div className="mb-6 md:mb-8">
        <RouterLink to="/my-courses" className="inline-flex items-center text-sm text-sky-400 hover:text-sky-300 mb-3 transition-colors">
          <ArrowLeft size={16} className="mr-1" />
          Voltar para Meus Cursos
        </RouterLink>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">{currentCourse.title}</h1>
        {currentLesson && <p className="text-white/70 text-sm">Aula: {currentLesson.order}. {currentLesson.title}</p>}
      </div>
      
      <section className='flex flex-col lg:flex-row w-full gap-6 lg:gap-8'>
        <main className='flex-grow lg:w-4/5 xl:w-5/6 box-border'>
          {renderMainContent()}
          {currentLesson && (
            <div className="mt-6 p-4 bg-black/20 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2 text-white">Sobre esta aula</h3>
              <p className="text-gray-300 text-sm prose prose-sm prose-invert max-w-none">
                {currentLesson.description ? (
                    <EbookRenderer markdownContent={currentLesson.description} /> // Se a descrição for markdown
                ) : (
                    "Nenhuma descrição adicional para esta aula."
                )}
              </p>
            </div>
          )}
        </main>

        <aside className='bg-black/20 rounded-lg shadow-md lg:w-1/3 xl:w-1/4 w-full box-border p-3 sm:p-4 flex flex-col max-h-[70vh] lg:max-h-[calc(100vh-180px)]'> {/* Ajuste max-h */}
          <div className="mb-3 sm:mb-4 flex-shrink-0">
            <h2 className="text-lg sm:text-xl font-semibold text-white">Aulas ({lessons.length})</h2>
          </div>  
          <div className="flex-1 min-h-0 overflow-y-auto space-y-2 custom-scrollbar p-2 pr-1">
            {loadingLessons ? (
              <p className="text-white/70 p-2">Carregando lista de aulas...</p>
            ) : lessons.length > 0 ? (
              lessons.map(lessonItem => (
                <LessonCard
                  key={lessonItem.id}
                  lesson={lessonItem}
                  onClick={handleLessonClick}
                  isActive={currentLesson?.id === lessonItem.id}
                  className="bg-white/5 border-transparent" // Adicione classes base aqui se necessário
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

export default LessonPage;