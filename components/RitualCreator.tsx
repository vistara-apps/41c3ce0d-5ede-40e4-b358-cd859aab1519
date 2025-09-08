'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { RITUAL_TEMPLATES } from '@/lib/constants';
import { Ritual } from '@/lib/types';
import { generateId } from '@/lib/utils';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';

interface RitualCreatorProps {
  onCreateRitual: (ritual: Ritual) => void;
}

export function RitualCreator({ onCreateRitual }: RitualCreatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<typeof RITUAL_TEMPLATES[0] | null>(null);
  const [customTime, setCustomTime] = useState('08:00');

  const handleCreateRitual = () => {
    if (!selectedTemplate) return;

    const newRitual: Ritual = {
      ritualId: generateId(),
      userId: 'current-user', // This would come from auth context
      ...selectedTemplate,
      startTime: customTime,
      completedToday: false,
    };

    onCreateRitual(newRitual);
    setIsOpen(false);
    setSelectedTemplate(null);
  };

  return (
    <>
      <motion.button
        className="glass-card p-4 w-full flex items-center justify-center space-x-2 hover:bg-opacity-15 transition-all duration-200"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Plus className="w-5 h-5 text-purple-400" />
        <span className="text-white font-medium">Add New Ritual</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass-card p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Create New Ritual</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Choose a Ritual Template
                  </label>
                  <div className="space-y-2">
                    {RITUAL_TEMPLATES.map((template, index) => (
                      <motion.button
                        key={index}
                        className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
                          selectedTemplate === template
                            ? 'border-purple-400 bg-purple-500 bg-opacity-20'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                        onClick={() => setSelectedTemplate(template)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 bg-gradient-to-r ${template.color} rounded-lg text-lg`}>
                            {template.icon}
                          </div>
                          <div>
                            <div className="font-medium text-white">{template.name}</div>
                            <div className="text-sm text-gray-300">{template.description}</div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {selectedTemplate && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Preferred Time
                    </label>
                    <input
                      type="time"
                      value={customTime}
                      onChange={(e) => setCustomTime(e.target.value)}
                      className="w-full p-3 bg-white bg-opacity-10 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                    />
                  </motion.div>
                )}
              </div>

              <div className="flex space-x-3">
                <SecondaryButton
                  onClick={() => setIsOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </SecondaryButton>
                <PrimaryButton
                  onClick={handleCreateRitual}
                  disabled={!selectedTemplate}
                  className="flex-1"
                >
                  Create Ritual
                </PrimaryButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
