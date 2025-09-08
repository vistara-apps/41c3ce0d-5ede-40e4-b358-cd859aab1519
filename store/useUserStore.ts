import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types'
import { dbHelpers } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface UserState {
  user: User | null
  isLoading: boolean
  error: string | null
  
  // Actions
  fetchUser: (userId: string) => Promise<void>
  createUser: (userData: Omit<User, 'createdAt' | 'streakCount' | 'badgesEarned' | 'totalPoints' | 'premiumFeatures'>) => Promise<void>
  updateUser: (updates: Partial<User>) => Promise<void>
  incrementStreak: () => Promise<void>
  addBadge: (badgeId: string) => Promise<void>
  addPoints: (points: number) => Promise<void>
  resetStreak: () => Promise<void>
  clearError: () => void
  logout: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,

      fetchUser: async (userId: string) => {
        set({ isLoading: true, error: null })
        
        try {
          const userData = await dbHelpers.getUserById(userId)
          
          if (userData) {
            const user: User = {
              userId: userData.user_id,
              farcasterId: userData.farcaster_id || undefined,
              createdAt: userData.created_at,
              activeRituals: userData.active_rituals || [],
              streakCount: userData.streak_count || 0,
              badgesEarned: userData.badges_earned || [],
              totalPoints: userData.total_points || 0,
              lastActiveDate: userData.last_active_date || undefined,
              premiumFeatures: userData.premium_features || false,
            }
            set({ user, isLoading: false })
          } else {
            set({ user: null, isLoading: false })
          }
        } catch (error) {
          console.error('Error fetching user:', error)
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch user',
            isLoading: false 
          })
        }
      },

      createUser: async (userData) => {
        set({ isLoading: true, error: null })
        
        try {
          const newUserData = await dbHelpers.createUser({
            userId: userData.userId,
            farcasterId: userData.farcasterId,
            activeRituals: userData.activeRituals || [],
            streakCount: 0,
            badgesEarned: [],
            totalPoints: 0,
            premiumFeatures: false,
          })

          const user: User = {
            userId: newUserData.user_id,
            farcasterId: newUserData.farcaster_id || undefined,
            createdAt: newUserData.created_at,
            activeRituals: newUserData.active_rituals || [],
            streakCount: newUserData.streak_count || 0,
            badgesEarned: newUserData.badges_earned || [],
            totalPoints: newUserData.total_points || 0,
            lastActiveDate: newUserData.last_active_date || undefined,
            premiumFeatures: newUserData.premium_features || false,
          }

          set({ user, isLoading: false })
          toast.success('Welcome to Resilience Rituals! 🎉')
        } catch (error) {
          console.error('Error creating user:', error)
          set({ 
            error: error instanceof Error ? error.message : 'Failed to create user',
            isLoading: false 
          })
          toast.error('Failed to create account')
        }
      },

      updateUser: async (updates) => {
        const { user } = get()
        if (!user) return

        set({ isLoading: true, error: null })
        
        try {
          // Convert updates to database format
          const dbUpdates: Record<string, any> = {}
          if (updates.farcasterId !== undefined) dbUpdates.farcaster_id = updates.farcasterId
          if (updates.activeRituals !== undefined) dbUpdates.active_rituals = updates.activeRituals
          if (updates.streakCount !== undefined) dbUpdates.streak_count = updates.streakCount
          if (updates.badgesEarned !== undefined) dbUpdates.badges_earned = updates.badgesEarned
          if (updates.totalPoints !== undefined) dbUpdates.total_points = updates.totalPoints
          if (updates.lastActiveDate !== undefined) dbUpdates.last_active_date = updates.lastActiveDate
          if (updates.premiumFeatures !== undefined) dbUpdates.premium_features = updates.premiumFeatures

          await dbHelpers.updateUser(user.userId, dbUpdates)
          
          set({ 
            user: { ...user, ...updates },
            isLoading: false 
          })
        } catch (error) {
          console.error('Error updating user:', error)
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update user',
            isLoading: false 
          })
          toast.error('Failed to update profile')
        }
      },

      incrementStreak: async () => {
        const { user, updateUser } = get()
        if (!user) return

        const newStreakCount = user.streakCount + 1
        await updateUser({ 
          streakCount: newStreakCount,
          lastActiveDate: new Date().toISOString()
        })

        // Check for streak badges
        if (newStreakCount === 7) {
          get().addBadge('week_warrior')
          toast.success('🔥 Week Warrior badge unlocked!')
        } else if (newStreakCount === 30) {
          get().addBadge('month_master')
          toast.success('🏆 Month Master badge unlocked!')
        } else if (newStreakCount === 100) {
          get().addBadge('century_champion')
          toast.success('👑 Century Champion badge unlocked!')
        }
      },

      addBadge: async (badgeId: string) => {
        const { user, updateUser } = get()
        if (!user || user.badgesEarned.includes(badgeId)) return

        try {
          // Award badge in database
          await dbHelpers.awardBadge(user.userId, badgeId)
          
          // Update local state
          await updateUser({
            badgesEarned: [...user.badgesEarned, badgeId]
          })
        } catch (error) {
          console.error('Error adding badge:', error)
        }
      },

      addPoints: async (points: number) => {
        const { user, updateUser } = get()
        if (!user) return

        const newTotalPoints = user.totalPoints + points
        await updateUser({ totalPoints: newTotalPoints })

        // Check for point-based badges
        if (newTotalPoints >= 100 && !user.badgesEarned.includes('point_collector')) {
          get().addBadge('point_collector')
          toast.success('💎 Point Collector badge unlocked!')
        } else if (newTotalPoints >= 500 && !user.badgesEarned.includes('point_master')) {
          get().addBadge('point_master')
          toast.success('⭐ Point Master badge unlocked!')
        }
      },

      resetStreak: async () => {
        const { updateUser } = get()
        await updateUser({ streakCount: 0 })
        toast('Streak reset. Don\'t worry, you\'ve got this! 💪', {
          icon: '🔄',
        })
      },

      clearError: () => set({ error: null }),

      logout: () => {
        set({ user: null, isLoading: false, error: null })
        toast.success('Logged out successfully')
      },
    }),
    {
      name: 'user-store',
      partialize: (state) => ({ user: state.user }),
    }
  )
)
