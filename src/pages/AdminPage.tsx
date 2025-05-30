import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  // TableCaption, // Não usado na sugestão abaixo, mas útil para legendas
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Course } from '@/types/course';
import { getAllCourses } from '@/services/course_service';
import { Link } from 'react-router-dom';

const AdminPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoadingCourses(true);
        setError(null);
        const fetchedCourses = await getAllCourses(true); 
        setCourses(fetchedCourses);
      } catch (err) {
        console.error("Erro ao buscar cursos:", err);
        setError(err instanceof Error ? err.message : "Falha ao carregar cursos.");
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className='text-3xl font-bold mb-2'>Cursos: </h2>
        </div>
        <button className="glass-button bg-blue-950 flex items-center gap-2">
          Novo Curso
        </button>
      </div>

      <div className="glass-panel mb-10">
        {loadingCourses ? (
          <p className='text-white/70 text-center py-4'>Carregando cursos...</p>
        ) : error ? (
          <p className='text-red-500 text-center py-4'>Erro: {error}</p>
        ) : courses.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">#</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Instrutor</TableHead>
                <TableHead>Qtd. Aulas</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course, index) => (
                <TableRow key={course.id}> {/* Adicionada a prop key */}
                  <TableCell className="font-medium">{index+1}</TableCell>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>{course.instructorName}</TableCell>
                  <TableCell>{course.lesson_count}</TableCell>
                  <TableCell className="text-right">
                    <Link to={`/admin/course/${course.id}/lesson`}>
                      <button className="glass-button ">
                        Ver mais
                      </button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-white/70 text-center py-4">Nenhum curso encontrado.</p> /* Mensagem mais genérica */
        )}
      </div>
    </div>
  );
};

export default AdminPage;