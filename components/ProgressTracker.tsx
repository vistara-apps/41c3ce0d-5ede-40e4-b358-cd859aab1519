'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Award, Flame, Target } from 'lucide-react';
import { ProgressStats } from '@/lib/types';

interface ProgressTrackerProps {
  stats: ProgressStats;
  variant?: 'streak' | 'badges';
}

export function ProgressTracker({ stats, variant = 'streak' }: ProgressTrackerProps) {
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (stats.completionRate / 100) * circumference;

  if (variant === 'badges') {
    return (
      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          className="metric-card text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{stats.totalPoints}</div>
          <div className="text-sm text-gray-300">Total Points</div>
        </motion.div>
        
        <motion.div 
          className="metric-card text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{stats.completionRate}%</div>
          <div className="text-sm text-gray-300">Completion Rate</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Progress Overview</h2>
        <TrendingUp className="w-6 h-6 text-green-400" />
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Circular Progress */}
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
                fill="none"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{stats.completionRate}%</div>
                <div className="text-xs text-gray-300">Complete</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="space-y-4">
          <motion.div 
            className="flex items-center justify-between"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-2">
              <Flame className="w-5 h-5 text-orange-400" />
              <span className="text-gray-300">Current Streak</span>
            </div>
            <span className="text-xl font-bold text-white">{stats.currentStreak}</span>
          </motion.div>
          
          <motion.div 
            className="flex items-center justify-between"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-green-400" />
              <span className="text-gray-300">Total Sessions</span>
            </div>
            <span className="text-xl font-bold text-white">{stats.totalSessions}</span>
          </motion.div>
          
          <motion.div 
            className="flex items-center justify-between"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <span className="text-gray-300">Mood Boost</span>
            </div>
            <span className="text-xl font-bold text-white">+{stats.moodImprovement}</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
