# Resilience Rituals - Base Mini App

Build unbreakable emotional resilience, one ritual at a time.

## Features

- **Daily Ritual Creator**: Choose from curated resilience-building habits
- **Gamified Completion**: Earn points, badges, and maintain streaks
- **Progress Visualization**: Track your resilience journey with beautiful charts
- **Mood Tracking**: Monitor emotional improvements over time
- **Social Integration**: Share achievements on Farcaster (coming soon)

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Blockchain**: Base (via OnchainKit & MiniKit)
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion
- **TypeScript**: Full type safety

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.local.example .env.local
   # Add your OnchainKit API key
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Design System

### Colors
- **Background**: Deep purple gradient (`from-indigo-900 via-purple-900 to-pink-900`)
- **Accent**: Purple to pink gradients
- **Glass Effects**: Semi-transparent surfaces with backdrop blur

### Components
- **AppShell**: Main layout with glass morphism header
- **RitualCard**: Interactive ritual completion cards
- **ProgressTracker**: Circular progress with stats
- **ActionLog**: Recent activity and achievements
- **MoodTracker**: Emotional state selection interface

### Animations
- **Framer Motion**: Smooth page transitions and micro-interactions
- **Floating Elements**: Subtle background animations
- **Pulse Effects**: Breathing animations for key elements

## Data Model

### Core Entities
- **User**: Profile, streaks, badges, points
- **Ritual**: Daily habits with categories and scheduling
- **Session**: Completed ritual instances with mood tracking
- **Badge**: Achievement system with rarity levels

## Deployment

This app is optimized for deployment on Vercel with Base network integration.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
