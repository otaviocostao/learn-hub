// src/components/LessonCard.tsx

import React from 'react';
import { Video, BookText, CheckCircle } from 'lucide-react'; // Ícones para vídeo, e-book e concluído
import { Lesson } from '@/types/lesson'; // Ajuste o caminho se necessário

export interface LessonCardProps {
  lesson: Lesson;
  onClick: (selectedLesson: Lesson) => void;
  isActive: boolean;
  isCompleted?: boolean; // Nova prop para indicar se a aula foi concluída
  className?: string;
}

const LessonCard: React.FC<LessonCardProps> = ({
  lesson,
  onClick,
  isActive,
  isCompleted = false, // Padrão para false
  className = ''
}) => {
  const { title, model, duration_minutes, order } = lesson;

  const handleCardClick = () => {
    // Não permite clicar para selecionar se já estiver ativa, ou pode permitir se você quiser
    // if (isActive) return; 
    onClick(lesson);
  };

  // Estilos base
  let baseRingClasses = 'focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none';
  let baseBgHoverClasses = 'hover:bg-white/20';
  let baseBorderClasses = 'border-white/18';
  let titleClasses = 'text-white';
  let detailsClasses = 'text-white/60';
  let iconColor = 'text-sky-400';

  if (isActive) {
    baseRingClasses = 'ring-2 ring-sky-400 border-sky-500';
    baseBgHoverClasses = 'bg-sky-500/20'; // Mantém o fundo ativo no hover
    baseBorderClasses = 'border-sky-500'; // Borda ativa
  }
  
  if (isCompleted && !isActive) { // Se completo mas não ativo, muda um pouco o estilo
    titleClasses = 'text-white/70 line-through';
    detailsClasses = 'text-white/50 line-through';
    iconColor = 'text-green-400'; // Ícone verde para aula completa
    baseBgHoverClasses = 'hover:bg-green-500/10'; // Leve hover verde
  } else if (isCompleted && isActive) { // Se completo E ativo, mantém o destaque ativo mas indica conclusão
    iconColor = 'text-green-400'; // Ícone verde
    // O texto já está destacado pelo 'isActive', não precisa de line-through aqui
  }


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
      className={`flex items-center p-3 space-x-3 rounded-lg cursor-pointer transition-all duration-150 
                  ${baseBorderClasses} ${baseRingClasses} ${isActive ? 'bg-sky-500/20' : 'bg-black/10'} ${baseBgHoverClasses} 
                  ${className}`}
      title={title}
      aria-current={isActive ? "page" : undefined}
      aria-label={`${isCompleted ? 'Concluída: ' : ''}Aula ${order}: ${title} - ${model === 'video' ? 'Vídeo' : 'E-book'}${duration_minutes ? `, ${duration_minutes} min` : ''}`}
    >
      {/* Ícone da Aula (Vídeo, E-book ou Concluído) */}
      <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center bg-black/30 rounded-md ${iconColor}`}>
        {isCompleted ? (
          <CheckCircle size={20} />
        ) : model === 'video' ? (
          <Video size={18} />
        ) : (
          <BookText size={18} />
        )}
      </div>

      {/* Informações da Aula */}
      <div className="flex-grow min-w-0">
        <p className={`text-sm font-medium truncate ${titleClasses}`}>
          <span className="mr-1.5 text-xs text-white/50">{order}.</span>
          {title}
        </p>
        <p className={`text-xs truncate ${detailsClasses}`}>
          {model === 'video' ? 'Vídeo' : 'E-book'}
          {duration_minutes ? ` - ${duration_minutes} min` : ''}
        </p>
      </div>

      {/* Indicador de Aula Ativa (Pode ser removido se o background já indicar) */}
      {isActive && !isCompleted && ( // Só mostra o pulse se ativo e NÃO completo
        <div className="w-2 h-2 bg-sky-400 rounded-full flex-shrink-0 animate-pulse ml-auto"></div>
      )}
    </div>
  );
};

export default LessonCard;