'use client';

import { Brain, ArrowLeft, Menu, Github } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 relative">
          
          {/* Left - Back Button */}
          <div className="flex items-center">
            <button
              onClick={() => window.history.back()}
              className="flex items-center px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span className="font-medium">Back</span>
            </button>
          </div>

          {/* Center - Brand Name */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
            <div className="p-2 bg-black rounded-lg">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-black font-bold text-lg">DocuQ&A</span>
          </div>

          {/* Right - Links */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="/team"
              className="text-black hover:text-gray-600 transition-colors font-medium"
            >
              Team
            </a>
            <a
              href="https://ritesh-singh.gitbook.io/ritesh_singh-docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-gray-600 transition-colors font-medium"
            >
              Docs
            </a>
            <a
              href="https://github.com/neutron420/Hack6.0"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-gray-600 transition-colors"
            >
              <Github className="w-6 h-6" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-5 h-5 text-black" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col space-y-2 p-4">
            <a
              href="/team"
              className="text-black hover:text-gray-600 transition-colors"
            >
              Team
            </a>
            <a
              href="https://ritesh-singh.gitbook.io/ritesh_singh-docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-gray-600 transition-colors"
            >
              Docs
            </a>
            <a
              href="https://github.com/neutron420/Hack6.0"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-gray-600 transition-colors flex items-center space-x-2"
            >
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
