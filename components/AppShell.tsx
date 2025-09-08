'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Brain, Menu, Settings2, User } from 'lucide-react';

interface AppShellProps {
  children: ReactNode;
  variant?: 'default' | 'glass';
}

export function AppShell({ children, variant = 'default' }: AppShellProps) {
  const shellClass = variant === 'glass' 
    ? 'glass-surface min-h-screen' 
    : 'min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900';

  return (
    <div className={shellClass}>
      {/* Header */}
      <motion.header 
        className="glass-card mx-4 mt-4 p-4 rounded-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">Resilience Rituals</h1>
              <p className="text-sm text-gray-300">Build unbreakable resilience</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 glass-surface rounded-lg hover:bg-opacity-20 transition-all duration-200">
              <Settings2 className="w-5 h-5 text-gray-300" />
            </button>
            <button className="p-2 glass-surface rounded-lg hover:bg-opacity-20 transition-all duration-200">
              <User className="w-5 h-5 text-gray-300" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container max-w-4xl mx-auto px-4 py-6">
        {children}
      </main>

      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500 rounded-full opacity-10 floating-element"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-pink-500 rounded-full opacity-10 floating-element" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 left-20 w-20 h-20 bg-blue-500 rounded-full opacity-10 floating-element" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-indigo-500 rounded-full opacity-10 floating-element" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
}
