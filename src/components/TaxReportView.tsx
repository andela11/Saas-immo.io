import React, { useState } from 'react';
import {
  Calculator,
  TrendingUp,
  ShieldCheck,
  FileSpreadsheet,
  Info,
  Download,
  Percent,
  Coins,
  Building2,
  Receipt,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Sliders
} from 'lucide-react';
import { Property, FinancialTransaction } from '../types';

interface TaxReportViewProps {
  properties: Property[];
  transactions: FinancialTransaction[];
}

export const TaxReportView: React.FC<TaxReportViewProps> = ({ properties, transactions }) => {
  // Selected Regime
  const [regime, setRegime] = useState<'MICRO' | 'REEL' | 'LMNP_MICRO' | 'LMNP_REEL'>('LMNP_REEL');

  // User Tax Profile Settings
  const [tmiRate, setTmiRate] = useState<number>(30); // 0, 11, 30, 41, 45
  const socialContributionsRate = 17.2; // PS in France
  const totalTaxMultiplier = (tmiRate + socialContributionsRate) / 100;

  // Real-time calculated amounts from props
  const propAnnualRent = properties.reduce((acc, p) => acc + (p.monthlyRent * 12), 0);
  const realExpensesFromTx = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((acc, t) => acc + t.amount, 0);

  // Manual / Custom Simulator Overrides
  const [customGrossRent, setCustomGrossRent] = useState<number>(propAnnualRent || 14400);
  const [customWorks, setCustomWorks] = useState<number>(1200);
  const [customPropertyTax, setCustomPropertyTax] = useState<number>(950);
  const [customLoanInterest, setCustomLoanInterest] = useState<number>(1800);
  const [customInsuranceSyndic, setCustomInsuranceSyndic] = useState<number>(650);
  const [customBuildingValue, setCustomBuildingValue] = useState<number>(
    properties.reduce((acc, p) => acc + (p.purchasePrice || 180000), 0) || 200000
  );

  // Calculated Total Deductible Real Expenses
  const totalRealDeductibleExpenses = customWorks + customPropertyTax + customLoanInterest + customInsuranceSyndic + (realExpensesFromTx > 0 ? realExpensesFromTx : 0);

  // Amortization (LMNP Réel) - approx 80% building value amortized over 30 yrs (2.67%/yr) + furniture (10%/yr)
  const annualBuildingAmortization = Math.round((customBuildingValue * 0.85) * 0.03); // ~3%/year
  const annualFurnitureAmortization = Math.round(10000 * 0.15); // ~1500€/year
  const totalAmortization = annualBuildingAmortization + annualFurnitureAmortization;

  // 1. Micro-Foncier Calculation
  const microFoncierTaxable = customGrossRent > 15000 ? 0 : customGrossRent * 0.70; // 30% abatement
  const microFoncierTax = Math.round(microFoncierTaxable * totalTaxMultiplier);

  // 2. Réel Foncier Calculation
  const reelFoncierMargin = customGrossRent - totalRealDeductibleExpenses;
  const reelFoncierTaxable = Math.max(0, reelFoncierMargin);
  const reelFoncierTax = Math.round(reelFoncierTaxable * totalTaxMultiplier);
  const deficitFoncier = reelFoncierMargin < 0 ? Math.abs(reelFoncierMargin) : 0;

  // 3. LMNP Micro-BIC Calculation
  const lmnpMicroTaxable = customGrossRent > 77700 ? 0 : customGrossRent * 0.50; // 50% abatement
  const lmnpMicroTax = Math.round(lmnpMicroTaxable * totalTaxMultiplier);

  // 4. LMNP Réel Calculation
  const lmnpReelMargin = customGrossRent - totalRealDeductibleExpenses - totalAmortization;
  const lmnpReelTaxable = Math.max(0, lmnpReelMargin);
  const lmnpReelTax = Math.round(lmnpReelTaxable * totalTaxMultiplier);

  // Current selected active tax calculation
  let activeTaxable = 0;
  let activeTax = 0;
  let activeNetIncome = 0;

  if (regime === 'MICRO') {
    activeTaxable = microFoncierTaxable;
    activeTax = microFoncierTax;
  } else if (regime === 'REEL') {
    activeTaxable = reelFoncierTaxable;
    activeTax = reelFoncierTax;
  } else if (regime === 'LMNP_MICRO') {
    activeTaxable = lmnpMicroTaxable;
    activeTax = lmnpMicroTax;
  } else {
    activeTaxable = lmnpReelTaxable;
    activeTax = lmnpReelTax;
  }

  activeNetIncome = customGrossRent - totalRealDeductibleExpenses - activeTax;

  // Find optimal regime
  const options = [
    { name: 'Micro-Foncier', tax: microFoncierTax, code: 'MICRO' },
    { name: 'Réel Foncier (2044)', tax: reelFoncierTax, code: 'REEL' },
    { name: 'LMNP Micro-BIC', tax: lmnpMicroTax, code: 'LMNP_MICRO' },
    { name: 'LMNP Réel Amortissable', tax: lmnpReelTax, code: 'LMNP_REEL' }
  ];
  const lowestTaxOption = [...options].sort((a, b) => a.tax - b.tax)[0];
  const maxTaxOption = [...options].sort((a, b) => b.tax - a.tax)[0];
  const maxSavingsPossible = maxTaxOption.tax - lowestTaxOption.tax;

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-2">
            <Calculator className="w-4 h-4" />
            <span>Moteur Fiscal Français 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Calculateur d'Imposition & Simulation Fiscale
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Évaluez précisément vos impôts sur les revenus locatifs. Comparez les 4 régimes fiscaux français (Micro-Foncier, Réel 2044, LMNP Micro-BIC, LMNP Réel Amortissable) et maximisez vos gains nets.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all shadow-md shrink-0"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>Imprimer Récapitulatif PDF</span>
        </button>
      </div>

      {/* Main Interactive Calculator Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Revenue & Expense Parameters */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="font-bold text-white text-base flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-emerald-400" />
              <span>Paramètres Fiscaux</span>
            </h2>
            <span className="text-[10px] text-slate-500 font-mono">Modifiable</span>
          </div>

          {/* TMI Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">
              Tranche Marginale d'Imposition (TMI IR)
            </label>
            <div className="grid grid-cols-5 gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-center">
              {[0, 11, 30, 41, 45].map((rate) => (
                <button
                  key={rate}
                  onClick={() => setTmiRate(rate)}
                  className={`py-2 rounded-lg transition-all ${
                    tmiRate === rate
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {rate}%
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400">
              + 17,2% Prélèvements Sociaux = Taux d'imposition global sur bénéfice : <strong className="text-emerald-400">{(tmiRate + socialContributionsRate).toFixed(1)}%</strong>
            </p>
          </div>

          {/* Revenue Input */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="block text-xs font-bold text-slate-300 flex justify-between">
              <span>Loyers Bruts Annuels Totaux</span>
              <span className="text-emerald-400">{customGrossRent.toLocaleString('fr-FR')} €</span>
            </label>
            <input
              type="number"
              value={customGrossRent}
              onChange={(e) => setCustomGrossRent(Number(e.target.value))}
              className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-emerald-500 text-xs font-bold"
            />
          </div>

          {/* Deductible Expenses Breakdown */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <span className="text-xs font-bold text-slate-300 block">Dépenses & Charges Réelles Déductibles</span>
            
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Travaux & Entretien</span>
                <span>{customWorks} €</span>
              </div>
              <input
                type="number"
                value={customWorks}
                onChange={(e) => setCustomWorks(Number(e.target.value))}
                className="w-full bg-slate-950 text-white px-3 py-1.5 rounded-lg border border-slate-800 text-xs"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Taxe Foncière (hors TEOM)</span>
                <span>{customPropertyTax} €</span>
              </div>
              <input
                type="number"
                value={customPropertyTax}
                onChange={(e) => setCustomPropertyTax(Number(e.target.value))}
                className="w-full bg-slate-950 text-white px-3 py-1.5 rounded-lg border border-slate-800 text-xs"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Intérêts d'Emprunt & Frais Dossier</span>
                <span>{customLoanInterest} €</span>
              </div>
              <input
                type="number"
                value={customLoanInterest}
                onChange={(e) => setCustomLoanInterest(Number(e.target.value))}
                className="w-full bg-slate-950 text-white px-3 py-1.5 rounded-lg border border-slate-800 text-xs"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Assurances PNO/GLI & Frais Syndic</span>
                <span>{customInsuranceSyndic} €</span>
              </div>
              <input
                type="number"
                value={customInsuranceSyndic}
                onChange={(e) => setCustomInsuranceSyndic(Number(e.target.value))}
                className="w-full bg-slate-950 text-white px-3 py-1.5 rounded-lg border border-slate-800 text-xs"
              />
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-xs font-bold text-slate-200">
              <span>Total Charges Réelles :</span>
              <span className="text-amber-400">{totalRealDeductibleExpenses.toLocaleString('fr-FR')} €</span>
            </div>
          </div>

          {/* Property Valuation for Amortization (LMNP) */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="block text-xs font-bold text-slate-300">
              Valeur des Biens Immobilisés (Base Amortissement LMNP)
            </label>
            <input
              type="number"
              value={customBuildingValue}
              onChange={(e) => setCustomBuildingValue(Number(e.target.value))}
              className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-emerald-500 text-xs font-bold"
            />
            <p className="text-[10px] text-slate-400 leading-tight">
              Amortissement annuel estimé (bâtiment + mobilier) : <strong className="text-emerald-400">{totalAmortization.toLocaleString('fr-FR')} € / an</strong>
            </p>
          </div>

        </div>

        {/* Right Column: Comparative Side-by-Side Analysis */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Optimal Recommendation Banner */}
          <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border border-emerald-500/40 p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950 px-2.5 py-0.5 rounded-full">
                Recommandation Fiscale Optimale
              </span>
              <h3 className="text-xl font-extrabold text-white">
                Régime recommandé : <span className="text-emerald-400">{lowestTaxOption.name}</span>
              </h3>
              <p className="text-xs text-slate-300">
                Impôt estimé : <strong className="text-white">{lowestTaxOption.tax.toLocaleString('fr-FR')} €</strong> par an. Vous économisez jusqu'à <strong className="text-emerald-400">{maxSavingsPossible.toLocaleString('fr-FR')} € / an</strong> par rapport au régime le moins favorable.
              </p>
            </div>

            <button
              onClick={() => setRegime(lowestTaxOption.code as any)}
              className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 shrink-0 transition-all flex items-center space-x-2"
            >
              <span>Appliquer ce Régime</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 4 Regime Cards Comparison Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* 1. Micro-Foncier */}
            <div
              onClick={() => setRegime('MICRO')}
              className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-3 relative overflow-hidden ${
                regime === 'MICRO'
                  ? 'bg-slate-900 border-2 border-emerald-500 shadow-xl'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Location Nue</span>
                  <h4 className="font-extrabold text-white text-base">Micro-Foncier</h4>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">Abattement 30%</span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Assiette Imposable :</span>
                  <span className="font-bold text-white">{microFoncierTaxable.toLocaleString('fr-FR')} €</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Impôt Estimé :</span>
                  <span className="font-bold text-rose-400">{microFoncierTax.toLocaleString('fr-FR')} €</span>
                </div>
                <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800">
                  <span>Revenu Net Après Impôt :</span>
                  <span className="font-black text-emerald-400">{(customGrossRent - totalRealDeductibleExpenses - microFoncierTax).toLocaleString('fr-FR')} €</span>
                </div>
              </div>
            </div>

            {/* 2. Réel Foncier */}
            <div
              onClick={() => setRegime('REEL')}
              className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-3 relative overflow-hidden ${
                regime === 'REEL'
                  ? 'bg-slate-900 border-2 border-emerald-500 shadow-xl'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Location Nue (Formulaire 2044)</span>
                  <h4 className="font-extrabold text-white text-base">Réel Foncier</h4>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">Déduction Réelle</span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Assiette Imposable :</span>
                  <span className="font-bold text-white">{reelFoncierTaxable.toLocaleString('fr-FR')} €</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Impôt Estimé :</span>
                  <span className="font-bold text-rose-400">{reelFoncierTax.toLocaleString('fr-FR')} €</span>
                </div>
                <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800">
                  <span>Revenu Net Après Impôt :</span>
                  <span className="font-black text-emerald-400">{(customGrossRent - totalRealDeductibleExpenses - reelFoncierTax).toLocaleString('fr-FR')} €</span>
                </div>
              </div>
              {deficitFoncier > 0 && (
                <div className="text-[10px] text-amber-400 font-bold bg-amber-500/10 p-1.5 rounded text-center">
                  Déficit Foncier de {deficitFoncier.toLocaleString('fr-FR')} € (déductible du revenu global !)
                </div>
              )}
            </div>

            {/* 3. LMNP Micro-BIC */}
            <div
              onClick={() => setRegime('LMNP_MICRO')}
              className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-3 relative overflow-hidden ${
                regime === 'LMNP_MICRO'
                  ? 'bg-slate-900 border-2 border-emerald-500 shadow-xl'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Meublé (Formulaire 2042 C PRO)</span>
                  <h4 className="font-extrabold text-white text-base">LMNP Micro-BIC</h4>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400">Abattement 50%</span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Assiette Imposable :</span>
                  <span className="font-bold text-white">{lmnpMicroTaxable.toLocaleString('fr-FR')} €</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Impôt Estimé :</span>
                  <span className="font-bold text-rose-400">{lmnpMicroTax.toLocaleString('fr-FR')} €</span>
                </div>
                <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800">
                  <span>Revenu Net Après Impôt :</span>
                  <span className="font-black text-emerald-400">{(customGrossRent - totalRealDeductibleExpenses - lmnpMicroTax).toLocaleString('fr-FR')} €</span>
                </div>
              </div>
            </div>

            {/* 4. LMNP Réel Amortissable */}
            <div
              onClick={() => setRegime('LMNP_REEL')}
              className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-3 relative overflow-hidden ${
                regime === 'LMNP_REEL'
                  ? 'bg-slate-900 border-2 border-emerald-500 shadow-xl ring-2 ring-emerald-500/20'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-extrabold text-emerald-400 uppercase block">Meublé • N°1 Optimisation</span>
                  <h4 className="font-extrabold text-emerald-400 text-base">LMNP Réel Amortissable</h4>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500 text-slate-950">
                  Neutralisation Impôt
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Assiette Imposable :</span>
                  <span className="font-bold text-white">{lmnpReelTaxable.toLocaleString('fr-FR')} €</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Impôt Estimé :</span>
                  <span className="font-bold text-emerald-400">{lmnpReelTax.toLocaleString('fr-FR')} €</span>
                </div>
                <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800">
                  <span>Revenu Net Après Impôt :</span>
                  <span className="font-black text-emerald-400">{(customGrossRent - totalRealDeductibleExpenses - lmnpReelTax).toLocaleString('fr-FR')} €</span>
                </div>
              </div>
            </div>

          </div>

          {/* Active Selected Summary Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-white text-base border-b border-slate-800 pb-3 flex items-center justify-between">
              <span>Synthèse Financière - Régime Sélectionné : <span className="text-emerald-400 uppercase">{regime.replace('_', ' ')}</span></span>
              <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full font-mono">TMI {tmiRate}% + PS 17,2%</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Revenus Bruts</span>
                <span className="text-lg font-black text-white">{customGrossRent.toLocaleString('fr-FR')} €</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Charges Réelles</span>
                <span className="text-lg font-black text-amber-400">{totalRealDeductibleExpenses.toLocaleString('fr-FR')} €</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Impôt Total Dû</span>
                <span className="text-lg font-black text-rose-400">{activeTax.toLocaleString('fr-FR')} €</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-500/30">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">Bénéfice Net Reçu</span>
                <span className="text-lg font-black text-emerald-400">{activeNetIncome.toLocaleString('fr-FR')} €</span>
              </div>
            </div>

            {/* Declaration Form Mapping Box */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-slate-200 flex items-center space-x-1.5">
                <Receipt className="w-4 h-4 text-purple-400" />
                <span>Cases à compléter pour votre déclaration de revenus :</span>
              </span>

              {regime === 'MICRO' && (
                <p className="text-slate-300">
                  Déclaration <strong>2042</strong> : Renseignez vos loyers bruts ({customGrossRent} €) en case <strong className="text-emerald-400">4BE</strong>. L'administration appliquera automatiquement l'abattement de 30%.
                </p>
              )}
              {regime === 'REEL' && (
                <p className="text-slate-300">
                  Déclaration spéciale <strong>2044</strong> : Reportez le bénéfice net ou déficit en case <strong className="text-emerald-400">4BA</strong> de la déclaration 2042.
                </p>
              )}
              {regime === 'LMNP_MICRO' && (
                <p className="text-slate-300">
                  Déclaration <strong>2042 C PRO</strong> : Renseignez vos recettes brutes ({customGrossRent} €) en case <strong className="text-emerald-400">5ND</strong>. Abattement forfaitaire de 50% appliqué par le fisc.
                </p>
              )}
              {regime === 'LMNP_REEL' && (
                <p className="text-slate-300">
                  Déclaration <strong>2031 / 2033 (LMNP Réel)</strong> : Déclarer le résultat comptable après amortissements. Reportez le résultat net en case <strong className="text-emerald-400">5NA / 5NK</strong>.
                </p>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
