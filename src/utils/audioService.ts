/**
 * Daily Khata Pro - Web Audio Sound Engine
 * 100% offline, zero-asset, high-fidelity synthesizer audio feedback.
 * Works seamlessly across mobile, desktop, PWA, and iframe environments.
 */

type SoundType = 'income' | 'expense' | 'click' | 'keypad' | 'delete' | 'bell' | 'celebration' | 'error' | 'toggle' | 'save';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = false; // Default OFF as requested; users can enable in Settings
  private volume: number = 0.7; // 0.0 to 1.0
  private lastClickTime: number = 0;
  private listeners: Set<(enabled: boolean) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const storedEnabled = localStorage.getItem('khata_audio_enabled');
        if (storedEnabled !== null) {
          this.isEnabled = storedEnabled === 'true';
        } else {
          this.isEnabled = false;
        }
        const storedVol = localStorage.getItem('khata_audio_volume');
        if (storedVol !== null) {
          const parsed = parseFloat(storedVol);
          if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
            this.volume = parsed;
          }
        }
      } catch {
        // localStorage fallback
      }

      // Unlock Web Audio on first user interaction anywhere on screen
      const unlockAudio = () => {
        this.initContext();
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
        window.removeEventListener('pointerdown', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
      };

      window.addEventListener('pointerdown', unlockAudio, { passive: true, once: true });
      window.addEventListener('touchstart', unlockAudio, { passive: true, once: true });
      window.addEventListener('keydown', unlockAudio, { passive: true, once: true });
    }
  }

  private initContext(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      try {
        const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtxClass) {
          this.ctx = new AudioCtxClass();
        }
      } catch {
        this.ctx = null;
      }
    }
    return this.ctx;
  }

  public getAudioContext(): AudioContext | null {
    return this.initContext();
  }

  public isAudioActive(): boolean {
    return this.isEnabled;
  }

  public setAudioActive(enabled: boolean) {
    this.isEnabled = enabled;
    try {
      localStorage.setItem('khata_audio_enabled', enabled ? 'true' : 'false');
    } catch {
      // ignore
    }
    this.listeners.forEach((cb) => cb(enabled));
    if (enabled) {
      this.playToggle(true);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(vol: number) {
    const clamped = Math.max(0.1, Math.min(1.0, vol));
    this.volume = clamped;
    try {
      localStorage.setItem('khata_audio_volume', String(clamped));
    } catch {
      // ignore
    }
  }

  public subscribe(cb: (enabled: boolean) => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  /**
   * Universal sound dispatcher
   */
  public play(type: SoundType, keyChar?: string) {
    if (!this.isEnabled) return;

    // Trigger haptic vibration if supported on mobile
    this.vibrate(type);

    const ctx = this.initContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().then(() => this.synthesizeSound(type, keyChar)).catch(() => {});
    } else {
      this.synthesizeSound(type, keyChar);
    }
  }

  private vibrate(type: SoundType) {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        switch (type) {
          case 'click':
          case 'keypad':
            navigator.vibrate(5);
            break;
          case 'income':
            navigator.vibrate([20, 30, 40]);
            break;
          case 'expense':
            navigator.vibrate([15]);
            break;
          case 'celebration':
            navigator.vibrate([40, 40, 40, 60]);
            break;
          case 'bell':
            navigator.vibrate([80, 50, 100]);
            break;
          case 'delete':
          case 'error':
            navigator.vibrate(30);
            break;
          case 'save':
            navigator.vibrate([15, 30, 20]);
            break;
        }
      } catch {
        // ignore vibration rejections
      }
    }
  }

  private synthesizeSound(type: SoundType, keyChar?: string) {
    const ctx = this.ctx;
    if (!ctx || ctx.state !== 'running') return;

    switch (type) {
      case 'income':
        this.playIncome();
        break;
      case 'expense':
        this.playExpense();
        break;
      case 'click':
        this.playClick();
        break;
      case 'keypad':
        this.playKeypad(keyChar);
        break;
      case 'delete':
        this.playDelete();
        break;
      case 'bell':
        this.playBell();
        break;
      case 'celebration':
        this.playCelebration();
        break;
      case 'error':
        this.playError();
        break;
      case 'toggle':
        this.playToggle(true);
        break;
      case 'save':
        this.playIncome();
        break;
    }
  }

  /**
   * 💰 INCOME SOUND: Cash register chime & ascending major harmonic arpeggio
   */
  public playIncome() {
    const ctx = this.initContext();
    if (!ctx || !this.isEnabled) return;
    const run = () => {
      const now = ctx.currentTime;
      const vol = this.volume * 0.22;

      // Note 1: C5 (523.25 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now);
      gain1.gain.setValueAtTime(vol, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.18);

      // Note 2: E5 (659.25 Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, now + 0.06);
      gain2.gain.setValueAtTime(vol * 1.1, now + 0.06);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.06);
      osc2.stop(now + 0.26);

      // Note 3: G5 (783.99 Hz)
      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();
      osc3.type = 'triangle';
      osc3.frequency.setValueAtTime(783.99, now + 0.12);
      gain3.gain.setValueAtTime(vol * 1.2, now + 0.12);
      gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc3.connect(gain3);
      gain3.connect(ctx.destination);
      osc3.start(now + 0.12);
      osc3.stop(now + 0.35);

      // Sparkle Chime Ping: C6 (1046.5 Hz)
      const osc4 = ctx.createOscillator();
      const gain4 = ctx.createGain();
      osc4.type = 'sine';
      osc4.frequency.setValueAtTime(1046.5, now + 0.18);
      gain4.gain.setValueAtTime(vol * 0.9, now + 0.18);
      gain4.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
      osc4.connect(gain4);
      gain4.connect(ctx.destination);
      osc4.start(now + 0.18);
      osc4.stop(now + 0.55);
    };

    if (ctx.state === 'suspended') {
      ctx.resume().then(run).catch(() => {});
    } else {
      run();
    }
  }

  /**
   * 🛒 EXPENSE SOUND: Crisp fintech payment checkout confirmation pop
   */
  public playExpense() {
    const ctx = this.initContext();
    if (!ctx || !this.isEnabled) return;
    const run = () => {
      const now = ctx.currentTime;
      const vol = this.volume * 0.18;

      // Soft dual downward pitch: 440 Hz down to 260 Hz
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.14);

      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);

      // Subtle click pop at start
      const popOsc = ctx.createOscillator();
      const popGain = ctx.createGain();
      popOsc.type = 'triangle';
      popOsc.frequency.setValueAtTime(320, now + 0.02);
      popGain.gain.setValueAtTime(vol * 0.8, now + 0.02);
      popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      popOsc.connect(popGain);
      popGain.connect(ctx.destination);
      popOsc.start(now + 0.02);
      popOsc.stop(now + 0.08);
    };

    if (ctx.state === 'suspended') {
      ctx.resume().then(run).catch(() => {});
    } else {
      run();
    }
  }

  /**
   * 👆 TACTILE UI CLICK: Crisp acoustic micro-tap (like iPhone haptic click)
   */
  public playClick() {
    const ctx = this.initContext();
    if (!ctx || !this.isEnabled) return;

    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    if (now - this.lastClickTime < 25) return; // Prevent audio distortion on rapid clicks
    this.lastClickTime = now;

    const run = () => {
      const t = ctx.currentTime;
      const vol = this.volume * 0.08;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(750, t);
      osc.frequency.exponentialRampToValueAtTime(400, t + 0.025);

      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.025);
    };

    if (ctx.state === 'suspended') {
      ctx.resume().then(run).catch(() => {});
    } else {
      run();
    }
  }

  /**
   * 🔢 CALCULATOR KEYPAD SOUND: Subtle frequency response per key
   */
  public playKeypad(key?: string) {
    const ctx = this.initContext();
    if (!ctx || !this.isEnabled) return;

    const run = () => {
      const t = ctx.currentTime;
      const vol = this.volume * 0.09;

      // Map keys to pleasant tuned frequencies
      let freq = 520;
      if (key) {
        if (key >= '0' && key <= '9') {
          freq = 400 + parseInt(key, 10) * 35; // 400Hz to 715Hz
        } else if (key === '=') {
          freq = 880;
        } else if (key === '+' || key === '-' || key === '*' || key === '/') {
          freq = 660;
        } else if (key === 'C' || key === 'AC' || key === 'DEL') {
          freq = 320;
        }
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.85, t + 0.04);

      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.045);
    };

    if (ctx.state === 'suspended') {
      ctx.resume().then(run).catch(() => {});
    } else {
      run();
    }
  }

  /**
   * 🗑️ DELETE / REMOVE SOUND: Smooth low-pitch swoosh
   */
  public playDelete() {
    const ctx = this.initContext();
    if (!ctx || !this.isEnabled) return;
    const run = () => {
      const t = ctx.currentTime;
      const vol = this.volume * 0.16;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.exponentialRampToValueAtTime(140, t + 0.12);

      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.14);
    };

    if (ctx.state === 'suspended') {
      ctx.resume().then(run).catch(() => {});
    } else {
      run();
    }
  }

  /**
   * 🔔 BELL / REMINDER CHIME: Resonant dual-tone mindfulness bell
   */
  public playBell() {
    const ctx = this.initContext();
    if (!ctx || !this.isEnabled) return;
    const run = () => {
      const t = ctx.currentTime;
      const vol = this.volume * 0.2;

      // Note 1: D5 (587.33 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, t);
      gain1.gain.setValueAtTime(vol, t);
      gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(t);
      osc1.stop(t + 0.35);

      // Note 2: A5 (880 Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, t + 0.12);
      gain2.gain.setValueAtTime(vol * 1.2, t + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(t + 0.12);
      osc2.stop(t + 0.55);
    };

    if (ctx.state === 'suspended') {
      ctx.resume().then(run).catch(() => {});
    } else {
      run();
    }
  }

  /**
   * 🎯 CELEBRATION / GOAL ACHIEVED: Triumphant ascending 4-note chord flourish
   */
  public playCelebration() {
    const ctx = this.initContext();
    if (!ctx || !this.isEnabled) return;
    const run = () => {
      const now = ctx.currentTime;
      const vol = this.volume * 0.2;

      const notes = [
        { f: 523.25, time: 0.00, dur: 0.20 }, // C5
        { f: 659.25, time: 0.08, dur: 0.20 }, // E5
        { f: 783.99, time: 0.16, dur: 0.22 }, // G5
        { f: 1046.5, time: 0.24, dur: 0.50 }  // C6
      ];

      notes.forEach(({ f, time, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + time);
        gain.gain.setValueAtTime(vol, now + time);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + time + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + time);
        osc.stop(now + time + dur);
      });
    };

    if (ctx.state === 'suspended') {
      ctx.resume().then(run).catch(() => {});
    } else {
      run();
    }
  }

  /**
   * ⚠️ ERROR SOUND: Gentle soft double-buzz warning
   */
  public playError() {
    const ctx = this.initContext();
    if (!ctx || !this.isEnabled) return;
    const run = () => {
      const t = ctx.currentTime;
      const vol = this.volume * 0.14;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, t);
      osc.frequency.setValueAtTime(180, t + 0.08);

      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.18);
    };

    if (ctx.state === 'suspended') {
      ctx.resume().then(run).catch(() => {});
    } else {
      run();
    }
  }

  /**
   * 🎚️ TOGGLE SOUND: Upward blip for ON, downward for OFF
   */
  public playToggle(isOn: boolean) {
    const ctx = this.initContext();
    if (!ctx) return;
    const run = () => {
      const t = ctx.currentTime;
      const vol = this.volume * 0.12;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';

      if (isOn) {
        osc.frequency.setValueAtTime(480, t);
        osc.frequency.exponentialRampToValueAtTime(720, t + 0.08);
      } else {
        osc.frequency.setValueAtTime(600, t);
        osc.frequency.exponentialRampToValueAtTime(380, t + 0.08);
      }

      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.09);
    };

    if (ctx.state === 'suspended') {
      ctx.resume().then(run).catch(() => {});
    } else {
      run();
    }
  }
}

export const audioEngine = new AudioEngine();

// Convenience helper functions
export const playSound = (type: SoundType, keyChar?: string) => audioEngine.play(type, keyChar);
export const playIncomeSound = () => audioEngine.playIncome();
export const playExpenseSound = () => audioEngine.playExpense();
export const playClickSound = () => audioEngine.playClick();
export const playKeypadSound = (key?: string) => audioEngine.playKeypad(key);
export const playDeleteSound = () => audioEngine.playDelete();
export const playBellSound = () => audioEngine.playBell();
export const playCelebrationSound = () => audioEngine.playCelebration();
export const playErrorSound = () => audioEngine.playError();
export const playToggleSound = (isOn: boolean) => audioEngine.playToggle(isOn);
export const isAudioEnabled = () => audioEngine.isAudioActive();
export const setAudioEnabled = (enabled: boolean) => audioEngine.setAudioActive(enabled);
export const getAudioVolume = () => audioEngine.getVolume();
export const setAudioVolume = (vol: number) => audioEngine.setVolume(vol);
export const subscribeAudioChange = (cb: (enabled: boolean) => void) => audioEngine.subscribe(cb);
