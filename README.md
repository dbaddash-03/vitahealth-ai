# VitaHealth AI — V3

A premium React/Vite prototype for a personal health operating system, restyled as a **Biophilic Cyberpunk** health-tech interface.

## Included in V3
- Biophilic Cyberpunk design system: obsidian / forest-slate canvas, glassmorphic surfaces, hyper-emerald success, sunset amber alerts, and bio-teal analytics.
- Extraordinary responsive dashboard UI with bento-style cards, ambient radial lighting, 300ms interactions and luminous states.
- Health Vault for medical documents and privacy controls.
- Medication timeline with adherence actions.
- Nutrition tracking, protein quick-adds and meal planning.
- Movement / yoga sessions with personalization signals.
- AI Coach chat experience with quick prompts.
- Local personalization engine for protein, hydration, adherence and movement nudges.
- Optional external AI backend integration via `VITE_AI_ENDPOINT`.
- Precision numeric styling using a monospaced metric face and tabular numerals.
- Progress is persisted locally in the browser with `localStorage` for the demo.

## Run

```bash
npm install
npm run dev
```

## Optional AI backend
Set `VITE_AI_ENDPOINT` to a server endpoint that accepts:

```json
{
  "message": "...",
  "context": {
    "protein": 129,
    "water": 1.8,
    "meds": []
  }
}
```

and returns:

```json
{ "reply": "..." }
```

Keep any model API keys on the server. Do not put secrets into the browser bundle.

## Production architecture notes
For a real healthcare deployment, add authentication, encrypted object storage, structured health data models, audit logs, access control, consent management, secure server-side AI orchestration, and clinical safety review. Uploaded health records should not be sent to third-party models without explicit user consent and a compliant data-processing setup.
