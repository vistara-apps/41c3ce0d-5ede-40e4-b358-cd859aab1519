'use client'

import { motion } from 'framer-motion'
import { Flame, Award, Star, TrendingUp } from 'lucide-react'
import clsx from 'clsx'
import { Badge } from '@/types'

interface ProgressTrackerProps {
  variant: 'streak' | 'badges'
  data: {
    streakCount?: number
    totalBadges?: number
    unlockedBadges?: Badge[]
    totalPoints?: number
  }
  className?: string
}

export function ProgressTracker({ variant, data, className }: ProgressTrackerProps) {
  if (variant === 'streak') {
    return (
      <StreakTracker
        streakCount={data.streakCount || 0}
        totalPoints={data.totalPoints || 0}
        className={className}
      />
    )
  }

  return (
    <BadgeTracker
      totalBadges={data.totalBadges || 0}
      unlockedBadges={data.unlockedBadges || []}
      className={className}
    />
  )
}

function StreakTracker({
  streakCount,
  totalPoints,
  className,
}: {
  streakCount: number
  totalPoints: number
  className?: string
}) {
  const getStreakMessage = (count: number) => {
    if (count === 0) return "Start your journey today!"
    if (count === 1) return "Great start! Keep it up!"
    if (count < 7) return "Building momentum!"
    if (count < 30) return "You're on fire! 🔥"
    if (count < 100) return "Incredible dedication!"
    return "Legendary resilience! 👑"
  }

  const getStreakColor = (count: number) => {
    if (count === 0) return "text-gray-500"
    if (count < 7) return "text-orange-500"
    if (count < 30) return "text-red-500"
    return "text-purple-500"
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={clsx(
        'bg-surface rounded-lg p-6 shadow-card border border-gray-200',
        className
      )}
    >
      <div className="text-center">
        {/* Streak flame icon */}
        <motion.div
          animate={{ 
            scale: streakCount > 0 ? [1, 1.1, 1] : 1,
            rotate: streakCount > 0 ? [0, 5, -5, 0] : 0
          }}
          transition={{ 
            duration: 2,
            repeat: streakCount > 0 ? Infinity : 0,
            repeatType: "reverse"
          }}
          className="mb-4"
        >
          <div className={clsx(
            'w-16 h-16 rounded-full flex items-center justify-center mx-auto',
            streakCount > 0 ? 'bg-gradient-to-br from-orange-400 to-red-500' : 'bg-gray-200'
          )}>
            <Flame className={clsx(
              'w-8 h-8',
              streakCount > 0 ? 'text-white' : 'text-gray-400'
            )} />
          </div>
        </motion.div>

        {/* Streak count */}
        <motion.div
          key={streakCount}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className="mb-2"
        >
          <span className={clsx(
            'text-4xl font-bold',
            getStreakColor(streakCount)
          )}>
            {streakCount}
          </span>
          <span className="text-text-secondary text-lg ml-1">
            day{streakCount !== 1 ? 's' : ''}
          </span>
        </motion.div>

        {/* Streak message */}
        <p className="text-text-secondary text-sm mb-4">
          {getStreakMessage(streakCount)}
        </p>

        {/* Points display */}
        <div className="flex items-center justify-center space-x-4 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-text-primary font-medium">{totalPoints}</span>
            <span className="text-text-secondary text-sm">points</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-4 h-4 text-accent" />
            <span className="text-text-secondary text-sm">
              {streakCount > 0 ? '+' + (streakCount * 10) : '0'} this streak
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function BadgeTracker({
  totalBadges,
  unlockedBadges,
  className,
}: {
  totalBadges: number
  unlockedBadges: Badge[]
  className?: string
}) {
  const unlockedCount = unlockedBadges.length
  const progressPercentage = totalBadges > 0 ? (unlockedCount / totalBadges) * 100 : 0

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={clsx(
        'bg-surface rounded-lg p-6 shadow-card border border-gray-200',
        className
      )}
    >
      <div className="text-center">
        {/* Badge icon */}
        <div className="mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto">
            <Award className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Badge count */}
        <div className="mb-2">
          <span className="text-4xl font-bold text-yellow-600">
            {unlockedCount}
          </span>
          <span className="text-text-secondary text-lg ml-1">
            / {totalBadges}
          </span>
        </div>

        <p className="text-text-secondary text-sm mb-4">
          Badges earned
        </p>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full"
          />
        </div>

        {/* Recent badges */}
        {unlockedBadges.length > 0 && (
          <div className="pt-4 border-t border-gray-100">
            <p className="text-text-secondary text-xs mb-2">Recent badges:</p>
            <div className="flex justify-center space-x-2">
              {unlockedBadges.slice(0, 3).map((badge, index) => (
                <motion.div
                  key={badge.badgeId}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center"
                  title={badge.name}
                >
                  <span className="text-xs">🏆</span>
                </motion.div>
              ))}
              {unlockedBadges.length > 3 && (
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-xs text-text-secondary">
                    +{unlockedBadges.length - 3}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
