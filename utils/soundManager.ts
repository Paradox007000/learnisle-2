"use client";

class SoundManager {
  private click: HTMLAudioElement | null = null;
  private correct: HTMLAudioElement | null = null;
  private wrong: HTMLAudioElement | null = null;
  private bgMusic: HTMLAudioElement | null = null;

  private volume = 0.7;
  private muted = false;
  private bgPlaying = false;

  /* ===============================
     INITIALIZE (ONLY IN BROWSER)
  =============================== */

  private init() {
    if (typeof window === "undefined") return;

    if (!this.click) {
      this.click = new Audio("/sounds/click.mp3");
      this.correct = new Audio("/sounds/correct.mp3");
      this.wrong = new Audio("/sounds/wrong.mp3");
    }
  }

  private updateVolume() {
    const vol = this.muted ? 0 : this.volume;

    if (this.click) this.click.volume = vol;
    if (this.correct) this.correct.volume = vol;
    if (this.wrong) this.wrong.volume = vol;
    if (this.bgMusic) this.bgMusic.volume = vol;
  }

  /* ===============================
     BACKGROUND MUSIC
  =============================== */

 playBackground() {
  if (typeof window === "undefined") return;

  if (this.bgPlaying) return;

  if (!this.bgMusic) {
    this.bgMusic = new Audio("/sounds/bg-music.mp3");
    this.bgMusic.loop = true;
  }

  this.updateVolume();

  this.bgMusic.play().then(() => {
    this.bgPlaying = true;
  }).catch(() => {
    // autoplay blocked — wait for interaction
  });
}

  stopBackground() {
    if (!this.bgMusic) return;

    this.bgMusic.pause();
    this.bgMusic.currentTime = 0;
    this.bgPlaying = false;
  }

  /* ===============================
     SFX
  =============================== */

  playClick() {
    this.init();
    if (!this.click) return;

    this.click.currentTime = 0;
    this.click.play();
  }

  playCorrect() {
    this.init();
    if (!this.correct) return;

    this.correct.currentTime = 0;
    this.correct.play();
  }

  playWrong() {
    this.init();
    if (!this.wrong) return;

    this.wrong.currentTime = 0;
    this.wrong.play();
  }

  /* ===============================
     SETTINGS
  =============================== */

  toggleMute() {
    this.muted = !this.muted;
    this.updateVolume();
  }

  setVolume(value: number) {
    this.volume = value;
    this.updateVolume();
  }

  getMuted() {
    return this.muted;
  }

  getVolume() {
    return this.volume;
  }
}

export const soundManager = new SoundManager();