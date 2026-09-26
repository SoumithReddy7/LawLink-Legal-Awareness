import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import type { UserProgress, UserActivity, UserBadge, Badge, Streak, XpTransaction, QuizAttempt } from '@/types';

export function useUserData() {
  const { session, profile, refreshProfile } = useAuth();
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [streak, setStreak] = useState<Streak | null>(null);
  const [xpHistory, setXpHistory] = useState<XpTransaction[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = session?.user.id;

  const fetchAll = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);

    try {
      const [progressRes, activityRes, badgesRes, allBadgesRes, streakRes, xpRes, attemptsRes] = await Promise.all([
        supabase.from('user_progress').select('*').eq('user_id', userId),
        supabase.from('user_activity').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(20),
        supabase.from('user_badges').select('*, badge(*)').eq('user_id', userId).order('unlocked_at', { ascending: false }),
        supabase.from('badges').select('*').order('created_at'),
        supabase.from('streaks').select('*').eq('user_id', userId).maybeSingle(),
        supabase.from('xp_transactions').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(30),
        supabase.from('quiz_attempts').select('*').eq('user_id', userId).order('completed_at', { ascending: false }),
      ]);

      setProgress(progressRes.data as UserProgress[] ?? []);
      setActivities(activityRes.data as UserActivity[] ?? []);
      setBadges(badgesRes.data as UserBadge[] ?? []);
      setAllBadges(allBadgesRes.data as Badge[] ?? []);
      setStreak(streakRes.data as Streak | null);
      setXpHistory(xpRes.data as XpTransaction[] ?? []);
      setQuizAttempts(attemptsRes.data as QuizAttempt[] ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    profile,
    progress,
    activities,
    badges,
    allBadges,
    streak,
    xpHistory,
    quizAttempts,
    loading,
    error,
    refresh: fetchAll,
    refreshProfile,
  };
}
