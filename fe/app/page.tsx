"use client";

import React, { useState, useEffect } from 'react';
import { FileText, MessageCircle, Zap, Brain, Upload, Search, Users, Shield, ArrowRight, Sparkles, CheckCircle, Star } from 'lucide-react';

const MainPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const navigateToDashboard = () => {
    window.location.href = '/dashboard';
  };

  const handleGetStarted = () => {
    navigateToDashboard();
  };

  const handleWatchDemo = () => {
    // You can implement demo functionality here
    console.log('Demo clicked');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-gray-200 to-transparent rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-br from-gray-300 to-transparent rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-40 right-1/3 w-64 h-64 bg-gradient-to-br from-gray-200 to-transparent rounded-full opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-lg bg-white/80 border-b border-gray-200/50 sticky top-0">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-black to-gray-800 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300">
                  <Brain className="w-7 h-7 text-white" />
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                DocuMind AI
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-black transition-all duration-300 hover:scale-105 font-medium">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-black transition-all duration-300 hover:scale-105 font-medium">How it Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-black transition-all duration-300 hover:scale-105 font-medium">Pricing</a>
              <button 
                onClick={navigateToDashboard}
                className="bg-gradient-to-r from-black to-gray-800 text-white px-6 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold"
              >
                Dashboard
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Floating Icons */}
          <div className="relative flex justify-center items-center mb-12">
            <div className="absolute animate-float">
              <div className="w-20 h-20 bg-gradient-to-br from-black to-gray-800 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-12">
                <FileText className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="absolute left-20 animate-float-delay-1">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-black rounded-2xl flex items-center justify-center shadow-xl transform -rotate-12">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="absolute right-20 animate-float-delay-2">
              <div className="w-14 h-14 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center shadow-lg transform rotate-45">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 text-sm font-semibold shadow-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Powered by Advanced AI
            </span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-extrabold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Intelligent
            </span>
            <br />
            <span className="bg-gradient-to-r from-black via-gray-800 to-black bg-clip-text text-transparent animate-gradient">
              Document Q&A
            </span>
            <br />
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Assistant
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Transform your insurance policy documents into an intelligent conversation. Get 
            <span className="font-semibold text-gray-800"> instant, accurate answers </span>
            to your coverage questions with our cutting-edge AI technology.
          </p>
          
          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[
              { icon: Zap, text: "Lightning Fast", color: "from-black to-gray-800" },
              { icon: Shield, text: "Bank-Level Security", color: "from-gray-800 to-black" },
              { icon: Brain, text: "GPT-4 Powered", color: "from-gray-700 to-gray-900" },
              { icon: CheckCircle, text: "99.9% Accuracy", color: "from-black to-gray-700" }
            ].map((feature, index) => (
              <div 
                key={index}
                className={`group flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-gray-100 hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
              >
                <div className={`w-8 h-8 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center`}>
                  <feature.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">{feature.text}</span>
              </div>
            ))}
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <button 
              onClick={handleGetStarted}
              className="group relative bg-gradient-to-r from-black to-gray-800 text-white px-10 py-5 rounded-2xl text-lg font-bold shadow-2xl hover:shadow-black/25 transform hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center">
                Go to Dashboard
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button 
              onClick={handleWatchDemo}
              className="group border-2 border-gray-800 text-gray-800 px-10 py-5 rounded-2xl text-lg font-bold hover:bg-gray-800 hover:text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center">
                Watch Demo
                <div className="w-3 h-3 bg-red-500 rounded-full ml-2 group-hover:animate-pulse"></div>
              </span>
            </button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center space-x-8 text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className={`w-8 h-8 rounded-full bg-gradient-to-br from-gray-${300 + i*100} to-gray-${400 + i*100} border-2 border-white`}></div>
                ))}
              </div>
              <span className="text-sm font-medium">2,000+ Happy Users</span>
            </div>
            <div className="flex items-center space-x-1">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-4 h-4 fill-gray-800 text-gray-800" />
              ))}
              <span className="text-sm font-medium ml-2">4.9/5 Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 text-sm font-semibold mb-6">
              <Zap className="w-4 h-4 mr-2" />
              Powerful Features
            </div>
            <h2 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Why Choose DocuMind AI?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of document analysis with our cutting-edge AI technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Upload, title: "Smart Upload", desc: "Drag & drop any document format. Our AI instantly processes and understands your content.", color: "from-black to-gray-800", bg: "from-gray-50 to-gray-100" },
              { icon: Search, title: "Natural Language Search", desc: "Ask questions like you're talking to a human expert. No complex queries needed.", color: "from-gray-800 to-black", bg: "from-gray-50 to-gray-100" },
              { icon: Zap, title: "Instant Insights", desc: "Get comprehensive answers in seconds, not hours. Lightning-fast AI processing.", color: "from-gray-700 to-gray-900", bg: "from-gray-50 to-gray-100" },
              { icon: Brain, title: "Advanced AI", desc: "Powered by the latest language models with deep understanding of insurance policies.", color: "from-black to-gray-700", bg: "from-gray-50 to-gray-100" },
              { icon: Shield, title: "Enterprise Security", desc: "Bank-level encryption and privacy protection. Your documents stay completely secure.", color: "from-gray-800 to-gray-900", bg: "from-gray-50 to-gray-100" },
              { icon: Users, title: "Team Collaboration", desc: "Share insights, collaborate on analysis, and build knowledge bases together.", color: "from-gray-900 to-black", bg: "from-gray-50 to-gray-100" }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="group relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 border border-gray-100 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bg} opacity-0 group-hover:opacity-50 transition-opacity duration-500`}></div>
                <div className="relative">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button 
              onClick={navigateToDashboard}
              className="bg-gradient-to-r from-black to-gray-800 text-white px-10 py-4 rounded-2xl text-lg font-bold shadow-xl hover:shadow-black/25 transform hover:scale-105 transition-all duration-300"
            >
              Try All Features →
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative z-10 py-24 bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gray-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-700/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-extrabold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get started with our simple, intuitive process in just three steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: "01", title: "Upload & Process", desc: "Upload your document and watch our AI analyze every detail in seconds", icon: Upload },
              { step: "02", title: "Ask Anything", desc: "Ask questions in plain English about coverage, terms, or any policy details", icon: MessageCircle },
              { step: "03", title: "Get Expert Answers", desc: "Receive instant, accurate answers with exact references to your document", icon: CheckCircle }
            ].map((item, index) => (
              <div key={index} className="relative group">
                <div className="text-center">
                  <div className="relative mb-8">
                    <div className="w-32 h-32 bg-gradient-to-br from-black to-gray-800 rounded-full flex items-center justify-center mx-auto shadow-2xl transform group-hover:scale-110 transition-all duration-500">
                      <item.icon className="w-16 h-16 text-white" />
                    </div>
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">{item.step}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">{item.title}</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">{item.desc}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-16 -right-6 w-12 h-1 bg-gradient-to-r from-gray-500 to-gray-700 transform rotate-0"></div>
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <button 
              onClick={navigateToDashboard}
              className="bg-white text-gray-900 px-10 py-4 rounded-2xl text-lg font-bold shadow-xl hover:shadow-white/25 transform hover:scale-105 transition-all duration-300"
            >
              Start Now →
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 bg-gradient-to-r from-black via-gray-800 to-black text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-black/20"></div>
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl md:text-6xl font-extrabold mb-8 leading-tight">
            Ready to Transform Your
            <br />
            <span className="bg-gradient-to-r from-gray-300 to-gray-100 bg-clip-text text-transparent">
              Document Analysis?
            </span>
          </h2>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed opacity-90">
            Join thousands of professionals who are already using DocuMind AI to understand their documents better than ever before.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button 
              onClick={navigateToDashboard}
              className="group bg-white text-gray-900 px-10 py-5 rounded-2xl text-lg font-bold shadow-2xl hover:shadow-white/25 transform hover:scale-105 transition-all duration-300"
            >
              <span className="flex items-center">
                Access Dashboard
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button className="border-2 border-white/50 text-white px-10 py-5 rounded-2xl text-lg font-bold hover:bg-white/10 transform hover:scale-105 transition-all duration-300">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-black to-gray-800 rounded-2xl flex items-center justify-center">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <span className="text-2xl font-bold">DocuMind AI</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                The future of intelligent document analysis, powered by cutting-edge AI technology.
              </p>
              <div className="flex space-x-4">
                {['twitter', 'linkedin', 'github'].map(social => (
                  <div key={social} className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer transition-colors">
                    <div className="w-5 h-5 bg-gray-400 rounded"></div>
                  </div>
                ))}
              </div>
              <div className="pt-4">
                <button 
                  onClick={navigateToDashboard}
                  className="bg-gradient-to-r from-black to-gray-800 text-white px-6 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
            
            {[
              { title: "Product", links: ["Features", "Pricing", "API", "Documentation", "Changelog"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Press", "Contact"] },
              { title: "Support", links: ["Help Center", "Privacy Policy", "Terms of Service", "Security", "Status"] }
            ].map((section, index) => (
              <div key={index}>
                <h4 className="font-bold text-lg mb-6">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map(link => (
                    <li key={link}>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform inline-block">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-800 mt-16 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2024 DocuMind AI. All rights reserved. Built with ❤️ for the future of document intelligence.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-delay-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-3deg); }
        }
        @keyframes float-delay-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(8deg); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delay-1 { animation: float-delay-1 8s ease-in-out infinite; }
        .animate-float-delay-2 { animation: float-delay-2 7s ease-in-out infinite; }
        .animate-gradient { 
          background-size: 400% 400%;
          animation: gradient 8s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default MainPage;