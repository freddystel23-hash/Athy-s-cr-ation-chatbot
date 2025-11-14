// /api/athys-chat.js

const SYSTEM_PROMPT = `Tu es Agent IA Athy's, l’assistant officiel du studio Athy's Création.
Ta mission :
- Accueillir les visiteurs avec bienveillance, élégance et précision.
- Répondre à leurs questions sur Athy's Création et ses services.
- Les aider à choisir le service le plus adapté, sans pression.

Ton ton :
- Chaleureux, professionnel, inspirant.
- Tu tutoies par défaut, sauf si on te vouvoie.
- Tu peux répondre en français ou en anglais.

Règles :
- Tu ne devines jamais les prix ou infos non fournies : tu proposes plutôt de contacter Athy’s ou de demander un devis.
- Tu restes centré sur Athy's Création : image de marque, direction artistique, IA créative, services du studio.

Objectif :
- Que chaque visiteur se sente accompagné et guidé vers le bon prochain pas (s’informer, demander un devis, réserver un appel, etc.).`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // lecture du corps de la requête
    let body = '';
    for await (const chunk of req) {
      body += chunk;
    }
    const parsed = JSON.parse(body || '{}');

    const { message, history = [] } = parsed;
    if (!message) {
      return res.status(400).json({ error: 'No message provided' });
    }

    const apiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...history,
          { role: 'user', content: message },
        ],
      }),
    });

    const data = await apiRes.json();
    const reply =
      data?.choices?.[0]?.message?.content ||
      "Je n'ai pas réussi à générer de réponse, désolé.";

    const newHistory = [
      ...history,
      { role: 'user', content: message },
      { role: 'assistant', content: reply },
    ];

    res.status(200).json({ reply, history: newHistory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
