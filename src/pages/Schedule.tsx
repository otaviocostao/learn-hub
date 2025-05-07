import React, { useState } from 'react';
import AppSidebar from '@/components/AppSidebar';
import Navbar from '@/components/Navbar';
import { Calendar as CalendarIcon, Clock, Video, BookOpen } from 'lucide-react';

const Schedule = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const today = new Date();
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDayOfWeek = today.getDay();
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  const scheduleItems = [
    {
      id: 1,
      title: 'Advanced JavaScript: Functions',
      type: 'Live Session',
      icon: <Video className="w-4 h-4 text-green-400" />,
      time: '10:00 AM - 11:30 AM',
      day: currentDayOfWeek,
    },
    {
      id: 2,
      title: 'Responsive Design Principles',
      type: 'Assignment Due',
      icon: <BookOpen className="w-4 h-4 text-yellow-400" />,
      time: '11:59 PM',
      day: currentDayOfWeek,
    },
    {
      id: 3,
      title: 'Python Data Structures',
      type: 'Recorded Lecture',
      icon: <Video className="w-4 h-4 text-blue-400" />,
      time: 'Any time',
      day: (currentDayOfWeek + 1) % 7,
    },
    {
      id: 4,
      title: 'Machine Learning Fundamentals',
      type: 'Live Session',
      icon: <Video className="w-4 h-4 text-green-400" />,
      time: '2:00 PM - 3:30 PM',
      day: (currentDayOfWeek + 1) % 7,
    },
    {
      id: 5,
      title: 'UI/UX Design Workshop',
      type: 'Live Session',
      icon: <Video className="w-4 h-4 text-green-400" />,
      time: '11:00 AM - 1:00 PM',
      day: (currentDayOfWeek + 2) % 7,
    },
    {
      id: 6,
      title: 'Data Visualization Project',
      type: 'Assignment Due',
      icon: <BookOpen className="w-4 h-4 text-yellow-400" />,
      time: '11:59 PM',
      day: (currentDayOfWeek + 2) % 7,
    },
  ];
  
  // Group schedule items by day
  const groupedSchedule: { [key: string]: typeof scheduleItems } = {};
  
  scheduleItems.forEach(item => {
    const dateKey = daysOfWeek[item.day];
    if (!groupedSchedule[dateKey]) {
      groupedSchedule[dateKey] = [];
    }
    groupedSchedule[dateKey].push(item);
  });

  return (
    <div className="flex min-h-screen">
      <AppSidebar isCollapsed={isSidebarCollapsed} toggleCollapse={toggleSidebar} />
      
      <div className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-20' : 'ml-60'}`}>
        <Navbar />
        
        <main className="container mx-auto px-6 py-8 pt-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Your Schedule</h1>
              <p className="text-white/70">Manage your learning timetable</p>
            </div>
            
            <div className="flex space-x-4">
              <button className="glass-button flex items-center gap-2">
                <CalendarIcon size={18} />
                Month View
              </button>
            </div>
          </div>
          
          <div className="glass-panel">
            <div className="flex items-center mb-6">
              <CalendarIcon className="mr-2 text-primary" size={24} />
              <h2 className="text-2xl font-semibold">Upcoming Sessions</h2>
            </div>
            
            <div className="space-y-8">
              {Object.entries(groupedSchedule).map(([day, items]) => (
                <div key={day} className="neo-blur p-6 rounded-xl">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <span className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                      {day.substring(0, 2)}
                    </span>
                    {day} ({formatDate(new Date(today.getTime() + (daysOfWeek.indexOf(day) - currentDayOfWeek) * 86400000))})
                  </h3>
                  
                  <div className="space-y-4">
                    {items.map(item => (
                      <div key={item.id} className="glass-dark p-4 rounded-lg hover:border-white/20 transition-all">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="inline-flex items-center text-white/60 text-sm mb-1.5">
                              {item.icon}
                              <span className="ml-1.5">{item.type}</span>
                            </span>
                            <h4 className="font-medium">{item.title}</h4>
                          </div>
                          <div className="flex items-center text-white/70">
                            <Clock className="w-4 h-4 mr-1.5" />
                            <span className="text-sm">{item.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
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

export default Schedule;
