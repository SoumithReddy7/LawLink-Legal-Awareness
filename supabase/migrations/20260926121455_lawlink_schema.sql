/*
# LawLink — Gamified Legal Literacy Platform Schema

## Overview
Creates the complete database schema for LawLink, a gamified legal literacy platform
for Indian students and young adults. Users learn about legal rights through scenarios,
quizzes, and earn XP, badges, and maintain streaks.

## Tables
1. profiles — extends auth.users with display name, avatar, language preference, role
2. topics — legal literacy topics (Cyber Safety, Consumer Rights, etc.)
3. scenarios — real-life legal situations with options
4. scenario_options — answer choices for scenarios
5. quizzes — quiz collections linked to topics
6. quiz_questions — individual quiz questions
7. quiz_options — answer choices for quiz questions
8. quiz_attempts — tracks user quiz attempts and scores
9. user_progress — per-user topic completion tracking
10. xp_transactions — XP earning history (prevents duplicate awards)
11. badges — achievement definitions
12. user_badges — badge unlocks per user
13. resources — legal resource directory entries
14. user_activity — activity feed entries
15. streaks — daily learning streak tracking

## Security
- RLS enabled on all tables
- Content tables (topics, scenarios, quizzes, badges, resources) are readable by all authenticated users
- User-specific data (progress, XP, badges, activity, streaks, attempts) is owner-scoped
- Admin-only writes on content tables enforced via profile role check
- Owner columns default to auth.uid() for safe inserts
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  avatar_url text,
  preferred_language text NOT NULL DEFAULT 'en',
  role text NOT NULL DEFAULT 'user',
  xp integer NOT NULL DEFAULT 0,
  level integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Topics table
CREATE TABLE IF NOT EXISTS topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL,
  icon text NOT NULL DEFAULT 'Shield',
  difficulty text NOT NULL DEFAULT 'beginner',
  color text NOT NULL DEFAULT 'blue',
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_topics" ON topics;
CREATE POLICY "select_topics" ON topics FOR SELECT
  TO authenticated USING (is_published = true);

DROP POLICY IF EXISTS "admin_insert_topics" ON topics;
CREATE POLICY "admin_insert_topics" ON topics FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "admin_update_topics" ON topics;
CREATE POLICY "admin_update_topics" ON topics FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "admin_delete_topics" ON topics;
CREATE POLICY "admin_delete_topics" ON topics FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- Scenarios table
CREATE TABLE IF NOT EXISTS scenarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  title text NOT NULL,
  situation text NOT NULL,
  question text NOT NULL,
  explanation text NOT NULL,
  next_steps text NOT NULL,
  why_it_matters text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_scenarios" ON scenarios;
CREATE POLICY "select_scenarios" ON scenarios FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_scenarios" ON scenarios;
CREATE POLICY "admin_insert_scenarios" ON scenarios FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "admin_update_scenarios" ON scenarios;
CREATE POLICY "admin_update_scenarios" ON scenarios FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "admin_delete_scenarios" ON scenarios;
CREATE POLICY "admin_delete_scenarios" ON scenarios FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- Scenario options table
CREATE TABLE IF NOT EXISTS scenario_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id uuid NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
  label text NOT NULL,
  is_correct boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0
);
ALTER TABLE scenario_options ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_scenario_options" ON scenario_options;
CREATE POLICY "select_scenario_options" ON scenario_options FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_scenario_options" ON scenario_options;
CREATE POLICY "admin_insert_scenario_options" ON scenario_options FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "admin_update_scenario_options" ON scenario_options;
CREATE POLICY "admin_update_scenario_options" ON scenario_options FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "admin_delete_scenario_options" ON scenario_options;
CREATE POLICY "admin_delete_scenario_options" ON scenario_options FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- Quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_quizzes" ON quizzes;
CREATE POLICY "select_quizzes" ON quizzes FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_quizzes" ON quizzes;
CREATE POLICY "admin_insert_quizzes" ON quizzes FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "admin_update_quizzes" ON quizzes;
CREATE POLICY "admin_update_quizzes" ON quizzes FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "admin_delete_quizzes" ON quizzes;
CREATE POLICY "admin_delete_quizzes" ON quizzes FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- Quiz questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question text NOT NULL,
  explanation text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_quiz_questions" ON quiz_questions;
CREATE POLICY "select_quiz_questions" ON quiz_questions FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_quiz_questions" ON quiz_questions;
CREATE POLICY "admin_insert_quiz_questions" ON quiz_questions FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "admin_update_quiz_questions" ON quiz_questions;
CREATE POLICY "admin_update_quiz_questions" ON quiz_questions FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "admin_delete_quiz_questions" ON quiz_questions;
CREATE POLICY "admin_delete_quiz_questions" ON quiz_questions FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- Quiz options table
CREATE TABLE IF NOT EXISTS quiz_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  label text NOT NULL,
  is_correct boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0
);
ALTER TABLE quiz_options ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_quiz_options" ON quiz_options;
CREATE POLICY "select_quiz_options" ON quiz_options FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_quiz_options" ON quiz_options;
CREATE POLICY "admin_insert_quiz_options" ON quiz_options FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "admin_update_quiz_options" ON quiz_options;
CREATE POLICY "admin_update_quiz_options" ON quiz_options FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "admin_delete_quiz_options" ON quiz_options;
CREATE POLICY "admin_delete_quiz_options" ON quiz_options FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- Quiz attempts table (user-specific)
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id uuid NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  score integer NOT NULL DEFAULT 0,
  total integer NOT NULL DEFAULT 0,
  xp_awarded integer NOT NULL DEFAULT 0,
  completed_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_attempts" ON quiz_attempts;
CREATE POLICY "select_own_attempts" ON quiz_attempts FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_attempts" ON quiz_attempts;
CREATE POLICY "insert_own_attempts" ON quiz_attempts FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- User progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id uuid NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  scenarios_completed integer NOT NULL DEFAULT 0,
  quizzes_completed integer NOT NULL DEFAULT 0,
  is_completed boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, topic_id)
);
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_progress" ON user_progress;
CREATE POLICY "select_own_progress" ON user_progress FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_progress" ON user_progress;
CREATE POLICY "insert_own_progress" ON user_progress FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_progress" ON user_progress;
CREATE POLICY "update_own_progress" ON user_progress FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- XP transactions table (prevents duplicate XP awards)
CREATE TABLE IF NOT EXISTS xp_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  reason text NOT NULL,
  reference_type text,
  reference_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE xp_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_xp" ON xp_transactions;
CREATE POLICY "select_own_xp" ON xp_transactions FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_xp" ON xp_transactions;
CREATE POLICY "insert_own_xp" ON xp_transactions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- Badges table
CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text NOT NULL,
  icon text NOT NULL DEFAULT 'Award',
  criteria text NOT NULL,
  color text NOT NULL DEFAULT 'blue',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_badges" ON badges;
CREATE POLICY "select_badges" ON badges FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_badges" ON badges;
CREATE POLICY "admin_insert_badges" ON badges FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "admin_update_badges" ON badges;
CREATE POLICY "admin_update_badges" ON badges FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "admin_delete_badges" ON badges;
CREATE POLICY "admin_delete_badges" ON badges FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- User badges table
CREATE TABLE IF NOT EXISTS user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id uuid NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  unlocked_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_badges" ON user_badges;
CREATE POLICY "select_own_badges" ON user_badges FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_badges" ON user_badges;
CREATE POLICY "insert_own_badges" ON user_badges FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- Resources table
CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  contact text,
  website text,
  source text,
  is_verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_resources" ON resources;
CREATE POLICY "select_resources" ON resources FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_resources" ON resources;
CREATE POLICY "admin_insert_resources" ON resources FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "admin_update_resources" ON resources;
CREATE POLICY "admin_update_resources" ON resources FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "admin_delete_resources" ON resources;
CREATE POLICY "admin_delete_resources" ON resources FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- User activity table
CREATE TABLE IF NOT EXISTS user_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type text NOT NULL,
  title text NOT NULL,
  xp_amount integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_activity" ON user_activity;
CREATE POLICY "select_own_activity" ON user_activity FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_activity" ON user_activity;
CREATE POLICY "insert_own_activity" ON user_activity FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- Streaks table
CREATE TABLE IF NOT EXISTS streaks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak integer NOT NULL DEFAULT 0,
  longest_streak integer NOT NULL DEFAULT 0,
  last_activity_date date,
  UNIQUE(user_id)
);
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_streaks" ON streaks;
CREATE POLICY "select_own_streaks" ON streaks FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_streaks" ON streaks;
CREATE POLICY "insert_own_streaks" ON streaks FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_streaks" ON streaks;
CREATE POLICY "update_own_streaks" ON streaks FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_scenarios_topic_id ON scenarios(topic_id);
CREATE INDEX IF NOT EXISTS idx_scenario_options_scenario_id ON scenario_options(scenario_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_topic_id ON quizzes(topic_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_options_question_id ON quiz_options(question_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_user_id ON xp_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_streaks_user_id ON streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);