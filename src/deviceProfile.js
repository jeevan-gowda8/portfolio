let cachedTier;

/**
 * Decides how much 3D this device should draw:
 *  - "full": desktop, the complete scene
 *  - "lite": phones and tablets, a much cheaper version of the scene
 *  - "none": low-memory phones and data-saver mode, a static gradient only
 *    (three.js is never downloaded)
 */
export function getGraphicsTier() {
  if (cachedTier) return cachedTier;

  const touch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  const constrained = touch || window.innerWidth < 768;
  const lowEnd =
    navigator.connection?.saveData === true ||
    (constrained && (navigator.deviceMemory <= 4 || navigator.hardwareConcurrency <= 3));

  cachedTier = lowEnd ? "none" : constrained ? "lite" : "full";
  return cachedTier;
}
