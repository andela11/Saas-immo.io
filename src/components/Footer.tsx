import React from 'react';
import { Building2, ShieldCheck, Sparkles, FileText, Mail, Lock, Heart, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate?: (tab: string) => void;
  onOpenAuthModal?: () => void;
  onOpenPaymentModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenAuthModal,
  onOpenPaymentModal,
}) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80 mt-16 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800/80">
          
          {/* Brand & Description Column (2 cols wide on large screens) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-md shadow-emerald-500/10 flex-shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-xl tracking-tight text-white">
                    Immo<span className="text-emerald-400 font-extrabold">Gestion</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/30">
                    SaaS Pro
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-medium tracking-wide">
                  by <span className="text-slate-300 font-bold">Blink Services</span>
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              La solution complète de gestion immobilière pour propriétaires indépendants et SCI. Automatisez vos quittances, suivez vos encaissements et optimisez la rentabilité de votre patrimoine grâce à notre assistant IA intégré.
            </p>

            <div className="flex items-center space-x-4 pt-2">
              <div className="flex items-center space-x-1.5 text-xs text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Données Sécurisées SSL 256-bit</span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <Lock className="w-4 h-4 text-purple-400" />
                <span>Conforme RGPD</span>
              </div>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Navigation</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('dashboard')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Tableau de Bord
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('properties')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Gestion des Biens
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('tenants')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Gestion des Locataires
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('rent_calendar')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Planning des Loyers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('finances')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Comptabilité & Finances
                </button>
              </li>
            </ul>
          </div>

          {/* Outils & IA Column */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Outils Avancés</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('ai_assistant')}
                  className="flex items-center space-x-1 text-purple-300 hover:text-purple-200 font-medium transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Assistant IA Gemini</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('tax_report')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Rapport Fiscal (2044 / 2042-C)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('map')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Carte Interactive du Parc
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('maintenance')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Tickets de Maintenance
                </button>
              </li>
            </ul>
          </div>

          {/* SaaS & Support Column */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Compte & Offres</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onOpenPaymentModal && onOpenPaymentModal()}
                  className="text-emerald-400 font-semibold hover:underline flex items-center space-x-1"
                >
                  <span>Abonnement SaaS Pro</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('settings')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Paramètres Profil & SCI
                </button>
              </li>
              {onOpenAuthModal && (
                <li>
                  <button
                    onClick={onOpenAuthModal}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Connexion / Inscription
                  </button>
                </li>
              )}
              <li className="pt-2 text-slate-500 flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5" />
                <span>support@immogestion.saas</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Credits & Developer Signature Section */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="text-slate-400 text-center md:text-left">
            &copy; {new Date().getFullYear()} ImmoGestion SaaS. Tous droits réservés.
          </div>

          {/* Explicit Developer Attribution Requested by User */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2 flex items-center space-x-2 text-slate-300">
            <span>Développé avec excellence par</span>
            <span className="font-extrabold text-white bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent uppercase tracking-wider text-xs">
              blink-services
            </span>
          </div>

          <div className="flex items-center space-x-6 text-slate-400">
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Mentions Légales</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Confidentialité</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">CGU</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
