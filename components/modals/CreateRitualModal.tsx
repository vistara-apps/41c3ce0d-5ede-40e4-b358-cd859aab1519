'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, Star, ChevronRight } from 'lucide-react'
import { RitualCategory, RitualTemplate } from '@/types'
import { PrimaryButton } from '@/components/ui/PrimaryButton'
import { SecondaryButton } from '@/components/ui/SecondaryButton'
import { useRitualStore, RITUAL_TEMPLATES } from '@/store/useRitualStore'
import { useUserStore } from '@/store/useUserStore'

interface CreateRitualModalProps {
  onClose: () => void
}

export function CreateRitualModal({ onClose }: CreateRitualModalProps) {
  const [step, setStep] = useState<'templates' | 'custom' | 'details'>('templates')
  const [selectedTemplate, setSelectedTemplate] = useState<RitualTemplate | null>(null)
  const [customRitual, setCustomRitual] = useState({
    name: '',
    description: '',
    category: 'mindfulness' as RitualCategory,
    difficulty: 'easy' as 'easy' | 'medium' | 'hard',
    estimatedDuration: 5,
    frequency: 'daily' as 'daily' | 'weekly' | 'custom',
    startTime: '',
  })
  const [isCreating, setIsCreating] = useState(false)

  const { user } = useUserStore()
  const { createRitual } = useRitualStore()

  const handleTemplateSelect = (template: RitualTemplate) => {
    setSelectedTemplate(template)
    setCustomRitual({
      name: template.name,
      description: template.description,
      category: template.category,
      difficulty: template.difficulty,
      estimatedDuration: template.estimatedDuration,
      frequency: 'daily',
      startTime: '',
    })
    setStep('details')
  }

  const handleCreateCustom = () => {
    setSelectedTemplate(null)
    setStep('custom')
  }

  const handleCustomSubmit = () => {
    if (customRitual.name && customRitual.description) {
      setStep('details')
    }
  }

  const handleCreateRitual = async () => {
    if (!user) return

    setIsCreating(true)
    try {
      await createRitual({
        userId: user.userId,
        name: customRitual.name,
        description: customRitual.description,
        category: customRitual.category,
        difficulty: customRitual.difficulty,
        estimatedDuration: customRitual.estimatedDuration,
        frequency: customRitual.frequency,
        startTime: customRitual.startTime || undefined,
      })
      onClose()
    } finally {
      setIsCreating(false)
    }
  }

  const categoryEmojis = {
    mindfulness: '🧘',
    gratitude: '🙏',
    physical: '💪',
    social: '👥',
    creative: '🎨',
    learning: '📚',
  }

  const difficultyColors = {
    easy: 'text-green-600 bg-green-100',
    medium: 'text-yellow-600 bg-yellow-100',
    hard: 'text-red-600 bg-red-100',
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-surface rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-text-primary">
              Create New Ritual
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          </div>

          {/* Content */}
          {step === 'templates' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium text-text-primary mb-2">
                  Choose a ritual template
                </h3>
                <p className="text-text-secondary text-sm">
                  Start with a proven ritual or create your own
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {RITUAL_TEMPLATES.map((template) => (
                  <motion.button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    whileHover={{ y: -2 }}
                    className="p-4 border border-gray-200 rounded-lg text-left hover:border-primary/30 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">{template.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-medium text-text-primary mb-1">
                          {template.name}
                        </h4>
                        <p className="text-text-secondary text-sm mb-2 line-clamp-2">
                          {template.description}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              difficultyColors[template.difficulty]
                            }`}
                          >
                            {template.difficulty}
                          </span>
                          <div className="flex items-center text-text-secondary text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {template.estimatedDuration}m
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-text-secondary" />
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="text-center">
                <SecondaryButton onClick={handleCreateCustom}>
                  Create Custom Ritual
                </SecondaryButton>
              </div>
            </motion.div>
          )}

          {step === 'custom' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium text-text-primary mb-2">
                  Create Custom Ritual
                </h3>
                <p className="text-text-secondary text-sm">
                  Design a ritual that fits your unique needs
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Ritual Name *
                </label>
                <input
                  type="text"
                  value={customRitual.name}
                  onChange={(e) => setCustomRitual({ ...customRitual, name: e.target.value })}
                  placeholder="e.g., Morning Meditation"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Description *
                </label>
                <textarea
                  value={customRitual.description}
                  onChange={(e) => setCustomRitual({ ...customRitual, description: e.target.value })}
                  placeholder="Describe what this ritual involves..."
                  className="w-full p-3 border border-gray-200 rounded-lg h-24 resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Category
                  </label>
                  <select
                    value={customRitual.category}
                    onChange={(e) => setCustomRitual({ ...customRitual, category: e.target.value as RitualCategory })}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {Object.entries(categoryEmojis).map(([key, emoji]) => (
                      <option key={key} value={key}>
                        {emoji} {key.charAt(0).toUpperCase() + key.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Difficulty
                  </label>
                  <select
                    value={customRitual.difficulty}
                    onChange={(e) => setCustomRitual({ ...customRitual, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Estimated Duration (minutes)
                </label>
                <input
                  type="number"
                  value={customRitual.estimatedDuration}
                  onChange={(e) => setCustomRitual({ ...customRitual, estimatedDuration: parseInt(e.target.value) || 5 })}
                  min="1"
                  max="120"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <SecondaryButton
                  onClick={() => setStep('templates')}
                  variant="ghost"
                >
                  Back
                </SecondaryButton>

                <PrimaryButton
                  onClick={handleCustomSubmit}
                  disabled={!customRitual.name || !customRitual.description}
                >
                  Continue
                </PrimaryButton>
              </div>
            </motion.div>
          )}

          {step === 'details' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium text-text-primary mb-2">
                  Ritual Details
                </h3>
                <p className="text-text-secondary text-sm">
                  Set up your ritual schedule and preferences
                </p>
              </div>

              {/* Ritual Preview */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">
                    {selectedTemplate?.icon || categoryEmojis[customRitual.category]}
                  </span>
                  <div>
                    <h4 className="font-medium text-text-primary">{customRitual.name}</h4>
                    <p className="text-text-secondary text-sm">{customRitual.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          difficultyColors[customRitual.difficulty]
                        }`}
                      >
                        {customRitual.difficulty}
                      </span>
                      <div className="flex items-center text-text-secondary text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {customRitual.estimatedDuration}m
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Frequency
                  </label>
                  <select
                    value={customRitual.frequency}
                    onChange={(e) => setCustomRitual({ ...customRitual, frequency: e.target.value as 'daily' | 'weekly' | 'custom' })}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Reminder Time (Optional)
                  </label>
                  <input
                    type="time"
                    value={customRitual.startTime}
                    onChange={(e) => setCustomRitual({ ...customRitual, startTime: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {selectedTemplate && (
                <div className="bg-accent/10 rounded-lg p-4">
                  <h5 className="font-medium text-accent mb-2">Benefits:</h5>
                  <ul className="text-sm text-text-secondary space-y-1">
                    {selectedTemplate.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center">
                        <Star className="w-3 h-3 text-accent mr-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-between pt-4">
                <SecondaryButton
                  onClick={() => setStep(selectedTemplate ? 'templates' : 'custom')}
                  variant="ghost"
                >
                  Back
                </SecondaryButton>

                <PrimaryButton
                  onClick={handleCreateRitual}
                  isLoading={isCreating}
                >
                  Create Ritual
                </PrimaryButton>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
