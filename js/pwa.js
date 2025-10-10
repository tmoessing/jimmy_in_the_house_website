/**
 * PWA (Progressive Web App) Management Module
 * Enhanced banner implementation with better UX and analytics
 */

console.log('🚀 PWA SCRIPT LOADED - VERSION 2');

class PWAManager {
  constructor() {
    this.deferredPrompt = null;
    this.installBanner = document.getElementById('installBanner');
    this.installBtn = document.getElementById('installBtn');
    this.dismissBtn = document.getElementById('dismissBtn');
    this.testBannerBtn = document.getElementById('testBannerBtn');
    this.debugBannerBtn = document.getElementById('debugBannerBtn');
    this.bannerStates = {
      HIDDEN: 'hidden',
      SHOWING: 'showing',
      DISMISSED: 'dismissed',
      INSTALLED: 'installed'
    };
    this.currentState = this.bannerStates.HIDDEN;
    this.analytics = {
      bannerShown: 0,
      installClicked: 0,
      dismissClicked: 0,
      installSuccess: 0
    };
    
    this.init();
  }

  /**
   * Initialize PWA functionality
   */
  init() {
    console.log('🚀 PWA Manager initializing...');
    
    this.setupEventListeners();
    this.registerServiceWorker();
    
    // FORCE SHOW BANNER ON MOBILE - NO EXCUSES
    this.showBannerOnMobile();
    
    // Also try again after delay
    setTimeout(() => {
      this.showBannerOnMobile();
    }, 500);
    
    // And again after 2 seconds for good measure
    setTimeout(() => {
      this.showBannerOnMobile();
    }, 2000);
    
    // Add window resize listener
    window.addEventListener('resize', () => {
      this.showBannerOnMobile();
    });
  }

  /**
   * Force show banner (for testing)
   */
  forceShowBanner() {
    console.log('Force showing banner for testing');
    this.showBanner();
  }

  /**
   * Debug banner state
   */
  debugBanner() {
    console.log('=== Banner Debug Info ===');
    console.log('Banner element:', this.installBanner);
    console.log('Banner display:', this.installBanner?.style.display);
    console.log('Banner classes:', this.installBanner?.className);
    console.log('Current state:', this.currentState);
    console.log('Is mobile:', this.isMobileDevice());
    console.log('Window width:', window.innerWidth);
    console.log('User agent:', navigator.userAgent);
    console.log('Dismissed:', localStorage.getItem('pwa-banner-dismissed'));
    console.log('Analytics:', this.getAnalyticsSummary());
    console.log('=== End Debug Info ===');
  }

  /**
   * Set up all event listeners
   */
  setupEventListeners() {
    // Install button click handler
    this.installBtn?.addEventListener('click', () => this.handleInstallClick());
    
    // Dismiss button click handler
    this.dismissBtn?.addEventListener('click', () => this.handleDismissClick());
    
    // Test banner button click handler
    this.testBannerBtn?.addEventListener('click', () => this.forceShowBanner());
    
    // Debug banner button click handler
    this.debugBannerBtn?.addEventListener('click', () => this.debugBanner());
    
    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => this.handleBeforeInstallPrompt(e));
    
