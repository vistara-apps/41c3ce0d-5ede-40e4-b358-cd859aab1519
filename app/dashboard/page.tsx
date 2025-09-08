'use client'

import { useEffect, useState } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, Settings, Share2, LogOut } from 'lucide-react'
import { AppShell } from '@/components/ui/AppShell'
import { RitualCard } from '@/components/ui/RitualCard'
import { ProgressTracker } from '@/components/ui/ProgressTracker'
import { PrimaryButton } from '@/components/ui/PrimaryButton'
import { SecondaryButton } from '@/components/ui/SecondaryButton'
import { useUserStore } from '@/store/useUserStore'
import { useRitualStore } from '@/store/useRitualStore'
import { RitualCompletionModal } from '@/components/modals/RitualCompletionModal'
import { CreateRitualModal } from '@/components/modals/CreateRitualModal'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const { ready, authenticated, user: privyUser, logout } = usePrivy()
  const router = useRouter()
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedRitualId, setSelectedRitualId] = useState<string | null>(null)

  const {
    user,
    fetchUser,
    createUser,
    isLoading: userLoading,
  } = useUserStore()

  const {
    rituals,
    fetchRituals,
    completeRitual,
    deleteRitual,
    isLoading: ritualsLoading,
  } = useRitualStore()

  // Initialize user data
  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/')
      return
    }

    if (ready && authenticated && privyUser) {
      const userId = privyUser.id
      
      // Try to fetch existing user
      fetchUser(userId).then(() => {
        const currentUser = useUserStore.getState().user
        
        // If user doesn't exist, create new user
        if (!currentUser) {
          createUser({
            userId,
            farcasterId: privyUser.farcaster?.fid?.toString(),
            activeRituals: [],
          })
        }
      })
    }
  }, [ready, authenticated, privyUser, router, fetchUser, createUser])

  // Fetch rituals when user is available
  useEffect(() => {
    if (user) {
      fetchRituals(user.userId)
    }
  }, [user, fetchRituals])

  const handleCompleteRitual = (ritualId: string) => {
    setSelectedRitualId(ritualId)
    setShowCompletionModal(true)
  }

  const handleRitualCompletion = async (data: {
    moodBefore?: number
    moodAfter?: number
    notes?: string
  }) => {
    if (!selectedRitualId || !user) return

    const pointsEarned = 10 + (data.moodAfter ? (data.moodAfter - (data.moodBefore || 3)) * 2 : 0)

    await completeRitual(selectedRitualId, {
      userId: user.userId,
      ritualId: selectedRitualId,
      moodBefore: data.moodBefore,
      moodAfter: data.moodAfter,
      notes: data.notes,
      pointsEarned: Math.max(pointsEarned, 5), // Minimum 5 points
      completed: true,
    })

    setShowCompletionModal(false)
    setSelectedRitualId(null)
  }

  const handleDeleteRitual = async (ritualId: string) => {
    if (confirm('Are you sure you want to delete this ritual?')) {
      await deleteRitual(ritualId)
    }
  }

  const handleShareProgress = async () => {
    if (!user) return

    try {
      // This would integrate with Farcaster API
      const shareText = `🔥 ${user.streakCount} day streak on Resilience Rituals! Building unbreakable emotional resilience, one ritual at a time. 💪 #ResilienceRituals #MentalHealth`
      
      // For now, copy to clipboard
      await navigator.clipboard.writeText(shareText)
      toast.success('Progress copied to clipboard! 📋')
    } catch (error) {
      toast.error('Failed to share progress')
    }
  }

  const handleLogout = () => {
    logout()
    useUserStore.getState().logout()
    router.push('/')
  }

  if (!ready || userLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-pulse">
            <div className="w-8 h-8 bg-primary rounded-full"></div>
          </div>
        </div>
      </AppShell>
    )
  }

  if (!authenticated || !user) {
    return null
  }

  const activeRituals = rituals.filter(r => !r.completedToday)
  const completedRituals = rituals.filter(r => r.completedToday)

  return (
    <AppShell>
      <div className="py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              Welcome back! 👋
            </h1>
            <p className="text-text-secondary">
              Ready to build your resilience today?
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <SecondaryButton
              size="sm"
              variant="ghost"
              onClick={handleShareProgress}
            >
              <Share2 className="w-4 h-4" />
            </SecondaryButton>
            <SecondaryButton
              size="sm"
              variant="ghost"
              onClick={() => router.push('/settings')}
            >
              <Settings className="w-4 h-4" />
            </SecondaryButton>
            <SecondaryButton
              size="sm"
              variant="ghost"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
            </SecondaryButton>
          </div>
        </div>

        {/* Progress Trackers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProgressTracker
            variant="streak"
            data={{
              streakCount: user.streakCount,
              totalPoints: user.totalPoints,
            }}
          />
          <ProgressTracker
            variant="badges"
            data={{
              totalBadges: 10, // This would come from badge system
              unlockedBadges: [], // This would come from user badges
            }}
          />
        </div>

        {/* Active Rituals */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-text-primary">
              Today's Rituals
            </h2>
            <PrimaryButton
              size="sm"
              onClick={() => setShowCreateModal(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Ritual
            </PrimaryButton>
          </div>

          {ritualsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-surface rounded-lg p-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : activeRituals.length > 0 ? (
            <div className="space-y-4">
              {activeRituals.map((ritual) => (
                <RitualCard
                  key={ritual.ritualId}
                  ritual={ritual}
                  variant="active"
                  onComplete={handleCompleteRitual}
                  onEdit={(id) => router.push(`/rituals/${id}/edit`)}
                  onDelete={handleDeleteRitual}
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 bg-surface rounded-lg border-2 border-dashed border-gray-200"
            >
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-lg font-medium text-text-primary mb-2">
                No rituals yet
              </h3>
              <p className="text-text-secondary mb-4">
                Start building resilience by creating your first ritual
              </p>
              <PrimaryButton
                onClick={() => setShowCreateModal(true)}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Create Your First Ritual
              </PrimaryButton>
            </motion.div>
          )}
        </div>

        {/* Completed Rituals */}
        {completedRituals.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Completed Today ✅
            </h2>
            <div className="space-y-4">
              {completedRituals.map((ritual) => (
                <RitualCard
                  key={ritual.ritualId}
                  ritual={ritual}
                  variant="completed"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCompletionModal && selectedRitualId && (
        <RitualCompletionModal
          ritual={rituals.find(r => r.ritualId === selectedRitualId)!}
          onComplete={handleRitualCompletion}
          onClose={() => {
            setShowCompletionModal(false)
            setSelectedRitualId(null)
          }}
        />
      )}

      {showCreateModal && (
        <CreateRitualModal
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </AppShell>
  )
}
