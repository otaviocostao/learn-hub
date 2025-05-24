import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import AppSidebar from './AppSidebar';
import { useSidebar } from '../context/SidebarContext';

const MainLayout: React.FC = () => {
  const { isSidebarCollapsed } = useSidebar();

  return (
    <div className="flex h-screen">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main 
          className={`flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-background to-background-dark p-4 transition-all duration-300 ease-in-out`}
          style={{
            marginLeft: isSidebarCollapsed ? '5rem' : '15rem', // Corresponde a w-20 (5rem) e w-60 (15rem) da sidebar
            paddingTop: '4rem' // Corresponde a h-16 (4rem) da Navbar
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout; 