import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { proposalConfig } from '../config/trailConfig';
import type { DogMood } from './Dog';
import LoveLetter from './LoveLetter';

interface Props {
  visible: boolean;
  onDogMoodChange: (mood: DogMood) => void;
}

const noReactions = [
  { emoji: '🥺', text: "Are you sure? Look at that face..." },
  { emoji: '😢', text: "The dog is literally crying right now" },
  { emoji: '😤', text: "Okay now you're just being mean" },
  { emoji: '😡', text: "You really want to make the dog angry?!" },
  { emoji: '🔥😡🔥', text: "THAT'S IT. The dog remembers EVERYTHING." },
  { emoji: '💀', text: "There is no 'no'. There never was." },
];

export default function ProposalUI({ visible, onDogMoodChange }: Props) {
  const [noAttempts, setNoAttempts] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const [yesScale, setYesScale] = useState(1);
  const [noScale, setNoScale] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const [reaction, setReaction] = useState<{ emoji: string; text: string } | null>(null);

  const handleNo = useCallback(() => {
    const attempt = noAttempts + 1;
    setNoAttempts(attempt);
    setYesScale(1 + attempt * 0.15);
    setNoScale(Math.max(0.3, 1 - attempt * 0.15));
    setReaction(noReactions[Math.min(attempt - 1, noReactions.length - 1)] ?? noReactions[noReactions.length - 1]);

    if (attempt === 1) onDogMoodChange('sad');
    else if (attempt === 2) onDogMoodChange('sitting');
    else {
      onDogMoodChange('barking');
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 800);
      if (attempt >= 4) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }
  }, [noAttempts, onDogMoodChange]);

  const handleYes = useCallback(() => {
    setAccepted(true);
    setShowConfetti(true);
    onDogMoodChange('proud');
    setReaction(null);
  }, [onDogMoodChange]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: screenShake ? 'shake 0.5s ease-in-out' : undefined,
      }}
    >
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
          20%, 40%, 60%, 80% { transform: translateX(8px); }
        }
        @keyframes float-q {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 15px #ff69b4, 0 0 30px #ff149366; }
          50% { box-shadow: 0 0 30px #ff69b4, 0 0 60px #ff1493, 0 0 90px #ff69b444; }
        }
        @keyframes confetti-fall {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }

        /* Heart-shaped confetti */
        @keyframes heart-float {
          0% { transform: translateY(100vh) scale(0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(-20vh) scale(1) rotate(45deg); opacity: 0; }
        }

        /* Sparkle burst */
        @keyframes sparkle-burst {
          0% { transform: scale(0) rotate(0deg); opacity: 1; }
          100% { transform: scale(3) rotate(180deg); opacity: 0; }
        }

        /* Gentle sway for floating elements */
        @keyframes sway {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(15px); }
          75% { transform: translateX(-15px); }
        }

        /* Ring expand */
        @keyframes ring-expand {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0.8; }
          100% { transform: translate(-50%, -50%) scale(4); opacity: 0; }
        }

        /* CSS heart shape */
        .css-heart {
          position: absolute;
          width: 20px;
          height: 20px;
          transform: rotate(45deg);
        }
        .css-heart::before, .css-heart::after {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: inherit;
        }
        .css-heart::before { left: -10px; }
        .css-heart::after { top: -10px; }
      `}</style>

      {/* Question card */}
      <AnimatePresence>
        {!accepted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              textAlign: 'center',
              pointerEvents: 'auto',
              padding: '36px 48px',
              borderRadius: '24px',
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(14px)',
              maxWidth: '92vw',
            }}
          >
            <h1
              style={{
                fontSize: 'clamp(1.4rem, 4.5vw, 2.8rem)',
                color: '#fff',
                textShadow: '0 0 20px #ff69b4',
                marginBottom: '28px',
                fontFamily: "'Dancing Script', Georgia, serif",
                animation: 'float-q 3s ease-in-out infinite',
              }}
            >
              {proposalConfig.question}
            </h1>

            <AnimatePresence mode="wait">
              {reaction && (
                <motion.div
                  key={reaction.emoji + noAttempts}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  style={{ marginBottom: '20px', textAlign: 'center' }}
                >
                  <div style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', marginBottom: '8px' }}>
                    {reaction.emoji}
                  </div>
                  <div
                    style={{
                      fontSize: 'clamp(0.9rem, 2.2vw, 1.15rem)',
                      color: noAttempts >= 4 ? '#ff6b6b' : '#ffb6c1',
                      fontFamily: "'Dancing Script', Georgia, serif",
                      fontStyle: 'italic',
                      maxWidth: '400px',
                    }}
                  >
                    {reaction.text}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', alignItems: 'center' }}>
              <motion.button
                onClick={handleYes}
                animate={{ scale: yesScale }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                style={{
                  padding: '16px 48px',
                  fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)',
                  background: 'linear-gradient(135deg, #ff69b4, #ff1493)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  animation: 'glow-pulse 2s ease-in-out infinite',
                  fontFamily: "'Dancing Script', Georgia, serif",
                }}
              >
                YES! 💕
              </motion.button>
              <motion.button
                onClick={handleNo}
                animate={{ scale: noScale, opacity: Math.max(0.4, noScale) }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                style={{
                  padding: '16px 48px',
                  fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)',
                  background: '#555',
                  color: '#ddd',
                  border: '1px solid #777',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  fontFamily: "'Dancing Script', Georgia, serif",
                }}
              >
                No
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confetti for NO escalation */}
      {showConfetti && !accepted && (
        <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 300 }}>
          {Array.from({ length: 40 }).map((_, i) => {
            const colors = ['#ff69b4', '#ff1493', '#ffd700', '#ff6347', '#87ceeb'];
            return (
              <div
                key={`conf-${i}`}
                style={{
                  position: 'absolute',
                  left: `${Math.random() * 100}%`,
                  top: '-20px',
                  width: `${8 + Math.random() * 10}px`,
                  height: `${8 + Math.random() * 10}px`,
                  background: colors[i % colors.length],
                  borderRadius: i % 3 === 0 ? '50%' : '2px',
                  animation: `confetti-fall ${2 + Math.random() * 2}s linear ${Math.random() * 1.5}s forwards`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* ===== YES CELEBRATION ===== */}
      <AnimatePresence>
        {accepted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            style={{
              position: 'fixed',
              inset: 0,
              pointerEvents: 'auto',
              zIndex: 250,
              overflow: 'hidden',
              background: 'radial-gradient(ellipse at 50% 30%, rgba(60,10,40,0.85), rgba(15,5,25,0.92))',
            }}
          >
            {/* Expanding rings from center */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={`ring-${i}`}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '40%',
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  border: '2px solid rgba(255,105,180,0.3)',
                  animation: `ring-expand ${3 + i * 0.5}s ease-out ${i * 0.6}s infinite`,
                }}
              />
            ))}

            {/* Floating CSS hearts */}
            {Array.from({ length: 25 }).map((_, i) => {
              const colors = ['#ff69b4', '#ff1493', '#ff6b8a', '#e8306e', '#ff4080', '#ffb6c1'];
              const size = 10 + Math.random() * 20;
              return (
                <div
                  key={`heart-${i}`}
                  className="css-heart"
                  style={{
                    left: `${5 + Math.random() * 90}%`,
                    bottom: '-30px',
                    width: `${size}px`,
                    height: `${size}px`,
                    background: colors[i % colors.length],
                    animation: `heart-float ${5 + Math.random() * 5}s ease-out ${Math.random() * 4}s infinite`,
                    opacity: 0,
                  }}
                />
              );
            })}

            {/* Sparkle dots */}
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={`star-${i}`}
                style={{
                  position: 'absolute',
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: '3px',
                  height: '3px',
                  background: '#fff',
                  borderRadius: '50%',
                  boxShadow: '0 0 6px 2px rgba(255,255,255,0.4)',
                  animation: `sparkle-burst ${2 + Math.random() * 3}s ease-out ${Math.random() * 5}s infinite`,
                }}
              />
            ))}

            {/* Soft golden confetti */}
            {Array.from({ length: 50 }).map((_, i) => {
              const colors = ['#ffd700', '#ffb347', '#ff69b4', '#ff1493', '#ffe4e1', '#fff'];
              return (
                <div
                  key={`gc-${i}`}
                  style={{
                    position: 'absolute',
                    left: `${Math.random() * 100}%`,
                    top: '-10px',
                    width: `${4 + Math.random() * 8}px`,
                    height: `${4 + Math.random() * 8}px`,
                    background: colors[i % colors.length],
                    borderRadius: i % 2 === 0 ? '50%' : '1px',
                    opacity: 0.7,
                    animation: `confetti-fall ${4 + Math.random() * 4}s linear ${Math.random() * 5}s infinite`,
                  }}
                />
              );
            })}

            {/* Central content */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
              }}
            >
              {/* Big animated heart */}
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 150, damping: 12, delay: 0.2 }}
                style={{ marginBottom: '20px', position: 'relative' }}
              >
                <motion.div
                  animate={{ scale: [1, 1.12, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                  style={{ fontSize: 'clamp(4rem, 12vw, 7rem)', lineHeight: 1, filter: 'drop-shadow(0 0 30px #ff1493)' }}
                >
                  💖
                </motion.div>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                style={{
                  fontSize: 'clamp(1.8rem, 6vw, 3.5rem)',
                  fontFamily: "'Dancing Script', Georgia, serif",
                  color: '#fff',
                  textShadow: '0 0 40px #ff1493, 0 0 80px #ff149344',
                  marginBottom: '16px',
                  textAlign: 'center',
                }}
              >
                She Said Yes!
              </motion.h1>

              {/* Decorative divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                style={{
                  width: '200px',
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, #ff69b4, transparent)',
                  marginBottom: '20px',
                }}
              />

              {/* Poetry lines — staggered */}
              {[
                'Thank you for walking this trail with me.',
                'Every step, every photo, every memory...',
                'They all lead to this moment.',
                '',
                'I love you more than words can say. 💝',
              ].map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + i * 0.3 }}
                  style={{
                    fontSize: line === '' ? '0.5rem' : 'clamp(0.95rem, 2.5vw, 1.35rem)',
                    color: i === 4 ? '#ff69b4' : '#e8c8d8',
                    fontFamily: i === 4 ? "'Dancing Script', Georgia, serif" : 'Georgia, serif',
                    fontWeight: i === 4 ? 700 : 400,
                    lineHeight: 1.8,
                    textAlign: 'center',
                    textShadow: i === 4 ? '0 0 20px #ff149366' : 'none',
                    maxWidth: '550px',
                  }}
                >
                  {line || '\u00A0'}
                </motion.p>
              ))}

              {/* Decorative bottom flourish */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3 }}
                style={{
                  marginTop: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: '#ff69b4',
                  fontSize: '1.5rem',
                }}
              >
                ✦ 🐕 ✦ ❤️ ✦ 🐕 ✦
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Love letter — appears after YES */}
      <LoveLetter visible={accepted} />
    </div>
  );
}
