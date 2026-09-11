import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

const MOOD_BG_MAP = {
  angry: 'linear-gradient(135deg, #FF4B4B 0%, #D93838 100%)',
  shy: 'linear-gradient(135deg, #FAD2E1 0%, #F4B8CD 100%)',
  sleepy: 'linear-gradient(135deg, #1E1B4B 0%, #0F0D2A 100%)',
  excited: 'linear-gradient(135deg, #FFD166 0%, #F4B942 100%)',
  dramatic: 'linear-gradient(135deg, #5A189A 0%, #3C096C 100%)',
  sad: 'linear-gradient(135deg, #4A6B82 0%, #2D485B 100%)',
};

export default function MoodEnvironment({ mood, intensity }) {
  const currentMood = mood || 'excited';
  const backgroundStyle = MOOD_BG_MAP[currentMood] || MOOD_BG_MAP.excited;

  // Trigger confetti burst when mood becomes Excited at high intensity
  useEffect(() => {
    if (currentMood === 'excited' && intensity > 50) {
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.4 },
          colors: ['#FFD166', '#FF4B4B', '#BCE7FD', '#FFFFFF'],
        });
      } catch (e) {
        // Fallback silently if canvas-confetti has canvas issue
      }
    }
  }, [currentMood, intensity]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: backgroundStyle,
        transition: 'background 0.8s ease-in-out',
        zIndex: -1,
        overflow: 'hidden',
      }}
    >
      {/* Mood-specific ambient overlays */}

      {/* DRAMATIC Spotlight effect */}
      {currentMood === 'dramatic' && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '400px',
            height: '100%',
            background: 'radial-gradient(ellipse at top, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* SAD Rain Effect */}
      {currentMood === 'sad' && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: `${(i * 15) % 100}%`,
                left: `${(i * 8.3) % 100}%`,
                width: '2px',
                height: '24px',
                background: 'rgba(255, 255, 255, 0.4)',
                borderRadius: '999px',
                animation: `rain-fall 1.2s infinite linear`,
                animationDelay: `${(i * 0.15) % 1.2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* SLEEPY Floating Zzz Particles */}
      {currentMood === 'sleepy' && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: `${40 + (i * 10)}%`,
                left: `${20 + (i * 15)}%`,
                color: 'rgba(255, 255, 255, 0.6)',
                fontFamily: 'Fredoka, sans-serif',
                fontWeight: 'bold',
                fontSize: `${18 + i * 4}px`,
                animation: 'float-zzz 3s infinite ease-out',
                animationDelay: `${i * 0.6}s`,
              }}
            >
              Zzz
            </div>
          ))}
        </div>
      )}

      {/* SHY Sparkles */}
      {currentMood === 'shy' && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: `${15 + (i * 10)}%`,
                left: `${10 + (i * 11)}%`,
                width: '6px',
                height: '6px',
                background: '#FFF',
                borderRadius: '50%',
                boxShadow: '0 0 10px #FFF',
                animation: 'pulse-breath 2s infinite ease-in-out',
                animationDelay: `${i * 0.25}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* ANGRY Steam / Heat glow */}
      {currentMood === 'angry' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at center, rgba(255,0,0,0.15) 0%, rgba(0,0,0,0.4) 100%)',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
}
