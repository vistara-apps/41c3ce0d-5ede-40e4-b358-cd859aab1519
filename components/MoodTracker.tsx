'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Smile, Meh, Frown } from 'lucide-react';
import { MOOD_LABELS } from '@/lib/constants';

interface MoodTrackerProps {
  onMoodSelect: (mood: number) => void;
  label: string;
  initialMood?: number;
}

export function MoodTracker({ onMoodSelect, label, initialMood = 2 }: MoodTrackerProps) {
  const [selectedMood, setSelectedMood] = useState(initialMood);

  const handleMoodSelect = (mood: number) => {
    setSelectedMood(mood);
    onMoodSelect(mood);
  };

  const getMoodIcon = (mood: number) => {
    if (mood <= 1) return <Frown className="w-6 h-6" />;
    if (mood >= 4) return <Smile className="w-6 h-6" />;
    return <Meh className="w-6 h-6" />;
  };

  const getMoodColor = (mood: number) => {
    if (mood <= 1) return 'text-red-400';
    if (mood >= 4) return 'text-green-400';
    return 'text-yellow-400';
  };

  return (
    <div className="glass-card p-4">
      <h3 className="text-lg font-medium text-white mb-4">{label}</h3>
      
      <div className="flex justify-between items-center mb-4">
        {MOOD_LABELS.map((moodLabel, index) => (
          <motion.button
            key={index}
            className={`flex flex-col items-center p-3 rounded-lg transition-all duration-200 ${
              selectedMood === index
                ? 'bg-purple-500 bg-opacity-30 border border-purple-400'
                : 'hover:bg-white hover:bg-opacity-10'
            }`}
            onClick={() => handleMoodSelect(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className={getMoodColor(index)}>
              {getMoodIcon(index)}
            </div>
            <span className="text-xs text-gray-300 mt-1">{moodLabel}</span>
          </motion.button>
        ))}
      </div>
      
      <div className="text-center">
        <div className="text-sm text-gray-300">
          Current mood: <span className="font-medium text-white">{MOOD_LABELS[selectedMood]}</span>
        </div>
      </div>
    </div>
  );
}
