import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import AppSidebar from '../components/AppSidebar';
import CourseCard from '../components/CourseCard';
import ProgressCircle from '../components/ProgressCircle';
import { ArrowRight } from 'lucide-react';

const mockCourses = [
  {
    id: '1',
    title: 'Modern Web Development Masterclass',
    instructor: 'John Smith',
    category: 'Web Development',
    image: 'https://source.unsplash.com/random/800x600/?coding',
    rating: 4.9,
    progress: 38,
    students: 24500,
    lessons: 64
  },
  {
    id: '2',
    title: 'Data Science Fundamentals',
    instructor: 'Sarah Johnson',
    category: 'Data Science',
    image: 'https://source.unsplash.com/random/800x600/?data',
    rating: 4.7,
    progress: 72,
    students: 18300,
    lessons: 48
  },
  {
    id: '3',
    title: 'UI/UX Design Principles',
    instructor: 'Michael Chen',
    category: 'UI/UX Design',
    image: 'https://source.unsplash.com/random/800x600/?design',
    rating: 4.8,
    progress: 19,
    students: 12700,
    lessons: 36
  },
  {
    id: '4',
    title: 'Mobile App Development with React Native',
    instructor: 'Emily Rodriguez',
    category: 'Mobile Development',
    image: 'https://source.unsplash.com/random/800x600/?mobile',
    rating: 4.6,
    progress: 52,
    students: 9800,
    lessons: 42
  },
];

const discoverCourses = [
  {
    id: '5',
    title: 'Advanced JavaScript Patterns',
    instructor: 'David Wilson',
    category: 'Web Development',
    image: 'https://source.unsplash.com/random/800x600/?javascript',
    rating: 4.9,
    students: 12300,
    lessons: 36
  },
  {
    id: '6',
    title: 'Machine Learning for Beginners',
    instructor: 'Lisa Wang',
    category: 'Data Science',
    image: 'https://source.unsplash.com/random/800x600/?machine-learning',
    rating: 4.8,
    students: 8700,
    lessons: 42
  },
  {
    id: '7',
    title: 'Responsive Design Masterclass',
    instructor: 'Carlos Mendez',
    category: 'Web Development',
    image: 'https://source.unsplash.com/random/800x600/?responsive',
    rating: 4.7,
    students: 6500,
    lessons: 28
  },
  {
    id: '8',
    title: 'iOS App Development with Swift',
    instructor: 'Jennifer Lee',
    category: 'Mobile Development',
    image: 'https://source.unsplash.com/random/800x600/?swift',
    rating: 4.9,
    students: 9300,
    lessons: 46
  },
];

const Index = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="min-h-screen flex">
      <AppSidebar isCollapsed={isSidebarCollapsed} toggleCollapse={toggleSidebar} />
      
      <div className={`w-full min-h-screen transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-20' : 'ml-60'}`}>
        <Navbar />
        
        <main className="pt-24 px-6 pb-16 animate-fade-in">
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Olá, Rafael Viado!</h1>
              <p className="text-white/70">Pronta para aprender algo novo hoje?</p>
            </div>
            
            <div className="flex items-center">
              <ProgressCircle progress={68} size={60}>
                <div className="flex flex-col items-center justify-center">
                  <span className=" text-sm font-bold text-white">68%</span> 
                </div>
              </ProgressCircle>
              <span className="ml-2 text-xs text-white/60 mt-0.5">Progresso Geral</span>
            </div>
          </div>
          
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Continuar Aprendendo</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mockCourses.map(course => (
                <CourseCard key={course.id} course={course} type="in-progress" className="backdrop-blur-md bg-white/15 rounded-lg border border-white/18 shadow-xl" />
              ))}
            </div>
          </section>
          
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Descobrir Novos Cursos</h2>
              <a href="/discover" className="flex items-center text-primary hover:text-primary/90 transition-colors text-sm font-medium">
                Ver todos
                <ArrowRight className="ml-1 w-4 h-4" />
              </a>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {discoverCourses.map(course => (
                <CourseCard key={course.id} course={course} type="discover" className="backdrop-blur-md bg-white/15 rounded-lg border border-white/18 shadow-xl" />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Index;
