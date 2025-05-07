import React from 'react';
import CourseCard from '@/components/CourseCard';
import { Compass, Filter } from 'lucide-react';

const Discover = () => {
  const popularCourses = [
    {
      id: 'disc-1',
      title: 'Advanced JavaScript: From Fundamentals to Functional Programming',
      instructor: 'Sarah Johnson',
      category: 'Web Development',
      rating: 4.9,
      students: 2450,
      lessons: 42,
    },
    {
      id: 'disc-2',
      title: 'Responsive Web Design Masterclass',
      instructor: 'Michael Torres',
      category: 'Web Development',
      rating: 4.7,
      students: 1890,
      lessons: 38,
    },
    {
      id: 'disc-3',
      title: 'Python for Data Science and Machine Learning',
      instructor: 'Emily Chen',
      category: 'Data Science',
      rating: 4.8,
      students: 3120,
      lessons: 56,
    },
    {
      id: 'disc-4',
      title: 'UI/UX Design Principles',
      instructor: 'Alex Morgan',
      category: 'UI/UX Design',
      rating: 4.6,
      students: 1560,
      lessons: 32,
    },
  ];

  const newCourses = [
    {
      id: 'new-1',
      title: 'Flutter Mobile App Development',
      instructor: 'David Kim',
      category: 'Mobile Development',
      rating: 4.5,
      students: 890,
      lessons: 36,
    },
    {
      id: 'new-2',
      title: 'Machine Learning Fundamentals',
      instructor: 'Priya Sharma',
      category: 'Machine Learning',
      rating: 4.6,
      students: 1230,
      lessons: 45,
    },
    {
      id: 'new-3',
      title: 'GraphQL API Development',
      instructor: 'James Wilson',
      category: 'Web Development',
      rating: 4.7,
      students: 760,
      lessons: 28,
    },
    {
      id: 'new-4',
      title: 'Data Visualization with D3.js',
      instructor: 'Lisa Chen',
      category: 'Data Science',
      rating: 4.5,
      students: 980,
      lessons: 32,
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Discover Courses</h1>
          <p className="text-white/70">Find your next learning adventure</p>
        </div>
        
        <button className="glass-button flex items-center gap-2">
          <Filter size={18} />
          Filter Courses
        </button>
      </div>
      
      <div className="glass-panel mb-10">
        <div className="flex items-center mb-6">
          <Compass className="mr-2 text-primary" size={24} />
          <h2 className="text-2xl font-semibold">Popular Courses</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {popularCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
      
      <div className="glass-panel">
        <div className="flex items-center mb-6">
          <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-2">
            <span className="text-sm font-bold">N</span>
          </span>
          <h2 className="text-2xl font-semibold">New Releases</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {newCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Discover;
