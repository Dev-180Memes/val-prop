import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { letterConfig } from '../config/trailConfig';

// Google Font loaded in index.html: "Dancing Script" for handwriting feel

interface Props {
  visible: boolean;
}

export default function LoveLetter({ visible }: Props) {
  const [open, setOpen] = useState(false);
  const letterRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = useCallback(async () => {
    if (!letterRef.current || downloading) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(letterRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = 'love-letter.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setDownloading(false);
    }
  }, [downloading]);

  if (!visible) return null;

  return (
    <>
      {/* Envelope button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.5, type: 'spring' }}
            onClick={() => setOpen(true)}
            style={{
              position: 'fixed',
              bottom: '8vh',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(10px)',
              border: '2px solid #ff69b4',
              borderRadius: '16px',
              padding: '16px 32px',
              cursor: 'pointer',
              zIndex: 260,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: '#ffb6c1',
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
              pointerEvents: 'auto',
            }}
          >
            <span style={{ fontSize: '1.8em' }}>💌</span>
            Open my letter to you
          </motion.button>
        )}
      </AnimatePresence>

      {/* Letter modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 400,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(6px)',
              pointerEvents: 'auto',
              padding: '20px',
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.5, rotateX: 90, opacity: 0 }}
              animate={{ scale: 1, rotateX: 0, opacity: 1 }}
              exit={{ scale: 0.5, rotateX: -90, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              style={{
                maxWidth: '600px',
                width: '100%',
                maxHeight: '85vh',
                overflow: 'auto',
                position: 'relative',
              }}
            >
              {/* The letter itself — this is what gets captured for download */}
              <div
                ref={letterRef}
                style={{
                  background: 'linear-gradient(145deg, #fef9f0, #fdf3e7, #fef6ed)',
                  borderRadius: '8px',
                  padding: '48px 40px',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.4), inset 0 0 60px rgba(139,69,19,0.05)',
                  position: 'relative',
                  fontFamily: "'Dancing Script', cursive",
                }}
              >
                {/* Paper texture lines */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage:
                      'repeating-linear-gradient(transparent, transparent 31px, #e8ddd3 31px, #e8ddd3 32px)',
                    backgroundPosition: '0 46px',
                    opacity: 0.4,
                    borderRadius: '8px',
                    pointerEvents: 'none',
                  }}
                />

                {/* Red margin line */}
                <div
                  style={{
                    position: 'absolute',
                    left: '36px',
                    top: 0,
                    bottom: 0,
                    width: '1px',
                    background: 'rgba(220, 80, 80, 0.25)',
                  }}
                />

                {/* Date */}
                <p
                  style={{
                    textAlign: 'right',
                    color: '#8b6f5e',
                    fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                    marginBottom: '24px',
                    position: 'relative',
                  }}
                >
                  {letterConfig.date}
                </p>

                {/* Greeting */}
                <p
                  style={{
                    color: '#4a3728',
                    fontSize: 'clamp(1.4rem, 3.5vw, 2rem)',
                    marginBottom: '24px',
                    position: 'relative',
                  }}
                >
                  {letterConfig.greeting}
                </p>

                {/* Body paragraphs */}
                {letterConfig.paragraphs.map((para, i) => (
                  <p
                    key={i}
                    style={{
                      color: '#4a3728',
                      fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
                      lineHeight: '32px',
                      marginBottom: '20px',
                      textIndent: '2em',
                      position: 'relative',
                    }}
                  >
                    {para}
                  </p>
                ))}

                {/* Closing */}
                <p
                  style={{
                    color: '#4a3728',
                    fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
                    marginTop: '32px',
                    textAlign: 'right',
                    position: 'relative',
                  }}
                >
                  {letterConfig.closing}
                </p>

                {/* Signature */}
                <p
                  style={{
                    color: '#8b2252',
                    fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
                    textAlign: 'right',
                    marginTop: '8px',
                    position: 'relative',
                  }}
                >
                  {letterConfig.signature}
                </p>

                {/* Decorative corner hearts */}
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    fontSize: '1.2rem',
                    opacity: 0.3,
                  }}
                >
                  ♥
                </span>
                <span
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    fontSize: '1.2rem',
                    opacity: 0.3,
                  }}
                >
                  ♥
                </span>
              </div>

              {/* Action buttons below the letter */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '16px',
                  marginTop: '20px',
                }}
              >
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  style={{
                    background: 'linear-gradient(135deg, #ff69b4, #ff1493)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50px',
                    padding: '12px 28px',
                    fontSize: '1rem',
                    fontFamily: 'Georgia, serif',
                    cursor: downloading ? 'wait' : 'pointer',
                    opacity: downloading ? 0.6 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span style={{ fontSize: '1.2em' }}>📥</span>
                  {downloading ? 'Saving...' : 'Save Letter'}
                </button>

                <button
                  onClick={() => setOpen(false)}
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    color: '#ddd',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '50px',
                    padding: '12px 28px',
                    fontSize: '1rem',
                    fontFamily: 'Georgia, serif',
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
