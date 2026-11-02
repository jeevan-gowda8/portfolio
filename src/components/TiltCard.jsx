import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";

/**
 * 3D perspective card that tilts toward the cursor with a soft gold glare.
 * Falls back to a flat card on touch devices.
 */
const canTilt = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

export default function TiltCard({ max, ...props }) {
  if (!canTilt) {
    const { children, ...rest } = props;
    return <motion.div {...rest}>{children}</motion.div>;
  }
  return <InteractiveTiltCard max={max} {...props} />;
}

function InteractiveTiltCard({ children, className = "", style = {}, max = 7, onClick, ...rest }) {
  const ref = useRef(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const glow = useMotionValue(0);

  const spring = { stiffness: 220, damping: 22, mass: 0.6 };
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);
  const glowOpacity = useSpring(glow, spring);
  const glareX = useTransform(px, (v) => `${v * 100}%`);
  const glareY = useTransform(py, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(520px circle at ${glareX} ${glareY}, rgba(236, 212, 151, 0.28), transparent 45%)`;

  const handleMove = (e) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
    glow.set(1);
  };

  const handleLeave = () => {
    px.set(0.5);
    py.set(0.5);
    glow.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      onClick={onClick}
      className={className}
      style={{
        position: "relative",
        transformStyle: "preserve-3d",
        transformPerspective: 1100,
        rotateX,
        rotateY,
        ...style
      }}
      {...rest}
    >
      {children}
      <motion.div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          pointerEvents: "none",
          background: glare,
          opacity: glowOpacity
        }}
      />
    </motion.div>
  );
}
