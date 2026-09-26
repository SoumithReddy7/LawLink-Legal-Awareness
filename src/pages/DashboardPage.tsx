import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap, Flame, Award, BookOpen, ArrowRight, TrendingUp, Target,
  CheckCircle2, Star, Trophy, Sparkles, Brain,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useUserData } from '@/hooks/useUserData';
import { useContent } from '@/hooks/useContent';
import { getLevelProgress } from '@/types';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import { DynamicIcon } from '@/components/ui/DynamicIcon';
import { DEMO_LEADERBOARD } from '@/data/content';

const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-amber-100 text-amber-700',
  advanced: 'bg-red-100 text-red-700',
};

const ACTIVITY_ICONS: Record<string, typeof CheckCircle2> = {
  quiz_completed: Brain,
  scenario_completed: Target,
  topic_completed: BookOpen,
  badge_unlocked: Trophy,
  xp_earned: Zap,
};

export function DashboardPage() {
  const { profile, refreshProfile } = useAuth();
  const { progress, activities, badges, allBadges, streak, quizAttempts, loading, refresh } = useUserData();
  const { topics, scenarios, quizzes } = useContent();

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (loading || !profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardSkeleton />
      </div>
    );
  }

  const levelInfo = getLevelProgress(profile.xp);
  const currentStreak = streak?.current_streak ?? 0;
  const unlockedBadgeIds = new Set(badges.map((b) => b.badge_id));
  const unlockedBadges = allBadges.filter((b) => unlockedBadgeIds.has(b.id));
  const completedTopics = progress.filter((p) => p.is_completed).length;
  const completedQuizzes = quizAttempts.length;

  // Continue learning — find the topic with most progress but not completed
  const continueTopic = progress
    .filter((p) => !p.is_completed)
    .sort((a, b) => b.scenarios_completed + b.quizzes_completed - a.scenarios_completed - a.quizzes_completed)[0];
  const continueTopicData = continueTopic ? topics.find((t) => t.id === continueTopic.topic_id) : topics[0];
  const continueProgress = continueTopic
    ? Math.min(((continueTopic.scenarios_completed + continueTopic.quizzes_completed) / 4) * 100, 100)
    : 0;

  // Daily challenge — pick a random scenario
  const dailyScenario = scenarios[Math.floor(Math.random() * Math.min(scenarios.length, 3))];

  // Recommended topics — topics not started yet
  const startedTopicIds = new Set(progress.map((p) => p.topic_id));
  const recommended = topics.filter((t) => !startedTopicIds.has(t.id)).slice(0, 3);
  const recommendedList = recommended.length > 0 ? recommended : topics.slice(0, 3);

  // Leaderboard preview — merge real user data with demo data
  const leaderboardData = [
    { display_name: profile.display_name, xp: profile.xp, isCurrentUser: true },
    ...DEMO_LEADERBOARD.slice(0, 5).map((d) => ({ ...d, isCurrentUser: false })),
  ].sort((a, b) => b.xp - a.xp).slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Welcome header */}
      <div className="animate-slide-up">
        <h1 className="text-2xl lg:text-3xl font-bold text-navy-900">
          Welcome back, {profile.display_name}
        </h1>
        <p className="text-navy-500 mt-1">Keep up the great work. Your legal knowledge is growing!</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={TrendingUp}
          label="Current Level"
          value={`Level ${profile.level}`}
          subtext={`${levelInfo.xpInLevel} / ${levelInfo.xpNeeded} XP to next`}
          color="from-navy-700 to-blue-700"
          progress={levelInfo.progress}
        />
        <StatCard
          icon={Zap}
          label="Total XP"
          value={`${profile.xp}`}
          subtext="Experience points"
          color="from-amber-500 to-orange-500"
        />
        <StatCard
          icon={Flame}
          label="Streak"
          value={`${currentStreak} days`}
          subtext={currentStreak > 0 ? 'Keep it going!' : 'Start today!'}
          color="from-orange-500 to-red-500"
        />
        <StatCard
          icon={Award}
          label="Badges"
          value={`${unlockedBadges.length}`}
          subtext={`of ${allBadges.length} total`}
          color="from-indigo-500 to-purple-600"
        />
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Continue Learning */}
        <div className="lg:col-span-2 space-y-6">
          {continueTopicData && (
            <div className="card p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Continue Learning</span>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-navy-50 flex items-center justify-center flex-shrink-0">
                    <DynamicIcon name={continueTopicData.icon} className="h-7 w-7 text-navy-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-navy-900 mb-1">{continueTopicData.title}</h2>
                    <p className="text-sm text-navy-500 line-clamp-2 mb-3">{continueTopicData.description}</p>
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-navy-500 mb-1">
                        <span>Progress</span>
                        <span>{Math.round(continueProgress)}%</span>
                      </div>
                      <ProgressBar value={continueProgress} color="bg-gradient-to-r from-blue-500 to-navy-700" />
                    </div>
                    <Link
                      to={`/topics/${continueTopicData.slug}`}
                      className="btn-primary text-sm"
                    >
                      Continue Learning <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Daily Challenge */}
          {dailyScenario && (
            <div className="card p-6 bg-gradient-to-br from-navy-50 to-blue-50 border-navy-200/40">
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Daily Challenge</span>
                <span className="badge-pill bg-amber-100 text-amber-700 ml-auto">
                  <Zap className="h-3 w-3" /> +10 XP
                </span>
              </div>
              <h3 className="font-bold text-navy-900 mb-2">{dailyScenario.title}</h3>
              <p className="text-sm text-navy-600 line-clamp-2 mb-4">{dailyScenario.situation}</p>
              <Link
                to={`/scenarios/${dailyScenario.id}`}
                className="btn-accent text-sm"
              >
                Take Challenge <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}

          {/* Recent Activity */}
          <div className="card p-6">
            <h3 className="font-bold text-navy-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" /> Recent Activity
            </h3>
            {activities.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-navy-400 mb-3">No activity yet. Start learning to see your progress here!</p>
                <Link to="/topics" className="btn-secondary text-sm">
                  Browse Topics
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {activities.slice(0, 8).map((activity) => {
                  const Icon = ACTIVITY_ICONS[activity.activity_type] ?? CheckCircle2;
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
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Achievements */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-navy-900 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" /> Achievements
              </h3>
              <Link to="/profile" className="text-xs text-blue-600 hover:text-blue-700 font-semibold">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {allBadges.slice(0, 6).map((badge) => {
                const unlocked = unlockedBadgeIds.has(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`flex flex-col items-center text-center p-2 rounded-xl transition-all ${
                      unlocked ? 'bg-amber-50' : 'bg-slate-50 opacity-50'
                    }`}
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

          {/* Recommended */}
          <div className="card p-6">
            <h3 className="font-bold text-navy-900 mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-blue-500" /> Recommended For You
            </h3>
            <div className="space-y-3">
              {recommendedList.map((topic) => (
                <Link
                  key={topic.id}
                  to={`/topics/${topic.slug}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center flex-shrink-0">
                    <DynamicIcon name={topic.icon} className="h-5 w-5 text-navy-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-navy-800 truncate">{topic.title}</p>
                    <span className={`badge-pill ${DIFFICULTY_STYLES[topic.difficulty]} mt-0.5`}>
                      {topic.difficulty}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-navy-400 group-hover:text-navy-700 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* Leaderboard Preview */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-navy-900 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" /> Leaderboard
              </h3>
              <Link to="/leaderboard" className="text-xs text-blue-600 hover:text-blue-700 font-semibold">
                Full list
              </Link>
            </div>
            <div className="space-y-2">
              {leaderboardData.map((entry, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-2 rounded-lg ${
                    entry.isCurrentUser ? 'bg-amber-100 border border-amber-300' : i === 0 ? 'bg-amber-50' : ''
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    i === 0 ? 'bg-amber-500 text-white' : i === 1 ? 'bg-slate-300 text-white' : i === 2 ? 'bg-orange-400 text-white' : 'bg-slate-100 text-navy-600'
                  }`}>
                    {i + 1}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-navy-600 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {entry.display_name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-navy-700 flex-1 truncate">
                    {entry.display_name}
                    {entry.isCurrentUser && <span className="text-[10px] text-amber-600 font-bold ml-1">You</span>}
                  </span>
                  <span className="text-xs font-bold text-amber-600 flex-shrink-0">{entry.xp} XP</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats footer */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
        <QuickStat label="Topics Completed" value={completedTopics} icon={BookOpen} />
        <QuickStat label="Quizzes Completed" value={completedQuizzes} icon={Brain} />
        <QuickStat label="Badges Unlocked" value={unlockedBadges.length} icon={Trophy} />
        <QuickStat label="Total Activities" value={activities.length} icon={Target} />
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, subtext, color, progress }: {
  icon: typeof Zap; label: string; value: string; subtext: string; color: string; progress?: number;
}) {
  return (
    <div className="card p-5 relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${color} opacity-5 rounded-full blur-2xl`} />
      <div className="relative">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <p className="text-xs font-semibold text-navy-400 uppercase tracking-wide">{label}</p>
        <p className="text-xl font-bold text-navy-900 mt-0.5">{value}</p>
        <p className="text-xs text-navy-400 mt-0.5">{subtext}</p>
        {progress !== undefined && (
          <div className="mt-2">
            <ProgressBar value={progress} size="sm" color="bg-gradient-to-r from-blue-500 to-navy-700" />
          </div>
        )}
      </div>
    </div>
  );
}

function QuickStat({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Zap }) {
  return (
    <div className="card p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center flex-shrink-0">
        <Icon className="h-5 w-5 text-navy-700" />
      </div>
      <div>
        <p className="text-lg font-bold text-navy-900">{value}</p>
        <p className="text-xs text-navy-400">{label}</p>
      </div>
    </div>
  );
}
