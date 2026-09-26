export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type UserRole = 'user' | 'admin';

export interface Profile {
  id: string;
  display_name: string;
  avatar_url: string | null;
  preferred_language: string;
  role: UserRole;
  xp: number;
  level: number;
  created_at: string;
  updated_at: string;
}

export interface Topic {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  difficulty: Difficulty;
  color: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
}

export interface ScenarioOption {
  id: string;
  scenario_id: string;
  label: string;
  is_correct: boolean;
  sort_order: number;
}

export interface Scenario {
  id: string;
  topic_id: string;
  title: string;
  situation: string;
  question: string;
  explanation: string;
  next_steps: string;
  why_it_matters: string;
  sort_order: number;
  created_at: string;
  options?: ScenarioOption[];
}

export interface QuizOption {
  id: string;
  question_id: string;
  label: string;
  is_correct: boolean;
  sort_order: number;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question: string;
  explanation: string;
  sort_order: number;
  options?: QuizOption[];
}

export interface Quiz {
  id: string;
  topic_id: string;
  title: string;
  description: string;
  created_at: string;
  questions?: QuizQuestion[];
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number;
  total: number;
  xp_awarded: number;
  completed_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  topic_id: string;
  scenarios_completed: number;
  quizzes_completed: number;
  is_completed: boolean;
  updated_at: string;
}

export interface XpTransaction {
  id: string;
  user_id: string;
  amount: number;
  reason: string;
  reference_type: string | null;
  reference_id: string | null;
  created_at: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: string;
  color: string;
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  unlocked_at: string;
  badge?: Badge;
}

export interface Resource {
  id: string;
  name: string;
  category: string;
  description: string;
  contact: string | null;
  website: string | null;
  source: string | null;
  is_verified: boolean;
  created_at: string;
}

export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: string;
  title: string;
  xp_amount: number | null;
  created_at: string;
}

export interface Streak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
}

export interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  level: number;
  xp: number;
  badge_count: number;
  rank: number;
}

export const LEVEL_THRESHOLDS = [
  { level: 1, minXp: 0 },
  { level: 2, minXp: 100 },
  { level: 3, minXp: 250 },
  { level: 4, minXp: 500 },
  { level: 5, minXp: 1000 },
  { level: 6, minXp: 2000 },
];

export const XP_REWARDS = {
  SCENARIO: 20,
  QUIZ: 50,
  HIGH_SCORE: 25,
  TOPIC_COMPLETION: 100,
  DAILY_ACTIVITY: 10,
} as const;

export function getLevelForXp(xp: number): number {
  let level = 1;
  for (const threshold of LEVEL_THRESHOLDS) {
    if (xp >= threshold.minXp) {
      level = threshold.level;
    }
  }
  return level;
}

export function getNextLevelXp(level: number): number {
  const next = LEVEL_THRESHOLDS.find((t) => t.level === level + 1);
  if (!next) return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1].minXp;
  return next.minXp;
}

export function getCurrentLevelXp(level: number): number {
  const current = LEVEL_THRESHOLDS.find((t) => t.level === level);
  return current ? current.minXp : 0;
}

export function getLevelProgress(xp: number): {
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  xpInLevel: number;
  xpNeeded: number;
  progress: number;
} {
  const level = getLevelForXp(xp);
  const currentLevelXp = getCurrentLevelXp(level);
  const nextLevelXp = getNextLevelXp(level);
  const xpInLevel = xp - currentLevelXp;
  const xpNeeded = nextLevelXp - currentLevelXp;
  const progress = xpNeeded > 0 ? (xpInLevel / xpNeeded) * 100 : 100;
  return { level, currentLevelXp, nextLevelXp, xpInLevel, xpNeeded, progress };
}
