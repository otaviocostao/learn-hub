import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Book, LineChart, Calendar, Award, 
  BookOpen, Database, Code, Smartphone, Layout, Brain,
  Settings, HelpCircle, LogOut, ChevronsLeft, ChevronsRight, MoreHorizontal
} from 'lucide-react';
import { useSidebar } from '../context/SidebarContext';

interface AppSidebarProps {
  // isCollapsed: boolean;
  // toggleCollapse: () => void;
}

const AppSidebar: React.FC<AppSidebarProps> = () => {
  const { isSidebarCollapsed, setIsSidebarCollapsed } = useSidebar();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { title: 'Dashboard', icon: <Home className="sidebar-icon" />, path: '/' },
    { title: 'Descobrir', icon: <BookOpen className="sidebar-icon" />, path: '/discover' },
    { title: 'Meus Cursos', icon: <Book className="sidebar-icon" />, path: '/my-courses' },
  ];

  return (
    <aside 
      className={`h-screen bg-black/30 backdrop-blur-2xl fixed left-0 top-0 border-r border-white/5 flex flex-col z-10 transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'w-20' : 'w-60'
      }`}
    >
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
      
      <div className={`flex flex-col items-center p-4 border-b border-white/5 ${isSidebarCollapsed ? 'py-3' : 'p-4'}`}>
        <div className="relative">
          <div className={`rounded-full bg-primary/20 flex items-center justify-center overflow-hidden backdrop-blur-sm border border-white/10 ${isSidebarCollapsed ? 'w-10 h-10' : 'w-16 h-16'}`}>
            <img 
              src="https://ui-avatars.com/api/?name=Jane+Doe&background=38BDF8&color=fff" 
              alt="Jane Doe" 
              className="w-full h-full object-cover"
            />
          </div>
          {!isSidebarCollapsed && <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-black/30"></div>}
        </div>
        {!isSidebarCollapsed && (
          <>
            <h3 className="mt-2 font-medium text-white whitespace-nowrap">Usuário</h3>
            <p className="text-xs text-white/70 whitespace-nowrap">...</p>  
          </>
        )}
      </div>
      
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
        <Link 
          to="/logout"
          title={isSidebarCollapsed ? "Sair" : undefined}
          className={`flex items-center px-3 py-2.5 rounded-md text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors ${isSidebarCollapsed ? 'justify-center' : ''}`}
        >
          <LogOut className={`sidebar-icon transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'mr-0' : 'mr-3'}`} />
          {!isSidebarCollapsed && <span className="whitespace-nowrap transition-opacity duration-200 ease-in-out">Sair</span>}
        </Link>
      </div>
    </aside>
  );
};

export default AppSidebar;
