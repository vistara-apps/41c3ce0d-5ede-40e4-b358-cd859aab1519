import { create } from 'zustand'
import { Ritual, Session, RitualTemplate } from '@/types'
import { dbHelpers } from '@/lib/supabase'
import { useUserStore } from './useUserStore'
import toast from 'react-hot-toast'

interface RitualState {
  rituals: Ritual[]
  activeRitual: Ritual | null
  isLoading: boolean
  error: string | null
  
  // Actions
  fetchRituals: (userId: string) => Promise<void>
  createRitual: (ritual: Omit<Ritual, 'ritualId' | 'createdAt' | 'completedToday' | 'isActive'>) => Promise<void>
  updateRitual: (ritualId: string, updates: Partial<Ritual>) => Promise<void>
  deleteRitual: (ritualId: string) => Promise<void>
  completeRitual: (ritualId: string, session: Omit<Session, 'sessionId' | 'timestamp'>) => Promise<void>
  setActiveRitual: (ritual: Ritual | null) => void
  clearError: () => void
}

// Predefined ritual templates
export const RITUAL_TEMPLATES: RitualTemplate[] = [
  {
    id: 'gratitude_journal',
    name: 'Gratitude Journal',
    description: 'Write down three things you\'re grateful for today',
    category: 'gratitude',
    difficulty: 'easy',
    estimatedDuration: 5,
    instructions: [
      'Find a quiet space',
      'Think about your day',
      'Write down 3 specific things you\'re grateful for',
      'Reflect on why each one matters to you'
    ],
    benefits: [
      'Improved mood and outlook',
      'Better sleep quality',
      'Increased life satisfaction',
      'Reduced stress and anxiety'
    ],
    icon: '📝'
  },
  {
    id: 'mindful_breathing',
    name: 'Mindful Breathing',
    description: 'Practice deep, conscious breathing for 5 minutes',
    category: 'mindfulness',
    difficulty: 'easy',
    estimatedDuration: 5,
    instructions: [
      'Sit comfortably with your back straight',
      'Close your eyes or soften your gaze',
      'Breathe in slowly for 4 counts',
      'Hold for 4 counts',
      'Exhale slowly for 6 counts',
      'Repeat for 5 minutes'
    ],
    benefits: [
      'Reduced stress and anxiety',
      'Improved focus and clarity',
      'Better emotional regulation',
      'Lower blood pressure'
    ],
    icon: '🫁'
  },
  {
    id: 'positive_affirmations',
    name: 'Positive Affirmations',
    description: 'Speak or write positive statements about yourself',
    category: 'mindfulness',
    difficulty: 'easy',
    estimatedDuration: 3,
    instructions: [
      'Choose 3-5 positive affirmations',
      'Look at yourself in the mirror',
      'Say each affirmation out loud with conviction',
      'Feel the positive energy as you speak'
    ],
    benefits: [
      'Increased self-confidence',
      'Better self-image',
      'Reduced negative self-talk',
      'Improved motivation'
    ],
    icon: '💪'
  },
  {
    id: 'nature_walk',
    name: 'Nature Walk',
    description: 'Take a mindful walk in nature for 15 minutes',
    category: 'physical',
    difficulty: 'medium',
    estimatedDuration: 15,
    instructions: [
      'Find a natural outdoor space',
      'Walk at a comfortable pace',
      'Notice the sights, sounds, and smells',
      'Take deep breaths of fresh air',
      'Leave your phone in your pocket'
    ],
    benefits: [
      'Improved physical health',
      'Reduced stress hormones',
      'Enhanced creativity',
      'Better vitamin D levels'
    ],
    icon: '🌳'
  },
  {
    id: 'creative_expression',
    name: 'Creative Expression',
    description: 'Spend 10 minutes on any creative activity',
    category: 'creative',
    difficulty: 'medium',
    estimatedDuration: 10,
    instructions: [
      'Choose a creative medium (drawing, writing, music, etc.)',
      'Set a timer for 10 minutes',
      'Create without judgment or expectation',
      'Focus on the process, not the outcome'
    ],
    benefits: [
      'Improved emotional expression',
      'Enhanced problem-solving skills',
      'Reduced stress',
      'Increased self-awareness'
    ],
    icon: '🎨'
  },
  {
    id: 'social_connection',
    name: 'Social Connection',
    description: 'Reach out to someone you care about',
    category: 'social',
    difficulty: 'easy',
    estimatedDuration: 10,
    instructions: [
      'Think of someone you haven\'t spoken to recently',
      'Send them a thoughtful message or call',
      'Ask how they\'re doing and really listen',
      'Share something positive from your day'
    ],
    benefits: [
      'Stronger relationships',
      'Reduced feelings of loneliness',
      'Improved social support',
      'Enhanced empathy'
    ],
    icon: '💬'
  }
]

