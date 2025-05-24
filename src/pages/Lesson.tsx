import CourseCard from '../components/CourseCard';
import ProgressCircle from '../components/ProgressCircle';
import { ArrowRight } from 'lucide-react';
import LessonCard from '@/components/LessonCard';
import LessonPlayer from '@/components/LessonPlayer';

import { useState, useEffect } from 'react';
import EbookRenderer from '@/components/EbookRenderer';

// Interface para os dados da aula, incluindo o youtubeVideoId
export interface LessonData {
  id: string;
  title: string;
  model: 'video' | 'ebook';
  instructor: string;
  category: string;
  rating: number;
  progress?: number;
  students?: number;
  lessons?: number;
  youtubeVideoId?: string;
  ebookUrl?: string;
}


const discoverLesson: LessonData[] = [
  {
    id: '1',
    title: 'Introdução ao curso',
    model: 'video',
    instructor: 'Equipe LearnHub',
    category: 'Informática',
    rating: 0,
    progress: 5,
    students: 0,
    lessons: 0,
    youtubeVideoId: '3lNH264f8f4'
  },
  {
    id: '2',
    title: 'Área de trabalho do Windows 11',
    model: 'video',
    instructor: 'Equipe LearnHub',
    category: 'Informática',
    rating: 0,
    progress: 0,
    students: 0,
    lessons: 0,
    youtubeVideoId: 'jM4BzN4ci7E'
  },
  {
    id: '3',
    title: 'Menu iniciar do Windows 11',
    model: 'video',
    instructor: 'Equipe LearnHub',
    category: 'Informática',
    rating: 0,
    progress: 0,
    students: 0,
    lessons: 0,
    youtubeVideoId: '3JZ_D3ELwOQ'
  },
  {
    id: '4',
    title: 'Barra de tarefas do Windows 11',
    model: 'video',
    instructor: 'Equipe LearnHub',
    category: 'Windows',
    rating: 0,
    progress: 0,
    students: 0,
    lessons: 0,
    youtubeVideoId: 'VIDEO_ID_BARRA_TAREFAS' // Substitua pelo ID real
  },
  {
    id: '5',
    title: 'Configurações do Windows',
    model: 'video',
    instructor: 'Equipe LearnHub',
    category: 'Windows',
    rating: 0,
    progress: 0,
    students: 0,
    lessons: 0,
    youtubeVideoId: 'VIDEO_ID_CONFIGURACOES' // Substitua pelo ID real
  },
  {
    id: '6',
    title: 'Configurações do Windows',
    model: 'video',
    instructor: 'Equipe LearnHub',
    category: 'Windows',
    rating: 0,
    progress: 0,
    students: 0,
    lessons: 0,
    youtubeVideoId: 'VIDEO_ID_CONFIGURACOES' // Substitua pelo ID real
  },
  {
    id: '7',
    title: 'Usando o OneDrive no Windows 11',
    model: 'ebook',
    instructor: 'Equipe LearnHub',
    category: 'Windows',
    rating: 0,
    progress: 0,
    students: 0,
    lessons: 0,
    ebookUrl: '/public/markdown/aula_onedrive.md'
  },
];

