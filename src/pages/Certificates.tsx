import React, { useState } from 'react';
import AppSidebar from '@/components/AppSidebar';
import Navbar from '@/components/Navbar';
import { Award, Download, Share2, Calendar } from 'lucide-react';

const Certificates = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const completedCertificates = [
    {
      id: 'cert-1',
      title: 'Advanced JavaScript',
      issueDate: 'May 15, 2023',
      instructor: 'Sarah Johnson',
      category: 'Web Development',
      credentialId: 'WD-JS-2023-567892',
    },
    {
      id: 'cert-2',
      title: 'Introduction to Python Programming',
      issueDate: 'August 23, 2023',
      instructor: 'Michael Chen',
      category: 'Data Science',
      credentialId: 'DS-PY-2023-129834',
    },
    {
      id: 'cert-3',
      title: 'Responsive Web Design',
      issueDate: 'October 10, 2023',
      instructor: 'Jessica Miller',
      category: 'Web Development',
      credentialId: 'WD-RWD-2023-738291',
    },
  ];

  const inProgressCertificates = [
    {
      id: 'in-prog-1',
      title: 'UI/UX Design Fundamentals',
      progress: 68,
      remaining: '3 courses remaining',
      category: 'UI/UX Design',
    },
    {
      id: 'in-prog-2',
      title: 'Full-Stack Web Development',
      progress: 42,
      remaining: '4 courses remaining',
      category: 'Web Development',
    },
  ];

  return (
    <div className="flex min-h-screen">
      <AppSidebar isCollapsed={isSidebarCollapsed} toggleCollapse={toggleSidebar} />
      
      <div className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-20' : 'ml-60'}`}>
        <Navbar />
        
        <main className="container mx-auto px-6 py-8 pt-20">
          <div className="flex items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Your Certificates</h1>
              <p className="text-white/70">View and share your achievements</p>
            </div>
          </div>
          
          <div className="glass-panel mb-8">
            <div className="flex items-center mb-6">
              <Award className="mr-2 text-primary" size={24} />
              <h2 className="text-2xl font-semibold">Completed Certificates</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedCertificates.map(cert => (
                <div key={cert.id} className="neo-blur rounded-lg overflow-hidden">
                  <div className="p-6 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-b border-white/10">
                    <div className="flex justify-between">
                      <Award className="text-yellow-300 w-10 h-10" />
                      <span className="text-sm text-white/60 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {cert.issueDate}
                      </span>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold">{cert.title}</h3>
                    <p className="text-white/70 mt-1">{cert.instructor}</p>
                  </div>
                  <div className="p-4 bg-black/20">
                    <div className="flex flex-col space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Category:</span>
                        <span>{cert.category}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Credential ID:</span>
                        <span className="text-xs">{cert.credentialId}</span>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button className="glass-button flex-1 flex justify-center items-center py-2">
                        <Download size={16} className="mr-2" />
                        Download
                      </button>
                      <button className="glass-button flex-1 flex justify-center items-center py-2">
                        <Share2 size={16} className="mr-2" />
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="glass-panel">
            <div className="flex items-center mb-6">
              <Award className="mr-2 text-white/70" size={24} />
              <h2 className="text-2xl font-semibold">Certificates in Progress</h2>
            </div>
            
            <div className="space-y-6">
              {inProgressCertificates.map(cert => (
                <div key={cert.id} className="neo-blur p-6 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-lg">{cert.title}</h3>
                    <span className="text-primary px-3 py-1 rounded-full glass-dark text-sm">
                      {cert.category}
                    </span>
                  </div>
                  
                  <p className="text-white/70 mb-4">{cert.remaining}</p>
                  
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/70">Overall Progress</span>
                      <span className="font-medium">{cert.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="progress-bar animate-pulse-light" 
                        style={{ width: `${cert.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Certificates;
