import { Brain } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-white bg-opacity-20 rounded w-48 mx-auto animate-pulse"></div>
          <div className="h-4 bg-white bg-opacity-20 rounded w-32 mx-auto animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