const Lesson = () => {
const [currentLesson, setCurrentLesson] = useState<LessonData | null>(null);
  const [ebookMarkdown, setEbookMarkdown] = useState<string | null>(null);
  const [isLoadingEbook, setIsLoadingEbook] = useState<boolean>(false);
  const [ebookError, setEbookError] = useState<string | null>(null);

  // Efeito para carregar o conteúdo do e-book quando currentLesson mudar E for um e-book
  useEffect(() => {
    if (currentLesson && currentLesson.model === 'ebook' && currentLesson.ebookUrl) {
      const fetchEbookContent = async () => {
        setIsLoadingEbook(true);
        setEbookMarkdown(null); // Limpa conteúdo anterior
        setEbookError(null);    // Limpa erro anterior
        try {
          const response = await fetch(currentLesson.ebookUrl!); // O '!' assume que ebookUrl estará presente
          if (!response.ok) {
            throw new Error(`Erro ao buscar o e-book: ${response.status} ${response.statusText}`);
          }
          const markdownText = await response.text();
          setEbookMarkdown(markdownText);
        } catch (error) {
          console.error("Falha ao carregar e-book:", error);
          if (error instanceof Error) {
            setEbookError(error.message);
          } else {
            setEbookError("Ocorreu um erro desconhecido ao carregar o e-book.");
          }
        } finally {
          setIsLoadingEbook(false);
        }
      };

      fetchEbookContent();
    } else {
      // Se não for e-book ou não tiver URL, limpa o estado do e-book
      setEbookMarkdown(null);
      setEbookError(null);
    }
  }, [currentLesson]); // Dependência: currentLesson

  // Define a primeira aula ao montar o componente
  useEffect(() => {
    if (discoverLesson.length > 0 && !currentLesson) {
      setCurrentLesson(discoverLesson[0]);
    }
  }, []);

  const handleLessonClick = (lesson: LessonData) => {
    setCurrentLesson(lesson);
  };

  const handleVideoEnd = () => {
    if (!currentLesson) return;
    console.log(`Conteúdo "${currentLesson.title}" (vídeo) terminou.`);
    // Lógica para avançar para a próxima aula/conteúdo
    const currentIndex = discoverLesson.findIndex(lesson => lesson.id === currentLesson.id);
    if (currentIndex !== -1 && currentIndex < discoverLesson.length - 1) {
      const nextLesson = discoverLesson[currentIndex + 1];
      setCurrentLesson(nextLesson);
      console.log(`Avançando para: ${nextLesson.title}`);
    } else {
      console.log("Fim do curso ou última aula assistida.");
    }
  };

  // Função para marcar e-book como "concluído" (exemplo)
  // Poderia ser um botão no final do e-book
  const handleEbookComplete = () => {
    if (!currentLesson) return;
    console.log(`Conteúdo "${currentLesson.title}" (e-book) marcado como concluído.`);
    // Lógica similar ao handleVideoEnd para avançar
    const currentIndex = discoverLesson.findIndex(lesson => lesson.id === currentLesson.id);
    if (currentIndex !== -1 && currentIndex < discoverLesson.length - 1) {
      const nextLesson = discoverLesson[currentIndex + 1];
      setCurrentLesson(nextLesson);
    } else {
      console.log("Fim do curso ou último e-book lido.");
    }
  };

  const renderLessonContent = () => {
    if (!currentLesson) {
      return (
        <div className="aspect-video w-full max-w-4xl mx-auto bg-black/30 flex items-center justify-center rounded-lg">
          <p className="text-xl p-8 text-center">
            {discoverLesson.length > 0 ? 'Selecione uma aula da lista para começar.' : 'Nenhuma aula disponível.'}
          </p>
        </div>
      );
    }

    if (currentLesson.model === 'video' && currentLesson.youtubeVideoId) {
      return <LessonPlayer videoId={currentLesson.youtubeVideoId} onVideoEnd={handleVideoEnd} />;
    }

    if (currentLesson.model === 'ebook') {
      if (isLoadingEbook) {
        return <div className="p-8 text-center text-xl">Carregando e-book...</div>;
      }
      if (ebookError) {
        return <div className="p-8 text-center text-red-500">Erro ao carregar e-book: {ebookError}</div>;
      }
      if (ebookMarkdown) {
        return (
          <>
            <EbookRenderer markdownContent={ebookMarkdown} />
            <div className="mt-6 text-right">
              <button
                onClick={handleEbookComplete}
                className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Marcar como Lido & Avançar
              </button>
            </div>
          </>
        );
      }
      return <div className="p-8 text-center text-xl">Conteúdo do e-book não encontrado ou URL inválida.</div>;
    }

    return <p>Tipo de conteúdo não suportado.</p>;
  };

  return (
    <div className="animate-fade-in text-white">
      <div className=" mb-8 flex items-start justify-between">
        <h1 className="text-3xl font-bold mb-1">Windows 11: Do básico ao avançado</h1>
      </div>
      
      <section className='flex flex-col lg:flex-row w-full gap-6 lg:gap-8'>
        {/* Área do Player / Ebook */}
        <div className='flex-grow lg:w-2/3 box-border'>
          {currentLesson ? (
            <>
              <h2 className="text-2xl font-semibold mb-4">{currentLesson.title}</h2>

              {currentLesson.model === 'video' && currentLesson.youtubeVideoId && (
                <LessonPlayer
                  videoId={currentLesson.youtubeVideoId}
                  onVideoEnd={handleVideoEnd}
                />
              )}
              {currentLesson.model === 'ebook' && currentLesson.ebookUrl && (
                <>
                  {renderLessonContent()}
                </>
              )}
              {!currentLesson.model && ( // Fallback se o modelo não for reconhecido
                  <p>Tipo de conteúdo não suportado.</p>
              )}
            </>
          ) : (
            <div className="aspect-video w-full max-w-4xl mx-auto bg-black/30 flex items-center justify-center rounded-lg">
              <p className="text-xl p-8 text-center">
                {discoverLesson.length > 0 ? 'Selecione uma aula da lista para começar.' : 'Nenhuma aula disponível.'}
              </p>
            </div>
          )}
          {/* Você pode adicionar mais informações sobre a aula aqui abaixo do player/ebook */}
          {currentLesson && (
            <div className="mt-6 p-4 bg-white/10 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Sobre esta aula</h3>
              <p className="text-gray-300">
                {/* Idealmente, você teria uma descrição para cada aula */}
                {/* Aqui poderia ir uma descrição vinda do objeto currentLesson.description se você adicionar */}
                Mais detalhes sobre "{currentLesson.title}" viriam aqui.
              </p>
            </div>
          )}
        </div>

            {/* Lista de Aulas */}
        <div className='bg-white/10 rounded-lg shadow-md max-h-[42rem] lg:w-1/3 w-full lg:max-w-sm xl:max-w-md box-border p-4 flex flex-col'>
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <h2 className="text-xl font-semibold text-white">Aulas do curso:</h2>
          </div>  
          <div className="flex-1 min-h-0 overflow-y-auto space-y-3 max-h-[35rem] pr-2 p-1 custom-scrollbar"> {/* Usando custom-scrollbar se configurado */}
            {discoverLesson.map(lesson => (
              <LessonCard
                key={lesson.id}
                course={lesson} // LessonCard agora recebe LessonContent
                type="discover" // Você pode ajustar o 'type' se necessário
                onLessonSelect={handleLessonClick}
                isActive={currentLesson?.id === lesson.id}
              />
            ))}
            {discoverLesson.length === 0 && (
                <p className="text-white/70 text-center py-4">Nenhuma aula disponível neste curso.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Lesson;