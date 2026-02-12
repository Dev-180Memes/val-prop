import { motion } from 'framer-motion';

interface Props {
  progress: number;
}

/**
 * Loading screen with an animated rose blooming open.
 * Pure CSS rose built from layered petals that unfold.
 */
export default function LoadingScreen({ progress }: Props) {
  const done = progress >= 100;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at 50% 40%, #2d1b3d, #1a0a2e 60%, #0d0518)',
        zIndex: 1000,
        overflow: 'hidden',
      }}
    >
      <style>{`
        .rose-container {
          position: relative;
          width: 160px;
          height: 160px;
          margin-bottom: 36px;
        }
        .rose-petal {
          position: absolute;
          width: 50px;
          height: 70px;
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          top: 50%;
          left: 50%;
          transform-origin: bottom center;
          opacity: 0;
          animation: bloom 3s ease-out forwards;
        }
        @keyframes bloom {
          0% { opacity: 0; transform: translate(-50%, -100%) rotate(0deg) scale(0.3); }
          40% { opacity: 0.8; }
          100% { opacity: 1; transform: translate(-50%, -100%) rotate(var(--rot)) scale(1); }
        }
        .rose-center {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 24px;
          height: 24px;
          background: radial-gradient(circle, #ff1493, #c41068);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          z-index: 20;
          animation: center-pulse 2s ease-in-out infinite;
        }
        @keyframes center-pulse {
          0%, 100% { box-shadow: 0 0 10px #ff1493, 0 0 20px #ff149366; transform: translate(-50%, -50%) scale(1); }
          50% { box-shadow: 0 0 20px #ff69b4, 0 0 40px #ff1493; transform: translate(-50%, -50%) scale(1.1); }
        }
        .rose-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 200px;
          height: 200px;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,20,147,0.15), transparent 70%);
          animation: glow-breathe 3s ease-in-out infinite;
        }
        @keyframes glow-breathe {
          0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
        }
        .stem {
          position: absolute;
          bottom: -40px;
          left: 50%;
          width: 4px;
          height: 50px;
          background: linear-gradient(to top, #2d7a2d, #3a9e3a);
          transform: translateX(-50%);
          border-radius: 2px;
          animation: stem-grow 1s ease-out forwards;
        }
        @keyframes stem-grow {
          0% { height: 0; opacity: 0; }
          100% { height: 50px; opacity: 1; }
        }
        .leaf {
          position: absolute;
          width: 20px;
          height: 10px;
          background: #3a9e3a;
          border-radius: 0 50% 50% 0;
          bottom: -20px;
          animation: leaf-grow 1.5s ease-out 0.5s forwards;
          opacity: 0;
        }
        .leaf-left {
          right: 50%;
          transform-origin: right center;
          transform: rotate(30deg) scaleX(-1);
          margin-right: 2px;
        }
        .leaf-right {
          left: 50%;
          transform-origin: left center;
          transform: rotate(-30deg);
          margin-left: 2px;
        }
        @keyframes leaf-grow {
          0% { opacity: 0; width: 0; }
          100% { opacity: 1; width: 20px; }
        }
        .sparkle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: white;
          border-radius: 50%;
          animation: twinkle 2s ease-in-out infinite;
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* Floating sparkles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={`sp-${i}`}
          className="sparkle"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${1.5 + Math.random() * 2}s`,
          }}
        />
      ))}

      {/* Rose */}
      <div className="rose-container">
        <div className="rose-glow" />

        {/* Outer petals (layer 1) */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <div
            key={`p1-${i}`}
            className="rose-petal"
            style={{
              '--rot': `${angle}deg`,
              background: `linear-gradient(135deg, #ff4080, #e8306e)`,
              width: '44px',
              height: '62px',
              animationDelay: `${0.8 + i * 0.1}s`,
              zIndex: 5,
            } as React.CSSProperties}
          />
        ))}

        {/* Middle petals (layer 2) */}
        {[20, 80, 140, 200, 260, 320].map((angle, i) => (
          <div
            key={`p2-${i}`}
            className="rose-petal"
            style={{
              '--rot': `${angle}deg`,
              background: `linear-gradient(135deg, #ff5a9e, #ff2d78)`,
              width: '36px',
              height: '52px',
              animationDelay: `${1.5 + i * 0.12}s`,
              zIndex: 10,
            } as React.CSSProperties}
          />
        ))}

        {/* Inner petals (layer 3) */}
        {[0, 72, 144, 216, 288].map((angle, i) => (
          <div
            key={`p3-${i}`}
            className="rose-petal"
            style={{
              '--rot': `${angle}deg`,
              background: `linear-gradient(135deg, #ff7eb3, #ff3e8a)`,
              width: '28px',
              height: '40px',
              animationDelay: `${2.1 + i * 0.15}s`,
              zIndex: 15,
            } as React.CSSProperties}
          />
        ))}

        <div className="rose-center" />
        <div className="stem" />
        <div className="leaf leaf-left" />
        <div className="leaf leaf-right" />
      </div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{
          color: '#ff69b4',
          fontFamily: "'Dancing Script', Georgia, serif",
          fontSize: 'clamp(1.6rem, 4.5vw, 2.8rem)',
          textShadow: '0 0 25px #ff149366',
          marginBottom: '8px',
          letterSpacing: '1px',
        }}
      >
        A Special Walk Awaits...
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={{
          color: 'rgba(255,182,193,0.7)',
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(0.85rem, 2vw, 1rem)',
          marginBottom: '32px',
        }}
      >
        Use WASD or arrow keys to walk the dog 🐾
      </motion.p>

      {/* Progress bar */}
      <div
        style={{
          width: '220px',
          height: '4px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '2px',
          overflow: 'hidden',
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: 'easeOut' }}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #ff69b4, #ff1493, #ff69b4)',
            backgroundSize: '200% 100%',
            borderRadius: '2px',
          }}
        />
      </div>
      <motion.p
        animate={{ opacity: done ? 0.8 : 0.4 }}
        style={{ color: '#ccc', marginTop: '10px', fontSize: '0.8rem', fontFamily: 'Georgia, serif' }}
      >
        {done ? 'Ready!' : `${Math.round(progress)}%`}
      </motion.p>
    </motion.div>
  );
}
