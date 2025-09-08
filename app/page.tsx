'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Plus, TrendingUp, Award } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { RitualCard } from '@/components/RitualCard';
import { ProgressTracker } from '@/components/ProgressTracker';
import { ActionLog } from '@/components/ActionLog';
import { RitualCreator } from '@/components/RitualCreator';
import { MoodTracker } from '@/components/MoodTracker';
import { PrimaryButton } from '@/components/PrimaryButton';
import { SecondaryButton } from '@/components/SecondaryButton';
import { RITUAL_TEMPLATES, BADGES } from '@/lib/constants';
import { Ritual, Session, ProgressStats, User } from '@/lib/types';
import { generateId, calculateStreak, calculateMoodImprovement, getCompletionRate } from '@/lib/utils';
import { useMiniKit } from '@coinbase/onchainkit/minikit';

export default function HomePage() {
  const { setFrameReady } = useMiniKit();
  
  // State management
  const [user, setUser] = useState<User>({
    userId: 'demo-user',
    createdAt: new Date(),
    activeRituals: [],
    streakCount: 7,
    badgesEarned: ['first-ritual', 'week-warrior'],
    totalPoints: 350
  });

  const [rituals, setRituals] = useState<Ritual[]>([
    {
      ritualId: '1',
      userId: 'demo-user',
      name: 'Gratitude Journaling',
      description: 'Write down 3 things you\'re grateful for today',
      frequency: 'daily',
      startTime: '08:00',
      completedToday: false,
      category: 'gratitude',
      icon: '🙏',
      color: 'from-amber-400 to-orange-500'
    },
    {
      ritualId: '2',
      userId: 'demo-user',
      name: 'Mindful Breathing',
      description: '5 minutes of focused breathing meditation',
      frequency: 'daily',
      startTime: '07:00',
      completedToday: true,
      category: 'breathing',
      icon: '🫁',
      color: 'from-blue-400 to-cyan-500'
    }
  ]);

  const [sessions, setSessions] = useState<Session[]>([
    {
      sessionId: '1',
      userId: 'demo-user',
      ritualId: '2',
      timestamp: new Date(),
      moodBefore: 2,
      moodAfter: 4,
      pointsEarned: 50
    }
  ]);

  const [showMoodTracker, setShowMoodTracker] = useState(false);
  const [currentRitualId, setCurrentRitualId] = useState<string | null>(null);
  const [moodBefore, setMoodBefore] = useState(2);

  // Initialize MiniKit
  useEffect(() => {
    setFrameReady();
  }, [setFrameReady]);

  // Calculate progress stats
  const progressStats: ProgressStats = {
    currentStreak: calculateStreak(sessions),
    longestStreak: user.streakCount,
    totalSessions: sessions.length,
    totalPoints: user.totalPoints,
    completionRate: getCompletionRate(30, sessions.length), // Last 30 days
    moodImprovement: calculateMoodImprovement(sessions)
  };

  const handleCreateRitual = (newRitual: Ritual) => {
    setRituals(prev => [...prev, newRitual]);
    setUser(prev => ({
      ...prev,
      activeRituals: [...prev.activeRituals, newRitual.ritualId]
    }));
  };

  const handleCompleteRitual = (ritualId: string) => {
    setCurrentRitualId(ritualId);
    setShowMoodTracker(true);
  };

  const handleMoodAfterSelect = (moodAfter: number) => {
    if (!currentRitualId) return;

    // Create new session
    const newSession: Session = {
      sessionId: generateId(),
      userId: user.userId,
      ritualId: currentRitualId,
      timestamp: new Date(),
      moodBefore,
      moodAfter,
      pointsEarned: 50
    };

    // Update sessions
    setSessions(prev => [...prev, newSession]);

    // Mark ritual as completed
    setRituals(prev => prev.map(ritual => 
      ritual.ritualId === currentRitualId 
        ? { ...ritual, completedToday: true }
        : ritual
    ));

    // Update user points
    setUser(prev => ({
      ...prev,
      totalPoints: prev.totalPoints + 50,
      streakCount: prev.streakCount + 1
    }));

    // Reset state
    setShowMoodTracker(false);
    setCurrentRitualId(null);
  };

  const completedRituals = rituals.filter(r => r.completedToday);
  const pendingRituals = rituals.filter(r => !r.completedToday);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Hero Section */}
        <motion.div
          className="text-center py-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative">
            <motion.div
              className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
              animate={{ 
                boxShadow: [
                  '0 0 20px rgba(168, 85, 247, 0.4)',
                  '0 0 40px rgba(168, 85, 247, 0.6)',
                  '0 0 20px rgba(168, 85, 247, 0.4)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Brain className="w-16 h-16 text-white" />
            </motion.div>
            
            <h1 className="text-4xl font-bold gradient-text mb-4">
              Build Resilience Daily
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Transform your emotional strength through small, consistent rituals. 
              Track progress, earn rewards, and build unbreakable resilience.
            </p>
          </div>
        </motion.div>

        {/* Progress Overview */}
        <ProgressTracker stats={progressStats} />

        {/* Today's Rituals */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">Today's Rituals</h2>
            <div className="text-sm text-gray-300">
              {completedRituals.length} of {rituals.length} completed
            </div>
          </div>

          <div className="grid gap-4">
            {pendingRituals.map((ritual) => (
              <RitualCard
                key={ritual.ritualId}
                ritual={ritual}
                onComplete={handleCompleteRitual}
                streak={progressStats.currentStreak}
              />
            ))}
            
            {completedRituals.map((ritual) => (
              <RitualCard
                key={ritual.ritualId}
                ritual={ritual}
                variant="completed"
                streak={progressStats.currentStreak}
              />
            ))}
          </div>

          <RitualCreator onCreateRitual={handleCreateRitual} />
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <ProgressTracker stats={progressStats} variant="badges" />
          <ActionLog sessions={sessions} badges={BADGES} />
        </div>

        {/* Recent Achievements */}
        <ActionLog sessions={sessions} badges={BADGES} variant="badgeEarned" />

        {/* Mood Tracker Modal */}
        {showMoodTracker && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="glass-card p-6 w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <h2 className="text-xl font-semibold text-white mb-6 text-center">
                How are you feeling?
              </h2>
              
              <div className="space-y-6">
                <MoodTracker
                  label="Before the ritual"
                  onMoodSelect={setMoodBefore}
                  initialMood={moodBefore}
                />
                
                <MoodTracker
                  label="After the ritual"
                  onMoodSelect={handleMoodAfterSelect}
                  initialMood={4}
                />
              </div>
              
              <div className="mt-6 text-center">
                <SecondaryButton
                  onClick={() => setShowMoodTracker(false)}
                  variant="ghost"
                >
                  Skip for now
                </SecondaryButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}
