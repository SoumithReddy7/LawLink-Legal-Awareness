import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Topic, Scenario, ScenarioOption, Quiz, QuizQuestion, QuizOption, Badge, Resource } from '@/types';
import {
  STATIC_TOPICS, STATIC_SCENARIOS, STATIC_SCENARIO_OPTIONS, STATIC_QUIZZES,
  STATIC_QUIZ_QUESTIONS, STATIC_BADGES, STATIC_RESOURCES,
} from '@/data/content';

interface ContentData {
  topics: Topic[];
  scenarios: (Scenario & { options?: ScenarioOption[] })[];
  quizzes: (Quiz & { questions?: (QuizQuestion & { options?: QuizOption[] })[] })[];
  badges: Badge[];
  resources: Resource[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

// Merges DB content with static fallback data.
// Static data ensures the app is always populated even before DB seed.
export function useContent(): ContentData {
  const [topics, setTopics] = useState<Topic[]>(STATIC_TOPICS);
  const [scenarios, setScenarios] = useState<(Scenario & { options?: ScenarioOption[] })[]>([]);
  const [quizzes, setQuizzes] = useState<(Quiz & { questions?: (QuizQuestion & { options?: QuizOption[] })[] })[]>([]);
  const [badges, setBadges] = useState<Badge[]>(STATIC_BADGES);
  const [resources, setResources] = useState<Resource[]>(STATIC_RESOURCES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [topicsRes, scenariosRes, quizzesRes, badgesRes, resourcesRes] = await Promise.all([
        supabase.from('topics').select('*').eq('is_published', true).order('sort_order'),
        supabase.from('scenarios').select('*, options:scenario_options(*)').order('sort_order'),
        supabase.from('quizzes').select('*, questions:quiz_questions(*, options:quiz_options(*))').order('created_at'),
        supabase.from('badges').select('*').order('created_at'),
        supabase.from('resources').select('*').order('name'),
      ]);

      // Use DB topics if available, otherwise static
      if (topicsRes.data && topicsRes.data.length > 0) {
        setTopics(topicsRes.data as Topic[]);
      }

      // Use DB scenarios if available, otherwise static
      if (scenariosRes.data && scenariosRes.data.length > 0) {
        setScenarios(scenariosRes.data as (Scenario & { options?: ScenarioOption[] })[]);
      } else {
        // Build from static data
        const staticScenarios = STATIC_SCENARIOS.map((s) => ({
          ...s,
          options: STATIC_SCENARIO_OPTIONS[s.id]?.map((opt, i) => ({
            id: `${s.id}-opt-${i}`,
            scenario_id: s.id,
            label: opt.label,
            is_correct: opt.is_correct,
            sort_order: i,
          })),
        }));
        setScenarios(staticScenarios);
      }

      // Use DB quizzes if available, otherwise static
      if (quizzesRes.data && quizzesRes.data.length > 0) {
        setQuizzes(quizzesRes.data as (Quiz & { questions?: (QuizQuestion & { options?: QuizOption[] })[] })[]);
      } else {
        const staticQuizzes = STATIC_QUIZZES.map((q) => ({
          ...q,
          questions: STATIC_QUIZ_QUESTIONS[q.id]?.map((qq, i) => ({
            id: `${q.id}-q-${i}`,
            quiz_id: q.id,
            question: qq.question,
            explanation: qq.explanation,
            sort_order: i,
            options: qq.options.map((opt, j) => ({
              id: `${q.id}-q-${i}-opt-${j}`,
              question_id: `${q.id}-q-${i}`,
              label: opt.label,
              is_correct: opt.is_correct,
              sort_order: j,
            })),
          })),
        }));
        setQuizzes(staticQuizzes);
      }

      if (badgesRes.data && badgesRes.data.length > 0) {
        setBadges(badgesRes.data as Badge[]);
      }

      if (resourcesRes.data && resourcesRes.data.length > 0) {
        setResources(resourcesRes.data as Resource[]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content');
      // Static fallback is already set in initial state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { topics, scenarios, quizzes, badges, resources, loading, error, refresh: fetchAll };
}
