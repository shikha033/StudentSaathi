// src/config.js
// Single place that decides what backend URL the whole app talks to.
//
// 👉 Nothing to change in THIS file. Instead, set VITE_API_URL in
//    Frontend/.env (copy .env.example -> .env). Locally it defaults to
//    your backend on port 5000 if you don't set anything.

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
