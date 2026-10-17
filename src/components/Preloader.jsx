import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";

/**
 * Short branded intro shown while fonts and the 3D scene warm up.
 * Shown once per browser session so returning visitors skip it.
 */
export default function Preloader() {
  const [show, setShow] = useState(() => {
    try {
      return !sessionStorage.getItem("jg-intro-seen");
    } catch {
      return true;
    }
  });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!show) return;
    document.body.style.overflow = "hidden";

    const start = performance.now();
    const duration = 1400;
    let raf;
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setProgress(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        Promise.resolve(document.fonts?.ready).finally(() => {
          setShow(false);
          try {
            sessionStorage.setItem("jg-intro-seen", "1");
          } catch {
            /* storage unavailable — intro will simply show again */
          }
        });
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
    };
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10001,
            backgroundColor: "var(--ivory-canvas)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.75rem"
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Logo size={64} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="label-md"
            style={{ color: "var(--charcoal-primary)", letterSpacing: "0.3em" }}
          >
            JEEVAN GOWDA A V
          </motion.div>
          <div style={{ width: 180, height: 2, backgroundColor: "var(--gold-border)", borderRadius: 2, overflow: "hidden" }}>
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "var(--gold-gradient)",
                transition: "width 0.1s linear"
              }}
            />
          </div>
          <span className="label-sm" style={{ color: "var(--accent-gold)", fontFamily: "var(--font-mono)" }}>
            {String(progress).padStart(3, "0")}%
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
