// src/App.tsx

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner"; // Renomeie se Sonner já for um tipo de Toaster
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Páginas
import Index from "./pages/Index";
import MyCourses from "./pages/MyCourses";
import Discover from "./pages/Discover";
import NotFound from "./pages/NotFound";
import Lesson from "./pages/Lesson";
import Login from "./pages/Login";
import Registrar from "./pages/Registrar";

// Contexto e Layouts
import { AuthProvider, useAuth } from "./context/AuthContext"; // Importe AuthProvider e useAuth
import { SidebarProvider } from "./context/SidebarContext";
import MainLayout from "./components/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute"; // Importe ProtectedRoute
import CourseContent from "./pages/CourseContent";
import AdminPage from "./pages/AdminPage";
import AdminLesson from "./pages/AdminLessons";

const queryClient = new QueryClient();

// Componente para redirecionar se o usuário já estiver logado e tentar acessar login/registrar
const PublicRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { currentUser, loadingAuth } = useAuth();
  if (loadingAuth) return <div className="flex items-center justify-center min-h-screen"><p>Carregando...</p></div>; // Ou um spinner
  return !currentUser ? children : <Navigate to="/" replace />;
};


const AppContent: React.FC = () => {
  const { loadingAuth } = useAuth(); // Para evitar renderizar rotas antes de saber o estado de auth

  if (loadingAuth) {
    // Mostrar um loader global enquanto o estado de autenticação é verificado
    // Isso evita um flash de conteúdo da página de login antes de redirecionar se já estiver logado
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        <p>Carregando plataforma...</p> {/* Considere um spinner mais elaborado */}
      </div>
    );
  }
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas ou que redirecionam se logado */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/registrar" element={<PublicRoute><Registrar /></PublicRoute>} />

        {/* Rotas Protegidas (dentro do MainLayout) */}
        <Route element={<ProtectedRoute />}> {/* Protege todas as rotas aninhadas */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/my-courses" element={<MyCourses />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/course/:courseId/lesson" element={<Lesson />} />
            <Route path="/course/:courseId" element={<CourseContent />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/course/:courseId/lesson" element={<AdminLesson />} />
            {/* Adicione aqui outras rotas que precisam de autenticação e usam MainLayout */}
            {/* Exemplo de rota apenas para admin:
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin/dashboard" element={<div>Página do Admin</div>} />
            </Route>  
            */}
          </Route>
        </Route>
        
        {/* Rota de NotFound */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider> {/* Envolve tudo com AuthProvider */}
        <SidebarProvider> {/* SidebarProvider dentro de AuthProvider se precisar de dados de auth */}
          <AppContent /> {/* Componente que contém a lógica de roteamento */}
          <Toaster /> {/* Toasters fora do BrowserRouter se não dependerem de rotas */}
          <Sonner />
        </SidebarProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;