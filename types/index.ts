// Database Types
export interface User {
  userId: string
  farcasterId?: string
  createdAt: string
  activeRituals: string[]
  streakCount: number
  badgesEarned: string[]
  totalPoints: number
  lastActiveDate?: string
  premiumFeatures: boolean
}

export interface Ritual {
  ritualId: string
  userId: string
  name: string
  description: string
  frequency: 'daily' | 'weekly' | 'custom'
  startTime?: string
  completedToday: boolean
  createdAt: string
  isActive: boolean
  category: RitualCategory
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedDuration: number // in minutes
}

export interface Session {
  sessionId: string
  userId: string
  ritualId: string
  timestamp: string
  moodBefore?: number // 1-5 scale
  moodAfter?: number // 1-5 scale
  notes?: string
  pointsEarned: number
  completed: boolean
}

export interface Badge {
  badgeId: string
  name: string
  description: string
  imageUrl?: string
  category: BadgeCategory
  requirement: string
  pointsRequired?: number
  streakRequired?: number
  isUnlocked: boolean
}

export interface UserBadge {
  userId: string
  badgeId: string
  unlockedAt: string
}

// Enums
export type RitualCategory = 
  | 'mindfulness'
  | 'gratitude'
  | 'physical'
  | 'social'
  | 'creative'
  | 'learning'

export type BadgeCategory =
  | 'streak'
  | 'completion'
  | 'milestone'
  | 'special'

export type MoodLevel = 1 | 2 | 3 | 4 | 5

// UI Component Props
export interface RitualCardProps {
  ritual: Ritual
  variant?: 'active' | 'completed'
  onComplete?: (ritualId: string) => void
  onEdit?: (ritualId: string) => void
}

export interface ProgressTrackerProps {
  variant: 'streak' | 'badges'
  data: {
    streakCount?: number
    totalBadges?: number
    unlockedBadges?: Badge[]
    totalPoints?: number
  }
}

export interface ActionLogProps {
  variant: 'ritualEntry' | 'badgeEarned'
  entries: ActionLogEntry[]
}

export interface ActionLogEntry {
  id: string
  type: 'ritual_completed' | 'badge_earned' | 'streak_milestone'
  title: string
  description: string
  timestamp: string
  points?: number
  badge?: Badge
}

// API Response Types
export interface ApiResponse<T> {
  data?: T
  error?: string
  success: boolean
}

export interface FarcasterCastRequest {
  text: string
  embeds?: Array<{
    url: string
  }>
}

export interface StripePaymentIntent {
  id: string
  amount: number
  currency: string
  status: string
  client_secret: string
}

// Store Types
export interface AppState {
  user: User | null
  rituals: Ritual[]
  sessions: Session[]
  badges: Badge[]
  userBadges: UserBadge[]
  isLoading: boolean
  error: string | null
}

export interface RitualStore {
  rituals: Ritual[]
  activeRitual: Ritual | null
  isLoading: boolean
  error: string | null
  fetchRituals: (userId: string) => Promise<void>
  createRitual: (ritual: Omit<Ritual, 'ritualId' | 'createdAt'>) => Promise<void>
  updateRitual: (ritualId: string, updates: Partial<Ritual>) => Promise<void>
  deleteRitual: (ritualId: string) => Promise<void>
  completeRitual: (ritualId: string, session: Omit<Session, 'sessionId' | 'timestamp'>) => Promise<void>
}

export interface UserStore {
  user: User | null
  isLoading: boolean
  error: string | null
  fetchUser: (userId: string) => Promise<void>
  updateUser: (updates: Partial<User>) => Promise<void>
  incrementStreak: () => Promise<void>
  addBadge: (badgeId: string) => Promise<void>
  addPoints: (points: number) => Promise<void>
}

// Predefined Ritual Templates
export interface RitualTemplate {
  id: string
  name: string
  description: string
  category: RitualCategory
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedDuration: number
  instructions: string[]
  benefits: string[]
  icon: string
}

// Premium Features
export interface PremiumFeature {
  id: string
  name: string
  description: string
  price: number // in cents
  type: 'one_time' | 'subscription'
  features: string[]
}

// Notification Types
export interface NotificationSettings {
  userId: string
  dailyReminders: boolean
  reminderTime: string
  streakReminders: boolean
  badgeNotifications: boolean
  socialSharing: boolean
}

// Analytics Types
export interface UserAnalytics {
  userId: string
  totalSessions: number
  averageMoodImprovement: number
  longestStreak: number
  favoriteCategory: RitualCategory
  weeklyProgress: Array<{
    week: string
    completedSessions: number
    pointsEarned: number
  }>
  monthlyProgress: Array<{
    month: string
    completedSessions: number
    pointsEarned: number
  }>
}
