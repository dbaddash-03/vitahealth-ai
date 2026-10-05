const endpoint = import.meta.env.VITE_AI_ENDPOINT;

export function buildPersonalPlan({ protein, water, meds }) {
  const remainingProtein = Math.max(0, 150 - protein);
  const missed = meds.filter(m => m.status !== 'taken').length;
  const headline = remainingProtein === 0
    ? 'You’ve already cleared your protein target.'
    : `You’re ${remainingProtein}g away from your protein target.`;
  const copy = remainingProtein === 0
    ? 'Keep the evening meal balanced and avoid chasing a number once the day is comfortably covered.'
    : `A ${Math.min(remainingProtein, 30)}g protein snack in the late afternoon is a simple way to close the gap without making dinner heavier.`;
  const nudge = water < 2 ? 'A glass of water now would move hydration closer to target before your next meal.' : missed ? `One scheduled dose is still ahead. A gentle reminder later will keep your routine on track.` : 'Your core habits are steady today. Keep the evening simple and consistent.';
  const steps = [
    remainingProtein ? `Add ~${Math.min(remainingProtein, 30)}g protein before dinner` : 'Keep dinner balanced and maintain your rhythm',
    water < 2 ? 'Add 250–500 ml of water over the next 2 hours' : 'Maintain your hydration rhythm through the evening',
    missed ? 'Keep your remaining medication reminder visible' : 'Protect the streak with your evening routine',
    'Finish with 10–12 minutes of gentle movement or breathwork'
  ];
  return { headline, copy, nudge, steps };
}

export async function askAI(prompt, context) {
  if (endpoint) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt, context })
      });
      if (!res.ok) throw new Error('AI endpoint error');
      const data = await res.json();
      return data.reply || data.message || 'I received your request, but the AI service returned no answer.';
    } catch (err) {
      return 'The connected AI service is unavailable right now. I can still use the local wellness engine for simple plan guidance.';
    }
  }

  const lower = prompt.toLowerCase();
  if (lower.includes('protein')) {
    const remaining = Math.max(0, 150 - context.protein);
    return remaining === 0
      ? 'You are already at your 150g protein target today. Keep the rest of the day balanced rather than forcing extra intake.'
      : `You have about ${remaining}g left. A 20–30g snack such as Greek yogurt, paneer, eggs, tofu, or a protein shake would be an easy bridge depending on your preferences.`;
  }
  if (lower.includes('record') || lower.includes('report')) {
    return 'Your connected vault currently contains recent blood work, a nutrition consultation, an annual check, and a prescription summary. A production deployment should use OCR + structured extraction before any clinical interpretation.';
  }
  if (lower.includes('yoga') || lower.includes('move')) {
    return 'Try a 12-minute reset: 2 minutes of diaphragmatic breathing, 3 minutes of cat-cow and thoracic rotation, 3 minutes of low lunge + hamstring mobility, 2 minutes of balance work, then 2 minutes of slow breathing.';
  }
  if (lower.includes('trend')) {
    return 'Your demo trend shows protein intake moving mostly in the 117–142g range this week. The local personalization engine responds to consistency rather than a single day.';
  }
  return 'I can help connect the dots across your nutrition, movement, medication schedule, and stored records. Try asking about protein, a report summary, a yoga flow, or your recent trend.';
}
