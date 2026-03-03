/**
 * Soft color palettes (hex) for floating particles.
 * Import from here when customizing FloatingParticles palette prop.
 */
export const SOFT_PALETTES = {
  pastel: [
    "#fce7f3", "#fbcfe8", "#f9a8d4", "#e9d5ff", "#ddd6fe",
    "#c4b5fd", "#a5b4fc", "#93c5fd", "#bae6fd", "#cffafe",
  ],
  warm: [
    "#ffedd5", "#fed7aa", "#fdba74", "#fde68a", "#fef3c7",
  ],
  cool: [
    "#e0e7ff", "#c7d2fe", "#a5b4fc", "#bae6fd", "#e0f2fe",
  ],
};

export const DEFAULT_PARTICLE_PALETTE = [
  ...SOFT_PALETTES.pastel,
  ...SOFT_PALETTES.warm,
];
