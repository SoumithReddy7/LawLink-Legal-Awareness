import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, BookOpen, Target, Brain, Compass, FileText,
  CheckCircle2, XCircle, Lightbulb, AlertTriangle, Info, ArrowRight,
} from 'lucide-react';
import { useContent } from '@/hooks/useContent';
import { useUserData } from '@/hooks/useUserData';
import { DynamicIcon } from '@/components/ui/DynamicIcon';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StateWrapper } from '@/components/ui/StateWrapper';
import { LEARN_CONTENT } from '@/data/content';

type Tab = 'learn' | 'scenarios' | 'quiz' | 'next-steps' | 'resources';

const TABS: { value: Tab; label: string; icon: typeof BookOpen }[] = [
  { value: 'learn', label: 'Learn', icon: BookOpen },
  { value: 'scenarios', label: 'Scenarios', icon: Target },
  { value: 'quiz', label: 'Quiz', icon: Brain },
  { value: 'next-steps', label: 'Next Steps', icon: Compass },
  { value: 'resources', label: 'Resources', icon: FileText },
];

export function TopicDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { topics, scenarios, quizzes, resources, loading, error } = useContent();
  const { progress } = useUserData();
  const [activeTab, setActiveTab] = useState<Tab>('learn');

  const topic = useMemo(() => topics.find((t) => t.slug === id), [topics, id]);

  const topicScenarios = useMemo(
    () => scenarios.filter((s) => s.topic_id === topic?.id),
    [scenarios, topic],
  );
  const topicQuizzes = useMemo(
    () => quizzes.filter((q) => q.topic_id === topic?.id),
    [quizzes, topic],
  );
  const topicResources = useMemo(
    () => resources.filter((r) => r.category.toLowerCase().includes(topic?.slug?.split('-')[0] ?? '')),
    [resources, topic],
  );

  const topicProgress = progress.find((p) => p.topic_id === topic?.id);
  const completion = topicProgress
    ? Math.min(((topicProgress.scenarios_completed + topicProgress.quizzes_completed) / Math.max(topicScenarios.length + topicQuizzes.length, 1)) * 100, 100)
    : 0;

  if (!loading && !topic) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-navy-900 mb-2">Topic not found</h1>
        <Link to="/topics" className="btn-primary mt-4">Browse all topics</Link>
      </div>
    );
  }

  const learnContent = topic ? LEARN_CONTENT[topic.id] : null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/topics" className="inline-flex items-center gap-1 text-sm text-navy-500 hover:text-navy-700 mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to Topics
      </Link>

      <StateWrapper loading={loading} error={error} empty={!topic}>
        {topic && (
          <>
            {/* Header */}
            <div className="card p-6 mb-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl" />
              <div className="relative flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-navy-700 to-blue-700 flex items-center justify-center flex-shrink-0">
                  <DynamicIcon name={topic.icon} className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold text-navy-900 mb-1">{topic.title}</h1>
                  <p className="text-navy-500 text-sm mb-3">{topic.description}</p>
                  <div className="flex items-center gap-3 text-xs text-navy-400">
                    <span>{topicScenarios.length} scenarios</span>
                    <span>{topicQuizzes.length} quizzes</span>
                  </div>
                  <div className="mt-4 max-w-md">
                    <div className="flex justify-between text-xs text-navy-500 mb-1">
                      <span>Your progress</span>
                      <span>{Math.round(completion)}%</span>
                    </div>
                    <ProgressBar value={completion} color="bg-gradient-to-r from-blue-500 to-navy-700" />
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 overflow-x-auto scrollbar-hide border-b border-slate-200">
              {TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${
                    activeTab === tab.value
                      ? 'border-navy-900 text-navy-900'
                      : 'border-transparent text-navy-400 hover:text-navy-700'
                  }`}
                >
                  <tab.icon className="h-4 w-4" /> {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="animate-fade-in">
              {activeTab === 'learn' && (
                <div className="space-y-4">
                  {learnContent ? (
                    <>
                      {learnContent.sections.map((section, i) => (
                        <InfoCard key={i} type={section.type ?? 'info'} title={section.title} content={section.content} />
                      ))}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="card p-5 border-green-200">
                          <h3 className="font-bold text-green-700 mb-3 flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5" /> Do
                          </h3>
                          <ul className="space-y-2">
                            {learnContent.dos.map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-navy-700">
                                <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" /> {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="card p-5 border-red-200">
                          <h3 className="font-bold text-red-700 mb-3 flex items-center gap-2">
                            <XCircle className="h-5 w-5" /> Don't
                          </h3>
                          <ul className="space-y-2">
                            {learnContent.donts.map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-navy-700">
                                <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" /> {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="card p-6">
                      <p className="text-navy-600 text-sm leading-relaxed">{topic.description}</p>
                      <p className="text-navy-500 text-sm mt-4">
                        Start with the scenarios below to learn through real-world situations, then test your knowledge with a quiz.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'scenarios' && (
                <div className="space-y-3">
                  {topicScenarios.length === 0 ? (
                    <div className="card p-8 text-center">
                      <p className="text-navy-400 text-sm">No scenarios available for this topic yet.</p>
                    </div>
                  ) : (
                    topicScenarios.map((scenario, i) => (
                      <Link
                        key={scenario.id}
                        to={`/scenarios/${scenario.id}`}
                        className="card-hover p-5 group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-blue-700">{i + 1}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-navy-900 mb-0.5">{scenario.title}</h3>
                            <p className="text-sm text-navy-500 line-clamp-1">{scenario.situation}</p>
                          </div>
                          <ArrowRight className="h-5 w-5 text-navy-400 group-hover:text-navy-700 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'quiz' && (
                <div className="space-y-3">
                  {topicQuizzes.length === 0 ? (
                    <div className="card p-8 text-center">
                      <p className="text-navy-400 text-sm">No quizzes available for this topic yet.</p>
                    </div>
                  ) : (
                    topicQuizzes.map((quiz) => (
                      <Link
                        key={quiz.id}
                        to={`/quizzes/${quiz.id}`}
                        className="card-hover p-5 group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                            <Brain className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-navy-900 mb-0.5">{quiz.title}</h3>
                            <p className="text-sm text-navy-500 line-clamp-1">{quiz.description}</p>
                            <p className="text-xs text-navy-400 mt-1">
                              {quiz.questions?.length ?? 0} questions
                            </p>
                          </div>
                          <ArrowRight className="h-5 w-5 text-navy-400 group-hover:text-navy-700 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'next-steps' && (
                <div className="space-y-4">
                  <div className="card p-6">
                    <h3 className="font-bold text-navy-900 mb-3 flex items-center gap-2">
                      <Compass className="h-5 w-5 text-blue-600" /> Practical Next Steps
                    </h3>
                    <div className="space-y-3">
                      <ActionCard
                        title="Complete all scenarios"
                        desc="Work through each real-life scenario to build practical understanding."
                      />
                      <ActionCard
                        title="Take the quiz"
                        desc="Test your knowledge and earn XP for completing the quiz."
                      />
                      <ActionCard
                        title="Explore resources"
                        desc="Find trusted legal resources and official portals for this topic."
                      />
                      <ActionCard
                        title="Ask the AI assistant"
                        desc="Have questions? Ask LawLink Assistant for guidance on legal concepts."
                      />
                    </div>
                  </div>
                  <div className="card p-5 bg-amber-50 border-amber-200">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-navy-700">
                        This content is for educational awareness only. For specific legal issues,
                        always consult a qualified legal professional or contact the relevant authorities.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="space-y-3">
                  {topicResources.length === 0 ? (
                    <div className="card p-8 text-center">
                      <p className="text-navy-400 text-sm mb-3">No specific resources for this topic.</p>
                      <Link to="/resources" className="btn-secondary text-sm">
                        Browse all resources
                      </Link>
                    </div>
                  ) : (
                    topicResources.map((resource) => (
                      <div key={resource.id} className="card p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-navy-900 mb-1">{resource.name}</h3>
                            <p className="text-sm text-navy-500 mb-2">{resource.description}</p>
                            {resource.contact && (
                              <p className="text-xs text-navy-600">Contact: {resource.contact}</p>
                            )}
                            {resource.source && (
                              <p className="text-xs text-navy-400 mt-1">Source: {resource.source}</p>
                            )}
                          </div>
                          {resource.is_verified ? (
                            <span className="badge-pill bg-green-100 text-green-700 flex-shrink-0">
                              <CheckCircle2 className="h-3 w-3" /> Verified
                            </span>
                          ) : (
                            <span className="badge-pill bg-amber-100 text-amber-700 flex-shrink-0">
                              Demo — verify before use
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </StateWrapper>
    </div>
  );
}

function InfoCard({ type, title, content }: { type: string; title: string; content: string }) {
  const styles: Record<string, { bg: string; icon: typeof Info; iconColor: string; border: string }> = {
    info: { bg: 'bg-blue-50', icon: Info, iconColor: 'text-blue-600', border: 'border-blue-200' },
    warning: { bg: 'bg-amber-50', icon: AlertTriangle, iconColor: 'text-amber-600', border: 'border-amber-200' },
    tip: { bg: 'bg-green-50', icon: Lightbulb, iconColor: 'text-green-600', border: 'border-green-200' },
  };
  const style = styles[type] ?? styles.info;
  const Icon = style.icon;

  return (
    <div className={`card p-5 ${style.bg} ${style.border}`}>
      <h3 className={`font-bold mb-2 flex items-center gap-2 ${style.iconColor}`}>
        <Icon className="h-5 w-5" /> {title}
      </h3>
      <p className="text-sm text-navy-700 leading-relaxed">{content}</p>
    </div>
  );
}

function ActionCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
        <ArrowRight className="h-4 w-4 text-blue-600" />
      </div>
      <div>
        <p className="text-sm font-semibold text-navy-800">{title}</p>
        <p className="text-xs text-navy-500 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}
