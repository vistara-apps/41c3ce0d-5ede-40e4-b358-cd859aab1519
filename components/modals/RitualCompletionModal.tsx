'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, Smile, Meh, Frown, Angry } from 'lucide-react'
import { Ritual, MoodLevel } from '@/types'
import { PrimaryButton } from '@/components/ui/PrimaryButton'
import { SecondaryButton } from '@/components/ui/SecondaryButton'

interface RitualCompletionModalProps {
  ritual: Ritual
  onComplete: (data: {
    moodBefore?: number
    moodAfter?: number
    notes?: string
  }) => void
  onClose: () => void
}

const moodEmojis = {
  1: { icon: Angry, emoji: '😤', label: 'Very Bad', color: 'text-red-500' },
  2: { icon: Frown, emoji: '😔', label: 'Bad', color: 'text-orange-500' },
  3: { icon: Meh, emoji: '😐', label: 'Okay', color: 'text-yellow-500' },
  4: { icon: Smile, emoji: '😊', label: 'Good', color: 'text-green-500' },
  5: { icon: Heart, emoji: '😍', label: 'Excellent', color: 'text-purple-500' },
}

export function RitualCompletionModal({
  ritual,
  onComplete,
  onClose,
}: RitualCompletionModalProps) {
  const [step, setStep] = useState<'before' | 'ritual' | 'after' | 'notes'>('before')
  const [moodBefore, setMoodBefore] = useState<MoodLevel | undefined>()
  const [moodAfter, setMoodAfter] = useState<MoodLevel | undefined>()
  const [notes, setNotes] = useState('')
  const [isCompleting, setIsCompleting] = useState(false)

  const handleNext = () => {
    if (step === 'before') {
      setStep('ritual')
    } else if (step === 'ritual') {
      setStep('after')
    } else if (step === 'after') {
      setStep('notes')
    }
  }

  const handleComplete = async () => {
    setIsCompleting(true)
    try {
      await onComplete({
        moodBefore,
        moodAfter,
        notes: notes.trim() || undefined,
      })
    } finally {
      setIsCompleting(false)
    }
  }

  const canProceed = () => {
    if (step === 'before') return moodBefore !== undefined
    if (step === 'after') return moodAfter !== undefined
    return true
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-surface rounded-lg p-6 w-full max-w-md shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-text-primary">
              Complete Ritual
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex space-x-2">
              {['before', 'ritual', 'after', 'notes'].map((s, index) => (
                <div
                  key={s}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    s === step
                      ? 'bg-primary'
                      : ['before', 'ritual', 'after', 'notes'].indexOf(step) > index
                      ? 'bg-accent'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="min-h-[200px]">
            {step === 'before' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-center"
              >
                <h3 className="text-lg font-medium text-text-primary mb-2">
                  How are you feeling right now?
                </h3>
                <p className="text-text-secondary text-sm mb-6">
                  Rate your current mood before starting the ritual
                </p>
                
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(moodEmojis).map(([value, mood]) => (
                    <button
                      key={value}
                      onClick={() => setMoodBefore(parseInt(value) as MoodLevel)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        moodBefore === parseInt(value)
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{mood.emoji}</div>
                      <div className="text-xs text-text-secondary">{mood.label}</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 'ritual' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-center"
              >
                <div className="text-4xl mb-4">🧘‍♀️</div>
                <h3 className="text-lg font-medium text-text-primary mb-2">
                  {ritual.name}
                </h3>
                <p className="text-text-secondary text-sm mb-6">
                  {ritual.description}
                </p>
                
                <div className="bg-accent/10 rounded-lg p-4 mb-6">
                  <p className="text-accent font-medium text-sm">
                    Take your time and focus on the present moment. 
                    Click "Continue" when you've completed the ritual.
                  </p>
                </div>

                <div className="text-text-secondary text-sm">
                  Estimated duration: {ritual.estimatedDuration} minutes
                </div>
              </motion.div>
            )}

            {step === 'after' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-center"
              >
                <h3 className="text-lg font-medium text-text-primary mb-2">
                  How do you feel now?
                </h3>
                <p className="text-text-secondary text-sm mb-6">
                  Rate your mood after completing the ritual
                </p>
                
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(moodEmojis).map(([value, mood]) => (
                    <button
                      key={value}
                      onClick={() => setMoodAfter(parseInt(value) as MoodLevel)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        moodAfter === parseInt(value)
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{mood.emoji}</div>
                      <div className="text-xs text-text-secondary">{mood.label}</div>
                    </button>
                  ))}
                </div>

                {moodBefore && moodAfter && moodAfter > moodBefore && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-accent/10 rounded-lg"
                  >
                    <p className="text-accent text-sm font-medium">
                      Great! Your mood improved by {moodAfter - moodBefore} point{moodAfter - moodBefore !== 1 ? 's' : ''}! 🎉
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {step === 'notes' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h3 className="text-lg font-medium text-text-primary mb-2">
                  Any reflections?
                </h3>
                <p className="text-text-secondary text-sm mb-4">
                  Optional: Share your thoughts about this ritual session
                </p>
                
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="How did this ritual make you feel? What did you learn about yourself?"
                  className="w-full h-24 p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  maxLength={500}
                />
                
                <div className="text-right text-xs text-text-secondary mt-1">
                  {notes.length}/500
                </div>
              </motion.div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-6">
            <SecondaryButton
              onClick={step === 'before' ? onClose : () => {
                if (step === 'ritual') setStep('before')
                else if (step === 'after') setStep('ritual')
                else if (step === 'notes') setStep('after')
              }}
              variant="ghost"
            >
              {step === 'before' ? 'Cancel' : 'Back'}
            </SecondaryButton>

            <PrimaryButton
              onClick={step === 'notes' ? handleComplete : handleNext}
              disabled={!canProceed()}
              isLoading={isCompleting}
            >
              {step === 'notes' ? 'Complete Ritual' : 'Continue'}
            </PrimaryButton>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
