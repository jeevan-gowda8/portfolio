import React, { useState, useEffect } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { FiArrowUp } from "react-icons/fi";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    restDelta: 0.001
  });

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setVisible(latest > 0.08);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const radius = 18;

  return (
    <>
      {/* Top Floating Reading Progress Bar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          zIndex: 100,
          pointerEvents: "none",
          backgroundColor: "rgba(232, 222, 200, 0.35)"
        }}
      >
        <motion.div
          style={{
            height: "100%",
            background: "linear-gradient(90deg, #C5A059 0%, #D4AF37 50%, #181613 100%)",
            transformOrigin: "0%",
            scaleX,
            boxShadow: "0 0 10px rgba(197, 160, 89, 0.6)"
          }}
        />
      </div>

      {/* Floating Scroll to Top with Circular Progress Indicator */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed",
              bottom: "2rem",
              right: "2rem",
              zIndex: 90
            }}
          >
            <button
              onClick={scrollToTop}
              aria-label="Scroll to top of page"
              title="Scroll to top"
              className="scroll-top-btn"
              style={{
                position: "relative",
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: "var(--ivory-surface)",
                border: "1px solid var(--gold-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--charcoal-primary)",
                cursor: "pointer",
                boxShadow: "0 8px 24px rgba(24, 22, 19, 0.08)",
                transition: "all 0.25s cubic-bezier(0.22, 1, 0.36, 1)"
              }}
            >
              {/* Circular SVG Progress Ring */}
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  transform: "rotate(-90deg)",
                  pointerEvents: "none"
                }}
              >
                <circle
                  cx="24"
                  cy="24"
                  r={radius}
                  stroke="var(--gold-border)"
                  strokeWidth="2.5"
                  fill="transparent"
                  opacity="0.4"
                />
                <motion.circle
                  cx="24"
                  cy="24"
                  r={radius}
                  stroke="var(--accent-gold)"
                  strokeWidth="2.5"
                  fill="transparent"
                  strokeLinecap="round"
                  style={{ pathLength: scrollYProgress }}
                />
              </svg>

              <FiArrowUp style={{ fontSize: "1.1rem", zIndex: 1, transition: "transform 0.2s ease" }} className="scroll-arrow-icon" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .scroll-top-btn:hover {
          background-color: var(--charcoal-primary) !important;
          color: var(--ivory-canvas) !important;
          border-color: var(--accent-gold) !important;
          transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(197, 160, 89, 0.25) !important;
        }
        .scroll-top-btn:hover .scroll-arrow-icon {
          transform: translateY(-2px);
        }
        .scroll-top-btn:active {
          transform: translateY(0) scale(0.95);
        }
      `}</style>
    </>
  );
}
