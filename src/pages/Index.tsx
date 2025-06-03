// src/pages/Index.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import type { CourseCardProps } from '../components/CourseCard';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getAllCourses, Course } from '@/services/course_service';
import { getAllUserProgress, UserProgress } from '@/services/userProgressService';
import { getLessonsByCourseId, Lesson } from '@/services/lesson_service';

export interface InProgressCourseDisplay {
  id: string; // courseId
  courseTitle?: string; // Vem de UserProgress.courseTitle
  image_url?: string; // Vem de UserProgress.courseCoverImageUrl
  progressPercentage: number;
  lastAccessedLessonId?: string; // Vem de UserProgress
  // Campos que seu CourseCard espera e que podem não estar em UserProgress
  instructorName?: string; 
  category?: string;
  rating?: number;
  lesson_count?: number;
}

const Index: React.FC = () => {
  const { userProfile, currentUser } = useAuth();
  const navigate = useNavigate();

  const [discoverCourses, setDiscoverCourses] = useState<Course[]>([]);
  const [inProgressCourses, setInProgressCourses] = useState<InProgressCourseDisplay[]>([]);
  const [loadingDiscover, setLoadingDiscover] = useState<boolean>(true);
  const [loadingInProgress, setLoadingInProgress] = useState<boolean>(true);
  const [discoverError, setDiscoverError] = useState<string | null>(null);
  const [inProgressError, setInProgressError] = useState<string | null>(null);

  const displayName = userProfile?.name || currentUser?.displayName || 'Usuário';

  const fetchDiscoverCourses = useCallback(async () => {
    // ... (como antes) ...
    try {
      setLoadingDiscover(true);
      setDiscoverError(null);
      const courses = await getAllCourses(true); 
      setDiscoverCourses(courses.slice(0, 8)); // Mostrar mais cursos na home, ex: 8
    } catch (err) {
      console.error("Erro ao buscar cursos para descobrir:", err);
      setDiscoverError(err instanceof Error ? err.message : "Falha ao carregar cursos.");
    } finally {
      setLoadingDiscover(false);
    }
  }, []);

  const fetchInProgressCourses = useCallback(async () => {
    if (!currentUser?.uid) {
      setInProgressCourses([]);
      setLoadingInProgress(false);
      return;
    }
    setLoadingInProgress(true);
    setInProgressError(null);
    try {
      const userProgressList: UserProgress[] = await getAllUserProgress(currentUser.uid);
      
      const coursesToDisplay: InProgressCourseDisplay[] = userProgressList
        .filter(progress => progress.courseTitle && progress.progress_percentage < 100)
        .map(progress => ({
          id: progress.course_id,
          courseTitle: progress.courseTitle,
          image_url: progress.image_url,
          
          progressPercentage: progress.progress_percentage,
          lastAccessedLessonId: progress.last_accessed_lesson_id,
        }))
        .sort((a, b) => { // Ordenar por aqueles com progresso e depois por último acesso
            if (a.progressPercentage > 0 && b.progressPercentage === 0) return -1;
            if (b.progressPercentage > 0 && a.progressPercentage === 0) return 1;
          
            return 0; 
        })
        .slice(0, 4); // Mostrar até 4 cursos em progresso na home

      setInProgressCourses(coursesToDisplay);

    } catch (err) {
      console.error("Erro ao buscar cursos em progresso:", err);
      setInProgressError(err instanceof Error ? err.message : "Falha ao carregar seus cursos.");
    } finally {
      setLoadingInProgress(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchDiscoverCourses();
    if (currentUser) { // Só busca progresso se houver usuário
        fetchInProgressCourses();
    } else {
        setInProgressCourses([]); // Limpa se o usuário deslogar
        setLoadingInProgress(false);
    }
  }, [currentUser, fetchDiscoverCourses, fetchInProgressCourses]);


  const handleContinueCourse = async (courseDisplay: InProgressCourseDisplay) => {
    navigate(`/course/${courseDisplay.id}/lesson`);
  };

  const mapToCourseCardProps = (
    data: Course | InProgressCourseDisplay,
    type: 'discover' | 'in-progress'
  ): CourseCardProps => { // Use a interface real do seu CourseCardProps
    let cardCourseData: Pick<Course, 'id' | 'title' | 'image_url' | 'instructorName' | 'category' | 'rating' | 'lesson_count'>;
    let progressValue: number | undefined = undefined;

    if (type === 'in-progress') {
      const inProgressData = data as InProgressCourseDisplay;
      cardCourseData = {
        id: inProgressData.id,
        title: inProgressData.courseTitle || "Título Indisponível",
        image_url: inProgressData.image_url,
        instructorName: inProgressData.instructorName, // Precisa existir em InProgressCourseDisplay ou ser buscado
        category: inProgressData.category,         // Precisa existir em InProgressCourseDisplay ou ser buscado
        rating: undefined, // Ou 0, pois rating é mais para descoberta
        lesson_count: undefined, // Ou 0, pois lesson_count é mais para descoberta
      };
      progressValue = inProgressData.progressPercentage;
    } else {
      const discoverData = data as Course;
      cardCourseData = {
        id: discoverData.id,
        title: discoverData.title,
        image_url: discoverData.image_url,
        instructorName: discoverData.instructorName,
        category: discoverData.category,
        rating: discoverData.rating,
        lesson_count: discoverData.lesson_count,
      };
    }
    // Esta é a estrutura que o seu CourseCard espera, conforme erro anterior.
    // Se mudou, ajuste aqui.
    return {
        course: { // O CourseCard espera um objeto 'course' aninhado
            id: cardCourseData.id,
            title: cardCourseData.title,
            instructor: cardCourseData.instructorName || 'N/A', // Mapeia para 'instructor' se o Card espera isso
            category: cardCourseData.category || 'N/A',
            image_url: cardCourseData.image_url || '/placeholder.jpg', // Mapeia para 'image_url'
            rating: cardCourseData.rating || 0,
            lesson_count: cardCourseData.lesson_count || 0, // Renomeei para lesson_count no exemplo do erro
            // Adicione quaisquer outros campos que seu 'course' prop no CourseCard espera
        },
        progress: progressValue,
        // 'type' e 'className' são passadas separadamente
    } as unknown as CourseCardProps; // Use 'as unknown as CourseCardProps' se a estrutura for complexa e você tiver certeza
                                   // Ou melhor, defina um tipo exato para o que o CourseCard espera em sua prop 'course'
  };


  return (
    <div className="animate-fade-in p-4 md:p-6">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Olá, {displayName}!</h1>
          <p className="text-white/70">Pronto para aprender algo novo hoje?</p>
        </div>
      </div>
      
      {currentUser && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Continuar Aprendendo</h2>
            {inProgressCourses.length > 0 && (
                 <Link to="/my-courses" className="flex items-center text-primary hover:text-primary/90 transition-colors text-sm font-medium">
                    Ver todos
                    <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
            )}
          </div>
          
          {loadingInProgress ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => <div key={i} className="h-64 bg-white/10 rounded-lg animate-pulse"></div>)} {/* Skeleton */}
            </div>
          ) : inProgressError ? (
            <p className="text-red-400 bg-red-900/30 p-3 rounded-md">Erro ao carregar seus cursos: {inProgressError}</p>
          ) : inProgressCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {inProgressCourses.map(courseDisplayData => (
                <div key={courseDisplayData.id} onClick={() => handleContinueCourse(courseDisplayData)} className="cursor-pointer">
                    <CourseCard 
                    {...mapToCourseCardProps(courseDisplayData, 'in-progress')}
                    type="in-progress"
                    className="backdrop-blur-md bg-white/15 rounded-lg border border-white/18 shadow-xl h-full" 
                    />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/70 p-3 bg-black/10 rounded-md">Você ainda não começou nenhum curso. Explore abaixo!</p>
          )}
        </section>
      )}
      
      <section>
        {/* ... (Seção Descobrir Novos Cursos como antes, usando mapToCourseCardProps) ... */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Descobrir Novos Cursos</h2>
          <Link to="/discover" className="flex items-center text-primary hover:text-primary/90 transition-colors text-sm font-medium">
            Ver todos <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
        {loadingDiscover ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => <div key={i} className="h-64 bg-white/10 rounded-lg animate-pulse"></div>)} {/* Skeleton */}
            </div>
        ) : discoverError ? (
          <p className="text-red-400 bg-red-900/30 p-3 rounded-md">Erro: {discoverError}</p>
        ) : discoverCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {discoverCourses.map(courseData => (
              <Link key={courseData.id} to={`/course/${courseData.id}`}> 
                <CourseCard 
                  {...mapToCourseCardProps(courseData, 'discover')}
                  type="discover"
                  className="backdrop-blur-md bg-white/15 rounded-lg border border-white/18 shadow-xl h-full" 
                />
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-white/70">Nenhum curso disponível no momento.</p>
        )}
      </section>
    </div>
  );
};

export default Index;