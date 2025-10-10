/**
 * Performance Monitoring Utility
 * Tracks app performance and user experience metrics
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      loadTime: 0,
      thoughtsLoadTime: 0,
      pwaInitTime: 0,
      userInteractions: 0
    };
    
    this.startTime = performance.now();
    this.init();
  }

  /**
   * Initialize performance monitoring
   */
  init() {
    this.trackPageLoad();
    this.trackUserInteractions();
    this.trackMemoryUsage();
  }

  /**
   * Track page load performance
   */
  trackPageLoad() {
    window.addEventListener('load', () => {
      this.metrics.loadTime = performance.now() - this.startTime;
      console.log(`Page loaded in ${this.metrics.loadTime.toFixed(2)}ms`);
      
      // Track Core Web Vitals
      this.trackCoreWebVitals();
    });
  }

  /**
   * Track Core Web Vitals
   */
  trackCoreWebVitals() {
    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime.toFixed(2) + 'ms');
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        console.log('FID:', entry.processingStart - entry.startTime + 'ms');
      });
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    let clsValue = 0;
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      console.log('CLS:', clsValue.toFixed(4));
    }).observe({ entryTypes: ['layout-shift'] });
  }

  /**
   * Track user interactions
   */
  trackUserInteractions() {
    const interactionEvents = ['click', 'touchstart', 'keydown'];
    
    interactionEvents.forEach(eventType => {
      document.addEventListener(eventType, () => {
        this.metrics.userInteractions++;
      }, { passive: true });
    });
  }

  /**
   * Track memory usage (if available)
   */
  trackMemoryUsage() {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = performance.memory;
        console.log('Memory usage:', {
          used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + 'MB',
          total: Math.round(memory.totalJSHeapSize / 1024 / 1024) + 'MB',
          limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) + 'MB'
        });
      }, 30000); // Every 30 seconds
    }
  }

  /**
   * Track thoughts loading time
   */
  trackThoughtsLoad() {
    const startTime = performance.now();
    return () => {
      this.metrics.thoughtsLoadTime = performance.now() - startTime;
      console.log(`Thoughts loaded in ${this.metrics.thoughtsLoadTime.toFixed(2)}ms`);
    };
  }

  /**
   * Track PWA initialization time
   */
  trackPWAInit() {
    const startTime = performance.now();
    return () => {
      this.metrics.pwaInitTime = performance.now() - startTime;
      console.log(`PWA initialized in ${this.metrics.pwaInitTime.toFixed(2)}ms`);
    };
  }

  /**
   * Get performance report
   */
  getReport() {
    return {
      ...this.metrics,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      connection: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink
      } : null
    };
  }
}

// Export for use in main app
window.PerformanceMonitor = PerformanceMonitor;