    // Listen for app installed event
    window.addEventListener('appinstalled', () => this.handleAppInstalled());
  }

  /**
   * SIMPLE mobile device detection
   */
  isMobileDevice() {
    // Simple screen size check
    const isMobileScreen = window.innerWidth <= 1024;
    
    // Simple user agent check
    const isMobileUA = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Simple touch check
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // SIMPLE: If screen is small OR mobile UA OR touch device = mobile
    const isMobile = isMobileScreen || isMobileUA || isTouch;
    
    console.log('Mobile check:', {
      width: window.innerWidth,
      isMobileScreen,
      isMobileUA,
      isTouch,
      result: isMobile
    });
    
    return isMobile;
  }

  /**
   * Show banner on mobile devices - SIMPLE VERSION
   */
  showBannerOnMobile() {
    console.log('Window width:', window.innerWidth);
    console.log('Is mobile device:', this.isMobileDevice());
    
    // SIMPLE: If mobile, show banner. Period.
    if (this.isMobileDevice()) {
      console.log('✅ MOBILE DETECTED - SHOWING BANNER');
      this.showBanner();
    } else {
      console.log('❌ DESKTOP - HIDING BANNER');
      this.hideBanner();
    }
  }

  /**
   * Show banner - SIMPLE VERSION
   */
  showBanner() {
    if (!this.installBanner) {
      console.error('Banner element not found!');
      return;
    }
    
    console.log('SHOWING BANNER NOW');
    this.installBanner.style.display = 'block';
    this.installBanner.classList.add('show');
  }

  /**
   * Hide banner - SIMPLE VERSION
   */
  hideBanner() {
    if (!this.installBanner) return;
    
    console.log('HIDING BANNER');
    this.installBanner.style.display = 'none';
    this.installBanner.classList.remove('show', 'attention');
  }

  /**
   * Handle dismiss button click
   */
  handleDismissClick() {
    console.log('Dismiss button clicked');
    this.analytics.dismissClicked++;
    this.currentState = this.bannerStates.DISMISSED;
    
    // Store dismissal with timestamp
    localStorage.setItem('pwa-banner-dismissed', 'true');
    localStorage.setItem('pwa-banner-dismiss-time', Date.now().toString());
    
    this.hideBanner();
    
    // Track analytics
    this.trackEvent('banner_dismissed');
  }

  /**
   * Handle install button click
   */
  async handleInstallClick() {
    console.log('Install button clicked');
    this.analytics.installClicked++;
    this.trackEvent('install_clicked');
    
    if (!this.deferredPrompt) {
      console.warn('Install prompt not available - showing manual instructions');
      this.showInstallInstructions();
      return;
    }

    try {
      // Show the install prompt
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      
      console.log(`User response: ${outcome}`);
      
      if (outcome === 'accepted') {
        console.log('App installed successfully!');
        this.analytics.installSuccess++;
        this.currentState = this.bannerStates.INSTALLED;
        this.trackEvent('install_success');
        this.hideBanner();
      } else {
        this.trackEvent('install_declined');
      }
      
      this.deferredPrompt = null;
    } catch (error) {
      console.error('Error handling install prompt:', error);
      this.trackEvent('install_error');
      this.showInstallInstructions();
    }
  }

  /**
   * Show manual install instructions
   */
  showInstallInstructions() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    let message = 'To install this app: ';
    if (isIOS) {
      message += 'Tap the Share button and select "Add to Home Screen"';
    } else if (isAndroid) {
      message += 'Tap the menu (⋮) and select "Add to Home Screen"';
    } else {
      message += 'Look for the install option in your browser menu';
    }
    
    alert(message);
  }

  /**
   * Handle beforeinstallprompt event
   */
  handleBeforeInstallPrompt(e) {
    console.log('beforeinstallprompt event fired');
    // Don't prevent default - let the browser handle it naturally
    this.deferredPrompt = e;
    this.trackEvent('install_prompt_available');
    
    // Show banner if mobile and conditions are met
    if (this.isMobileDevice()) {
      this.showBannerOnMobile();
    }
  }

  /**
   * Handle app installed event
   */
  handleAppInstalled() {
    console.log('PWA was installed');
    this.currentState = this.bannerStates.INSTALLED;
    this.analytics.installSuccess++;
    this.trackEvent('app_installed');
    this.hideBanner();
  }

  /**
   * Track analytics events
   */
  trackEvent(eventName, data = {}) {
    const eventData = {
      event: eventName,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      isMobile: this.isMobileDevice(),
      ...data
    };
    
    console.log('Analytics Event:', eventData);
    
    // Store in localStorage for persistence
    const analytics = JSON.parse(localStorage.getItem('pwa-analytics') || '[]');
    analytics.push(eventData);
    
    // Keep only last 100 events
    if (analytics.length > 100) {
      analytics.splice(0, analytics.length - 100);
    }
    
    localStorage.setItem('pwa-analytics', JSON.stringify(analytics));
  }

  /**
   * Get analytics summary
   */
  getAnalyticsSummary() {
    return {
      ...this.analytics,
      totalEvents: JSON.parse(localStorage.getItem('pwa-analytics') || '[]').length,
      currentState: this.currentState
    };
  }

  /**
   * Register service worker
   */
  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }
}

// Export for use in main script
window.PWAManager = PWAManager;
