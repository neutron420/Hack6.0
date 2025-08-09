'use client';

import { CheckCircle2, AlertTriangle, BookOpen, Copy, Download, Share2, Clock } from 'lucide-react';
import { useState } from 'react';

interface ResultsDisplayProps {
  answers: string[];
  isLoading: boolean;
  error: string | null;
}

export const ResultsDisplay = ({ answers, isLoading, error }: ResultsDisplayProps) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const copyAllAnswers = async () => {
    const allAnswers = answers.map((answer, index) => `${index + 1}. ${answer}`).join('\n\n');
    try {
      await navigator.clipboard.writeText(allAnswers);
      setCopiedIndex(-1);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy all answers: ', err);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-slate-800 px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Clock className="w-5 h-5 text-white animate-spin" />
            </div>
            <h2 className="text-xl font-semibold text-white">Processing Your Questions</h2>
          </div>
        </div>
        
        <div className="p-8 text-center">
          <div className="relative mx-auto w-16 h-16 mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-slate-600 text-lg mb-4">Analyzing your document with AI...</p>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-red-600 px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Error Occurred</h2>
          </div>
        </div>
        
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h3>
            <p className="text-red-700 leading-relaxed">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (answers.length > 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-slate-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-300" />
              </div>
              <h2 className="text-xl font-semibold text-white">Analysis Complete</h2>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-300 bg-slate-700 px-3 py-1 rounded-full">
                {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
              </span>
              <button
                onClick={copyAllAnswers}
                className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                title="Copy all answers"
              >
                {copiedIndex === -1 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {answers.map((answer, index) => (
              <div key={index} className="group bg-white border-2 border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </div>
                    <h3 className="text-sm font-medium text-slate-700">Answer {index + 1}</h3>
                  </div>
                  <button
                    onClick={() => copyToClipboard(answer, index)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all"
                    title="Copy answer"
                  >
                    {copiedIndex === index ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                
                <div className="text-slate-900 leading-relaxed text-base font-medium">
                  {answer}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap gap-3 pt-6 border-t border-slate-200">
            <button className="flex items-center space-x-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors">
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Export PDF</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors">
              <Share2 className="w-4 h-4" />
              <span className="text-sm font-medium">Share Results</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="bg-slate-800 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/10 rounded-lg">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">Ready for Questions</h2>
        </div>
      </div>
      
      <div className="p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
          <BookOpen className="w-10 h-10 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Ask Your Questions</h3>
        <p className="text-slate-600 leading-relaxed max-w-sm mx-auto">
          Your AI-powered answers will appear here once you submit your questions about the selected document.
        </p>
        
        {/* Quick Tips */}
        <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <h4 className="text-sm font-semibold text-slate-700 mb-3">💡 Quick Tips:</h4>
          <div className="text-sm text-slate-600 space-y-1 text-left">
            <div>• Ask specific questions about coverage limits</div>
            <div>• Inquire about claim procedures</div>
            <div>• Check for exclusions and conditions</div>
            <div>• Understand policy terms and definitions</div>
          </div>
        </div>
      </div>
    </div>
  );
};