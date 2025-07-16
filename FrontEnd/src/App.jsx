import React from 'react';
import CollegeHeader from './components/CollegeHeader';
import CollegeFooter from './components/CollegeFooter';
import ChatWidget from './components/ChatWidget';
import { BookOpen, Users, Building, Award, Calendar } from 'lucide-react';
import { collegeData } from './data/collegeData';

function App() {
  const totalPrograms = collegeData.academics.degreePrograms.undergraduate + collegeData.academics.degreePrograms.graduate;

  const events = [
    { title: "Fall Open House", date: "October 15", time: "9:00 AM - 3:00 PM", location: "Main Campus" },
    { title: "Graduate Programs Info Session", date: "October 22", time: "6:00 PM - 8:00 PM", location: "Virtual" },
    { title: "Homecoming Weekend", date: "November 5-7", time: "All Day", location: "Campus-wide" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <CollegeHeader />

      {/* Hero Section */}
      <section className="relative h-[500px] bg-gradient-to-r from-blue-900 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg')] bg-cover bg-center opacity-20"></div>
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Your Future at Ramachandra College of Engineering</h1>
            <p className="text-xl mb-8">Illuminating paths to knowledge since {collegeData.generalInfo.founded}.</p>
            <div className="flex flex-wrap gap-4">
              <a href="#" className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-6 rounded-lg transition-colors">Apply Now</a>
              <a href="#" className="border-2 border-white hover:bg-white hover:text-blue-800 text-white font-medium py-3 px-6 rounded-lg transition-colors">Request Information</a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <StatCard icon={<BookOpen size={40} />} value={totalPrograms} label="Degree Programs" />
            <StatCard icon={<Users size={40} />} value={collegeData.generalInfo.studentFacultyRatio} label="Student-Faculty Ratio" />
            <StatCard icon={<Building size={40} />} value={collegeData.generalInfo.campusSize} label="Campus Size" />
            <StatCard icon={<Award size={40} />} value={collegeData.campusLife.studentOrganizations} label="Student Organizations" />
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Academic Excellence</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our wide range of undergraduate and graduate programs designed to prepare you for success in your chosen field.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {collegeData.academics.schools.slice(0, 6).map((school, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-40 bg-gradient-to-r from-blue-800 to-blue-600 flex items-center justify-center p-6">
                  <h3 className="text-xl font-semibold text-white text-center">{school}</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">
                    Offering innovative programs that combine rigorous academics with hands-on learning experiences.
                  </p>
                  <a href="#" className="text-blue-800 font-medium hover:text-blue-600 inline-flex items-center">
                    Explore Programs
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Upcoming Events</h2>
            <a href="#" className="text-blue-800 font-medium hover:text-blue-600 inline-flex items-center">
              View All Events
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <div key={index} className="flex bg-gray-50 rounded-lg shadow-sm overflow-hidden">
                <div className="w-24 bg-blue-800 text-white flex flex-col items-center justify-center py-3">
                  <Calendar size={24} />
                  <div className="text-center mt-2">
                    <span className="block text-sm">OCT</span>
                    <span className="block text-2xl font-bold">{15 + index}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">{event.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{event.date} • {event.time}</p>
                  <p className="text-sm text-gray-600">{event.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-800 to-blue-700 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Begin Your Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Take the first step toward your future by applying or scheduling a campus visit today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#" className="bg-white text-blue-800 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg">Apply Now</a>
            <a href="#" className="border-2 border-white hover:bg-white hover:text-blue-800 text-white font-medium py-3 px-6 rounded-lg">Schedule a Visit</a>
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
