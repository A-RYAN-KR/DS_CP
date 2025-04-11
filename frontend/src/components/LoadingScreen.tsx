import React from 'react';
import { Code2 } from 'lucide-react';

function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center">
      <div className="text-center">
        <Code2 className="h-16 w-16 text-blue-600 animate-pulse mx-auto mb-4" />
        <div className="relative">
          <div className="h-2 w-48 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full animate-loading-bar" />
          </div>
        </div>
        <p className="mt-4 text-gray-600">Initializing Code Detection System</p>
      </div>
    </div>
  );
}

export default LoadingScreen;