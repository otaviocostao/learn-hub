// src/pages/MyCourses.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Clock, Star, User, BookOpen } from 'lucide-react'; // Adicionado BookOpen
import { useAuth } from '@/context/AuthContext';
import { getAllUserProgress, UserProgress } from '@/services/userProgressService';
import { getCourseById, Course } from '@/services/course_service'; // Para buscar total de aulas se necessário
import { Button } from '@/components/ui/button';

// Interface para os dados combinados a serem exibidos no card
interface MyCourseDisplayData {
  id: string; // courseId
  title?: string;
  instructorName?: string; // Nome do instrutor (do curso ou denormalizado)
  image_url?: string;
  rating?: number; // Se quiser exibir rating aqui
  // students?: number; // Se quiser exibir
  hours?: number; // Duração total do curso
  progressPercentage: number;
  totalLessons?: number; // Total de aulas do curso
  completedLessonsCount: number;
  lessonsRemaining?: number;
  // lastAccessedLessonId?: string; // Para navegação direta se implementado
}

const MyCourses: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [myCourses, setMyCourses] = useState<MyCourseDisplayData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'in-progress' | 'completed'>('all');


  const fetchMyCourses = useCallback(async () => {
    if (!currentUser?.uid) {
      setMyCourses([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const userProgressList: UserProgress[] = await getAllUserProgress(currentUser.uid);
      
      const coursesDataPromises = userProgressList.map(async (progress) => {
        // Tenta usar dados denormalizados de UserProgress.
        // Se lesson_count não estiver em UserProgress, busca do documento do curso.
        let courseDetails: Pick<Course, 'lesson_count' | 'instructorName' | 'hours' | 'rating'> | null = null;
        
        // Se você não denormalizou lesson_count em UserProgress, precisa buscar
        // Idealmente, UserProgress já teria o total de aulas do curso no momento da inscrição.
        // Para este exemplo, vamos buscar se não estiver presente.
        // if (!progress.courseTotalLessons) { // Supondo um campo denormalizado
            try {
                const fetchedCourse = await getCourseById(progress.course_id);
                if (fetchedCourse) {
                    courseDetails = {
                        lesson_count: fetchedCourse.lesson_count,
                        instructorName: fetchedCourse.instructorName,
                        hours: fetchedCourse.hours,
                        rating: fetchedCourse.rating,
                    };
                }
            } catch (courseError) {
                console.warn(`Não foi possível buscar detalhes do curso ${progress.course_id}:`, courseError);
            }
        // }

        const totalLessons = courseDetails?.lesson_count || 0; // Ou progress.courseTotalLessons se denormalizado
        const completedCount = progress.completed_lesson_ids?.length || 0;
        const lessonsRemaining = totalLessons > 0 ? totalLessons - completedCount : 0;

        return {
          id: progress.course_id,
          title: progress.courseTitle || "Título Indisponível",
          image_url: progress.image_url,
          progressPercentage: progress.progress_percentage,
          completedLessonsCount: completedCount,
          totalLessons: totalLessons,
          lessonsRemaining: lessonsRemaining < 0 ? 0 : lessonsRemaining, // Garante que não seja negativo
          instructorName: courseDetails?.instructorName || "Instrutor Desconhecido",
          hours: courseDetails?.hours,
          rating: courseDetails?.rating,
          // lastAccessedLessonId: progress.last_accessed_lesson_id, // Para navegação
        };
      });

      const resolvedCoursesData = (await Promise.all(coursesDataPromises)).filter(Boolean) as MyCourseDisplayData[];
      setMyCourses(resolvedCoursesData);

    } catch (err) {
      console.error("Erro ao buscar 'Meus Cursos':", err);
      setError(err instanceof Error ? err.message : "Falha ao carregar seus cursos.");
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchMyCourses();
  }, [fetchMyCourses]);

  const handleNavigateToLessons = (courseId: string) => {
    navigate(`/course/${courseId}/lesson`);
  };

  const filteredCourses = myCourses.filter(course => {
    if (filter === 'in-progress') {
      return course.progressPercentage > 0 && course.progressPercentage < 100;
    }
    if (filter === 'completed') {
      return course.progressPercentage === 100;
    }
    return true; // 'all'
  });

  return (
    <div className="animate-fade-in p-4 md:p-6 text-white"> {/* Adicionado text-white */}
      <div className="max-w-8xl mx-auto">
        <header className="mb-8 p-6 bg-black/20 border border-white/10 rounded-lg shadow-xl"> {/* Estilo glass-panel */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <h1 className="text-3xl font-bold text-gradient">Meus Cursos</h1>
            <div className="flex gap-2 flex-wrap">
              <Button 
                variant={filter === 'all' ? 'default' : 'outline'} 
                onClick={() => setFilter('all')}
                className={`text-sm ${filter === 'all' ? 'bg-sky-600 hover:bg-sky-700 border-sky-600' : 'border-white/20 hover:bg-white/10'}`}
              >
                Todos
              </Button>
              <Button 
                variant={filter === 'in-progress' ? 'default' : 'outline'} 
                onClick={() => setFilter('in-progress')}
                className={`text-sm ${filter === 'in-progress' ? 'bg-sky-600 hover:bg-sky-700 border-sky-600' : 'border-white/20 hover:bg-white/10'}`}
              >
                Em Progresso
              </Button>
              <Button 
                variant={filter === 'completed' ? 'default' : 'outline'} 
                onClick={() => setFilter('completed')}
                className={`text-sm ${filter === 'completed' ? 'bg-sky-600 hover:bg-sky-700 border-sky-600' : 'border-white/20 hover:bg-white/10'}`}
              >
                Concluídos
              </Button>
            </div>
          </div>
          <p className="text-white/70">
            {loading ? "Carregando..." : 
             currentUser ? 
                `Continue aprendendo de onde você parou. Você tem ${myCourses.length} cursos em sua lista.` 
                : "Faça login para ver seus cursos."
            }
          </p>
        </header>

        {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {[...Array(2)].map((_, i) => ( // Skeleton para 2 cards
                    <div key={i} className="bg-black/20 border border-white/10 rounded-lg shadow-xl p-5 animate-pulse h-[300px]">
                        <div className="h-32 bg-white/10 rounded mb-4"></div>
                        <div className="h-6 bg-white/10 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-white/10 rounded w-1/2 mb-4"></div>
                        <div className="h-2 bg-white/10 rounded w-full mb-2"></div>
                        <div className="h-8 bg-sky-700/50 rounded mt-auto"></div>
                    </div>
                ))}
            </div>
        )}

        {!loading && error && (
            <p className="text-red-400 bg-red-900/30 p-4 rounded-md text-center">{error}</p>
        )}

        {!loading && !error && filteredCourses.length === 0 && (
            <div className="text-center py-10">
                <BookOpen size={48} className="mx-auto text-white/30 mb-4" />
                <p className="text-white/70 text-lg">
                    {filter === 'all' && "Você ainda não se inscreveu em nenhum curso."}
                    {filter === 'in-progress' && "Nenhum curso em progresso no momento."}
                    {filter === 'completed' && "Nenhum curso concluído ainda."}
                </p>
                {filter === 'all' && (
                    <Link to="/discover">
                        <Button variant="link" className="text-sky-400 hover:text-sky-300 mt-2">
                            Descobrir Cursos
                        </Button>
                    </Link>
                )}
            </div>
        )}

        {!loading && !error && filteredCourses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {filteredCourses.map(course => (
              <div 
                key={course.id} 
                className="course-card bg-black/20 border border-white/10 rounded-lg shadow-xl overflow-hidden flex flex-col h-full transition-all hover:shadow-sky-500/30 hover:border-sky-500/50"
              >
                <div className="relative">
                  <img 
                    src={course.image_url || `https://source.unsplash.com/random/800x450/?education,technology&sig=${course.id}`} // Imagem de fallback com sig para variedade
                    alt={course.title || "Capa do curso"} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/90 to-transparent"></div>
                  {course.rating !== undefined && course.rating > 0 && (
                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full text-xs flex items-center text-white">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                        {course.rating.toFixed(1)}
                    </div>
                  )}
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold mb-2 text-white truncate" title={course.title}>{course.title}</h3>
                  
                  {course.instructorName && (
                    <div className="flex items-center text-sm text-white/70 mb-3">
                      <User className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                      <span>{course.instructorName}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-white/60 mb-1">
                    {course.hours !== undefined && (
                        <div className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                        <span>{course.hours} horas</span>
                        </div>
                    )}
                    {course.totalLessons !== undefined && course.lessonsRemaining !== undefined && (
                      <span>{course.lessonsRemaining} de {course.totalLessons} aulas restantes</span>
                    )}
                  </div>
                  
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-4 mt-1">
                    <div 
                        className="bg-sky-500 h-full rounded-full transition-all duration-500 ease-out" 
                        style={{ width: `${course.progressPercentage}%` }}
                    ></div>
                  </div>
                  
                  <Button 
                    onClick={() => handleNavigateToLessons(course.id)} 
                    className="mt-auto w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-md"
                  >
                    {course.progressPercentage > 0 && course.progressPercentage < 100 ? 'Continuar Curso' : 
                     course.progressPercentage === 100 ? 'Revisar Curso' : 'Iniciar Curso'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;