export const THEME_DURATION = 0.5;

export const THEMES = {
  light: {
    bg: '#e0e5ec',
    shadowLight: '#ffffff',
    shadowDark: '#a3b1c6',
    accent: '#3182ce',
    text: '#1a202c',
    label: '#4a5568'
  },
  dark: {
    bg: '#1c1e22',
    shadowLight: '#282b30',
    shadowDark: '#101114',
    accent: '#63b3ed',
    text: '#f7fafc',
    label: '#a0aec0'
  }
};

// Use CSS variables for colors so theme transitions are perfectly synchronized
// lightAngle is in degrees (0 = top, 90 = right, 180 = bottom, 270 = left)
export const getShadows = (lightAngle: number = 225) => {
  // Convert angle to radians and adjust for CSS coordinate system (0° = top, clockwise)
  // CSS shadows: positive x = right, positive y = down
  const angleRad = ((lightAngle - 90) * Math.PI) / 180;
  const distance = 8;
  const distanceSmall = 4;
  const blur = 16;
  const blurSmall = 8;
  
  // Calculate shadow offsets based on light direction
  const x = Math.cos(angleRad) * distance;
  const y = Math.sin(angleRad) * distance;
  const xSmall = Math.cos(angleRad) * distanceSmall;
  const ySmall = Math.sin(angleRad) * distanceSmall;
  
  // Dark shadow is opposite to light direction
  const darkX = -x;
  const darkY = -y;
  const darkXSmall = -xSmall;
  const darkYSmall = -ySmall;
  
  return {
    raised: `${x}px ${y}px ${blur}px var(--shadow-dark), ${darkX}px ${darkY}px ${blur}px var(--shadow-light)`,
    inset: `inset ${x * 0.75}px ${y * 0.75}px ${blur * 0.75}px var(--shadow-dark), inset ${darkX * 0.75}px ${darkY * 0.75}px ${blur * 0.75}px var(--shadow-light)`,
    raisedSmall: `${xSmall}px ${ySmall}px ${blurSmall}px var(--shadow-dark), ${darkXSmall}px ${darkYSmall}px ${blurSmall}px var(--shadow-light)`,
    insetSmall: `inset ${xSmall * 0.75}px ${ySmall * 0.75}px ${blurSmall * 0.75}px var(--shadow-dark), inset ${darkXSmall * 0.75}px ${darkYSmall * 0.75}px ${blurSmall * 0.75}px var(--shadow-light)`
  };
};

export const SPRING = {
  type: 'spring',
  stiffness: 400,
  damping: 30
} as const;
