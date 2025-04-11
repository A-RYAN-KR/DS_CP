import React, { useState, useRef } from 'react';
import { Upload, Send, BarChartBig, AlertCircle } from 'lucide-react'; // Updated icons

// Define the structure for a single similar pair from the backend
interface SimilarPair {
  0: string; // student1 ID
  1: string; // student2 ID
  2: number; // similarity score
}

// Define the structure for the analysis results state
interface AnalysisResults {
  similarPairs: SimilarPair[];
  error?: string;
  isLoading: boolean;
}

// API Base URL (configure as needed)
const API_BASE_URL = 'http://127.0.0.1:5000'; // Or your backend server address

function CodeEditor() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python'); // Keep language for context, though backend might not use it
  const [studentId, setStudentId] = useState(''); // State for student ID input

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Analysis State
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults>({
    similarPairs: [],
    isLoading: false,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Submission Logic ---
  const handleCodeSubmit = async () => {
    if (!studentId.trim() || !code.trim()) {
      setSubmitMessage({ type: 'error', text: 'Student ID and code cannot be empty.' });
      return;
    }
    setIsSubmitting(true);
    setSubmitMessage(null); // Clear previous messages

    try {
      const response = await fetch(`${API_BASE_URL}/submit_code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ student_id: studentId, code: code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      setSubmitMessage({ type: 'success', text: 'Code submitted successfully!' });
      // Optionally clear fields after successful submission
      // setCode('');
      // setStudentId('');

    } catch (error: any) {
      console.error('Submission error:', error);
      setSubmitMessage({ type: 'error', text: `Submission failed: ${error.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Analysis Logic ---
  const handleTriggerAnalysis = async () => {
    setAnalysisResults({ similarPairs: [], isLoading: true, error: undefined }); // Reset and start loading

    try {
      const response = await fetch(`${API_BASE_URL}/detect_plagiarism`, {
        method: 'GET',
      });

      const data = await response.json();

      if (!response.ok) {
        // Try to get error from backend response, fallback to status text
        const errorMsg = data?.error || response.statusText || `HTTP error! status: ${response.status}`;
        throw new Error(errorMsg);
      }

      // Ensure the response structure is correct
      if (!data || !Array.isArray(data.similar_pairs)) {
        console.warn("Unexpected response format from /detect_plagiarism:", data);
        throw new Error("Received unexpected data format from server.");
      }


      setAnalysisResults({
        similarPairs: data.similar_pairs || [], // Use empty array if missing
        isLoading: false,
      });

    } catch (error: any) {
      console.error('Analysis error:', error);
      setAnalysisResults({
        similarPairs: [],
        isLoading: false,
        error: `Analysis failed: ${error.message}`,
      });
    }
  };

  // --- File Upload Logic ---
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCode(content);
        setSubmitMessage(null); // Clear message when new file is loaded
      };
      reader.readAsText(file);
      // Reset file input value so the same file can be uploaded again
      event.target.value = '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
      {/* Language and Upload Section */}
      <div className="flex justify-between items-center">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {/* Add relevant languages your backend can potentially handle */}
          <option value="python">Python</option>
          {/* Add other languages if your backend AST parser supports them */}
          {/* <option value="javascript">JavaScript</option> */}
          {/* <option value="java">Java</option> */}
          {/* <option value="cpp">C++</option> */}
        </select>
        <div className="flex space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".py,.js,.java,.cpp,.txt" // Adjust accepted types based on backend
          />
          <button
            onClick={handleUploadClick}
            title="Upload code from file"
            className="flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Upload className="h-5 w-5 mr-2" />
            Upload Code
          </button>
        </div>
      </div>

      {/* Code Editor Area */}
      <div>
        <label htmlFor="code-textarea" className="block text-sm font-medium text-gray-700 mb-1">
          Code Editor ({language})
        </label>
        <textarea
          id="code-textarea"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setSubmitMessage(null); // Clear message on typing
          }}
          placeholder={`Enter or upload your ${language} code here...`}
          className="w-full h-64 p-4 font-mono text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Student Submission Section */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Student Submission</h3>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-grow">
            <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">
              Student PRN
            </label>
            <input
              type="text"
              id="studentId"
              value={studentId}
              onChange={(e) => {
                setStudentId(e.target.value);
                setSubmitMessage(null); // Clear message on typing
              }}
              placeholder="Enter your Student PRN (e.g., 123456)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleCodeSubmit}
            disabled={isSubmitting || !code || !studentId}
            className={`mt-4 sm:mt-0 sm:self-end flex items-center justify-center px-6 py-2 rounded-lg font-medium transition-colors ${isSubmitting || !code || !studentId
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
          >
            <Send className="h-5 w-5 mr-2" />
            {isSubmitting ? 'Submitting...' : 'Submit Code'}
          </button>
        </div>
        {/* Submission Feedback Message */}
        {submitMessage && (
          <div className={`mt-3 p-3 rounded-md text-sm ${submitMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {submitMessage.text}
          </div>
        )}
      </div>

      {/* Teacher Analysis Section */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Teacher Analysis</h3>
        <div className="flex flex-col items-start gap-4">
          <p className="text-sm text-gray-600">
            Click the button below to analyze all submitted code for similarities.
            <br />
            <span className="font-semibold text-orange-600">Note:</span> The current backend analysis likely only supports Python code due to AST parsing. Submissions in other languages might be ignored or cause errors during analysis.
          </p>
          <button
            onClick={handleTriggerAnalysis}
            disabled={analysisResults.isLoading}
            className={`flex items-center justify-center px-6 py-2 rounded-lg font-medium transition-colors ${analysisResults.isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
          >
            <BarChartBig className="h-5 w-5 mr-2" />
            {analysisResults.isLoading ? 'Analyzing...' : 'Analyze All Submissions'}
          </button>

          {/* Analysis Results Display */}
          {analysisResults.isLoading && (
            <div className="mt-4 text-gray-600">Loading analysis results...</div>
          )}
          {analysisResults.error && (
            <div className="mt-4 p-3 rounded-md text-sm bg-red-100 text-red-800 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <span>{analysisResults.error}</span>
            </div>
          )}
          {!analysisResults.isLoading && !analysisResults.error && analysisResults.similarPairs.length > 0 && (
            <div className="mt-4 w-full space-y-3">
              <h4 className="text-md font-semibold text-gray-700">Similarity Results (Threshold: 90%):</h4>
              <ul className="list-disc list-inside bg-white p-4 rounded border border-gray-200 shadow-sm">
                {analysisResults.similarPairs.map((pair, index) => (
                  <li key={index} className="text-sm text-gray-800 mb-1">
                    <span className="font-medium">{pair[0]}</span> and <span className="font-medium">{pair[1]}</span>: Similarity <span className="font-semibold text-red-600">{(pair[2] * 100).toFixed(1)}%</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {!analysisResults.isLoading && !analysisResults.error && analysisResults.similarPairs.length === 0 && analysisResults.similarPairs !== null && !analysisResults.isLoading && (
            // Show this only after loading is finished and there are no errors/pairs
            <div className="mt-4 text-gray-600">No significant similarities found above the threshold among the submissions.</div>
          )

          }
        </div>
      </div>

    </div>
  );
}

export default CodeEditor;