export const useRitualStore = create<RitualState>((set, get) => ({
  rituals: [],
  activeRitual: null,
  isLoading: false,
  error: null,

  fetchRituals: async (userId: string) => {
    set({ isLoading: true, error: null })
    
    try {
      const ritualsData = await dbHelpers.getRitualsByUserId(userId)
      
      const rituals: Ritual[] = ritualsData.map(ritual => ({
        ritualId: ritual.ritual_id,
        userId: ritual.user_id,
        name: ritual.name,
        description: ritual.description,
        frequency: ritual.frequency as 'daily' | 'weekly' | 'custom',
        startTime: ritual.start_time || undefined,
        completedToday: ritual.completed_today,
        createdAt: ritual.created_at,
        isActive: ritual.is_active,
        category: ritual.category as any,
        difficulty: ritual.difficulty as 'easy' | 'medium' | 'hard',
        estimatedDuration: ritual.estimated_duration,
      }))

      set({ rituals, isLoading: false })
    } catch (error) {
      console.error('Error fetching rituals:', error)
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch rituals',
        isLoading: false 
      })
    }
  },

  createRitual: async (ritual) => {
    set({ isLoading: true, error: null })
    
    try {
      const ritualData = await dbHelpers.createRitual({
        userId: ritual.userId,
        name: ritual.name,
        description: ritual.description,
        frequency: ritual.frequency,
        startTime: ritual.startTime,
        category: ritual.category,
        difficulty: ritual.difficulty,
        estimatedDuration: ritual.estimatedDuration,
      })

      const newRitual: Ritual = {
        ritualId: ritualData.ritual_id,
        userId: ritualData.user_id,
        name: ritualData.name,
        description: ritualData.description,
        frequency: ritualData.frequency as 'daily' | 'weekly' | 'custom',
        startTime: ritualData.start_time || undefined,
        completedToday: ritualData.completed_today,
        createdAt: ritualData.created_at,
        isActive: ritualData.is_active,
        category: ritualData.category as any,
        difficulty: ritualData.difficulty as 'easy' | 'medium' | 'hard',
        estimatedDuration: ritualData.estimated_duration,
      }

      set(state => ({ 
        rituals: [newRitual, ...state.rituals],
        isLoading: false 
      }))

      // Update user's active rituals
      const userStore = useUserStore.getState()
      if (userStore.user) {
        userStore.updateUser({
          activeRituals: [...userStore.user.activeRituals, newRitual.ritualId]
        })
      }

      toast.success(`${ritual.name} ritual created! 🎉`)
    } catch (error) {
      console.error('Error creating ritual:', error)
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create ritual',
        isLoading: false 
      })
      toast.error('Failed to create ritual')
    }
  },

  updateRitual: async (ritualId: string, updates) => {
    set({ isLoading: true, error: null })
    
    try {
      // Convert updates to database format
      const dbUpdates: Record<string, any> = {}
      if (updates.name !== undefined) dbUpdates.name = updates.name
      if (updates.description !== undefined) dbUpdates.description = updates.description
      if (updates.frequency !== undefined) dbUpdates.frequency = updates.frequency
      if (updates.startTime !== undefined) dbUpdates.start_time = updates.startTime
      if (updates.completedToday !== undefined) dbUpdates.completed_today = updates.completedToday
      if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive
      if (updates.category !== undefined) dbUpdates.category = updates.category
      if (updates.difficulty !== undefined) dbUpdates.difficulty = updates.difficulty
      if (updates.estimatedDuration !== undefined) dbUpdates.estimated_duration = updates.estimatedDuration

      await dbHelpers.updateRitual(ritualId, dbUpdates)
      
      set(state => ({
        rituals: state.rituals.map(ritual =>
          ritual.ritualId === ritualId ? { ...ritual, ...updates } : ritual
        ),
        isLoading: false
      }))

      toast.success('Ritual updated successfully')
    } catch (error) {
      console.error('Error updating ritual:', error)
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update ritual',
        isLoading: false 
      })
      toast.error('Failed to update ritual')
    }
  },

  deleteRitual: async (ritualId: string) => {
    set({ isLoading: true, error: null })
    
    try {
      await dbHelpers.updateRitual(ritualId, { is_active: false })
      
      set(state => ({
        rituals: state.rituals.filter(ritual => ritual.ritualId !== ritualId),
        activeRitual: state.activeRitual?.ritualId === ritualId ? null : state.activeRitual,
        isLoading: false
      }))

      // Update user's active rituals
      const userStore = useUserStore.getState()
      if (userStore.user) {
        userStore.updateUser({
          activeRituals: userStore.user.activeRituals.filter(id => id !== ritualId)
        })
      }

      toast.success('Ritual deleted successfully')
    } catch (error) {
      console.error('Error deleting ritual:', error)
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete ritual',
        isLoading: false 
      })
      toast.error('Failed to delete ritual')
    }
  },

  completeRitual: async (ritualId: string, session) => {
    set({ isLoading: true, error: null })
    
    try {
      // Create session record
      await dbHelpers.createSession({
        userId: session.userId,
        ritualId: session.ritualId,
        moodBefore: session.moodBefore,
        moodAfter: session.moodAfter,
        notes: session.notes,
        pointsEarned: session.pointsEarned,
        completed: session.completed,
      })

      // Mark ritual as completed today
      await get().updateRitual(ritualId, { completedToday: true })

      // Update user stats
      const userStore = useUserStore.getState()
      if (userStore.user) {
        userStore.addPoints(session.pointsEarned)
        userStore.incrementStreak()
      }

      set({ isLoading: false })
      toast.success(`Ritual completed! +${session.pointsEarned} points 🎉`)
    } catch (error) {
      console.error('Error completing ritual:', error)
      set({ 
        error: error instanceof Error ? error.message : 'Failed to complete ritual',
        isLoading: false 
      })
      toast.error('Failed to complete ritual')
    }
  },

  setActiveRitual: (ritual) => set({ activeRitual: ritual }),

  clearError: () => set({ error: null }),
}))
