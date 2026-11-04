import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Weapon, 
  WeaponId,
  Survivor, 
  BarricadeState, 
  AmmoStock, 
  NightStats, 
  ZombieEntity, 
  ZombieType,
  BulletEntity, 
  ParticleEntity, 
  ThrowableEntity, 
  FireZoneEntity, 
  FloatingText,
  LandmineEntity,
  AcidProjectile,
  TentacleData,
  Language,
  Resources
} from '../types/game';
import { audio } from '../utils/audio';
import { Shield, Bomb, Flame, RefreshCw, AlertTriangle, Volume2, VolumeX, Skull, Disc, Zap, Crosshair, ChevronUp, ChevronDown, Sparkles, Battery } from 'lucide-react';
import supermarketBarricadeBg from '../assets/images/supermarket_barricade_bg_1793184844751.jpg';

interface CombatCanvasProps {
  day: number;
  playerHealth: number;
  maxPlayerHealth: number;
  setPlayerHealth: React.Dispatch<React.SetStateAction<number>>;
  activeWeapon: Weapon;
  secondaryWeapon: Weapon | null;
  setActiveWeapon: (w: Weapon) => void;
  setSecondaryWeapon: React.Dispatch<React.SetStateAction<Weapon | null>>;
  allWeapons: Record<WeaponId, Weapon>;
  setAllWeapons: React.Dispatch<React.SetStateAction<Record<WeaponId, Weapon>>>;
  equippedAbilityId: string | null;
  setEquippedAbilityId?: (id: string | null) => void;
  barricade: BarricadeState;
  setBarricade: React.Dispatch<React.SetStateAction<BarricadeState>>;
  resources?: Resources;
  setResources?: React.Dispatch<React.SetStateAction<Resources>>;
  ammoStock: AmmoStock;
  setAmmoStock: React.Dispatch<React.SetStateAction<AmmoStock>>;
  survivors: Survivor[];
  setSurvivors: React.Dispatch<React.SetStateAction<Survivor[]>>;
  molotovCount: number;
  setMolotovCount: React.Dispatch<React.SetStateAction<number>>;
  pipeBombCount: number;
  setPipeBombCount: React.Dispatch<React.SetStateAction<number>>;
  mineCount: number;
  setMineCount: React.Dispatch<React.SetStateAction<number>>;
  onNightComplete: (stats: NightStats) => void;
  onGameOver: () => void;
  language: Language;
}

