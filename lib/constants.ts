import { Ritual, Badge } from './types';

export const RITUAL_TEMPLATES: Omit<Ritual, 'ritualId' | 'userId' | 'completedToday'>[] = [
  {
    name: 'Gratitude Journaling',
    description: 'Write down 3 things you\'re grateful for today',
    frequency: 'daily',
    startTime: '08:00',
    category: 'gratitude',
    icon: '🙏',
    color: 'from-amber-400 to-orange-500'
  },
  {
    name: 'Mindful Breathing',
    description: '5 minutes of focused breathing meditation',
    frequency: 'daily',
    startTime: '07:00',
    category: 'breathing',
    icon: '🫁',
    color: 'from-blue-400 to-cyan-500'
  },
  {
    name: 'Positive Affirmations',
    description: 'Repeat empowering statements about yourself',
    frequency: 'daily',
    startTime: '09:00',
    category: 'affirmation',
    icon: '💪',
    color: 'from-purple-400 to-pink-500'
  },
  {
    name: 'Mindfulness Check-in',
    description: 'Take a moment to observe your thoughts and feelings',
    frequency: 'daily',
    startTime: '12:00',
    category: 'mindfulness',
    icon: '🧘',
    color: 'from-green-400 to-emerald-500'
  },
  {
    name: 'Reflection Journaling',
    description: 'Write about your day and lessons learned',
    frequency: 'daily',
    startTime: '20:00',
    category: 'journaling',
    icon: '📝',
    color: 'from-indigo-400 to-purple-500'
  }
];

export const BADGES: Badge[] = [
  {
    badgeId: 'first-ritual',
    name: 'First Steps',
    description: 'Complete your first ritual',
    imageUrl: '🌱',
    requirement: 'Complete 1 ritual',
    rarity: 'common'
  },
  {
    badgeId: 'week-warrior',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    imageUrl: '🔥',
    requirement: 'Complete 7 days in a row',
    rarity: 'rare'
  },
  {
    badgeId: 'gratitude-guru',
    name: 'Gratitude Guru',
    description: 'Complete 30 gratitude rituals',
    imageUrl: '🙏',
    requirement: 'Complete 30 gratitude rituals',
    rarity: 'epic'
  },
  {
    badgeId: 'mindful-master',
    name: 'Mindful Master',
    description: 'Complete 50 mindfulness rituals',
    imageUrl: '🧘',
    requirement: 'Complete 50 mindfulness rituals',
    rarity: 'epic'
  },
  {
    badgeId: 'resilience-champion',
    name: 'Resilience Champion',
    description: 'Maintain a 30-day streak',
    imageUrl: '👑',
    requirement: 'Complete 30 days in a row',
    rarity: 'legendary'
  }
];

export const MOOD_LABELS = [
  'Very Low',
  'Low',
  'Neutral',
  'Good',
  'Excellent'
];
