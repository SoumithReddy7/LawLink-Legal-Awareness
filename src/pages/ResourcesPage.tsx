import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, CheckCircle2, AlertTriangle, ExternalLink, Phone,
  Globe, ShieldCheck, Siren, Scale, GraduationCap, Car, Heart,
  ShoppingBag, Building2, ArrowRight, BookOpen,
} from 'lucide-react';
import { useContent } from '@/hooks/useContent';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { StateWrapper } from '@/components/ui/StateWrapper';

const CATEGORY_ICONS: Record<string, typeof ShieldCheck> = {
  Emergency: Siren,
  Cybercrime: ShieldCheck,
  'Consumer Complaints': ShoppingBag,
  "Women's Safety": Heart,
  'Road & Traffic': Car,
  'Legal Aid': Scale,
  'Government Services': Building2,
  'Student Support': GraduationCap,
};

const CATEGORY_STYLES: Record<string, string> = {
  Emergency: 'bg-red-100 text-red-700 border-red-200',
  Cybercrime: 'bg-blue-100 text-blue-700 border-blue-200',
  'Consumer Complaints': 'bg-green-100 text-green-700 border-green-200',
  "Women's Safety": 'bg-rose-100 text-rose-700 border-rose-200',
  'Road & Traffic': 'bg-orange-100 text-orange-700 border-orange-200',
  'Legal Aid': 'bg-navy-100 text-navy-700 border-navy-200',
  'Government Services': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'Student Support': 'bg-purple-100 text-purple-700 border-purple-200',
};

const ALL_CATEGORIES = [
  'Emergency', 'Cybercrime', 'Consumer Complaints', "Women's Safety",
  'Road & Traffic', 'Legal Aid', 'Government Services', 'Student Support',
];

export function ResourcesPage() {
  const { resources, loading, error } = useContent();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredResources = useMemo(() => {
    return resources.filter((r) => {
      const matchesSearch =
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase()) ||
        r.category.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || r.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [resources, search, categoryFilter]);

  const emergencyResources = filteredResources.filter((r) => r.category === 'Emergency');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-navy-900 mb-2">Legal Resource Directory</h1>
        <p className="text-navy-500">Find trusted official portals, helplines, and legal aid services.</p>
      </div>

      {/* Emergency banner */}
      {emergencyResources.length > 0 && (
        <div className="card p-5 mb-6 bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center flex-shrink-0">
              <Siren className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-red-800 mb-1">Emergency Help</h2>
              <p className="text-sm text-red-700 mb-3">If you are in immediate danger, call these numbers right away.</p>
              <div className="flex flex-wrap gap-2">
                {emergencyResources.map((r) => (
                  <span key={r.id} className="inline-flex items-center gap-1.5 bg-white border border-red-200 rounded-lg px-3 py-1.5 text-sm font-bold text-red-700">
                    <Phone className="h-3.5 w-3.5" /> {r.contact}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-10"
          placeholder="Search resources by name, description, or category..."
          aria-label="Search resources"
        />
      </div>

      {/* Category filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
        <button
          onClick={() => setCategoryFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
            categoryFilter === 'all'
              ? 'bg-navy-900 text-white'
              : 'bg-white text-navy-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Categories
        </button>
        {ALL_CATEGORIES.map((cat) => {
          const Icon = CATEGORY_ICONS[cat] ?? BookOpen;
          return (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? 'bg-navy-900 text-white'
                  : 'bg-white text-navy-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="h-3.5 w-3.5" /> {cat}
            </button>
          );
        })}
      </div>

      <StateWrapper
        loading={loading}
        error={error}
        empty={filteredResources.length === 0}
        emptyMessage="No resources match your search. Try a different keyword or category."
        skeleton={
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        }
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredResources.map((resource) => {
            const CatIcon = CATEGORY_ICONS[resource.category] ?? BookOpen;
            const catStyle = CATEGORY_STYLES[resource.category] ?? 'bg-slate-100 text-slate-700 border-slate-200';

            return (
              <div key={resource.id} className="card-hover p-5 animate-fade-in">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${catStyle}`}>
                    <CatIcon className="h-5 w-5" />
                  </div>
                  {resource.is_verified ? (
                    <span className="badge-pill bg-green-100 text-green-700">
                      <CheckCircle2 className="h-3 w-3" /> Verified
                    </span>
                  ) : (
                    <span className="badge-pill bg-amber-100 text-amber-700">
                      <AlertTriangle className="h-3 w-3" /> Demo
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-navy-900 mb-1.5 leading-snug">{resource.name}</h3>
                <span className={`badge-pill ${catStyle} mb-2`}>{resource.category}</span>
                <p className="text-sm text-navy-500 mb-3 line-clamp-3">{resource.description}</p>

                <div className="space-y-1.5 text-xs text-navy-600">
                  {resource.contact && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-navy-400" />
                      <span className="font-semibold">{resource.contact}</span>
                    </div>
                  )}
                  {resource.website && (
                    <div className="flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5 text-navy-400" />
                      <span className="font-medium text-blue-600">{resource.website}</span>
                    </div>
                  )}
                  {resource.source && (
                    <div className="flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-navy-400" />
                      <span className="text-navy-400">{resource.source}</span>
                    </div>
                  )}
                </div>

                {!resource.is_verified && (
                  <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-2 text-[11px] text-amber-700">
                    Demo resource — verify before use.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </StateWrapper>

      {/* Disclaimer */}
      <div className="mt-8 card p-5 bg-amber-50 border-amber-200">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-navy-800 text-sm mb-1">Legal Awareness Disclaimer</h3>
            <p className="text-xs text-navy-600 leading-relaxed">
              These resources are provided for legal awareness and educational purposes only.
              LawLink does not guarantee the accuracy of third-party information. Always verify
              contact details and websites through official government sources. For specific legal
              matters, consult a qualified legal professional. LawLink is not a replacement for
              professional legal advice.
            </p>
          </div>
        </div>
      </div>

      {/* Link to assistant */}
      <div className="mt-6 text-center">
        <Link to="/assistant" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-semibold">
          Need guidance? Ask LawLink Assistant <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
