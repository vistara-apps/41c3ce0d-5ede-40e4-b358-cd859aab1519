'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/ui/AppShell'
import { PrimaryButton } from '@/components/ui/PrimaryButton'
import { motion } from 'framer-motion'
import { Heart, Sparkles, Target } from 'lucide-react'

export default function HomePage() {
  const { ready, authenticated, login } = usePrivy()
  const router = useRouter()

  useEffect(() => {
    if (ready && authenticated) {
      router.push('/dashboard')
    }
  }, [ready, authenticated, router])

  if (!ready) {
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

  if (authenticated) {
    return null // Will redirect to dashboard
  }

  return (
    <AppShell>
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md mx-auto"
        >
          {/* Logo/Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-8"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto shadow-card">
              <Heart className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-bold text-text-primary mb-4"
          >
            Resilience Rituals
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-lg text-text-secondary mb-8 leading-7"
          >
            Build unbreakable emotional resilience, one ritual at a time.
          </motion.p>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="space-y-4 mb-8"
          >
            <div className="flex items-center space-x-3 text-left">
              <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                <Target className="w-4 h-4 text-accent" />
              </div>
              <span className="text-text-primary">Daily resilience rituals</span>
            </div>
            <div className="flex items-center space-x-3 text-left">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <span className="text-text-primary">Gamified progress tracking</span>
            </div>
            <div className="flex items-center space-x-3 text-left">
              <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-accent" />
              </div>
              <span className="text-text-primary">Community support</span>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <PrimaryButton
              onClick={login}
              className="w-full"
              size="lg"
            >
              Start Your Journey
            </PrimaryButton>
          </motion.div>

          {/* Footer text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-sm text-text-secondary mt-6"
          >
            Connect your wallet to begin building resilience
          </motion.p>
        </motion.div>
      </div>
    </AppShell>
  )
}
