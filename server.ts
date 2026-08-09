import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to initialize Gemini client lazily
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY n\'est pas configurée dans les variables d\'environnement.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 1. Génération d'annonce immobilière
app.post('/api/gemini/generate-description', async (req, res) => {
  try {
    const { title, type, surface, rooms, bedrooms, city, rent, price, DPE, features, tone } = req.body;
    const ai = getGeminiClient();

    const prompt = `Tu es un expert en rédaction d'annonces immobilières haut de gamme en France (style LeBonCoin, SeLoger, BienIci).
Génère une annonce attractive, professionnelle et optimisée SEO pour le bien suivant :
- Titre / Nom : ${title || 'Appartement de charme'}
- Type : ${type || 'Appartement'}
- Surface : ${surface || '55'} m²
- Pièces : ${rooms || '3'} pièces (${bedrooms || '2'} chambres)
- Localisation : ${city || 'Paris'}
- Loyer HC / Prix : ${rent ? `${rent} € / mois` : `${price} €`}
- DPE (Diagnostic Performance Énergétique) : Classé ${DPE || 'C'}
- Équipements / Atouts : ${Array.isArray(features) ? features.join(', ') : (features || 'Balcon, Parquet, Traversant, Ascenseur')}
- Ton souhaité : ${tone || 'Chaleureux, élégant et rassurant'}

Structure la réponse avec :
1. Un titre accrocheur avec émojis.
2. Une description détaillée et immersive mettant en valeur la lumière, la distribution des pièces et le quartier.
3. Une liste à puces synthétique des caractéristiques clés.
4. Une note financière claire (Loyer, charges, dépôt de garantie / Prix et honoraires).
5. Un appel à l'action pour fixer une visite.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Tu es un expert immobilier français. Réponds en français parfait, clair et structuré.',
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Error generating description:', error);
    res.status(500).json({ error: error.message || 'Erreur lors de la génération de l\'annonce.' });
  }
});

// 2. Analyse d'investissement immobilier et calcul de rentabilité
app.post('/api/gemini/analyze-investment', async (req, res) => {
  try {
    const { price, rentMonthly, notaryFees, renovationCost, annualExpenses, propertyTax, type, city } = req.body;
    const ai = getGeminiClient();

    const prompt = `Réalise une analyse d'investissement immobilier complète et un diagnostic financier pour un investisseur français :
Données du bien :
- Prix d'achat net vendeur : ${price} €
- Loyer mensuel prévisionnel : ${rentMonthly} €
- Frais de notaire estimés : ${notaryFees || Math.round(price * 0.08)} €
- Budget travaux prévus : ${renovationCost || 0} €
- Charges de copropriété annuelles : ${annualExpenses || 0} €
- Taxe foncière annuelle : ${propertyTax || 0} €
- Type de bien & Ville : ${type || 'Appartement'} à ${city || 'Paris'}

Merci de fournir :
1. Un calcul précis du Rendement Brut (%) et Rendement Net de charges (%).
2. Un calcul du Cashflow mensuel estimé avec un crédit sur 20 ans à 3,8% d'intérêt.
3. Une analyse des risques financiers (vacance locative, travaux imprévus, impôts).
4. La recommandation du régime fiscal optimal en France (LMNP réel, LMNP micro-BIC, Micro-foncier ou Réel foncier).
5. 3 conseils stratégiques pour maximiser le rendement ou la valorisation du bien.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Tu es un conseiller en gestion de patrimoine et investissement immobilier locatif en France.',
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Error analyzing investment:', error);
    res.status(500).json({ error: error.message || 'Erreur lors de l\'analyse d\'investissement.' });
  }
});

// 3. Rédaction de communications et lettres formelles
app.post('/api/gemini/draft-communication', async (req, res) => {
  try {
    const { docType, tenantName, propertyAddress, rentAmount, date, customNote } = req.body;
    const ai = getGeminiClient();

    const prompt = `Rédige un courrier / message officiel d'un bailleur immobilier à son locataire en France.
Type de document : ${docType}
- Nom du locataire : ${tenantName || 'Mme / M. Dupont'}
- Adresse du bien : ${propertyAddress || '12 Rue de la Paix, 75002 Paris'}
- Montant du loyer : ${rentAmount || '850'} €
- Date : ${date || new Date().toLocaleDateString('fr-FR')}
- Remarques particulières / contexte : ${customNote || 'Rien à signaler'}

Exigences :
- Ton poli, professionnel, conforme au droit de la location en France (Loi du 6 juillet 1989).
- Format prêt à être imprimé ou envoyé par email / courrier recommandé.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Error drafting communication:', error);
    res.status(500).json({ error: error.message || 'Erreur lors de la rédaction du courrier.' });
  }
});

// 4. Chat Assistant Juridique et Gestion Immobilière
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const ai = getGeminiClient();

    const formattedContents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: formattedContents,
      config: {
        systemInstruction: `Tu es ImmoBot AI, l'assistant expert en gestion immobilière locative française intégré à ImmoGestion SaaS.
Tu conseilles les propriétaires bailleurs sur :
- Le droit de la location (Loi de 1989, encadrement des loyers, révision IRL, préavis, dépôt de garantie).
- La fiscalité locative (LMNP, Pinel, Foncier au réel, régimes d'imposition).
- La gestion quotidienne (impayés, travaux à la charge du locataire vs propriétaire, DPE).
Sois concis, structuré avec des listes à puces si nécessaire, et toujours très précis sur le cadre légal français.`,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: error.message || 'Erreur de communication avec l\'assistant IA.' });
  }
});

// Configure Vite or Static server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ImmoGestion SaaS] Serveur démarré sur http://localhost:${PORT}`);
  });
}

startServer();
