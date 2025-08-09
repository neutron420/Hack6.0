'use client';

import { useState } from 'react';
import { QAForm } from '@/components/QAForm';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { fetchAnswers, QAResponse } from '@/services/api';
import { Brain, Shield, Zap, Users, Github, Mail, Heart } from 'lucide-react';
import { Navbar } from '@/components/Navbar';

const documents = [
  'CHOTGDP23004V012223.pdf',
  'EDLHLGA23009V012223.pdf',
  'HDFHLIP23024V072223.pdf',
  'ICIHLIP22012V012223.pdf',
  'BAJHLIP23020V012223.pdf',
];

export default function Home() {
  const [answers, setAnswers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (document: string, questions: string[]) => {
    if (questions.length === 0) {
      setError('Please enter at least one question.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnswers([]);

    try {
      const data: QAResponse = await fetchAnswers({ documents: document, questions });
      setAnswers(data.answers);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Geometric Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-4 h-4 bg-indigo-400 rounded-full opacity-20"></div>
        <div className="absolute top-32 right-20 w-2 h-2 bg-purple-400 rounded-full opacity-30"></div>
        <div className="absolute top-60 left-1/4 w-3 h-3 bg-blue-400 rounded-full opacity-25"></div>
        <div className="absolute bottom-40 right-10 w-5 h-5 bg-cyan-400 rounded-full opacity-20"></div>
        <div className="absolute bottom-20 left-1/3 w-2 h-2 bg-teal-400 rounded-full opacity-30"></div>
        
        {/* Geometric Shapes */}
        <div className="absolute top-40 right-1/3 w-12 h-12 border border-indigo-200 rotate-45 opacity-20"></div>
        <div className="absolute bottom-60 left-20 w-8 h-8 border border-purple-200 rotate-12 opacity-25"></div>
        <div className="absolute top-1/2 right-16 w-6 h-16 bg-blue-100 opacity-20 rounded-full"></div>
      </div>

      <main className="relative z-10 flex min-h-screen flex-col">
        {/* Header Section */}
        <div className="flex-grow p-4 sm:p-8">
          <div className="w-full max-w-7xl mx-auto">
            {/* Hero Section */}
            <header className="text-center mb-12 pt-16">
              <div className="inline-flex items-center space-x-3 mb-6">
                <div className="p-3 bg-indigo-100 rounded-2xl">
                  <Brain className="w-8 h-8 text-indigo-600" />
                </div>
                <div className="h-8 w-px bg-gray-300"></div>
                <div className="p-3 bg-purple-100 rounded-2xl">
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              
              <h1 className="text-5xl sm:text-6xl font-bold text-slate-800 tracking-tight mb-4">
                Intelligent Document
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600">
                  Q&A Assistant
                </span>
              </h1>
              
              <p className="mt-6 text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Transform your insurance policy documents into an intelligent conversation. 
                Get instant, accurate answers to your coverage questions with AI-powered analysis.
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-slate-700">Instant Answers</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-slate-700">Policy Expert</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200">
                  <Brain className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-slate-700">AI Powered</span>
                </div>
              </div>
            </header>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Left Column - QA Form */}
              <div className="order-2 lg:order-1">
                <QAForm 
                  documents={documents} 
                  onSubmit={handleFormSubmit} 
                  isLoading={isLoading} 
                />
              </div>
              
              {/* Right Column - Results */}
              <div className="order-1 lg:order-2">
                <ResultsDisplay 
                  answers={answers} 
                  isLoading={isLoading} 
                  error={error} 
                />
              </div>
            </div>

            {/* Stats Section */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-200">
                <div className="text-3xl font-bold text-slate-800 mb-2">5+</div>
                <div className="text-slate-600 font-medium">Policy Documents</div>
              </div>
              <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-200">
                <div className="text-3xl font-bold text-slate-800 mb-2">99%</div>
                <div className="text-slate-600 font-medium">Accuracy Rate</div>
              </div>
              <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-200">
                <div className="text-3xl font-bold text-slate-800 mb-2">24/7</div>
                <div className="text-slate-600 font-medium">Available</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-20 bg-slate-800 text-slate-300 mt-20">
          <div className="max-w-6xl mx-auto px-6 py-12">
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              {/* Brand Section */}
              <div className="md:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-indigo-600 rounded-lg">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">DocuQ&A</h3>
                </div>
                <p className="text-slate-400 mb-4 max-w-md">
                  Revolutionizing document analysis with AI-powered question answering. 
                  Making complex insurance policies simple and accessible.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">
                    <Github className="w-5 h-5" />
                  </a>
                  <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">
                    <Mail className="w-5 h-5" />
                  </a>
                  <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">
                    <Users className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">How it Works</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Supported Documents</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">API Documentation</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="text-white font-semibold mb-4">Support</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Help Center</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Contact Us</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">FAQ</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Terms of Service</a></li>
                </ul>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center">
              <div className="text-slate-400 mb-4 md:mb-0">
                © 2025 DocuQ&A. All rights reserved.
              </div>
              <div className="flex items-center space-x-2 text-slate-400">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-400" />
                <span>for better document understanding</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
