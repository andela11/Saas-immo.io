import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import {
  Building2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Receipt,
  Wrench,
  Calculator,
  ShieldCheck,
  Users,
  ChevronDown,
  Star,
  Zap,
  Bot,
  MapPin,
  Clock,
  DollarSign,
  Play,
  Pause,
  Video,
  Send,
  X,
  Eye,
  FileCheck2,
  Search,
  Check
} from 'lucide-react';
import { ActiveTab, Property } from '../types';

// Animated Counter Component for Fintech metrics
interface AnimatedMetricProps {
  value: string;
  label: string;
  textColor?: string;
}

const AnimatedMetricCard: React.FC<AnimatedMetricProps> = ({ value, label, textColor = "text-white" }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-1"
    >
      <motion.p
        initial={{ scale: 0.9 }}
        animate={isInView ? { scale: 1 } : { scale: 0.9 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={`text-3xl sm:text-4xl font-black ${textColor}`}
      >
        {value}
      </motion.p>
      <p className="text-xs text-slate-400 font-medium">{label}</p>
    </motion.div>
  );
};

interface LandingPageViewProps {
  onEnterApp: (targetTab?: ActiveTab) => void;
  onOpenAuthModal?: (mode?: 'login' | 'register') => void;
  onOpenPaymentModal?: () => void;
  properties?: Property[];
  onAddCandidateApplication?: (candidate: {
    propertyTitle: string;
    name: string;
    email: string;
    phone: string;
    incomeMonthly: number;
    guarantor: boolean;
    moveInDate: string;
  }) => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onEnterApp,
  onOpenAuthModal,
  onOpenPaymentModal,
  properties = [],
  onAddCandidateApplication
}) => {
  // Candidate Application Modal state
  const [selectedPropertyToApply, setSelectedPropertyToApply] = useState<Property | null>(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantIncome, setApplicantIncome] = useState(2800);
  const [hasGuarantor, setHasGuarantor] = useState(true);
  const [moveInDate, setMoveInDate] = useState('2026-09-01');
  const [submittedApplication, setSubmittedApplication] = useState(false);

  // Property Filter on Landing
  const [cityFilter, setCityFilter] = useState('Tous');

  // Interactive Video Background state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [currentVideoUrl, setCurrentVideoUrl] = useState(
    'https://cdn.coverr.co/videos/coverr-night-city-traffic-timelapse-5353/1080p.mp4'
  );

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        setIsVideoPlaying(false);
      });
    }
  }, [currentVideoUrl]);

  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsVideoPlaying(true);
      } else {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      }
    }
  };
  // Simulator state
  const [purchasePrice, setPurchasePrice] = useState(250000);
  const [monthlyRent, setMonthlyRent] = useState(1100);
  const [annualCharges, setAnnualCharges] = useState(1200);

  // FAQ Accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Pricing Toggle State
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  // Interactive Feature Tab Preview state
  const [activeFeatureTab, setActiveFeatureTab] = useState<'quittance' | 'ai' | 'maintenance' | 'taxes'>('ai');

  // Filtered properties for showcase
  const cities = ['Tous', ...Array.from(new Set(properties.map(p => p.city)))];
  const displayedProperties = properties.filter(p => cityFilter === 'Tous' || p.city === cityFilter);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantEmail) return;

    if (onAddCandidateApplication && selectedPropertyToApply) {
      onAddCandidateApplication({
        propertyTitle: selectedPropertyToApply.title,
        name: applicantName,
        email: applicantEmail,
        phone: applicantPhone,
        incomeMonthly: applicantIncome,
        guarantor: hasGuarantor,
        moveInDate,
      });
    }

    setSubmittedApplication(true);
    setTimeout(() => {
      setSubmittedApplication(false);
      setSelectedPropertyToApply(null);
      setApplicantName('');
      setApplicantEmail('');
      setApplicantPhone('');
    }, 2500);
  };

  // Calculations
  const annualRent = monthlyRent * 12;
  const grossYield = ((annualRent / purchasePrice) * 100).toFixed(2);
  const netRent = annualRent - annualCharges;
  const netYield = ((netRent / purchasePrice) * 100).toFixed(2);
  const estimatedTaxSavingsLmnp = Math.round(annualRent * 0.35);

  const faqs = [
    {
      q: "Est-ce que les quittances générées sont juridiquement valides en France ?",
      a: "Oui, à 100%. Toutes les quittances émises par ImmoGestion respectent scrupuleusement les exigences de la Loi n° 89-462 du 6 juillet 1989. Elles intègrent le détail hors charges, les provisions sur charges et la signature du bailleur.",
    },
    {
      q: "Comment fonctionne l'IA Gemini pour les bailleurs ?",
      a: "Notre assistant IA est entraîné sur le droit immobilier français (loi 1989, baux meublés/nus, révision IRL, LMNP). Il rédige vos annonces LeBonCoin/SeLoger, prépare vos courriers officiels (relances impayés, révision de loyer) et répond à vos questions juridiques.",
    },
    {
      q: "Puis-je gérer plusieurs SCI ou plusieurs régimes fiscaux (LMNP, Foncier) ?",
      a: "Absolument. ImmoGestion gère les portefeuilles multi-biens et simule instantanément vos régimes d'imposition (Micro-Foncier, Réel, Micro-BIC et LMNP Réel Amortissable).",
    },
    {
      q: "Mes données bancaires et personnelles sont-elles en sécurité ?",
      a: "Vos données sont sauvegardées en local sur votre navigateur et synchronisables au format JSON. Nous n'exposons jamais vos identifiants ou informations sensibles.",
    },
    {
      q: "Est-il possible d'importer / exporter mes données à tout moment ?",
      a: "Oui, un bouton d'export complet en 1 clic vous permet de télécharger toute votre base (biens, locataires, historique des loyers) au format JSON standard.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 overflow-x-hidden w-full max-w-full">
      
      {/* Navigation Bar */}
      <nav className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onEnterApp('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Building2 className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-white">ImmoGestion</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  AI SaaS
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8 text-xs font-semibold text-slate-300">
            <a href="#listings" className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center space-x-1 font-bold">
              <Building2 className="w-3.5 h-3.5" />
              <span>Biens à Louer</span>
            </a>
            <a href="#features" className="hover:text-emerald-400 transition-colors">Fonctionnalités</a>
            <a href="#simulator" className="hover:text-emerald-400 transition-colors">Simulateur</a>
            <a href="#pricing" className="hover:text-emerald-400 transition-colors">Tarifs</a>
            <a href="#testimonials" className="hover:text-emerald-400 transition-colors">Avis Client</a>
            <a href="#faq" className="hover:text-emerald-400 transition-colors">FAQ</a>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {onOpenAuthModal && (
              <>
                <button
                  onClick={() => onOpenAuthModal('login')}
                  className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-800 transition-all"
                >
                  Se Connecter
                </button>
                <button
                  onClick={() => onOpenAuthModal('register')}
                  className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition-all hidden sm:block"
                >
                  S'Inscrire
                </button>
              </>
            )}
            <button
              onClick={() => onEnterApp('dashboard')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs border border-slate-700 transition-all flex items-center space-x-1.5"
            >
              <span>Espace Démo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-20 sm:pb-28 overflow-hidden">
        {/* Sleek Dark Background Ambient Video Loop */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <video
            ref={videoRef}
            key={currentVideoUrl}
            autoPlay
            loop
            muted
            playsInline
            poster="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=80"
            className="absolute inset-0 w-full h-full object-cover scale-105"
          >
            <source src={currentVideoUrl} type="video/mp4" />
            <source
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
              type="video/mp4"
            />
            <source
              src="https://assets.mixkit.co/videos/preview/mixkit-modern-city-buildings-at-night-42283-large.mp4"
              type="video/mp4"
            />
          </video>
          {/* Dark Overlay for text legibility */}
          <div className="absolute inset-0 bg-slate-950/75"></div>
        </div>

        {/* Glowing Ambient Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[700px] h-[300px] sm:h-[400px] bg-emerald-500/20 blur-[100px] sm:blur-[140px] rounded-full pointer-events-none"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.12, 0.22, 0.12] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-1/3 right-2 sm:right-10 w-[250px] sm:w-[450px] h-[250px] sm:h-[350px] bg-indigo-500/20 blur-[90px] sm:blur-[120px] rounded-full pointer-events-none"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 text-slate-200 text-xs font-semibold backdrop-blur-md shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Logiciel N°1 pour Bailleurs Particuliers & SCI en France</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-none max-w-4xl mx-auto"
          >
            La Gestion Immobilière <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
              Augmentée par l'Intelligence Artificielle
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            Gérez votre parc immobilier en toute sérénité. Édition automatique de quittances de loyer, suivi des encaissements, relances juridiques par IA et optimisation fiscale LMNP.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onOpenAuthModal ? onOpenAuthModal('register') : onEnterApp('dashboard')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Créer mon Compte Gratuit</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onEnterApp('dashboard')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-sm border border-slate-800 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              <span>Tester la Démo Immédiate</span>
            </motion.button>
          </motion.div>

          {/* Feature Badges under Hero */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="pt-8 flex flex-wrap justify-center gap-6 text-xs text-slate-400 border-t border-slate-900/80 max-w-3xl mx-auto"
          >
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Conforme Loi 1989</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Génération PDF en 1-Clic</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Intégration Gemini 3.6</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Sauvegarde 100% Sécurisée</span>
            </span>
          </motion.div>

        </div>
      </section>

      {/* Metrics Key Performance Indicators */}
      <section className="py-10 bg-slate-900/60 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <AnimatedMetricCard value="2.4 M€" label="Volume de loyers sous gestion" textColor="text-emerald-400" />
          <AnimatedMetricCard value="99.4 %" label="Taux de paiement à échéance" textColor="text-white" />
          <AnimatedMetricCard value="3h 40m" label="Temps économisé par mois / bailleur" textColor="text-indigo-400" />
          <AnimatedMetricCard value="4.9 / 5" label="Note moyenne de nos propriétaires" textColor="text-amber-400" />
        </div>
      </section>

      {/* Public Rental Property Showcase Section (For Prospective Tenants) */}
      <section id="listings" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
              <Building2 className="w-4 h-4" />
              <span>Vitrine Publique des Annonces</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Nos Biens Disponibles à la Location
            </h2>
            <p className="text-xs text-slate-400 max-w-xl">
              Vous cherchez votre futur logement ? Parcourez nos appartements disponibles, consultez les descriptions rédigées par IA et déposez votre dossier directement en ligne.
            </p>
          </div>

          {/* City Filter buttons with smooth LayoutId animation */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-2 md:pb-0 max-w-full relative">
            {cities.map((city) => {
              const isSelected = cityFilter === city;
              return (
                <button
                  key={city}
                  onClick={() => setCityFilter(city)}
                  className={`relative px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    isSelected ? 'text-slate-950' : 'text-slate-300 hover:text-white bg-slate-900 border border-slate-800'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeCityFilter"
                      className="absolute inset-0 bg-emerald-500 rounded-xl shadow-md shadow-emerald-500/20"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{city}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Property Cards Grid with Motion Reveal & Hover Elevation */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {displayedProperties.map((prop, idx) => (
              <motion.div
                key={prop.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between transition-colors group"
              >
                <div>
                  {/* Photo Header */}
                  <div className="relative h-48 overflow-hidden bg-slate-950">
                    <img
                      src={prop.imageUrl}
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                      <span className="bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-700">
                        {prop.type} • {prop.surface} m²
                      </span>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        prop.status === 'Occupied'
                          ? 'bg-amber-500/80 text-white'
                          : 'bg-emerald-500 text-slate-950'
                      }`}>
                        {prop.status === 'Occupied' ? 'Bientôt Libre' : 'Disponible Immédiatement'}
                      </span>
                    </div>

                    {prop.dpe && (
                      <div className="absolute top-3 right-3 bg-emerald-600 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded shadow">
                        DPE {prop.dpe}
                      </div>
                    )}

                    <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-800 text-white font-extrabold text-sm">
                      {prop.monthlyRent} € <span className="text-[10px] text-slate-400 font-normal">/ mois + {prop.charges}€ ch.</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-white text-base leading-snug">{prop.title}</h3>
                        <p className="text-xs text-slate-400 flex items-center space-x-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{prop.address}, {prop.city}</span>
                        </p>
                      </div>
                    </div>

                    {/* AI Description snippet */}
                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 italic">
                      "{prop.description || 'Superbe logement rénové, lumineux, bien situé proche des transports et commerces.'}"
                    </p>

                    <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-400 text-center">
                      <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                        <span className="block font-bold text-white">{prop.rooms} pièce(s)</span>
                        <span>Agencement</span>
                      </div>
                      <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                        <span className="block font-bold text-white">{prop.bedrooms} ch.</span>
                        <span>Chambres</span>
                      </div>
                      <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                        <span className="block font-bold text-emerald-400">{prop.deposit} €</span>
                        <span>Dépôt gar.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div className="p-5 pt-0">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedPropertyToApply(prop)}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 transition-colors shadow-md shadow-emerald-500/10 cursor-pointer"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>Déposer un Dossier de Candidature</span>
                  </motion.button>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Interactive Live Product Preview Tabs */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Tout votre patrimoine immobilier dans un seul espace
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Une suite complète d'outils digitaux conçue pour maximiser votre rendement net et éliminer le stress administratif.
          </p>
        </div>

        {/* Feature Navigation Tabs with layoutId smooth pill slider */}
        <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl w-fit mx-auto text-xs font-bold">
          {[
            { id: 'ai', label: 'Assistant IA Gemini', icon: Bot },
            { id: 'quittance', label: 'Quittances & Encaissements', icon: Receipt },
            { id: 'maintenance', label: 'Suivi Travaux & Artisans', icon: Wrench },
            { id: 'taxes', label: 'Fiscalité LMNP & Réel', icon: Calculator },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeFeatureTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFeatureTab(tab.id as any)}
                className={`relative px-4 py-2.5 rounded-xl transition-colors flex items-center space-x-2 cursor-pointer ${
                  isSelected ? 'text-slate-950 font-extrabold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeFeaturePill"
                    className="absolute inset-0 bg-emerald-500 rounded-xl shadow-md shadow-emerald-500/20"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center space-x-2">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Feature Tab Active Preview with AnimatePresence */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden min-h-[320px]">
          <AnimatePresence mode="wait">
            {activeFeatureTab === 'ai' && (
              <motion.div
                key="ai"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
              >
                <div className="space-y-4">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center space-x-1">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>Gemini 3.6 Flash Engine</span>
                  </span>
                  <h3 className="text-2xl font-bold text-white">Rédigez vos annonces et vos courriers officiels en 3 secondes</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Grâce au modèle d'intelligence artificielle Gemini, générez des annonces attractives adaptées à LeBonCoin et SeLoger, rédigez des lettres de mise en demeure, ou consultez notre assistant sur la loi de 1989.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Rédaction d'annonces optimisées selon le ton désiré (Prestige, Étudiant, Investisseur)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Avis de révision annuelle de loyer calculés sur l'indice IRL officiel</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Chatbot juridique spécialisé en baux d'habitation français</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => onEnterApp('ai_assistant')}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center space-x-2 transition-all shadow-md cursor-pointer"
                  >
                    <span>Tester le Rédacteur IA</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs shadow-inner">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-purple-400 font-bold">ImmoBot AI Prompt Output</span>
                    <span className="text-[10px] text-slate-500">Gemini 3.6</span>
                  </div>
                  <p className="text-slate-300 italic">
                    "Magnifique T3 traversant de 68m² situé au cœur de Lyon 6ème. Lumineux, parquet ancien et balcon plein sud. Proche métro Foch..."
                  </p>
                  <div className="pt-2 text-[10px] text-emerald-400 font-bold">
                    ✓ Généré avec succès (rendement brut estimé : 5.8%)
                  </div>
                </div>
              </motion.div>
            )}

            {activeFeatureTab === 'quittance' && (
              <motion.div
                key="quittance"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
              >
                <div className="space-y-4">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Conformité Légale</span>
                  <h3 className="text-2xl font-bold text-white">Émission Instantanée de Quittances de Loyer PDF</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Générez en un clic vos quittances de loyer mensuelles conforme à la réglementation en vigueur. Téléchargez le PDF ou copiez le texte officiel.
                  </p>
                  <button
                    onClick={() => onEnterApp('finances')}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center space-x-2 transition-all shadow-md cursor-pointer"
                  >
                    <span>Accéder au Registre des Loyers</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-white text-slate-900 p-6 rounded-2xl shadow-xl text-xs space-y-3">
                  <div className="flex justify-between border-b pb-2 font-black">
                    <span>QUITTANCE DE LOYER</span>
                    <span>AOÛT 2026</span>
                  </div>
                  <p><strong>Bailleur :</strong> SCI Patrimoine Paris</p>
                  <p><strong>Locataire :</strong> Sophie Moreau (T3 Courcelles)</p>
                  <div className="bg-slate-100 p-3 rounded font-semibold text-emerald-900">
                    Total Acquitté : 920.00 € (dont 70 € de charges)
                  </div>
                </div>
              </motion.div>
            )}

            {activeFeatureTab === 'maintenance' && (
              <motion.div
                key="maintenance"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
              >
                <div className="space-y-4">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Suivi des Réparations</span>
                  <h3 className="text-2xl font-bold text-white">Tableau Kanban de Maintenance & Gestion des Artisans</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Ne laissez aucun problème technique s'accumuler. Centralisez les signalements de fuites, pannes de chaudières et devis travaux.
                  </p>
                  <button
                    onClick={() => onEnterApp('maintenance')}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-2 transition-all shadow-md cursor-pointer"
                  >
                    <span>Voir le Kanban de Maintenance</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] bg-rose-500/20 text-rose-400 font-bold px-1.5 py-0.5 rounded">Urgent</span>
                    <p className="font-bold text-white mt-1">Fuite d'eau robinet</p>
                    <p className="text-[10px] text-slate-400">Appart. Marseille</p>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded">Résolu</span>
                    <p className="font-bold text-white mt-1">Entretien Chaudière</p>
                    <p className="text-[10px] text-slate-400">Artisan Plombier Pro</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeFeatureTab === 'taxes' && (
              <motion.div
                key="taxes"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
              >
                <div className="space-y-4">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Optimisation Fiscale</span>
                  <h3 className="text-2xl font-bold text-white">Simulateur de Régimes Imposables (LMNP, Réel, Micro)</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Comparez votre imposition entre le régime Micro-Foncier, le Réel et le statut LMNP avec amortissement de l'immeuble.
                  </p>
                  <button
                    onClick={() => onEnterApp('taxes')}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center space-x-2 transition-all shadow-md cursor-pointer"
                  >
                    <span>Accéder au Rapport Fiscal</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Revenus Locatifs Bruts</span>
                    <span className="font-bold text-white">13 200 € / an</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Impôt Micro-Foncier (30% abattement)</span>
                    <span className="font-bold text-rose-400">2 772 €</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-bold border-t border-slate-800 pt-2">
                    <span>Impôt LMNP Réel Amortissable</span>
                    <span className="text-sm">0 € (Neutre)</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Interactive Yield & Tax Calculator Widget Section */}
      <section id="simulator" className="py-20 bg-slate-900/80 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white flex items-center justify-center space-x-2">
              <Calculator className="w-7 h-7 text-emerald-400" />
              <span>Simulateur de Rentabilité Immobilière Express</span>
            </h2>
            <p className="text-xs text-slate-400">
              Ajustez le prix d'achat et le loyer pour évaluer instantanément vos rendements bruts et nets.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl"
          >
            
            {/* Input Controls */}
            <div className="lg:col-span-2 space-y-6">
              
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-300">Prix d'acquisition (frais inclus)</span>
                  <span className="text-emerald-400">{purchasePrice.toLocaleString('fr-FR')} €</span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="1000000"
                  step="5000"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-300">Loyer Mensuel HC</span>
                  <span className="text-emerald-400">{monthlyRent.toLocaleString('fr-FR')} € / mois</span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="5000"
                  step="50"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-300">Charges Annuelles (Taxe foncière + Copro)</span>
                  <span className="text-slate-400">{annualCharges.toLocaleString('fr-FR')} € / an</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="5000"
                  step="100"
                  value={annualCharges}
                  onChange={(e) => setAnnualCharges(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

            </div>

            {/* Results Card */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 text-center shadow-inner">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Résultat Financier Estimé
              </span>

              <div className="space-y-1">
                <motion.span
                  key={grossYield}
                  initial={{ scale: 1.15, color: '#34d399' }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-4xl font-black text-emerald-400 inline-block"
                >
                  {grossYield} %
                </motion.span>
                <p className="text-xs text-slate-400 font-semibold">Rendement Brut Annuel</p>
              </div>

              <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Rendement Net</span>
                  <span className="font-bold text-white text-sm">{netYield} %</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Gain Fiscal LMNP</span>
                  <span className="font-bold text-emerald-400 text-sm">~{estimatedTaxSavingsLmnp} €</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onEnterApp('taxes')}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                Tester dans l'Application
              </motion.button>
            </div>

          </motion.div>

        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Tarification Claire & Sans Engagements
          </h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Choisissez l'offre adaptée à la taille de votre portefeuille immobilier.
          </p>

          {/* Billing Toggle with Motion Indicator */}
          <div className="flex items-center justify-center space-x-3 pt-4">
            <span className={`text-xs font-bold ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-500'}`}>Mensuel</span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="w-12 h-6 rounded-full bg-slate-800 p-1 border border-slate-700 relative transition-colors cursor-pointer"
            >
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`w-4 h-4 rounded-full bg-emerald-400 ${
                  billingCycle === 'yearly' ? 'ml-6' : 'ml-0'
                }`}
              />
            </button>
            <span className={`text-xs font-bold ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-500'}`}>
              Annuel <span className="text-emerald-400 font-extrabold text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded ml-1">-20%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Starter Plan */}
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ duration: 0.25 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-lg"
          >
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Starter</span>
              <div className="flex items-baseline space-x-1">
                <span className="text-4xl font-black text-white">0 €</span>
                <span className="text-xs text-slate-400">/ mois</span>
              </div>
              <p className="text-xs text-slate-400">Idéal pour démarrer la gestion de votre tout premier bien immobilier.</p>
              
              <ul className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-slate-800">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Jusqu'à 1 bien immobilier</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Quittances de loyer illimitées</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Suivi des encaissements</span>
                </li>
              </ul>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => onEnterApp('dashboard')}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors cursor-pointer"
            >
              Démarrer Gratuitement
            </motion.button>
          </motion.div>

          {/* Pro SCI Plan (Featured) */}
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ duration: 0.25 }}
            className="bg-slate-900 border-2 border-emerald-500 rounded-3xl p-6 space-y-6 flex flex-col justify-between shadow-2xl relative"
          >
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 font-black text-[10px] uppercase px-3 py-1 rounded-full shadow-md">
              Plus Populaire
            </span>

            <div className="space-y-4">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Pro SCI & Multi-Biens</span>
              <div className="flex items-baseline space-x-1">
                <span className="text-4xl font-black text-white">
                  {billingCycle === 'yearly' ? '15 €' : '19 €'}
                </span>
                <span className="text-xs text-slate-400">/ mois</span>
              </div>
              <p className="text-xs text-slate-300">Pour les bailleurs actifs gérant un portefeuille jusqu'à 10 lots.</p>

              <ul className="space-y-2.5 text-xs text-slate-200 pt-4 border-t border-slate-800">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Jusqu'à 10 biens & locataires</span>
                </li>
                <li className="flex items-center space-x-2 font-bold text-emerald-400">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Assistant IA Gemini 3.6 Illimité</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Tableau Kanban des Travaux</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Simulateur Fiscale LMNP / Réel</span>
                </li>
              </ul>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => (onOpenPaymentModal ? onOpenPaymentModal() : onEnterApp('settings'))}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 transition-colors cursor-pointer"
            >
              Essayer le Mode Pro
            </motion.button>
          </motion.div>

          {/* Patrimoine Plan */}
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ duration: 0.25 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-lg"
          >
            <div className="space-y-4">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">Patrimoine / Agence</span>
              <div className="flex items-baseline space-x-1">
                <span className="text-4xl font-black text-white">
                  {billingCycle === 'yearly' ? '39 €' : '49 €'}
                </span>
                <span className="text-xs text-slate-400">/ mois</span>
              </div>
              <p className="text-xs text-slate-400">Pour les grands propriétaires, marchand de biens et gestionnaires d'immeubles.</p>

              <ul className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-slate-800">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  <span>Biens illimités</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  <span>Exports comptables FEC & Excel</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  <span>Accès Multi-Utilisateurs / Associés</span>
                </li>
              </ul>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => (onOpenPaymentModal ? onOpenPaymentModal() : onEnterApp('settings'))}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors cursor-pointer"
            >
              Passer au Plan Patrimoine
            </motion.button>
          </motion.div>

        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-slate-900/60 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white">Approuvé par +1 500 Bailleurs en France</h2>
            <p className="text-xs text-slate-400">Découvrez comment ImmoGestion simplifie la vie des investisseurs au quotidien.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0 }}
              className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4"
            >
              <div className="flex text-amber-400 space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "J'ai 6 appartements sur Lyon en LMNP. L'édition des quittances se fait en un clic et le module IA m'a rédigé un courrier de révision IRL parfait. Je gagne des heures chaque mois."
              </p>
              <div className="pt-2 border-t border-slate-800 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                  AL
                </div>
                <div>
                  <p className="font-bold text-white text-xs">Alexandre L.</p>
                  <p className="text-[10px] text-slate-400">Propriétaire de 6 lots • Lyon</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4"
            >
              <div className="flex text-amber-400 space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "Le suivi de la maintenance par Kanban est génial. Mes locataires m'envoient leurs demandes et je peux suivre le devis de mon artisan directement dans l'outil."
              </p>
              <div className="pt-2 border-t border-slate-800 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500 text-white font-bold flex items-center justify-center text-xs">
                  CB
                </div>
                <div>
                  <p className="font-bold text-white text-xs">Claire B.</p>
                  <p className="text-[10px] text-slate-400">Gérante SCI Familiale • Paris</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4"
            >
              <div className="flex text-amber-400 space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "Le simulateur fiscal LMNP m'a permis de comprendre le bénéfice du régime Réel Amortissable par rapport au Micro-Foncier. L'outil indispensable."
              </p>
              <div className="pt-2 border-t border-slate-800 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                  MD
                </div>
                <div>
                  <p className="font-bold text-white text-xs">Marc D.</p>
                  <p className="text-[10px] text-slate-400">Investisseur Immo • Bordeaux</p>
                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-white">Foire Aux Questions</h2>
          <p className="text-xs text-slate-400">Toutes vos réponses concernant notre plateforme de gestion locative.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-4 text-left font-bold text-xs text-white flex items-center justify-between hover:bg-slate-800/50 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 bg-slate-950/40">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* Call To Action Footer Banner */}
      <section className="py-16 bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Prêt à automatiser la gestion de vos biens immobiliers ?
          </h2>
          <p className="text-slate-300 text-xs max-w-xl mx-auto">
            Rejoignez des centaines de propriétaires et gérez votre portefeuille en toute sérénité dès aujourd'hui.
          </p>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onEnterApp('dashboard')}
            className="px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 transition-colors inline-flex items-center space-x-2 cursor-pointer"
          >
            <span>Démarrer Maintenant (Accès Immédiat)</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 text-slate-400 text-xs py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-white">ImmoGestion AI SaaS</span>
            <span>© 2026. Tous droits réservés.</span>
          </div>

          <div className="flex space-x-6">
            <span className="hover:text-white cursor-pointer">Mentions Légales</span>
            <span className="hover:text-white cursor-pointer">Loi 1989 & Décrets</span>
            <span className="hover:text-white cursor-pointer">Confidentialité</span>
          </div>
        </div>
      </footer>

      {/* Candidate Rental Application Modal with AnimatePresence */}
      <AnimatePresence>
        {selectedPropertyToApply && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPropertyToApply(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative z-10"
            >
              
              <button
                onClick={() => setSelectedPropertyToApply(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {submittedApplication ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Dossier Transmis au Bailleur !</h3>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                    Votre candidature pour <strong>{selectedPropertyToApply.title}</strong> a bien été enregistrée. Le propriétaire prendra contact avec vous rapidement.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                      Candidature Locataire
                    </span>
                    <h3 className="text-xl font-extrabold text-white">{selectedPropertyToApply.title}</h3>
                    <p className="text-xs text-slate-400">
                      Loyer : {selectedPropertyToApply.monthlyRent} €/mois • {selectedPropertyToApply.city}
                    </p>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Nom & Prénom complet *</label>
                      <input
                        type="text"
                        required
                        placeholder="ex: Jean Dupont"
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        className="w-full bg-slate-950 text-white px-3 py-2.5 rounded-xl border border-slate-800 focus:border-emerald-500 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Email *</label>
                        <input
                          type="email"
                          required
                          placeholder="jean@exemple.fr"
                          value={applicantEmail}
                          onChange={(e) => setApplicantEmail(e.target.value)}
                          className="w-full bg-slate-950 text-white px-3 py-2.5 rounded-xl border border-slate-800 focus:border-emerald-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Téléphone</label>
                        <input
                          type="tel"
                          placeholder="06 12 34 56 78"
                          value={applicantPhone}
                          onChange={(e) => setApplicantPhone(e.target.value)}
                          className="w-full bg-slate-950 text-white px-3 py-2.5 rounded-xl border border-slate-800 focus:border-emerald-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Revenus mensuels nets (€)</label>
                        <input
                          type="number"
                          value={applicantIncome}
                          onChange={(e) => setApplicantIncome(Number(e.target.value))}
                          className="w-full bg-slate-950 text-white px-3 py-2.5 rounded-xl border border-slate-800 focus:border-emerald-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Date d'eménagement</label>
                        <input
                          type="date"
                          value={moveInDate}
                          onChange={(e) => setMoveInDate(e.target.value)}
                          className="w-full bg-slate-950 text-white px-3 py-2.5 rounded-xl border border-slate-800 focus:border-emerald-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-1">
                      <input
                        type="checkbox"
                        id="guarantor"
                        checked={hasGuarantor}
                        onChange={(e) => setHasGuarantor(e.target.checked)}
                        className="accent-emerald-500 rounded cursor-pointer"
                      />
                      <label htmlFor="guarantor" className="text-slate-300 text-xs cursor-pointer">
                        J'ai un garant / Visale pour ce dossier
                      </label>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setSelectedPropertyToApply(null)}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center space-x-2 shadow-lg shadow-emerald-500/20 cursor-pointer transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      <span>Envoyer ma Candidature</span>
                    </button>
                  </div>
                </form>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
