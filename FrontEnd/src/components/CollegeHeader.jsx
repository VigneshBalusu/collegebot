import React from 'react';
import { GraduationCap, Phone, Mail, Menu } from 'lucide-react';

const CollegeHeader = () => {
  const collegeName = "Ramachandra College of Engineering";
  const collegeMotto = "Empowering Through Knowledge";
  const contactEmail = "info@rce.edu.in";
  const contactPhone = "+91 98765 43210";

  return (
    <header className="bg-white shadow-sm">
      {/* Top bar with contact info */}
      <div className="bg-blue-900 text-white py-1 px-4">
        <div className="container mx-auto flex justify-between items-center">
          {/* Contact info */}
          <div className="text-xs md:text-sm flex items-center space-x-4">
            <a
              href={`mailto:${contactEmail}`}
              className="flex items-center hover:text-blue-200 transition-colors"
            >
              <Mail size={14} className="mr-1" />
              <span className="hidden sm:inline">{contactEmail}</span>
            </a>
            <a
              href={`tel:${contactPhone}`}
              className="flex items-center hover:text-blue-200 transition-colors"
            >
              <Phone size={14} className="mr-1" />
              <span>{contactPhone}</span>
            </a>
          </div>

          {/* Quick links */}
          <div className="text-xs">
            <a href="#" className="hover:text-blue-200 transition-colors">Current Students</a>
            <span className="mx-2">|</span>
            <a href="#" className="hover:text-blue-200 transition-colors">Faculty & Staff</a>
            <span className="mx-2">|</span>
            <a href="#" className="hover:text-blue-200 transition-colors">Alumni</a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        {/* Logo and name */}
        <div className="flex items-center">
          <GraduationCap size={36} className="text-blue-800 mr-2" />
          <div>
            <h1 className="font-bold text-xl text-blue-900">
              {collegeName}
            </h1>
            <p className="text-xs text-gray-600 italic">
              {collegeMotto}
            </p>
          </div>
        </div>

        {/* Mobile menu icon (non-functional) */}
        <button className="md:hidden p-2 text-blue-800" aria-label="Open Menu">
          <Menu size={24} />
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li><a href="#" className="text-gray-800 hover:text-blue-800 font-medium">About</a></li>
            <li><a href="#" className="text-gray-800 hover:text-blue-800 font-medium">Academics</a></li>
            <li><a href="#" className="text-gray-800 hover:text-blue-800 font-medium">Admissions</a></li>
            <li><a href="#" className="text-gray-800 hover:text-blue-800 font-medium">Campus Life</a></li>
            <li><a href="#" className="text-gray-800 hover:text-blue-800 font-medium">Athletics</a></li>
            <li><a href="#" className="text-gray-800 hover:text-blue-800 font-medium">Give</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default CollegeHeader;
