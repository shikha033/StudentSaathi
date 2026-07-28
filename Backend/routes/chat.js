// Backend/routes/chat.js
// Powers the chatbot widget. Uses Google's Gemini API to answer questions,
// and gives Gemini some relevant documents from MongoDB as context first
// (a simple form of "search + AI" — the bot can talk about YOUR data, not
// just generic knowledge).

const express = require('express');
const router = express.Router();
const Document = require('../models/Document');

const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// Pull a handful of documents whose name/category/description overlap with
// whatever the user typed, so Gemini has real StudentSaathi context to answer with.
async function findRelevantDocuments(message) {
    const words = message
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 3); // skip tiny filler words

    if (words.length === 0) return [];

    const regexes = words.map(w => new RegExp(w, 'i'));

    const docs = await Document.find({
        $or: [
            { document_name: { $in: regexes } },
            { category: { $in: regexes } },
            { description: { $in: regexes } }
        ]
    }).select('document_name category description steps').limit(5);

    return docs;
}

// @route   POST /api/chat
// @desc    Send a message to the chatbot and get a reply from Gemini
// @access  Public
// Body: { message: string, history?: [{ role: 'user'|'model', text: string }] }
router.post('/', async (req, res) => {
    try {
        const { message, history = [] } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({ msg: 'message is required' });
        }

        // 👉 YOU NEED TO SET THIS: GEMINI_API_KEY in Backend/.env
        //    Get a free key at https://aistudio.google.com/apikey
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({
                msg: 'Chatbot is not configured yet: GEMINI_API_KEY is missing from the backend .env file.'
            });
        }

        const relevantDocs = await findRelevantDocuments(message);

        const context = relevantDocs.length
            ? relevantDocs.map(d =>
                `- ${d.document_name} (${d.category}): ${d.description}`
              ).join('\n')
            : 'No matching entries were found in the StudentSaathi database for this question.';

        const systemInstruction = {
            role: 'user',
            parts: [{
                text:
`You are the StudentSaathi assistant, a friendly helper for Indian students navigating
documents (Aadhaar, PAN, etc.), certificates, government schemes, internships and
academic resources. Answer clearly and briefly, using simple language.

Here are entries from the StudentSaathi database that might be relevant to the
student's question:
${context}

If the database entries answer the question, use them and mention the document name
so the student can open it for full steps. If they don't cover it, answer from your
own general knowledge about Indian student services, and say so.`
            }]
        };

        // Gemini expects alternating user/model turns
        const contents = [
            systemInstruction,
            ...history.map(turn => ({
                role: turn.role === 'model' ? 'model' : 'user',
                parts: [{ text: turn.text }]
            })),
            { role: 'user', parts: [{ text: message }] }
        ];

        const geminiResponse = await fetch(`${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents })
        });

        const data = await geminiResponse.json();

        if (!geminiResponse.ok) {
            console.error('Gemini API error:', data);
            return res.status(502).json({ msg: data?.error?.message || 'Gemini API request failed' });
        }

        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text
            || "Sorry, I couldn't come up with an answer for that — try rephrasing your question.";

        res.json({
            reply,
            relatedDocuments: relevantDocs.map(d => ({ _id: d._id, title: d.document_name }))
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
