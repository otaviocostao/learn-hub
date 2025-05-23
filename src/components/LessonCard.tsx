import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    model: string;
    instructor: string;
    category: string;
    rating: number;
    progress?: number;
    students?: number;
    lessons?: number;
  };
  type?: 'in-progress' | 'discover';
  className?: string;
}

const LessonCard: React.FC<CourseCardProps> = ({ course, type = 'discover', className }) => {
  const { id, title, model, instructor, category, rating, progress = 0, students, lessons } = course;
  
  return (
    <Link to={`/courses/lesson/${id}`} className={`course-card flex flex-col h-full mb-2 ${className || ''}`}>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-md font-semibold text-white mb-1 leading-tight truncate">{id} - {title}</h3>
        <p className="text-xs text-white/70 mb-2 flex-grow">{model}</p>
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
      </div>
    </Link>
  );
};

export default LessonCard;