import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Scale, Mail, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
    setLoading(false);
    if (resetError) {
      setError(resetError.message);
    } else {
      setSent(true);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-950 via-navy-900 to-blue-900 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-lg">
            <Scale className="h-6 w-6 text-navy-900" />
          </div>
          <span className="text-2xl font-bold text-white">LawLink</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-2xl p-8 animate-scale-in">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-7 w-7 text-green-600" />
              </div>
              <h1 className="text-xl font-bold text-navy-900 mb-2">Check your email</h1>
              <p className="text-sm text-navy-500 mb-6">
                We've sent a password reset link to <strong>{email}</strong>.
              </p>
              <Link to="/login" className="btn-secondary w-full">
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-navy-900 mb-1">Reset password</h1>
              <p className="text-navy-500 text-sm mb-6">Enter your email and we'll send you a reset link.</p>

              {error && (
                <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 animate-fade-in">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
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

                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? 'Sending...' : 'Send Reset Link'} <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-navy-500">
                Remembered your password?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
