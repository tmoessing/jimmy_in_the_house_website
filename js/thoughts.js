/**
 * Thoughts Management Module
 * Picks the same thought for everyone each day and handles sharing it
 */

class ThoughtsManager {
  constructor() {
    this.THOUGHTS_URL = window.CONFIG?.THOUGHTS_URL || 'thoughts.txt';
    this.thoughtEl = document.getElementById('thought');
    this.shareBtn = document.getElementById('shareBtn');
    this.currentThought = null;

    if (this.shareBtn) {
      this.shareBtn.addEventListener('click', () => this.share());
    }
  }

  // Day 0 of the rotation. Changing this changes which thought shows each day.
  static EPOCH = Date.UTC(2025, 0, 1);

  /**
   * Number of whole days since EPOCH, using the visitor's local calendar date.
   * Date.UTC on the local y/m/d keeps daylight-saving shifts out of the math.
   * @returns {number} Day number
   */
  dayNumber(date = new Date()) {
    const today = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
    return Math.floor((today - ThoughtsManager.EPOCH) / 86400000);
  }

  /**
   * Small seeded random number generator (mulberry32)
   * @param {number} seed - Integer seed
   * @returns {function(): number} Generator returning floats in [0, 1)
   */
  seededRandom(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /**
   * Pick the index of a given day's thought. Every visitor gets the same
   * answer for the same date. Days are grouped into cycles as long as the
   * list; each cycle walks a different shuffled order, so no thought repeats
   * until every thought has been shown once.
   * @param {number} count - Number of thoughts
   * @param {number} day - Day number from dayNumber()
   * @returns {number} Index into the thoughts array
   */
  indexForDay(count, day) {
    const cycle = Math.floor(day / count);
    const position = ((day % count) + count) % count;
    const order = Array.from({ length: count }, (_, i) => i);
    const rand = this.seededRandom(cycle + 1);
    for (let i = count - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    return order[position];
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
   * Initialize and display today's thought
   */
  async init() {
    try {
      // Show loading state
      this.thoughtEl.textContent = 'Loading thoughts…';
      
      const thoughts = await this.loadThoughts();
      const idx = this.indexForDay(thoughts.length, this.dayNumber());
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
    
    this.currentThought = thought;
    this.thoughtEl.style.opacity = '0';
    this.thoughtEl.textContent = thought;
    if (this.shareBtn) this.shareBtn.hidden = false;
    
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

  /**
   * Share today's thought with the native share sheet, or copy it
   * to the clipboard where sharing isn't supported (most desktops).
   */
  async share() {
    if (!this.currentThought) return;
    const url = window.location.origin + window.location.pathname;
    const text = `"${this.currentThought}" — today's You Thought of the Day from Jimmy in the House`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Jimmy in the House', text, url });
      } catch (error) {
        // AbortError just means the person closed the share sheet
        if (error.name !== 'AbortError') console.warn('Share failed:', error);
      }
      return;
    }

    const message = `${text}\n${url}`;
    if (await this.copyText(message)) {
      this.flashShareLabel('Copied!');
    } else {
      // Last resort: show the text so the person can copy it by hand
      window.prompt('Copy today\'s thought:', message);
    }
  }

  /**
   * Copy text to the clipboard. Tries the modern Clipboard API first, which
   * only exists on HTTPS pages and is blocked in some in-app browsers, then
   * falls back to the older select-and-copy method that works almost anywhere.
   * @param {string} text - Text to copy
   * @returns {Promise<boolean>} Whether the copy succeeded
   */
  async copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (error) {
        console.warn('Clipboard API failed, trying fallback:', error);
      }
    }

    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    // Keep it off-screen; 16px font stops iOS from zooming in on focus
    area.style.cssText = 'position:fixed;top:0;left:-9999px;opacity:0;font-size:16px;';
    document.body.appendChild(area);
    try {
      area.focus();
      area.select();
      area.setSelectionRange(0, text.length); // needed on iOS
      return document.execCommand('copy');
    } catch (error) {
      console.warn('Fallback copy failed:', error);
      return false;
    } finally {
      area.remove();
      this.shareBtn.focus();
    }
  }

  /**
   * Briefly swap the share button's label, then restore it
   * @param {string} label - Temporary label
   */
  flashShareLabel(label) {
    const original = this.shareBtn.dataset.label || this.shareBtn.textContent;
    this.shareBtn.dataset.label = original;
    this.shareBtn.textContent = label;
    clearTimeout(this.labelTimer);
    this.labelTimer = setTimeout(() => {
      this.shareBtn.textContent = original;
    }, 2000);
  }
}

// Export for use in main script
window.ThoughtsManager = ThoughtsManager;
