import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Target, ArrowRight } from 'lucide-react';
import { useContent } from '@/hooks/useContent';
import { DynamicIcon } from '@/components/ui/DynamicIcon';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { StateWrapper } from '@/components/ui/StateWrapper';

export function ScenariosPage() {
  const { scenarios, topics, loading, error } = useContent();
  const [search, setSearch] = useState('');
  const [topicFilter, setTopicFilter] = useState<string>('all');

  const filteredScenarios = useMemo(() => {
    return scenarios.filter((s) => {
      const matchesSearch =
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.situation.toLowerCase().includes(search.toLowerCase());
      const matchesTopic = topicFilter === 'all' || s.topic_id === topicFilter;
      return matchesSearch && matchesTopic;
    });
  }, [scenarios, search, topicFilter]);

  function getTopicTitle(topicId: string) {
    return topics.find((t) => t.id === topicId);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-navy-900 mb-2">Real-Life Scenarios</h1>
        <p className="text-navy-500">Practice your legal awareness through realistic situations. Make a decision and learn why it matters.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
            placeholder="Search scenarios..."
            aria-label="Search scenarios"
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
        empty={filteredScenarios.length === 0}
        emptyMessage="No scenarios match your search."
        skeleton={
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        }
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredScenarios.map((scenario) => {
            const topic = getTopicTitle(scenario.topic_id);
            return (
              <Link
                key={scenario.id}
                to={`/scenarios/${scenario.id}`}
                className="card-hover p-5 group animate-fade-in"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Target className="h-4.5 w-4.5 text-blue-600" />
                  </div>
                  {topic && (
                    <span className="text-xs font-medium text-navy-400 flex items-center gap-1">
                      <DynamicIcon name={topic.icon} className="h-3.5 w-3.5" />
                      {topic.title}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-navy-900 mb-2">{scenario.title}</h3>
                <p className="text-sm text-navy-500 line-clamp-3 mb-4">{scenario.situation}</p>
                <div className="flex items-center gap-1 text-sm text-blue-600 font-semibold group-hover:gap-2 transition-all">
                  Take Scenario <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </StateWrapper>
    </div>
  );
}
