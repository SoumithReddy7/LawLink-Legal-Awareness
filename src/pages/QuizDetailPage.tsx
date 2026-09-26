import { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle2, XCircle, Brain, Zap, Trophy,
  ArrowRight, Sparkles, PartyPopper, Target,
} from 'lucide-react';
import { useContent } from '@/hooks/useContent';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/ui/toast';
import { awardXp, recordActivity, updateStreak, checkBadgesAfterActivity } from '@/lib/gamification';
import { supabase } from '@/lib/supabase';
import { XP_REWARDS, getLevelForXp } from '@/types';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StateWrapper } from '@/components/ui/StateWrapper';
import { LevelUpModal } from '@/components/ui/LevelUpModal';
import { BadgeUnlockModal } from '@/components/ui/BadgeUnlockModal';
import { DynamicIcon } from '@/components/ui/DynamicIcon';

type QuizPhase = 'question' | 'explanation' | 'complete';

interface QuestionResult {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
}

export function QuizDetailPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { quizzes, topics, loading, error } = useContent();
  const { session, profile, refreshProfile } = useAuth();
  const { showToast } = useToast();

  const quiz = useMemo(() => quizzes.find((q) => q.id === quizId), [quizzes, quizId]);
  const topic = useMemo(() => (quiz ? topics.find((t) => t.id === quiz.topic_id) : undefined), [topics, quiz]);

  const questions = useMemo(() => {
    if (!quiz?.questions) return [];
    return [...quiz.questions].sort((a, b) => a.sort_order - b.sort_order);
  }, [quiz]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [phase, setPhase] = useState<QuizPhase>('question');
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [processing, setProcessing] = useState(false);
  const [levelUpLevel, setLevelUpLevel] = useState<number | null>(null);
  const [unlockedBadge, setUnlockedBadge] = useState<string | null>(null);
  const [finalScore, setFinalScore] = useState(0);
  const [totalXpAwarded, setTotalXpAwarded] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setPhase('question');
    setResults([]);
  }, [quizId]);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  function handleSelectOption(optionId: string) {
    if (phase !== 'question') return;
    setSelectedOptionId(optionId);
  }

  async function handleSubmitAnswer() {
    if (!currentQuestion || !selectedOptionId || phase !== 'question') return;

    const selectedOption = currentQuestion.options?.find((o) => o.id === selectedOptionId);
    if (!selectedOption) return;

    const isCorrect = selectedOption.is_correct;
    const newResult: QuestionResult = {
      questionId: currentQuestion.id,
      selectedOptionId: selectedOptionId,
      isCorrect,
    };
    setResults((prev) => [...prev, newResult]);
    setPhase('explanation');
  }

  function handleNextQuestion() {
    if (currentIndex + 1 >= totalQuestions) {
      setPhase('complete');
      void handleQuizComplete();
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setPhase('question');
    }
  }

  async function handleQuizComplete() {
    if (!quiz || !session || !profile || processing) return;
    setProcessing(true);

    const score = results.filter((r) => r.isCorrect).length;
    const total = totalQuestions;
    const percentage = (score / total) * 100;
    setFinalScore(score);

    const userId = session.user.id;

    try {
      // Update streak
      await updateStreak(userId);

      // Calculate XP: base quiz XP + high score bonus if 80%+
      let xpAmount = XP_REWARDS.QUIZ;
      let highScoreBonus = false;
      if (percentage >= 80) {
        xpAmount += XP_REWARDS.HIGH_SCORE;
        highScoreBonus = true;
      }

      // Award XP with duplicate prevention (reference = quiz attempt)
      // Use quiz_id + a unique timestamp as reference to allow retakes
      const attemptRef = `${quiz.id}-${Date.now()}`;
      const xpResult = await awardXp(
        userId,
        xpAmount,
        `Completed quiz: ${quiz.title}`,
        'quiz_attempt',
        attemptRef,
      );

      if (xpResult.awarded) {
        setTotalXpAwarded(xpAmount);
        showToast('xp', `+${xpAmount} XP`, highScoreBonus ? 'Includes +25 high score bonus!' : 'Quiz completed!');
      }

      // Save quiz attempt
      const { error: attemptError } = await supabase.from('quiz_attempts').insert({
        user_id: userId,
        quiz_id: quiz.id,
        score,
        total,
        xp_awarded: xpResult.awarded ? xpAmount : 0,
      });

      if (attemptError) {
        console.error('Quiz attempt save error:', attemptError);
      }

      // Record activity
      await recordActivity(
        userId,
        'quiz_completed',
        `Completed ${quiz.title}: ${score}/${total}`,
        xpResult.awarded ? xpAmount : undefined,
      );

      // Update user progress for this topic
      if (topic) {
        const { data: existingProgress } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', userId)
          .eq('topic_id', topic.id)
          .maybeSingle();

        if (existingProgress) {
          await supabase
            .from('user_progress')
            .update({
              quizzes_completed: existingProgress.quizzes_completed + 1,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existingProgress.id);
        } else {
          await supabase.from('user_progress').insert({
            user_id: userId,
            topic_id: topic.id,
            scenarios_completed: 0,
            quizzes_completed: 1,
            is_completed: false,
          });
        }
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

      const { count: quizCount } = await supabase
        .from('quiz_attempts')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId);

      const { data: streakData } = await supabase
        .from('streaks')
        .select('current_streak')
        .eq('user_id', userId)
        .maybeSingle();

      const { count: topicProgressCount } = await supabase
        .from('user_progress')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_completed', true);

      const isPerfect = score === total;
      const isFirstQuiz = (quizCount ?? 0) === 1;

      const unlockedBadges = await checkBadgesAfterActivity(userId, profile, {
        activityCount: activityCount ?? 0,
        quizCount: quizCount ?? 0,
        topicCount: topicProgressCount ?? 0,
        streak: streakData?.current_streak ?? 0,
        perfectScore: isPerfect,
        firstQuiz: isFirstQuiz,
      });

      if (unlockedBadges.length > 0) {
        setUnlockedBadge(unlockedBadges[0]);
        showToast('badge', 'Badge Unlocked!', unlockedBadges[0]);
      }

      await refreshProfile();
    } catch (err) {
      console.error('Quiz completion error:', err);
    } finally {
      setProcessing(false);
    }
  }

  if (!loading && !quiz) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-navy-900 mb-2">Quiz not found</h1>
        <Link to="/quizzes" className="btn-primary mt-4">Browse all quizzes</Link>
      </div>
    );
  }

  if (phase === 'complete') {
    const score = results.filter((r) => r.isCorrect).length;
    const total = totalQuestions;
    const percentage = Math.round((score / total) * 100);
    const passed = percentage >= 80;

    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card p-8 text-center animate-scale-in relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-50/50 to-transparent" />
          <div className="relative">
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${passed ? 'bg-gradient-to-br from-amber-400 to-orange-500 animate-badge-spin' : 'bg-gradient-to-br from-navy-600 to-blue-700'}`}>
              {passed ? <PartyPopper className="h-10 w-10 text-white" /> : <Brain className="h-10 w-10 text-white" />}
            </div>

            <h1 className="text-2xl font-bold text-navy-900 mb-1">Quiz Complete!</h1>
            <p className="text-navy-500 mb-6">{quiz?.title}</p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-3xl font-bold text-navy-900">{score}/{total}</p>
                <p className="text-xs text-navy-400 mt-1">Score</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-4">
                <p className="text-3xl font-bold text-amber-600">{percentage}%</p>
                <p className="text-xs text-navy-400 mt-1">Accuracy</p>
              </div>
              <div className="bg-orange-50 rounded-xl p-4">
                <p className="text-3xl font-bold text-orange-600 flex items-center justify-center gap-1">
                  <Zap className="h-6 w-6" />
                  {totalXpAwarded}
                </p>
                <p className="text-xs text-navy-400 mt-1">XP Earned</p>
              </div>
            </div>

            {passed && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-6 flex items-center justify-center gap-2 text-sm text-green-700 font-semibold">
                <Trophy className="h-4 w-4" />
                Great job! You scored 80% or higher and earned a +25 XP bonus!
              </div>
            )}

            {percentage === 100 && (
              <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 mb-6 flex items-center justify-center gap-2 text-sm text-amber-800 font-semibold">
                <Sparkles className="h-4 w-4" />
                Perfect Score! You may have unlocked a special badge!
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/quizzes" className="btn-secondary flex-1">
                More Quizzes
              </Link>
              <Link to="/dashboard" className="btn-primary flex-1">
                View Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {levelUpLevel !== null && (
          <LevelUpModal level={levelUpLevel} onClose={() => setLevelUpLevel(null)} />
        )}
        {unlockedBadge !== null && (
          <BadgeUnlockModal badgeName={unlockedBadge} badgeIcon="Trophy" onClose={() => setUnlockedBadge(null)} />
        )}
      </div>
    );
  }

  const progress = ((currentIndex + (phase === 'explanation' ? 1 : 0)) / totalQuestions) * 100;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/quizzes" className="inline-flex items-center gap-1 text-sm text-navy-500 hover:text-navy-700 mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to Quizzes
      </Link>

      <StateWrapper loading={loading} error={error} empty={!quiz}>
        {quiz && currentQuestion && (
          <div className="animate-fade-in">
            {/* Header */}
            <div className="card p-5 mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-navy-900">{quiz.title}</h1>
                    {topic && (
                      <p className="text-xs text-navy-400 flex items-center gap-1">
                        <DynamicIcon name={topic.icon} className="h-3 w-3" /> {topic.title}
                      </p>
                    )}
                  </div>
                </div>
                <span className="badge-pill bg-navy-100 text-navy-700">
                  {currentIndex + 1} / {totalQuestions}
                </span>
              </div>
              <ProgressBar value={progress} color="bg-gradient-to-r from-amber-400 to-orange-500" />
            </div>

            {/* Question card */}
            <div className="card p-6 mb-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wide">
                  Question {currentIndex + 1}
                </span>
              </div>
              <h2 className="text-lg font-bold text-navy-900 mb-6 leading-snug">
                {currentQuestion.question}
              </h2>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options
                  ?.sort((a, b) => a.sort_order - b.sort_order)
                  .map((option, i) => {
                    const isSelected = selectedOptionId === option.id;
                    const showCorrect = phase === 'explanation' && option.is_correct;
                    const showIncorrect = phase === 'explanation' && isSelected && !option.is_correct;

                    return (
                      <button
                        key={option.id}
                        onClick={() => handleSelectOption(option.id)}
                        disabled={phase === 'explanation'}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                          showCorrect
                            ? 'border-green-500 bg-green-50'
                            : showIncorrect
                            ? 'border-red-500 bg-red-50'
                            : isSelected
                            ? 'border-navy-700 bg-navy-50'
                            : phase === 'explanation'
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

            {/* Explanation */}
            {phase === 'explanation' && (
              <div className="space-y-4 animate-slide-up">
                <div className={`card p-5 ${results[currentIndex]?.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center gap-3">
                    {results[currentIndex]?.isCorrect ? (
                      <>
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                          <CheckCircle2 className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-green-800">Correct!</h3>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                          <XCircle className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-red-800">Not quite right</h3>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="card p-5">
                  <h3 className="font-bold text-navy-900 mb-2 flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-600" /> Explanation
                  </h3>
                  <p className="text-sm text-navy-700 leading-relaxed">{currentQuestion.explanation}</p>
                </div>

                <button
                  onClick={handleNextQuestion}
                  disabled={processing}
                  className="btn-primary w-full"
                >
                  {currentIndex + 1 >= totalQuestions ? 'See Results' : 'Next Question'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Submit button */}
            {phase === 'question' && (
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedOptionId}
                className="btn-primary w-full"
              >
                Submit Answer
              </button>
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
