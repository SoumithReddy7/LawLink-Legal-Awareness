import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/lib/auth-context';
import { ToastProvider } from '@/components/ui/toast';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { TopicsPage } from '@/pages/TopicsPage';
import { TopicDetailPage } from '@/pages/TopicDetailPage';
import { ScenariosPage } from '@/pages/ScenariosPage';
import { ScenarioDetailPage } from '@/pages/ScenarioDetailPage';
import { QuizzesPage } from '@/pages/QuizzesPage';
import { QuizDetailPage } from '@/pages/QuizDetailPage';
import { LeaderboardPage } from '@/pages/LeaderboardPage';
import { ResourcesPage } from '@/pages/ResourcesPage';
import { AssistantPage } from '@/pages/AssistantPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { ProgressPage } from '@/pages/ProgressPage';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth pages (no layout) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Public landing page */}
            <Route path="/" element={<LandingPage />} />

            {/* Protected pages (with layout) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <DashboardPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/topics"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <TopicsPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/topics/:id"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <TopicDetailPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/scenarios"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ScenariosPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/scenarios/:id"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ScenarioDetailPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/quizzes"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <QuizzesPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/quizzes/:quizId"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <QuizDetailPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <LeaderboardPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/resources"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ResourcesPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/assistant"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <AssistantPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ProfilePage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/progress"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ProgressPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
