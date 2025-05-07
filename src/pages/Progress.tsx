import React, { useState } from 'react';
import AppSidebar from '@/components/AppSidebar';
import Navbar from '@/components/Navbar';
import { Activity, Award, Clock, BookOpen, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Progress = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const progressData = [
    { name: 'Week 1', hours: 2.5 },
    { name: 'Week 2', hours: 3.2 },
    { name: 'Week 3', hours: 1.8 },
    { name: 'Week 4', hours: 4.6 },
    { name: 'Week 5', hours: 3.8 },
    { name: 'Week 6', hours: 5.2 },
    { name: 'Week 7', hours: 4.5 },
    { name: 'Week 8', hours: 6.1 },
  ];

  const courseProgress = [
    {
      id: 'course-1',
      title: 'Advanced JavaScript',
      progress: 68,
      totalLessons: 42,
      completedLessons: 28,
      lastActivity: '2 days ago',
    },
    {
      id: 'course-2',
      title: 'Responsive Web Design',
      progress: 45,
      totalLessons: 38,
      completedLessons: 17,
      lastActivity: 'Yesterday',
    },
    {
      id: 'course-3',
      title: 'Python for Data Science',
      progress: 92,
      totalLessons: 56,
      completedLessons: 51,
      lastActivity: 'Today',
    },
    {
      id: 'course-4',
      title: 'UI/UX Design Principles',
      progress: 23,
      totalLessons: 32,
      completedLessons: 7,
      lastActivity: '5 days ago',
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
              <h1 className="text-3xl font-bold mb-2">Your Progress</h1>
              <p className="text-white/70">Track your learning journey</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="glass-panel col-span-1">
              <div className="flex items-center mb-4">
                <Clock className="mr-2 text-primary" size={20} />
                <h3 className="text-lg font-semibold">Study Time</h3>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="text-4xl font-bold mb-1">31.7</div>
                <p className="text-white/70">Hours this month</p>
                <p className="text-green-400 text-sm mt-2">+12% from last month</p>
              </div>
            </div>
            
            <div className="glass-panel col-span-1">
              <div className="flex items-center mb-4">
                <BookOpen className="mr-2 text-primary" size={20} />
                <h3 className="text-lg font-semibold">Courses</h3>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="text-4xl font-bold mb-1">4/7</div>
                <p className="text-white/70">Courses in progress</p>
                <p className="text-white/70 text-sm mt-2">3 completed this year</p>
              </div>
            </div>
            
            <div className="glass-panel col-span-1">
              <div className="flex items-center mb-4">
                <Target className="mr-2 text-primary" size={20} />
                <h3 className="text-lg font-semibold">Goals</h3>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="text-4xl font-bold mb-1">68%</div>
                <p className="text-white/70">Monthly goal progress</p>
                <p className="text-yellow-400 text-sm mt-2">On track</p>
              </div>
            </div>
          </div>
          
          <div className="glass-panel mb-8">
            <div className="flex items-center mb-6">
              <Activity className="mr-2 text-primary" size={24} />
              <h2 className="text-2xl font-semibold">Learning Activity</h2>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={progressData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)' }} 
                    labelStyle={{ color: 'white' }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="hours" 
                    stroke="#38BDF8" 
                    strokeWidth={3} 
                    dot={{ fill: '#38BDF8', strokeWidth: 2, r: 6 }} 
                    activeDot={{ r: 8, fill: '#38BDF8', stroke: 'white' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="glass-panel">
            <div className="flex items-center mb-6">
              <BookOpen className="mr-2 text-primary" size={24} />
              <h2 className="text-2xl font-semibold">Course Progress</h2>
            </div>
            
            <div className="space-y-6">
              {courseProgress.map(course => (
                <div key={course.id} className="neo-blur p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{course.title}</h3>
                    <span className="text-sm text-white/70">Last activity: {course.lastActivity}</span>
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                      <span className="font-medium">{course.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="progress-bar animate-pulse-light" 
                        style={{ width: `${course.progress}%` }}
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

export default Progress;
