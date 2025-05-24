// src/components/LessonCard.tsx (ou onde estiver seu LessonCard)

import React from 'react';
// Link não é mais necessário para esta funcionalidade de troca de aula na mesma página
// import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

// Mantendo a interface como está, mas poderia ser movida para um arquivo de tipos compartilhado
// se usada em muitos lugares.
export interface LessonCardData { // Renomeei para ser mais específico, mas pode manter CourseCardProps['course']
  id: string;
  title: string;
  model: string;
  instructor: string;
  category: string;
  rating: number;
  progress?: number;
  students?: number;
  lessons?: number;
  youtubeVideoId: string;
}

interface LessonCardProps {
  course: LessonCardData;
  type?: 'in-progress' | 'discover';
  className?: string;
  onLessonSelect?: (lesson: LessonCardData) => void; // Nova prop para o callback
  isActive?: boolean; // Opcional: para destacar o card ativo
}

const LessonCard: React.FC<LessonCardProps> = ({
  course,
  type = 'discover',
  className,
  onLessonSelect,
  isActive = false // Padrão para false
}) => {
  const { id, title, model, instructor, category, rating, progress = 0, students, lessons } = course;

  const handleCardClick = () => {
    if (onLessonSelect) {
      onLessonSelect(course);
    }
  };

  // Classes condicionais para o card ativo
  const activeClasses = isActive ? 'ring-2 ring-sky-400 border-sky-400 bg-white/25' : 'border-white/18 hover:bg-white/20';

  return (
    // Em vez de Link, usamos um div e o tornamos clicável
    <div
      onClick={handleCardClick}
      className={`course-card flex flex-col mb-2 cursor-pointer transition-colors duration-150 ${activeClasses} ${className || ''}`}
      role="button" // Adiciona semântica
      tabIndex={0} // Torna focável via teclado
      onKeyPress={(e) => { // Permite ativação com Enter/Space
        if (e.key === 'Enter' || e.key === ' ') {
          handleCardClick();
        }
      }}
    >
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-md font-semibold text-white mb-1 leading-tight truncate">
          {/* Você pode decidir se quer o ID aqui ainda */}
          {/* {id} -  */}
          {title}
        </h3>
        <p className="text-xs text-white/70 mb-2 flex-grow">{model}</p>
        {/* ... (resto do conteúdo do card permanece o mesmo) ... */}
        {type === 'in-progress' && progress > 0 && (
          <div className="mt-auto pt-2">
            <div className="w-full bg-gray-700 rounded-full h-1.5">
              <div className="bg-primary h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-xs text-white/50 mt-1 text-right">{progress}% completo</p>
          </div>
        )}
        {type === 'discover' && rating > 0 && (
          <div className="flex items-center mt-auto pt-2 text-xs text-amber-400">
            <Star className="w-3.5 h-3.5 mr-1 fill-current" />
            <span>{rating.toFixed(1)}</span>
            {students && <span className="ml-2 text-white/50">({students.toLocaleString()})</span>}
          </div>
        )}
         {type === 'discover' && rating === 0 && !lessons && ( // Placeholder se não houver rating ou lessons
          <div className="mt-auto pt-2 text-xs text-white/50">
            <span>Detalhes da aula</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonCard;