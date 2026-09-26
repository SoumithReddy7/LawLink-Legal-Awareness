import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap, Flame, Trophy, Brain, Target, BookOpen, TrendingUp,
  Award, ArrowRight, Activity,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useUserData } from '@/hooks/useUserData';
import { useContent } from '@/hooks/useContent';
import { getLevelProgress, XP_REWARDS } from '@/types';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import { DynamicIcon } from '@/components/ui/DynamicIcon';

const ACTIVITY_ICONS: Record<string, typeof Zap> = {
  quiz_completed: Brain,
  scenario_completed: Target,
  topic_completed: BookOpen,
  badge_unlocked: Trophy,
  xp_earned: Zap,
};

export function ProgressPage() {
  const { profile } = useAuth();
  const { progress, activities, badges, allBadges, streak, xpHistory, quizAttempts, loading } = useUserData();
  const { topics } = useContent();

  const stats = useMemo(() => {
    if (!profile) return null;

    const unlockedBadgeIds = new Set(badges.map((b) => b.badge_id));
    const unlockedBadges = allBadges.filter((b) => unlockedBadgeIds.has(b.id));
    const completedTopics = progress.filter((p) => p.is_completed).length;
    const totalScenariosCompleted = progress.reduce((sum, p) => sum + p.scenarios_completed, 0);
    const totalQuizzesCompleted = progress.reduce((sum, p) => sum + p.quizzes_completed, 0);

    // Quiz performance
    const avgScore = quizAttempts.length > 0
      ? Math.round((quizAttempts.reduce((sum, a) => sum + (a.score / a.total) * 100, 0) / quizAttempts.length))
      : 0;
    const bestScore = quizAttempts.length > 0
      ? Math.max(...quizAttempts.map((a) => Math.round((a.score / a.total) * 100)))
      : 0;

    // XP by activity type
    const xpByType: Record<string, number> = {};
    xpHistory.forEach((tx) => {
      const type = tx.reason.includes('quiz') ? 'Quizzes'
        : tx.reason.includes('scenario') ? 'Scenarios'
        : tx.reason.includes('topic') ? 'Topics'
        : 'Other';
      xpByType[type] = (xpByType[type] ?? 0) + tx.amount;
    });

    // Overall completion across all topics
    const totalPossible = topics.length;
    const overallCompletion = totalPossible > 0 ? (completedTopics / totalPossible) * 100 : 0;

    return {
      unlockedBadges,
      completedTopics,
      totalScenariosCompleted,
      totalQuizzesCompleted,
      avgScore,
      bestScore,
      xpByType,
      overallCompletion,
    };
  }, [profile, progress, badges, allBadges, xpHistory, quizAttempts, topics]);

  if (loading || !profile || !stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardSkeleton />
      </div>
    );
  }

  const levelInfo = getLevelProgress(profile.xp);
  const currentStreak = streak?.current_streak ?? 0;
  const longestStreak = streak?.longest_streak ?? 0;
  const maxXpValue = Math.max(...Object.values(stats.xpByType), 1);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-navy-900 mb-2">Progress Analytics</h1>
        <p className="text-navy-500">Track your learning journey and achievements.</p>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <OverviewCard icon={TrendingUp} label="Overall Completion" value={`${Math.round(stats.overallCompletion)}%`} color="from-navy-700 to-blue-700" />
        <OverviewCard icon={Zap} label="Total XP" value={`${profile.xp}`} color="from-amber-500 to-orange-500" />
        <OverviewCard icon={Flame} label="Current Streak" value={`${currentStreak}d`} color="from-orange-500 to-red-500" />
        <OverviewCard icon={Trophy} label="Badges" value={`${stats.unlockedBadges.length}/${allBadges.length}`} color="from-indigo-500 to-purple-600" />
      </div>

      {/* Level progress */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-navy-900 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" /> Level Progress
          </h3>
          <Link to="/profile" className="text-xs text-blue-600 hover:text-blue-700 font-semibold">View profile</Link>
        </div>
        <div className="flex justify-between text-sm text-navy-600 mb-2">
          <span className="font-bold">Level {levelInfo.level}</span>
          <span>{levelInfo.xpInLevel} / {levelInfo.xpNeeded} XP</span>
        </div>
        <ProgressBar value={levelInfo.progress} size="lg" color="bg-gradient-to-r from-blue-500 to-navy-700" />
        <div className="flex justify-between text-xs text-navy-400 mt-2">
          <span>Started: {levelInfo.currentLevelXp} XP</span>
          <span>Next: {levelInfo.nextLevelXp} XP</span>
        </div>
      </div>

      {/* Topic progress */}
      <div className="card p-6">
        <h3 className="font-bold text-navy-900 mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-600" /> Topic Progress
        </h3>
        <div className="space-y-3">
          {topics.map((topic) => {
            const topicProgress = progress.find((p) => p.topic_id === topic.id);
            const scenariosDone = topicProgress?.scenarios_completed ?? 0;
            const quizzesDone = topicProgress?.quizzes_completed ?? 0;
            const total = scenariosDone + quizzesDone;
            const isCompleted = topicProgress?.is_completed ?? false;

            return (
              <div key={topic.id} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-navy-50 flex items-center justify-center flex-shrink-0">
                  <DynamicIcon name={topic.icon} className="h-4.5 w-4.5 text-navy-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-navy-800 truncate">{topic.title}</span>
                    <span className="text-xs text-navy-400 flex-shrink-0 ml-2">
                      {isCompleted ? 'Completed' : total > 0 ? `${total} activities` : 'Not started'}
                    </span>
                  </div>
                  <ProgressBar
                    value={isCompleted ? 100 : total * 25}
                    size="sm"
                    color={isCompleted ? 'bg-green-500' : 'bg-gradient-to-r from-blue-500 to-navy-700'}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quiz performance */}
        <div className="card p-6">
          <h3 className="font-bold text-navy-900 mb-4 flex items-center gap-2">
            <Brain className="h-5 w-5 text-amber-500" /> Quiz Performance
          </h3>
          {quizAttempts.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-navy-400 mb-3">No quiz attempts yet.</p>
              <Link to="/quizzes" className="btn-secondary text-sm">Take a Quiz</Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-navy-900">{quizAttempts.length}</p>
                  <p className="text-xs text-navy-400">Attempts</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-amber-600">{stats.avgScore}%</p>
                  <p className="text-xs text-navy-400">Avg Score</p>
                </div>
                <div className="bg-green-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-green-600">{stats.bestScore}%</p>
                  <p className="text-xs text-navy-400">Best Score</p>
                </div>
              </div>
              <div className="space-y-2">
                {quizAttempts.slice(0, 5).map((attempt) => {
                  const percentage = Math.round((attempt.score / attempt.total) * 100);
                  return (
                    <div key={attempt.id} className="flex items-center gap-3 text-sm">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${percentage >= 80 ? 'bg-green-500' : percentage >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} />
                      <span className="text-navy-700 flex-1">{attempt.score}/{attempt.total}</span>
                      <span className="text-navy-400 text-xs">
                        {new Date(attempt.completed_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="font-bold text-navy-800 text-xs">{percentage}%</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* XP breakdown */}
        <div className="card p-6">
          <h3 className="font-bold text-navy-900 mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" /> XP Breakdown
          </h3>
          {Object.keys(stats.xpByType).length === 0 ? (
            <p className="text-sm text-navy-400 text-center py-6">No XP earned yet. Start learning!</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(stats.xpByType).map(([type, amount]) => (
                <div key={type}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-navy-700">{type}</span>
                    <span className="font-bold text-amber-600">{amount} XP</span>
                  </div>
                  <ProgressBar
                    value={(amount / maxXpValue) * 100}
                    size="sm"
                    color="bg-gradient-to-r from-amber-400 to-orange-500"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Streak & badges row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Streak history */}
        <div className="card p-6">
          <h3 className="font-bold text-navy-900 mb-4 flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" /> Streak History
          </h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-orange-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-orange-600">{currentStreak}</p>
              <p className="text-xs text-navy-400 mt-1">Current Streak (days)</p>
            </div>
            <div className="bg-navy-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-navy-900">{longestStreak}</p>
              <p className="text-xs text-navy-400 mt-1">Longest Streak (days)</p>
            </div>
          </div>
          <div className="flex gap-1">
            {[...Array(14)].map((_, i) => {
              const daysAgo = 13 - i;
              const date = new Date(Date.now() - daysAgo * 86400000);
              const dateStr = date.toISOString().split('T')[0];
              const hasActivity = activities.some(
                (a) => new Date(a.created_at).toISOString().split('T')[0] === dateStr
              );
              const isToday = daysAgo === 0;
              return (
                <div
                  key={i}
                  className={`flex-1 h-8 rounded ${hasActivity ? 'bg-gradient-to-b from-orange-400 to-red-500' : 'bg-slate-100'} ${isToday ? 'ring-2 ring-navy-700' : ''}`}
                  title={date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                />
              );
            })}
          </div>
          <p className="text-xs text-navy-400 mt-2 text-center">Last 14 days</p>
        </div>

        {/* Badges */}
        <div className="card p-6">
          <h3 className="font-bold text-navy-900 mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-indigo-500" /> Badges Earned
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {allBadges.map((badge) => {
              const unlocked = stats.unlockedBadges.some((b) => b.id === badge.id);
              return (
                <div
                  key={badge.id}
                  className={`flex flex-col items-center text-center p-2 rounded-xl ${
                    unlocked ? 'bg-amber-50' : 'bg-slate-50 opacity-40'
                  }`}
                  title={badge.description}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
                    unlocked ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 'bg-slate-200'
                  }`}>
                    <DynamicIcon name={badge.icon} className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-[10px] font-medium text-navy-600 leading-tight">{badge.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent activity feed */}
      <div className="card p-6">
        <h3 className="font-bold text-navy-900 mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-green-600" /> Recent Activity
        </h3>
        {activities.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm text-navy-400 mb-3">No activity yet. Start your learning journey!</p>
            <Link to="/topics" className="btn-secondary text-sm">Browse Topics</Link>
          </div>
        ) : (
          <div className="space-y-2">
            {activities.slice(0, 15).map((activity) => {
              const Icon = ACTIVITY_ICONS[activity.activity_type] ?? Activity;
              return (
                <div key={activity.id} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
                  <div className="w-8 h-8 rounded-lg bg-navy-50 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 text-navy-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy-800 truncate">{activity.title}</p>
                    <p className="text-xs text-navy-400">
                      {new Date(activity.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  {activity.xp_amount && (
                    <span className="badge-pill bg-amber-100 text-amber-700 flex-shrink-0">
                      <Zap className="h-3 w-3" /> +{activity.xp_amount}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/quizzes" className="btn-primary flex-1">
          <Brain className="h-4 w-4" /> Take a Quiz
        </Link>
        <Link to="/scenarios" className="btn-secondary flex-1">
          <Target className="h-4 w-4" /> Try a Scenario
        </Link>
        <Link to="/dashboard" className="btn-ghost flex-1">
          Back to Dashboard <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function OverviewCard({ icon: Icon, label, value, color }: {
  icon: typeof Zap; label: string; value: string; color: string;
}) {
  return (
    <div className="card p-5">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <p className="text-2xl font-bold text-navy-900">{value}</p>
      <p className="text-xs text-navy-400 mt-0.5">{label}</p>
    </div>
  );
}
