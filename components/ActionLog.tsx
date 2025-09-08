'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Award, Calendar, TrendingUp } from 'lucide-react';
import { Session, Badge } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface ActionLogProps {
  sessions: Session[];
  badges: Badge[];
  variant?: 'ritualEntry' | 'badgeEarned';
}

export function ActionLog({ sessions, badges, variant = 'ritualEntry' }: ActionLogProps) {
  const recentSessions = sessions.slice(0, 5);
  const recentBadges = badges.slice(0, 3);

  if (variant === 'badgeEarned') {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Recent Achievements</h3>
          <Award className="w-5 h-5 text-yellow-400" />
        </div>
        
        <div className="space-y-3">
          {recentBadges.map((badge, index) => (
            <motion.div
              key={badge.badgeId}
              className="flex items-center space-x-3 p-3 glass-surface rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="text-2xl">{badge.imageUrl}</div>
              <div className="flex-1">
                <div className="font-medium text-white">{badge.name}</div>
                <div className="text-sm text-gray-300">{badge.description}</div>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-medium ${
                badge.rarity === 'legendary' ? 'bg-yellow-500 text-black' :
                badge.rarity === 'epic' ? 'bg-purple-500 text-white' :
                badge.rarity === 'rare' ? 'bg-blue-500 text-white' :
                'bg-gray-500 text-white'
              }`}>
                {badge.rarity}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
        <Calendar className="w-5 h-5 text-blue-400" />
      </div>
      
      <div className="space-y-3">
        {recentSessions.map((session, index) => (
          <motion.div
            key={session.sessionId}
            className="flex items-center space-x-3 p-3 glass-surface rounded-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-medium text-white">Ritual Completed</div>
              <div className="text-sm text-gray-300">
                {formatDate(session.timestamp)} • +{session.pointsEarned} points
              </div>
            </div>
            {session.moodAfter > session.moodBefore && (
              <div className="flex items-center space-x-1 text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">+{session.moodAfter - session.moodBefore}</span>
              </div>
            )}
          </motion.div>
        ))}
        
        {recentSessions.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No recent activity</p>
            <p className="text-sm">Complete your first ritual to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
