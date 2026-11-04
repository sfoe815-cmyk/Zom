/**
 * Web Audio API procedural sound synthesizer for Aisle of the Dead
 * Completely self-contained, high quality, and zero external network dependencies!
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  private sharedNoiseBuffer: AudioBuffer | null = null;
  public isMuted: boolean = false;
  public volume: number = 0.5;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.initNoiseBuffer();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Pre-calculate a reusable 1-second white noise buffer once to avoid main-thread lag spikes
  private initNoiseBuffer() {
    if (!this.ctx || this.sharedNoiseBuffer) return;
    try {
      const sampleRate = this.ctx.sampleRate || 44100;
      const buffer = this.ctx.createBuffer(1, sampleRate, sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < sampleRate; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      this.sharedNoiseBuffer = buffer;
    } catch {
      // Audio buffer creation fallback
    }
  }

  private getNoiseBuffer(): AudioBuffer | null {
    if (!this.sharedNoiseBuffer && this.ctx) {
      this.initNoiseBuffer();
    }
    return this.sharedNoiseBuffer;
  }

  public resume() {
    this.initCtx();
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  // Gunshot - Pistol (Realistic 9mm snap with mechanical slide)
  public playPistol() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    
    // 1. Initial transient crack (highpass noise spike from shared buffer)
    const noiseBuffer = this.getNoiseBuffer();
    if (noiseBuffer) {
      const crackSource = this.ctx.createBufferSource();
      crackSource.buffer = noiseBuffer;

      const crackFilter = this.ctx.createBiquadFilter();
      crackFilter.type = 'highpass';
      crackFilter.frequency.setValueAtTime(3200, t);

      const crackGain = this.ctx.createGain();
      crackGain.gain.setValueAtTime(0.7 * this.volume, t);
      crackGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

      crackSource.connect(crackFilter);
      crackFilter.connect(crackGain);
      crackGain.connect(this.ctx.destination);
      crackSource.start(t);
      crackSource.stop(t + 0.04);
    }

    // 2. Body explosion punch
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(420, t);
    osc.frequency.exponentialRampToValueAtTime(38, t + 0.14);

    gain.gain.setValueAtTime(0.75 * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.15);

    // 3. Low-end barrel punch
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(140, t);
    subOsc.frequency.exponentialRampToValueAtTime(28, t + 0.18);
    subGain.gain.setValueAtTime(0.6 * this.volume, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(t);
    subOsc.stop(t + 0.19);
  }

  // Gunshot - Shotgun (Booming 12-gauge blast with metallic pump rack action)
  public playShotgun() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    
    // 1. Massive low sub kick (12-gauge powder explosion)
    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(180, t);
    sub.frequency.exponentialRampToValueAtTime(22, t + 0.35);
    subGain.gain.setValueAtTime(1.0 * this.volume, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    sub.connect(subGain);
    subGain.connect(this.ctx.destination);
    sub.start(t);
    sub.stop(t + 0.36);

    // 2. High-pressure muzzle blast noise
    const noiseBuffer = this.getNoiseBuffer();
    if (noiseBuffer) {
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2800, t);
      filter.frequency.exponentialRampToValueAtTime(220, t + 0.28);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.85 * this.volume, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(t);
      noise.stop(t + 0.28);
    }

    // 3. Midrange punch
    const midOsc = this.ctx.createOscillator();
    const midGain = this.ctx.createGain();
    midOsc.type = 'sawtooth';
    midOsc.frequency.setValueAtTime(320, t);
    midOsc.frequency.exponentialRampToValueAtTime(45, t + 0.2);
    midGain.gain.setValueAtTime(0.55 * this.volume, t);
    midGain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    midOsc.connect(midGain);
    midGain.connect(this.ctx.destination);
    midOsc.start(t);
    midOsc.stop(t + 0.21);

    // 4. Characteristic pump-action rack sound after blast
    setTimeout(() => {
      this.playMechanicalClick();
    }, 250);
  }

  // Gunshot - Rifle / M4A1 (Punchy 5.56 military crack and echo)
  public playRifle() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Supersonic transient crack
    const crackSize = Math.floor(this.ctx.sampleRate * 0.05);
    const crackBuffer = this.ctx.createBuffer(1, crackSize, this.ctx.sampleRate);
    const crackData = crackBuffer.getChannelData(0);
    for (let i = 0; i < crackSize; i++) {
      crackData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (crackSize * 0.2));
    }
    const crack = this.ctx.createBufferSource();
    crack.buffer = crackBuffer;

    const crackFilter = this.ctx.createBiquadFilter();
    crackFilter.type = 'bandpass';
    crackFilter.frequency.setValueAtTime(2400, t);
    crackFilter.Q.setValueAtTime(2, t);

    const crackGain = this.ctx.createGain();
    crackGain.gain.setValueAtTime(0.8 * this.volume, t);
    crackGain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    crack.connect(crackFilter);
    crackFilter.connect(crackGain);
    crackGain.connect(this.ctx.destination);
    crack.start(t);

    // Body explosion
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(480, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.16);

    gain.gain.setValueAtTime(0.7 * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.17);

    // Sub thump
    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(160, t);
    sub.frequency.exponentialRampToValueAtTime(32, t + 0.2);
    subGain.gain.setValueAtTime(0.65 * this.volume, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    sub.connect(subGain);
    subGain.connect(this.ctx.destination);
    sub.start(t);
    sub.stop(t + 0.21);
  }

  // Gunshot - Revolver .357 Magnum (Thunderous blast with heavy cylinder reverberation)
  public playRevolver() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Heavy sub kick
    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(210, t);
    sub.frequency.exponentialRampToValueAtTime(26, t + 0.32);
    subGain.gain.setValueAtTime(0.95 * this.volume, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
    sub.connect(subGain);
    subGain.connect(this.ctx.destination);
    sub.start(t);
    sub.stop(t + 0.33);

    // Explosive magnum roar
    const noiseBuffer = this.getNoiseBuffer();
    if (noiseBuffer) {
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1600, t);
      filter.frequency.exponentialRampToValueAtTime(280, t + 0.22);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.85 * this.volume, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(t);
      noise.stop(t + 0.22);
    }

    // Metallic hammer tone
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(360, t);
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.22);
    gain.gain.setValueAtTime(0.7 * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.23);
  }

  // Gunshot - Micro Uzi 9mm (Fast, high-cadence metallic chatter with sharp bolt snap)
  public playUzi() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // High velocity snap
    const noiseBuffer = this.getNoiseBuffer();
    if (noiseBuffer) {
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(2600, t);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.65 * this.volume, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(t);
      noise.stop(t + 0.05);
    }

    // Tight 9mm body pop
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(560, t);
    osc.frequency.exponentialRampToValueAtTime(70, t + 0.07);

    gain.gain.setValueAtTime(0.6 * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.08);

    // Metallic bolt click
    const bolt = this.ctx.createOscillator();
    const boltGain = this.ctx.createGain();
    bolt.type = 'square';
    bolt.frequency.setValueAtTime(1200, t);
    bolt.frequency.exponentialRampToValueAtTime(400, t + 0.03);
    boltGain.gain.setValueAtTime(0.3 * this.volume, t);
    boltGain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
    bolt.connect(boltGain);
    boltGain.connect(this.ctx.destination);
    bolt.start(t);
    bolt.stop(t + 0.04);
  }

  // Gunshot - .308 High Caliber Hunting Sniper Rifle (Huge punch, supersonic crack & long echo)
  public playSniper() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Heavy low punch
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(280, t);
    osc.frequency.exponentialRampToValueAtTime(18, t + 0.45);
    gain.gain.setValueAtTime(1.0 * this.volume, t);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.46);

    // Supersonic crack & boom
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.4);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2100, t);
    filter.frequency.exponentialRampToValueAtTime(320, t + 0.4);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.8 * this.volume, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.34);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    noise.start(t);
    noise.stop(t + 0.36);

    // Bolt action cycle after shot
    setTimeout(() => {
      this.playMechanicalClick();
    }, 350);
  }

  // Melee Weapon Swing (Knife / Spiked Bat)
  public playMeleeSwing() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(360, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.16);

    gain.gain.setValueAtTime(0.4 * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.17);
  }

  // Weapon Switch (Tactical holster unlatch & slide rack)
  public playWeaponSwitch() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    this.playClick(t, 850, 0.04);
    this.playClick(t + 0.08, 1200, 0.05);
  }
  public playReload() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Click 1 (mag release)
    this.playClick(t, 600, 0.04);
    // Click 2 (mag insert)
    this.playClick(t + 0.2, 900, 0.05);
    // Click 3 (slide pull)
    this.playClick(t + 0.45, 1200, 0.06);
  }

  private playClick(time: number, freq: number, dur: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);
    gain.gain.setValueAtTime(0.25 * this.volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(time);
    osc.stop(time + dur + 0.01);
  }

  public playMechanicalClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    this.playClick(this.ctx.currentTime, 750, 0.06);
  }

  // Dry Fire / Out of Ammo or Battery Click
  public playDryFire() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    this.playClick(this.ctx.currentTime, 450, 0.04);
  }

  // Headshot Critical Kill Sound
  public playHeadshot() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Squelch pop
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(150, t + 0.1);
    gain.gain.setValueAtTime(0.4 * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.11);

    // High metal ping chime
    const bell = this.ctx.createOscillator();
    const bellGain = this.ctx.createGain();
    bell.type = 'sine';
    bell.frequency.setValueAtTime(1800, t + 0.02);
    bell.frequency.exponentialRampToValueAtTime(900, t + 0.3);
    bellGain.gain.setValueAtTime(0.3 * this.volume, t + 0.02);
    bellGain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    bell.connect(bellGain);
    bellGain.connect(this.ctx.destination);
    bell.start(t + 0.02);
    bell.stop(t + 0.31);
  }

  // Zombie Body Hit
  public playZombieHit() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.08);
    gain.gain.setValueAtTime(0.35 * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.09);
  }

  // Zombie Groan
  public playZombieGroan(pitch: number = 1.0) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    const baseFreq = 95 * pitch;
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.linearRampToValueAtTime(baseFreq * 0.7, t + 0.35);
    osc.frequency.linearRampToValueAtTime(baseFreq * 0.85, t + 0.7);

    // Filter to make it throaty
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320 * pitch, t);
    filter.Q.setValueAtTime(3.0, t);

    gain.gain.setValueAtTime(0.05 * this.volume, t);
    gain.gain.linearRampToValueAtTime(0.2 * this.volume, t + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.75);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.8);
  }

  // Barricade Hit (Metal shopping cart smash)
  public playBarricadeHit() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Metallic rattle
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(540, t);
    osc.frequency.exponentialRampToValueAtTime(110, t + 0.18);
    gain.gain.setValueAtTime(0.4 * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.19);
  }

  // Explosion (Pipe bomb / propane)
  public playExplosion() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const noiseBuffer = this.getNoiseBuffer();
    if (noiseBuffer) {
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, t);
      filter.frequency.exponentialRampToValueAtTime(40, t + 0.7);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.9 * this.volume, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.68);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(t);
      noise.stop(t + 0.7);
    }
  }

  // Molotov Fire Whoosh
  public playFire() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const noiseBuffer = this.getNoiseBuffer();
    if (noiseBuffer) {
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(600, t);
      filter.frequency.exponentialRampToValueAtTime(1200, t + 0.35);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35 * this.volume, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(t);
      noise.stop(t + 0.4);
    }
  }

  // Crafting workbench sound
  public playCraftSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Hammer tap 1
    this.playClick(t, 1100, 0.05);
    // Wrench turn
    this.playClick(t + 0.12, 850, 0.06);
    // Hammer tap 2
    this.playClick(t + 0.24, 1300, 0.08);
  }

  // Eat / Drink consumable sound
  public playEatDrinkSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, t);
    osc.frequency.linearRampToValueAtTime(420, t + 0.15);
    gain.gain.setValueAtTime(0.3 * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.22);
  }

  // Heal / Medkit
  public playHealSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    [400, 520, 650].forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.08);
      gain.gain.setValueAtTime(0.2 * this.volume, t + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(t + idx * 0.08);
      osc.stop(t + idx * 0.08 + 0.16);
    });
  }

  // Cash Register Ding (Supermarket theme victory / day complete)
  public playCashRegister() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Chime 1
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, t);
    gain.gain.setValueAtTime(0.4 * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.52);

    // Chime 2
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(2100, t + 0.08);
    gain2.gain.setValueAtTime(0.35 * this.volume, t + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(t + 0.08);
    osc2.stop(t + 0.72);
  }

  // Spitter Zombie - Acid Spit Projectile Launch
  public playAcidSpit() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(750, t);
    osc.frequency.exponentialRampToValueAtTime(140, t + 0.22);

    gain.gain.setValueAtTime(0.55 * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.23);
  }

  // Acid Sizzle on Barricade (Melt)
  public playAcidSizzle() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const noiseBuffer = this.getNoiseBuffer();
    if (noiseBuffer) {
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3200, t);
      filter.Q.setValueAtTime(3, t);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35 * this.volume, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(t);
      noise.stop(t + 0.21);
    }
  }

  // Acid Projectile shot down in mid-air
  public playAcidDestroyed() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.15);

    gain.gain.setValueAtTime(0.65 * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.16);
  }

  // Incendiary Plasma Gun Continuous Hum & Beam Discharge
  public playPlasmaBeam() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880 + Math.random() * 80, t);
    osc.frequency.exponentialRampToValueAtTime(240, t + 0.08);

    gain.gain.setValueAtTime(0.4 * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.09);
  }

  // Baraq Security Guard 5-Headshot Snipe Ultimate
  public playAbilityBaraq() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    // Series of rapid precision magnum cracks
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.playRevolver();
      }, i * 85);
    }
  }

  // Shahd Pharmacist Fire Arrow Ultimate
  public playAbilityShahd() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Bow release whoosh
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(950, t + 0.18);
    gain.gain.setValueAtTime(0.6 * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.19);

    // Fire burst
    setTimeout(() => {
      this.playFire();
    }, 150);
  }
}

export const audio = new SoundManager();
