// src/components/LessonCard.tsx

import React from 'react';
import { Video, BookText } from 'lucide-react'; // Ícones para vídeo e e-book
import { Lesson } from '@/types/lesson'; // Ajuste o caminho se necessário

export interface LessonCardProps {
  lesson: Lesson;
  onClick: (selectedLesson: Lesson) => void;
  isActive: boolean;
  className?: string;
}

const LessonCard: React.FC<LessonCardProps> = ({
  lesson,
  onClick,
  isActive,
  className = '' // Padrão para string vazia
}) => {
  const { title, model, duration_minutes, order } = lesson;

  const handleCardClick = () => {
    onClick(lesson);
  };

  const activeClasses = isActive 
    ? 'ring-2 ring-sky-400 border-sky-500 bg-sky-500/20' 
    : 'border-white/18 hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none';

  return (
    <div
      onClick={handleCardClick}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleCardClick();
        }
      }}
      role="button"
      tabIndex={0}
      className={`flex items-center p-3 space-x-3 rounded-lg cursor-pointer transition-all duration-150 ${activeClasses} ${className}`}
      title={title}
    >
      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-black/20 rounded-md text-sky-400">
        {model === 'video' ? <Video size={18} /> : <BookText size={18} />}
      </div>
      <div className="flex-grow min-w-0"> {/* min-w-0 para truncamento funcionar */}
        <p className="text-sm font-medium text-white truncate">
          {order}. {title}
        </p>
        <p className="text-xs text-white/60 truncate">
          {model === 'video' ? 'Vídeo' : 'E-book'}
          {duration_minutes ? ` - ${duration_minutes} min` : ''}
        </p>
      </div>
      {isActive && (
        <div className="w-2 h-2 bg-sky-400 rounded-full flex-shrink-0 animate-pulse"></div>
      )}
    </div>
  );
};

export default LessonCard;