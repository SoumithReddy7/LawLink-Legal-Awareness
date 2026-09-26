import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scale, Mail, Lock, User, ArrowRight, AlertCircle, Globe } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { LANGUAGES } from '@/data/content';

export function RegisterPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [language, setLanguage] = useState('en');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    setLoading(true);
    const { error: signUpError } = await signUp(email, password, name, language);
    setLoading(false);
    if (signUpError) {
      setError(signUpError);
    } else {
      navigate('/dashboard');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-950 via-navy-900 to-blue-900 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-lg">
            <Scale className="h-6 w-6 text-navy-900" />
          </div>
          <span className="text-2xl font-bold text-white">LawLink</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-2xl p-8 animate-scale-in max-h-[90vh] overflow-y-auto">
          <h1 className="text-2xl font-bold text-navy-900 mb-1">Create your account</h1>
          <p className="text-navy-500 text-sm mb-6">Start your legal literacy journey today.</p>

          {error && (
            <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 animate-fade-in">
              <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label" htmlFor="name">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input pl-10"
                  placeholder="Your name"
                  autoComplete="name"
                />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="email">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-10"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="password">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10"
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="language">Preferred Language</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="input pl-10 appearance-none"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code} disabled={lang.status === 'coming_soon'}>
                      {lang.label}
                      {lang.status === 'coming_soon' ? ' — Coming Soon' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Creating account...' : 'Create Account'} <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-navy-500">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
