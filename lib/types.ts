export interface User {
  userId: string;
  farcasterId?: string;
  createdAt: Date;
  activeRituals: string[];
  streakCount: number;
  badgesEarned: string[];
  totalPoints: number;
}

export interface Ritual {
  ritualId: string;
  userId: string;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly';
  startTime: string;
  completedToday: boolean;
  category: 'gratitude' | 'mindfulness' | 'affirmation' | 'breathing' | 'journaling';
  icon: string;
  color: string;
}

export interface Session {
  sessionId: string;
  userId: string;
  ritualId: string;
  timestamp: Date;
  moodBefore: number;
  moodAfter: number;
  notes?: string;
  pointsEarned: number;
}

export interface Badge {
  badgeId: string;
  name: string;
  description: string;
  imageUrl: string;
  requirement: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface ProgressStats {
  currentStreak: number;
  longestStreak: number;
  totalSessions: number;
  totalPoints: number;
  completionRate: number;
  moodImprovement: number;
}
