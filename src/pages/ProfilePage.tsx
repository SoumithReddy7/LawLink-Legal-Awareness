import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Zap, Flame, Award, BookOpen, Brain, Target, Trophy, Star,
  Edit2, LogOut, Globe, Check, X, TrendingUp, ArrowRight, CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useUserData } from '@/hooks/useUserData';
import { useContent } from '@/hooks/useContent';
import { useToast } from '@/components/ui/toast';
import { getLevelProgress } from '@/types';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import { DynamicIcon } from '@/components/ui/DynamicIcon';
import { LANGUAGES } from '@/data/content';

const ACTIVITY_ICONS: Record<string, typeof CheckCircle2> = {
  quiz_completed: Brain,
  scenario_completed: Target,
  topic_completed: BookOpen,
  badge_unlocked: Trophy,
  xp_earned: Zap,
};

export function ProfilePage() {
  const { profile, updateProfile, signOut } = useAuth();
  const { progress, activities, badges, allBadges, streak, quizAttempts, loading, refresh } = useUserData();
  const { topics } = useContent();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '');
  const [language, setLanguage] = useState(profile?.preferred_language ?? 'en');
  const [saving, setSaving] = useState(false);

  if (loading || !profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardSkeleton />
      </div>
    );
  }

  const levelInfo = getLevelProgress(profile.xp);
  const currentStreak = streak?.current_streak ?? 0;
  const longestStreak = streak?.longest_streak ?? 0;
  const unlockedBadgeIds = new Set(badges.map((b) => b.badge_id));
  const unlockedBadges = allBadges.filter((b) => unlockedBadgeIds.has(b.id));
  const completedTopics = progress.filter((p) => p.is_completed).length;
  const completedQuizzes = quizAttempts.length;

  async function handleSave() {
    setSaving(true);
    const { error } = await updateProfile({
      display_name: displayName,
      preferred_language: language,
    });
    setSaving(false);
    if (error) {
      showToast('error', 'Update failed', error);
    } else {
      showToast('success', 'Profile updated', 'Your changes have been saved.');
      setEditing(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  // Best quiz scores
  const bestQuizScores = quizAttempts.reduce((acc, attempt) => {
    const existing = acc[attempt.quiz_id];
    if (!existing || attempt.score > existing.score) {
      acc[attempt.quiz_id] = attempt;
    }
    return acc;
  }, {} as Record<string, typeof quizAttempts[0]>);

  const quizList = Object.values(bestQuizScores).slice(0, 5);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Profile header */}
      <div className="card p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-navy-700 to-blue-700 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {profile.display_name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-navy-900">{profile.display_name}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="badge-pill bg-navy-100 text-navy-700">
                <Star className="h-3 w-3" /> Level {profile.level}
              </span>
              <span className="badge-pill bg-amber-100 text-amber-700">
                <Zap className="h-3 w-3" /> {profile.xp} XP
              </span>
              {currentStreak > 0 && (
                <span className="badge-pill bg-orange-100 text-orange-700">
                  <Flame className="h-3 w-3" /> {currentStreak} day streak
                </span>
              )}
              <span className="badge-pill bg-indigo-100 text-indigo-700">
                <Trophy className="h-3 w-3" /> {unlockedBadges.length} badges
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setEditing(!editing)} className="btn-secondary text-sm">
              <Edit2 className="h-4 w-4" /> Edit
            </button>
            <button onClick={handleSignOut} className="btn-ghost text-sm text-red-600 hover:bg-red-50">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Edit form */}
      {editing && (
        <div className="card p-6 animate-slide-up">
          <h2 className="font-bold text-navy-900 mb-4">Edit Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="label" htmlFor="displayName">Display Name</label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="label" htmlFor="language">Preferred Language</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="input pl-10 appearance-none"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code} disabled={lang.status === 'coming_soon'}>
                      {lang.label}
                      {lang.status === 'coming_soon' ? ' — Coming Soon' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleSave} disabled={saving} className="btn-primary text-sm">
                <Check className="h-4 w-4" /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button onClick={() => { setEditing(false); setDisplayName(profile.display_name); }} className="btn-secondary text-sm">
                <X className="h-4 w-4" /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBox icon={TrendingUp} label="Level" value={`${profile.level}`} color="from-navy-700 to-blue-700" />
        <StatBox icon={Zap} label="Total XP" value={`${profile.xp}`} color="from-amber-500 to-orange-500" />
        <StatBox icon={Flame} label="Current Streak" value={`${currentStreak}d`} color="from-orange-500 to-red-500" />
        <StatBox icon={Trophy} label="Badges" value={`${unlockedBadges.length}`} color="from-indigo-500 to-purple-600" />
      </div>

      {/* Level progress */}
      <div className="card p-6">
        <h3 className="font-bold text-navy-900 mb-3">Level Progress</h3>
        <div className="flex justify-between text-sm text-navy-600 mb-2">
          <span>Level {levelInfo.level}</span>
          <span>{levelInfo.xpInLevel} / {levelInfo.xpNeeded} XP to Level {levelInfo.level + 1}</span>
        </div>
        <ProgressBar value={levelInfo.progress} size="lg" color="bg-gradient-to-r from-blue-500 to-navy-700" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Badges */}
        <div className="card p-6">
          <h3 className="font-bold text-navy-900 mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" /> Badges ({unlockedBadges.length}/{allBadges.length})
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {allBadges.map((badge) => {
              const unlocked = unlockedBadgeIds.has(badge.id);
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

        {/* Quick stats */}
        <div className="card p-6">
          <h3 className="font-bold text-navy-900 mb-4">Learning Summary</h3>
          <div className="space-y-3">
            <SummaryRow icon={BookOpen} label="Topics Completed" value={completedTopics} />
            <SummaryRow icon={Brain} label="Quizzes Completed" value={completedQuizzes} />
            <SummaryRow icon={Target} label="Total Activities" value={activities.length} />
            <SummaryRow icon={Flame} label="Longest Streak" value={`${longestStreak} days`} />
          </div>
          <Link to="/progress" className="btn-secondary text-sm w-full mt-4">
            View Detailed Progress <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Quiz history */}
      <div className="card p-6">
        <h3 className="font-bold text-navy-900 mb-4 flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-600" /> Quiz History
        </h3>
        {quizList.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm text-navy-400 mb-3">No quizzes completed yet.</p>
            <Link to="/quizzes" className="btn-secondary text-sm">Take a Quiz</Link>
          </div>
        ) : (
          <div className="space-y-2">
            {quizList.map((attempt) => {
              const topic = topics.find((t) => t.id === attempt.quiz_id.replace('q-', 't-').split('-').slice(0, 2).join('-'));
              const percentage = Math.round((attempt.score / attempt.total) * 100);
              return (
                <div key={attempt.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    percentage >= 80 ? 'bg-green-100' : percentage >= 50 ? 'bg-amber-100' : 'bg-red-100'
                  }`}>
                    <span className="text-sm font-bold text-navy-700">{percentage}%</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-navy-800">
                      Score: {attempt.score}/{attempt.total}
                    </p>
                    <p className="text-xs text-navy-400">
                      {new Date(attempt.completed_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  {attempt.xp_awarded > 0 && (
                    <span className="badge-pill bg-amber-100 text-amber-700 flex-shrink-0">
                      <Zap className="h-3 w-3" /> +{attempt.xp_awarded}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent activity */}
      <div className="card p-6">
        <h3 className="font-bold text-navy-900 mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-green-600" /> Recent Activity
        </h3>
        {activities.length === 0 ? (
          <p className="text-sm text-navy-400 text-center py-4">No activity yet.</p>
        ) : (
          <div className="space-y-2">
            {activities.slice(0, 10).map((activity) => {
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
  );
}

function StatBox({ icon: Icon, label, value, color }: {
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

function SummaryRow({ icon: Icon, label, value }: {
  icon: typeof Zap; label: string; value: string | number;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-navy-400" />
        <span className="text-sm text-navy-600">{label}</span>
      </div>
      <span className="text-sm font-bold text-navy-900">{value}</span>
    </div>
  );
}
