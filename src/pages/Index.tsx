import React from 'react';
import CourseCard from '../components/CourseCard';
import ProgressCircle from '../components/ProgressCircle';
import { ArrowRight } from 'lucide-react';

const mockCourses = [
  {
    id: '1',
    title: 'Informática Básica para Iniciantes',
    instructor: 'Equipe LearnHub',
    category: 'Informática',
    image: '/images/informatica_basica.jpg',
    rating: 0,
    progress: 0,
    students: 0,
    lessons: 0
  },
  {
    id: '2',
    title: 'Solução de Problemas de Informática',
    instructor: 'Equipe LearnHub',
    category: 'Informática',
    image: '/images/solucao_problemas_informatica.jpg',
    rating: 0,
    progress: 0,
    students: 0,
    lessons: 0
  },
  {
    id: '3',
    title: 'Aprofundamento em Informática para o Ambiente Acadêmico',
    instructor: 'Equipe LearnHub',
    category: 'Informática',
    image: '/images/informatica_academico.jpg',
    rating: 0,
    progress: 0,
    students: 0,
    lessons: 0
  },
  {
    id: '4',
    title: 'Maximizando a Produtividade no Windows com Módulos de Tarefas',
    instructor: 'Equipe LearnHub',
    category: 'Windows',
    image: '/images/produtividade_windows.jpg',
    rating: 0,
    progress: 0,
    students: 0,
    lessons: 0
  },
  {
    id: '5',
    title: 'Dominando a Barra de Tarefas do Windows: Conexão Wi-Fi, Áudio e Mais',
    instructor: 'Equipe LearnHub',
    category: 'Windows',
    image: '/images/barra_tarefas_windows.jpg',
    rating: 0,
    progress: 0,
    students: 0,
    lessons: 0
  },
];

const discoverCourses = [
  {
    id: '1',
    title: 'Informática Básica para Iniciantes',
    instructor: 'Equipe LearnHub',
    category: 'Informática',
    image: '/images/informatica_basica.jpg',
    rating: 0,
    progress: 0,
    students: 0,
    lessons: 0
  },
  {
    id: '2',
    title: 'Solução de Problemas de Informática',
    instructor: 'Equipe LearnHub',
    category: 'Informática',
    image: '/images/solucao_problemas_informatica.jpg',
    rating: 0,
    progress: 0,
    students: 0,
    lessons: 0
  },
  {
    id: '3',
    title: 'Aprofundamento em Informática para o Ambiente Acadêmico',
    instructor: 'Equipe LearnHub',
    category: 'Informática',
    image: '/images/informatica_academico.jpg',
    rating: 0,
    progress: 0,
    students: 0,
    lessons: 0
  },
  {
    id: '4',
    title: 'Maximizando a Produtividade no Windows com Módulos de Tarefas',
    instructor: 'Equipe LearnHub',
    category: 'Windows',
    image: '/images/produtividade_windows.jpg',
    rating: 0,
    progress: 0,
    students: 0,
    lessons: 0
  },
  {
    id: '5',
    title: 'Dominando a Barra de Tarefas do Windows: Conexão Wi-Fi, Áudio e Mais',
    instructor: 'Equipe LearnHub',
    category: 'Windows',
    image: '/images/barra_tarefas_windows.jpg',
    rating: 0,
    progress: 0,
    students: 0,
    lessons: 0
  },
];

const Index = () => {
  return (
    <div className="animate-fade-in">
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
    </div>
  );
};

export default Index;
