import React from 'react';
import CourseCard from '../components/CourseCard';
import ProgressCircle from '../components/ProgressCircle';
import { ArrowRight } from 'lucide-react';
import LessonCard from '@/components/LessonCard';

const discoverLesson = [
  {
    id: '1',
    title: 'Introdução ao curso',
    model: 'Video',
    instructor: 'Equipe LearnHub',
    category: 'Informática',
    rating: 0,
    progress: 5,
    students: 0,
    lessons: 0
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
    lessons: 0
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
    lessons: 0
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
    lessons: 0
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
    lessons: 0
  },
];

const Lesson = () => {
  return (
    <div className="animate-fade-in">
      <div className="mt-5 mb-8 flex items-start justify-between">
          <h1 className="text-3xl font-bold text-white mb-1">Windows 11: Do básico ao avançado</h1>
      </div>
      
      
      <section className='flex w-full flex-end'>

        <div className='flex w-full box-border p-4 '>
            <h1>player component area</h1>
        </div>

        <div className='w-30%'>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Aulas do curso:</h2>
            </div>  
            
            <div className=" gap-6">
                {discoverLesson.map(course => (
                    <LessonCard key={course.id} course={course} type="discover" className="backdrop-blur-md bg-white/15 rounded-lg border border-white/18 shadow-xl" />
                ))}
            </div>
        </div>
      </section>
    </div>
  );
};

export default Lesson;
