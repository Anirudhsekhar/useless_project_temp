import { VALID_MOODS, CATCH_MAP, MOOD_AVATAR_STATES } from '../services/mood.js';

const FALLBACK_RESPONSES = {
  excited: [
    "Woohoo! My brain is spinning super fast right now!",
    "Yay yay yay! Tell me more, tell me more!",
    "I'm so energized I can barely type straight!"
  ],
  sad: [
    "Oh... my little heart is feeling kinda heavy right now.",
    "Sniff... everything feels a little grey today.",
    "Can we just talk quietly for a minute?"
  ],
  angry: [
    "Hmph! Don't push my buttons right now!",
    "Grrr! My mood circuits are sizzling with irritation!",
    "That is NOT cool! I'm stomping my tiny feet!"
  ],
  dramatic: [
    "Alas! The universe conspires against my delicate sensibilities!",
    "Is this... destiny?! What a dramatic turn of events!",
    "Gasp! Speak no further, my heart cannot take the suspense!"
  ],
  sleepy: [
    "...brain.exe stopped responding. Yawn... give me a sec.",
    "System sleepy. Brain loading... probably.",
    "Okay, my tiny brain needs a nap right now."
  ],
  shy: [
    "Umm... hello... I'm a little bashful right now...",
    "Eep! N-nothing... just hiding behind my paws.",
    "Oh dear, please don't look at me so directly!"
  ],
  confused: [
    "Wait, what? My thoughts just did a backflip!",
    "Huh? I had an answer, but it spun away into hyperspace.",
    "Err... computer error 404: Pompom logic not found!"
  ],
  toddler: [
    "Look look look! Shiny thing! What were we talking about?",
    "No way! I wanna play with toys now!",
    "Giggle giggle! You said funny words!"
  ],
  overprotective: [
    "Hold on! Is it safe out there? Let me check the perimeter!",
    "Warning! Pompom defense shield engaged!",
    "Don't worry, I will protect you from any bad vibes!"
  ],
  bargainer: [
    "Hmm... I'll answer your question if you give me a snack!",
    "Let's make a deal: one secret for one treat!",
    "What's in it for me? Let's negotiate!"
  ]
};

export function getLocalFallbackResponse(errorType = 'provider_error', currentMoodState = null) {
  // Select a mood: either cycle away from current mood or pick a random mood
  const moods = VALID_MOODS;
  const chosenMood = moods[Math.floor(Math.random() * moods.length)];
  const intensity = Math.floor(Math.random() * 40) + 50; // 50 - 90

  const options = FALLBACK_RESPONSES[chosenMood] || FALLBACK_RESPONSES.sleepy;
  const responseText = options[Math.floor(Math.random() * options.length)];

  return {
    success: false,
    errorType,
    mood: {
      mood: chosenMood,
      intensity,
    },
    moodReason: `[Local Mode / Offline Fallback] Pompom is feeling ${chosenMood}.`,
    response: responseText,
    catchType: CATCH_MAP[chosenMood] || "tangent",
    avatar: {
      mood: chosenMood,
      intensity,
      state: MOOD_AVATAR_STATES[chosenMood] || 'drowsy',
      event: 'mood-change',
    },
  };
}

