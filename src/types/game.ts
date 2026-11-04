export type GamePhase = 
  | 'TITLE'
  | 'DAY_HUB'
  | 'NIGHT_COMBAT'
  | 'NIGHT_SUMMARY'
  | 'GAME_OVER'
  | 'VICTORY';

export type GameMode = 'CAMPAIGN' | 'ENDLESS';

export type Language = 'ar' | 'en';

export type WeaponId = 
  | 'knife'
  | 'glock'
  | 'revolver'
  | 'uzi'
  | 'shotgun'
  | 'm4'
  | 'hunting_rifle'
  | 'spiked_bat'
  | 'plasma_rifle'
  | 'pkc';

export interface Weapon {
  id: WeaponId;
  name: string;
  nameAr: string;
  category: 'melee' | 'pistol' | 'smg' | 'shotgun' | 'rifle';
  damage: number;
  fireRate: number; // milliseconds between shots
  clipSize: number;
  reloadTime: number; // seconds
  spread: number; // angle radians
  pellets: number; // 1 for single bullet, 6-8 for shotgun
  range: number;
  unlocked: boolean;
  ammoType: '9mm' | '357' | 'shell' | 'rifle' | 'none' | 'energy';
  isAutomatic?: boolean;
  description: string;
  descriptionAr: string;
}

export type ResourceId = 
  | 'food'
  | 'water'
  | 'medkit'
  | 'scrapMetal'
  | 'alcohol'
  | 'cloth'
  | 'chemicals'
  | 'battery';

export interface Resources {
  food: number;
  water: number;
  medkit: number;
  scrapMetal: number;
  alcohol: number;
  cloth: number;
  chemicals: number;
  battery: number;
}

export interface AmmoStock {
  '9mm': number;
  '357': number;
  'shell': number;
  'rifle': number;
  'energy': number;
}

export interface CraftingRecipe {
  id: string;
  name: string;
  nameAr: string;
  category: 'medical' | 'weapon' | 'barricade' | 'ammo';
  cost: Partial<Resources>;
  outputCount: number;
  description: string;
  descriptionAr: string;
  craftEffect: (state: any) => void;
}

export interface Survivor {
  id: string;
  name: string;
  nameAr: string;
  role: string;
  roleAr: string;
  bioAr: string;
  bioEn: string;
  health: number;
  maxHealth: number;
  hunger: number; // 0 (starving) to 100 (full)
  thirst: number; // 0 (dehydrated) to 100 (hydrated)
  isRecruited: boolean;
  isDead: boolean;
  weaponId: WeaponId;
  perkAr: string;
  perkEn: string;
  accuracy: number; // 0.6 - 0.95
  abilityId: 'baraq_snipe' | 'shahd_fire_arrow' | 'abu_fahad_shockwave' | 'ziad_reinforce';
  abilityNameAr: string;
  abilityDescAr: string;
}

export interface BarricadeState {
  hp: number;
  maxHp: number;
  hasBarbedWire: boolean;
  hasElectricGrid: boolean;
  reinforcedLevel: number;
}

export interface NightStats {
  day: number;
  zombiesKilled: number;
  headshots: number;
  shotsFired: number;
  shotsHit: number;
  barricadeDamageTaken: number;
}

export type ZombieType = 
  | 'shopper'
  | 'runner'
  | 'pack_runner'
  | 'fat_zombie'
  | 'boss_glutton'
  | 'boss_tentacle'
  | 'brute'
  | 'armored'
  | 'spitter';

export interface TentacleData {
  id: number;
  hp: number;
  maxHp: number;
  isSevered: boolean;
  severBleedTimer?: number; // 4 seconds of blood spewing (240 frames)
  currentYOffset?: number;
  wavePhase: number;
}

export interface ZombieEntity {
  id: number;
  type: ZombieType;
  x: number;
  y: number;
  baseY?: number;
  waveOffset?: number;
  waveSpeed?: number;
  waveAmplitude?: number;
  hp: number;
  maxHp: number;
  speed: number;
  damage: number;
  attackCooldown: number;
  lastAttackTime: number;
  width: number;
  height: number;
  isDead: boolean;
  isBoss?: boolean;
  isDying?: boolean;
  headless?: boolean;
  bellyPulse?: number;
  bossEatTimer?: number;
  deathAnimTimer: number;
  color: string;
  headRadius: number;
  stepsTaken?: number;
  hasSpit?: boolean;
  isBurning?: boolean;
  burnTimer?: number;
  // Night 6 Tentacle Boss properties
  tentacles?: TentacleData[];
  tentaclesSeveredCount?: number;
  isPainStunned?: boolean;
  painStunTimer?: number;
  isFallingBackOnGround?: boolean;
  fallBackTimer?: number;
}

export interface AcidProjectile {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  meltDamageLeft: number;
  isAttached?: boolean;
  meltTimer?: number;
}

export interface LandmineEntity {
  id: number;
  x: number;
  y: number;
  radius: number;
  damage: number;
  isArmed: boolean;
  type: 'mine' | 'trap';
}

export interface BulletEntity {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  isHeadshotCapable: boolean;
  isPlayerBullet: boolean;
  ownerName?: string;
  life: number;
}

export interface ParticleEntity {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

export interface ThrowableEntity {
  id: number;
  type: 'molotov' | 'pipe_bomb';
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  fuseTimer: number;
  exploded: boolean;
}

export interface FireZoneEntity {
  id: number;
  x: number;
  y: number;
  radius: number;
  duration: number; // ms remaining
  damagePerSec: number;
}

export interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
  maxLife: number;
}
