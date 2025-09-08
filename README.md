# 🧘‍♀️ Resilience Rituals

**Build unbreakable emotional resilience, one ritual at a time.**

A Base Mini App that helps users develop emotional resilience through daily habits, gamified progress tracking, and community support on Farcaster.

## ✨ Features

### 🎯 Daily Ritual Creator
- Curated library of proven resilience-building practices
- Personalized ritual recommendations based on user preferences
- Custom ritual creation with guided templates
- Smart scheduling with reminder notifications

### 🎮 Gamified Progress System
- **Streak Tracking**: Build momentum with daily completion streaks
- **Points & Badges**: Earn rewards for consistent engagement
- **Progress Visualization**: See your resilience journey unfold
- **Milestone Celebrations**: Unlock achievements as you grow

### 💝 Mood & Wellness Tracking
- Pre/post ritual mood assessment
- Emotional progress visualization
- Personal reflection notes
- Data-driven insights into your wellbeing

### 👥 Social Integration
- Share progress on Farcaster
- Community accountability features
- Social primitives for motivation
- Connect with like-minded individuals

## 🚀 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Authentication**: Privy (Web3 wallet connection)
- **Database**: Supabase (PostgreSQL)
- **Animations**: Framer Motion
- **State Management**: Zustand
- **UI Components**: Custom design system
- **Social Integration**: Farcaster via Neynar API
- **Payments**: Stripe (for premium features)

## 🏗️ Architecture

### Data Model
```typescript
// Core entities
User {
  userId: string
  farcasterId?: string
  streakCount: number
  totalPoints: number
  badgesEarned: Badge[]
  activeRituals: string[]
}

Ritual {
  ritualId: string
  userId: string
  name: string
  description: string
  category: RitualCategory
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedDuration: number
  frequency: 'daily' | 'weekly' | 'custom'
  completedToday: boolean
}

Session {
  sessionId: string
  userId: string
  ritualId: string
  timestamp: Date
  moodBefore?: number
  moodAfter?: number
  notes?: string
  pointsEarned: number
}
```

### Key Components
- **AppShell**: Main layout wrapper with responsive design
- **RitualCard**: Interactive ritual display with completion tracking
- **ProgressTracker**: Streak and badge visualization
- **RitualCompletionModal**: Multi-step ritual completion flow
- **CreateRitualModal**: Template-based ritual creation

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Privy account
- Neynar API key (for Farcaster integration)

### 1. Clone & Install
```bash
git clone <repository-url>
cd resilience-rituals
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required environment variables:
- `NEXT_PUBLIC_PRIVY_APP_ID`: Your Privy app ID
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
- `NEYNAR_API_KEY`: Your Neynar API key for Farcaster

### 3. Database Setup
Run the Supabase migrations to set up your database schema:

```sql
-- Users table
CREATE TABLE users (
  user_id TEXT PRIMARY KEY,
  farcaster_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  streak_count INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  active_rituals TEXT[] DEFAULT '{}'
);

-- Rituals table
CREATE TABLE rituals (
  ritual_id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES users(user_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  estimated_duration INTEGER NOT NULL,
  frequency TEXT NOT NULL,
  start_time TEXT,
  completed_today BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions table
CREATE TABLE sessions (
  session_id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES users(user_id) ON DELETE CASCADE,
  ritual_id TEXT REFERENCES rituals(ritual_id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  mood_before INTEGER,
  mood_after INTEGER,
  notes TEXT,
  points_earned INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT TRUE
);

-- Badges table
CREATE TABLE badges (
  badge_id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User badges junction table
CREATE TABLE user_badges (
  user_id TEXT REFERENCES users(user_id) ON DELETE CASCADE,
  badge_id TEXT REFERENCES badges(badge_id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, badge_id)
);
```

### 4. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the app running.

## 📱 Usage

### Getting Started
1. **Connect Wallet**: Use Privy to connect your Web3 wallet
2. **Choose First Ritual**: Select from curated templates or create custom
3. **Set Schedule**: Configure frequency and reminder times
4. **Start Building**: Complete daily rituals and track progress

### Daily Flow
1. **Morning Check-in**: Rate your current mood
2. **Complete Ritual**: Follow guided practice (meditation, gratitude, etc.)
3. **Post-Ritual Assessment**: Rate mood improvement
4. **Optional Reflection**: Add personal notes
5. **Share Progress**: Post achievements to Farcaster

### Gamification Elements
- **Daily Streaks**: Maintain consecutive days of ritual completion
- **Points System**: Earn points based on consistency and mood improvement
- **Badge Collection**: Unlock achievements for milestones
- **Social Sharing**: Celebrate progress with your community

## 🎨 Design System

### Color Palette
- **Primary**: `hsl(220, 80%, 50%)` - Trust and stability
- **Accent**: `hsl(150, 70%, 45%)` - Growth and positivity  
- **Background**: `hsl(220, 10%, 95%)` - Calm and clean
- **Surface**: `hsl(220, 10%, 100%)` - Pure and minimal
- **Text Primary**: `hsl(220, 15%, 15%)` - High contrast
- **Text Secondary**: `hsl(220, 10%, 40%)` - Subtle information

### Typography
- **Display**: Large headings with bold weight
- **Heading**: Section titles with semibold weight
- **Body**: Main content with comfortable line height
- **Caption**: Small text for metadata

### Motion Design
- **Easing**: `cubic-bezier(0.22,1,0.36,1)` for smooth transitions
- **Duration**: 250ms base, 150ms fast, 400ms slow
- **Principles**: Purposeful, delightful, accessible

## 🔧 API Integration

### Farcaster Integration
```typescript
// Share ritual completion
const shareToFarcaster = async (streakCount: number) => {
  const cast = {
    text: `🔥 ${streakCount} day streak on Resilience Rituals! Building unbreakable emotional resilience, one ritual at a time. 💪 #ResilienceRituals #MentalHealth`,
    embeds: [{ url: 'https://resilience-rituals.vercel.app' }]
  }
  
  await neynarClient.publishCast(cast)
}
```

### Supabase Queries
```typescript
// Fetch user rituals
const fetchRituals = async (userId: string) => {
  const { data, error } = await supabase
    .from('rituals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  return data
}

// Complete ritual session
const completeRitual = async (sessionData: SessionInsert) => {
  const { data, error } = await supabase
    .from('sessions')
    .insert(sessionData)
    .select()
  
  return data
}
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
- Set all required environment variables in your deployment platform
- Update `NEXT_PUBLIC_APP_URL` to your production domain
- Ensure Supabase RLS policies are properly configured

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit with conventional commits: `git commit -m 'feat: add amazing feature'`
5. Push to your branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Base Ecosystem**: For providing the infrastructure for onchain applications
- **Farcaster Community**: For social primitives and decentralized social networking
- **Mental Health Research**: Evidence-based practices for resilience building
- **Open Source Community**: For the amazing tools and libraries that make this possible

## 📞 Support

- **Documentation**: [docs.resilience-rituals.com](https://docs.resilience-rituals.com)
- **Community**: Join our [Farcaster channel](https://warpcast.com/~/channel/resilience-rituals)
- **Issues**: [GitHub Issues](https://github.com/your-org/resilience-rituals/issues)
- **Email**: support@resilience-rituals.com

---

**Built with ❤️ for mental health and wellbeing**

*Resilience Rituals - Building unbreakable emotional resilience, one ritual at a time.*
