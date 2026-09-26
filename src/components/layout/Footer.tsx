import { Link } from 'react-router-dom';
import { Scale, AlertTriangle } from 'lucide-react';

export function Footer() {
  const footerLinks = [
    { label: 'About', to: '/' },
    { label: 'Topics', to: '/topics' },
    { label: 'Resources', to: '/resources' },
    { label: 'Assistant', to: '/assistant' },
    { label: 'Privacy', to: '/' },
    { label: 'Terms', to: '/' },
    { label: 'Disclaimer', to: '/' },
    { label: 'Contact', to: '/' },
  ];

  return (
    <footer className="bg-navy-950 text-navy-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <Scale className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">LawLink</span>
            </div>
            <p className="text-sm text-navy-400 max-w-xs">
              Know Your Rights. Know Your Next Step. Legal awareness made simple, interactive and accessible.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2">
              {footerLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-sm text-navy-400 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              Important Disclaimer
            </h3>
            <p className="text-xs text-navy-400 leading-relaxed">
              LawLink is designed for legal awareness and education only. It is not a replacement
              for professional legal advice. Always consult a qualified legal professional for
              specific legal matters. Content is for educational purposes.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-navy-500">
            (c) {new Date().getFullYear()} LawLink. Built for social impact. Hackathon project.
          </p>
          <p className="text-xs text-navy-500">Made with care for legal literacy in India</p>
        </div>
      </div>
    </footer>
  );
}
