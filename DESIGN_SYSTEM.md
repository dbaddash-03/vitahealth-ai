# VitaHealth V3 — Biophilic Cyberpunk Design System

## Core visual language

VitaHealth V3 uses a dark, calm health-tech aesthetic that combines scientific precision with organic light. The interface should feel premium and proactive rather than aggressive: deep forest-slate surfaces, luminous health states, and restrained atmospheric gradients.

## Tokens

| Token | Value | Use |
|---|---|---|
| `--vh-bg` | `#0B0E0D` | Primary obsidian canvas |
| `--vh-bg-2` | `#0F1412` | Elevated background / top-level chrome |
| `--vh-surface` | `#161D1A` | Cards, modals, glass surfaces |
| `--vh-surface-2` | `#19211E` | Secondary surface |
| `--vh-surface-3` | `#101613` | Inputs / recessed areas |
| `--vh-border` | `#25302C` | Structural borders |
| `--vh-text` | `#F4F7F5` | Primary text |
| `--vh-muted` | `#8A9A93` | Secondary / helper text |
| `--vh-emerald` | `#00E699` | Success, optimal state, active AI |
| `--vh-amber` | `#FF9F1C` | Warning / reminder state |
| `--vh-teal` | `#00ADB5` | Vitals, analytics, informational state |

## Shape system

- Small controls: 10–14px radius.
- Standard cards: 16–20px radius.
- Hero / command surfaces: 24px radius.
- Pills: 999px radius.

## Typography

- UI / headings: Plus Jakarta Sans with Inter fallback.
- Metrics: JetBrains Mono / SF Mono fallback.
- Numeric health data uses tabular numerals for scanability.
- Uppercase metadata uses increased tracking to create a clinical instrumentation feel.

## Interaction

- Primary hover transitions are 300ms.
- Cards lift subtly on hover and gain restrained emerald edge glow.
- Emerald glow is reserved for positive / active health states so it remains meaningful.
- Amber is intentionally warm and non-alarming for reminders and safety notices.

## Surface treatment

Glass cards use a dark translucent base, a 1px border, soft inner highlights, and a shallow shadow. Ambient radial gradients are used behind chart and hero areas to mimic natural light rather than neon UI chrome.

## Accessibility / product safety

Color should reinforce, not replace, text labels and state icons. Health recommendations remain informational and should not be presented as a diagnosis or substitute for professional care.
