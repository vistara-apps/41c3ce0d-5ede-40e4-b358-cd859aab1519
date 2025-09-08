import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, isToday, differenceInDays } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  if (isToday(date)) {
    return 'Today';
  }
  return format(date, 'MMM d');
}

export function calculateStreak(sessions: { timestamp: Date }[]): number {
  if (sessions.length === 0) return 0;
  
  const sortedSessions = sessions
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  
  let streak = 0;
  let currentDate = new Date();
  
  for (const session of sortedSessions) {
    const daysDiff = differenceInDays(currentDate, session.timestamp);
    
    if (daysDiff === streak) {
      streak++;
    } else if (daysDiff > streak) {
      break;
    }
  }
  
  return streak;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function calculateMoodImprovement(sessions: { moodBefore: number; moodAfter: number }[]): number {
  if (sessions.length === 0) return 0;
  
  const improvements = sessions.map(s => s.moodAfter - s.moodBefore);
  const avgImprovement = improvements.reduce((sum, imp) => sum + imp, 0) / improvements.length;
  
  return Math.round(avgImprovement * 100) / 100;
}

export function getCompletionRate(totalDays: number, completedDays: number): number {
  if (totalDays === 0) return 0;
  return Math.round((completedDays / totalDays) * 100);
}
