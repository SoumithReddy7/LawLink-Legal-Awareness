import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, BookOpen } from 'lucide-react';
import { useContent } from '@/hooks/useContent';
import { useUserData } from '@/hooks/useUserData';
import { DynamicIcon } from '@/components/ui/DynamicIcon';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { StateWrapper } from '@/components/ui/StateWrapper';
import type { Difficulty } from '@/types';

const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-amber-100 text-amber-700',
  advanced: 'bg-red-100 text-red-700',
};

const FILTERS: { value: Difficulty | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export function TopicsPage() {
  const { topics, scenarios, quizzes, loading, error } = useContent();
  const { progress } = useUserData();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Difficulty | 'all'>('all');

  const progressMap = useMemo(() => {
    const map: Record<string, { scenarios_completed: number; quizzes_completed: number; is_completed: boolean }> = {};
    progress.forEach((p) => {
      map[p.topic_id] = {
        scenarios_completed: p.scenarios_completed,
        quizzes_completed: p.quizzes_completed,
        is_completed: p.is_completed,
      };
    });
    return map;
  }, [progress]);

  const filteredTopics = useMemo(() => {
    return topics.filter((topic) => {
      const matchesSearch =
        topic.title.toLowerCase().includes(search.toLowerCase()) ||
        topic.description.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'all' || topic.difficulty === filter;
      return matchesSearch && matchesFilter;
    });
  }, [topics, search, filter]);

  function getTopicStats(topicId: string) {
    const topicScenarios = scenarios.filter((s) => s.topic_id === topicId).length;
    const topicQuizzes = quizzes.filter((q) => q.topic_id === topicId).length;
    const prog = progressMap[topicId];
    const completion = prog
      ? Math.min(((prog.scenarios_completed + prog.quizzes_completed) / Math.max(topicScenarios + topicQuizzes, 1)) * 100, 100)
      : 0;
    return { topicScenarios, topicQuizzes, completion, isCompleted: prog?.is_completed ?? false };
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-navy-900 mb-2">Legal Topics</h1>
        <p className="text-navy-500">Choose a topic and start learning about your rights and responsibilities.</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
            placeholder="Search topics..."
            aria-label="Search topics"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                filter === f.value
                  ? 'bg-navy-900 text-white'
                  : 'bg-white text-navy-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <StateWrapper
        loading={loading}
        error={error}
        empty={filteredTopics.length === 0}
        emptyMessage="No topics match your search. Try a different keyword or filter."
        skeleton={
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        }
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTopics.map((topic) => {
            const stats = getTopicStats(topic.id);
            return (
              <Link
                key={topic.id}
                to={`/topics/${topic.slug}`}
                className="card-hover p-6 group animate-fade-in"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-navy-50 group-hover:bg-navy-100 flex items-center justify-center transition-colors">
                    <DynamicIcon name={topic.icon} className="h-6 w-6 text-navy-700" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`badge-pill ${DIFFICULTY_STYLES[topic.difficulty]}`}>
                      {topic.difficulty}
                    </span>
                    {stats.isCompleted && (
                      <span className="badge-pill bg-green-100 text-green-700">
                        Done
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-navy-900 mb-2 leading-snug">{topic.title}</h3>
                <p className="text-sm text-navy-500 line-clamp-2 mb-4">{topic.description}</p>

                <div className="flex items-center gap-4 text-xs text-navy-400 mb-3">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5" /> {stats.topicScenarios} scenarios
                  </span>
                  <span>{stats.topicQuizzes} quizzes</span>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-xs text-navy-500 mb-1">
                    <span>Progress</span>
                    <span>{Math.round(stats.completion)}%</span>
                  </div>
                  <ProgressBar value={stats.completion} size="sm" color="bg-gradient-to-r from-blue-500 to-navy-700" />
                </div>

                <div className="flex items-center gap-1 text-sm text-blue-600 font-semibold group-hover:gap-2 transition-all">
                  {stats.completion > 0 ? 'Continue' : 'Start Learning'} <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </StateWrapper>
    </div>
  );
}
