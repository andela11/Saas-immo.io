import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  TrendingUp,
  Mail,
  MessageSquare,
  Copy,
  Check,
  Send,
  Loader2,
  Building2,
  AlertCircle
} from 'lucide-react';
import { Property, Tenant, LandlordProfile } from '../types';

interface AiAssistantViewProps {
  properties: Property[];
  tenants: Tenant[];
  profile: LandlordProfile;
  selectedPropertyForAi?: Property | null;
  onUpdateProperty?: (updatedProp: Property) => void;
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({
  properties,
  tenants,
  profile,
  selectedPropertyForAi,
  onUpdateProperty,
}) => {
  const [activeTool, setActiveTool] = useState<'listing' | 'investment' | 'draft' | 'chat'>('listing');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedToProp, setSavedToProp] = useState(false);
  const [resultText, setResultText] = useState('');

  // 1. Listing Generator State
  const initialProp = selectedPropertyForAi || properties[0];
  const [selectedPropId, setSelectedPropId] = useState(initialProp?.id || '');
  const [listingTone, setListingTone] = useState('Chaleureux, élégant et rassurant');
  const [customFeatures, setCustomFeatures] = useState('Balcon, Parquet, Traversant, Ascenseur, Cave');

  // 2. Investment Analyzer State
  const [price, setPrice] = useState(280000);
  const [rentMonthly, setRentMonthly] = useState(1150);
  const [renovationCost, setRenovationCost] = useState(15000);
  const [annualExpenses, setAnnualExpenses] = useState(1200);

  // 3. Draft Communications State
  const [docType, setDocType] = useState('Relance pour impayé de loyer');
  const [draftTenantName, setDraftTenantName] = useState('Sophie Moreau');
  const [draftPropertyAddress, setDraftPropertyAddress] = useState('24 Rue de Courcelles, 75008 Paris');
  const [draftCustomNote, setDraftCustomNote] = useState('');

