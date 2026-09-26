import { Link } from 'react-router-dom';
import {
  Scale, ShieldCheck, BookOpen, Brain, Trophy, Flame, Zap, Lock,
  Users, ArrowRight, CheckCircle2, AlertTriangle, Compass, Target,
  Lightbulb, GraduationCap, Sparkles, TrendingUp, Award, Heart,
} from 'lucide-react';
import { STATIC_TOPICS } from '@/data/content';

const TOPIC_ICONS: Record<string, typeof ShieldCheck> = {
  ShieldCheck, ShoppingBag: ShieldCheck, Car: ShieldCheck, Lock: ShieldCheck,
  Scale: Scale, GraduationCap: GraduationCap, Briefcase: ShieldCheck, Heart: ShieldCheck,
};

const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-amber-100 text-amber-700',
  advanced: 'bg-red-100 text-red-700',
};

export function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-blue-900 text-white">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
                <Sparkles className="h-4 w-4 text-amber-300" />
                <span className="text-sm font-medium text-blue-100">Gamified Legal Literacy Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-balance">
                Know Your Rights.
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                  Know Your Next Step.
                </span>
              </h1>

              <p className="text-lg lg:text-xl text-blue-100/80 mb-8 max-w-xl text-balance">
                Legal awareness made simple, interactive and accessible for every young Indian.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="btn bg-white text-navy-900 px-6 py-3.5 hover:bg-blue-50 active:scale-[0.98] text-base">
                  Start Learning <ArrowRight className="h-5 w-5" />
                </Link>
                <Link to="/topics" className="btn bg-white/10 backdrop-blur-sm border border-white/30 text-white px-6 py-3.5 hover:bg-white/20 active:scale-[0.98] text-base">
                  Explore Topics
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-6 mt-10">
                <div className="flex items-center gap-2 text-sm text-blue-200">
                  <CheckCircle2 className="h-5 w-5 text-green-400" /> 8 Legal Topics
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-200">
                  <CheckCircle2 className="h-5 w-5 text-green-400" /> Interactive Scenarios
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-200">
                  <CheckCircle2 className="h-5 w-5 text-green-400" /> Earn XP & Badges
                </div>
              </div>
            </div>

            {/* Hero illustration */}
            <div className="hidden lg:flex justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <HeroCard icon={Scale} title="Your Rights" desc="Fundamental freedoms" color="from-blue-500 to-blue-700" delay="0s" />
                    <HeroCard icon={ShieldCheck} title="Cyber Safety" desc="Stay safe online" color="from-cyan-500 to-blue-600" delay="1s" />
                    <HeroCard icon={Users} title="Community" desc="Learn together" color="from-teal-500 to-cyan-600" delay="2s" />
                  </div>
                  <div className="space-y-4 mt-8">
                    <HeroCard icon={BookOpen} title="Knowledge" desc="Simple explanations" color="from-indigo-500 to-blue-700" delay="0.5s" />
                    <HeroCard icon={Flame} title="Streaks" desc="Keep learning daily" color="from-orange-500 to-red-500" delay="1.5s" />
                    <HeroCard icon={Trophy} title="Badges" desc="Unlock achievements" color="from-amber-500 to-yellow-500" delay="2.5s" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Impact */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 rounded-full px-4 py-1.5 mb-4">
            <Heart className="h-4 w-4" /> Social Impact
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-navy-900 mb-4 text-balance">
            Legal knowledge should be accessible to everyone.
          </h2>
          <p className="text-lg text-navy-600 max-w-2xl mx-auto text-balance">
            LawLink transforms complicated legal concepts into simple scenarios, interactive learning
            and practical guidance — empowering young Indians to understand their rights and take informed action.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-navy-900 mb-3">How It Works</h2>
            <p className="text-navy-600 max-w-xl mx-auto">Four simple steps to legal empowerment.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: '01', icon: Compass, title: 'Choose', desc: 'Pick a legal topic that matters to you.', color: 'from-blue-500 to-blue-700' },
              { num: '02', icon: Lightbulb, title: 'Understand', desc: 'Learn through simple explanations and real-world situations.', color: 'from-cyan-500 to-blue-600' },
              { num: '03', icon: Target, title: 'Challenge', desc: 'Test your knowledge through scenarios and quizzes.', color: 'from-amber-500 to-orange-500' },
              { num: '04', icon: Award, title: 'Empower', desc: 'Earn knowledge, discover resources and know your next step.', color: 'from-emerald-500 to-teal-600' },
            ].map((step) => (
              <div key={step.num} className="card p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4`}>
                  <step.icon className="h-6 w-6 text-white" />
                </div>
                <p className="text-sm font-bold text-navy-400 mb-1">{step.num}</p>
                <h3 className="text-lg font-bold text-navy-900 mb-2">{step.title}</h3>
                <p className="text-sm text-navy-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Topics Preview */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-navy-900 mb-3">Explore Legal Topics</h2>
            <p className="text-navy-600 max-w-xl mx-auto">From cyber safety to fundamental rights — learn what matters to you.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STATIC_TOPICS.map((topic) => {
              const Icon = TOPIC_ICONS[topic.icon] ?? ShieldCheck;
              return (
                <Link key={topic.id} to="/register" className="card-hover p-5 group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-11 h-11 rounded-xl bg-navy-50 group-hover:bg-navy-100 flex items-center justify-center transition-colors">
                      <Icon className="h-5 w-5 text-navy-700" />
                    </div>
                    <span className={`badge-pill ${DIFFICULTY_STYLES[topic.difficulty]}`}>
                      {topic.difficulty}
                    </span>
                  </div>
                  <h3 className="font-bold text-navy-900 text-sm mb-1.5 leading-snug">{topic.title}</h3>
                  <p className="text-xs text-navy-500 line-clamp-2 mb-3">{topic.description}</p>
                  <div className="flex items-center gap-1 text-xs text-blue-600 font-semibold group-hover:gap-2 transition-all">
                    Start learning <ArrowRight className="h-3 w-3" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gamification Preview */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-navy-950 via-navy-900 to-blue-900 text-white overflow-hidden relative">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-4">
              <Trophy className="h-4 w-4 text-amber-300" />
              <span className="text-sm font-medium text-blue-100">Gamified Learning</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-3">Learning should feel rewarding.</h2>
            <p className="text-blue-100/80 max-w-xl mx-auto">Earn XP, level up, unlock badges, and keep your streak alive.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <GamoCard icon={Zap} title="+50 XP" desc="Earn points for every activity" color="from-amber-400 to-orange-500" />
            <GamoCard icon={TrendingUp} title="Level Up" desc="Progress through 6 levels" color="from-blue-400 to-indigo-500" />
            <GamoCard icon={Award} title="Badge Unlocked" desc="8 unique achievements" color="from-purple-400 to-pink-500" />
            <GamoCard icon={Flame} title="7 Day Streak" desc="Keep your momentum going" color="from-orange-400 to-red-500" />
          </div>
        </div>
      </section>

      {/* Journey / Storytelling */}
      <section className="py-16 lg:py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-navy-900 mb-3">The LawLink Journey</h2>
            <p className="text-navy-600">From problem to empowered citizen.</p>
          </div>

          <div className="space-y-3">
            {[
              { tag: 'Problem', text: 'Young people often struggle to understand their rights and responsibilities.', color: 'bg-red-100 text-red-700', icon: AlertTriangle },
              { tag: 'LawLink', text: 'Turns legal awareness into interactive learning.', color: 'bg-blue-100 text-blue-700', icon: Scale },
              { tag: 'Learn', text: 'Simple, clear explanations of legal concepts.', color: 'bg-cyan-100 text-cyan-700', icon: BookOpen },
              { tag: 'Experience', text: 'Real-world scenarios that test your judgment.', color: 'bg-indigo-100 text-indigo-700', icon: Lightbulb },
              { tag: 'Challenge', text: 'Interactive quizzes that reinforce knowledge.', color: 'bg-amber-100 text-amber-700', icon: Target },
              { tag: 'Reward', text: 'XP, badges, and levels that keep you motivated.', color: 'bg-orange-100 text-orange-700', icon: Trophy },
              { tag: 'Guidance', text: 'AI assistant for navigating legal questions.', color: 'bg-purple-100 text-purple-700', icon: Brain },
              { tag: 'Action', text: 'Trusted legal resources at your fingertips.', color: 'bg-teal-100 text-teal-700', icon: Compass },
              { tag: 'Impact', text: 'More informed and empowered citizens.', color: 'bg-emerald-100 text-emerald-700', icon: Award },
            ].map((step, i) => (
              <div
                key={step.tag}
                className="flex items-center gap-4 card p-4 animate-slide-up"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${step.color} flex items-center justify-center`}>
                  <step.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`badge-pill ${step.color}`}>{step.tag}</span>
                  </div>
                  <p className="text-sm text-navy-700">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / Safety */}
      <section className="py-12 bg-amber-50 border-y border-amber-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 rounded-full px-4 py-1.5 mb-3">
            <AlertTriangle className="h-4 w-4" /> Important Notice
          </div>
          <p className="text-navy-800 text-sm lg:text-base max-w-2xl mx-auto">
            LawLink is designed for legal awareness and education, not as a replacement for
            professional legal advice. Always consult a qualified legal professional for specific
            legal matters. All content is for educational purposes only.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-navy-900 mb-4 text-balance">
            Ready to know your rights?
          </h2>
          <p className="text-navy-600 mb-8">Join LawLink today and start your legal literacy journey.</p>
          <Link to="/register" className="btn-primary text-base px-8 py-4 inline-flex">
            Start Learning Free <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function HeroCard({ icon: Icon, title, desc, color, delay }: {
  icon: typeof Scale; title: string; desc: string; color: string; delay: string;
}) {
  return (
    <div
      className="w-44 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 animate-float"
      style={{ animationDelay: delay }}
    >
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <h3 className="text-sm font-bold text-white mb-0.5">{title}</h3>
      <p className="text-xs text-blue-200">{desc}</p>
    </div>
  );
}

function GamoCard({ icon: Icon, title, desc, color }: {
  icon: typeof Scale; title: string; desc: string; color: string;
}) {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-center hover:bg-white/15 transition-all hover:scale-105 duration-300">
      <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="font-bold text-white text-sm mb-1">{title}</h3>
      <p className="text-xs text-blue-200">{desc}</p>
    </div>
  );
}
