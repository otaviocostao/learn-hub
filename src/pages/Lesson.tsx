import CourseCard from '../components/CourseCard';
import ProgressCircle from '../components/ProgressCircle';
import { ArrowRight } from 'lucide-react';
import LessonCard from '@/components/LessonCard';
import LessonPlayer from '@/components/LessonPlayer';

import { useState, useEffect } from 'react';

// Interface para os dados da aula, incluindo o youtubeVideoId
interface LessonData {
  id: string;
  title: string;
  model: string;
  instructor: string;
  category: string;
  rating: number;
  progress: number;
  students: number;
  lessons: number;
  youtubeVideoId: string;
}

const discoverLesson: LessonData[] = [
  {
    id: '1',
    title: 'Introdução ao curso',
    model: 'Video',
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
    model: 'Video',
    instructor: 'Equipe LearnHub',
    category: 'Informática',
    rating: 0,
    progress: 0,
    students: 0,
    lessons: 0,
    youtubeVideoId: 'jM4BzN4ci7E' // Outro vídeo de exemplo
  },
  {
    id: '3',
    title: 'Menu iniciar do Windows 11',
    model: 'Video',
    instructor: 'Equipe LearnHub',
    category: 'Informática',
    rating: 0,
    progress: 0,
    students: 0,
    lessons: 0,
    youtubeVideoId: '3JZ_D3ELwOQ' // Outro vídeo de exemplo
  },
  {
    id: '4',
    title: 'Barra de tarefas do Windows 11',
    model: 'Video',
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
    model: 'Video',
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
    model: 'Video',
    instructor: 'Equipe LearnHub',
    category: 'Windows',
    rating: 0,
    progress: 0,
    students: 0,
    lessons: 0,
    youtubeVideoId: 'VIDEO_ID_CONFIGURACOES' // Substitua pelo ID real
  },
];

const Lesson = () => {
  // Estado para guardar o ID do vídeo da aula atual e o título
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [currentLessonTitle, setCurrentLessonTitle] = useState<string>('');

  // Define o primeiro vídeo da lista como padrão ao carregar
  useEffect(() => {
    if (discoverLesson.length > 0 && !currentVideoId) {
      setCurrentVideoId(discoverLesson[0].youtubeVideoId);
      setCurrentLessonTitle(discoverLesson[0].title);
    }
  }, [currentVideoId]); // Dependência para evitar re-renderizações desnecessárias

  const handleLessonClick = (lesson: LessonData) => {
    setCurrentVideoId(lesson.youtubeVideoId);
    setCurrentLessonTitle(lesson.title);
  };

  const handleVideoEnd = () => {
    console.log(`Vídeo "${currentLessonTitle}" terminou.`);
    // Aqui você pode adicionar lógica para:
    // - Marcar a aula como concluída
    // - Avançar para a próxima aula automaticamente
    const currentIndex = discoverLesson.findIndex(lesson => lesson.youtubeVideoId === currentVideoId);
    if (currentIndex !== -1 && currentIndex < discoverLesson.length - 1) {
      const nextLesson = discoverLesson[currentIndex + 1];
      setCurrentVideoId(nextLesson.youtubeVideoId);
      setCurrentLessonTitle(nextLesson.title);
      console.log(`Avançando para: ${nextLesson.title}`);
    } else {
      console.log("Fim do curso ou última aula assistida.");
      // Poderia mostrar uma mensagem de conclusão do curso, etc.
    }
  };

  return (
    <div className="animate-fade-in text-white"> {/* Adicionei text-white para melhor contraste */}
      <div className="mt-5 mb-8 flex items-start justify-between">
        {/* Este título poderia ser o nome do curso geral */}
        <h1 className="text-3xl font-bold mb-1">Windows 11: Do básico ao avançado</h1>
      </div>
      
      <section className='flex flex-col lg:flex-row w-full gap-6 lg:gap-8'>
        {/* Área do Player e Informações da Aula */}
        <div className='flex-grow lg:w-2/3 box-border'> {/* Ocupa mais espaço */}
          {currentVideoId ? (
            <>
              <h2 className="text-2xl font-semibold mb-4">{currentLessonTitle}</h2>
              <LessonPlayer videoId={currentVideoId} onVideoEnd={handleVideoEnd} />
            </>
          ) : (
            <div className="aspect-video w-full max-w-4xl mx-auto bg-black flex items-center justify-center rounded-lg">
              <p className="text-xl">Selecione uma aula da lista para começar.</p>
            </div>
          )}
          {/* Você pode adicionar mais informações sobre a aula aqui abaixo do player */}
          <div className="mt-6 p-4 bg-white/10 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Sobre esta aula</h3>
            <p className="text-gray-300">
              {/* Idealmente, você teria uma descrição para cada aula */}
              Detalhes sobre "{currentLessonTitle}" viriam aqui. Aprenda os conceitos chave e pratique com os exemplos fornecidos.
            </p>
          </div>
        </div>

        {/* Lista de Aulas */}
        <div className='bg-white/10 rounded-lg shadow-md lg:w-1/3 w-full lg:max-w-sm xl:max-w-md box-border p-4'> {/* Aumentei o padding geral para p-4 */}
          <div className="flex items-center justify-between mb-4"> {/* mb-4 para espaçamento abaixo do título */}
            <h2 className="text-xl font-semibold text-white">Aulas do curso:</h2>
          </div>  
          
          {/*
            Container para a lista de cards com altura máxima e rolagem.
            'max-h-96' é um exemplo (24rem ou 384px). Ajuste este valor.
            Valores comuns do Tailwind para max-h:
            max-h-60 (15rem, 240px)
            max-h-72 (18rem, 288px)
            max-h-80 (20rem, 320px)
            max-h-96 (24rem, 384px)
            Ou use um valor arbitrário: max-h-[400px] ou max-h-[25rem]
          */}
          <div className="space-y-3 overflow-y-auto max-h-[35rem] p-1"> {/* Adicionei pr-1 para um pequeno espaço para a barra de rolagem */}
            {discoverLesson.map(lesson => (
              <LessonCard
                key={lesson.id}
                course={lesson}
                type="discover"
                onLessonSelect={handleLessonClick}
                isActive={currentVideoId === lesson.youtubeVideoId}
                // O className dentro do LessonCard já lida com o estilo base e ativo.
                // Se precisar de classes adicionais específicas para o item da lista aqui, adicione-as.
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Lesson;