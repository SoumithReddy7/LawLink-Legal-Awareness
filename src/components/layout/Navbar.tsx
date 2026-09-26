import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Scale, Menu, X, LogOut, User, Zap, Flame, Shield } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { getStreak } from '@/lib/gamification';
import { getLevelProgress } from '@/types';

export function Navbar() {
  const { session, profile, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (session) {
      getStreak(session.user.id).then(setStreak);
    }
  }, [session, location.pathname]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/topics', label: 'Topics' },
    { to: '/scenarios', label: 'Scenarios' },
    { to: '/quizzes', label: 'Quizzes' },
    { to: '/leaderboard', label: 'Leaderboard' },
    { to: '/assistant', label: 'Assistant' },
    { to: '/resources', label: 'Resources' },
  ];

  const levelInfo = profile ? getLevelProgress(profile.xp) : null;

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-navy-900 to-blue-700 flex items-center justify-center shadow-md">
              <Scale className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-navy-900 hidden sm:block">LawLink</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname.startsWith(link.to)
                    ? 'bg-navy-100 text-navy-900'
                    : 'text-navy-600 hover:text-navy-900 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {session && profile ? (
              <>
                {/* XP & Level badge */}
                <div className="hidden sm:flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
                    <Zap className="h-3.5 w-3.5 text-amber-600" />
                    <span className="text-xs font-bold text-amber-700">{profile.xp} XP</span>
                  </div>
                  {streak > 0 && (
                    <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 rounded-full px-3 py-1">
                      <Flame className="h-3.5 w-3.5 text-orange-600" />
                      <span className="text-xs font-bold text-orange-700">{streak}</span>
                    </div>
                  )}
                  {isAdmin && (
                    <div className="flex items-center gap-1.5 bg-navy-900 text-white rounded-full px-3 py-1">
                      <Shield className="h-3.5 w-3.5" />
                      <span className="text-xs font-bold">Admin</span>
                    </div>
                  )}
                </div>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 rounded-full pl-1 pr-3 py-1 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-navy-700 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                    {profile.display_name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-navy-700 hidden md:block max-w-[100px] truncate">
                    {profile.display_name}
                  </span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="p-2 text-navy-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Sign out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm hidden sm:inline-flex">
                  <User className="h-4 w-4" /> Sign In
                </Link>
                <Link to="/register" className="btn-primary text-sm hidden sm:inline-flex">
                  Get Started
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-navy-700 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Level progress bar */}
        {session && profile && levelInfo && (
          <div className="hidden sm:flex items-center gap-2 pb-2">
            <span className="text-xs font-bold text-navy-600">Lvl {profile.level}</span>
            <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden max-w-xs">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-navy-700 rounded-full transition-all duration-700"
                style={{ width: `${levelInfo.progress}%` }}
              />
            </div>
            <span className="text-xs text-navy-400">{levelInfo.xpInLevel}/{levelInfo.xpNeeded} XP</span>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname.startsWith(link.to)
                    ? 'bg-navy-100 text-navy-900'
                    : 'text-navy-600 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className="block px-4 py-2.5 rounded-lg text-sm font-medium text-navy-600 hover:bg-slate-100"
              >
                Admin Dashboard
              </Link>
            )}
            {session && profile && (
              <div className="pt-3 border-t border-slate-200 flex items-center gap-3 px-4">
                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
                  <Zap className="h-3.5 w-3.5 text-amber-600" />
                  <span className="text-xs font-bold text-amber-700">{profile.xp} XP</span>
                </div>
                {streak > 0 && (
                  <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 rounded-full px-3 py-1">
                    <Flame className="h-3.5 w-3.5 text-orange-600" />
                    <span className="text-xs font-bold text-orange-700">{streak}</span>
                  </div>
                )}
              </div>
            )}
            {!session && (
              <div className="pt-3 border-t border-slate-200 space-y-2 px-4">
                <Link to="/login" className="btn-secondary w-full text-sm">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary w-full text-sm">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
