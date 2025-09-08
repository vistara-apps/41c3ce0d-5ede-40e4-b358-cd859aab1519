'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SecondaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'ghost';
  disabled?: boolean;
  className?: string;
}

export function SecondaryButton({ 
  children, 
  onClick, 
  variant = 'default',
  disabled = false,
  className = ''
}: SecondaryButtonProps) {
  const baseClass = variant === 'ghost' 
    ? 'text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-colors duration-200' 
    : 'btn-secondary';
  
  return (
    <motion.button
      className={`${baseClass} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.button>
  );
}
