
import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, MessageSquare } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="fixed top-0 right-0 left-60 h-16 px-6 flex items-center justify-between glass-dark border-b border-white/5 z-10">
      <div className="flex items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search courses..."
            className="w-[280px] h-9 rounded-md pl-8 pr-3 glass-input text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
          <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-white/50">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="relative p-2 rounded-full hover:bg-white/5 transition-colors">
          <MessageSquare className="w-5 h-5 text-white/80" />
          <span className="absolute top-0.5 right-0.5 bg-primary w-2 h-2 rounded-full"></span>
        </button>
        
        <button className="relative p-2 rounded-full hover:bg-white/5 transition-colors">
          <Bell className="w-5 h-5 text-white/80" />
          <span className="absolute top-0.5 right-0.5 bg-primary w-2 h-2 rounded-full"></span>
        </button>
        
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
          <img 
            src="https://ui-avatars.com/api/?name=Jane+Doe&background=38BDF8&color=fff" 
            alt="Jane Doe"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
