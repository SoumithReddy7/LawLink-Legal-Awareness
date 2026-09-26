import { supabase } from '@/lib/supabase';
import { XP_REWARDS, getLevelForXp, type Profile } from '@/types';

export interface XpAwardResult {
  awarded: boolean;
  newTotal: number;
  newLevel: number;
  leveledUp: boolean;
  amount: number;
}

// Awards XP with duplicate prevention via reference_type + reference_id.
// Returns whether XP was actually awarded and whether the user leveled up.
export async function awardXp(
  userId: string,
  amount: number,
  reason: string,
  referenceType?: string,
  referenceId?: string,
): Promise<XpAwardResult> {
  // Check for duplicate if reference info is provided
  if (referenceType && referenceId) {
    const { data: existing } = await supabase
      .from('xp_transactions')
      .select('id')
      .eq('user_id', userId)
      .eq('reference_type', referenceType)
      .eq('reference_id', referenceId)
      .maybeSingle();

    if (existing) {
      return { awarded: false, newTotal: 0, newLevel: 0, leveledUp: false, amount: 0 };
    }
  }

  // Insert XP transaction
  const { error: txError } = await supabase.from('xp_transactions').insert({
    user_id: userId,
    amount,
    reason,
    reference_type: referenceType ?? null,
    reference_id: referenceId ?? null,
  });

  if (txError) {
    console.error('XP transaction error:', txError);
    return { awarded: false, newTotal: 0, newLevel: 0, leveledUp: false, amount: 0 };
  }

  // Fetch current profile to calculate new total
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('xp, level')
    .eq('id', userId)
    .maybeSingle();

  if (profileError || !profile) {
    return { awarded: true, newTotal: 0, newLevel: 0, leveledUp: false, amount };
  }

  const newTotal = profile.xp + amount;
  const newLevel = getLevelForXp(newTotal);
  const leveledUp = newLevel > profile.level;

  // Update profile with new XP and level
  await supabase.from('profiles').update({ xp: newTotal, level: newLevel }).eq('id', userId);

  return { awarded: true, newTotal, newLevel, leveledUp, amount };
}

export async function recordActivity(
  userId: string,
  activityType: string,
  title: string,
  xpAmount?: number,
) {
  const { error } = await supabase.from('user_activity').insert({
    user_id: userId,
    activity_type: activityType,
    title,
    xp_amount: xpAmount ?? null,
  });

  if (error) console.error('Activity record error:', error);
}

export async function updateStreak(userId: string): Promise<{ currentStreak: number; isNew: boolean }> {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const { data: streak } = await supabase
    .from('streaks')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (!streak) {
    // Create new streak
    await supabase.from('streaks').insert({
      user_id: userId,
      current_streak: 1,
      longest_streak: 1,
      last_activity_date: today,
    });
    return { currentStreak: 1, isNew: true };
  }

  if (streak.last_activity_date === today) {
    return { currentStreak: streak.current_streak, isNew: false };
  }

  const newStreak = streak.last_activity_date === yesterday ? streak.current_streak + 1 : 1;
  const newLongest = Math.max(streak.longest_streak, newStreak);

  await supabase
    .from('streaks')
    .update({
      current_streak: newStreak,
      longest_streak: newLongest,
      last_activity_date: today,
    })
    .eq('id', streak.id);

  return { currentStreak: newStreak, isNew: newStreak !== streak.current_streak };
}

export async function getStreak(userId: string): Promise<number> {
  const { data } = await supabase
    .from('streaks')
    .select('current_streak')
    .eq('user_id', userId)
    .maybeSingle();
  return data?.current_streak ?? 0;
}

export async function checkAndUnlockBadge(
  userId: string,
  badgeId: string,
): Promise<{ unlocked: boolean; badgeName: string }> {
  // Check if already unlocked
  const { data: existing } = await supabase
    .from('user_badges')
    .select('id')
    .eq('user_id', userId)
    .eq('badge_id', badgeId)
    .maybeSingle();

  if (existing) return { unlocked: false, badgeName: '' };

  // Get badge info
  const { data: badge } = await supabase
    .from('badges')
    .select('name')
    .eq('id', badgeId)
    .maybeSingle();

  if (!badge) return { unlocked: false, badgeName: '' };

  const { error } = await supabase.from('user_badges').insert({
    user_id: userId,
    badge_id: badgeId,
  });

  if (error) {
    console.error('Badge unlock error:', error);
    return { unlocked: false, badgeName: '' };
  }

  return { unlocked: true, badgeName: badge.name };
}

export async function checkBadgesAfterActivity(
  userId: string,
  profile: Profile,
  context: { activityCount?: number; topicCount?: number; quizCount?: number; scenarioCount?: number; perfectScore?: boolean; streak?: number; firstActivity?: boolean; firstQuiz?: boolean; topicCompleted?: string },
): Promise<string[]> {
  const unlockedBadges: string[] = [];

  const badgeChecks: { badgeId: string; condition: boolean }[] = [
    { badgeId: 'b-first-step', condition: context.firstActivity === true },
    { badgeId: 'b-quiz-starter', condition: context.firstQuiz === true },
    { badgeId: 'b-perfect-score', condition: context.perfectScore === true },
    { badgeId: 'b-consistency', condition: (context.streak ?? 0) >= 7 },
    { badgeId: 'b-knowledge-seeker', condition: (context.activityCount ?? 0) >= 5 },
    { badgeId: 'b-legal-explorer', condition: (context.topicCount ?? 0) >= 3 },
    { badgeId: 'b-scenario-master', condition: (context.scenarioCount ?? 0) >= 5 },
    { badgeId: 'b-cyber-guardian', condition: context.topicCompleted === 't-cyber' },
  ];

  for (const check of badgeChecks) {
    if (check.condition) {
      const result = await checkAndUnlockBadge(userId, check.badgeId);
      if (result.unlocked) unlockedBadges.push(result.badgeName);
    }
  }

  return unlockedBadges;
}

export { XP_REWARDS };
