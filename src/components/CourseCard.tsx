import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    instructor: string;
    image_url?: string;
    category: string;
    rating: number;
    students?: number;
    lesson_count?: number;
  };
  progress?: number;
  type?: 'in-progress' | 'discover';
  className?: string;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, progress = 0, type = 'discover', className }) => {
  const { id, title, instructor, image_url, category, rating, students, lesson_count } = course;
  
  return (
    <Link to={`/course/${id}`} className={`course-card flex flex-col h-full ${className || ''}`}>
      <div className="aspect-video relative overflow-hidden rounded-t-lg">
        <img 
          src={image_url || `https://source.unsplash.com/random/800x600/?${category.toLowerCase().replace(/\s+/g, '-')}`}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-md font-semibold text-white mb-1 leading-tight truncate">{title}</h3>
        <p className="text-xs text-white/70 mb-2 flex-grow">{instructor}</p>
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

export default CourseCard;