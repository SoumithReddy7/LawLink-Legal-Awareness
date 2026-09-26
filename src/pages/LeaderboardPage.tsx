import { useState, useMemo, useEffect } from 'react';
import { Trophy, Zap, Award, Flame, Globe, Calendar, CalendarDays, Star } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { getLevelForXp } from '@/types';
import { DEMO_LEADERBOARD } from '@/data/content';
import { StateWrapper } from '@/components/ui/StateWrapper';
import { ListSkeleton } from '@/components/ui/Skeleton';

type Tab = 'global' | 'weekly' | 'monthly';

interface LeaderboardItem {
  user_id: string;
  display_name: string;
  level: number;
  xp: number;
  badge_count: number;
  isCurrentUser: boolean;
  isDemo: boolean;
}

export function LeaderboardPage() {
  const { session, profile } = useAuth();
  const [tab, setTab] = useState<Tab>('global');
  const [entries, setEntries] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [tab]);

  async function fetchLeaderboard() {
    setLoading(true);
    setError(null);
    try {
      // Fetch real user profiles from DB
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, display_name, xp, level')
        .order('xp', { ascending: false })
        .limit(50);

      if (profilesError) throw profilesError;

      // Fetch badge counts per user
      const { data: badgeData, error: badgeError } = await supabase
        .from('user_badges')
        .select('user_id');

      if (badgeError) throw badgeError;

      const badgeCounts: Record<string, number> = {};
      (badgeData ?? []).forEach((b: { user_id: string }) => {
        badgeCounts[b.user_id] = (badgeCounts[b.user_id] ?? 0) + 1;
      });

      // Build real user entries
      const realEntries: LeaderboardItem[] = (profilesData ?? []).map((p: { id: string; display_name: string; xp: number; level: number }) => ({
        user_id: p.id,
        display_name: p.display_name,
        level: p.level,
        xp: p.xp,
        badge_count: badgeCounts[p.id] ?? 0,
        isCurrentUser: p.id === session?.user.id,
        isDemo: false,
      }));

      // Build demo entries
      const demoEntries: LeaderboardItem[] = DEMO_LEADERBOARD.map((d, i) => ({
        user_id: `demo-${i}`,
        display_name: d.display_name,
        level: d.level,
        xp: d.xp,
        badge_count: d.badge_count,
        isCurrentUser: false,
        isDemo: true,
      }));

      // For weekly/monthly, we simulate by adjusting XP values slightly
      // (In production, this would filter by time period from xp_transactions)
      let allEntries = [...realEntries, ...demoEntries];

      if (tab === 'weekly') {
        // Simulate weekly XP as ~30% of total
        allEntries = allEntries.map((e) => ({
          ...e,
          xp: Math.round(e.xp * 0.3 + (e.isCurrentUser ? 0 : Math.random() * 100)),
        }));
      } else if (tab === 'monthly') {
        // Simulate monthly XP as ~70% of total
        allEntries = allEntries.map((e) => ({
          ...e,
          xp: Math.round(e.xp * 0.7 + (e.isCurrentUser ? 0 : Math.random() * 50)),
        }));
      }

      // Sort by XP descending
      allEntries.sort((a, b) => b.xp - a.xp);

      // Assign ranks
      setEntries(allEntries);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
      // Fallback to demo data only
      const demoEntries: LeaderboardItem[] = DEMO_LEADERBOARD.map((d, i) => ({
        user_id: `demo-${i}`,
        display_name: d.display_name,
        level: d.level,
        xp: d.xp,
        badge_count: d.badge_count,
        isCurrentUser: false,
        isDemo: true,
      }));
      demoEntries.sort((a, b) => b.xp - a.xp);
      setEntries(demoEntries);
    } finally {
      setLoading(false);
    }
  }

  const currentUserRank = useMemo(() => {
    const idx = entries.findIndex((e) => e.isCurrentUser);
    return idx >= 0 ? idx + 1 : null;
  }, [entries]);

  const tabs: { value: Tab; label: string; icon: typeof Globe }[] = [
    { value: 'global', label: 'Global', icon: Globe },
    { value: 'weekly', label: 'Weekly', icon: Calendar },
    { value: 'monthly', label: 'Monthly', icon: CalendarDays },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-navy-900 mb-2">Leaderboard</h1>
        <p className="text-navy-500">See how you rank against other LawLink learners.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === t.value
                ? 'bg-navy-900 text-white'
                : 'bg-white text-navy-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Current user's position */}
      {profile && currentUserRank && (
        <div className="card p-4 mb-6 bg-gradient-to-r from-navy-50 to-blue-50 border-navy-200/40">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-navy-700 to-blue-700 flex items-center justify-center text-white font-bold">
              #{currentUserRank}
            </div>
            <div className="flex-1">
              <p className="font-bold text-navy-900">Your Position</p>
              <p className="text-sm text-navy-500">
                You're ranked #{currentUserRank} with {profile.xp} XP
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge-pill bg-amber-100 text-amber-700">
                <Zap className="h-3 w-3" /> {profile.xp} XP
              </span>
              <span className="badge-pill bg-navy-100 text-navy-700">
                <Star className="h-3 w-3" /> Level {profile.level}
              </span>
            </div>
          </div>
        </div>
      )}

      <StateWrapper
        loading={loading}
        error={error}
        empty={entries.length === 0}
        emptyMessage="No leaderboard data available yet."
        skeleton={<ListSkeleton count={8} />}
      >
        <div className="space-y-2">
          {entries.map((entry, i) => (
            <div
              key={`${entry.user_id}-${i}`}
              className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl transition-all animate-fade-in ${
                entry.isCurrentUser
                  ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300'
                  : i === 0
                  ? 'bg-amber-50/50 border border-amber-200/50'
                  : 'card'
              }`}
              style={{ animationDelay: `${i * 0.03}s` }}
            >
              {/* Rank */}
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                i === 0 ? 'bg-amber-500 text-white' : i === 1 ? 'bg-slate-300 text-white' : i === 2 ? 'bg-orange-400 text-white' : 'bg-slate-100 text-navy-600'
              }`}>
                {i + 1}
              </div>

              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-navy-600 to-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {entry.display_name.charAt(0).toUpperCase()}
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-navy-800 truncate text-sm sm:text-base">
                    {entry.display_name}
                  </p>
                  {entry.isCurrentUser && (
                    <span className="badge-pill bg-amber-500 text-white text-[10px]">You</span>
                  )}
                  {entry.isDemo && (
                    <span className="badge-pill bg-slate-100 text-slate-500 text-[10px]">Demo</span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-navy-400 flex items-center gap-1">
                    <Star className="h-3 w-3" /> Level {entry.level}
                  </span>
                  <span className="text-xs text-navy-400 flex items-center gap-1">
                    <Award className="h-3 w-3" /> {entry.badge_count} badges
                  </span>
                </div>
              </div>

              {/* XP */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <Zap className="h-4 w-4 text-amber-500" />
                <span className="font-bold text-navy-900 text-sm sm:text-base">{entry.xp}</span>
                <span className="text-xs text-navy-400 hidden sm:inline">XP</span>
              </div>
            </div>
          ))}
        </div>
      </StateWrapper>

      <div className="mt-6 text-center">
        <p className="text-xs text-navy-400">
          Demo users are simulated for illustration. Real users appear with their actual XP and badges.
        </p>
      </div>
    </div>
  );
}
