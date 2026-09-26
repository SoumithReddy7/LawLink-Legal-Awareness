import {
  ShieldCheck, ShoppingBag, Car, Lock, Scale, GraduationCap, Briefcase, Heart,
  Footprints, Brain, Search, Compass, Trophy, Flame, Target, Award,
  BookOpen, Zap, Star, CheckCircle2, AlertTriangle, Lightbulb, Info,
  type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  ShieldCheck, ShoppingBag, Car, Lock, Scale, GraduationCap, Briefcase, Heart,
  Footprints, Brain, Search, Compass, Trophy, Flame, Target, Award,
  BookOpen, Zap, Star, CheckCircle2, AlertTriangle, Lightbulb, Info,
};

export function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICON_MAP[name] ?? ShieldCheck;
  return <Icon className={className} />;
}
