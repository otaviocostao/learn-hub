import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importando useNavigate
// import AppSidebar from '@/components/AppSidebar'; // Removido AppSidebar
import { Book, Clock, Star, User } from 'lucide-react';
const MyCourses = () => {
  // Mock data for enrolled courses
  const enrolledCourses = [
    {
      id: 1,
      title: "WINDOWS 11: O Guia Completo",
      instructor: "John Smith",
      rating: 4.9,
      reviews: 2400,
      students: 24000,
      hours: 42,
      progress: 36,
      image: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&q=80&w=1000"
    },
  ];
  
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate('/course');
  }
  return (
    <div className="animate-fade-in bg-transparent">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 glass-panel">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gradient">Meus Cursos</h1>
            <div className="flex gap-2">
              <button className="glass-button flex items-center gap-2 text-sm">
                <span>Todos</span>
              </button>
              <button className="glass-button flex items-center gap-2 text-sm">
                <span>Em Progresso</span>
              </button>
              <button className="glass-button flex items-center gap-2 text-sm">
                <span>Concluídos</span>
              </button>
            </div>
          </div>
          <p className="text-white/70">Continue aprendendo de onde você parou. Você tem {enrolledCourses.length} cursos em andamento.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-10">
          {enrolledCourses.map(course => (
            <div key={course.id} className="course-card overflow-hidden flex flex-col h-full">
              <div className="relative">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-3 left-3 flex items-center text-white">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm font-medium">{course.rating}</span>
                    <span className="ml-1 text-xs text-white/70">({course.reviews.toLocaleString()})</span>
                  </div>
                </div>
              </div>
              
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                
                <div className="flex items-center text-sm text-white/70 mb-3">
                  <User className="h-3.5 w-3.5 mr-1" />
                  <span>{course.instructor}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-white/70 mb-1">
                  <div className="flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    <span>{course.hours} horas</span>
                  </div>
                  <span>{course.progress}% completo</span>
                </div>
                
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-4">
                  <div className="progress-bar animate-pulse-light h-full" style={{ width: `${course.progress}%` }}></div>
                </div>
                
                <button onClick={handleNavigate} className="mt-auto w-full py-2.5 glass-button bg-primary/30 hover:bg-primary/40 text-white font-medium">
                  Continuar
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-10">
          {enrolledCourses.map(course => (
            <div key={course.id} className="course-card overflow-hidden flex flex-col h-full">
              <div className="relative">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-3 left-3 flex items-center text-white">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm font-medium">{course.rating}</span>
                    <span className="ml-1 text-xs text-white/70">({course.reviews.toLocaleString()})</span>
                  </div>
                </div>
              </div>
              
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                
                <div className="flex items-center text-sm text-white/70 mb-3">
                  <User className="h-3.5 w-3.5 mr-1" />
                  <span>{course.instructor}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-white/70 mb-1">
                  <div className="flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    <span>{course.hours} horas</span>
                  </div>
                  <span>{course.progress}% completo</span>
                </div>
                
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-4">
                  <div className="progress-bar animate-pulse-light h-full" style={{ width: `${course.progress}%` }}></div>
                </div>
                
                <button onClick={handleNavigate} className="mt-auto w-full py-2.5 glass-button bg-primary/30 hover:bg-primary/40 text-white font-medium">
                  Continuar
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default MyCourses;
