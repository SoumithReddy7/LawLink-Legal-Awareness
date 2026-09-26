import { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle2, XCircle, Lightbulb, AlertTriangle,
  ArrowRight, Zap, Target, Sparkles,
} from 'lucide-react';
import { useContent } from '@/hooks/useContent';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/ui/toast';
import { awardXp, recordActivity, updateStreak, checkBadgesAfterActivity } from '@/lib/gamification';
import { supabase } from '@/lib/supabase';
import { XP_REWARDS } from '@/types';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StateWrapper } from '@/components/ui/StateWrapper';
import { LevelUpModal } from '@/components/ui/LevelUpModal';
import { BadgeUnlockModal } from '@/components/ui/BadgeUnlockModal';

export function ScenarioDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { scenarios, topics, loading, error } = useContent();
  const { session, profile, refreshProfile } = useAuth();
  const { showToast } = useToast();

  const scenario = useMemo(() => scenarios.find((s) => s.id === id), [scenarios, id]);
  const relatedScenarios = useMemo(
    () => (scenario ? scenarios.filter((s) => s.topic_id === scenario.topic_id && s.id !== scenario.id) : []),
    [scenarios, scenario],
  );
  const topic = useMemo(() => (scenario ? topics.find((t) => t.id === scenario.topic_id) : undefined), [topics, scenario]);

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [awarding, setAwarding] = useState(false);
  const [levelUpLevel, setLevelUpLevel] = useState<number | null>(null);
  const [unlockedBadge, setUnlockedBadge] = useState<string | null>(null);

  useEffect(() => {
    setSelectedOption(null);
    setRevealed(false);
  }, [id]);

  async function handleSelectOption(optionIndex: number) {
    if (revealed || !scenario || !scenario.options) return;
    setSelectedOption(optionIndex);
    setRevealed(true);
    setAwarding(true);

    if (!session || !profile) {
      setAwarding(false);
      return;
    }

    const isCorrect = scenario.options[optionIndex].is_correct;
    const userId = session.user.id;

    try {
      // Update streak
      await updateStreak(userId);

      if (isCorrect) {
        // Award XP
        const xpResult = await awardXp(
          userId,
          XP_REWARDS.SCENARIO,
          `Completed scenario: ${scenario.title}`,
          'scenario',
          scenario.id,
        );

        if (xpResult.awarded) {
          showToast('xp', `+${xpResult.amount} XP`, 'Great job! You earned XP for this scenario.');

          // Record activity
          await recordActivity(userId, 'scenario_completed', `Completed scenario: ${scenario.title}`, XP_REWARDS.SCENARIO);

          // Update user progress
          const { data: existingProgress } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', userId)
            .eq('topic_id', scenario.topic_id)
            .maybeSingle();

          if (existingProgress) {
            await supabase
              .from('user_progress')
              .update({
                scenarios_completed: existingProgress.scenarios_completed + 1,
                updated_at: new Date().toISOString(),
              })
              .eq('id', existingProgress.id);
          } else {
            await supabase.from('user_progress').insert({
              user_id: userId,
              topic_id: scenario.topic_id,
              scenarios_completed: 1,
              quizzes_completed: 0,
              is_completed: false,
            });
          }

          // Check for level up
          if (xpResult.leveledUp) {
            setLevelUpLevel(xpResult.newLevel);
            await refreshProfile();
          }

          // Check badges
          const { count: activityCount } = await supabase
            .from('user_activity')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', userId);

          const { count: scenarioCount } = await supabase
            .from('user_activity')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('activity_type', 'scenario_completed');

          const { data: streakData } = await supabase
            .from('streaks')
            .select('current_streak')
            .eq('user_id', userId)
            .maybeSingle();

          const unlockedBadges = await checkBadgesAfterActivity(userId, profile, {
            activityCount: activityCount ?? 0,
            scenarioCount: scenarioCount ?? 0,
            streak: streakData?.current_streak ?? 0,
            firstActivity: (activityCount ?? 0) === 1,
          });

          if (unlockedBadges.length > 0) {
            setUnlockedBadge(unlockedBadges[0]);
            showToast('badge', 'Badge Unlocked!', unlockedBadges[0]);
          }

          await refreshProfile();
        }
      } else {
        // Still record activity for incorrect answers
        await recordActivity(userId, 'scenario_completed', `Attempted scenario: ${scenario.title}`);
        await updateStreak(userId);
      }
    } catch (err) {
      console.error('Scenario completion error:', err);
    } finally {
      setAwarding(false);
    }
  }

  if (!loading && !scenario) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-navy-900 mb-2">Scenario not found</h1>
        <Link to="/scenarios" className="btn-primary mt-4">Browse all scenarios</Link>
      </div>
    );
  }

  const currentStep = revealed ? 2 : 1;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/scenarios" className="inline-flex items-center gap-1 text-sm text-navy-500 hover:text-navy-700 mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to Scenarios
      </Link>

      <StateWrapper loading={loading} error={error} empty={!scenario}>
        {scenario && (
          <div className="animate-fade-in">
            {/* Progress indicator */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${currentStep >= 1 ? 'bg-navy-900 text-white' : 'bg-slate-200 text-slate-400'}`}>
                  1
                </div>
                <span className="text-sm font-medium text-navy-600">Decision</span>
              </div>
              <div className="flex-1 h-0.5 bg-slate-200">
                <div className={`h-full bg-navy-900 transition-all duration-500 ${currentStep >= 2 ? 'w-full' : 'w-0'}`} />
              </div>
              <div className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${currentStep >= 2 ? 'bg-navy-900 text-white' : 'bg-slate-200 text-slate-400'}`}>
                  2
                </div>
                <span className="text-sm font-medium text-navy-600">Result</span>
              </div>
            </div>

            {/* Scenario card */}
            <div className="card p-6 mb-6">
              {topic && (
                <div className="flex items-center gap-2 mb-4">
                  <span className="badge-pill bg-blue-100 text-blue-700">
                    <Target className="h-3 w-3" /> {topic.title}
                  </span>
                </div>
              )}
              <h1 className="text-xl font-bold text-navy-900 mb-3">{scenario.title}</h1>
              <div className="bg-navy-50 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-navy-800 text-sm leading-relaxed">{scenario.situation}</p>
                </div>
              </div>

              <h2 className="text-lg font-bold text-navy-900 mb-4">{scenario.question}</h2>

              {/* Options */}
              <div className="space-y-3">
                {scenario.options
                  ?.sort((a, b) => a.sort_order - b.sort_order)
                  .map((option, i) => {
                    const isSelected = selectedOption === i;
                    const showCorrect = revealed && option.is_correct;
                    const showIncorrect = revealed && isSelected && !option.is_correct;

                    return (
                      <button
                        key={option.id}
                        onClick={() => handleSelectOption(i)}
                        disabled={revealed}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                          showCorrect
                            ? 'border-green-500 bg-green-50'
                            : showIncorrect
                            ? 'border-red-500 bg-red-50'
                            : isSelected
                            ? 'border-navy-700 bg-navy-50'
                            : revealed
                            ? 'border-slate-200 opacity-60'
                            : 'border-slate-200 hover:border-navy-300 hover:bg-slate-50'
                        }`}
                      >
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                          showCorrect ? 'bg-green-500 text-white' : showIncorrect ? 'bg-red-500 text-white' : 'bg-slate-200 text-navy-600'
                        }`}>
                          {showCorrect ? <CheckCircle2 className="h-4 w-4" /> : showIncorrect ? <XCircle className="h-4 w-4" /> : String.fromCharCode(65 + i)}
                        </span>
                        <span className="text-sm font-medium text-navy-800">{option.label}</span>
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Result section */}
            {revealed && scenario.options && (
              <div className="space-y-4 animate-slide-up">
                {/* Correct/Incorrect banner */}
                <div className={`card p-5 ${scenario.options[selectedOption ?? -1]?.is_correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center gap-3">
                    {scenario.options[selectedOption ?? -1]?.is_correct ? (
                      <>
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                          <CheckCircle2 className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-green-800">Correct!</h3>
                          <p className="text-sm text-green-700">Great decision. You know your rights.</p>
                        </div>
                        {!awarding && (
                          <span className="ml-auto badge-pill bg-amber-100 text-amber-700 animate-xp-pop">
                            <Zap className="h-3 w-3" /> +{XP_REWARDS.SCENARIO} XP
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                          <XCircle className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-red-800">Incorrect</h3>
                          <p className="text-sm text-red-700">Let's understand why this matters.</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Explanation */}
                <div className="card p-5">
                  <h3 className="font-bold text-navy-900 mb-2 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-500" /> Why?
                  </h3>
                  <p className="text-sm text-navy-700 leading-relaxed">{scenario.explanation}</p>
                </div>

                {/* Next steps */}
                <div className="card p-5">
                  <h3 className="font-bold text-navy-900 mb-2 flex items-center gap-2">
                    <ArrowRight className="h-5 w-5 text-blue-600" /> What should you do next?
                  </h3>
                  <p className="text-sm text-navy-700 leading-relaxed">{scenario.next_steps}</p>
                </div>

                {/* Why it matters */}
                <div className="card p-5 bg-amber-50 border-amber-200">
                  <h3 className="font-bold text-navy-900 mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600" /> Why this matters
                  </h3>
                  <p className="text-sm text-navy-700 leading-relaxed">{scenario.why_it_matters}</p>
                </div>

                {/* Next scenario */}
                {relatedScenarios.length > 0 && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      to={`/scenarios/${relatedScenarios[0].id}`}
                      className="btn-primary flex-1"
                    >
                      Next Scenario <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link to="/scenarios" className="btn-secondary flex-1">
                      All Scenarios
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </StateWrapper>

      {levelUpLevel !== null && (
        <LevelUpModal level={levelUpLevel} onClose={() => setLevelUpLevel(null)} />
      )}
      {unlockedBadge !== null && (
        <BadgeUnlockModal badgeName={unlockedBadge} badgeIcon="Trophy" onClose={() => setUnlockedBadge(null)} />
      )}
    </div>
  );
}
