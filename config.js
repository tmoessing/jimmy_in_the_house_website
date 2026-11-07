/**
 * Configuration file for Jimmy in the House PWA
 * Centralized settings for easy customization
 */

const CONFIG = {
  // App Information
  APP_NAME: 'Jimmy in the House',
  APP_SHORT_NAME: 'Jimmy',
  APP_DESCRIPTION: 'Your daily thought from Jimmy in the House - a collection of quirky, thought-provoking insights',
  
  // URLs and Paths
  THOUGHTS_URL: 'thoughts.txt',
  LOGO_URL: 'logo.jpg',
  
  // Storage Keys
  STORAGE_KEYS: {
    DAILY_THOUGHT: 'dailyThought'
  },
  
  // Theme Colors
  THEME: {
    PRIMARY: '#5b2aa8',
    SECONDARY: '#7044d9',
    TEXT: '#ffffff',
    MUTED: 'rgba(255, 255, 255, 0.86)'
  },
  
  // Fallback Thoughts (used when thoughts.txt fails to load)
  FALLBACK_THOUGHTS: [
    'Ship small, ship often.',
    'If it\'s not on the calendar, it does not exist.',
    'Done is a feature.',
    'Focus is a superpower.',
    'Touch grass. Then touch code.'
  ]
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
} else {
  window.CONFIG = CONFIG;
}
