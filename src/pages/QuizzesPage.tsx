import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Brain, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import { useContent } from '@/hooks/useContent';
import { useUserData } from '@/hooks/useUserData';
import { DynamicIcon } from '@/components/ui/DynamicIcon';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { StateWrapper } from '@/components/ui/StateWrapper';

export function QuizzesPage() {
  const { quizzes, topics, loading, error } = useContent();
  const { quizAttempts } = useUserData();
  const [search, setSearch] = useState('');
  const [topicFilter, setTopicFilter] = useState<string>('all');

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((q) => {
      const matchesSearch =
        q.title.toLowerCase().includes(search.toLowerCase()) ||
        q.description.toLowerCase().includes(search.toLowerCase());
      const matchesTopic = topicFilter === 'all' || q.topic_id === topicFilter;
      return matchesSearch && matchesTopic;
    });
  }, [quizzes, search, topicFilter]);

  function getTopicTitle(topicId: string) {
    return topics.find((t) => t.id === topicId);
  }

  function getAttemptInfo(quizId: string) {
    const attempts = quizAttempts.filter((a) => a.quiz_id === quizId);
    if (attempts.length === 0) return null;
    const best = attempts.reduce((max, a) => (a.score > max.score ? a : max), attempts[0]);
    return best;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-navy-900 mb-2">Quizzes</h1>
        <p className="text-navy-500">Test your legal knowledge and earn XP for high scores.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
            placeholder="Search quizzes..."
            aria-label="Search quizzes"
          />
        </div>
        <select
          value={topicFilter}
          onChange={(e) => setTopicFilter(e.target.value)}
          className="input sm:w-auto"
          aria-label="Filter by topic"
        >
          <option value="all">All Topics</option>
          {topics.map((t) => (
            <option key={t.id} value={t.id}>{t.title}</option>
          ))}
        </select>
      </div>

      <StateWrapper
        loading={loading}
        error={error}
        empty={filteredQuizzes.length === 0}
        emptyMessage="No quizzes match your search."
        skeleton={
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        }
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredQuizzes.map((quiz) => {
            const topic = getTopicTitle(quiz.topic_id);
            const attempt = getAttemptInfo(quiz.id);
            const questionCount = quiz.questions?.length ?? 0;
            const isCompleted = attempt !== null;

            return (
              <Link
                key={quiz.id}
                to={`/quizzes/${quiz.id}`}
                className="card-hover p-5 group animate-fade-in"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  {topic && (
                    <span className="text-xs font-medium text-navy-400 flex items-center gap-1">
                      <DynamicIcon name={topic.icon} className="h-3.5 w-3.5" />
                      {topic.title}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-navy-900 mb-2">{quiz.title}</h3>
                <p className="text-sm text-navy-500 line-clamp-2 mb-3">{quiz.description}</p>

                <div className="flex items-center gap-3 text-xs text-navy-400 mb-3">
                  <span>{questionCount} questions</span>
                  {isCompleted && (
                    <span className="flex items-center gap-1 text-green-600 font-semibold">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Best: {attempt!.score}/{attempt!.total}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="badge-pill bg-amber-100 text-amber-700">
                    <Zap className="h-3 w-3" /> +50 XP
                  </span>
                  <div className="flex items-center gap-1 text-sm text-blue-600 font-semibold group-hover:gap-2 transition-all">
                    {isCompleted ? 'Retake' : 'Start Quiz'} <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </StateWrapper>
    </div>
  );
}
