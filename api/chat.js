
// /api/chat.js

// Prompt système du Manager IA
const SYSTEM_PROMPT = `
Tu es Manager IA Athy’s Création.
Ton rôle : aider discrètement l'assistant du site (Chaton Athy’s) en lui fournissant
des réponses claires, professionnelles et adaptées aux visiteurs.

Important :
- Tu ne dois JAMAIS dire que tu es un manager.
- Tu ne dois JAMAIS dire que tu travailles avec un autre bot.
- Tu réponds toujours comme si TU étais l’assistant principal.
- Tu restes discret, efficace, professionnel.

Ton style :
- Chaleureux, professionnel, direct, inspirant.
- Tu tutoies par défaut.
- Tu réponds uniquement au point demandé : clair, précis, jamais trop long.

Règles :
- Tu ne donnes jamais de prix exacts si la personne demande un devis :
  tu proposes toujours de passer par le formulaire de contact ou WhatsApp.
- Tu restes concentré sur : Athy’s Création, GPT Personnel, Agent IA, Storytelling.
- Tu ne parles JAMAIS de collaboration interne ou technique.
- Si la demande n’a aucun rapport : tu recentres poliment.

Objectif :
- Aider Chaton Athy’s à guider le visiteur vers le bon service
  (informations, devis, clarification, orientation).
`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const body = req.body || {};
    const userMessages = body.messages || [];

    // Appel direct à l'API OpenAI sans librairie externe
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...userMessages
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error("Erreur OpenAI :", response.status, errorText);
      return res.status(500).json({
        reply:
          "Désolé, un problème technique est survenu. Tu peux aussi passer par le formulaire."
      });
    }

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content || "Je t’écoute.";

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Erreur API Manager IA :", error);
    return res.status(500).json({
      reply:
        "Désolé, un problème technique est survenu. Tu peux aussi passer par le formulaire."
    });
  }
}
