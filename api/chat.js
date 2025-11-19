// /api/chat.js

import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

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
    const userMessages = req.body.messages || [];

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...userMessages
      ],
      temperature: 0.7
    });

    const reply = completion.choices[0]?.message?.content || "Je t’écoute.";

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("Erreur API Manager IA :", error);
    return res.status(500).json({
      reply: "Désolé, un problème technique est survenu. Tu peux aussi passer par le formulaire."
    });
  }
}
