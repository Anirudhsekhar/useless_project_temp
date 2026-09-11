export const VALID_MOODS = ['excited', 'sad', 'angry', 'dramatic', 'sleepy', 'shy'];

export const CATCH_TYPES = ['tangent', 'incomplete', 'minimal', 'exaggerated', 'trailing', 'hesitant'];

export const MOOD_AVATAR_STATES = {
  excited: 'energetic',
  sad: 'droopy',
  angry: 'irritated',
  dramatic: 'dramatic',
  sleepy: 'drowsy',
  shy: 'bashful',
};

export const CATCH_MAP = {
  excited: 'tangent',
  sad: 'incomplete',
  angry: 'minimal',
  dramatic: 'exaggerated',
  sleepy: 'trailing',
  shy: 'hesitant',
};

export function getRandomInitialMood() {
  const randomIndex = Math.floor(Math.random() * VALID_MOODS.length);
  const randomMood = VALID_MOODS[randomIndex];
  const randomIntensity = Math.floor(Math.random() * 41) + 30; // 30-70 inclusive
  return {
    mood: randomMood,
    intensity: randomIntensity,
  };
}

export function validateMoodState(rawState) {
  let mood = rawState?.mood;
  if (!VALID_MOODS.includes(mood)) {
    mood = VALID_MOODS[Math.floor(Math.random() * VALID_MOODS.length)];
  }

  let intensity = parseInt(rawState?.intensity, 10);
  if (isNaN(intensity)) {
    intensity = 50;
  }
  intensity = Math.max(0, Math.min(100, intensity));

  return { mood, intensity };
}

export function buildAvatarContract(newMoodState, previousMoodState, isError = false) {
  if (isError) {
    return {
      mood: 'sleepy',
      intensity: 100,
      state: 'conked-out',
      event: 'error',
    };
  }

  const { mood, intensity } = newMoodState;
  const prevMood = previousMoodState?.mood;
  const prevIntensity = previousMoodState?.intensity ?? 50;

  let event = 'same-mood';
  if (prevMood && prevMood !== mood) {
    event = 'mood-change';
  } else if (intensity >= prevIntensity + 15) {
    event = 'mood-intensified';
  } else if (intensity <= prevIntensity - 15) {
    event = 'mood-softened';
  }

  return {
    mood,
    intensity,
    state: MOOD_AVATAR_STATES[mood] || 'energetic',
    event,
  };
}
