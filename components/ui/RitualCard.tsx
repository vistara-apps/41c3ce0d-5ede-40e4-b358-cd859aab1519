'use client'

import { motion } from 'framer-motion'
import { Clock, CheckCircle, Play, Edit3, Trash2 } from 'lucide-react'
import clsx from 'clsx'
import { Ritual } from '@/types'
import { PrimaryButton } from './PrimaryButton'
import { SecondaryButton } from './SecondaryButton'

interface RitualCardProps {
  ritual: Ritual
  variant?: 'active' | 'completed'
  onComplete?: (ritualId: string) => void
  onEdit?: (ritualId: string) => void
  onDelete?: (ritualId: string) => void
  isLoading?: boolean
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

export function RitualCard({
  ritual,
  variant = 'active',
  onComplete,
  onEdit,
  onDelete,
  isLoading = false,
}: RitualCardProps) {
  const isCompleted = variant === 'completed' || ritual.completedToday

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      className={clsx(
        'bg-surface rounded-lg p-4 shadow-card border transition-all duration-200',
        {
          'border-accent/20 shadow-lg': isCompleted,
          'border-gray-200 hover:border-primary/30': !isCompleted,
        }
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">
            {categoryEmojis[ritual.category] || '⭐'}
          </span>
          <div>
            <h3 className="font-semibold text-text-primary text-lg">
              {ritual.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span
                className={clsx(
                  'px-2 py-1 rounded-full text-xs font-medium',
                  difficultyColors[ritual.difficulty]
                )}
              >
                {ritual.difficulty}
              </span>
              <div className="flex items-center text-text-secondary text-sm">
                <Clock className="w-3 h-3 mr-1" />
                {ritual.estimatedDuration}m
              </div>
            </div>
          </div>
        </div>

        {/* Status indicator */}
        {isCompleted && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center justify-center w-8 h-8 bg-accent rounded-full"
          >
            <CheckCircle className="w-5 h-5 text-white" />
          </motion.div>
        )}
      </div>

      {/* Description */}
      <p className="text-text-secondary text-sm mb-4 leading-relaxed">
        {ritual.description}
      </p>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {!isCompleted && onComplete && (
            <PrimaryButton
              size="sm"
              onClick={() => onComplete(ritual.ritualId)}
              leftIcon={<Play className="w-4 h-4" />}
              isLoading={isLoading}
            >
              Start
            </PrimaryButton>
          )}
          
          {isCompleted && (
            <div className="flex items-center text-accent text-sm font-medium">
              <CheckCircle className="w-4 h-4 mr-1" />
              Completed today
            </div>
          )}
        </div>

        <div className="flex items-center space-x-1">
          {onEdit && (
            <SecondaryButton
              size="sm"
              variant="ghost"
              onClick={() => onEdit(ritual.ritualId)}
            >
              <Edit3 className="w-4 h-4" />
            </SecondaryButton>
          )}
          
          {onDelete && (
            <SecondaryButton
              size="sm"
              variant="ghost"
              onClick={() => onDelete(ritual.ritualId)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </SecondaryButton>
          )}
        </div>
      </div>

      {/* Frequency indicator */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <span>Frequency: {ritual.frequency}</span>
          {ritual.startTime && (
            <span>Reminder: {ritual.startTime}</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
