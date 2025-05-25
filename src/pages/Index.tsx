// src/pages/Index.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from '../components/CourseCard'; // Ajuste o caminho se necessário
// import ProgressCircle from '../components/ProgressCircle'; // Não usado diretamente aqui
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext'; // Para obter dados do usuário
import { getAllCourses } from '@/services/course_service'; // Para buscar cursos
import { Course } from '@/types/course'; // Interface do curso

// Interface para o CourseCard, se ele for diferente da Course
// Por enquanto, vamos assumir que CourseCard pode receber a interface Course
// e uma prop 'progress' separadamente se for um curso em andamento.
interface CourseCardDisplayData extends Course {
  progress?: number; // Para a seção "Continuar Aprendendo"
}


const Index: React.FC = () => {
  const { userProfile, currentUser } = useAuth(); // Obter nome do usuário

  const [discoverCourses, setDiscoverCourses] = useState<Course[]>([]);
  const [inProgressCourses, setInProgressCourses] = useState<CourseCardDisplayData[]>([]); // Cursos com progresso
  const [loadingDiscover, setLoadingDiscover] = useState<boolean>(true);
  const [loadingInProgress, setLoadingInProgress] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const displayName = userProfile?.name || currentUser?.displayName || 'Usuário';

  useEffect(() => {
    const fetchDiscoverCourses = async () => {
      try {
        setLoadingDiscover(true);
        setError(null);
        // Busca apenas cursos publicados para a seção "Descobrir"
        const courses = await getAllCourses(true); 
        setDiscoverCourses(courses.slice(0, 4)); // Pega os primeiros 4 para a página inicial
      } catch (err) {
        console.error("Erro ao buscar cursos para descobrir:", err);
        setError(err instanceof Error ? err.message : "Falha ao carregar cursos.");
      } finally {
        setLoadingDiscover(false);
      }
    };

    const fetchInProgressCourses = async () => {
      // LÓGICA PARA BUSCAR CURSOS EM PROGRESSO DO USUÁRIO
      // Isso envolveria:
      // 1. Verificar se currentUser existe.
      // 2. Buscar os IDs dos cursos em que o usuário está inscrito (ex: de userProfile.enrolledCourseIds
      //    ou da subcoleção userProgress que definimos).
      // 3. Para cada courseId, buscar os detalhes do curso (getCourseById) e os dados de progresso.
      // 4. Montar o array inProgressCourses com os dados combinados.
      // Por enquanto, vamos deixar mockado ou vazio para focar na listagem de "Descobrir".
      setLoadingInProgress(true);
      try {
        if (currentUser && userProfile?.actual_course_id && userProfile.actual_course_id.length > 0) {
          // Exemplo SIMPLIFICADO: buscar apenas os primeiros 4 cursos em que o usuário está inscrito
          // Em um cenário real, você buscaria o progresso de cada um.
          // Aqui, vamos apenas simular que eles têm progresso.
          // const enrolled = await Promise.all(
          //   userProfile.enrolledCourseIds.slice(0, 4).map(async (courseId) => {
          //     const courseDetails = await getCourseById(courseId);
          //     // Aqui você buscaria o progresso real
          //     // const progressData = await getUserCourseProgress(currentUser.uid, courseId);
          //     if (courseDetails) {
          //       return { ...courseDetails, progress: Math.floor(Math.random() * 100) }; // Progresso mockado
          //     }
          //     return null;
          //   })
          // );
          // setInProgressCourses(enrolled.filter(Boolean) as CourseCardDisplayData[]);
          console.warn("Lógica de 'Continuar Aprendendo' precisa ser implementada com dados de progresso reais.");
          setInProgressCourses([]); // Deixar vazio por enquanto ou com mock
        } else {
          setInProgressCourses([]);
        }
      } catch (err) {
        console.error("Erro ao buscar cursos em progresso:", err);
        // setError para cursos em progresso
      } finally {
        setLoadingInProgress(false);
      }
    };
    
    fetchDiscoverCourses();
    if (currentUser) { // Só busca cursos em progresso se houver usuário logado
        fetchInProgressCourses();
    } else {
        setLoadingInProgress(false); // Se não há usuário, não há cursos em progresso
        setInProgressCourses([]);
    }

  }, [currentUser, userProfile]); // Re-executa se o usuário mudar

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Olá, {displayName}!</h1>
          <p className="text-white/70">Pronto para aprender algo novo hoje?</p>
        </div>
      </div>
      
      {/* Seção Continuar Aprendendo */}
      {currentUser && ( // Só mostra se o usuário estiver logado
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Continuar Aprendendo</h2>
            {/* Adicionar link para "Meus Cursos" se houver mais */}
            {inProgressCourses.length > 0 && (
                 <Link to="/my-courses" className="flex items-center text-primary hover:text-primary/90 transition-colors text-sm font-medium">
                    Ver todos
                    <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
            )}
          </div>
          
          {loadingInProgress ? (
            <p className="text-white/70">Carregando seus cursos...</p>
          ) : inProgressCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {inProgressCourses.map(course => (
                <CourseCard 
                  key={course.id} 
                  // Passe as props que seu CourseCard espera
                  // Assumindo que ele pode lidar com a interface Course e uma prop 'progress'
                  course={{
                    id: course.id,
                    title: course.title,
                    instructor: course.instructorName, // Ou o campo que seu Card usa
                    category: course.category,
                    image_url: course.image_url, // Ou o campo que seu Card usa
                    rating: course.rating,
                    lesson_count: course.lesson_count,
                    // Não passe o objeto Course inteiro se o Card não esperar todos os campos
                  }}
                  progress={course.progress} 
                  type="in-progress" 
                  className="backdrop-blur-md bg-white/15 rounded-lg border border-white/18 shadow-xl" 
                />
              ))}
            </div>
          ) : (
            !loadingDiscover && <p className="text-white/70">Você ainda não começou nenhum curso. Que tal descobrir algo novo?</p>
          )}
        </section>
      )}
      
      {/* Seção Descobrir Novos Cursos */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Descobrir Novos Cursos</h2>
          <Link to="/discover" className="flex items-center text-primary hover:text-primary/90 transition-colors text-sm font-medium">
            Ver todos
            <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
        
        {loadingDiscover ? (
          <p className="text-white/70">Carregando cursos...</p>
        ) : error ? (
          <p className="text-red-500">Erro: {error}</p>
        ) : discoverCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {discoverCourses.map(course => (
              <CourseCard 
                key={course.id} 
                // Passe as props que seu CourseCard espera
                // Assumindo que ele pode lidar com a interface Course
                course={{
                  id: course.id,
                  title: course.title,
                  instructor: course.instructorName, // Ou o campo que seu Card usa
                  category: course.category,
                  image_url: course.image_url, // Ou o campo que seu Card usa
                  rating: course.rating,
                  lesson_count: course.lesson_count,
                }}
                type="discover" 
                className="backdrop-blur-md bg-white/15 rounded-lg border border-white/18 shadow-xl" 
              />
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