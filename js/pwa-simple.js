/**
 * Enhanced PWA Banner - Improved Implementation
 */

console.log('🚀 Enhanced PWA Banner Loading...');

// Singleton banner manager
class EnhancedBanner {
  static instance = null;
  
  constructor() {
    if (EnhancedBanner.instance) {
      console.log('Banner already initialized, returning existing instance');
      return EnhancedBanner.instance;
    }
    
    this.banner = document.getElementById('installBanner');
    this.installBtn = document.getElementById('installBtn');
    this.dismissBtn = document.getElementById('dismissBtn');
    this.deferredPrompt = null;
    this.isInitialized = false;
    
    // Check if elements exist
    if (!this.banner || !this.installBtn || !this.dismissBtn) {
      console.error('Banner elements not found in DOM');
      return;
    }
    
    EnhancedBanner.instance = this;
    this.init();
  }
  
  init() {
    if (this.isInitialized) return;
    
    try {
      console.log('Initializing enhanced banner...');
      
      // Set up event listeners with error handling
      this.installBtn.addEventListener('click', (e) => this.handleInstall(e));
      this.dismissBtn.addEventListener('click', (e) => this.handleDismiss(e));
      
      // Add keyboard support
      this.installBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleInstall(e);
        }
      });
      
      this.dismissBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleDismiss(e);
        }
      });
      
      // Listen for install prompt
      window.addEventListener('beforeinstallprompt', (e) => {
        console.log('Install prompt available');
        this.deferredPrompt = e;
        this.updateInstallButton();
      });
      
      // Listen for app installed
      window.addEventListener('appinstalled', () => {
        console.log('App installed successfully');
        this.hideBanner();
        this.showSuccessMessage();
      });
      
      // Handle window resize
      this.handleResize = this.debounce(() => this.showBanner(), 250);
      window.addEventListener('resize', this.handleResize);
      
      // Check if user previously dismissed
      this.checkDismissalStatus();
      
      // Show banner on mobile
      this.showBanner();
      
      // Fallback: Force show banner after a delay if not visible
      setTimeout(() => {
        if (this.banner && this.banner.style.display === 'none') {
          console.log('Fallback: Forcing banner to show');
          this.banner.style.display = 'block';
          this.banner.classList.add('show');
        }
      }, 2000);
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing banner:', error);
    }
  }
  
  // Simple mobile detection
  isMobile() {
    return window.innerWidth <= 1024 || 
           /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  
  // Show banner
  showBanner() {
    if (this.isMobile()) {
      console.log('Mobile detected - showing banner');
      console.log('Banner element:', this.banner);
      this.banner.style.display = 'block';
      this.banner.classList.add('show');
      console.log('Banner display style:', this.banner.style.display);
      console.log('Banner classes:', this.banner.classList.toString());
    } else {
      console.log('Desktop detected - hiding banner');
      this.banner.style.display = 'none';
    }
  }
  
  // Handle install
  async handleInstall() {
    console.log('Install clicked');
    
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      const result = await this.deferredPrompt.userChoice;
      console.log('Install result:', result.outcome);
      
      if (result.outcome === 'accepted') {
        this.hideBanner();
      }
    } else {
      alert('To install: Look for the install option in your browser menu');
    }
  }
  
  // Handle dismiss
  handleDismiss() {
    console.log('Dismiss clicked');
    localStorage.setItem('banner-dismissed', 'true');
    this.hideBanner();
  }
  
  // Hide banner
  hideBanner() {
    this.banner.style.display = 'none';
  }
  
  // Check if user previously dismissed banner
  checkDismissalStatus() {
    const dismissed = localStorage.getItem('banner-dismissed');
    if (dismissed) {
      console.log('Banner was previously dismissed');
      this.banner.style.display = 'none';
      return true;
    }
    return false;
  }
  
  // Debounce utility
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  // Show success message
  showSuccessMessage() {
    console.log('App installed successfully!');
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new EnhancedBanner();
});

// Also try after a delay
setTimeout(() => {
  new EnhancedBanner();
}, 1000);