  // 4. Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: 'Bonjour ! Je suis ImmoBot AI, votre assistant expert en gestion immobilière locative et fiscalité française. Comment puis-je vous aider aujourd\'hui (LMNP, baux, révision IRL, litiges locataires) ?',
    },
  ]);

  // Handle Listing Generation
  const handleGenerateListing = async () => {
    setLoading(true);
    setResultText('');
    const prop = properties.find((p) => p.id === selectedPropId) || initialProp;

    try {
      const res = await fetch('/api/gemini/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: prop?.title,
          type: prop?.type,
          surface: prop?.surface,
          rooms: prop?.rooms,
          bedrooms: prop?.bedrooms,
          city: prop?.city,
          rent: prop?.monthlyRent,
          price: prop?.purchasePrice,
          DPE: prop?.dpe,
          features: customFeatures.split(',').map((s) => s.trim()),
          tone: listingTone,
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResultText(data.text);
    } catch (err: any) {
      setResultText(`Erreur : ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle Investment Analysis
  const handleAnalyzeInvestment = async () => {
    setLoading(true);
    setResultText('');

    try {
      const res = await fetch('/api/gemini/analyze-investment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price,
          rentMonthly,
          notaryFees: Math.round(price * 0.08),
          renovationCost,
          annualExpenses,
          propertyTax: 950,
          type: 'Appartement',
          city: 'Paris',
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResultText(data.text);
    } catch (err: any) {
      setResultText(`Erreur : ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle Draft Communications
  const handleDraftCommunication = async () => {
    setLoading(true);
    setResultText('');

    try {
      const res = await fetch('/api/gemini/draft-communication', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docType,
          tenantName: draftTenantName,
          propertyAddress: draftPropertyAddress,
          rentAmount: 850,
          date: new Date().toLocaleDateString('fr-FR'),
          customNote: draftCustomNote,
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResultText(data.text);
    } catch (err: any) {
      setResultText(`Erreur : ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle Chat Submit
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || loading) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    const newMessages = [...chatMessages, { role: 'user' as const, content: userMessage }];
    setChatMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setChatMessages([...newMessages, { role: 'assistant', content: data.text }]);
    } catch (err: any) {
      setChatMessages([...newMessages, { role: 'assistant', content: `Erreur : ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 border border-purple-900/50 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-500/30">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Assistant IA Immobilier Gemini</h1>
            <p className="text-xs text-purple-200/80">
              Génération d'annonces LeBonCoin/SeLoger, calculs de rendement, rédaction de baux & conseil juridique.
            </p>
          </div>
        </div>

        {/* Navigation Tabs for Tools */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-purple-900/40">
          <button
            onClick={() => { setActiveTool('listing'); setResultText(''); }}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTool === 'listing'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Rédacteur d'Annonces</span>
          </button>

          <button
            onClick={() => { setActiveTool('investment'); setResultText(''); }}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTool === 'investment'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Analyseur d'Investissement</span>
          </button>

          <button
            onClick={() => { setActiveTool('draft'); setResultText(''); }}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTool === 'draft'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Courriers & Relances</span>
          </button>

          <button
            onClick={() => { setActiveTool('chat'); setResultText(''); }}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTool === 'chat'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat Conseil Juridique</span>
          </button>
        </div>
      </div>

      {/* Main Content Grid (Tool Controls Left + Result Output Right) */}
      {activeTool !== 'chat' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Controls Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
            
            {/* TOOL 1: Listing Generator */}
            {activeTool === 'listing' && (
              <div className="space-y-4">
                <h3 className="font-bold text-white text-base flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-purple-400" />
                  <span>Générer une Annonce Immobilière</span>
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Sélectionner un bien du portefeuille</label>
                  <select
                    value={selectedPropId}
                    onChange={(e) => setSelectedPropId(e.target.value)}
                    className="w-full bg-slate-800 text-white text-xs px-3 py-2.5 rounded-lg border border-slate-700"
                  >
                    {properties.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.city}) - {p.monthlyRent} €/mois
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Ton & Style de rédaction</label>
                  <select
                    value={listingTone}
                    onChange={(e) => setListingTone(e.target.value)}
                    className="w-full bg-slate-800 text-white text-xs px-3 py-2.5 rounded-lg border border-slate-700"
                  >
                    <option value="Chaleureux, élégant et rassurant">Chaleureux, élégant & rassurant (Classique)</option>
                    <option value="Haut de gamme, prestige et coup de coeur">Haut de gamme / Coup de cœur</option>
                    <option value="Synthétique, direct et factuel">Synthétique & Factuel (Investisseur)</option>
                    <option value="Jeune, dynamique et moderne">Jeune & Dynamique (Colocation / Étudiant)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Points Forts & Équipements</label>
                  <input
                    type="text"
                    value={customFeatures}
                    onChange={(e) => setCustomFeatures(e.target.value)}
                    className="w-full bg-slate-800 text-white text-xs px-3 py-2.5 rounded-lg border border-slate-700"
                    placeholder="Balcon, Parquet, Traversant, Ascenseur..."
                  />
                </div>

                <button
                  onClick={handleGenerateListing}
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
                  <span>{loading ? 'Génération par Gemini en cours...' : 'Générer l\'Annonce Immobilère'}</span>
                </button>
              </div>
            )}

            {/* TOOL 2: Investment Analyzer */}
            {activeTool === 'investment' && (
              <div className="space-y-4">
                <h3 className="font-bold text-white text-base flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <span>Analyse de Rentabilité & Fiscalité IA</span>
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Prix Achat (€)</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full bg-slate-800 text-white text-xs px-3 py-2 rounded-lg border border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Loyer Mensuel (€)</label>
                    <input
                      type="number"
                      value={rentMonthly}
                      onChange={(e) => setRentMonthly(Number(e.target.value))}
                      className="w-full bg-slate-800 text-white text-xs px-3 py-2 rounded-lg border border-slate-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Travaux Prévisibles (€)</label>
                    <input
                      type="number"
                      value={renovationCost}
                      onChange={(e) => setRenovationCost(Number(e.target.value))}
                      className="w-full bg-slate-800 text-white text-xs px-3 py-2 rounded-lg border border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Charges Annuelles (€)</label>
                    <input
                      type="number"
                      value={annualExpenses}
                      onChange={(e) => setAnnualExpenses(Number(e.target.value))}
                      className="w-full bg-slate-800 text-white text-xs px-3 py-2 rounded-lg border border-slate-700"
                    />
                  </div>
                </div>

                <button
                  onClick={handleAnalyzeInvestment}
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
                  <span>Lancer le Diagnostic Financial IA</span>
                </button>
              </div>
            )}

            {/* TOOL 3: Draft Communications */}
            {activeTool === 'draft' && (
              <div className="space-y-4">
                <h3 className="font-bold text-white text-base flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <span>Rédacteur de Courriers Officiels</span>
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Type de Document</label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="w-full bg-slate-800 text-white text-xs px-3 py-2.5 rounded-lg border border-slate-700"
                  >
                    <option value="Relance pour impayé de loyer">Mise en demeure / Relance pour loyer en retard</option>
                    <option value="Avis de révision annuelle du loyer selon IRL">Avis de révision annuelle de loyer (Indice IRL)</option>
                    <option value="Accusé de réception de congé / préavis locataire">Accusé de réception de congé / préavis</option>
                    <option value="Attestation de loyer pour la CAF">Attestation de loyer pour organisme (CAF / Visale)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nom du Locataire</label>
                  <input
                    type="text"
                    value={draftTenantName}
                    onChange={(e) => setDraftTenantName(e.target.value)}
                    className="w-full bg-slate-800 text-white text-xs px-3 py-2.5 rounded-lg border border-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Note particulière / Contexte</label>
                  <textarea
                    rows={2}
                    value={draftCustomNote}
                    onChange={(e) => setDraftCustomNote(e.target.value)}
                    placeholder="ex: Rappeler la date limite de paiement au 15 du mois..."
                    className="w-full bg-slate-800 text-white text-xs p-2.5 rounded-lg border border-slate-700"
                  />
                </div>

                <button
                  onClick={handleDraftCommunication}
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
                  <span>Rédiger la Lettre Officielle</span>
                </button>
              </div>
            )}

          </div>

          {/* Results Output Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-lg min-h-[450px]">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Résultat Généré par Gemini</span>
                {resultText && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copié !' : 'Copier le Texte'}</span>
                  </button>
                )}
              </div>

              {loading ? (
                <div className="py-20 text-center space-y-3 text-slate-400">
                  <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
                  <p className="text-xs font-medium">L'intelligence artificielle Gemini analyse votre demande...</p>
                </div>
              ) : resultText ? (
                <div className="space-y-4">
                  <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap bg-slate-950/60 p-4 rounded-xl border border-slate-800 max-h-[350px] overflow-y-auto font-sans selection:bg-purple-500">
                    {resultText}
                  </div>

                  {/* Actions for generated listing */}
                  <div className="pt-2 border-t border-slate-800 space-y-2">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Que faire de votre résultat ?</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        onClick={handleCopy}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 border border-slate-700 transition-all"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-purple-400" />}
                        <span>{copied ? 'Copié !' : 'Copier'}</span>
                      </button>

                      {activeTool === 'listing' && onUpdateProperty && (
                        <button
                          onClick={() => {
                            const prop = properties.find((p) => p.id === selectedPropId) || initialProp;
                            if (prop) {
                              onUpdateProperty({ ...prop, description: resultText });
                              setSavedToProp(true);
                              setTimeout(() => setSavedToProp(false), 3000);
                            }
                          }}
                          className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md"
                        >
                          {savedToProp ? <Check className="w-3.5 h-3.5" /> : <Building2 className="w-3.5 h-3.5" />}
                          <span>{savedToProp ? 'Bien Mis à Jour !' : 'Attacher au Bien'}</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          const element = document.createElement('a');
                          const file = new Blob([resultText], { type: 'text/plain' });
                          element.href = URL.createObjectURL(file);
                          element.download = `Annonce-Immobilier-${new Date().toISOString().slice(0,10)}.txt`;
                          document.body.appendChild(element);
                          element.click();
                          document.body.removeChild(element);
                        }}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center space-x-1.5 border border-slate-700 transition-all"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-400" />
                        <span>Télécharger .TXT</span>
                      </button>
                    </div>

                    {savedToProp && (
                      <p className="text-[11px] font-semibold text-emerald-400 text-center animate-pulse pt-1">
                        ✓ L'annonce a été enregistrée sur la fiche du bien et sera visible sur la vitrine publique !
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-20 text-center text-slate-500 text-xs space-y-2">
                  <Sparkles className="w-8 h-8 text-slate-600 mx-auto opacity-50" />
                  <p>Remplissez les champs à gauche et cliquez sur le bouton pour générer du contenu avec l'IA.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      ) : (
        /* TOOL 4: Interactive Chat Advisor */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col h-[520px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-purple-400" />
              <h3 className="font-bold text-white text-base">Conseiller Juridique & Fiscal ImmoBot AI</h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
              Gemini 3.6 Flash
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 text-xs">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-purple-600 text-white font-medium rounded-br-none shadow-md'
                      : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none shadow-sm whitespace-pre-wrap'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 p-3 rounded-2xl text-slate-400 text-xs flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                  <span>ImmoBot AI rédige sa réponse...</span>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSendChatMessage} className="flex gap-2 pt-3 border-t border-slate-800">
            <input
              type="text"
              placeholder="Posez une question sur les baux, la loi 1989, la révision IRL, LMNP..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 bg-slate-800 text-slate-100 text-xs px-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              disabled={loading || !chatInput.trim()}
              className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center space-x-1.5 transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Envoyer</span>
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