// Renders the Hero character based on the supermarket cashier survivor in the reference image
function drawHeroCharacter(
  ctx: CanvasRenderingContext2D,
  pX: number,
  pY: number,
  aimAngle: number,
  activeWeapon: Weapon,
  isShooting: boolean,
  currentTime: number,
  playerHealthRatio: number
) {
  ctx.save();

  // Supermarket Checkout Counter base right next to the player (from photo)
  ctx.save();
  const deskX = pX - 44;
  const deskY = pY - 26;

  // Wooden supply crate behind player
  ctx.fillStyle = '#78350f';
  ctx.fillRect(pX - 58, pY + 10, 22, 22);
  ctx.fillStyle = '#92400e';
  ctx.fillRect(pX - 56, pY + 12, 18, 18);
  ctx.strokeStyle = '#542005';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(pX - 56, pY + 12, 18, 18);
  ctx.beginPath();
  ctx.moveTo(pX - 56, pY + 12);
  ctx.lineTo(pX - 38, pY + 30);
  ctx.stroke();

  // Red checkout counter body (from photo: reddish counter with stainless top)
  ctx.fillStyle = '#991b1b';
  ctx.fillRect(deskX, deskY, 34, 52);
  ctx.fillStyle = '#b91c1c';
  ctx.fillRect(deskX + 2, deskY + 2, 30, 48);
  // Stainless steel counter top conveyor rail
  ctx.fillStyle = '#64748b';
  ctx.fillRect(deskX - 3, deskY - 3, 39, 7);
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(deskX - 1, deskY - 2, 35, 2);

  // Cash Register sitting on counter (from photo)
  ctx.fillStyle = '#334155';
  ctx.fillRect(deskX + 9, deskY - 16, 17, 13);
  ctx.fillStyle = '#475569';
  ctx.fillRect(deskX + 11, deskY - 14, 13, 9);
  // Register screen / keypad
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(deskX + 12, deskY - 13, 5, 4);
  ctx.fillStyle = '#fde047';
  ctx.fillRect(deskX + 18, deskY - 13, 5, 7);
  ctx.restore();

  // Hero Body Ground Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.ellipse(pX, pY + 28, 15, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // 1. LEGS (Dark Teal Work Trousers matching picture #165551 / #113e3b)
  // Left/Back Leg
  ctx.fillStyle = '#113e3b';
  ctx.fillRect(pX - 11, pY + 8, 9, 20);
  // Right/Front Leg (forward combat stance)
  ctx.fillStyle = '#175e59';
  ctx.fillRect(pX - 1, pY + 8, 10, 20);
  // Trouser seam shading
  ctx.fillStyle = '#0b2b29';
  ctx.fillRect(pX - 2, pY + 8, 2, 20);

  // Boots (Sturdy dark brown leather work boots #261409 / #452312)
  ctx.fillStyle = '#261409';
  ctx.fillRect(pX - 13, pY + 25, 12, 6); // left boot
  ctx.fillRect(pX - 2, pY + 25, 13, 6);  // right boot
  ctx.fillStyle = '#4a2612';
  ctx.fillRect(pX - 12, pY + 25, 10, 3);
  ctx.fillRect(pX - 1, pY + 25, 11, 3);

  // 2. TORSO & BELT
  // Brown Utility Belt with Gold Buckle and side holster
  ctx.fillStyle = '#78350f';
  ctx.fillRect(pX - 11, pY + 4, 22, 5);
  ctx.fillStyle = '#eab308'; // buckle
  ctx.fillRect(pX - 2, pY + 4, 4, 5);
  // Ammo/tool pouch on hip
  ctx.fillStyle = '#5c2709';
  ctx.fillRect(pX - 13, pY + 3, 5, 8);

  // Supermarket Cashier Polo Shirt (Vibrant Teal/Green #19726d)
  ctx.fillStyle = '#176560';
  ctx.fillRect(pX - 10, pY - 13, 20, 18);
  // Shirt collar and highlights
  ctx.fillStyle = '#228882';
  ctx.fillRect(pX - 8, pY - 12, 16, 4);
  // Collar flaps
  ctx.fillStyle = '#0f3f3c';
  ctx.beginPath();
  ctx.moveTo(pX - 5, pY - 13);
  ctx.lineTo(pX - 1, pY - 8);
  ctx.lineTo(pX - 3, pY - 8);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(pX + 5, pY - 13);
  ctx.lineTo(pX + 1, pY - 8);
  ctx.lineTo(pX + 3, pY - 8);
  ctx.fill();

  // 3. HEAD & BASEBALL CAP (Wearing green cap with visor facing right/mouse)
  // Neck
  ctx.fillStyle = '#f3c49f';
  ctx.fillRect(pX - 4, pY - 16, 8, 4);

  // Head base
  ctx.fillStyle = '#f3c49f';
  ctx.beginPath();
  ctx.arc(pX, pY - 20, 8.5, 0, Math.PI * 2);
  ctx.fill();

  // Face profile details (facing right)
  ctx.fillStyle = '#0f172a'; // Eye
  ctx.fillRect(pX + 3, pY - 21, 2, 2.5);
  ctx.fillStyle = '#451a03'; // Eyebrow
  ctx.fillRect(pX + 2, pY - 23, 4, 1.5);
  ctx.fillStyle = '#e5aa82'; // Nose tip
  ctx.fillRect(pX + 7, pY - 20, 2, 2.5);
  ctx.fillStyle = '#e5aa82'; // Ear
  ctx.fillRect(pX - 4, pY - 20, 2, 3.5);

  // Brown hair visible under cap at the back and side
  ctx.fillStyle = '#543216';
  ctx.fillRect(pX - 7, pY - 21, 4, 7);
  ctx.fillRect(pX - 5, pY - 17, 5, 3.5);

  // Green Baseball Cap (Dark teal cap with visor pointing forward #134e4a / #19726d)
  ctx.fillStyle = '#134e4a';
  ctx.beginPath();
  ctx.arc(pX - 1, pY - 23, 9, Math.PI * 0.9, Math.PI * 2.1);
  ctx.fill();
  ctx.fillStyle = '#19726d';
  ctx.beginPath();
  ctx.arc(pX - 1, pY - 23, 8, Math.PI * 0.95, Math.PI * 2.05);
  ctx.fill();
  // Cap top button
  ctx.fillStyle = '#0d3835';
  ctx.fillRect(pX - 2, pY - 32, 3, 2);

  // Cap Visor / Brim sticking out forward over forehead (facing right / target)
  ctx.fillStyle = '#0d3835';
  ctx.beginPath();
  ctx.moveTo(pX + 3, pY - 24);
  ctx.lineTo(pX + 12, pY - 23);
  ctx.lineTo(pX + 11, pY - 21);
  ctx.lineTo(pX + 3, pY - 22);
  ctx.closePath();
  ctx.fill();

  // 4. ARMS & WEAPON (Rotate smoothly with aim angle)
  ctx.save();
  ctx.translate(pX + 2, pY - 8);
  ctx.rotate(aimAngle);

  // Left Arm (back arm supporting gun)
  ctx.fillStyle = '#176560'; // teal short sleeve
  ctx.fillRect(0, -6, 7, 5);
  ctx.fillStyle = '#f3c49f'; // bare forearm
  ctx.fillRect(6, -5, 12, 3.5);

  // Right Arm (front arm holding gun grip)
  ctx.fillStyle = '#19726d'; // teal short sleeve
  ctx.fillRect(0, 0, 8, 6);
  ctx.fillStyle = '#f3c49f'; // bare forearm
  ctx.fillRect(7, 1, 13, 4);

  // Hands gripping weapon
  ctx.fillStyle = '#f3c49f';
  ctx.beginPath();
  ctx.arc(20, 2, 3.5, 0, Math.PI * 2);
  ctx.fill();

  // Weapon Rendering
  const recoilOffset = isShooting ? -3 : 0;
  ctx.translate(recoilOffset, 0);

  if (activeWeapon.id === 'plasma_rifle') {
    ctx.fillStyle = '#0e7490';
    ctx.fillRect(16, -2, 24, 7);
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(22, -1, 14, 3);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(38, -1, 6, 4);
    ctx.fillStyle = '#a5f3fc';
    ctx.fillRect(25, 0, 8, 2);
  } else if (activeWeapon.id === 'shotgun') {
    ctx.fillStyle = '#334155';
    ctx.fillRect(16, -1, 26, 6);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(22, -2, 22, 3);
    ctx.fillStyle = '#92400e';
    ctx.fillRect(26, 1, 10, 4);
  } else if (activeWeapon.id === 'hunting_rifle') {
    ctx.fillStyle = '#78350f';
    ctx.fillRect(12, 0, 18, 5);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(22, -2, 26, 3);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(20, -5, 12, 3);
  } else if (activeWeapon.id === 'uzi') {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(16, -3, 16, 8);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(30, -1, 8, 3);
    ctx.fillStyle = '#334155';
    ctx.fillRect(20, 5, 4, 10);
  } else {
    // Pistol Lvl 3 (from screenshot!)
    ctx.fillStyle = '#0f172a'; // slide
    ctx.fillRect(18, -2, 16, 5);
    ctx.fillStyle = '#334155';
    ctx.fillRect(16, 1, 6, 6); // grip
    ctx.fillStyle = '#64748b'; // barrel tip
    ctx.fillRect(33, -1, 2, 3);
  }

  // Starburst Muzzle Flash when shooting
  if (isShooting) {
    const muzzleX = activeWeapon.id === 'hunting_rifle' ? 48 : activeWeapon.id === 'shotgun' ? 44 : 35;
    
    // Outer fiery orange starburst
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(muzzleX, -1);
    ctx.lineTo(muzzleX + 16, -10);
    ctx.lineTo(muzzleX + 10, -2);
    ctx.lineTo(muzzleX + 22, 0);
    ctx.lineTo(muzzleX + 10, 2);
    ctx.lineTo(muzzleX + 16, 10);
    ctx.lineTo(muzzleX, 1);
    ctx.closePath();
    ctx.fill();

    // Inner bright yellow/white core
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.moveTo(muzzleX + 2, -1);
    ctx.lineTo(muzzleX + 12, -6);
    ctx.lineTo(muzzleX + 8, -1);
    ctx.lineTo(muzzleX + 16, 0);
    ctx.lineTo(muzzleX + 8, 1);
    ctx.lineTo(muzzleX + 12, 6);
    ctx.lineTo(muzzleX + 2, 1);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(muzzleX + 4, 0, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();

  // Flying brass casings ejecting (matching photo)
  if (isShooting) {
    ctx.fillStyle = '#facc15';
    ctx.fillRect(pX + 8, pY + 4, 4, 2);
    ctx.fillRect(pX - 4, pY + 12, 4, 2);
  }

  ctx.restore();
}

// Renders the Normal Zombie as seen in the reference image (olive-green rotting skin, tattered brown jacket, torn blue jeans, sunken hollow eyes with pale pupils, and outstretched shambling arms)
function drawNormalZombieShopper(
  ctx: CanvasRenderingContext2D,
  z: ZombieEntity,
  currentTime: number
) {
  ctx.save();
  const zLeft = z.x - z.width / 2;
  const zTop = z.y - z.height / 2;

  // Ground shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(z.x, z.y + z.height / 2 + 1, z.width / 2 + 2, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Shambling walk cycle
  const walkPhase = (currentTime * 0.006 * z.speed + (z.y % 20)) % (Math.PI * 2);
  const legSwing = Math.sin(walkPhase) * 5;
  const armBob = Math.cos(walkPhase) * 2.5;
  const headBob = Math.abs(Math.sin(walkPhase)) * 1.5;

  // 1. LEGS (Tattered Blue Denim Jeans as in photo #334e68)
  const legTop = z.y + 4;
  const legH = z.height / 2 - 4;

  // Back leg (swings back)
  ctx.fillStyle = '#243b53';
  ctx.fillRect(z.x - 2 - legSwing, legTop, 7, legH);
  // Back shoe (dirty dark scuffed shoe)
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(z.x - 4 - legSwing, legTop + legH - 3, 8, 4);

  // Front leg (swings forward)
  ctx.fillStyle = '#334e68';
  ctx.fillRect(z.x - 9 + legSwing, legTop, 8, legH);

  // Torn knee patch with exposed olive rotting flesh (matching photo!)
  ctx.fillStyle = '#82a567'; // olive green decaying skin
  ctx.fillRect(z.x - 8 + legSwing, legTop + 8, 5, 4);
  // Torn jagged denim edges around knee hole
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(z.x - 9 + legSwing, legTop + 7, 7, 1.5);
  ctx.fillRect(z.x - 9 + legSwing, legTop + 12, 7, 1.5);

  // Front shoe
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(z.x - 11 + legSwing, legTop + legH - 3, 9, 4);

  // 2. TORSO & TATTERED BROWN JACKET (from reference image)
  const torsoTop = zTop + z.headRadius * 1.3;
  const torsoH = z.height * 0.44;

  // Tattered brown jacket body
  ctx.fillStyle = '#785338';
  ctx.fillRect(zLeft + 2, torsoTop, z.width - 4, torsoH);

  // Jagged tattered jacket hem at bottom
  ctx.fillStyle = '#5c3d26';
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(zLeft + 3 + i * 6, torsoTop + torsoH);
    ctx.lineTo(zLeft + 6 + i * 6, torsoTop + torsoH + 3.5);
    ctx.lineTo(zLeft + 9 + i * 6, torsoTop + torsoH);
    ctx.fill();
  }

  // Torn dirty shirt in chest gap
  ctx.fillStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.moveTo(z.x - 4, torsoTop);
  ctx.lineTo(z.x, torsoTop + 14);
  ctx.lineTo(z.x + 3, torsoTop);
  ctx.fill();

  // Ragged tie or collar (some have red tie like in screenshot)
  if (Math.floor(z.id) % 2 === 0) {
    ctx.fillStyle = '#991b1b'; // ragged red tie
    ctx.fillRect(z.x - 2, torsoTop + 2, 3, 11);
  }

  // Jacket lapels & buttons
  ctx.fillStyle = '#5c3d26';
  ctx.fillRect(z.x - 5, torsoTop, 2, torsoH - 2);
  ctx.fillRect(z.x + 3, torsoTop, 2, torsoH - 2);

  // 3. ARMS & HANDS (Extended forward in classic zombie shambling reach towards hero!)
  // Back arm
  ctx.fillStyle = '#654228'; // brown jacket sleeve
  ctx.fillRect(z.x - 4, torsoTop + 2 + armBob, 6, 6);
  // Torn jagged sleeve cuff
  ctx.fillStyle = '#4c301c';
  ctx.fillRect(z.x - 6, torsoTop + 4 + armBob, 3, 3);
  // Rotting olive forearm & hand reaching left
  ctx.fillStyle = '#6e8d54';
  ctx.fillRect(z.x - 16, torsoTop + 4 + armBob, 12, 4);
  // Clawed fingers
  ctx.fillStyle = '#82a567';
  ctx.fillRect(z.x - 19, torsoTop + 3 + armBob, 4, 2);
  ctx.fillRect(z.x - 20, torsoTop + 5 + armBob, 5, 2);

  // Front arm (reaching out strongly)
  ctx.fillStyle = '#785338'; // brown sleeve
  ctx.fillRect(z.x - 1, torsoTop + 6 - armBob, 7, 7);
  // Frayed torn cuff
  ctx.fillStyle = '#5c3d26';
  ctx.fillRect(z.x - 4, torsoTop + 8 - armBob, 4, 4);
  // Olive green decaying forearm
  ctx.fillStyle = '#82a567';
  ctx.fillRect(z.x - 18, torsoTop + 8 - armBob, 15, 4.5);
  // Clawed outstretched zombie hand (reaching toward player)
  ctx.fillStyle = '#95bc79';
  ctx.fillRect(z.x - 22, torsoTop + 7 - armBob, 5, 2);
  ctx.fillRect(z.x - 23, torsoTop + 9 - armBob, 6, 2.5);
  ctx.fillRect(z.x - 21, torsoTop + 11 - armBob, 4, 1.8);

  // 4. HEAD & DECAYED FACE (Matching reference image)
  if (z.headless) {
    // Bloody neck stump if decapitated by headshot
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(z.x - 5, zTop + 6, 10, 8);
    ctx.fillStyle = '#7f1d1d';
    ctx.fillRect(z.x - 3, zTop + 3, 6, 4);
  } else {
    const headY = zTop + z.headRadius + headBob;

    // Head base (olive green rotting flesh #82a567)
    ctx.fillStyle = '#82a567';
    ctx.beginPath();
    ctx.arc(z.x - 1, headY, z.headRadius, 0, Math.PI * 2);
    ctx.fill();

    // Dark shading on back and jaw
    ctx.fillStyle = '#68884f';
    ctx.beginPath();
    ctx.arc(z.x + 2, headY + 1, z.headRadius - 1.5, -Math.PI / 2, Math.PI / 2);
    ctx.fill();

    // Messy disheveled dark brown hair tufts on top (as in photo)
    ctx.fillStyle = '#44301e';
    ctx.beginPath();
    ctx.arc(z.x - 1, headY - 2, z.headRadius, Math.PI * 1.05, Math.PI * 1.95);
    ctx.fill();
    // Spiky jagged hair strands sticking up
    ctx.beginPath();
    ctx.moveTo(z.x - 7, headY - 8);
    ctx.lineTo(z.x - 5, headY - 14);
    ctx.lineTo(z.x - 2, headY - 9);
    ctx.lineTo(z.x + 2, headY - 15);
    ctx.lineTo(z.x + 5, headY - 9);
    ctx.lineTo(z.x + 8, headY - 13);
    ctx.lineTo(z.x + 8, headY - 6);
    ctx.fill();

    // Deep sunken dark eye sockets (facing left towards player)
    ctx.fillStyle = '#24331b';
    ctx.beginPath();
    ctx.arc(z.x - 5, headY - 1, 3, 0, Math.PI * 2);
    ctx.arc(z.x + 1, headY - 1, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Creepy glowing pale yellowish-white pupils
    ctx.fillStyle = '#fef9c3';
    ctx.beginPath();
    ctx.arc(z.x - 6, headY - 1, 1.4, 0, Math.PI * 2);
    ctx.arc(z.x, headY - 1, 1.2, 0, Math.PI * 2);
    ctx.fill();
    // Tiny pinpoint bloodshot red center
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(z.x - 6, headY - 1, 0.7, 0, Math.PI * 2);
    ctx.arc(z.x, headY - 1, 0.6, 0, Math.PI * 2);
    ctx.fill();

    // Decaying gaping snarling mouth
    ctx.fillStyle = '#1a2217';
    ctx.beginPath();
    ctx.ellipse(z.x - 4, headY + 5, 4, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Crooked sharp decayed teeth
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(z.x - 6, headY + 3.5, 1.5, 1.5);
    ctx.fillRect(z.x - 3.5, headY + 3.5, 1.5, 1.5);
    ctx.fillRect(z.x - 5, headY + 5.5, 1.5, 1.5);

    // Dried blood streaks / rot marks on cheek and forehead
    ctx.fillStyle = '#5c241c';
    ctx.fillRect(z.x - 3, headY - 6, 2, 3);
    ctx.fillRect(z.x - 7, headY + 2, 2, 3);
  }

  // Health bar above zombie head
  const hpBarWidth = z.width + 10;
  const hpRatio = Math.max(0, z.hp / z.maxHp);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
  ctx.fillRect(z.x - hpBarWidth / 2, zTop - 13, hpBarWidth, 4);
  ctx.fillStyle = hpRatio > 0.4 ? '#22c55e' : '#ef4444';
  ctx.fillRect(z.x - hpBarWidth / 2, zTop - 13, hpBarWidth * hpRatio, 4);

  // Burning Flames if ignited
  if (z.isBurning && !z.isDead) {
    ctx.fillStyle = Math.random() < 0.5 ? '#f97316' : '#ea580c';
    ctx.beginPath();
    ctx.arc(z.x + (Math.random() - 0.5) * 8, z.y + (Math.random() - 0.5) * 14, 6 + Math.random() * 3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// 1. FAST RUNNER ZOMBIE (الزومبي السريع)
// Aggressive forward sprint lean, torn crimson athletic tank & shorts, gaunt ribcage, feral screaming maw & windblown hair
function drawRunnerZombie(
  ctx: CanvasRenderingContext2D,
  z: ZombieEntity,
  currentTime: number
) {
  ctx.save();
  const zLeft = z.x - z.width / 2;
  const zTop = z.y - z.height / 2;

  // Ground shadow - elongated and fast
  ctx.fillStyle = 'rgba(0, 0, 0, 0.32)';
  ctx.beginPath();
  ctx.ellipse(z.x - 3, z.y + z.height / 2 + 1, z.width / 2 + 5, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Rapid dynamic running stride cycle (high cadence)
  const runPhase = (currentTime * 0.016 + (z.y % 15)) % (Math.PI * 2);
  const legStride = Math.sin(runPhase) * 11;
  const armPump = Math.cos(runPhase) * 9;
  const headBob = Math.sin(runPhase * 2) * 2;

  // Sprint forward lean tilt
  ctx.translate(z.x, z.y);
  ctx.rotate(-0.15); // aggressive forward runner angle
  ctx.translate(-z.x, -z.y);

  // 1. LEGS (Ragged dark track shorts with yellow speed stripe + high-stride bare bruised calves)
  const legTop = z.y + 3;
  const legH = z.height / 2 - 2;

  // Back leg (kicking backwards high)
  ctx.fillStyle = '#1e293b'; // dark running shorts
  ctx.fillRect(z.x - 2 - legStride * 0.6, legTop, 7, 10);
  ctx.fillStyle = '#eab308'; // yellow racing trim
  ctx.fillRect(z.x + 3 - legStride * 0.6, legTop + 1, 1.5, 8);
  // Back bare leg & knee
  ctx.fillStyle = '#65824c';
  ctx.fillRect(z.x - 1 - legStride, legTop + 9, 5, legH - 8);
  // Scuffed running shoe
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(z.x - 4 - legStride, legTop + legH - 2, 8, 4);
  ctx.fillStyle = '#dc2626'; // red sneaker accent
  ctx.fillRect(z.x - 2 - legStride, legTop + legH - 2, 4, 2);

  // Front leg (striding forward low)
  ctx.fillStyle = '#334155'; // shorts front
  ctx.fillRect(z.x - 8 + legStride * 0.6, legTop, 8, 10);
  ctx.fillStyle = '#facc15'; // yellow stripe
  ctx.fillRect(z.x - 8 + legStride * 0.6, legTop + 1, 1.5, 8);
  // Front bare leg
  ctx.fillStyle = '#7a985e';
  ctx.fillRect(z.x - 9 + legStride, legTop + 9, 6, legH - 8);
  // Scraped bleeding knee
  ctx.fillStyle = '#991b1b';
  ctx.fillRect(z.x - 8 + legStride, legTop + 11, 4, 3);
  // Front running sneaker
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(z.x - 12 + legStride, legTop + legH - 2, 9, 4);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(z.x - 10 + legStride, legTop + legH - 2, 5, 2);

  // 2. TORSO & TANK TOP (Emaciated, gaunt ribcage, torn red athletic singlet)
  const torsoTop = zTop + z.headRadius * 1.3;
  const torsoH = z.height * 0.42;

  // Gaunt flesh background
  ctx.fillStyle = '#65824c';
  ctx.fillRect(zLeft + 3, torsoTop, z.width - 6, torsoH);

  // Torn Crimson Running Tank Top (#dc2626)
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(zLeft + 4, torsoTop + 2, z.width - 8, torsoH - 3);
  // White runner race bib / number patch on chest (shredded)
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(z.x - 5, torsoTop + 6, 9, 8);
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(z.x - 3, torsoTop + 8, 2, 4);
  ctx.fillRect(z.x + 1, torsoTop + 8, 2, 4);

  // Exposed rotting ribcage through shredded side
  ctx.fillStyle = '#495f37';
  ctx.fillRect(zLeft + 4, torsoTop + 9, 3, 2);
  ctx.fillRect(zLeft + 4, torsoTop + 13, 4, 2);
  ctx.fillRect(zLeft + 4, torsoTop + 17, 3, 2);

  // 3. ARMS & PUMPING SPRINT CLAWS
  // Back arm (pumping back with clenched claw)
  ctx.fillStyle = '#597341';
  ctx.fillRect(z.x + 4 - armPump, torsoTop + 3, 11, 4.5);
  ctx.fillStyle = '#7a985e';
  ctx.fillRect(z.x + 13 - armPump, torsoTop + 4, 5, 3.5);

  // Front arm (thrusting forward aggressively to slash)
  ctx.fillStyle = '#65824c';
  ctx.fillRect(z.x - 5 + armPump, torsoTop + 4, 5, 5);
  ctx.fillStyle = '#7a985e';
  ctx.fillRect(z.x - 18 + armPump, torsoTop + 6, 14, 4);
  // Sharp blackened running claws
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(z.x - 22 + armPump, torsoTop + 5, 5, 2);
  ctx.fillRect(z.x - 23 + armPump, torsoTop + 7, 6, 2);
  ctx.fillRect(z.x - 21 + armPump, torsoTop + 9, 4, 1.8);

  // 4. HEAD & FEROCIOUS SCREAMING FACE
  if (z.headless) {
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(z.x - 4, zTop + 4, 8, 7);
  } else {
    const headY = zTop + z.headRadius + headBob;

    // Sickly rotting head
    ctx.fillStyle = '#7a985e';
    ctx.beginPath();
    ctx.arc(z.x - 2, headY, z.headRadius - 1, 0, Math.PI * 2);
    ctx.fill();

    // Windblown wild spiky dark hair streaming backward from high speed sprint!
    ctx.fillStyle = '#261a12';
    ctx.beginPath();
    ctx.moveTo(z.x - 8, headY - 5);
    ctx.lineTo(z.x + 8, headY - 11);
    ctx.lineTo(z.x + 5, headY - 5);
    ctx.lineTo(z.x + 12, headY - 7);
    ctx.lineTo(z.x + 6, headY);
    ctx.lineTo(z.x + 13, headY - 2);
    ctx.lineTo(z.x + 4, headY + 5);
    ctx.lineTo(z.x - 4, headY - 7);
    ctx.fill();

    // Manic crazed sunken eye sockets
    ctx.fillStyle = '#221e16';
    ctx.beginPath();
    ctx.arc(z.x - 6, headY - 1, 2.8, 0, Math.PI * 2);
    ctx.arc(z.x - 1, headY - 1, 2.2, 0, Math.PI * 2);
    ctx.fill();

    // Burning feral eyes (amber/orange glow)
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(z.x - 7.5, headY - 2, 2, 2);
    ctx.fillRect(z.x - 2, headY - 2, 1.8, 1.8);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(z.x - 7, headY - 1.5, 1, 1);

    // Gaping wide screaming mouth
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.ellipse(z.x - 4, headY + 4, 3.5, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Sharp fangs
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(z.x - 6, headY + 2.5, 1.5, 2);
    ctx.fillRect(z.x - 3, headY + 2.5, 1.5, 2);
    ctx.fillRect(z.x - 5, headY + 5.5, 1.5, 2);
  }

  // Trailing dust puffs at running sneakers
  ctx.fillStyle = 'rgba(203, 213, 225, 0.45)';
  ctx.fillRect(z.x + 8 - legStride, legTop + legH - 1, 3, 3);
  ctx.fillRect(z.x + 13 - legStride, legTop + legH - 4, 2, 2);

  // Health bar above head
  const hpBarWidth = z.width + 8;
  const hpRatio = Math.max(0, z.hp / z.maxHp);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
  ctx.fillRect(z.x - hpBarWidth / 2, zTop - 13, hpBarWidth, 4);
  ctx.fillStyle = hpRatio > 0.4 ? '#f97316' : '#ef4444';
  ctx.fillRect(z.x - hpBarWidth / 2, zTop - 13, hpBarWidth * hpRatio, 4);

  // Burning Flames if ignited
  if (z.isBurning && !z.isDead) {
    ctx.fillStyle = Math.random() < 0.5 ? '#f97316' : '#ea580c';
    ctx.beginPath();
    ctx.arc(z.x + (Math.random() - 0.5) * 8, z.y + (Math.random() - 0.5) * 14, 6 + Math.random() * 3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// 2. FAT ZOMBIE (الزومبي السمين)
// Colossal bloated supermarket butcher / customer, stained apron with dried blood, double-chin, belly wobble, heavy stomping walk
function drawFatZombie(
  ctx: CanvasRenderingContext2D,
  z: ZombieEntity,
  currentTime: number
) {
  ctx.save();
  const zLeft = z.x - z.width / 2;
  const zTop = z.y - z.height / 2;

  // Heavy wide ground shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
  ctx.beginPath();
  ctx.ellipse(z.x, z.y + z.height / 2 + 1, z.width / 2 + 6, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // Heavy lumbering stomp walk & belly jiggle
  const walkPhase = (currentTime * 0.0045 * z.speed + (z.y % 15)) % (Math.PI * 2);
  const stompSwing = Math.sin(walkPhase) * 3.5;
  const bellyJiggle = Math.sin(walkPhase * 2) * 2;
  const heavyBob = Math.abs(Math.sin(walkPhase)) * 2;

  // 1. LEGS (Thick, stubby elephantine legs in grease-stained grey trousers)
  const legTop = z.y + 6;
  const legH = z.height / 2 - 6;

  // Back leg
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(z.x + 3 - stompSwing, legTop, 11, legH);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(z.x + 1 - stompSwing, legTop + legH - 4, 13, 5);

  // Front leg
  ctx.fillStyle = '#334155';
  ctx.fillRect(z.x - 13 + stompSwing, legTop, 12, legH);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(z.x - 16 + stompSwing, legTop + legH - 4, 15, 5);

  // 2. BLOATED ROUND TORSO & BUTCHER APRON
  const bellyRadiusX = z.width / 2 + 2;
  const bellyRadiusY = z.height * 0.38;

  // Bloated green flesh body
  ctx.fillStyle = '#58753d';
  ctx.beginPath();
  ctx.ellipse(z.x, z.y - 2 + heavyBob, bellyRadiusX, bellyRadiusY, 0, 0, Math.PI * 2);
  ctx.fill();

  // Highlight bloated belly curve
  ctx.fillStyle = '#6e9352';
  ctx.beginPath();
  ctx.ellipse(z.x - 3, z.y - 2 + heavyBob + bellyJiggle, bellyRadiusX - 3, bellyRadiusY - 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Stretched white undershirt bursting at sides
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(z.x - bellyRadiusX + 3, z.y - 18 + heavyBob, bellyRadiusX * 2 - 6, 14);

  // Dirty Supermarket Butcher Apron (#f1f5f9) covering protruding stomach
  ctx.fillStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.moveTo(z.x - 10, z.y - 16 + heavyBob);
  ctx.lineTo(z.x + 10, z.y - 16 + heavyBob);
  ctx.lineTo(z.x + 16, z.y + 16 + heavyBob + bellyJiggle);
  ctx.lineTo(z.x - 17, z.y + 16 + heavyBob + bellyJiggle);
  ctx.closePath();
  ctx.fill();

  // Apron neck strap & waist ties
  ctx.fillStyle = '#475569';
  ctx.fillRect(z.x - 11, z.y - 22 + heavyBob, 3, 7);
  ctx.fillRect(z.x + 8, z.y - 22 + heavyBob, 3, 7);
  ctx.fillRect(z.x - bellyRadiusX + 2, z.y - 4 + heavyBob, bellyRadiusX * 2 - 4, 2);

  // Realistic Dried Blood & Meat Spatters on Apron (#991b1b, #7f1d1d)
  ctx.fillStyle = '#7f1d1d';
  ctx.fillRect(z.x - 8, z.y - 6 + heavyBob, 6, 8);
  ctx.fillRect(z.x - 11, z.y - 2 + heavyBob, 4, 4);
  ctx.fillRect(z.x + 4, z.y + 2 + heavyBob, 7, 9);
  ctx.fillRect(z.x + 8, z.y + 10 + heavyBob, 5, 4);
  ctx.fillStyle = '#991b1b';
  ctx.fillRect(z.x - 6, z.y - 4 + heavyBob, 3, 4);
  ctx.fillRect(z.x + 5, z.y + 4 + heavyBob, 4, 5);

  // Greasy stains on hem
  ctx.fillStyle = '#78350f';
  ctx.fillRect(z.x - 12, z.y + 12 + heavyBob, 8, 3);

  // 3. MEATY BLOATED ARMS & CLUB FISTS
  // Back arm
  ctx.fillStyle = '#58753d';
  ctx.fillRect(z.x + 9, z.y - 12 + heavyBob, 8, 16);
  ctx.fillStyle = '#495f37';
  ctx.fillRect(z.x + 8, z.y + 2 + heavyBob, 8, 6);

  // Front arm (hanging heavy, swinging forward like a club)
  ctx.fillStyle = '#6e9352';
  ctx.fillRect(z.x - 17, z.y - 10 + heavyBob, 9, 18);
  // Bulky clenched fist
  ctx.fillStyle = '#58753d';
  ctx.fillRect(z.x - 20, z.y + 6 + heavyBob, 11, 8);
  ctx.fillStyle = '#3f5330';
  ctx.fillRect(z.x - 21, z.y + 8 + heavyBob, 4, 2);

  // 4. HEAD, JOWLY DOUBLE-CHIN & VACANT BLOATED FACE
  if (z.headless) {
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(z.x - 7, zTop + 6, 14, 10);
  } else {
    const headY = zTop + z.headRadius + heavyBob - 2;

    // Fat double-chin bulge
    ctx.fillStyle = '#58753d';
    ctx.beginPath();
    ctx.ellipse(z.x, headY + 5, z.headRadius + 2, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Puffy bloated head
    ctx.fillStyle = '#6e9352';
    ctx.beginPath();
    ctx.arc(z.x - 1, headY, z.headRadius, 0, Math.PI * 2);
    ctx.fill();

    // Greasy bald crown with thin greasy black hair strands at temples
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(z.x - z.headRadius + 1, headY - 4, 3, 8);
    ctx.fillRect(z.x + z.headRadius - 4, headY - 4, 3, 8);
    ctx.fillRect(z.x - 4, headY - z.headRadius, 8, 2);

    // Beady blank dead-white eyes (sunken into puffy bloated sockets)
    ctx.fillStyle = '#26331e';
    ctx.fillRect(z.x - 7, headY - 3, 4, 3);
    ctx.fillRect(z.x + 1, headY - 3, 4, 3);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(z.x - 6.5, headY - 2.5, 2.5, 2);
    ctx.fillRect(z.x + 1.5, headY - 2.5, 2.5, 2);
    ctx.fillStyle = '#eab308'; // sickly yellow pupil speck
    ctx.fillRect(z.x - 6, headY - 2, 1, 1);
    ctx.fillRect(z.x + 2, headY - 2, 1, 1);

    // Sagging open mouth drooling dark green bile onto apron
    ctx.fillStyle = '#182014';
    ctx.beginPath();
    ctx.ellipse(z.x - 3, headY + 5, 4.5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    // Rotten yellow teeth stubs
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(z.x - 6, headY + 4, 2, 1.5);
    ctx.fillRect(z.x - 1, headY + 4, 2, 1.5);

    // Green bile drool drip hanging down chin
    ctx.fillStyle = '#15803d';
    ctx.fillRect(z.x - 4, headY + 7, 2, 5);
    ctx.fillRect(z.x - 3.5, headY + 11, 1.5, 3);
  }

  // Health bar above head (wide for high HP!)
  const hpBarWidth = z.width + 12;
  const hpRatio = Math.max(0, z.hp / z.maxHp);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(z.x - hpBarWidth / 2, zTop - 14, hpBarWidth, 5);
  ctx.fillStyle = hpRatio > 0.4 ? '#10b981' : '#ef4444';
  ctx.fillRect(z.x - hpBarWidth / 2, zTop - 14, hpBarWidth * hpRatio, 5);

  // Burning Flames if ignited
  if (z.isBurning && !z.isDead) {
    ctx.fillStyle = Math.random() < 0.5 ? '#f97316' : '#ea580c';
    ctx.beginPath();
    ctx.arc(z.x + (Math.random() - 0.5) * 12, z.y + (Math.random() - 0.5) * 16, 8 + Math.random() * 3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// 3. SPITTER ZOMBIE (زومبي الباصق)
// Toxic mutated janitor, tattered hazardous jumpsuit, pulsating bioluminescent acid sac in throat, dripping green venom
function drawSpitterZombie(
  ctx: CanvasRenderingContext2D,
  z: ZombieEntity,
  currentTime: number
) {
  ctx.save();
  const zLeft = z.x - z.width / 2;
  const zTop = z.y - z.height / 2;

  // Ground shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(z.x, z.y + z.height / 2 + 1, z.width / 2 + 2, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Crooked twitching hunched walk cycle
  const walkPhase = (currentTime * 0.007 * z.speed + (z.y % 15)) % (Math.PI * 2);
  const legSwing = Math.sin(walkPhase) * 4.5;
  const hunchTwitch = Math.sin(walkPhase * 2) * 1.5;
  const acidPulse = Math.sin(currentTime * 0.009) * 2;

  // 1. LEGS (Tattered biohazard yellow janitor pants + heavy rubber chemical boots)
  const legTop = z.y + 4;
  const legH = z.height / 2 - 4;

  // Back leg
  ctx.fillStyle = '#854d0e';
  ctx.fillRect(z.x - 2 - legSwing, legTop, 7, legH);
  ctx.fillStyle = '#0f172a'; // black rubber boot
  ctx.fillRect(z.x - 4 - legSwing, legTop + legH - 4, 9, 5);

  // Front leg
  ctx.fillStyle = '#ca8a04'; // bright dirty hazard yellow
  ctx.fillRect(z.x - 9 + legSwing, legTop, 8, legH);
  // Torn pant leg revealing toxic greenish-black corroded flesh
  ctx.fillStyle = '#064e3b';
  ctx.fillRect(z.x - 8 + legSwing, legTop + 6, 6, 5);
  // Front rubber boot
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(z.x - 12 + legSwing, legTop + legH - 4, 10, 5);

  // 2. HUNTER CROOKED TORSO & HAZMAT JUMPSUIT
  const torsoTop = zTop + z.headRadius * 1.4;
  const torsoH = z.height * 0.42;

  // Yellow janitor vest/jumpsuit
  ctx.fillStyle = '#a16207';
  ctx.fillRect(zLeft + 2, torsoTop, z.width - 4, torsoH);

  // Black diagonal hazard warning stripes across chest
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.moveTo(zLeft + 4, torsoTop + 2);
  ctx.lineTo(zLeft + 9, torsoTop + 2);
  ctx.lineTo(zLeft + 4, torsoTop + 14);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(zLeft + 12, torsoTop + 2);
  ctx.lineTo(zLeft + 18, torsoTop + 2);
  ctx.lineTo(zLeft + 8, torsoTop + 18);
  ctx.lineTo(zLeft + 4, torsoTop + 18);
  ctx.fill();

  // 3. GLOWING BIOLUMINESCENT ACID SAC IN THROAT & UPPER CHEST!
  // Outer toxic aura
  ctx.fillStyle = 'rgba(52, 211, 153, 0.35)';
  ctx.beginPath();
  ctx.ellipse(z.x - 5, torsoTop + 6, 9 + acidPulse, 11 + acidPulse, 0, 0, Math.PI * 2);
  ctx.fill();

  // Core pulsating acid sac
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.ellipse(z.x - 5, torsoTop + 6, 6.5 + acidPulse * 0.6, 8.5 + acidPulse * 0.6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Intense neon radioactive center
  ctx.fillStyle = '#6ee7b7';
  ctx.beginPath();
  ctx.ellipse(z.x - 6, torsoTop + 5, 3.5, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Rising acid bubbles
  ctx.fillStyle = '#a7f3d0';
  ctx.fillRect(z.x - 4, torsoTop - 1, 2, 2);
  ctx.fillRect(z.x - 7, torsoTop + 2, 1.5, 1.5);

  // 4. ARMS WITH CORRODED GAUNTLETS
  // Back arm
  ctx.fillStyle = '#065f46';
  ctx.fillRect(z.x + 2, torsoTop + 3, 6, 8);
  ctx.fillStyle = '#10b981';
  ctx.fillRect(z.x + 6, torsoTop + 9, 3, 4);

  // Front arm (stretched forward, dripping venom)
  ctx.fillStyle = '#a16207'; // sleeve
  ctx.fillRect(z.x - 4, torsoTop + 4, 7, 7);
  // Corroded dark green gauntlet forearm
  ctx.fillStyle = '#065f46';
  ctx.fillRect(z.x - 18, torsoTop + 6, 15, 4.5);
  // Melted acidic claws
  ctx.fillStyle = '#34d399';
  ctx.fillRect(z.x - 22, torsoTop + 5, 5, 2.5);
  ctx.fillRect(z.x - 23, torsoTop + 8, 6, 2.5);
  // Acid droplet falling from claws
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(z.x - 22, torsoTop + 12, 2, 3);

  // 5. CROOKED HEAD & ACID-DROOLING JAW
  if (z.headless) {
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(z.x - 5, zTop + 5, 10, 8);
  } else {
    const headX = z.x - 5; // hunched forward posture
    const headY = zTop + z.headRadius + hunchTwitch;

    // Sickly dark emerald toxic mutant head
    ctx.fillStyle = '#065f46';
    ctx.beginPath();
    ctx.arc(headX, headY, z.headRadius, 0, Math.PI * 2);
    ctx.fill();

    // Toxic green blisters / pustules on skull
    ctx.fillStyle = '#34d399';
    ctx.fillRect(headX - 1, headY - z.headRadius + 1, 3, 3);
    ctx.fillRect(headX + 4, headY - 4, 2.5, 2.5);

    // Glowing acidic eyes
    ctx.fillStyle = '#022c22';
    ctx.fillRect(headX - 6, headY - 2, 4, 3);
    ctx.fillRect(headX + 1, headY - 2, 3.5, 3);
    ctx.fillStyle = '#4ade80'; // radioactive green pupils
    ctx.fillRect(headX - 5.5, headY - 1.5, 2, 2);
    ctx.fillRect(headX + 1.5, headY - 1.5, 2, 2);

    // Gaping lower jaw dripping corrosive acid
    ctx.fillStyle = '#064e3b';
    ctx.fillRect(headX - 6, headY + 4, 7, 5);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(headX - 5, headY + 7, 3, 5); // dripping acid strand
    ctx.fillRect(headX - 4.5, headY + 12, 2, 3);
  }

  // Health bar above head
  const hpBarWidth = z.width + 10;
  const hpRatio = Math.max(0, z.hp / z.maxHp);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
  ctx.fillRect(z.x - hpBarWidth / 2, zTop - 13, hpBarWidth, 4);
  ctx.fillStyle = hpRatio > 0.4 ? '#10b981' : '#ef4444';
  ctx.fillRect(z.x - hpBarWidth / 2, zTop - 13, hpBarWidth * hpRatio, 4);

  // Burning Flames if ignited
  if (z.isBurning && !z.isDead) {
    ctx.fillStyle = Math.random() < 0.5 ? '#f97316' : '#ea580c';
    ctx.beginPath();
    ctx.arc(z.x + (Math.random() - 0.5) * 8, z.y + (Math.random() - 0.5) * 14, 6 + Math.random() * 3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// 4. GLUTTON BOSS (زعيم الزومبي الأكول - رئيس قسم اللحوم)
// Colossal mutated supermarket butcher with giant meat cleaver, toothy stomach maw, iron meat hooks, and menacing aura
function drawGluttonBoss(
  ctx: CanvasRenderingContext2D,
  z: ZombieEntity,
  currentTime: number,
  language: 'ar' | 'en'
) {
  ctx.save();
  const zLeft = z.x - z.width / 2;
  const zTop = z.y - z.height / 2;

  // Massive boss ground shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.beginPath();
  ctx.ellipse(z.x, z.y + z.height / 2 + 2, z.width / 2 + 12, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // Heavy stomping walk cycle
  const walkPhase = (currentTime * 0.0035 * z.speed + (z.y % 15)) % (Math.PI * 2);
  const stompSwing = Math.sin(walkPhase) * 4;
  const heavyBob = Math.abs(Math.sin(walkPhase)) * 2.5;
  const mawChomp = Math.abs(Math.sin(walkPhase * 2)) * 3;
  const bellyPulse = (z.bellyPulse || 0);

  // 1. MASSIVE STUBBY LEGS IN HEAVY BUTCHER BOOTS
  const legTop = z.y + 10;
  const legH = z.height / 2 - 10;

  // Back leg
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(z.x + 5 - stompSwing, legTop, 15, legH);
  ctx.fillStyle = '#475569'; // steel toe
  ctx.fillRect(z.x + 3 - stompSwing, legTop + legH - 5, 18, 6);

  // Front leg
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(z.x - 18 + stompSwing, legTop, 16, legH);
  ctx.fillStyle = '#64748b'; // steel toe cap
  ctx.fillRect(z.x - 22 + stompSwing, legTop + legH - 5, 20, 6);

  // 2. COLOSSAL MUTATED BUTCHER TORSO & BLOOD-SOAKED APRON
  const bossRadiusX = (z.width / 2) + Math.max(0, bellyPulse);
  const bossRadiusY = (z.height * 0.42) + Math.max(0, bellyPulse);

  // Rotting mutated dark olive flesh
  ctx.fillStyle = z.isDying ? '#7f1d1d' : '#14532d';
  ctx.beginPath();
  ctx.ellipse(z.x, z.y - 2 + heavyBob, bossRadiusX, bossRadiusY, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#991b1b';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Leather reinforced butcher apron (#f8fafc with blood)
  ctx.fillStyle = '#f1f5f9';
  ctx.beginPath();
  ctx.moveTo(z.x - 18, z.y - 22 + heavyBob);
  ctx.lineTo(z.x + 18, z.y - 22 + heavyBob);
  ctx.lineTo(z.x + 24, z.y + 20 + heavyBob);
  ctx.lineTo(z.x - 24, z.y + 20 + heavyBob);
  ctx.closePath();
  ctx.fill();

  // Leather shoulder harnesses with iron rivets
  ctx.fillStyle = '#451a03';
  ctx.fillRect(z.x - 17, z.y - 28 + heavyBob, 6, 12);
  ctx.fillRect(z.x + 11, z.y - 28 + heavyBob, 6, 12);
  ctx.fillStyle = '#cbd5e1'; // iron rivets
  ctx.fillRect(z.x - 15, z.y - 24 + heavyBob, 2, 2);
  ctx.fillRect(z.x + 13, z.y - 24 + heavyBob, 2, 2);

  // Heavy Iron Meat Hooks hanging on chains across chest
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(z.x - 14, z.y - 12 + heavyBob, 2, 9);
  ctx.fillRect(z.x + 12, z.y - 12 + heavyBob, 2, 9);
  // Curved meat hook ends
  ctx.fillStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.arc(z.x - 12, z.y - 3 + heavyBob, 3, 0, Math.PI);
  ctx.arc(z.x + 14, z.y - 3 + heavyBob, 3, 0, Math.PI);
  ctx.stroke();

  // Fresh & dried blood splashes on butcher apron
  ctx.fillStyle = '#7f1d1d';
  ctx.fillRect(z.x - 14, z.y - 10 + heavyBob, 12, 16);
  ctx.fillRect(z.x + 2, z.y + 2 + heavyBob, 16, 14);
  ctx.fillStyle = '#b91c1c';
  ctx.fillRect(z.x - 10, z.y - 6 + heavyBob, 8, 10);
  ctx.fillRect(z.x + 6, z.y + 6 + heavyBob, 10, 8);

  // 3. MUTATED BELLY MAW (Tooth-filled gaping stomach mouth that actively opens/gnashes!)
  ctx.fillStyle = '#450a0a';
  ctx.beginPath();
  ctx.ellipse(z.x - 2, z.y + 4 + heavyBob, 14, 6 + mawChomp, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#991b1b';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Razor-sharp yellowed teeth inside belly mouth
  ctx.fillStyle = '#fef08a';
  for (let t = 0; t < 5; t++) {
    // Upper teeth
    ctx.fillRect(z.x - 12 + t * 5, z.y - 1 + heavyBob, 2, 3 + mawChomp * 0.5);
    // Lower teeth
    ctx.fillRect(z.x - 10 + t * 5, z.y + 6 + heavyBob - mawChomp * 0.5, 2, 3);
  }

  // 4. COLOSSAL MEAT CLEAVER IN RIGHT ARM
  // Right Arm (lifting heavy cleaver)
  ctx.fillStyle = '#166534';
  ctx.fillRect(z.x - 26, z.y - 14 + heavyBob, 12, 22);

  // Giant Rusty Heavy Steel Meat Cleaver Blade
  const cleaverX = z.x - 42;
  const cleaverY = z.y - 4 + heavyBob;
  // Steel blade
  ctx.fillStyle = '#64748b';
  ctx.fillRect(cleaverX, cleaverY, 18, 22);
  ctx.fillStyle = '#94a3b8'; // sharp edge
  ctx.fillRect(cleaverX - 3, cleaverY, 3, 22);
  // Blood drips on cleaver edge
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(cleaverX - 3, cleaverY + 12, 3, 10);
  ctx.fillRect(cleaverX - 2, cleaverY + 22, 2, 4);
  // Heavy wooden handle
  ctx.fillStyle = '#78350f';
  ctx.fillRect(cleaverX + 16, cleaverY + 7, 10, 5);

  // Left Arm (thick bicep wrapped in iron chain)
  ctx.fillStyle = '#14532d';
  ctx.fillRect(z.x + 14, z.y - 12 + heavyBob, 12, 20);
  ctx.fillStyle = '#cbd5e1'; // iron chain wraps
  ctx.fillRect(z.x + 13, z.y - 6 + heavyBob, 14, 2.5);
  ctx.fillRect(z.x + 13, z.y - 1 + heavyBob, 14, 2.5);

  // 5. COLOSSAL MUTATED HEAD & GLOWING DEMONIC RED EYES
  if (z.headless) {
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(z.x - 10, zTop + 8, 20, 14);
  } else {
    const headY = zTop + z.headRadius + heavyBob - 4;

    // Mutated green skull
    ctx.fillStyle = '#166534';
    ctx.beginPath();
    ctx.arc(z.x - 1, headY, z.headRadius + 2, 0, Math.PI * 2);
    ctx.fill();

    // Bloody butcher head bandage / meat hook stuck in temple
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(z.x - z.headRadius, headY - 6, (z.headRadius + 2) * 2 - 2, 4);
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(z.x - 4, headY - 6, 6, 4);
    ctx.fillStyle = '#94a3b8'; // iron hook in skull
    ctx.fillRect(z.x + z.headRadius - 2, headY - 10, 3, 7);

    // Glowing Demonic Red Eyes with dark sockets
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(z.x - 7, headY - 1, 4, 0, Math.PI * 2);
    ctx.arc(z.x + 5, headY - 1, 4, 0, Math.PI * 2);
    ctx.fill();

    // Piercing Red Pupils
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(z.x - 7, headY - 1, 2.5, 0, Math.PI * 2);
    ctx.arc(z.x + 5, headY - 1, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef08a'; // bright yellow center
    ctx.fillRect(z.x - 7.5, headY - 1.5, 1.5, 1.5);
    ctx.fillRect(z.x + 4.5, headY - 1.5, 1.5, 1.5);

    // Scowling snarling mouth with yellowed tusks
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(z.x - 7, headY + 6, 12, 4);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(z.x - 6, headY + 5, 2, 3);
    ctx.fillRect(z.x + 3, headY + 5, 2, 3);
  }

  // 6. GRAND GILDED BOSS HEALTH BAR & BANNER
  const bWidth = 96;
  const bRatio = Math.max(0, z.hp / z.maxHp);
  // Bar background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
  ctx.fillRect(z.x - bWidth / 2, zTop - 25, bWidth, 9);
  // Bar fill
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(z.x - bWidth / 2 + 1, zTop - 24, (bWidth - 2) * bRatio, 7);
  // Gold ornate border
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(z.x - bWidth / 2, zTop - 25, bWidth, 9);

  // Skull & Boss Name Header
  ctx.font = 'bold 11px "Tajawal", sans-serif';
  ctx.fillStyle = '#fef08a';
  ctx.textAlign = 'center';
  ctx.fillText(language === 'ar' ? '☠ الزعيم الأكول (رئيس قسم اللحوم)' : '☠ THE GLUTTON (MASTER BUTCHER)', z.x, zTop - 30);

  // Burning Flames if ignited
  if (z.isBurning && !z.isDead) {
    ctx.fillStyle = Math.random() < 0.5 ? '#f97316' : '#ea580c';
    ctx.beginPath();
    ctx.arc(z.x + (Math.random() - 0.5) * 16, z.y + (Math.random() - 0.5) * 20, 10 + Math.random() * 4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// 5. ARMORED ZOMBIE (زومبي مدرع - اليوم الخامس)
// Heavy ballistic Kevlar vest, steel trauma plates, riot helmet with glowing visor slit.
// Immune to all body shots - ONLY DIES FROM HEADSHOTS!
function drawArmoredZombie(
  ctx: CanvasRenderingContext2D,
  z: ZombieEntity,
  currentTime: number
) {
  ctx.save();
  const zLeft = z.x - z.width / 2;
  const zTop = z.y - z.height / 2;

  // Ground shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.ellipse(z.x, z.y + z.height / 2 + 1, z.width / 2 + 3, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Heavy tactical march gait
  const walkPhase = (currentTime * 0.005 * z.speed + (z.y % 15)) % (Math.PI * 2);
  const legSwing = Math.sin(walkPhase) * 4;

  // 1. LEGS (Heavy tactical SWAT pants & steel-toe combat riot boots)
  const legTop = z.y + 4;
  const legH = z.height / 2 - 4;

  // Back leg
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(z.x - 2 - legSwing, legTop, 8, legH);
  ctx.fillStyle = '#0f172a'; // boot
  ctx.fillRect(z.x - 4 - legSwing, legTop + legH - 4, 10, 5);

  // Front leg
  ctx.fillStyle = '#334155';
  ctx.fillRect(z.x - 10 + legSwing, legTop, 9, legH);
  // Heavy Kevlar knee guard with steel rivets
  ctx.fillStyle = '#475569';
  ctx.fillRect(z.x - 11 + legSwing, legTop + 7, 10, 6);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(z.x - 10 + legSwing, legTop + 8, 2, 2);
  ctx.fillRect(z.x - 3 + legSwing, legTop + 8, 2, 2);
  // Front boot
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(z.x - 13 + legSwing, legTop + legH - 4, 12, 5);
  ctx.fillStyle = '#64748b'; // steel toe
  ctx.fillRect(z.x - 13 + legSwing, legTop + legH - 2, 4, 3);

  // 2. TORSO & REINFORCED BALLISTIC RIOT ARMOR
  const torsoTop = zTop + z.headRadius * 1.3;
  const torsoH = z.height * 0.44;

  // Heavy Kevlar vest
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(zLeft + 1, torsoTop, z.width - 2, torsoH);

  // Ceramic trauma chest plate (deflects body bullets)
  ctx.fillStyle = '#475569';
  ctx.fillRect(zLeft + 3, torsoTop + 2, z.width - 6, torsoH - 6);
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1;
  ctx.strokeRect(zLeft + 3, torsoTop + 2, z.width - 6, torsoH - 6);

  // Steel bolt rivets
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(zLeft + 5, torsoTop + 4, 2, 2);
  ctx.fillRect(zLeft + z.width - 7, torsoTop + 4, 2, 2);
  ctx.fillRect(zLeft + 5, torsoTop + torsoH - 8, 2, 2);
  ctx.fillRect(zLeft + z.width - 7, torsoTop + torsoH - 8, 2, 2);

  // White SWAT / POLICE / SECURITY stencil text across chest
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(z.x - 7, torsoTop + 9, 14, 2.5);
  ctx.fillRect(z.x - 5, torsoTop + 13, 10, 1.5);

  // 3. ARMS WITH STEEL PAULDRONS
  // Back arm
  ctx.fillStyle = '#334155';
  ctx.fillRect(z.x + 3, torsoTop + 2, 7, 10);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(z.x + 8, torsoTop + 8, 4, 5);

  // Front arm (reaching forward)
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(z.x - 4, torsoTop + 4, 8, 7);
  // Steel shoulder pauldron
  ctx.fillStyle = '#475569';
  ctx.fillRect(z.x - 6, torsoTop + 2, 10, 4);
  // Armored tactical glove forearm
  ctx.fillStyle = '#334155';
  ctx.fillRect(z.x - 17, torsoTop + 6, 14, 4.5);
  // Claws with tactical glove
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(z.x - 20, torsoTop + 5, 5, 3);
  ctx.fillRect(z.x - 21, torsoTop + 8, 5, 3);

  // 4. HEAD: BALLISTIC RIOT HELMET WITH VISOR (TARGET THE HEAD!)
  if (z.headless) {
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(z.x - 6, zTop + 5, 12, 8);
    ctx.fillStyle = '#475569'; // shattered helmet bits
    ctx.fillRect(z.x - 8, zTop + 10, 4, 3);
  } else {
    const headY = zTop + z.headRadius;

    // Ballistic SWAT helmet shell
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.arc(z.x, headY, z.headRadius + 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Dark riot visor face shield
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(z.x - 7, headY - 3, 9, 7);

    // Glowing amber / yellow eye slit through visor
    ctx.fillStyle = '#facc15';
    ctx.fillRect(z.x - 6.5, headY - 1.5, 3, 1.8);
    ctx.fillRect(z.x - 1.5, headY - 1.5, 3, 1.8);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(z.x - 5.5, headY - 1, 1, 1);

    // Lower decaying olive jaw protruding under chin strap
    ctx.fillStyle = '#58753d';
    ctx.fillRect(z.x - 5, headY + 5, 6, 4);
    ctx.fillStyle = '#fef08a'; // rotten teeth
    ctx.fillRect(z.x - 4, headY + 5.5, 1.5, 1.5);
    ctx.fillRect(z.x - 1.5, headY + 5.5, 1.5, 1.5);

    // Helmet chinstrap
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(z.x - 6, headY + 4, 8, 1.5);
  }

  // Health bar with armored shield badge
  const hpBarWidth = z.width + 10;
  const hpRatio = Math.max(0, z.hp / z.maxHp);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(z.x - hpBarWidth / 2, zTop - 15, hpBarWidth, 4);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(z.x - hpBarWidth / 2, zTop - 15, hpBarWidth * hpRatio, 4);

  // Mini shield icon text
  ctx.font = 'bold 8px "Tajawal", sans-serif';
  ctx.fillStyle = '#facc15';
  ctx.textAlign = 'center';
  ctx.fillText('🛡️ الرأس فقط', z.x, zTop - 17);

  // Burning Flames if ignited
  if (z.isBurning && !z.isDead) {
    ctx.fillStyle = Math.random() < 0.5 ? '#f97316' : '#ea580c';
    ctx.beginPath();
    ctx.arc(z.x + (Math.random() - 0.5) * 8, z.y + (Math.random() - 0.5) * 14, 6 + Math.random() * 3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// 6. THREE-TENTACLE ZOMBIE BOSS (زعيم الزومبي ذو الثلاث مجسات - الليلة السادسة)
// Invulnerable body. Only dies by severing all 3 tentacles (each has 3000 HP)!
// Pointed sharp claws at ends. 4 seconds of blood spewing when severed.
// Death animation: collapses on back on the ground and raises human hands up towards the sky!
function drawTentacleBoss(
  ctx: CanvasRenderingContext2D,
  z: ZombieEntity,
  currentTime: number,
  language: 'ar' | 'en'
) {
  ctx.save();
  const zLeft = z.x - z.width / 2;
  const zTop = z.y - z.height / 2;

  // Ground shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.beginPath();
  ctx.ellipse(z.x, z.y + z.height / 2 + 2, z.width / 2 + 15, 11, 0, 0, Math.PI * 2);
  ctx.fill();

  // DYING ANIMATION: Collapsed on back, raising two human hands up
  // "وعندما يفقد ثلاثة مجساته اجعل له انيمشن يسقط على الارض على ضهره ويرفع يديه لبشريتين فوق وثم تنتهي ليلة"
  if (z.isFallingBackOnGround || (z.isDying && (z.tentaclesSeveredCount || 0) >= 3)) {
    const fallenY = z.y + 12;

    // Expanding blood pool under fallen boss
    ctx.fillStyle = '#581c87';
    ctx.beginPath();
    ctx.ellipse(z.x, fallenY + 12, 48, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#7f1d1d';
    ctx.beginPath();
    ctx.ellipse(z.x, fallenY + 12, 38, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Fallen body lying flat on back
    ctx.fillStyle = '#1e1b4b'; // dark mutated carapace
    ctx.fillRect(z.x - 30, fallenY - 6, 60, 20);
    ctx.fillStyle = '#312e81';
    ctx.fillRect(z.x - 24, fallenY - 4, 48, 16);

    // Severed shoulder tentacle stumps (blood oozing)
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(z.x - 22, fallenY - 9, 10, 5);
    ctx.fillRect(z.x + 12, fallenY - 9, 10, 5);

    // Fallen head tilted back
    ctx.fillStyle = '#2e1065';
    ctx.beginPath();
    ctx.arc(z.x + 28, fallenY + 2, 12, 0, Math.PI * 2);
    ctx.fill();
    // Dead pale purple eyes
    ctx.fillStyle = '#a855f7';
    ctx.fillRect(z.x + 26, fallenY - 1, 2, 2);

    // TWO HUMAN HANDS RAISED UP TOWARD THE SKY IN SURRENDER/DEATH!
    const tremor = Math.sin(currentTime * 0.03) * 1.5;
    ctx.fillStyle = '#82a567'; // human rotting flesh forearm
    ctx.fillRect(z.x - 14, fallenY - 32 + tremor, 6, 26);
    // Human hand & spread fingers pointing UP
    ctx.fillStyle = '#a3e635';
    ctx.fillRect(z.x - 16, fallenY - 38 + tremor, 9, 7);
    ctx.fillStyle = '#f8fafc'; // fingernails
    ctx.fillRect(z.x - 16, fallenY - 41 + tremor, 2, 3);
    ctx.fillRect(z.x - 13, fallenY - 43 + tremor, 2, 5);
    ctx.fillRect(z.x - 10, fallenY - 42 + tremor, 2, 4);

    // Right human hand reaching high
    ctx.fillStyle = '#82a567';
    ctx.fillRect(z.x + 4, fallenY - 30 - tremor, 6, 24);
    ctx.fillStyle = '#a3e635';
    ctx.fillRect(z.x + 2, fallenY - 36 - tremor, 9, 7);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(z.x + 2, fallenY - 39 - tremor, 2, 3);
    ctx.fillRect(z.x + 5, fallenY - 41 - tremor, 2, 5);
    ctx.fillRect(z.x + 8, fallenY - 40 - tremor, 2, 4);

    // Death banner
    ctx.font = 'bold 12px "Tajawal", sans-serif';
    ctx.fillStyle = '#f43f5e';
    ctx.textAlign = 'center';
    ctx.fillText(language === 'ar' ? '☠ سقط زعيم المجسات ورفعت يداه مستسلماً!' : '☠ TENTACLE BOSS HAS FALLEN!', z.x, z.y - 45);

    ctx.restore();
    return;
  }

  // ALIVE TENTACLE BOSS RENDERING
  const walkPhase = (currentTime * 0.003 * z.speed) % (Math.PI * 2);
  const stompSwing = Math.sin(walkPhase) * 3;
  const heavyBob = Math.abs(Math.sin(walkPhase)) * 2;

  // 1. LEGS (Thick mutated armored chitin legs)
  const legTop = z.y + 10;
  const legH = z.height / 2 - 10;
  ctx.fillStyle = '#1e1b4b';
  ctx.fillRect(z.x - 16 - stompSwing, legTop, 14, legH);
  ctx.fillRect(z.x + 4 + stompSwing, legTop, 14, legH);
  ctx.fillStyle = '#4338ca'; // sharp knee carapace
  ctx.fillRect(z.x - 18 - stompSwing, legTop + 6, 6, 6);
  ctx.fillRect(z.x + 14 + stompSwing, legTop + 6, 6, 6);

  // 2. CENTRAL INVULNERABLE CHITIN BODY
  ctx.fillStyle = '#2e1065';
  ctx.beginPath();
  ctx.ellipse(z.x, z.y - 2 + heavyBob, z.width / 2, z.height * 0.42, 0, 0, Math.PI * 2);
  ctx.fill();

  // Spiky chitin plates on back & chest
  ctx.fillStyle = '#4c1d95';
  ctx.beginPath();
  ctx.ellipse(z.x, z.y - 2 + heavyBob, z.width / 2 - 4, z.height * 0.38, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#a855f7';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Two Human Arms attached to torso
  ctx.fillStyle = '#65824c';
  ctx.fillRect(z.x - 18, z.y + 6 + heavyBob, 7, 14);
  ctx.fillRect(z.x + 11, z.y + 6 + heavyBob, 7, 14);

  // Head with demonic glowing eyes
  const headY = zTop + z.headRadius + heavyBob - 2;
  ctx.fillStyle = '#1e1b4b';
  ctx.beginPath();
  ctx.arc(z.x, headY, z.headRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#7c3aed';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Triple glowing magenta eyes
  ctx.fillStyle = '#f43f5e';
  ctx.fillRect(z.x - 7, headY - 2, 3, 3);
  ctx.fillRect(z.x - 1, headY - 4, 3, 3);
  ctx.fillRect(z.x + 5, headY - 2, 3, 3);

  // 3. THREE DYNAMIC UNDULATING TENTACLES WITH POINTED CLAWS!
  if (z.tentacles) {
    z.tentacles.forEach((tentacle, idx) => {
      const rootX = z.x - 16;
      const rootY = z.y + (tentacle.currentYOffset ?? 0) + heavyBob;

      if (tentacle.isSevered) {
        // Bloody severed stump
        ctx.fillStyle = '#881337';
        ctx.fillRect(rootX - 4, rootY - 6, 8, 12);
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(rootX - 6, rootY - 4, 5, 8);

        // If currently in the 4-second bleeding period, spew high-pressure arterial fountains!
        if (tentacle.severBleedTimer && tentacle.severBleedTimer > 0) {
          ctx.fillStyle = '#ef4444';
          const spurtLen = 20 + Math.sin(currentTime * 0.04 + idx) * 12;
          ctx.fillRect(rootX - 6 - spurtLen, rootY - 3, spurtLen, 6);
        }
        return;
      }

      // Alive Tentacle: Undulates in wave toward the player
      const wave = Math.sin(currentTime * 0.006 + tentacle.wavePhase + idx) * 14;
      const wave2 = Math.cos(currentTime * 0.007 + tentacle.wavePhase) * 10;
      const tipX = z.x - 85;
      const tipY = rootY + wave;
      const midX = z.x - 45;
      const midY = rootY + wave2;

      // Draw undulating tentacle body segments
      ctx.strokeStyle = idx === 1 ? '#9333ea' : '#7e22ce';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(rootX, rootY);
      ctx.quadraticCurveTo(midX, midY, tipX, tipY);
      ctx.stroke();

      // Inner luminous sucker nodes
      ctx.strokeStyle = '#e879f9';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(rootX, rootY);
      ctx.quadraticCurveTo(midX, midY, tipX, tipY);
      ctx.stroke();

      // POINTED SHARP CLAW AT THE TIP OF TENTACLE ("وتكون نهاية مجساته مخلب مدبب")
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.moveTo(tipX, tipY - 5);
      ctx.lineTo(tipX - 16, tipY);
      ctx.lineTo(tipX, tipY + 5);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(tipX, tipY - 5);
      ctx.lineTo(tipX - 16, tipY);
      ctx.lineTo(tipX, tipY + 5);
      ctx.stroke();

      // Mini Health Bar above each active tentacle (3000 HP)
      const tBarW = 44;
      const tRatio = Math.max(0, tentacle.hp / tentacle.maxHp);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(midX - tBarW / 2, midY - 14, tBarW, 5);
      ctx.fillStyle = '#c084fc';
      ctx.fillRect(midX - tBarW / 2, midY - 14, tBarW * tRatio, 5);
      ctx.strokeStyle = '#e879f9';
      ctx.lineWidth = 0.8;
      ctx.strokeRect(midX - tBarW / 2, midY - 14, tBarW, 5);

      ctx.font = 'bold 8px "Tajawal", sans-serif';
      ctx.fillStyle = '#fef08a';
      ctx.textAlign = 'center';
      ctx.fillText(`${Math.max(0, tentacle.hp)}`, midX, midY - 16);
    });
  }

  // 4. GRAND GILDED TENTACLE BOSS BANNER & STATUS
  const bWidth = 110;
  const remainingTentacles = Math.max(0, 3 - (z.tentaclesSeveredCount || 0));
  ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
  ctx.fillRect(z.x - bWidth / 2, zTop - 28, bWidth, 9);
  ctx.fillStyle = '#a855f7';
  ctx.fillRect(z.x - bWidth / 2 + 1, zTop - 27, (bWidth - 2) * (remainingTentacles / 3), 7);
  ctx.strokeStyle = '#f43f5e';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(z.x - bWidth / 2, zTop - 28, bWidth, 9);

  ctx.font = 'bold 11px "Tajawal", sans-serif';
  ctx.fillStyle = '#fef08a';
  ctx.textAlign = 'center';
  ctx.fillText(
    language === 'ar' 
      ? `☠ زعيم المجسات (المتبقي: ${remainingTentacles}/3)` 
      : `☠ 3-TENTACLE BOSS (${remainingTentacles}/3 LEFT)`, 
    z.x, 
    zTop - 32
  );

  ctx.restore();
}

export const CombatCanvas: React.FC<CombatCanvasProps> = ({
  day,
  playerHealth,
  maxPlayerHealth,
  setPlayerHealth,
  activeWeapon,
  secondaryWeapon,
  setActiveWeapon,
  setSecondaryWeapon,
  allWeapons,
  setAllWeapons,
  equippedAbilityId,
  setEquippedAbilityId,
  barricade,
  setBarricade,
  resources,
  setResources,
  ammoStock,
  setAmmoStock,
  survivors,
  setSurvivors,
  molotovCount,
  setMolotovCount,
  pipeBombCount,
  setPipeBombCount,
  mineCount,
  setMineCount,
  onNightComplete,
  onGameOver,
  language
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Exact zombie counts + Survivor Scaling:
  // Day 1 = 35 zombies ("اول يوم يهجم فقط 35 واحد")
  // Day 2 = 45 zombies ("في يوم ثاني 45")
  // Day 3 = 58 zombies with Glutton Boss (No survivor bonus on boss nights)
  // Day 4 = 65 zombies with Spitter ("اجعل ليلة رابعة 65 واحد واضف زومبي الباصق")
  // Day 5+ = 65 + (day - 4) * 12
  // Survivor recruitment scaling:
  // "وايضا عندما يحصل لاعب على ناجي يزدد عدد زومبي 50 زومبي في جميع اليلي ماعدا ليلي التي بها زعماء واذا حصل لاعب على ناجي ثاني سيزداد عدد زومبي" (+100 for second survivor, total +150)
  const recruitedCount = survivors.filter(s => s.isRecruited && !s.isDead).length;
  const isBossNight = day === 3 || day === 6;
  const survivorBonus = isBossNight ? 0 : (recruitedCount === 1 ? 50 : recruitedCount >= 2 ? 150 : 0);
  const baseZombies = day === 1 
    ? 35 
    : day === 2 
    ? 45 
    : day === 3 
    ? 58 
    : day === 4 
    ? 65 
    : 65 + (day - 4) * 12;
  const totalZombiesForNight = baseZombies + survivorBonus;
  const zombiesPerWaveCount = Math.ceil(totalZombiesForNight / 4);

  // Synchronized UI state
  const [currentClip, setCurrentClip] = useState<number>(activeWeapon.clipSize);
  const [isReloading, setIsReloading] = useState<boolean>(false);
  const [reloadProgress, setReloadProgress] = useState<number>(0);
  const [screenShake, setScreenShake] = useState<number>(0);
  const [nightProgress, setNightProgress] = useState<number>(0);
  const [remainingZombies, setRemainingZombies] = useState<number>(totalZombiesForNight);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(audio.isMuted);

  // Plasma Gun Battery System: 1 battery = 20.0s of continuous active firing beam!
  const [plasmaBatterySecs, setPlasmaBatterySecs] = useState<number>(20.0);
  const plasmaBatterySecsRef = useRef<number>(20.0);

  // Survivor Ability Cooldown & Day 4 Contract UI state
  const [abilityCooldownRatio, setAbilityCooldownRatio] = useState<number>(0);
  const [abilityCooldownSecs, setAbilityCooldownSecs] = useState<number>(0);
  const [day4Headshots, setDay4Headshots] = useState<number>(0);

  // References to keep loop persistent without recreation
  const weaponRef = useRef<Weapon>(activeWeapon);
  weaponRef.current = activeWeapon;

  const allWeaponsRef = useRef<Record<WeaponId, Weapon>>(allWeapons);
  allWeaponsRef.current = allWeapons;

  const barricadeRef = useRef<BarricadeState>(barricade);
  barricadeRef.current = barricade;

  const resourcesRef = useRef<Resources | undefined>(resources);
  resourcesRef.current = resources;

  const ammoStockRef = useRef<AmmoStock>(ammoStock);
  ammoStockRef.current = ammoStock;

  const survivorsRef = useRef<Survivor[]>(survivors);
  survivorsRef.current = survivors;

  const isPausedRef = useRef<boolean>(isPaused);
  isPausedRef.current = isPaused;

  const playerHealthRef = useRef<number>(playerHealth);
  playerHealthRef.current = playerHealth;

  // Unlocked only when a survivor is recruited: player starts with no ability!
  const equippedAbilityRef = useRef<string | null>(equippedAbilityId);
  equippedAbilityRef.current = equippedAbilityId;

  const [pkcReloadBanner, setPkcReloadBanner] = useState<{
    reloaderName: string;
    secsRemaining: number;
  } | null>(null);

  // Authoritative game simulation state in ref
  const gameStateRef = useRef({
    playerY: 280,
    targetPlayerY: 280,
    mouseX: 650,
    mouseY: 280,
    isMouseDown: false,
    clip: activeWeapon.clipSize,
    isReloading: false,
    lastPlayerShotTime: 0,
    lastAbilityTime: -20000,
    lastPlasmaTick: 0,
    plasmaTargetZombieId: null as number | null,
    plasmaFocusStartTime: 0,
    plasmaCurrentDamage: 2,
    plasmaBeamEndX: 0,
    plasmaBeamEndY: 0,
    nightHeadshotKills: 0,
    zombies: [] as ZombieEntity[],
    bullets: [] as BulletEntity[],
    particles: [] as ParticleEntity[],
    throwables: [] as ThrowableEntity[],
    fireZones: [] as FireZoneEntity[],
    landmines: [] as LandmineEntity[],
    acidProjectiles: [] as AcidProjectile[],
    floatingTexts: [] as FloatingText[],
    bloodStains: [] as { x: number; y: number; r: number; alpha: number; life: number; maxLife: number }[],
    totalZombiesToSpawn: totalZombiesForNight,
    zombiesSpawned: 0,
    zombiesKilled: 0,
    shotsFired: 0,
    shotsHit: 0,
    headshots: 0,
    barricadeDamageTaken: 0,
    wave: 1,
    batchWaveStep: 1, // 1: initial 20 batch, 2: 25 batch, 3: 35 batch, 4+: 35 batch
    zombiesSpawnedInWave: 0,
    zombiesPerWave: zombiesPerWaveCount,
    isWaitingNextWave: false,
    nextWaveStartTime: 0,
    trioSpawnedInCurrentWave: false,
    survivorLastShots: {} as Record<string, number>,
    nextZombieSpawnTime: 0,
    nextElectricShockTime: 0,
    bossSpawned: false,
    bossDefeated: false,
    lastBossMinionSpawnTime: 0,
    bloodFlashAlpha: 0,
    bgImage: null as HTMLImageElement | null,
    isEnded: false,
    pkcReloaderId: null as string | null,
    pkcReloadTimeLeft: 0,
    pkcReloadTotalTime: 90
  });

  // Load Supermarket Barricade Background Image
  useEffect(() => {
    const img = new Image();
    img.src = supermarketBarricadeBg;
    img.onload = () => {
      gameStateRef.current.bgImage = img;
    };
  }, []);

  // Update clip when active weapon changes
  useEffect(() => {
    gameStateRef.current.clip = activeWeapon.clipSize;
    gameStateRef.current.isReloading = false;
    setCurrentClip(activeWeapon.clipSize);
    setIsReloading(false);
    setReloadProgress(0);
  }, [activeWeapon.id]);

  // Seamless Weapon Swap between Primary & Secondary
  const handleSwapWeapons = useCallback(() => {
    if (!secondaryWeapon || gameStateRef.current.isEnded) return;

    audio.playWeaponSwitch();

    const currentPrimary = activeWeapon;
    const currentSecondary = secondaryWeapon;

    // Reset continuous plasma ramp on weapon swap ("وايضا اذا قام لاعب بتبديل سلاح بلازما اثناء ضرب زومبي هم يرجع ضرر سلاح بلازما الى 2")
    gameStateRef.current.plasmaTargetZombieId = null;
    gameStateRef.current.plasmaCurrentDamage = 2;
    gameStateRef.current.plasmaFocusStartTime = performance.now();

    // Swap states
    setActiveWeapon(currentSecondary);
    setSecondaryWeapon(currentPrimary);

    weaponRef.current = currentSecondary;
    gameStateRef.current.clip = currentSecondary.clipSize;
    gameStateRef.current.isReloading = false;
    setCurrentClip(currentSecondary.clipSize);
    setIsReloading(false);
    setReloadProgress(0);
  }, [activeWeapon, secondaryWeapon, setActiveWeapon, setSecondaryWeapon]);

  // Execute Reload action with PKC Survivor Reload Mechanic (90s / 1.5 min)
  // "وعند تلقيم سلاح يتوقف احد ناجين لتلقيمة يحتاج الناجي دقيقة ونصف لتلقيمةويكون ناجي غير قادر على ضرب زومبي اثناء تلقيم سلاح وعندما يقوم ناجي بتلقيم سلاح pkc فان لاعب سيلعب بسلاحة ثانوي او رىيسي حسب مكان سلاح pkc"
  const handleReload = useCallback(() => {
    const g = gameStateRef.current;
    const currentWeapon = weaponRef.current;
    if (g.isReloading || g.isEnded) return;
    if (currentWeapon.ammoType === 'none') return;

    // Special PKC Heavy Machine Gun Reload
    if (currentWeapon.id === 'pkc') {
      if (g.pkcReloadTimeLeft > 0) {
        g.floatingTexts.push({
          id: Math.random(),
          x: 240,
          y: g.playerY - 20,
          text: language === 'ar' ? '⏳ جاري التلقيم بواسطة الناجي بالفعل...' : '⏳ Already being reloaded by survivor...',
          color: '#facc15',
          life: 45,
          maxLife: 45
        });
        return;
      }

      const aliveSurvivors = survivorsRef.current.filter(s => s.isRecruited && !s.isDead);
      if (aliveSurvivors.length === 0) {
        g.floatingTexts.push({
          id: Math.random(),
          x: 250,
          y: g.playerY - 25,
          text: language === 'ar' ? '⚠️ يلزم وجود ناجٍ حي لتلقيم رشاش PKC (1.5 دقيقة)!' : '⚠️ Living survivor required to reload PKC (1.5m)!',
          color: '#ef4444',
          life: 60,
          maxLife: 60
        });
        return;
      }

      const availableAmmo = ammoStockRef.current.rifle || 0;
      if (availableAmmo <= 0 || g.clip === currentWeapon.clipSize) return;

      const reloader = aliveSurvivors[0];
      g.pkcReloaderId = reloader.id;
      g.pkcReloadTimeLeft = 90; // Exactly 90 seconds (1.5 minutes)
      g.pkcReloadTotalTime = 90;
      setPkcReloadBanner({
        reloaderName: language === 'ar' ? reloader.nameAr : reloader.name,
        secsRemaining: 90
      });

      audio.playReload();
      g.floatingTexts.push({
        id: Math.random(),
        x: 250,
        y: g.playerY - 30,
        text: language === 'ar' 
          ? `🔄 بدأ [${reloader.nameAr}] تلقيم رشاش PKC (90 ثانية / 1.5 دقيقة)!` 
          : `🔄 [${reloader.name}] started reloading PKC (90s / 1.5 min)!`,
        color: '#38bdf8',
        life: 80,
        maxLife: 80
      });

      // Auto-swap player to their other weapon during the 1.5-minute reload!
      if (secondaryWeapon) {
        handleSwapWeapons();
      }
      return;
    }

    const ammoKey = currentWeapon.ammoType as keyof AmmoStock;
    const availableAmmo = ammoStockRef.current[ammoKey] || 0;
    if (availableAmmo <= 0 || g.clip === currentWeapon.clipSize) return;

    g.isReloading = true;
    setIsReloading(true);
    audio.playReload();

    const reloadDuration = currentWeapon.reloadTime * 1000;
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / reloadDuration);
      setReloadProgress(progress);

      if (progress >= 1) {
        clearInterval(interval);
        const needed = currentWeapon.clipSize - g.clip;
        const take = Math.min(needed, ammoStockRef.current[ammoKey] || 0);

        g.clip += take;
        setCurrentClip(g.clip);

        setAmmoStock(prev => ({
          ...prev,
          [ammoKey]: Math.max(0, (prev[ammoKey] || 0) - take)
        }));

        g.isReloading = false;
        setIsReloading(false);
        setReloadProgress(0);
      }
    }, 40);
  }, [setAmmoStock, secondaryWeapon, handleSwapWeapons, language]);

  // Survivor Active Ultimate Ability Handler ([E] key, 20s cooldown)
  const ABILITY_COOLDOWN_MS = 20000;

  const handleTriggerAbility = useCallback(() => {
    const g = gameStateRef.current;
    if (g.isEnded || isPausedRef.current) return;
    const now = performance.now();
    if (now - g.lastAbilityTime < ABILITY_COOLDOWN_MS) {
      return;
    }

    const ability = equippedAbilityRef.current;
    if (!ability) {
      g.floatingTexts.push({
        id: Math.random(),
        x: 400,
        y: 200,
        text: language === 'ar' ? '⚠️ لا توجد قدرة مجهزة! (جنّد ناجياً أولاً)' : '⚠️ No ability equipped! (Recruit a survivor first)',
        color: '#f59e0b',
        life: 45,
        maxLife: 45
      });
      return;
    }

    // Verify the survivor who owns this ability is recruited and alive
    const matchingSurvivor = survivorsRef.current.find(s => s.abilityId === ability && s.isRecruited && !s.isDead);
    if (!matchingSurvivor) {
      g.floatingTexts.push({
        id: Math.random(),
        x: 400,
        y: 200,
        text: language === 'ar' ? '⚠️ يجب تجنيد صاحب القدرة أولاً!' : '⚠️ Must recruit survivor first!',
        color: '#f59e0b',
        life: 45,
        maxLife: 45
      });
      return;
    }

    if (ability === 'baraq_snipe') {
      // BARAQ SNIPES 5 ZOMBIES WITH FATAL HEADSHOTS!
      // "وجعل اسم ناجي رجل الامن الى براق رجل الامن وجعل قدرته يصيب خمسة زومبي هيد شوت وتتفعل كل 20 ثانية"
      const liveZombies = g.zombies.filter(z => !z.isDead && !z.isDying);
      if (liveZombies.length === 0) return;
      g.lastAbilityTime = now;
      audio.playAbilityBaraq();
      setScreenShake(6);

      // Sort by proximity to barricade
      liveZombies.sort((a, b) => a.x - b.x);
      const targets = liveZombies.slice(0, 5);

      g.floatingTexts.push({
        id: Math.random(),
        x: 600,
        y: 190,
        text: language === 'ar' ? '🎯 قنص براق: 5 إصابات رأسية قاتلة!' : '🎯 BARAQ 5-HEADSHOT SNIPE ACTIVATED!',
        color: '#38bdf8',
        life: 50,
        maxLife: 50
      });

      targets.forEach((target, i) => {
        setTimeout(() => {
          if (target.isBoss) {
            target.hp = Math.max(0, target.hp - 1800);
            if (target.hp <= 0 && !target.isDying) {
              target.isDying = true;
              target.deathAnimTimer = 35;
            }
          } else {
            target.headless = true;
            target.hp = 0;
            target.isDead = true;
            target.deathAnimTimer = 30;
            g.zombiesKilled++;
            g.headshots++;
          }
          if (day === 4) {
            g.nightHeadshotKills++;
            setDay4Headshots(g.nightHeadshotKills);

            // Day 4 20-headshot plasma challenge trigger
            if (g.nightHeadshotKills >= 20 && !allWeaponsRef.current.plasma_rifle.unlocked) {
              audio.playCashRegister();
              setScreenShake(10);
              const unlockedPlasma: Weapon = {
                ...allWeaponsRef.current.plasma_rifle,
                unlocked: true
              };
              setAllWeapons(prev => ({
                ...prev,
                plasma_rifle: unlockedPlasma
              }));
              setActiveWeapon(unlockedPlasma);
              weaponRef.current = unlockedPlasma;
              gameStateRef.current.clip = unlockedPlasma.clipSize;
              setCurrentClip(unlockedPlasma.clipSize);

              g.floatingTexts.push({
                id: Math.random(),
                x: 500,
                y: 180,
                text: language === 'ar' ? '⚡ تم فتح سلاح البلازما الحارق بنجاح!' : '⚡ PLASMA RIFLE UNLOCKED!',
                color: '#22d3ee',
                life: 90,
                maxLife: 90
              });
            }
          }

          // Crisp lightweight headshot particles (4 per target)
          for (let p = 0; p < 4; p++) {
            g.particles.push({
              x: target.x,
              y: target.y - target.height / 2,
              vx: (Math.random() - 0.5) * 6,
              vy: -1 - Math.random() * 3,
              color: Math.random() < 0.6 ? '#dc2626' : '#f8fafc',
              size: 2.5,
              life: 16,
              maxLife: 16
            });
          }
        }, i * 75);
      });
    } else if (ability === 'shahd_fire_arrow') {
      // SHAHD SHOOTS AN INCENDIARY FIRE ARROW SETTING ALL ZOMBIES ON FIRE FOR 5 SECONDS!
      // "وناجية صيدلانية قم بتغير اسمها الى شهد وتطلق سهم ناري يحرق زومبي لمدة خمس ثواني"
      const liveZombies = g.zombies.filter(z => !z.isDead && !z.isDying);
      if (liveZombies.length === 0) return;
      g.lastAbilityTime = now;
      audio.playAbilityShahd();
      setScreenShake(4);

      liveZombies.forEach(z => {
        z.isBurning = true;
        z.burnTimer = 300; // 5 seconds @ 60fps
      });

      g.floatingTexts.push({
        id: Math.random(),
        x: 600,
        y: 220,
        text: language === 'ar' ? '🔥 سهم شهد الحارق: اشتعال الزومبي 5 ثوانٍ!' : '🔥 SHAHD FIRE ARROW: ALL ZOMBIES ON FIRE!',
        color: '#f97316',
        life: 50,
        maxLife: 50
      });
    } else if (ability === 'abu_fahad_shockwave') {
      g.lastAbilityTime = now;
      audio.playExplosion();
      setScreenShake(8);
      g.zombies.forEach(z => {
        if (!z.isDead) {
          z.x = Math.min(1020, z.x + 60);
          z.hp -= 35;
          if (z.hp <= 0) {
            z.isDead = true;
            z.deathAnimTimer = 30;
            g.zombiesKilled++;
          }
        }
      });
      g.floatingTexts.push({
        id: Math.random(),
        x: 600,
        y: 220,
        text: language === 'ar' ? '💥 صدمة أبو فهد الارتجاجية!' : '💥 SHOCKWAVE STUN!',
        color: '#eab308',
        life: 40,
        maxLife: 40
      });
    } else if (ability === 'ziad_reinforce') {
      g.lastAbilityTime = now;
      audio.playMechanicalClick();
      setBarricade(prev => ({
        ...prev,
        hp: Math.min(prev.maxHp, prev.hp + 80)
      }));
      g.floatingTexts.push({
        id: Math.random(),
        x: 250,
        y: 220,
        text: language === 'ar' ? '🛡️ تدعيم زياد السريع +80 HP!' : '🛡️ QUICK WELD +80 HP!',
        color: '#38bdf8',
        life: 40,
        maxLife: 40
      });
    }
  }, [day, language, setBarricade, setAllWeapons, setActiveWeapon]);

  // Direct shooting execution logic
  const executePlayerShot = useCallback((currentTime: number) => {
    const g = gameStateRef.current;
    const weapon = weaponRef.current;
    if (g.isEnded || g.isReloading || isPausedRef.current) return;

    // For plasma rifle, firing is governed by the 40s active battery timer!
    if (weapon.id === 'plasma_rifle') {
      if (plasmaBatterySecsRef.current <= 0) {
        return;
      }
    } else if (weapon.ammoType !== 'none' && g.clip <= 0) {
      handleReload();
      return;
    }

    if (currentTime - g.lastPlayerShotTime < weapon.fireRate) {
      return;
    }

    g.lastPlayerShotTime = currentTime;
    g.shotsFired++;

    if (weapon.ammoType !== 'none' && weapon.id !== 'plasma_rifle') {
      g.clip--;
      setCurrentClip(g.clip);
    }

    // Incendiary Plasma Rifle continuous beam execution (Acid vaporization, single-target non-piercing, ramping 2 to 6 damage)
    if (weapon.id === 'plasma_rifle') {
      audio.playPlasmaBeam();
      setScreenShake(1.2);

      const startX = 180;
      const startY = g.playerY;
      const angle = Math.atan2(g.mouseY - startY, g.mouseX - startX);
      const beamLength = 900;
      const maxEndX = startX + Math.cos(angle) * beamLength;
      const maxEndY = startY + Math.sin(angle) * beamLength;

      // 1. Plasma beam vaporizes any intersecting flying acid spits immediately! ("سلاح بلازما يستطيع ان يضرب البصقات التي يبصقها الزومبي الباصق")
      for (let ap = g.acidProjectiles.length - 1; ap >= 0; ap--) {
        const acid = g.acidProjectiles[ap];
        if (acid.isAttached) continue;

        const dx = maxEndX - startX;
        const dy = maxEndY - startY;
        const t = Math.max(0, Math.min(1, ((acid.x - startX) * dx + (acid.y - startY) * dy) / (dx * dx + dy * dy)));
        const projX = startX + t * dx;
        const projY = startY + t * dy;
        const dist = Math.hypot(acid.x - projX, acid.y - projY);

        if (dist <= acid.radius + 12) {
          audio.playAcidDestroyed();
          for (let p = 0; p < 18; p++) {
            g.particles.push({
              x: acid.x,
              y: acid.y,
              vx: (Math.random() - 0.5) * 8,
              vy: (Math.random() - 0.5) * 8,
              color: '#38bdf8',
              size: 2.5 + Math.random() * 2,
              life: 18,
              maxLife: 18
            });
          }
          g.floatingTexts.push({
            id: Math.random(),
            x: acid.x,
            y: acid.y - 12,
            text: language === 'ar' ? '⚡ تم تبخير بصقة الحمض بالبلازما!' : '⚡ ACID VAPORIZED!',
            color: '#38bdf8',
            life: 28,
            maxLife: 28
          });
          g.acidProjectiles.splice(ap, 1);
        }
      }

      // 2. Find the FIRST/CLOSEST living zombie along the beam ray (NO PIERCING! "لا يخترق الزومبي يقوم بضرب واحد زومبي ويحرقة")
      let closestZombie: ZombieEntity | null = null;
      let minT = 1.0;
      let hitX = maxEndX;
      let hitY = maxEndY;

      const dx = maxEndX - startX;
      const dy = maxEndY - startY;
      const rayLenSq = dx * dx + dy * dy;

      g.zombies.forEach(zombie => {
        if (zombie.isDead || zombie.isDying) return;

        const t = Math.max(0, Math.min(1, ((zombie.x - startX) * dx + (zombie.y - startY) * dy) / rayLenSq));
        const projX = startX + t * dx;
        const projY = startY + t * dy;
        const dist = Math.hypot(zombie.x - projX, zombie.y - projY);

        if (dist <= zombie.width / 2 + 14) {
          if (t < minT) {
            minT = t;
            closestZombie = zombie;
            hitX = projX;
            hitY = projY;
          }
        }
      });

      // Spawn ambient beam particles up to hit position
      const actualDist = Math.hypot(hitX - startX, hitY - startY);
      for (let bp = 0; bp < 3; bp++) {
        const randDist = Math.random() * actualDist;
        g.particles.push({
          x: startX + Math.cos(angle) * randDist,
          y: startY + Math.sin(angle) * randDist,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3,
          color: '#22d3ee',
          size: 2.5,
          life: 8,
          maxLife: 8
        });
      }

      // Record beam termination coordinates for visual rendering
      g.plasmaBeamEndX = hitX;
      g.plasmaBeamEndY = hitY;

      if (closestZombie) {
        g.shotsHit++;
        const target: ZombieEntity = closestZombie;

        // Damage Ramping (starts at 2, increases by +1 every second, capped at 6)
        // "ويكون ضرر المسلط من شعاع البلازما هو ضرر يساوي 2وكل ثانية يرتفع صرر الى +1 وعندما يصل سلاح شعاع البلازما الى ضرر 6 فانه ضرر يبقى 6 لا يرتفع ولا يقل"
        if (g.plasmaTargetZombieId !== target.id) {
          // Switched to a new target or starting fresh
          g.plasmaTargetZombieId = target.id;
          g.plasmaFocusStartTime = currentTime;
          g.plasmaCurrentDamage = 2;
        } else {
          // Sustained focus on same zombie: calculate ramp
          const secondsFocused = Math.floor((currentTime - g.plasmaFocusStartTime) / 1000);
          g.plasmaCurrentDamage = Math.min(6, 2 + secondsFocused);
        }

        const appliedDamage = g.plasmaCurrentDamage;
        target.hp -= appliedDamage;
        target.isBurning = true;
        target.burnTimer = 180; // 3 seconds burning

        // Electric plasma impact sparks
        for (let sp = 0; sp < 2; sp++) {
          g.particles.push({
            x: hitX + (Math.random() - 0.5) * 12,
            y: hitY + (Math.random() - 0.5) * 12,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            color: Math.random() < 0.5 ? '#38bdf8' : '#e879f9',
            size: 3,
            life: 12,
            maxLife: 12
          });
        }

        // When target zombie dies, damage resets back to 2 for the next target!
        // "وعندما يموت زومبي الذي تم تسليط عليه شعاع بلازما فيعود ضرر البلازما الى 2 ويصعد الى ان يصل الى 6 وهكذا"
        if (target.hp <= 0 && !target.isDead) {
          target.isDead = true;
          target.deathAnimTimer = 25;
          g.zombiesKilled++;
          g.plasmaTargetZombieId = null;
          g.plasmaCurrentDamage = 2;
          g.plasmaFocusStartTime = currentTime;
        }
      } else {
        // Beam hit nothing: reset target tracking and damage back to 2
        g.plasmaTargetZombieId = null;
        g.plasmaCurrentDamage = 2;
        g.plasmaFocusStartTime = currentTime;
      }

      return;
    }

    if (weapon.category === 'shotgun') {
      audio.playShotgun();
      setScreenShake(6);
    } else if (weapon.id === 'revolver') {
      audio.playRevolver();
      setScreenShake(4.5);
    } else if (weapon.id === 'uzi') {
      audio.playUzi();
      setScreenShake(1.8);
    } else if (weapon.id === 'hunting_rifle') {
      audio.playSniper();
      setScreenShake(7);
    } else if (weapon.category === 'melee') {
      audio.playMeleeSwing();
      setScreenShake(1.5);
    } else if (weapon.category === 'pistol') {
      audio.playPistol();
      setScreenShake(2);
    } else {
      audio.playRifle();
      setScreenShake(2.5);
    }

    const startX = 180;
    const startY = g.playerY;
    const angle = Math.atan2(g.mouseY - startY, g.mouseX - startX);

    for (let p = 0; p < weapon.pellets; p++) {
      const spreadOffset = (Math.random() - 0.5) * weapon.spread;
      const finalAngle = angle + spreadOffset;
      const speed = 28 + Math.random() * 4;

      g.bullets.push({
        id: Math.random(),
        x: startX,
        y: startY,
        vx: Math.cos(finalAngle) * speed,
        vy: Math.sin(finalAngle) * speed,
        damage: weapon.damage,
        isHeadshotCapable: true,
        isPlayerBullet: true,
        life: 50
      });
    }

    // Muzzle particles
    for (let m = 0; m < 5; m++) {
      g.particles.push({
        x: startX + 5,
        y: startY,
        vx: Math.cos(angle) * (7 + Math.random() * 4),
        vy: Math.sin(angle) * (7 + Math.random() * 4) + (Math.random() - 0.5) * 3,
        color: '#fef08a',
        size: 3 + Math.random() * 2,
        life: 6,
        maxLife: 6
      });
    }

    // Brass casing
    g.particles.push({
      x: startX - 8,
      y: startY - 2,
      vx: -2 - Math.random() * 2,
      vy: -3 - Math.random() * 2,
      color: '#facc15',
      size: 2,
      life: 25,
      maxLife: 25
    });

    if (weapon.ammoType !== 'none' && g.clip <= 0) {
      setTimeout(() => handleReload(), 120);
    }
  }, [handleReload]);

  // Throw Molotov
  const handleThrowMolotov = useCallback(() => {
    if (molotovCount <= 0 || gameStateRef.current.isEnded) return;
    setMolotovCount(prev => prev - 1);
    audio.playFire();

    const targetX = Math.max(300, Math.min(850, gameStateRef.current.mouseX));
    const targetY = Math.max(120, Math.min(480, gameStateRef.current.mouseY));
    const startX = 160;
    const startY = gameStateRef.current.playerY;

    gameStateRef.current.throwables.push({
      id: Date.now() + Math.random(),
      type: 'molotov',
      x: startX,
      y: startY,
      targetX,
      targetY,
      vx: (targetX - startX) / 25,
      vy: (targetY - startY) / 25,
      fuseTimer: 25,
      exploded: false
    });
  }, [molotovCount, setMolotovCount]);

  // Throw Pipe Bomb
  const handleThrowPipeBomb = useCallback(() => {
    if (pipeBombCount <= 0 || gameStateRef.current.isEnded) return;
    setPipeBombCount(prev => prev - 1);
    audio.playMechanicalClick();

    const targetX = Math.max(300, Math.min(850, gameStateRef.current.mouseX));
    const targetY = Math.max(120, Math.min(480, gameStateRef.current.mouseY));
    const startX = 160;
    const startY = gameStateRef.current.playerY;

    gameStateRef.current.throwables.push({
      id: Date.now() + Math.random(),
      type: 'pipe_bomb',
      x: startX,
      y: startY,
      targetX,
      targetY,
      vx: (targetX - startX) / 30,
      vy: (targetY - startY) / 30,
      fuseTimer: 35,
      exploded: false
    });
  }, [pipeBombCount, setPipeBombCount]);

  // Plant Proximity Landmine / Floor Trap ([F] key)
  const handlePlantMine = useCallback(() => {
    if (mineCount <= 0 || gameStateRef.current.isEnded) return;
    setMineCount(prev => prev - 1);
    audio.playMechanicalClick();

    const targetX = Math.max(265, Math.min(850, gameStateRef.current.mouseX));
    const targetY = Math.max(130, Math.min(480, gameStateRef.current.mouseY));

    gameStateRef.current.landmines.push({
      id: Date.now() + Math.random(),
      x: targetX,
      y: targetY,
      radius: 36,
      damage: 160,
      isArmed: true,
      type: 'mine'
    });
  }, [mineCount, setMineCount]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      audio.resume();

      if (e.code === 'Space') {
        e.preventDefault();
        executePlayerShot(performance.now());
      } else if (e.key === 'r' || e.key === 'R' || e.key === 'ق') {
        handleReload();
      } else if (e.key === 'e' || e.key === 'E' || e.key === 'ث') {
        handleTriggerAbility();
      } else if (e.key === 'g' || e.key === 'G' || e.key === 'ل') {
        handleThrowMolotov();
      } else if (e.key === 't' || e.key === 'T' || e.key === 'ف') {
        handleThrowPipeBomb();
      } else if (e.key === 'f' || e.key === 'F' || e.key === 'ب') {
        handlePlantMine();
      } else if (e.key === 'q' || e.key === 'Q' || e.key === 'ض' || e.key === '2') {
        handleSwapWeapons();
      } else if (
        e.code === 'KeyW' || 
        e.code === 'ArrowUp' || 
        e.key === 'w' || 
        e.key === 'W' || 
        e.key === 'ArrowUp' || 
        e.key === 'ص'
      ) {
        gameStateRef.current.targetPlayerY = Math.max(130, gameStateRef.current.targetPlayerY - 45);
      } else if (
        e.code === 'KeyS' || 
        e.code === 'ArrowDown' || 
        e.key === 's' || 
        e.key === 'S' || 
        e.key === 'ArrowDown' || 
        e.key === 'س'
      ) {
        gameStateRef.current.targetPlayerY = Math.min(480, gameStateRef.current.targetPlayerY + 45);
      } else if (e.key === 'p' || e.key === 'Escape') {
        setIsPaused(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleReload, handleTriggerAbility, handleThrowMolotov, handleThrowPipeBomb, handlePlantMine, handleSwapWeapons, executePlayerShot]);

  // Global mouseUp listener
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      gameStateRef.current.isMouseDown = false;
      gameStateRef.current.plasmaTargetZombieId = null;
      gameStateRef.current.plasmaCurrentDamage = 2;
      gameStateRef.current.plasmaFocusStartTime = performance.now();
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  // Main 60 FPS Canvas Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();

    // Spawn a standard zombie, FAT ZOMBIE, or RUNNER
    // Day 1: ONLY Normal Zombie and Fat Zombie, with Fat Zombie being rare ("في اليوم الاول قلل عدد زومبي السمين لا تجعله يظهر كثيرا فقط اليوم الاول")
    // Day 2: Normal Zombie, Fat Zombie, AND Fast Runner ("وثانية تكون زومبي سمين وعادي وسريع ايضا")
    const spawnSingleZombie = () => {
      const g = gameStateRef.current;
      if (g.zombiesSpawned >= g.totalZombiesToSpawn) return;

      let chosenType: ZombieType;
      if (day === 1) {
        // Day 1: ONLY Normal Zombie and Fat Zombie, but Fat Zombie is rare (~12% chance)
        chosenType = Math.random() < 0.12 ? 'fat_zombie' : 'shopper';
      } else if (day === 2) {
        // Day 2: Normal Zombie, Fat Zombie, AND Fast Runner
        const rand = Math.random();
        chosenType = rand < 0.45 ? 'shopper' : rand < 0.75 ? 'runner' : 'fat_zombie';
      } else if (day === 3) {
        // Day 3: Normal Zombie, Fat Zombie, Runner
        const types: ZombieType[] = ['shopper', 'fat_zombie', 'runner'];
        chosenType = types[Math.floor(Math.random() * types.length)];
      } else if (day === 4) {
        // Day 4: Spitter zombie debuts!
        const types: ZombieType[] = ['shopper', 'fat_zombie', 'runner', 'spitter'];
        chosenType = types[Math.floor(Math.random() * types.length)];
      } else {
        // Day 5+: Armored Zombie debuts! Only dies by headshots! ("وجعل في يوم خامس يظهر زومبي جديد يكون مدرع ولا يموت الا براسه")
        const rand = Math.random();
        chosenType = rand < 0.32 ? 'armored' : rand < 0.52 ? 'spitter' : rand < 0.72 ? 'runner' : rand < 0.88 ? 'fat_zombie' : 'shopper';
      }
      let hp = 50 + day * 10;
      let speed = 0.9 + Math.random() * 0.3;
      let damage = 8 + day * 2;
      let width = 28;
      let height = 56;
      let color = '#4ade80';
      let headRadius = 10;

      // Fast runner
      if (chosenType === 'runner') {
        hp = 38 + day * 6;
        speed = 1.35 + Math.random() * 0.25;
        damage = 9 + day;
        width = 26;
        height = 52;
        color = '#ea580c';
        headRadius = 9;
      } else if (chosenType === 'fat_zombie') {
        // FAT ZOMBIE: High health, chubby round belly ("زومبي سمين يحتاج الى عده طلقات لكي يموت اي دمه اعلى")
        hp = 135 + day * 20;
        speed = 0.62;
        damage = 14 + day * 2;
        width = 40;
        height = 58;
        color = '#16a34a'; // Bloated green
        headRadius = 12;
      } else if (chosenType === 'brute') {
        hp = 220 + day * 45;
        speed = 0.55;
        damage = 25 + day * 4;
        width = 44;
        height = 70;
        color = '#a855f7';
        headRadius = 14;
      } else if (chosenType === 'armored') {
        // ARMORED ZOMBIE: Day 5+ with ballistic SWAT armor, only headshots deal damage!
        hp = 180 + day * 25;
        speed = 0.72;
        damage = 18 + day * 2;
        width = 34;
        height = 60;
        color = '#475569';
        headRadius = 11;
      } else if (chosenType === 'spitter') {
        // SPITTER ZOMBIE: Night 4+
        hp = 68 + day * 12;
        speed = 0.92;
        damage = 12 + day * 2;
        width = 30;
        height = 54;
        color = '#047857'; // Toxic deep emerald
        headRadius = 10;
      }

      g.zombies.push({
        id: Date.now() + Math.random(),
        type: chosenType,
        x: 1020 + Math.random() * 60,
        y: 140 + Math.random() * 320,
        hp,
        maxHp: hp,
        speed,
        damage,
        attackCooldown: chosenType === 'brute' ? 1400 : 900,
        lastAttackTime: 0,
        width,
        height,
        isDead: false,
        deathAnimTimer: 0,
        color,
        headRadius,
        stepsTaken: 0,
        hasSpit: false,
        isBurning: false,
        burnTimer: 0
      });

      g.zombiesSpawned++;
      g.zombiesSpawnedInWave++;
    };

    // Spawn Trio Pack of Runners
    const spawnTrioPackRunners = () => {
      const g = gameStateRef.current;
      audio.playZombieGroan(1.3);

      const lanes = [
        { baseY: 170, waveSpeed: 0.022, waveAmp: 28, waveOffset: 0.2, xOffset: 0 },
        { baseY: 305, waveSpeed: 0.026, waveAmp: 36, waveOffset: 2.4, xOffset: 35 },
        { baseY: 435, waveSpeed: 0.020, waveAmp: 30, waveOffset: 4.8, xOffset: 15 }
      ];

      lanes.forEach((lane, idx) => {
        g.zombies.push({
          id: Date.now() + idx + Math.random(),
          type: 'pack_runner',
          x: 1020 + lane.xOffset + Math.random() * 20,
          y: lane.baseY,
          baseY: lane.baseY,
          waveAmplitude: lane.waveAmp,
          waveSpeed: lane.waveSpeed,
          waveOffset: lane.waveOffset,
          hp: 45 + day * 8,
          maxHp: 45 + day * 8,
          speed: 1.68 + (Math.random() - 0.5) * 0.15,
          damage: 10 + day,
          attackCooldown: 850,
          lastAttackTime: 0,
          width: 26,
          height: 52,
          isDead: false,
          deathAnimTimer: 0,
          color: '#ea580c',
          headRadius: 9
        });

        g.zombiesSpawned++;
        g.zombiesSpawnedInWave++;
      });
    };

    // Spawn Chubby Glutton Boss Zombie (Night 3 Special Boss)
    const spawnGluttonBoss = () => {
      const g = gameStateRef.current;
      if (g.bossSpawned) return;
      g.bossSpawned = true;
      g.lastBossMinionSpawnTime = performance.now();

      g.zombies.push({
        id: 888888,
        type: 'boss_glutton',
        isBoss: true,
        x: 1040,
        y: 290,
        hp: 7000, // Explicit requirement: 7000 HP for Night 3 Glutton Boss ("قم بزيادة دم بوس الاول الى 7000")
        maxHp: 7000,
        speed: 0.46, // Slow and deliberate
        damage: 28,
        attackCooldown: 1100,
        lastAttackTime: 0,
        width: 56,
        height: 84,
        isDead: false,
        isDying: false,
        deathAnimTimer: 0,
        color: '#15803d',
        headRadius: 16
      });

      audio.playZombieGroan(0.65);
      setScreenShake(8);
      g.floatingTexts.push({
        id: Math.random(),
        x: 650,
        y: 200,
        text: language === 'ar' ? '⚠️ ظهر الزعيم الأكول (الجزار المتحول)!' : '⚠️ THE GLUTTON BOSS HAS RISEN!',
        color: '#ef4444',
        life: 75,
        maxLife: 75
      });
    };

    // Spawn 3-Tentacle Boss Zombie (Night 6 Special Boss)
    // "ويوم سادس يظهر زعيم زومبي له ثلاث مجسات لا يموت الا بقطع مجساته ثلاثة وكل مجس له 3000 نقطة دم زعيم مجسات لا يتاثر بطلقات النار الا اذا كانت على مجساته وتكون نهاية مجساته مخلب مدبب وايضا عندما يصل صحة مجساته الى صفر تسقط ويخرج منه دماء لمدة اربع ثواني ويتالم ويصبح اسرع قليلا وعندما يفقد ثلاثة مجساته اجعل له انيمشن يسقط على الارض على ضهره ويرفع يديه لبشريتين فوق وثم تنتهي ليلة"
    const spawnTentacleBoss = () => {
      const g = gameStateRef.current;
      if (g.bossSpawned) return;
      g.bossSpawned = true;
      g.lastBossMinionSpawnTime = performance.now();

      g.zombies.push({
        id: 999999,
        type: 'boss_tentacle',
        isBoss: true,
        x: 1040,
        y: 290,
        hp: 9000,
        maxHp: 9000,
        speed: 0.44,
        damage: 32,
        attackCooldown: 1200,
        lastAttackTime: 0,
        width: 68,
        height: 94,
        isDead: false,
        isDying: false,
        deathAnimTimer: 0,
        color: '#9333ea',
        headRadius: 18,
        tentacles: [
          { id: 1, hp: 3000, maxHp: 3000, isSevered: false, wavePhase: 0, severBleedTimer: 0, currentYOffset: 0 },
          { id: 2, hp: 3000, maxHp: 3000, isSevered: false, wavePhase: 2.1, severBleedTimer: 0, currentYOffset: 0 },
          { id: 3, hp: 3000, maxHp: 3000, isSevered: false, wavePhase: 4.2, severBleedTimer: 0, currentYOffset: 0 }
        ],
        tentaclesSeveredCount: 0,
        isFallingBackOnGround: false
      });

      audio.playZombieGroan(0.6);
      setScreenShake(12);
      g.floatingTexts.push({
        id: Math.random(),
        x: 650,
        y: 190,
        text: language === 'ar' ? '☠️ ظهر زعيم المجسات الثلاثة (اقطع مجساته لتنتصر)!' : '☠️ 3-TENTACLE BOSS RISEN! (Sever all 3 tentacles!)',
        color: '#c084fc',
        life: 85,
        maxLife: 85
      });
    };

    const loop = (currentTime: number) => {
      animId = requestAnimationFrame(loop);
      if (isPausedRef.current) return;

      const dt = Math.min(0.1, (currentTime - lastTime) / 1000);
      lastTime = currentTime;

      const g = gameStateRef.current;
      const currentBarricade = barricadeRef.current;
      const currentSurvivors = survivorsRef.current;

      // Smooth player movement
      g.playerY += (g.targetPlayerY - g.playerY) * 0.15;

      // Wave Spawning: Day 3 (Glutton Boss), Day 6 (3-Tentacle Boss), and Regular Nights
      if (day === 6) {
        // Day 6: 3-Tentacle Boss Night!
        const livingZombies = g.zombies.filter(z => !z.isDead && !z.isDying).length;
        const remainingToSpawn = g.totalZombiesToSpawn - g.zombiesSpawned;

        if (g.batchWaveStep === 1) {
          const count = Math.min(12, remainingToSpawn);
          for (let b = 0; b < count; b++) {
            spawnSingleZombie();
          }
          if (count > 0) audio.playZombieGroan(1.15);
          g.batchWaveStep = 2;
        } else if (g.batchWaveStep === 2 && !g.bossSpawned) {
          spawnTentacleBoss();
          g.batchWaveStep = 3;
        } else if (g.batchWaveStep === 3 && livingZombies <= 4 && remainingToSpawn > 0) {
          const count = Math.min(10, remainingToSpawn);
          for (let b = 0; b < count; b++) {
            spawnSingleZombie();
          }
          g.batchWaveStep = 4;
        }
      } else if (day !== 3) {
        // Normal Nights: Batch Spawning
        // Wave 1: Exactly 20 zombies spawn all at once at the start
        // When living zombies drop to 10 or fewer: Wave 2 spawns 25 zombies all at once
        // When living zombies drop to 10 or fewer: Wave 3 spawns 35 zombies all at once
        const livingZombies = g.zombies.filter(z => !z.isDead && !z.isDying).length;
        const remainingToSpawn = g.totalZombiesToSpawn - g.zombiesSpawned;

        if (g.batchWaveStep === 1) {
          const count = Math.min(20, remainingToSpawn);
          for (let b = 0; b < count; b++) {
            spawnSingleZombie();
          }
          if (count > 0) audio.playZombieGroan(1.15);
          g.batchWaveStep = 2;
        } else if (g.batchWaveStep === 2 && livingZombies <= 10 && remainingToSpawn > 0) {
          const count = Math.min(25, remainingToSpawn);
          for (let b = 0; b < count; b++) {
            spawnSingleZombie();
          }
          if (count > 0) audio.playZombieGroan(1.15);
          g.batchWaveStep = 3;
        } else if (g.batchWaveStep === 3 && livingZombies <= 10 && remainingToSpawn > 0) {
          const count = Math.min(35, remainingToSpawn);
          for (let b = 0; b < count; b++) {
            spawnSingleZombie();
          }
          if (count > 0) audio.playZombieGroan(1.15);
          g.batchWaveStep = 4;
        } else if (g.batchWaveStep >= 4 && livingZombies <= 10 && remainingToSpawn > 0) {
          const count = Math.min(35, remainingToSpawn);
          for (let b = 0; b < count; b++) {
            spawnSingleZombie();
          }
          if (count > 0) audio.playZombieGroan(1.15);
          g.batchWaveStep++;
        }
      } else {
        // Day 3 Glutton Boss Night
        if (g.wave >= 2 && !g.bossSpawned) {
          spawnGluttonBoss();
        }

        if (!g.isWaitingNextWave && g.wave <= 4) {
          if (g.wave >= 2 && !g.trioSpawnedInCurrentWave && g.zombiesSpawnedInWave >= 1) {
            g.trioSpawnedInCurrentWave = true;
            spawnTrioPackRunners();
          }

          if (currentTime >= g.nextZombieSpawnTime && g.zombiesSpawned < g.totalZombiesToSpawn && (g.wave === 4 || g.zombiesSpawnedInWave < g.zombiesPerWave)) {
            spawnSingleZombie();
            const baseDelay = Math.max(250, 600 - day * 60);
            g.nextZombieSpawnTime = currentTime + baseDelay + Math.random() * 180;
          }

          const livingZombies = g.zombies.filter(z => !z.isDead && !z.isDying).length;
          if (g.zombiesSpawnedInWave >= g.zombiesPerWave && livingZombies <= 1 && g.wave < 4) {
            g.isWaitingNextWave = true;
            g.nextWaveStartTime = currentTime + 350;
          }
        } else if (g.isWaitingNextWave && currentTime >= g.nextWaveStartTime) {
          g.wave++;
          g.zombiesSpawnedInWave = 0;
          g.trioSpawnedInCurrentWave = false;
          g.isWaitingNextWave = false;
          audio.playZombieGroan(1.1);
        }
      }

      // Continuous firing ONLY for automatic weapons (Uzi, M4) & Plasma Gun with 20s battery drain ("وايضا قوم بتغير عمر البطارية من 40 الى 20 ثانية")
      if (weaponRef.current.id === 'plasma_rifle') {
        if (g.isMouseDown && !g.isEnded && !g.isReloading && !isPausedRef.current) {
          if (plasmaBatterySecsRef.current > 0) {
            // Drain battery timer gradually while firing
            plasmaBatterySecsRef.current = Math.max(0, plasmaBatterySecsRef.current - dt);
            setPlasmaBatterySecs(plasmaBatterySecsRef.current);
            executePlayerShot(currentTime);
          } else {
            // Battery reached 0! Consume 1 battery from inventory if available
            const batts = resourcesRef.current?.battery ?? 0;
            if (batts > 0 && setResources) {
              setResources(prev => ({
                ...prev,
                battery: Math.max(0, prev.battery - 1)
              }));
              plasmaBatterySecsRef.current = 20.0;
              setPlasmaBatterySecs(20.0);
              audio.playMechanicalClick();
              g.floatingTexts.push({
                id: Math.random(),
                x: 220,
                y: g.playerY - 20,
                text: language === 'ar' ? '🔋 تم تركيب بطارية جديدة (20.0 ثانية)' : '🔋 New Battery Loaded (20.0s)',
                color: '#22d3ee',
                life: 50,
                maxLife: 50
              });
            } else {
              // No batteries remaining!
              if (currentTime - g.lastPlayerShotTime > 1200) {
                g.lastPlayerShotTime = currentTime;
                audio.playDryFire();
                g.floatingTexts.push({
                  id: Math.random(),
                  x: 220,
                  y: g.playerY - 20,
                  text: language === 'ar' ? '⚠️ نفذت البطاريات! اجمع بالنهار' : '⚠️ OUT OF BATTERIES!',
                  color: '#ef4444',
                  life: 50,
                  maxLife: 50
                });
              }
            }
          }
        }
      } else if (g.isMouseDown && weaponRef.current.isAutomatic) {
        executePlayerShot(currentTime);
      }

      // Survivors firing slowly, exactly 4 shots to kill
      currentSurvivors.forEach((s, idx) => {
        if (!s.isRecruited || s.isDead) return;

        const sX = 110 - idx * 24;
        const sY = 160 + idx * 85;
        const lastShot = g.survivorLastShots[s.id] || 0;

        const targets = g.zombies.filter(z => !z.isDead && z.x > 260);
        if (targets.length === 0) return;

        targets.sort((a, b) => a.x - b.x);
        const target = targets[0];

        if (currentTime - lastShot > 1900 + idx * 300) {
          g.survivorLastShots[s.id] = currentTime;

          const angleToTarget = Math.atan2(target.y - sY, target.x - sX);
          const jitter = (1 - s.accuracy) * 0.15 * (Math.random() - 0.5);
          const finalAngle = angleToTarget + jitter;

          const calculatedDamage = Math.max(12, Math.ceil(target.maxHp / 4));

          g.bullets.push({
            id: Math.random(),
            x: sX + 15,
            y: sY,
            vx: Math.cos(finalAngle) * 22,
            vy: Math.sin(finalAngle) * 22,
            damage: calculatedDamage,
            isHeadshotCapable: true,
            isPlayerBullet: false,
            ownerName: s.nameAr,
            life: 45
          });

          if (Math.random() < 0.35) {
            audio.playPistol();
          }
        }
      });

      // NIGHT 3 BOSS BEHAVIOR: MINION SPAWNING EVERY 5 SECONDS & EATING ZOMBIES FOR HEALTH
      if (day === 3 && g.bossSpawned && !g.bossDefeated) {
        const boss = g.zombies.find(z => z.isBoss);
        if (boss && !boss.isDead && !boss.isDying) {
          // Spawn minions beside the boss every 5 seconds if alive minions < 3
          if (currentTime - g.lastBossMinionSpawnTime >= 5000) {
            g.lastBossMinionSpawnTime = currentTime;
            const minionCount = g.zombies.filter(z => !z.isBoss && !z.isDead).length;
            if (minionCount < 3) {
              [-65, 65].forEach(yDiff => {
                g.zombies.push({
                  id: Date.now() + Math.random(),
                  type: 'shopper',
                  x: Math.min(1010, boss.x + 35),
                  y: Math.max(140, Math.min(460, boss.y + yDiff)),
                  hp: 60,
                  maxHp: 60,
                  speed: 0.95,
                  damage: 10,
                  attackCooldown: 900,
                  lastAttackTime: 0,
                  width: 28,
                  height: 56,
                  isDead: false,
                  deathAnimTimer: 0,
                  color: '#4ade80',
                  headRadius: 10
                });
              });
              audio.playZombieGroan(1.15);
            }
          }

          // Boss Grabs and Eats nearby zombies to recover health! ("اذا مر زومبي اتجاه يمسك به وياكله ويرجع قليل من صحته")
          for (let oz = 0; oz < g.zombies.length; oz++) {
            const other = g.zombies[oz];
            if (other === boss || other.isBoss || other.isDead || other.isDying) continue;
            const dist = Math.hypot(other.x - boss.x, other.y - boss.y);
            if (dist < 46) {
              // Boss grabs the zombie and devours it!
              other.isDead = true;
              other.deathAnimTimer = 5;
              g.zombiesKilled++;
              boss.hp = Math.min(boss.maxHp, boss.hp + 75);
              audio.playZombieHit();
              audio.playZombieGroan(1.2);

              for (let p = 0; p < 16; p++) {
                g.particles.push({
                  x: boss.x - 10,
                  y: boss.y - 5,
                  vx: (Math.random() - 0.5) * 6,
                  vy: (Math.random() - 0.5) * 6,
                  color: '#dc2626',
                  size: 3 + Math.random() * 2,
                  life: 22,
                  maxLife: 22
                });
              }

              g.floatingTexts.push({
                id: Math.random(),
                x: boss.x,
                y: boss.y - 45,
                text: language === 'ar' ? '🍖 +75 HP التهم زومبي!' : '🍖 +75 HP DEVOURED ZOMBIE!',
                color: '#22c55e',
                life: 35,
                maxLife: 35
              });
              break;
            }
          }
        }
      }

      // Update Bullets & Collisions with Continuous Swept Raycast Detection (Zero Tunneling!)
      for (let b = g.bullets.length - 1; b >= 0; b--) {
        const bullet = g.bullets[b];
        const prevX = bullet.x;
        const prevY = bullet.y;
        bullet.x += bullet.vx;
        bullet.y += bullet.vy;
        bullet.life--;

        let bulletHit = false;

        // 1. Intercept and destroy flying acid projectiles ("بصقة عندما تطيح بها الطلقة تختفي")
        for (let ap = g.acidProjectiles.length - 1; ap >= 0; ap--) {
          const acid = g.acidProjectiles[ap];
          if (acid.isAttached) continue;

          for (let step = 1; step <= 5; step++) {
            const sampleX = prevX + (bullet.vx * step) / 5;
            const sampleY = prevY + (bullet.vy * step) / 5;
            const dist = Math.hypot(sampleX - acid.x, sampleY - acid.y);
            if (dist <= acid.radius + 8) {
              bulletHit = true;
              audio.playAcidDestroyed();

              // Green explosive splatter
              for (let p = 0; p < 18; p++) {
                g.particles.push({
                  x: acid.x,
                  y: acid.y,
                  vx: (Math.random() - 0.5) * 7,
                  vy: (Math.random() - 0.5) * 7,
                  color: '#4ade80',
                  size: 2.5 + Math.random() * 2.5,
                  life: 20,
                  maxLife: 20
                });
              }

              g.floatingTexts.push({
                id: Math.random(),
                x: acid.x,
                y: acid.y - 14,
                text: language === 'ar' ? '💥 تم تفجير الحمض!' : '💥 ACID SHOT DOWN!',
                color: '#4ade80',
                life: 30,
                maxLife: 30
              });

              g.acidProjectiles.splice(ap, 1);
              break;
            }
          }
          if (bulletHit) break;
        }

        if (bulletHit) {
          g.bullets.splice(b, 1);
          continue;
        }

        // 2. Perform 5-point swept raycast to prevent high-speed tunneling through zombies!
        const SUB_STEPS = 5;
        let targetZombie: ZombieEntity | null = null;
        let hitSubX = bullet.x;
        let hitSubY = bullet.y;

        for (let step = 1; step <= SUB_STEPS; step++) {
          const sampleX = prevX + (bullet.vx * step) / SUB_STEPS;
          const sampleY = prevY + (bullet.vy * step) / SUB_STEPS;

          for (let z = 0; z < g.zombies.length; z++) {
            const zombie = g.zombies[z];
            if (zombie.isDead || zombie.isDying) continue;

            const zLeft = zombie.x - zombie.width / 2 - 8;
            const zRight = zombie.x + zombie.width / 2 + 8;
            const zTop = zombie.y - zombie.height / 2 - 6;
            const zBottom = zombie.y + zombie.height / 2 + 6;

            if (sampleX >= zLeft && sampleX <= zRight && sampleY >= zTop && sampleY <= zBottom) {
              targetZombie = zombie;
              hitSubX = sampleX;
              hitSubY = sampleY;
              break;
            }
          }
          if (targetZombie) break;
        }

        if (targetZombie) {
          bulletHit = true;
          const zombie = targetZombie;
          if (bullet.isPlayerBullet) g.shotsHit++;

          const zTop = zombie.y - zombie.height / 2;
          // Headshot calculation: hit near top of zombie
          const isHead = hitSubY <= (zTop + zombie.height * 0.32);
          let finalDamage = bullet.damage;

          if (isHead) {
            finalDamage = Math.round(bullet.damage * 5.0); // 5x base (doubled headshot multiplier)!
            if (bullet.isPlayerBullet) {
              g.headshots++;
              if (day === 4) {
                g.nightHeadshotKills++;
                setDay4Headshots(g.nightHeadshotKills);

                // Check 20-headshot milestone for Plasma Rifle unlock
                if (g.nightHeadshotKills >= 20 && !allWeaponsRef.current.plasma_rifle.unlocked) {
                  audio.playCashRegister();
                  setScreenShake(10);
                  const unlockedPlasma: Weapon = {
                    ...allWeaponsRef.current.plasma_rifle,
                    unlocked: true
                  };
                  setAllWeapons(prev => ({
                    ...prev,
                    plasma_rifle: unlockedPlasma
                  }));
                  setActiveWeapon(unlockedPlasma);
                  weaponRef.current = unlockedPlasma;
                  gameStateRef.current.clip = unlockedPlasma.clipSize;
                  setCurrentClip(unlockedPlasma.clipSize);

                  g.floatingTexts.push({
                    id: Math.random(),
                    x: 500,
                    y: 180,
                    text: language === 'ar' ? '⚡ تم فتح سلاح البلازما الحارق بنجاح!' : '⚡ PLASMA RIFLE UNLOCKED!',
                    color: '#22d3ee',
                    life: 90,
                    maxLife: 90
                  });
                }
              }
            }
          }

          if (zombie.type === 'armored' && !isHead) {
            finalDamage = 0;
            audio.playMechanicalClick();
            for (let sp = 0; sp < 3; sp++) {
              g.particles.push({
                x: zombie.x - 6,
                y: hitSubY,
                vx: -(2 + Math.random() * 2),
                vy: (Math.random() - 0.5) * 3,
                color: '#facc15',
                size: 2,
                life: 6,
                maxLife: 6
              });
            }
          }

          // 3-TENTACLE BOSS: Only takes damage on its tentacles!
          // "زعيم مجسات لا يتاثر بطلقات النار الا اذا كانت على مجساته وتكون نهاية مجساته مخلب مدبب وايضا عندما يصل صحة مجساته الى صفر تسقط ويخرج منه دماء لمدة اربع ثواني ويتالم ويصبح اسرع قليلا وعندما يفقد ثلاثة مجساته اجعل له انيمشن يسقط على الارض على ضهره ويرفع يديه لبشريتين فوق وثم تنتهي ليلة"
          if (zombie.type === 'boss_tentacle') {
            let hitTentacle: TentacleData | null = null;
            if (zombie.tentacles) {
              const offsets = [-28, 0, 28];
              for (let tIdx = 0; tIdx < zombie.tentacles.length; tIdx++) {
                const tent = zombie.tentacles[tIdx];
                if (tent.isSevered) continue;
                const tentY = zombie.y + offsets[tIdx];
                if (Math.abs(hitSubY - tentY) <= 26) {
                  hitTentacle = tent;
                  break;
                }
              }
            }

            if (hitTentacle) {
              hitTentacle.hp = Math.max(0, hitTentacle.hp - finalDamage);
              audio.playZombieHit();
              for (let bp = 0; bp < 5; bp++) {
                g.particles.push({
                  x: zombie.x - 45,
                  y: hitSubY,
                  vx: -(1 + Math.random() * 3),
                  vy: (Math.random() - 0.5) * 3,
                  color: '#dc2626',
                  size: 2.5,
                  life: 12,
                  maxLife: 12
                });
              }

              if (hitTentacle.hp <= 0 && !hitTentacle.isSevered) {
                hitTentacle.hp = 0;
                hitTentacle.isSevered = true;
                hitTentacle.severBleedTimer = 240; // 4 seconds of arterial blood at 60fps
                zombie.tentaclesSeveredCount = (zombie.tentaclesSeveredCount || 0) + 1;
                zombie.speed += 0.12; // "ويصبح اسرع قليلا"
                zombie.isPainStunned = true; // "ويتالم"
                zombie.painStunTimer = 40;
                audio.playZombieGroan(1.3);
                setScreenShake(8);

                if (zombie.tentaclesSeveredCount >= 3) {
                  zombie.isFallingBackOnGround = true;
                  zombie.fallBackTimer = 110;
                  audio.playZombieGroan(0.5);
                }
              }
            } else {
              // Body shots are completely deflected!
              finalDamage = 0;
              audio.playMechanicalClick();
              for (let sp = 0; sp < 3; sp++) {
                g.particles.push({
                  x: zombie.x - 12,
                  y: hitSubY,
                  vx: -(2 + Math.random() * 2),
                  vy: (Math.random() - 0.5) * 3,
                  color: '#c084fc',
                  size: 2,
                  life: 6,
                  maxLife: 6
                });
              }
            }
          }

          // Check if this shot kills the zombie
          const isFatal = zombie.hp - finalDamage <= 0;

          if (isHead && isFatal && !zombie.isBoss) {
            // FATAL HEADSHOT ONLY: HEAD EXPLODES! ("اجعل راس زومبي ينفجر عندما طلقة هيدشوت تصبح قاتلة")
            zombie.headless = true;
            audio.playHeadshot();

            // Explosive skull & brain particles flying upward!
            for (let hp = 0; hp < 20; hp++) {
              g.particles.push({
                x: zombie.x + (Math.random() - 0.5) * 8,
                y: zTop + 5,
                vx: (Math.random() - 0.5) * 8,
                vy: -3 - Math.random() * 5,
                color: Math.random() < 0.6 ? '#991b1b' : '#f8fafc', // Red blood and white skull bone shards
                size: 2 + Math.random() * 3,
                life: 25,
                maxLife: 25
              });
            }

            g.floatingTexts.push({
              id: Math.random(),
              x: zombie.x,
              y: zTop - 12,
              text: language === 'ar' ? `💥 رأس قاتل! -${finalDamage}` : `💥 FATAL HEADSHOT! -${finalDamage}`,
              color: '#fbbf24',
              life: 35,
              maxLife: 35
            });
          } else if (isHead) {
            // Headshot but NOT fatal! Head stays completely intact on zombie!
            audio.playZombieHit();
            g.floatingTexts.push({
              id: Math.random(),
              x: zombie.x,
              y: zTop - 10,
              text: language === 'ar' ? `رأس! -${finalDamage}` : `HEADSHOT! -${finalDamage}`,
              color: '#fbbf24',
              life: 25,
              maxLife: 25
            });
          } else {
            // Body shot
            audio.playZombieHit();
            g.floatingTexts.push({
              id: Math.random(),
              x: zombie.x + (Math.random() - 0.5) * 15,
              y: hitSubY,
              text: `-${finalDamage}`,
              color: '#f87171',
              life: 20,
              maxLife: 20
            });
          }

          zombie.hp -= finalDamage;

          // Blood splatters in air
          for (let p = 0; p < (isHead ? 10 : 5); p++) {
            g.particles.push({
              x: hitSubX,
              y: hitSubY,
              vx: (Math.random() - 0.5) * 4 + (bullet.vx > 0 ? 2 : -2),
              vy: (Math.random() - 0.5) * 4,
              color: isHead ? '#dc2626' : '#991b1b',
              size: 2 + Math.random() * 3,
              life: 20,
              maxLife: 20
            });
          }

          // BLOOD STAINS ON FLOOR: DISAPPEARS AFTER EXACTLY 3 SECONDS (180 frames @ 60fps)!
          g.bloodStains.push({
            x: zombie.x + (Math.random() - 0.5) * 16,
            y: Math.min(500, zombie.y + zombie.height / 2 + (Math.random() - 0.5) * 6),
            r: 5 + Math.random() * 8,
            alpha: 0.75,
            life: 180,
            maxLife: 180
          });

          if (zombie.hp <= 0 && !zombie.isDead) {
            if (zombie.isBoss) {
              // Boss enters dramatic dying sequence
              if (!zombie.isDying) {
                zombie.isDying = true;
                zombie.speed = 0;
                zombie.deathAnimTimer = 85;
              }
            } else {
              zombie.isDead = true;
              zombie.deathAnimTimer = 30;
              g.zombiesKilled++;

              if (Math.random() < 0.35) {
                audio.playZombieGroan(0.8 + Math.random() * 0.4);
              }
            }
          }
        }

        if (bulletHit || bullet.life <= 0 || bullet.x > 1050 || bullet.x < 0) {
          g.bullets.splice(b, 1);
        }
      }

      // UPDATE LANDMINES & TRAPS (PROXIMITY DETONATION)
      for (let m = g.landmines.length - 1; m >= 0; m--) {
        const mine = g.landmines[m];
        if (!mine.isArmed) continue;

        let detonated = false;

        // Check if any living zombie is within trigger radius
        for (let z = 0; z < g.zombies.length; z++) {
          const zombie = g.zombies[z];
          if (zombie.isDead) continue;

          const dist = Math.hypot(zombie.x - mine.x, zombie.y - mine.y);
          if (dist <= mine.radius) {
            detonated = true;
            break;
          }
        }

        if (detonated) {
          audio.playExplosion();
          setScreenShake(10);

          // Area blast damage to all zombies nearby
          g.zombies.forEach(z => {
            if (z.isDead) return;
            const dist = Math.hypot(z.x - mine.x, z.y - mine.y);
            if (dist <= 85) {
              const dmg = Math.round(mine.damage * (1 - dist / 85));
              z.hp -= dmg;
              if (z.hp <= 0 && !z.isDead) {
                z.isDead = true;
                z.deathAnimTimer = 30;
                g.zombiesKilled++;
              }
            }
          });

          // Blast particles
          for (let p = 0; p < 30; p++) {
            const ang = Math.random() * Math.PI * 2;
            const spd = 4 + Math.random() * 6;
            g.particles.push({
              x: mine.x,
              y: mine.y,
              vx: Math.cos(ang) * spd,
              vy: Math.sin(ang) * spd,
              color: Math.random() < 0.5 ? '#f97316' : '#cbd5e1',
              size: 3 + Math.random() * 3,
              life: 25,
              maxLife: 25
            });
          }

          // Disappearing blood/char spot
          g.bloodStains.push({
            x: mine.x,
            y: mine.y,
            r: 18,
            alpha: 0.6,
            life: 180,
            maxLife: 180
          });

          g.landmines.splice(m, 1);
        }
      }

      // Update Throwables
      for (let th = g.throwables.length - 1; th >= 0; th--) {
        const item = g.throwables[th];
        item.x += item.vx;
        item.y += item.vy;
        item.fuseTimer--;

        if (item.fuseTimer <= 0 && !item.exploded) {
          item.exploded = true;

          if (item.type === 'molotov') {
            audio.playFire();
            g.fireZones.push({
              id: Math.random(),
              x: item.x,
              y: item.y,
              radius: 65,
              duration: 380,
              damagePerSec: 35
            });

            for (let f = 0; f < 25; f++) {
              g.particles.push({
                x: item.x + (Math.random() - 0.5) * 30,
                y: item.y + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 5,
                vy: -Math.random() * 4,
                color: '#f97316',
                size: 3 + Math.random() * 4,
                life: 30,
                maxLife: 30
              });
            }
          } else if (item.type === 'pipe_bomb') {
            audio.playExplosion();
            setScreenShake(12);

            g.zombies.forEach(z => {
              if (z.isDead) return;
              const dist = Math.hypot(z.x - item.x, z.y - item.y);
              if (dist <= 130) {
                const blastDamage = Math.round(180 * (1 - dist / 130));
                z.hp -= blastDamage;
                if (z.hp <= 0 && !z.isDead) {
                  z.isDead = true;
                  z.deathAnimTimer = 30;
                  g.zombiesKilled++;
                }
              }
            });

            for (let p = 0; p < 35; p++) {
              const ang = Math.random() * Math.PI * 2;
              const spd = 4 + Math.random() * 8;
              g.particles.push({
                x: item.x,
                y: item.y,
                vx: Math.cos(ang) * spd,
                vy: Math.sin(ang) * spd,
                color: '#e2e8f0',
                size: 3 + Math.random() * 3,
                life: 25,
                maxLife: 25
              });
            }
          }

          g.throwables.splice(th, 1);
        }
      }

      // Update Fire Zones
      for (let f = g.fireZones.length - 1; f >= 0; f--) {
        const fire = g.fireZones[f];
        fire.duration--;

        g.zombies.forEach(z => {
          if (z.isDead) return;
          const dist = Math.hypot(z.x - fire.x, z.y - fire.y);
          if (dist <= fire.radius) {
            z.hp -= 0.6;
            if (z.hp <= 0 && !z.isDead) {
              z.isDead = true;
              z.deathAnimTimer = 30;
              g.zombiesKilled++;
            }
          }
        });

        if (fire.duration <= 0) {
          g.fireZones.splice(f, 1);
        }
      }

      // Electric Barricade shock pulse
      if (currentBarricade.hasElectricGrid && currentTime >= g.nextElectricShockTime) {
        g.nextElectricShockTime = currentTime + 2200;
        let shocked = false;
        g.zombies.forEach(z => {
          if (!z.isDead && z.x <= 265) {
            z.hp -= 20;
            shocked = true;
            for (let e = 0; e < 6; e++) {
              g.particles.push({
                x: 245 + (Math.random() - 0.5) * 15,
                y: z.y + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                color: '#38bdf8',
                size: 2 + Math.random() * 2,
                life: 12,
                maxLife: 12
              });
            }
            if (z.hp <= 0 && !z.isDead) {
              z.isDead = true;
              z.deathAnimTimer = 30;
              g.zombiesKilled++;
            }
          }
        });
        if (shocked) {
          audio.playMechanicalClick();
        }
      }

      // Update Blood Stains: Fades out and disappears after 3 seconds!
      for (let s = g.bloodStains.length - 1; s >= 0; s--) {
        const stain = g.bloodStains[s];
        stain.life--;
        // Fade out smoothly in the final second (last 60 frames)
        if (stain.life < 60) {
          stain.alpha = (stain.life / 60) * 0.7;
        }
        if (stain.life <= 0) {
          g.bloodStains.splice(s, 1);
        }
      }

      // Update Zombies Movement
      const barricadeX = 245;

      for (let z = g.zombies.length - 1; z >= 0; z--) {
        const zombie = g.zombies[z];

        if (zombie.isDead) {
          zombie.deathAnimTimer--;
          if (zombie.deathAnimTimer <= 0) {
            g.zombies.splice(z, 1);
          }
          continue;
        }

        // BOSS DYING ANIMATION: BELLY THROBS, INFLATES, AND EXPLODES WITH BLOOD SPLATTER
        if (zombie.isBoss && zombie.isDying) {
          zombie.deathAnimTimer--;
          zombie.bellyPulse = Math.sin(zombie.deathAnimTimer * 0.45) * 16;

          if (Math.random() < 0.35) {
            g.particles.push({
              x: zombie.x + (Math.random() - 0.5) * 20,
              y: zombie.y + (Math.random() - 0.5) * 20,
              vx: (Math.random() - 0.5) * 4,
              vy: (Math.random() - 0.5) * 4,
              color: '#b91c1c',
              size: 3,
              life: 15,
              maxLife: 15
            });
          }

          if (zombie.deathAnimTimer <= 1) {
            // BELLY BURSTS! Massive explosion covering the supermarket in blood ("تنفجر بطنة وستطلخ ارجاء سوبر ماركت بالدم فقط")
            zombie.isDead = true;
            zombie.deathAnimTimer = 0;
            g.bossDefeated = true;
            g.zombiesKilled = g.totalZombiesToSpawn;
            g.zombiesSpawned = g.totalZombiesToSpawn;
            audio.playExplosion();
            setScreenShake(24);
            g.bloodFlashAlpha = 0.6;

            // Immediately eliminate any remaining minions so Night 3 ends without delay!
            g.zombies.forEach(other => {
              if (other !== zombie && !other.isDead) {
                other.isDead = true;
                other.deathAnimTimer = 5;
              }
            });
            setRemainingZombies(0);
            setNightProgress(100);

            // Lightweight crisp flying blood and bone shards (optimized for zero lag)
            for (let p = 0; p < 32; p++) {
              const ang = Math.random() * Math.PI * 2;
              const spd = 3 + Math.random() * 6;
              g.particles.push({
                x: zombie.x,
                y: zombie.y,
                vx: Math.cos(ang) * spd,
                vy: Math.sin(ang) * spd,
                color: Math.random() < 0.6 ? '#991b1b' : Math.random() < 0.85 ? '#dc2626' : '#f8fafc',
                size: 2.5 + Math.random() * 2,
                life: 22,
                maxLife: 22
              });
            }

            // Splatter 6 blood decals across floor
            for (let s = 0; s < 6; s++) {
              g.bloodStains.push({
                x: Math.max(260, Math.min(960, zombie.x + (Math.random() - 0.5) * 350)),
                y: Math.max(140, Math.min(490, zombie.y + (Math.random() - 0.5) * 180)),
                r: 12 + Math.random() * 14,
                alpha: 0.85,
                life: 180,
                maxLife: 180
              });
            }

            g.floatingTexts.push({
              id: Math.random(),
              x: zombie.x,
              y: zombie.y - 35,
              text: language === 'ar' ? '💥 انفجرت بطن الزعيم وتلطخ المكان بالدم!' : '💥 BOSS BELLY EXPLODED!',
              color: '#f87171',
              life: 65,
              maxLife: 65
            });
          }
          continue;
        }

        // TENTACLE BOSS LOGIC: 4-second arterial bleeding, pain stun, and fallen surrender
        if (zombie.type === 'boss_tentacle') {
          if (zombie.tentacles) {
            zombie.tentacles.forEach(t => {
              if (t.isSevered && t.severBleedTimer && t.severBleedTimer > 0) {
                t.severBleedTimer--;
              }
            });
          }

          if (zombie.isPainStunned && zombie.painStunTimer) {
            zombie.painStunTimer--;
            if (zombie.painStunTimer <= 0) {
              zombie.isPainStunned = false;
            }
          }

          if (zombie.isFallingBackOnGround) {
            zombie.speed = 0;
            if (zombie.fallBackTimer && zombie.fallBackTimer > 0) {
              zombie.fallBackTimer--;
              if (zombie.fallBackTimer <= 1) {
                zombie.isDead = true;
                g.bossDefeated = true;
                g.zombiesKilled = g.totalZombiesToSpawn;
                g.zombiesSpawned = g.totalZombiesToSpawn;
                g.zombies.forEach(other => {
                  if (other !== zombie && !other.isDead) {
                    other.isDead = true;
                    other.deathAnimTimer = 5;
                  }
                });
                setRemainingZombies(0);
                setNightProgress(100);
              }
            }
            continue;
          }
        }

        // SPITTER ZOMBIE LOGIC: 3 steps forward (~65px), then spits acid!
        // "اجعله عندما يظهر يتقدم ثلاث خطوات ثم يبصق مادة حمضية تقوم بذابة 15بالمئة من دفاع لكن بشكل بطيى"
        if (zombie.type === 'spitter' && !zombie.hasSpit && !zombie.isDead) {
          zombie.stepsTaken = (zombie.stepsTaken || 0) + 1;
          if (zombie.stepsTaken >= 65) {
            zombie.hasSpit = true;
            g.acidProjectiles.push({
              id: Date.now() + Math.random(),
              x: zombie.x - 14,
              y: zombie.y - 8,
              vx: -5.8, // "اجعلها شوية سريعة لكي نضربها"
              vy: 0,
              radius: 9,
              meltDamageLeft: Math.round(currentBarricade.maxHp * 0.15),
              isAttached: false,
              meltTimer: 300 // 5 seconds of slow sizzling melt
            });
            audio.playAcidSpit();
            g.floatingTexts.push({
              id: Math.random(),
              x: zombie.x,
              y: zombie.y - 25,
              text: language === 'ar' ? '🧪 بصقة حمضية!' : '🧪 ACID SPIT!',
              color: '#4ade80',
              life: 30,
              maxLife: 30
            });
          }
        }

        // BURNING ZOMBIE DURATION & DAMAGE PER SECOND (From Shahd fire arrow or Plasma gun)
        if (zombie.isBurning && zombie.burnTimer && zombie.burnTimer > 0) {
          zombie.burnTimer--;
          zombie.hp -= 0.35; // ~21 dps
          // Throttled particle spawn to maintain solid 60 FPS even with 40+ burning zombies
          if (Math.random() < 0.04 && g.particles.length < 45) {
            g.particles.push({
              x: zombie.x + (Math.random() - 0.5) * 10,
              y: zombie.y + (Math.random() - 0.5) * 16,
              vx: (Math.random() - 0.5) * 1.5,
              vy: -1 - Math.random() * 1.5,
              color: Math.random() < 0.5 ? '#f97316' : '#ea580c',
              size: 2.5,
              life: 10,
              maxLife: 10
            });
          }
          if (zombie.hp <= 0 && !zombie.isDead) {
            zombie.isDead = true;
            zombie.deathAnimTimer = 30;
            g.zombiesKilled++;
          }
          if (zombie.burnTimer <= 0) {
            zombie.isBurning = false;
          }
        }

        if (zombie.type === 'pack_runner' && zombie.baseY !== undefined && zombie.waveAmplitude !== undefined) {
          zombie.y = Math.max(130, Math.min(480, zombie.baseY + Math.sin(zombie.x * (zombie.waveSpeed || 0.02) + (zombie.waveOffset || 0)) * zombie.waveAmplitude));

          if (Math.random() < 0.25) {
            g.particles.push({
              x: zombie.x + 8,
              y: zombie.y + zombie.height / 2,
              vx: 1 + Math.random() * 2,
              vy: -0.5 - Math.random(),
              color: '#94a3b8',
              size: 2,
              life: 14,
              maxLife: 14
            });
          }
        }

        // Attacking barricade
        if (currentBarricade.hp > 0 && zombie.x <= barricadeX + 15) {
          if (currentTime - zombie.lastAttackTime >= zombie.attackCooldown) {
            zombie.lastAttackTime = currentTime;
            const dmg = zombie.damage;
            g.barricadeDamageTaken += dmg;

            setBarricade(prev => ({
              ...prev,
              hp: Math.max(0, prev.hp - dmg)
            }));

            audio.playBarricadeHit();
            setScreenShake(3);

            if (currentBarricade.hasBarbedWire) {
              zombie.hp -= 14;
              if (zombie.hp <= 0 && !zombie.isDead) {
                zombie.isDead = true;
                zombie.deathAnimTimer = 30;
                g.zombiesKilled++;
              }
            }
          }
        } else {
          zombie.x -= zombie.speed;

          if (currentBarricade.hp <= 0 && zombie.x <= 165) {
            if (currentTime - zombie.lastAttackTime >= zombie.attackCooldown) {
              zombie.lastAttackTime = currentTime;
              setPlayerHealth(prev => {
                const nextHp = Math.max(0, prev - zombie.damage);
                if (nextHp <= 0 && !g.isEnded) {
                  g.isEnded = true;
                  onGameOver();
                }
                return nextHp;
              });
              audio.playZombieHit();
              setScreenShake(5);
            }
          }
        }
      }

      // Update Acid Projectiles (Flight, Barricade Attachment & 15% Slow Sizzling Melt)
      for (let ap = g.acidProjectiles.length - 1; ap >= 0; ap--) {
        const acid = g.acidProjectiles[ap];

        if (!acid.isAttached) {
          acid.x += acid.vx;

          if (Math.random() < 0.35) {
            g.particles.push({
              x: acid.x + 8,
              y: acid.y + (Math.random() - 0.5) * 6,
              vx: 1 + Math.random() * 2,
              vy: (Math.random() - 0.5) * 2,
              color: '#4ade80',
              size: 2.5,
              life: 14,
              maxLife: 14
            });
          }

          // Barricade impact: attaches and begins melting 15% over 5 seconds (300 frames)
          if (acid.x <= barricadeX + 15) {
            acid.isAttached = true;
            acid.x = barricadeX + 4;
            acid.meltTimer = 300;
            audio.playAcidSizzle();
            g.floatingTexts.push({
              id: Math.random(),
              x: acid.x,
              y: acid.y,
              text: language === 'ar' ? '⚠️ ذوبان حمضي -15%!' : '⚠️ ACID MELT -15%!',
              color: '#22c55e',
              life: 45,
              maxLife: 45
            });
          }
        } else {
          // Attached to barricade: slowly melts 15% of barricade max HP over 5s (300 frames)
          if (acid.meltTimer !== undefined && acid.meltTimer > 0 && currentBarricade.hp > 0) {
            acid.meltTimer--;
            const meltPerFrame = (currentBarricade.maxHp * 0.15) / 300;
            setBarricade(prev => ({
              ...prev,
              hp: Math.max(0, prev.hp - meltPerFrame)
            }));
            g.barricadeDamageTaken += meltPerFrame;

            if (Math.random() < 0.25) {
              audio.playAcidSizzle();
              g.particles.push({
                x: acid.x + (Math.random() - 0.5) * 8,
                y: acid.y + (Math.random() - 0.5) * 14,
                vx: -1 - Math.random(),
                vy: -1 - Math.random() * 2,
                color: '#10b981',
                size: 2.5,
                life: 16,
                maxLife: 16
              });
            }

            if (acid.meltTimer <= 0) {
              g.acidProjectiles.splice(ap, 1);
              continue;
            }
          } else {
            g.acidProjectiles.splice(ap, 1);
            continue;
          }
        }

        if (acid.x < -30) {
          g.acidProjectiles.splice(ap, 1);
        }
      }

      // Update Survivor Active Ability UI timer and cooldown ratio (20s)
      const elapsedSinceAbility = currentTime - g.lastAbilityTime;
      const abilityCooldownRemaining = Math.max(0, 20000 - elapsedSinceAbility);
      setAbilityCooldownSecs(Math.ceil(abilityCooldownRemaining / 1000));
      setAbilityCooldownRatio(Math.min(1, elapsedSinceAbility / 20000));

      // Screen shake decay
      if (screenShake > 0) {
        setScreenShake(prev => Math.max(0, prev - 0.4));
      }

      // Progress & Remaining Zombies Counter
      const killedRatio = g.zombiesKilled / Math.max(1, g.totalZombiesToSpawn);
      setNightProgress(Math.min(100, Math.round(killedRatio * 100)));
      const remainingCount = Math.max(0, g.totalZombiesToSpawn - g.zombiesKilled);
      setRemainingZombies(remainingCount);

      // Living zombies on screen (actively threatening the supermarket)
      const livingZombiesCount = g.zombies.filter(z => !z.isDead && !z.isDying).length;

      // In Night 3: Night ends IMMEDIATELY when Glutton Boss is defeated! ("اخبرتك ان ليلة ثالثه تنتهي عندما يموت الزعيم لا داعي الى قتل جميع زومبي")
      // In Night 6: Night ends IMMEDIATELY when 3-tentacle boss is defeated!
      const isNight3BossAlive = day === 3 && (!g.bossSpawned || !g.bossDefeated);
      const isNight6BossAlive = day === 6 && (!g.bossSpawned || !g.bossDefeated);

      // Victory Condition for the Night: Instant victory on boss defeat or full wave elimination
      const allQuotaSpawnedAndDead = (g.zombiesSpawned >= g.totalZombiesToSpawn || g.zombiesKilled >= g.totalZombiesToSpawn) && livingZombiesCount === 0;
      const isNightVictory = 
        !g.isEnded && (
          (day === 3 && g.bossSpawned && g.bossDefeated) ||
          (day === 6 && g.bossSpawned && g.bossDefeated) ||
          (allQuotaSpawnedAndDead && !isNight3BossAlive && !isNight6BossAlive)
        );

      if (isNightVictory) {
        g.isEnded = true;
        if (day === 3 || day === 6) {
          g.zombies.forEach(z => {
            if (!z.isDead) {
              z.isDead = true;
              z.deathAnimTimer = 5;
            }
          });
          setRemainingZombies(0);
          setNightProgress(100);
        }
        audio.playCashRegister();
        onNightComplete({
          day,
          zombiesKilled: g.zombiesKilled,
          headshots: g.headshots,
          shotsFired: g.shotsFired,
          shotsHit: g.shotsHit,
          barricadeDamageTaken: Math.round(g.barricadeDamageTaken)
        });
      }

      // RENDER CANVAS
      ctx.save();
      if (screenShake > 0) {
        const sx = (Math.random() - 0.5) * screenShake * 2;
        const sy = (Math.random() - 0.5) * screenShake * 2;
        ctx.translate(sx, sy);
      }

      ctx.fillStyle = '#0a0b0e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (g.bgImage) {
        ctx.drawImage(g.bgImage, 0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = '#141820';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Draw Disappearing Blood Stains (Fades out after 3 seconds)
      g.bloodStains.forEach(stain => {
        ctx.beginPath();
        ctx.arc(stain.x, stain.y, stain.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(136, 19, 19, ${stain.alpha})`;
        ctx.fill();
      });

      // Draw Planted Landmines & Traps on floor
      g.landmines.forEach(mine => {
        ctx.save();
        // Outer metallic rim
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.arc(mine.x, mine.y, 11, 0, Math.PI * 2);
        ctx.fill();

        // Inner plate
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(mine.x, mine.y, 8, 0, Math.PI * 2);
        ctx.fill();

        // Blinking red sensor light
        ctx.fillStyle = Math.sin(currentTime * 0.008) > 0 ? '#ef4444' : '#7f1d1d';
        ctx.beginPath();
        ctx.arc(mine.x, mine.y, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Proximity sensor ring
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(mine.x, mine.y, mine.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });

      // Fire Zones
      // Fire Zones (High-speed flat fills without GPU gradient allocation churn)
      g.fireZones.forEach(fire => {
        ctx.fillStyle = 'rgba(234, 88, 12, 0.42)';
        ctx.beginPath();
        ctx.arc(fire.x, fire.y, fire.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(251, 146, 60, 0.65)';
        ctx.beginPath();
        ctx.arc(fire.x, fire.y, fire.radius * 0.45, 0, Math.PI * 2);
        ctx.fill();
      });

      // Flashlight beam from gun to mouse (Optimized dual-layered cone)
      const pX = 180;
      const pY = g.playerY;
      const aimAngle = Math.atan2(g.mouseY - pY, g.mouseX - pX);
      const beamLength = 700;
      const beamSpread = 0.28;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(pX, pY);
      ctx.arc(pX, pY, beamLength, aimAngle - beamSpread, aimAngle + beamSpread);
      ctx.closePath();
      ctx.fillStyle = 'rgba(254, 240, 138, 0.09)';
      ctx.fill();

      // Bright inner core
      ctx.beginPath();
      ctx.moveTo(pX, pY);
      ctx.arc(pX, pY, beamLength * 0.5, aimAngle - beamSpread * 0.4, aimAngle + beamSpread * 0.4);
      ctx.closePath();
      ctx.fillStyle = 'rgba(254, 240, 138, 0.13)';
      ctx.fill();
      ctx.restore();

      // Draw Barricade
      ctx.save();
      const bX = barricadeX - 15;
      const bHpRatio = currentBarricade.hp / Math.max(1, currentBarricade.maxHp);

      if (currentBarricade.hp > 0) {
        ctx.fillStyle = bHpRatio > 0.4 ? '#475569' : '#7f1d1d';
        ctx.fillRect(bX, 120, 24, 380);

        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        for (let cy = 130; cy < 490; cy += 35) {
          ctx.strokeRect(bX - 4, cy, 28, 28);
          ctx.fillStyle = '#1e293b';
          ctx.beginPath();
          ctx.arc(bX + 2, cy + 28, 4, 0, Math.PI * 2);
          ctx.arc(bX + 20, cy + 28, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        if (currentBarricade.hasBarbedWire) {
          ctx.strokeStyle = '#cbd5e1';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          for (let cy = 120; cy < 500; cy += 12) {
            ctx.lineTo(bX + (cy % 24 === 0 ? 30 : 18), cy);
          }
          ctx.stroke();
        }

        if (currentBarricade.hasElectricGrid && Math.random() < 0.3) {
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(bX + 10, 130 + Math.random() * 340);
          ctx.lineTo(bX + 25, 130 + Math.random() * 340);
          ctx.stroke();
        }
      } else {
        ctx.fillStyle = '#334155';
        ctx.fillRect(bX, 120, 12, 380);
        ctx.fillStyle = '#dc2626';
        ctx.font = 'bold 12px "Chakra Petch", sans-serif';
        ctx.fillText('BREACHED!', bX - 35, 300);
      }
      ctx.restore();

      // Draw Survivors
      currentSurvivors.forEach((s, idx) => {
        if (!s.isRecruited || s.isDead) return;
        const sX = 110 - idx * 24;
        const sY = 160 + idx * 85;

        ctx.save();
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.arc(sX, sY, 9, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(sX, sY);
        ctx.lineTo(sX + 16, sY);
        ctx.stroke();

        ctx.fillStyle = '#e2e8f0';
        ctx.font = '10px "Tajawal", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(language === 'ar' ? s.nameAr : s.name, sX, sY - 14);
        ctx.restore();
      });

      // Draw Player Character (Supermarket Hero from photo)
      const isPlayerShooting = currentTime - g.lastPlayerShotTime < 90;
      drawHeroCharacter(
        ctx,
        pX,
        pY,
        aimAngle,
        activeWeapon,
        isPlayerShooting,
        currentTime,
        playerHealth / Math.max(1, maxPlayerHealth)
      );

      // Reload indicator
      if (g.isReloading) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(pX, pY - 26, 12, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(pX, pY - 26, 12, -Math.PI / 2, -Math.PI / 2 + reloadProgress * Math.PI * 2);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();
      }

      // Draw Throwables
      g.throwables.forEach(th => {
        ctx.save();
        if (th.type === 'molotov') {
          ctx.fillStyle = '#f97316';
          ctx.beginPath();
          ctx.arc(th.x, th.y, 6, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = '#64748b';
          ctx.beginPath();
          ctx.arc(th.x, th.y, 7, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // Draw Acid Projectiles (both flying toxic glob and bubbling barricade pool)
      g.acidProjectiles.forEach(acid => {
        ctx.save();
        if (acid.isAttached) {
          // Bubbling corrosive pool on barricade
          ctx.fillStyle = 'rgba(22, 163, 74, 0.85)';
          ctx.beginPath();
          ctx.ellipse(acid.x, acid.y, 8, 16, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#86efac';
          ctx.beginPath();
          ctx.arc(acid.x + 2, acid.y + (Math.sin(currentTime * 0.02) * 5), 3, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Flying toxic acid spit
          const grad = ctx.createRadialGradient(acid.x, acid.y, 2, acid.x, acid.y, acid.radius);
          grad.addColorStop(0, '#bbf7d0');
          grad.addColorStop(0.5, '#22c55e');
          grad.addColorStop(1, 'rgba(21, 128, 61, 0.2)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(acid.x, acid.y, acid.radius, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#4ade80';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
        ctx.restore();
      });

      // Draw Zombies (Handling Fat Zombie, Spitter, Headless Headshot Explosion, and Runners)
      g.zombies.forEach(z => {
        ctx.save();
        const zLeft = z.x - z.width / 2;
        const zTop = z.y - z.height / 2;

        if (z.isDead) {
          // Dark blood pool
          ctx.fillStyle = '#450a0a';
          ctx.beginPath();
          ctx.ellipse(z.x, z.y + z.height / 3, z.width / 2 + 6, 8, 0, 0, Math.PI * 2);
          ctx.fill();

          // Fallen zombie body (tattered blue jeans and brown jacket matching photo)
          ctx.fillStyle = '#243b53'; // blue jeans
          ctx.fillRect(z.x + 2, z.y + z.height / 3 - 3, 16, 5);
          ctx.fillStyle = '#785338'; // brown jacket
          ctx.fillRect(z.x - 12, z.y + z.height / 3 - 4, 16, 7);
          if (!z.headless) {
            ctx.fillStyle = '#82a567'; // olive green rotting head
            ctx.beginPath();
            ctx.arc(z.x - 17, z.y + z.height / 3, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#44301e'; // hair
            ctx.fillRect(z.x - 22, z.y + z.height / 3 - 4, 6, 5);
          }
        } else {
          // Dedicated Pixel Art rendering per zombie type
          if (z.isBoss || z.type === 'boss_glutton') {
            drawGluttonBoss(ctx, z, currentTime, language);
          } else if (z.type === 'fat_zombie') {
            drawFatZombie(ctx, z, currentTime);
          } else if (z.type === 'spitter') {
            drawSpitterZombie(ctx, z, currentTime);
          } else if (z.type === 'runner' || z.type === 'pack_runner') {
            drawRunnerZombie(ctx, z, currentTime);
          } else {
            drawNormalZombieShopper(ctx, z, currentTime);
          }
        }
        ctx.restore();
      });

      // Render Continuous Plasma Laser Beam (Stops at hit target, no piercing!)
      if (weaponRef.current.id === 'plasma_rifle' && g.isMouseDown) {
        ctx.save();
        const pX = 180;
        const pY = g.playerY;
        const aimAngle = Math.atan2(g.mouseY - pY, g.mouseX - pX);
        const maxEndX = pX + Math.cos(aimAngle) * 900;
        const maxEndY = pY + Math.sin(aimAngle) * 900;
        const endX = g.plasmaBeamEndX ?? maxEndX;
        const endY = g.plasmaBeamEndY ?? maxEndY;

        // Outer neon aura
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.45)';
        ctx.lineWidth = 14;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(pX, pY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Mid energy sheath
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(pX, pY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Core white-hot laser beam
        ctx.strokeStyle = '#f0fdfa';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(pX, pY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        ctx.restore();
      }

      // Draw Bullets
      ctx.save();
      g.bullets.forEach(b => {
        ctx.strokeStyle = b.isPlayerBullet ? '#fef08a' : '#7dd3fc';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(b.x - b.vx * 0.9, b.y - b.vy * 0.9);
        ctx.stroke();
      });
      ctx.restore();

      // Draw Particles (Fast crisp pixel art rectangles, capped to maintain 60 FPS)
      if (g.particles.length > 35) {
        g.particles.splice(0, g.particles.length - 35);
      }
      for (let p = g.particles.length - 1; p >= 0; p--) {
        const pt = g.particles[p];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life--;

        const sz = Math.max(1, pt.size * (pt.life / pt.maxLife));
        ctx.fillStyle = pt.color;
        ctx.fillRect(pt.x - sz / 2, pt.y - sz / 2, sz, sz);

        if (pt.life <= 0) {
          g.particles.splice(p, 1);
        }
      }

      // Floating Texts (Optimized strokeText outline instead of heavy GPU shadowBlur pass)
      for (let ft = g.floatingTexts.length - 1; ft >= 0; ft--) {
        const textItem = g.floatingTexts[ft];
        textItem.y -= 0.8;
        textItem.life--;

        ctx.save();
        ctx.font = 'bold 13px "Chakra Petch", "Tajawal", sans-serif';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#020617';
        ctx.lineWidth = 2.5;
        ctx.strokeText(textItem.text, textItem.x, textItem.y);
        ctx.fillStyle = textItem.color;
        ctx.fillText(textItem.text, textItem.x, textItem.y);
        ctx.restore();

        if (textItem.life <= 0) {
          g.floatingTexts.splice(ft, 1);
        }
      }

      // Draw Crosshair
      ctx.save();
      const mX = g.mouseX;
      const mY = g.mouseY;
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.arc(mX, mY, 8, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(mX - 14, mY);
      ctx.lineTo(mX - 4, mY);
      ctx.moveTo(mX + 4, mY);
      ctx.lineTo(mX + 14, mY);
      ctx.moveTo(mX, mY - 14);
      ctx.lineTo(mX - 4, mY);
      ctx.moveTo(mX, mY + 4);
      ctx.lineTo(mX, mY + 14);
      ctx.stroke();
      ctx.restore();

      // Full screen blood flash when boss belly bursts ("وستطلخ ارجاء سوبر ماركت بالدم")
      if (g.bloodFlashAlpha > 0) {
        ctx.save();
        ctx.fillStyle = `rgba(185, 28, 28, ${Math.min(0.65, g.bloodFlashAlpha)})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
        g.bloodFlashAlpha -= 0.012;
      }

      ctx.restore();
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [
    day, 
    onNightComplete, 
    onGameOver, 
    executePlayerShot,
    setBarricade, 
    setPlayerHealth, 
    screenShake, 
    reloadProgress,
    language
  ]);

  // Pointer coordinate scaling
  const updatePointerCoordinates = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    gameStateRef.current.mouseX = (clientX - rect.left) * scaleX;
    gameStateRef.current.mouseY = (clientY - rect.top) * scaleY;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    updatePointerCoordinates(e.clientX, e.clientY);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    // Smooth vertical position adjustment with mouse wheel
    if (e.deltaY < 0) {
      gameStateRef.current.targetPlayerY = Math.max(130, gameStateRef.current.targetPlayerY - 45);
    } else if (e.deltaY > 0) {
      gameStateRef.current.targetPlayerY = Math.min(480, gameStateRef.current.targetPlayerY + 45);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    audio.resume();
    if (e.button === 0) {
      updatePointerCoordinates(e.clientX, e.clientY);
      // Clicking in the player corridor (x < 240) repositions player vertically!
      if (gameStateRef.current.mouseX < 240) {
        gameStateRef.current.targetPlayerY = Math.max(130, Math.min(480, gameStateRef.current.mouseY));
      } else {
        gameStateRef.current.isMouseDown = true;
        executePlayerShot(performance.now());
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    audio.resume();
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      updatePointerCoordinates(touch.clientX, touch.clientY);
      if (gameStateRef.current.mouseX < 240) {
        gameStateRef.current.targetPlayerY = Math.max(130, Math.min(480, gameStateRef.current.mouseY));
      } else {
        gameStateRef.current.isMouseDown = true;
        executePlayerShot(performance.now());
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      updatePointerCoordinates(touch.clientX, touch.clientY);
      if (gameStateRef.current.mouseX < 240) {
        gameStateRef.current.targetPlayerY = Math.max(130, Math.min(480, gameStateRef.current.mouseY));
      }
    }
  };

  const handleTouchEnd = () => {
    gameStateRef.current.isMouseDown = false;
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center select-none" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Top Combat HUD with REMAINING ZOMBIES DISPLAY ("واظهر بشاشة عدد زومبي المتبقين للمواجهة") */}
      <div className="w-full bg-slate-900/90 border border-slate-700/80 px-4 py-2.5 rounded-t-xl flex items-center justify-between gap-4 text-xs font-mono">
        {/* Day Tracker */}
        <div className="flex items-center gap-3">
          <span className="font-bold text-amber-400 text-sm tracking-wide">
            {language === 'ar' ? `الليلة ${day}` : `NIGHT ${day}`}
          </span>

          {/* EXACT REMAINING ZOMBIES COUNT */}
          <div className="flex items-center gap-1.5 bg-red-950/70 border border-red-800/80 px-3 py-1 rounded-lg text-xs font-mono">
            <Skull className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span className="text-slate-300 font-sans">
              {language === 'ar' ? 'الزومبي المتبقي:' : 'Zombies Left:'}
            </span>
            <span className="font-extrabold text-red-300 text-sm">{remainingZombies}</span>
          </div>

          {day === 3 && (
            <div className="hidden sm:flex items-center gap-1 bg-red-900/60 border border-red-500/80 px-2 py-0.5 rounded text-[11px] font-mono text-amber-300 animate-pulse">
              <span>☠</span>
              <span>{language === 'ar' ? 'مواجهة الزعيم الأكول' : 'Glutton Boss Night'}</span>
            </div>
          )}

          {/* DAY 4 SECRET CONTRACT CHALLENGE BADGE */}
          {day === 4 && (
            <div className="flex items-center gap-1.5 bg-cyan-950/80 border border-cyan-500/80 px-2.5 py-1 rounded-lg text-cyan-200 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span>
                {language === 'ar' 
                  ? `عقد البلازما (هيدشوت): ${Math.min(20, day4Headshots)}/20` 
                  : `Plasma Contract: ${Math.min(20, day4Headshots)}/20`}
              </span>
            </div>
          )}

          <div className="w-24 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
            <div 
              className="bg-amber-500 h-full transition-all duration-300"
              style={{ width: `${nightProgress}%` }}
            />
          </div>
        </div>

        {/* Barricade HP */}
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-sky-400 shrink-0" />
          <span className="text-slate-300">
            {language === 'ar' ? 'عربات التسوق:' : 'Carts Barricade:'}
          </span>
          <div className="w-28 bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700">
            <div 
              className={`h-full transition-all duration-200 ${
                barricade.hp / barricade.maxHp > 0.4 ? 'bg-sky-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.round((barricade.hp / barricade.maxHp) * 100)}%` }}
            />
          </div>
          <span className="text-slate-200 font-bold">
            {barricade.hp}/{barricade.maxHp}
          </span>
        </div>

        {/* Player Health */}
        <div className="flex items-center gap-2">
          <span className="text-red-400 font-bold">HP</span>
          <div className="w-24 bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700">
            <div 
              className="bg-red-500 h-full transition-all duration-200"
              style={{ width: `${Math.round((playerHealth / maxPlayerHealth) * 100)}%` }}
            />
          </div>
          <span className="text-slate-200 font-bold">{playerHealth}/{maxPlayerHealth}</span>
        </div>

        {/* Sound toggle & Pause */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const nextMuted = !isMuted;
              setIsMuted(nextMuted);
              audio.setMuted(nextMuted);
            }}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Mute/Unmute"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setIsPaused(p => !p)}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            {isPaused 
              ? (language === 'ar' ? 'استئناف' : 'Resume') 
              : (language === 'ar' ? 'إيقاف مؤقت' : 'Pause')}
          </button>
        </div>
      </div>

      {/* Main 2D Canvas */}
      <div className="relative w-full aspect-[1000/540] bg-black overflow-hidden border-x border-slate-700/80 cursor-crosshair">
        <canvas
          ref={canvasRef}
          width={1000}
          height={540}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="w-full h-full block"
        />

        {/* Vertical Movement Quick Controls Overlay (▲ / ▼) */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20 pointer-events-auto">
          <button
            onClick={() => { gameStateRef.current.targetPlayerY = Math.max(130, gameStateRef.current.targetPlayerY - 45); }}
            className="w-8 h-8 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-amber-300 flex items-center justify-center text-xs shadow-md active:scale-95 transition-all"
            title={language === 'ar' ? 'تحريك للأعلى [W / ↑]' : 'Move Up [W / ↑]'}
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => { gameStateRef.current.targetPlayerY = Math.min(480, gameStateRef.current.targetPlayerY + 45); }}
            className="w-8 h-8 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-amber-300 flex items-center justify-center text-xs shadow-md active:scale-95 transition-all"
            title={language === 'ar' ? 'تحريك للأسفل [S / ↓]' : 'Move Down [S / ↓]'}
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Pause Banner */}
        {isPaused && (
          <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center text-white">
            <h2 className="text-2xl font-bold mb-2">
              {language === 'ar' ? 'اللعبة متوقفة مؤقتاً' : 'GAME PAUSED'}
            </h2>
            <button
              onClick={() => setIsPaused(false)}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg transition-colors"
            >
              {language === 'ar' ? 'متابعة الدفاع' : 'Resume Defense'}
            </button>
          </div>
        )}
      </div>

      {/* Bottom Combat Action Toolbar */}
      <div className="w-full bg-slate-900 border border-slate-700/80 px-4 py-3 rounded-b-xl flex flex-wrap items-center justify-between gap-3">
        {/* Active Weapon & Ammo or Plasma Battery */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">1</span>
            <span className="font-bold text-white text-sm">
              {language === 'ar' ? activeWeapon.nameAr : activeWeapon.name}
            </span>
          </div>

          {activeWeapon.id === 'plasma_rifle' ? (
            <div className="flex items-center gap-2 bg-cyan-950/70 border border-cyan-700/80 px-3 py-1.5 rounded-lg text-xs font-mono">
              <Battery className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="text-cyan-200 font-bold">
                {plasmaBatterySecs.toFixed(1)}s / 20.0s
              </span>
              <span className="text-amber-300 font-bold border-s border-cyan-800/80 ps-2">
                ⚡ {language === 'ar' ? 'الضرر:' : 'Dmg:'} {gameStateRef.current.plasmaCurrentDamage || 2}/6
              </span>
              <span className="text-slate-400 border-s border-cyan-800/80 ps-2">
                {language === 'ar' ? `رصيد البطاريات: ${resources?.battery ?? 0}` : `Batts: ${resources?.battery ?? 0}`}
              </span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-1.5 font-mono text-base">
                <span className={`font-bold ${currentClip <= 2 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                  {activeWeapon.ammoType === 'none' ? '∞' : currentClip}
                </span>
                <span className="text-slate-500">/</span>
                <span className="text-slate-400 text-sm">
                  {activeWeapon.ammoType === 'none' ? '∞' : (ammoStock[activeWeapon.ammoType as keyof AmmoStock] ?? 0)}
                </span>
              </div>

              <button
                onClick={handleReload}
                disabled={isReloading || activeWeapon.ammoType === 'none' || (ammoStock[activeWeapon.ammoType as keyof AmmoStock] ?? 0) <= 0}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-medium disabled:opacity-40 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isReloading ? 'animate-spin' : ''}`} />
                <span>{language === 'ar' ? 'تلقيم [R]' : 'Reload [R]'}</span>
              </button>
            </>
          )}
        </div>

        {/* Secondary Weapon Switch */}
        {secondaryWeapon && (
          <button
            onClick={handleSwapWeapons}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-sky-600/70 text-sky-200 text-xs font-semibold shadow transition-all active:scale-95"
            title={language === 'ar' ? 'تبديل السلاح [Q أو 2]' : 'Switch Weapon [Q or 2]'}
          >
            <span className="font-mono text-sky-400 bg-slate-900 px-1 rounded text-[11px]">Q / 2:</span>
            <span>{language === 'ar' ? secondaryWeapon.nameAr : secondaryWeapon.name}</span>
          </button>
        )}

        {/* Survivor Active Ultimate Ability Button (20s Cooldown) */}
        <button
          onClick={handleTriggerAbility}
          disabled={!equippedAbilityRef.current || abilityCooldownRatio < 1}
          className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all active:scale-95 overflow-hidden ${
            !equippedAbilityRef.current
              ? 'bg-slate-900/90 border-slate-800 text-slate-500 cursor-not-allowed opacity-60'
              : abilityCooldownRatio >= 1
              ? 'bg-gradient-to-r from-sky-600 to-indigo-600 border-sky-400 text-white shadow-lg shadow-sky-900/50 hover:brightness-110 animate-pulse'
              : 'bg-slate-800/80 border-slate-700 text-slate-400 cursor-not-allowed opacity-75'
          }`}
          title={!equippedAbilityRef.current ? (language === 'ar' ? 'جنّد ناجياً بالنهار للحصول على قدرته' : 'Recruit a survivor to gain an ability') : (language === 'ar' ? 'تفعيل قدرة الناجي الخارقة [E أو ث]' : 'Activate Survivor Ultimate Ability [E]')}
        >
          {equippedAbilityRef.current && abilityCooldownRatio < 1 && (
            <div 
              className="absolute inset-0 bg-slate-950/70 z-0 transition-all duration-100" 
              style={{ width: `${(1 - abilityCooldownRatio) * 100}%` }}
            />
          )}
          <Zap className={`w-3.5 h-3.5 z-10 ${equippedAbilityRef.current && abilityCooldownRatio >= 1 ? 'text-amber-300' : 'text-slate-500'}`} />
          <div className="flex items-center gap-1.5 z-10">
            <span>
              {!equippedAbilityRef.current
                ? (language === 'ar' ? '🔒 لا توجد قدرة (جنّد ناجياً)' : '🔒 No Ability (Recruit first)')
                : equippedAbilityRef.current === 'baraq_snipe'
                ? (language === 'ar' ? 'قنص براق (5 رؤوس)' : 'Baraq 5-Snipe')
                : equippedAbilityRef.current === 'shahd_fire_arrow'
                ? (language === 'ar' ? 'سهم شهد الحارق (5ث)' : 'Shahd Fire Arrow')
                : (language === 'ar' ? 'قدرة الناجي الخارقة' : 'Survivor Ultimate')}
            </span>
            {equippedAbilityRef.current && (
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-black/50">
                {abilityCooldownRatio >= 1 ? '[E]' : `${abilityCooldownSecs}s`}
              </span>
            )}
          </div>
        </button>

        {/* Throwables & LANDMINES Quick Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Landmines Deploy Button */}
          <button
            onClick={handlePlantMine}
            disabled={mineCount <= 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/70 hover:bg-amber-900 border border-amber-700/70 text-amber-200 text-xs font-semibold disabled:opacity-40 transition-colors"
            title="Plant Proximity Landmine / Trap"
          >
            <Disc className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>{language === 'ar' ? `لغم أرضي [F] (${mineCount})` : `Landmine [F] (${mineCount})`}</span>
          </button>

          {/* Molotov */}
          <button
            onClick={handleThrowMolotov}
            disabled={molotovCount <= 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-950/70 hover:bg-orange-900 border border-orange-700/70 text-orange-200 text-xs font-semibold disabled:opacity-40 transition-colors"
          >
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>{language === 'ar' ? `مولوتوف [G] (${molotovCount})` : `Molotov [G] (${molotovCount})`}</span>
          </button>

          {/* Pipe Bomb */}
          <button
            onClick={handleThrowPipeBomb}
            disabled={pipeBombCount <= 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/70 hover:bg-red-900 border border-red-700/70 text-red-200 text-xs font-semibold disabled:opacity-40 transition-colors"
          >
            <Bomb className="w-3.5 h-3.5 text-red-400" />
            <span>{language === 'ar' ? `قنبلة [T] (${pipeBombCount})` : `Pipe Bomb [T] (${pipeBombCount})`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
