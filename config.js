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
    DAILY_THOUGHT: 'dailyThought',
    INSTALL_DISMISSED: 'installBannerDismissed'
  },
  
  // PWA Settings
  PWA: {
    INSTALL_BANNER_DELAY: 3000, // 3 seconds
    CACHE_VERSION: 'v1.0.0',
    CACHE_NAME: 'jimmy-pwa-v1.0.0'
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
  ],
  
  // Service Worker Cache URLs
  CACHE_URLS: [
    '/',
    '/index.html',
    '/styles.css',
    '/logo.jpg',
    '/thoughts.txt',
    '/manifest.json',
    '/js/app.js',
    '/js/thoughts.js',
    '/js/pwa.js'
  ]
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
} else {
  window.CONFIG = CONFIG;
}
