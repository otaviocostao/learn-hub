
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="text-center glass-dark rounded-xl p-10 max-w-md border border-white/5 animate-fade-in">
        <h1 className="text-5xl font-bold mb-3 text-gradient">404</h1>
        <h2 className="text-xl font-semibold text-white mb-5">Página não encontrada</h2>
        <p className="text-white/70 mb-6">
          Desculpe, não conseguimos encontrar a página que você está procurando.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center justify-center rounded-md px-6 py-2.5 bg-primary-gradient hover:opacity-90 text-white font-medium transition-opacity"
        >
          Voltar para o Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
