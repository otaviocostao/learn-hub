// src/components/AppSidebar.tsx

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, Book, BookOpen, Settings, HelpCircle, LogOut, 
  ChevronsLeft, ChevronsRight, User // Adicionado ícone de User
} from 'lucide-react';
import { useSidebar } from '../context/SidebarContext';
import { useAuth } from '../context/AuthContext';
import { auth as firebaseAuth } from '@/services/firebase_config';

interface AppSidebarProps {
  // isCollapsed: boolean;
  // toggleCollapse: () => void;
}

const AppSidebar: React.FC<AppSidebarProps> = () => {
  const { isSidebarCollapsed, setIsSidebarCollapsed } = useSidebar();
  const { currentUser, userProfile, isAdmin } = useAuth(); // loadingAuth pode ser removido se não for usado para um estado de loading da sidebar
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { title: 'Dashboard', icon: <Home className="sidebar-icon" />, path: '/' },
    { title: 'Descobrir', icon: <BookOpen className="sidebar-icon" />, path: '/discover' },
    { title: 'Meus Cursos', icon: <Book className="sidebar-icon" />, path: '/my-courses' },
  ];

  const handleLogout = async () => {
    try {
      await firebaseAuth.signOut();
      navigate('/login');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const displayName = userProfile?.name || currentUser?.displayName || 'Usuário';
  // Você pode decidir qual informação secundária exibir, se houver.
  // Exemplo: exibir 'Admin' se for admin, ou o email.
  let secondaryInfo = userProfile?.email || currentUser?.email || '';
  if (isAdmin && !isSidebarCollapsed) { // Só mostra 'Admin' se não estiver colapsado e for admin
    secondaryInfo = 'Admin';
  }


  return (
    <aside 
      className={`h-screen bg-black/30 backdrop-blur-2xl fixed left-0 top-0 border-r border-white/5 flex flex-col z-10 transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'w-20' : 'w-60'
      }`}
    >
      {/* Header da Sidebar */}
      <div className={`p-5 border-b border-white/5 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isSidebarCollapsed && <h1 className="text-2xl font-bold text-gradient whitespace-nowrap">LearnHub</h1>}
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
          className="text-white/70 hover:text-white transition-colors p-1 -mr-2"
          aria-label={isSidebarCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        >
          {isSidebarCollapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
        </button>
      </div>
      
      {/* Seção do Perfil do Usuário (Simplificada) */}
      {currentUser && (
        <div className={`flex flex-col items-center border-b border-white/5 ${isSidebarCollapsed ? 'py-4' : 'p-4'}`}>
          {isSidebarCollapsed ? (
            // Ícone de usuário quando colapsado
            <div className="p-2 text-white/80" title={displayName}>
              <User size={24} />
            </div>
          ) : (
            // Nome e informação secundária quando expandido
            <>
              <div className="p-2 mb-1 text-white/80" title={displayName}>
                  <User size={28} /> {/* Ícone maior quando expandido */}
              </div>
              <h3 className="font-medium text-white whitespace-nowrap truncate max-w-[180px]" title={displayName}>
                {displayName}
              </h3>
              {secondaryInfo && (
                <p className="text-xs text-white/70 whitespace-nowrap truncate max-w-[180px]" title={secondaryInfo}>
                  {secondaryInfo}
                </p>  
              )}
            </>
          )}
        </div>
      )}
      
      {/* Itens do Menu */}
      <div className={`p-2 flex-grow overflow-y-auto ${isSidebarCollapsed ? 'overflow-x-hidden' : ''}`}>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.title}
              to={item.path}
              title={isSidebarCollapsed ? item.title : undefined}
              className={`flex items-center px-3 py-2.5 rounded-md text-sm group transition-colors ${
                isActive(item.path)
                ? 'bg-white/10 text-primary backdrop-blur-sm border border-white/10' 
                : 'text-white/80 hover:bg-white/5 hover:text-white'
              } ${isSidebarCollapsed ? 'justify-center' : ''}`}
            >
              {React.cloneElement(item.icon, { className: `sidebar-icon transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'mr-0' : 'mr-3'}` })}
              {!isSidebarCollapsed && <span className="whitespace-nowrap transition-opacity duration-200 ease-in-out">{item.title}</span>}
            </Link>
          ))}
        </nav>
      </div>
      
      {/* Ações no Rodapé da Sidebar */}
      {currentUser && (
        <div className={`mt-auto border-t border-white/5 p-2 ${isSidebarCollapsed ? 'py-2' : 'p-4'}`}>
          <Link 
            to="/settings"
            title={isSidebarCollapsed ? "Configurações" : undefined}
            className={`flex items-center px-3 py-2.5 rounded-md text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors ${isSidebarCollapsed ? 'justify-center' : ''}`}
          >
            <Settings className={`sidebar-icon transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'mr-0' : 'mr-3'}`} />
            {!isSidebarCollapsed && <span className="whitespace-nowrap transition-opacity duration-200 ease-in-out">Configurações</span>}
          </Link>
          <Link 
            to="/help"
            title={isSidebarCollapsed ? "Ajuda e Suporte" : undefined}
            className={`flex items-center px-3 py-2.5 rounded-md text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors ${isSidebarCollapsed ? 'justify-center' : ''}`}
          >
            <HelpCircle className={`sidebar-icon transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'mr-0' : 'mr-3'}`} />
            {!isSidebarCollapsed && <span className="whitespace-nowrap transition-opacity duration-200 ease-in-out">Ajuda & Suporte</span>}
          </Link>
          <button
            onClick={handleLogout}
            title={isSidebarCollapsed ? "Sair" : undefined}
            className={`w-full flex items-center px-3 py-2.5 rounded-md text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors ${isSidebarCollapsed ? 'justify-center' : ''}`}
          >
            <LogOut className={`sidebar-icon transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'mr-0' : 'mr-3'}`} />
            {!isSidebarCollapsed && <span className="whitespace-nowrap transition-opacity duration-200 ease-in-out">Sair</span>}
          </button>
        </div>
      )}
    </aside>
  );
};

export default AppSidebar;