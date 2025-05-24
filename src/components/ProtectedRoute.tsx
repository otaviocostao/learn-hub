// src/components/ProtectedRoute.tsx

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext'; // Ajuste o caminho

interface ProtectedRouteProps {
  allowedRoles?: string[]; // Opcional: para restringir acesso baseado em roles
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { currentUser, userProfile, loadingAuth, isAdmin } = useAuth();
  const location = useLocation();

  if (loadingAuth) {
    // Pode mostrar um spinner/loading global aqui enquanto verifica a autenticação
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Verificando autenticação...</p> {/* Substitua por um spinner real */}
      </div>
    );
  }

  if (!currentUser) {
    // Usuário não logado, redireciona para login
    // Passa a localização atual para que possa ser redirecionado de volta após o login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se allowedRoles for fornecido, verifica as roles
  if (allowedRoles) {
    const userHasRequiredRole = userProfile?.roles?.some(role => allowedRoles.includes(role)) || (allowedRoles.includes('admin') && isAdmin);
    if (!userHasRequiredRole) {
      // Usuário não tem a role necessária, redireciona para uma página de "Não Autorizado" ou para a home
      // Por simplicidade, vamos redirecionar para a home
      console.warn(`Usuário ${currentUser.email} não tem permissão para ${location.pathname}. Roles: ${userProfile?.roles?.join(', ')}`);
      return <Navigate to="/" replace />;
    }
  }

  // Usuário logado (e com role permitida, se especificado), renderiza o conteúdo da rota
  return <Outlet />;
};

export default ProtectedRoute;