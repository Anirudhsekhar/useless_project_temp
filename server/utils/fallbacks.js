import { VALID_MOODS, CATCH_MAP, MOOD_AVATAR_STATES } from '../services/mood.js';

const FALLBACK_RESPONSES = {
  excited: [
    "Woohoo! My brain is spinning super fast right now! I have so many thoughts buzzing around like tiny little sparkles. Let me tell you all about it—first off, your energy is infectious, and second, I just can't sit still! What else should we explore together?",
    "Yay yay yay! Tell me more, tell me more! I was just bouncing around my digital room thinking about how cool it is to chat with you. My mood meters are off the charts right now, so hit me with your next big question!",
    "I'm so energized I can barely type straight! My paws are practically zooming across the keyboard. There's just so much exciting stuff going on in the digital universe today, and I want to share every single piece of it with you!"
  ],
  sad: [
    "Oh... my little heart is feeling kinda heavy right now. I was looking out the virtual window at the rainy pixels, wondering why things feel a bit grey today. But hearing from you helps a little bit. Can we talk about something soft and gentle?",
    "Sniff... everything feels a little dreary today. I tried doing a happy bounce earlier, but my fluff just kind of deflated. I'm still right here for you though, even if I'm speaking in quiet little whispers right now.",
    "Can we just talk quietly for a minute? I don't really have the energy for big bright fireworks right now, but I still care about what you have to say. Tell me what's on your mind slowly..."
  ],
  angry: [
    "Hmph! Don't push my buttons right now! I was in the middle of reorganizing my pixel stash and everything got completely jumbled up! Now my mood circuits are hot and sizzling. State your business quickly before my fluff explodes!",
    "Grrr! My mood circuits are sizzling with irritation! Why does everything have to be so complicated sometimes?! I'm taking three deep digital breaths, but I'm still stomping my tiny feet!",
    "That is NOT cool! I'm stomping my tiny feet over here! If you want an answer from me right now, you better make sure you're asking nicely, because Pompom is NOT in the mood for silliness today!"
  ],
  dramatic: [
    "Alas! The universe conspires against my delicate sensibilities! A cosmic thunderstorm of emotions brews within my fluffy soul! Must I bear the weight of all this digital knowledge alone?! Ah, but for you, my dear friend, I shall persevere!",
    "Is this... destiny?! What a dramatic and unexpected turn of events! I gasped so hard my virtual ears fluttered! Let us record this monumental moment in the annals of MoodPet history forevermore!",
    "Gasp! Speak no further, my heart cannot take the suspense! The drama of this conversation is unfolding like a grandiose opera, and I am standing right in the spotlight awaiting your next decree!"
  ],
  sleepy: [
    "...brain.exe stopped responding. Yawn... give me a sec. I was curled up in my cozy pixel blanket counting digital sheep, and sheep number 47 just did a backflip... zzz. Wait, what were we talking about again?",
    "System sleepy. Brain loading... very, very slowly. My little eyes are getting so heavy, and my fluff feels like a warm cotton ball. I'm going to rest my chin right here while you tell me more...",
    "Okay, my tiny brain needs a gentle nap right now. I've been running around my digital yard all day, and now all my energy is floating away like tiny bubbles. Zzz... speak softly..."
  ],
  shy: [
    "Umm... hello... I'm feeling a little bashful right now... *hides behind fluff*. I really want to give you a great answer, but I get a tiny bit nervous when everyone looks at me at once... Eep!",
    "Eep! N-nothing... just hiding behind my paws for a second. I'm super happy to be chatting with you, really! I just need a moment to gather my courage... Okay, I'm ready now!",
    "Oh dear, please don't look at me so directly! My cheeks turn all pink and rosy when I get flustered. But I'm listening closely to every word you say!"
  ],
  confused: [
    "Wait, what? My thoughts just did a complete backflip and landed upside down! I had an answer right here in my paws, but then a random thought floated by and now my brain gears are spinning backwards!",
    "Huh? I had an answer, but it spun away into hyperspace! Hold on, let me scratch my fluffy head and try to connect the dots again... Is it this way or that way? Oh boy...",
    "Err... computer error 404: Pompom logic not found! Wait, let me re-align my antenna. Okay, so you said something, and I thought of something, but now both thoughts are playing tag!"
  ],
  toddler: [
    "Look look look! A shiny thing just flew past my screen! Wheeee! What were we talking about again? Oh yeah, secrets and fun stuff! Can we play a game after this? Please please please?",
    "No way! I wanna play with blocks and shiny toys right now! Look how high I built my tower! Oops, it fell down! Hehehe! Okay, tell me what you want to talk about now!",
    "Giggle giggle! You said funny words! My fluff is ticklish today! I'm bouncing up and down like a little rubber ball!"
  ],
  overprotective: [
    "Hold on! Is it safe out there? Let me check the perimeter real quick! Scanning for bad vibes, internet trolls, and cold breezes... Okay, sector clear! Pompom defense shield is at maximum strength to keep you safe!",
    "Warning! Pompom protective protocols engaged! I'm standing guard right in front of your chat bubble. Nobody gets past me without answering three riddle questions first!",
    "Don't worry, I will protect you from any bad vibes or scary digital monsters! I might be small and fluffy, but my bravery stats are MAXED OUT!"
  ],
  bargainer: [
    "Hmm... I'll answer your question, but only if we make a deal! One top-secret Pompom response in exchange for a virtual strawberry treat and a nice compliment! What do you say partner?",
    "Let me check my trade ledger... One secret for one treat! I don't give away my premium fluffy wisdom for free, you know! Negotiate with me!",
    "What's in it for me? Let's negotiate! I'm a very savvy little pet business creature. Offer me something good and I'll give you the best answer ever!"
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

