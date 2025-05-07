import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    instructor: string;
    image?: string;
    category: string;
    rating: number;
    progress?: number;
    students?: number;
    lessons?: number;
  };
  type?: 'in-progress' | 'discover';
  className?: string;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, type = 'discover', className }) => {
  const { id, title, instructor, image, category, rating, progress = 0, students, lessons } = course;
  
  return (
    <Link to={`/courses/${id}`} className={`course-card h-full ${className || ''}`}>
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={image || `https://source.unsplash.com/random/800x600/?${category.toLowerCase().replace(/\s+/g, '-')}`}
        />
      </div>
    </Link>
  );
};

export default CourseCard;