import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MyCourses from "./pages/MyCourses";
import Discover from "./pages/Discover";
import NotFound from "./pages/NotFound";
import { SidebarProvider } from "./context/SidebarContext";
import MainLayout from "./components/MainLayout";
import Lesson from "./pages/Lesson";
import IntroducaoCurso from "./pages/IntroducaoCurso";
import Login from "./pages/Login";
import Registrar from "./pages/Registrar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SidebarProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/registrar" element={<Registrar />} />
            <Route element={<MainLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/my-courses" element={<MyCourses />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/my-courses/course/lesson" element={<Lesson />}/>
              <Route path="/introducao-curso" element={<IntroducaoCurso />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SidebarProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
