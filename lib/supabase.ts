import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Database table names
export const TABLES = {
  USERS: 'users',
  RITUALS: 'rituals',
  SESSIONS: 'sessions',
  BADGES: 'badges',
  USER_BADGES: 'user_badges',
  NOTIFICATION_SETTINGS: 'notification_settings',
} as const

// Helper functions for common database operations
export const dbHelpers = {
  // User operations
  async createUser(userData: {
    userId: string
    farcasterId?: string
    activeRituals?: string[]
    streakCount?: number
    badgesEarned?: string[]
    totalPoints?: number
    premiumFeatures?: boolean
  }) {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .insert({
        user_id: userData.userId,
        farcaster_id: userData.farcasterId,
        active_rituals: userData.activeRituals || [],
        streak_count: userData.streakCount || 0,
        badges_earned: userData.badgesEarned || [],
        total_points: userData.totalPoints || 0,
        premium_features: userData.premiumFeatures || false,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getUserById(userId: string) {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async updateUser(userId: string, updates: Record<string, any>) {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Ritual operations
  async createRitual(ritualData: {
    userId: string
    name: string
    description: string
    frequency: string
    startTime?: string
    category: string
    difficulty: string
    estimatedDuration: number
  }) {
    const { data, error } = await supabase
      .from(TABLES.RITUALS)
      .insert({
        user_id: ritualData.userId,
        name: ritualData.name,
        description: ritualData.description,
        frequency: ritualData.frequency,
        start_time: ritualData.startTime,
        category: ritualData.category,
        difficulty: ritualData.difficulty,
        estimated_duration: ritualData.estimatedDuration,
        completed_today: false,
        is_active: true,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getRitualsByUserId(userId: string) {
    const { data, error } = await supabase
      .from(TABLES.RITUALS)
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async updateRitual(ritualId: string, updates: Record<string, any>) {
    const { data, error } = await supabase
      .from(TABLES.RITUALS)
      .update(updates)
      .eq('ritual_id', ritualId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Session operations
  async createSession(sessionData: {
    userId: string
    ritualId: string
    moodBefore?: number
    moodAfter?: number
    notes?: string
    pointsEarned: number
    completed: boolean
  }) {
    const { data, error } = await supabase
      .from(TABLES.SESSIONS)
      .insert({
        user_id: sessionData.userId,
        ritual_id: sessionData.ritualId,
        mood_before: sessionData.moodBefore,
        mood_after: sessionData.moodAfter,
        notes: sessionData.notes,
        points_earned: sessionData.pointsEarned,
        completed: sessionData.completed,
        timestamp: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getSessionsByUserId(userId: string, limit?: number) {
    let query = supabase
      .from(TABLES.SESSIONS)
      .select(`
        *,
        rituals (
          name,
          category
        )
      `)
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  },

  // Badge operations
  async getAllBadges() {
    const { data, error } = await supabase
      .from(TABLES.BADGES)
      .select('*')
      .order('name')

    if (error) throw error
    return data || []
  },

  async getUserBadges(userId: string) {
    const { data, error } = await supabase
      .from(TABLES.USER_BADGES)
      .select(`
        *,
        badges (*)
      `)
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async awardBadge(userId: string, badgeId: string) {
    const { data, error } = await supabase
      .from(TABLES.USER_BADGES)
      .insert({
        user_id: userId,
        badge_id: badgeId,
        unlocked_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Analytics operations
  async getUserStats(userId: string) {
    const [sessionsResult, ritualsResult] = await Promise.all([
      supabase
        .from(TABLES.SESSIONS)
        .select('*')
        .eq('user_id', userId)
        .eq('completed', true),
      supabase
        .from(TABLES.RITUALS)
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
    ])

    if (sessionsResult.error) throw sessionsResult.error
    if (ritualsResult.error) throw ritualsResult.error

    const sessions = sessionsResult.data || []
    const rituals = ritualsResult.data || []

    return {
      totalSessions: sessions.length,
      totalRituals: rituals.length,
      totalPoints: sessions.reduce((sum, session) => sum + (session.points_earned || 0), 0),
      averageMoodImprovement: sessions.length > 0 
        ? sessions
            .filter(s => s.mood_before && s.mood_after)
            .reduce((sum, s) => sum + (s.mood_after! - s.mood_before!), 0) / sessions.length
        : 0,
    }
  },
}
