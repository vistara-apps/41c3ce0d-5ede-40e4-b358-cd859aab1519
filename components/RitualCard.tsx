'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Clock, Flame } from 'lucide-react';
import { Ritual } from '@/lib/types';

interface RitualCardProps {
  ritual: Ritual;
  variant?: 'active' | 'completed';
  onComplete?: (ritualId: string) => void;
  streak?: number;
}

export function RitualCard({ 
  ritual, 
  variant = 'active', 
  onComplete,
  streak = 0 
}: RitualCardProps) {
  const isCompleted = variant === 'completed' || ritual.completedToday;
  
  const handleComplete = () => {
    if (!isCompleted && onComplete) {
      onComplete(ritual.ritualId);
    }
  };

  return (
    <motion.div
      className={`ritual-card ${isCompleted ? 'completed' : ''}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleComplete}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 bg-gradient-to-r ${ritual.color} rounded-lg text-2xl`}>
            {ritual.icon}
          </div>
          <div>
            <h3 className="font-semibold text-white">{ritual.name}</h3>
            <p className="text-sm text-gray-300">{ritual.description}</p>
          </div>
        </div>
        
        {isCompleted ? (
          <CheckCircle className="w-6 h-6 text-green-400" />
        ) : (
          <Clock className="w-6 h-6 text-gray-400" />
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-sm text-gray-300">
            <Clock className="w-4 h-4" />
            <span>{ritual.startTime}</span>
          </div>
          
          {streak > 0 && (
            <div className="flex items-center space-x-1 text-sm text-orange-400">
              <Flame className="w-4 h-4" />
              <span>{streak} day streak</span>
            </div>
          )}
        </div>
        
        <div className="text-xs text-gray-400 capitalize">
          {ritual.frequency}
        </div>
      </div>
      
      {!isCompleted && (
        <motion.button
          className="w-full mt-4 btn-primary"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Complete Ritual
        </motion.button>
      )}
    </motion.div>
  );
}
