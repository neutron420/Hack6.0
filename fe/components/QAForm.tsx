'use client';

import { useState, useEffect } from 'react';
import { FileText, MessageSquare, Send, AlertCircle, CheckCircle2, Plus, X, Lightbulb } from 'lucide-react';

interface QAFormProps {
  documents: string[];
  onSubmit: (document: string, questions: string[]) => void;
  isLoading: boolean;
}

export const QAForm = ({ documents, onSubmit, isLoading }: QAFormProps) => {
  const [selectedDoc, setSelectedDoc] = useState<string>(documents[0] || '');
  const [questions, setQuestions] = useState<string>('');
  const [questionCount, setQuestionCount] = useState<number>(0);
  const [errors, setErrors] = useState<{document?: string; questions?: string}>({});
  const [touched, setTouched] = useState<{document?: boolean; questions?: boolean}>({});
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const sampleQuestions = [
    "What is the coverage limit for hospitalization expenses?",
    "What are the exclusions for pre-existing conditions?",
    "What is the claim settlement process and timeline?",
    "What documents are required for filing a claim?",
    "What is the waiting period for different coverage types?",
    "Are there any age-related restrictions or limitations?",
    "What is covered under outpatient treatment?",
    "How does the cashless treatment facility work?",
  ];

  // Update question count whenever questions change
  useEffect(() => {
    const questionList = questions.split('\n').filter((q) => q.trim() !== '');
    setQuestionCount(questionList.length);
  }, [questions]);

  // Validation function
  const validateForm = () => {
    const newErrors: {document?: string; questions?: string} = {};
    
    if (!selectedDoc.trim()) {
      newErrors.document = 'Please select a document';
    }
    
    const questionList = questions.split('\n').filter((q) => q.trim() !== '');
    if (questionList.length === 0) {
      newErrors.questions = 'Please enter at least one question';
    } else if (questionList.length > 10) {
      newErrors.questions = 'Maximum 10 questions allowed';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    // Mark all fields as touched
    setTouched({document: true, questions: true});
    
    if (!validateForm()) {
      return;
    }

    const questionList = questions.split('\n').filter((q) => q.trim() !== '');
    onSubmit(selectedDoc, questionList);
  };

  const handleQuestionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestions(e.target.value);
    if (touched.questions) {
      validateForm();
    }
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDoc(e.target.value);
    if (touched.document) {
      validateForm();
    }
  };

  const handleBlur = (field: 'document' | 'questions') => {
    setTouched(prev => ({...prev, [field]: true}));
    validateForm();
  };

  const addSampleQuestion = (sampleQuestion: string) => {
    const currentQuestions = questions.split('\n').filter(q => q.trim());
    
    // Check if question already exists
    if (currentQuestions.some(q => q.toLowerCase().includes(sampleQuestion.toLowerCase().substring(0, 20)))) {
      return;
    }
    
    if (currentQuestions.length < 10) {
      setQuestions(prev => prev ? `${prev}\n${sampleQuestion}` : sampleQuestion);
    }
  };

  const clearAllQuestions = () => {
    setQuestions('');
    setTouched(prev => ({...prev, questions: false}));
    setErrors(prev => ({...prev, questions: undefined}));
  };

  const formatDocumentName = (doc: string) => {
    // Create a mapping for common insurance company codes to readable names
    const companyMap: { [key: string]: string } = {
      'CHOT': 'Cholamandalam',
      'CHOTGDP': 'Cholamandalam General Insurance',
      'EDLHLGA': 'Edelweiss Health Insurance',
      'HDFHLIP': 'HDFC Life Insurance',
      'ICIHLIP': 'ICICI Lombard Health Insurance',
      'BAJHLIP': 'Bajaj Allianz Health Insurance'
    };
    
    const nameWithoutExt = doc.replace('.pdf', '');
    
    // Try to match company codes
    for (const [code, name] of Object.entries(companyMap)) {
      if (nameWithoutExt.startsWith(code)) {
        const remainder = nameWithoutExt.replace(code, '').replace(/^[0-9V]+/, '');
        const year = nameWithoutExt.match(/202\d/)?.[0] || '';
        return `${name} Policy${year ? ` - ${year}` : ''}`;
      }
    }
    
    // Fallback formatting if no match
    return nameWithoutExt
      .replace(/([A-Z]{3,})/g, ' $1')
      .replace(/([0-9]{4,})/g, ' $1')
      .replace(/([A-Z])([0-9])/g, '$1 $2')
      .replace(/([0-9])([A-Z])/g, '$1 $2')
      .trim()
      .split(' ')
      .filter(word => word.length > 0)
      .map(word => {
        if (word.length > 2 && !(/^\d+$/.test(word))) {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
        return word;
      })
      .join(' ');
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-800 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <MessageSquare className="w-5 h-5 text-indigo-300" />
          </div>
          <h2 className="text-xl font-semibold text-white">Ask Your Questions</h2>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        <div className="space-y-6">
          {/* Document Selection */}
          <div className="space-y-3">
            <label htmlFor="document" className="flex items-center space-x-2 text-sm font-semibold text-slate-700">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Select Policy Document</span>
            </label>
            <div className="relative">
              <select
                id="document"
                value={selectedDoc}
                onChange={handleDocumentChange}
                onBlur={() => handleBlur('document')}
                className={`w-full pl-4 pr-12 py-3 text-base border-2 rounded-xl focus:outline-none transition-all duration-200 appearance-none cursor-pointer text-slate-900 ${
                  errors.document && touched.document
                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white hover:bg-slate-50'
                }`}
              >
                <option value="" disabled className="text-slate-500">Choose a policy document...</option>
                {documents.map((doc) => (
                  <option key={doc} value={doc} className="text-slate-900 bg-white">
                    {formatDocumentName(doc)}
                  </option>
                ))}
              </select>
              
              {/* Custom dropdown arrow */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                {selectedDoc && !errors.document ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </div>
            </div>
            {errors.document && touched.document && (
              <div className="flex items-center space-x-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.document}</span>
              </div>
            )}
          </div>

          {/* Questions Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="questions" className="flex items-center space-x-2 text-sm font-semibold text-slate-700">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <span>Enter Your Questions</span>
              </label>
              <div className="flex items-center space-x-3">
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                  questionCount === 0 ? 'bg-slate-100 text-slate-500' :
                  questionCount <= 5 ? 'bg-emerald-100 text-emerald-700' :
                  questionCount <= 10 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {questionCount}/10 questions
                </span>
                {questionCount > 0 && (
                  <button
                    type="button"
                    onClick={clearAllQuestions}
                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
            
            <div className="relative">
              <textarea
                id="questions"
                rows={8}
                value={questions}
                onChange={handleQuestionsChange}
                onBlur={() => handleBlur('questions')}
                className={`w-full p-4 text-base border-2 rounded-xl focus:outline-none transition-all duration-200 resize-none text-slate-900 ${
                  errors.questions && touched.questions
                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white hover:bg-slate-50'
                }`}
                placeholder="Enter each question on a new line:

• What is the coverage limit for hospitalization?
• What are the exclusions for pre-existing conditions?
• What is the claim settlement process?
• What documents are required for filing a claim?"
              />
              <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                <span className="text-xs text-slate-400">One question per line</span>
                <button
                  type="button"
                  onClick={() => setShowSuggestions(!showSuggestions)}
                  className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                  title="Show question suggestions"
                >
                  <Lightbulb className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {errors.questions && touched.questions && (
              <div className="flex items-center space-x-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.questions}</span>
              </div>
            )}

            {/* Question Suggestions */}
            {showSuggestions && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-slate-700">💡 Suggested Questions</h4>
                  <button
                    type="button"
                    onClick={() => setShowSuggestions(false)}
                    className="p-1 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid gap-2">
                  {sampleQuestions.slice(0, 6).map((question, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => addSampleQuestion(question)}
                      disabled={questionCount >= 10}
                      className="flex items-center space-x-2 p-2 text-left text-sm text-slate-600 hover:bg-white hover:text-slate-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      <Plus className="w-3 h-3 text-slate-400 group-hover:text-indigo-500" />
                      <span className="line-clamp-1">{question}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading || questionCount === 0}
            className={`w-full flex items-center justify-center space-x-3 py-4 px-6 border border-transparent rounded-xl text-base font-semibold transition-all duration-200 ${
              isLoading || questionCount === 0
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-slate-800 text-white hover:bg-slate-900 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl'
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Analyzing Document...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Get AI Answers</span>
              </>
            )}
          </button>
        </div>

        {/* Helper Section */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <div className="flex items-start space-x-3">
            <div className="p-1 bg-blue-100 rounded-full mt-1">
              <AlertCircle className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-2">Tips for better results:</p>
              <div className="space-y-1 text-blue-700">
                <div>• Be specific about what you want to know</div>
                <div>• Ask about coverage limits, exclusions, and procedures</div>
                <div>• Each question should be on a separate line</div>
                <div>• Use the suggestion button for common questions</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};