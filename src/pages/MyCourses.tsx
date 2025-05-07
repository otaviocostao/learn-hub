import React from 'react';
// import AppSidebar from '@/components/AppSidebar'; // Removido AppSidebar
import { Book, Clock, Star, User } from 'lucide-react';

const MyCourses = () => {
  // Mock data for enrolled courses
  const enrolledCourses = [
    {
      id: 1,
      title: "Modern Web Development Masterclass",
      instructor: "John Smith",
      rating: 4.9,
      reviews: 2400,
      students: 24000,
      hours: 42,
      progress: 36,
      image: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&q=80&w=1000"
    },
    {
      id: 2,
      title: "Advanced JavaScript Patterns",
      instructor: "Sarah Johnson",
      rating: 4.8,
      reviews: 1800,
      students: 15000,
      hours: 28,
      progress: 75,
      image: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=1000"
    },
    {
      id: 3,
      title: "UI/UX Design Fundamentals",
      instructor: "Michael Wong",
      rating: 4.7,
      reviews: 1200,
      students: 9500,
      hours: 24,
      progress: 50,
      image: "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&q=80&w=1000"
    },
    {
      id: 4,
      title: "Data Science for Beginners",
      instructor: "Emma Davis",
      rating: 4.6,
      reviews: 950,
      students: 7800,
      hours: 36,
      progress: 20,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000"
    }
  ];

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
                
                <button className="mt-auto w-full py-2.5 glass-button bg-primary/30 hover:bg-primary/40 text-white font-medium">
                  Continuar
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-panel border border-white/10 mb-10">
          <h2 className="text-xl font-semibold mb-4">Cursos Recomendados para Você</h2>
          <p className="text-white/70 mb-4">Com base em seus interesses e progresso, pensamos que você pode gostar destes cursos.</p>
          
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
            <div className="min-w-[280px] glass-dark rounded-lg overflow-hidden flex flex-col border border-white/5">
              <img 
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1000" 
                alt="React Masterclass" 
                className="w-full h-36 object-cover"
              />
              <div className="p-4">
                <h3 className="font-medium text-sm mb-1">React Masterclass: Estado e Hooks Avançados</h3>
                <p className="text-white/50 text-xs">Sarah Johnson</p>
              </div>
            </div>
            
            <div className="min-w-[280px] glass-dark rounded-lg overflow-hidden flex flex-col border border-white/5">
              <img 
                src="https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&q=80&w=1000" 
                alt="Mobile Development" 
                className="w-full h-36 object-cover"
              />
              <div className="p-4">
                <h3 className="font-medium text-sm mb-1">Desenvolvimento Mobile com Flutter</h3>
                <p className="text-white/50 text-xs">Alex Rivera</p>
              </div>
            </div>
            
            <div className="min-w-[280px] glass-dark rounded-lg overflow-hidden flex flex-col border border-white/5">
              <img 
                src="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=1000" 
                alt="Data Visualization" 
                className="w-full h-36 object-cover"
              />
              <div className="p-4">
                <h3 className="font-medium text-sm mb-1">Visualização de Dados com D3.js</h3>
                <p className="text-white/50 text-xs">Emma Davis</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="glass-panel border border-white/10">
          <h2 className="text-xl font-semibold mb-4">Seu Progresso</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-dark p-4 rounded-lg border border-white/10">
              <h3 className="text-lg font-medium mb-2">Total de Cursos</h3>
              <div className="flex items-center">
                <Book className="h-8 w-8 text-primary mr-3" />
                <span className="text-3xl font-bold">4</span>
              </div>
            </div>
            
            <div className="glass-dark p-4 rounded-lg border border-white/10">
              <h3 className="text-lg font-medium mb-2">Média de Progresso</h3>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <span className="text-primary font-bold">%</span>
                </div>
                <span className="text-3xl font-bold">45.25%</span>
              </div>
            </div>
            
            <div className="glass-dark p-4 rounded-lg border border-white/10">
              <h3 className="text-lg font-medium mb-2">Horas Estudadas</h3>
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-primary mr-3" />
                <span className="text-3xl font-bold">32</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCourses;
