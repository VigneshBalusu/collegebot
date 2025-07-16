import React from 'react';
import {
  GraduationCap,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
} from 'lucide-react';
import { collegeData } from '../data/collegeData';

const CollegeFooter = () => {
  return (
    <footer className="bg-blue-900 text-white pt-8 pb-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and address */}
          <div>
            <div className="flex items-center mb-4">
              <GraduationCap size={32} className="mr-2" />
              <h3 className="font-bold text-lg">{collegeData.generalInfo.name}</h3>
            </div>
            <address className="not-italic text-blue-200 text-sm">
              123 University Drive<br />
              {collegeData.generalInfo.location}<br />
              {collegeData.admissions.contactPhone}
            </address>
            <div className="flex mt-4 space-x-3">
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Academics Links */}
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">
              Academics
            </h4>
            <ul className="space-y-2 text-sm text-blue-200">
              {collegeData.academics.schools.slice(0, 5).map((school, index) => (
                <li key={index}>
                  <a href="#" className="hover:text-white transition-colors">
                    {school}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Info For */}
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">
              Information For
            </h4>
            <ul className="space-y-2 text-sm text-blue-200">
              <li><a href="#" className="hover:text-white transition-colors">Prospective Students</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Current Students</a></li>
              <li><a href="#" className="hover:text-white transition-colors">International Students</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Alumni</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Faculty & Staff</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Parents & Families</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-2 text-sm text-blue-200">
              <li><a href="#" className="hover:text-white transition-colors">Campus Map</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Library</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Academic Calendar</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Safety & Security</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers at Horizon</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Accessibility</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-800 mt-8 pt-4 text-xs text-blue-300 flex flex-col md:flex-row justify-between items-center">
          <div>
            &copy; {new Date().getFullYear()} {collegeData.generalInfo.name}. All rights reserved.
          </div>
          <div className="mt-2 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <span className="mx-2">|</span>
            <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
            <span className="mx-2">|</span>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CollegeFooter;
