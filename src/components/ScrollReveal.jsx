import React from "react";
import { motion } from "framer-motion";

/**
 * Architectural Luxury Scroll Reveal Wrapper
 * Applies smooth cubic-bezier transitions triggered when element scrolls into view.
 */
export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.7,
  distance = 32,
  scale = 1,
  className = "",
  style = {},
  once = true,
  amount = 0.15
}) {
  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { y: distance, x: 0 };
      case "down":
        return { y: -distance, x: 0 };
      case "left":
        return { x: distance, y: 0 };
      case "right":
        return { x: -distance, y: 0 };
      case "none":
        return { x: 0, y: 0 };
      default:
        return { y: distance, x: 0 };
    }
  };

  const initial = {
    opacity: 0,
    scale: scale !== 1 ? scale : 1,
    ...getInitialPosition()
  };

  return (
    <motion.div
      initial={initial}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1
      }}
      viewport={{ once, amount }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1] // Custom smooth luxury curve
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/**
 * Architectural Grid Line that animates width from left to right on scroll
 */
export function AnimatedDivider({ delay = 0.1, style = {} }) {
  return (
    <div style={{ position: "relative", zIndex: 1, overflow: "hidden", ...style }}>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{
          duration: 0.9,
          delay,
          ease: [0.22, 1, 0.36, 1]
        }}
        style={{
          height: "1px",
          backgroundColor: "var(--gold-border)",
          transformOrigin: "left center",
          width: "100%"
        }}
      />
    </div>
  );
}

/**
 * Stagger container for child elements
 */
export function StaggerContainer({
  children,
  staggerDelay = 0.12,
  delayChildren = 0,
  className = "",
  style = {},
  once = true,
  amount = 0.1
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  distance = 25,
  duration = 0.6,
  className = "",
  style = {}
}) {
  const itemVariants = {
    hidden: { opacity: 0, y: distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <motion.div variants={itemVariants} className={className} style={style}>
      {children}
    </motion.div>
  );
}
