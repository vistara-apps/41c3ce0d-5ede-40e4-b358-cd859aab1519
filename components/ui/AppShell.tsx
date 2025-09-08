'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

interface AppShellProps {
  children: ReactNode
  variant?: 'default' | 'glass'
  className?: string
}

export function AppShell({ children, variant = 'default', className }: AppShellProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className={clsx(
        'min-h-screen w-full',
        {
          'bg-bg': variant === 'default',
          'glass': variant === 'glass',
        },
        className
      )}
    >
      <div className="max-w-xl mx-auto px-4">
        {children}
      </div>
    </motion.div>
  )
}
