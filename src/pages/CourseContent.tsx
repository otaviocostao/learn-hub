// src/pages/CourseContentPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PlayCircle, Check, Star, Clock, CalendarDays, Tv, Smartphone, ArrowLeft } from 'lucide-react'; // Adicionei mais ícones
import { getCourseById, Course } from '@/services/course_service'; // Importar de course_service
// Se sua interface Course está em src/types/course.ts, ajuste o import.
// import { Course } from '@/types/course';
import { format } from 'date-fns'; // Para formatar datas
import { ptBR } from 'date-fns/locale'; // Para formatação em português

const CourseContentPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) {
      setError("ID do curso não fornecido na URL.");
      setLoading(false);
      return;
    }

    const fetchCourseDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const courseData = await getCourseById(courseId);
        if (!courseData) {
          throw new Error("Curso não encontrado.");
        }
        setCourse(courseData);
      } catch (err) {
        console.error("Erro ao buscar detalhes do curso:", err);
        setError(err instanceof Error ? err.message : "Falha ao carregar dados do curso.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const handleNavigateToLessons = () => {
    if (courseId) {
      navigate(`/course/${courseId}/lesson`); // Navega para a primeira aula do curso
    }
  };

  // Dados mockados para "O que você aprenderá" e "Este curso inclui"
  // Idealmente, estes viriam do seu objeto 'course' se você adicionar esses campos
  const whatYouWillLearn = [
    "Usar o Windows 11 com confiança e eficiência.",
    "Utilizar os principais recursos e aplicativos do sistema.",
    "Personalizar o ambiente de trabalho para suas necessidades.",
    "Noções essenciais de segurança e manutenção do sistema.",
  ];

  const courseIncludes = [
    { text: `${course?.hours || 0} horas de vídeo sob demanda`, icon: <Clock size={20} /> },
    { text: "Artigos e recursos complementares", icon: <PlayCircle size={20} /> }, // Substitua o ícone se necessário
    { text: "Acesso no dispositivo móvel e na TV", icon: <Smartphone size={20} /> }, // <Tv size={20}/> também
    { text: "Certificado de conclusão (se aplicável)", icon: <Star size={20} /> },
  ];


  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-white"><p className="text-xl">Carregando informações do curso...</p></div>;
  }
  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500"><p className="text-xl">Erro: {error}</p></div>;
  }
  if (!course) {
    return <div className="flex items-center justify-center min-h-screen text-white"><p className="text-xl">Curso não encontrado.</p></div>;
  }

  return (
    <div className="animate-fade-in p-4 md:p-6 lg:p-8 text-white">
      {/* Breadcrumbs ou botão de voltar */}
      <div className="mb-6">
        <RouterLink to="/" className="inline-flex items-center text-sm text-sky-400 hover:text-sky-300 transition-colors">
          <ArrowLeft size={16} className="mr-1" />
          Voltar para o início
        </RouterLink>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content Area */}
        <div className="flex-1">
          {/* Course Header */}
          <Badge variant="secondary" className="mb-2 bg-sky-500/20 text-sky-300 border-sky-500/30">
            {course.category || 'Sem Categoria'}
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
            {course.title}
          </h1>
          <p className="text-gray-300 text-lg mb-4">
            {course.description}
          </p>

          <div className="flex flex-wrap items-center text-gray-400 text-sm mb-6 gap-x-4 gap-y-2">
            {course.rating && course.rating > 0 && (
              <span className="flex items-center">
                <Star size={16} className="mr-1 text-yellow-400 fill-yellow-400" />
                {course.rating.toFixed(1)} Avaliação
              </span>
            )}
            {course.students && (
              <span>({course.students.toLocaleString()} alunos)</span>
            )}
            {course.instructorName && (
              <span>Criado por <span className="text-sky-400">{course.instructorName}</span></span>
            )}
          </div>

          <div className="flex flex-wrap items-center text-gray-400 text-sm mb-8 gap-x-4 gap-y-2">
            {course.updatedAt && (
               <span className="flex items-center">
                <CalendarDays size={16} className="mr-1" />
                Última atualização em {format(course.updatedAt.toDate(), "MM/yyyy", { locale: ptBR })}
              </span>
            )}
            <span className="flex items-center">
              {/* <Languages size={16} className="mr-1" />  Precisa do ícone Languages */}
              <PlayCircle size={16} className="mr-1" /> {/* Placeholder */}
              Português
            </span>
          </div>

          {/* What you'll learn section */}
          <Card className="bg-black/20 border border-white/10 p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">O que você aprenderá</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-gray-300">
              {whatYouWillLearn.map((item, index) => (
                <div key={index} className="flex items-start">
                  <Check size={20} className="text-green-400 mr-2 mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* This course includes */}
          {courseIncludes.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Este curso inclui:</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-gray-300">
                {courseIncludes.map((item, index) => (
                  <div key={index} className="flex items-center">
                    {React.cloneElement(item.icon, { className: "text-gray-400 mr-2 flex-shrink-0" })}
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

           {/* Course Tags (Palavras chave) */}
           {course.tags && course.tags.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Palavras chave:</h2>
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="border-gray-600 text-gray-300 px-3 py-1 hover:bg-gray-700 transition-colors">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Sidebar/Floating Card */}
        <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 lg:sticky lg:top-24 self-start"> {/* Sticky para desktop */}
          <Card className="bg-black/20 border border-white/10 p-6 shadow-xl">
            {course.image_url ? (
              <img 
                src={course.image_url} 
                alt={course.title} 
                className="w-full h-48 object-cover rounded-md mb-6" 
              />
            ) : (
              <div className="w-full h-48 bg-gray-700 rounded-md mb-6 flex items-center justify-center text-white/50">
                Imagem do Curso
              </div>
            )}
            
            {/* Preço - Adicione sua lógica de preço aqui */}
            <div className="text-center text-white text-3xl lg:text-4xl font-bold mb-2">
              Gratuito {/* Ou R$ {course.price} */}
            </div>
            {/* <div className="text-center text-gray-400 text-xl font-bold mb-4 line-through">
              R$ 99,99 // Preço antigo, se houver
            </div> */}
            
            <Button onClick={handleNavigateToLessons} className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3 text-lg mb-4 rounded-md transition-colors">
              Acessar Aulas
            </Button>
            
            <div className="text-xs text-gray-400 text-center">
              Garantia de satisfação de 30 dias (se aplicável)
            </div>
            <Separator className="bg-white/10 my-6" />
            <div className="space-y-2 text-sm text-gray-300">
              <p><span className="font-semibold">Instrutor:</span> {course.instructorName || 'Não especificado'}</p>
              <p><span className="font-semibold">Aulas:</span> {course.lesson_count || 0}</p>
              <p><span className="font-semibold">Duração Total:</span> {course.hours || 'N/A'} horas</p>
              <p><span className="font-semibold">Nível:</span> Todos os níveis</p> {/* Idealmente, viria do DB */}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseContentPage;