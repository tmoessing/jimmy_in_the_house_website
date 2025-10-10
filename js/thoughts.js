/**
 * Thoughts Management Module
 * Handles loading and displaying daily thoughts
 */

class ThoughtsManager {
  constructor() {
    this.THOUGHTS_URL = window.CONFIG?.THOUGHTS_URL || 'thoughts.txt';
    this.STORAGE_KEY = window.CONFIG?.STORAGE_KEYS?.DAILY_THOUGHT || 'dailyThought';
    this.thoughtEl = document.getElementById('thought');
  }

  /**
   * Get today's date key in YYYY-MM-DD format
   * @returns {string} Today's date key
   */
  todayKey() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  /**
   * Read stored thought data from localStorage
   * @returns {Object|null} Stored data or null
   */
  readStore() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || 'null');
    } catch (error) {
      console.warn('Error reading from localStorage:', error);
      return null;
    }
  }

  /**
   * Write thought index to localStorage
   * @param {number} index - The thought index to store
   */
  writeStore(index) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({ 
        date: this.todayKey(), 
        index 
      }));
    } catch (error) {
      console.warn('Error writing to localStorage:', error);
    }
  }

  /**
   * Load thoughts from server with fallback
   * @returns {Promise<string[]>} Array of thought strings
   */
  async loadThoughts() {
    try {
      const res = await fetch(this.THOUGHTS_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error(res.statusText);
      
      const text = await res.text();
      const lines = text.split(/\r?\n/)
        .map(s => s.trim())
        .filter(Boolean);
      
      if (!lines.length) throw new Error('No thoughts found');
      return lines;
    } catch (error) {
      console.warn('Fallback thoughts loaded:', error);
      return window.CONFIG?.FALLBACK_THOUGHTS || [
        'Ship small, ship often.',
        'If it\'s not on the calendar, it does not exist.',
        'Done is a feature.',
        'Focus is a superpower.',
        'Touch grass. Then touch code.'
      ];
    }
  }

  /**
   * Clamp index to valid range
   * @param {number} i - Index to clamp
   * @param {number} len - Array length
   * @returns {number} Clamped index
   */
  clampIdx(i, len) {
    return Math.max(0, Math.min(i, len - 1));
  }

  /**
   * Initialize and display today's thought
   */
  async init() {
    try {
      // Show loading state
      this.thoughtEl.textContent = 'Loading thoughts…';
      
      const thoughts = await this.loadThoughts();
      const stored = this.readStore();
      const tkey = this.todayKey();

      let idx;
      if (stored && stored.date === tkey && Number.isInteger(stored.index)) {
        idx = this.clampIdx(stored.index, thoughts.length);
      } else {
        idx = Math.floor(Math.random() * thoughts.length);
        this.writeStore(idx);
      }

      // Smooth transition to new thought
      this.displayThought(thoughts[idx]);
    } catch (error) {
      console.error('Error initializing thoughts:', error);
      this.showError('Unable to load thoughts. Please check your connection.');
    }
  }

  /**
   * Display thought with smooth animation
   * @param {string} thought - The thought to display
   */
  displayThought(thought) {
    if (!this.thoughtEl) return;
    
    this.thoughtEl.style.opacity = '0';
    this.thoughtEl.textContent = thought;
    
    // Fade in animation
    requestAnimationFrame(() => {
      this.thoughtEl.style.transition = 'opacity 0.3s ease';
      this.thoughtEl.style.opacity = '1';
    });
  }

  /**
   * Show error message to user
   * @param {string} message - Error message to display
   */
  showError(message) {
    if (!this.thoughtEl) return;
    
    this.thoughtEl.textContent = message;
    this.thoughtEl.style.color = 'rgba(255, 255, 255, 0.7)';
    this.thoughtEl.style.fontStyle = 'italic';
  }
}

// Export for use in main script
window.ThoughtsManager = ThoughtsManager;
