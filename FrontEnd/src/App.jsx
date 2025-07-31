import React from 'react';
import CollegeHeader from './components/CollegeHeader';
import CollegeFooter from './components/CollegeFooter';
import ChatWidget from './components/ChatWidget';
import { BookOpen, Users, Building, Award } from 'lucide-react';

function App() {
  const stats = {
    degreePrograms: 12,
    studentFacultyRatio: '15:1',
    campusSize: '30 acres',
    studentOrganizations: 24,
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <CollegeHeader />

      {/* Hero Section */}
      <section className="relative h-[500px] bg-gradient-to-r from-blue-900 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg')] bg-cover bg-center opacity-20"></div>
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover Your Future at Ramachandra College of Engineering
            </h1>
            <p className="text-xl mb-8">Illuminating paths to knowledge since 2008.</p>
            <div className="flex flex-wrap gap-4">
              <a href="#" className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-6 rounded-lg">Apply Now</a>
              <a href="#" className="border-2 border-white hover:bg-white hover:text-blue-800 text-white font-medium py-3 px-6 rounded-lg">Request Info</a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <StatCard icon={<BookOpen size={40} />} value={stats.degreePrograms} label="Degree Programs" />
            <StatCard icon={<Users size={40} />} value={stats.studentFacultyRatio} label="Student-Faculty Ratio" />
            <StatCard icon={<Building size={40} />} value={stats.campusSize} label="Campus Size" />
            <StatCard icon={<Award size={40} />} value={stats.studentOrganizations} label="Student Organizations" />
          </div>
        </div>
      </section>

      <CollegeFooter />
      <ChatWidget />
    </div>
  );
}

const StatCard = ({ icon, value, label }) => (
  <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-3xl font-bold text-gray-800 mb-2">{value}</h3>
    <p className="text-gray-600">{label}</p>
  </div>
);

export default App;
