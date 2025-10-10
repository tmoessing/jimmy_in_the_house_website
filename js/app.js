/**
 * Main Application Entry Point
 * Initializes the Jimmy in the House app with performance optimizations
 */

class App {
  constructor() {
    this.thoughtsManager = null;
    this.pwaManager = null;
    this.isInitialized = false;
  }

  /**
   * Initialize the application
   */
  async init() {
    if (this.isInitialized) return;
    
    try {
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.startApp());
      } else {
        this.startApp();
      }
    } catch (error) {
      console.error('Error initializing app:', error);
      this.showFallbackUI();
    }
  }

  /**
   * Start the application components
   */
  async startApp() {
    try {
      // Show loading indicator
      this.showLoadingState();
      
      // Initialize components in parallel for better performance
      const [thoughtsResult] = await Promise.allSettled([
        this.initializeThoughts(),
        this.initializePWA()
      ]);

      // Check if thoughts loaded successfully
      if (thoughtsResult.status === 'rejected') {
        console.warn('Thoughts failed to load, using fallback');
      }

      this.isInitialized = true;
      console.log('Jimmy in the House app initialized successfully');
    } catch (error) {
      console.error('Error starting app:', error);
      this.showFallbackUI();
    }
  }

  /**
   * Initialize thoughts manager
   */
  async initializeThoughts() {
    this.thoughtsManager = new ThoughtsManager();
    await this.thoughtsManager.init();
  }

  /**
   * Initialize PWA manager - using simple banner
   */
  initializePWA() {
    // Simple banner is handled by pwa-simple.js
    console.log('PWA initialization handled by simple banner');
  }

  /**
   * Show loading state
   */
  showLoadingState() {
    const thoughtEl = document.getElementById('thought');
    if (thoughtEl) {
      thoughtEl.textContent = 'Loading thoughts…';
    }
  }

  /**
   * Show fallback UI when initialization fails
   */
  showFallbackUI() {
    const thoughtEl = document.getElementById('thought');
    if (thoughtEl) {
      thoughtEl.textContent = 'Welcome to Jimmy in the House! Check back later for your daily thought.';
      thoughtEl.style.color = 'rgba(255, 255, 255, 0.8)';
    }
  }
}

// Initialize app when script loads
const app = new App();
app.init();
