// Generates a 100% complete, fully self-contained standalone single-file index.html
// containing complete HTML, CSS, JavaScript, Canvas 2D engine, and Web Audio synthesizer.
export function generateStandaloneHtml(): string {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Aisle of the Dead - Supermarket Stand | ذا لاست ستاند: سوبرماركت الموتى</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
    body {
      background: #020617;
      color: #f8fafc;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      overflow: hidden;
    }
    #gameWrapper {
      position: relative;
      width: 960px;
      height: 540px;
      background: #090d16;
      border: 2px solid #334155;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 25px 60px rgba(0,0,0,0.9);
    }
    canvas { display: block; width: 100%; height: 100%; cursor: crosshair; }
    
    /* Top Combat HUD */
    #topHud {
      position: absolute; top: 0; left: 0; right: 0;
      background: rgba(15, 23, 42, 0.94);
      border-bottom: 1px solid #334155;
      padding: 8px 16px;
      display: flex; justify-content: space-between; align-items: center;
      font-size: 13px; font-weight: bold; z-index: 10;
    }
    
    /* Bottom Combat Toolbar */
    #bottomToolbar {
      position: absolute; bottom: 0; left: 0; right: 0;
      background: rgba(15, 23, 42, 0.94);
      border-top: 1px solid #334155;
      padding: 8px 16px;
      display: flex; justify-content: space-between; align-items: center;
      font-size: 13px; z-index: 10;
    }

    .badge {
      background: #1e293b; border: 1px solid #475569;
      padding: 4px 10px; border-radius: 6px; font-weight: bold;
      display: inline-flex; align-items: center; gap: 6px;
    }
    .btn {
      background: #f59e0b; color: #020617; border: none;
      padding: 6px 14px; border-radius: 6px; font-weight: 800;
      cursor: pointer; transition: 0.15s; font-size: 12px;
    }
    .btn:hover { background: #fbbf24; }
    .btn:disabled { opacity: 0.4; cursor: not-allowed; }

    /* Modals & Screens */
    .screen-overlay {
      position: absolute; inset: 0;
      background: rgba(2, 6, 23, 0.92);
      backdrop-filter: blur(4px);
      display: none; flex-direction: column;
      align-items: center; justify-content: center;
      z-index: 50; padding: 20px;
    }
    .modal-card {
      background: #0f172a; border: 2px solid #f59e0b;
      border-radius: 14px; padding: 24px;
      max-width: 580px; width: 100%; text-align: center;
      box-shadow: 0 15px 40px rgba(0,0,0,0.8);
    }

    /* Daytime Hub Layout */
    #dayHubScreen {
      position: absolute; inset: 0; background: #090d16;
      display: none; flex-direction: column; z-index: 40;
      overflow-y: auto; padding: 16px;
    }
    .hub-header {
      display: flex; justify-content: space-between; align-items: center;
      border-bottom: 1px solid #334155; padding-bottom: 12px; margin-bottom: 14px;
    }
    .hub-grid {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 14px;
    }
    .hub-card {
      background: #0f172a; border: 1px solid #334155; border-radius: 10px;
      padding: 12px; display: flex; flex-direction: column; justify-content: space-between;
    }
    .stepper {
      display: flex; justify-content: space-between; align-items: center;
      background: #020617; border-radius: 6px; padding: 4px; margin-top: 8px;
    }
    .step-btn {
      width: 26px; height: 26px; background: #334155; color: white; border: none;
      border-radius: 4px; font-weight: bold; cursor: pointer;
    }
    .step-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  </style>
</head>
<body>

  <div id="gameWrapper">
    <!-- Top Combat HUD -->
    <div id="topHud">
      <div id="hudNight" style="color: #fbbf24; font-size: 14px;">الليلة 1</div>
      <div class="badge" id="hudZombies" style="color: #f87171;">الزومبي المتبقي: 35</div>
      <div class="badge" id="hudBarricade" style="color: #38bdf8;">🛡️ المتراس: 400/400 HP</div>
      <div id="bossBadge" class="badge" style="color: #ef4444; border-color: #ef4444; display: none;">☠ الزعيم الأكول (7000 HP)</div>
    </div>

    <!-- Canvas -->
    <canvas id="cv" width="960" height="540"></canvas>

    <!-- Bottom Combat Toolbar -->
    <div id="bottomToolbar">
      <div style="display: flex; gap: 8px; align-items: center;">
        <span class="badge" id="tbWeapon">بندقية صيد بامب شوزن (5 مقذوفات)</span>
        <span class="badge" id="tbAmmo" style="color: #34d399;">7 / 42</span>
        <span class="badge" id="tbPlasmaDmg" style="color: #fde047; display: none;">⚡ الضرر: 2/6</span>
      </div>
      <div style="display: flex; gap: 6px;">
        <button class="btn" id="btnAbility" style="background: #0284c7; color: white;">⚡ قدرة براق [E]</button>
        <button class="btn" id="btnSwitch">تبديل [Q]</button>
        <button class="btn" id="btnReload">تلقيم [R]</button>
        <button class="btn" id="btnMine" style="background: #78350f; color: #fde68a;">لغم [F] (2)</button>
        <button class="btn" id="btnMolo" style="background: #c2410c; color: #ffedd5;">مولوتوف [G] (2)</button>
      </div>
    </div>

    <!-- 3-Second Night Summary Modal -->
    <div id="summaryModal" class="screen-overlay">
      <div class="modal-card">
        <h2 style="color: #fbbf24; margin-bottom: 12px; font-size: 22px;">بزوغ الفجر على السوبرماركت! ☀️</h2>
        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px;">
          <div style="background:#020617; padding:12px; border-radius:8px; border:1px solid #10b981; color:#34d399; font-weight:bold; font-size:15px;" id="sumKills">☠ عدد قتلى الزومبي: 35</div>
          <div style="background:#020617; padding:12px; border-radius:8px; border:1px solid #f59e0b; color:#fbbf24; font-weight:bold; font-size:15px;" id="sumHeadshots">🎯 إصابات الرأس القاتلة (هيدشوت): 12</div>
          <div style="background:#020617; padding:12px; border-radius:8px; border:1px solid #ef4444; color:#f87171; font-weight:bold; font-size:15px;" id="sumDamage">🛡️ ضرر الزومبي للمتاريس: -0 HP</div>
        </div>
        <div id="sumCountdown" style="color: #94a3b8; font-size: 13px;">الانتقال التلقائي إلى ورشة النهار وتوزيع الساعات خلال 3 ثوانٍ...</div>
      </div>
    </div>

    <!-- Daytime Hub Screen (12 Hours Single-Use) -->
    <div id="dayHubScreen">
      <div class="hub-header">
        <div>
          <h2 style="color: #fbbf24; font-size: 18px;">🏪 ورشة النهار وتوزيع الساعات (12 ساعة)</h2>
          <p style="color: #94a3b8; font-size: 12px;" id="hubHoursNotice">المتبقي: 12 ساعات غير موزعة (استخدام الساعات متاح مرة واحدة فقط)</p>
        </div>
        <button class="btn" id="btnStartNextNight" style="padding: 10px 20px; font-size: 14px;">بدء الليلة القادمة ⚔️</button>
      </div>

      <!-- 4 Activity Cards -->
      <div class="hub-grid">
        <!-- 1. Scavenging -->
        <div class="hub-card" style="border-color: #a855f7;">
          <h4 style="color: #c084fc; font-size: 13px;">📦 المؤن وقطع الغيار</h4>
          <p style="color: #94a3b8; font-size: 11px; margin: 4px 0;">ساعة = 3 قطع غيار. ساعتان = بطارية بلازما (مع شهد = بطاريتان!).</p>
          <div style="color: #c084fc; font-weight: bold; font-size: 12px;" id="scavYield">+15 قطعة / 2 بطارية</div>
          <div class="stepper">
            <button class="step-btn" id="btnScavMinus">-</button>
            <span id="scavHoursText" style="font-weight: bold;">5س</span>
            <button class="step-btn" id="btnScavPlus">+</button>
          </div>
        </div>

        <!-- 2. Weapons Warehouse -->
        <div class="hub-card" style="border-color: #f59e0b;">
          <h4 style="color: #fbbf24; font-size: 13px;">🔫 مخزن الأسلحة (شرط 5س)</h4>
          <p style="color: #94a3b8; font-size: 11px; margin: 4px 0;">5 ساعات بالضبط للسلاح. المرة الأولى: شوزن، المرة الثانية: عوزي!</p>
          <div style="color: #34d399; font-weight: bold; font-size: 12px;" id="weapYield">🎉 سلاح مضمون: شوزن</div>
          <div class="stepper">
            <button class="step-btn" id="btnWeap0">0س</button>
            <button class="step-btn" id="btnWeap5" style="width: 50px;">5س</button>
            <button class="step-btn" id="btnWeap10" style="width: 50px;">10س</button>
          </div>
        </div>

        <!-- 3. Search Survivors -->
        <div class="hub-card" style="border-color: #10b981;">
          <h4 style="color: #34d399; font-size: 13px;">👥 إنقاذ ناجين (شرط 10س)</h4>
          <p style="color: #94a3b8; font-size: 11px; margin: 4px 0;">شرط: 10 ساعات في نفس اليوم. تنقذ براق رجل الأمن أو شهد الصيدلانية عشوائياً.</p>
          <div style="color: #34d399; font-weight: bold; font-size: 12px;" id="survYield">0س (خصص 10س)</div>
          <div class="stepper">
            <button class="step-btn" id="btnSurv0" style="width: 50px;">0س</button>
            <button class="step-btn" id="btnSurv10" style="width: 70px;">10س مؤكد</button>
          </div>
        </div>

        <!-- 4. Barricade Repair -->
        <div class="hub-card" style="border-color: #0284c7;">
          <h4 style="color: #38bdf8; font-size: 13px;">🛠️ إصلاح المتراس</h4>
          <p style="color: #94a3b8; font-size: 11px; margin: 4px 0;">تدعيم عربات التسوق (+25 HP لكل ساعة إصلاح).</p>
          <div style="color: #38bdf8; font-weight: bold; font-size: 12px;" id="repYield">+50 HP تصليح</div>
          <div class="stepper">
            <button class="step-btn" id="btnRepMinus">-</button>
            <span id="repHoursText" style="font-weight: bold;">2س</span>
            <button class="step-btn" id="btnRepPlus">+</button>
          </div>
        </div>
      </div>

      <!-- Execution Action Bar -->
      <div style="background: #0f172a; border: 1px solid #f59e0b; border-radius: 10px; padding: 14px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h4 style="color: white; font-size: 14px;" id="execTitle">تنفيذ خطة ساعات النهار الآن (12 ساعة)</h4>
          <p style="color: #94a3b8; font-size: 12px;" id="execDesc">انقر للحصول على الأسلحة والمؤن فوراً ومشاهدة تقرير الغنائم قبل بدء الليل (استخدام الساعات لمرة واحدة فقط).</p>
        </div>
        <button class="btn" id="btnExecuteDay" style="padding: 10px 24px; font-size: 13px;">تنفيذ الساعات وجمع الغنائم 📦</button>
      </div>

      <!-- Survivor Ability Switcher -->
      <div style="margin-top: 14px; background: #0f172a; border: 1px solid #334155; border-radius: 10px; padding: 12px;">
        <h4 style="color: #fbbf24; font-size: 13px; margin-bottom: 6px;">⚡ تجهيز قدرة الناجي للمعركة (تتفعل كل 20 ثانية [E])</h4>
        <div style="display: flex; gap: 10px;">
          <button class="btn" id="btnEquipBaraq" style="flex: 1; background: #1e293b; color: #38bdf8; border: 1px solid #0284c7;">براق رجل الأمن: قنص 5 رؤوس هيدشوت ✓</button>
          <button class="btn" id="btnEquipShahd" style="flex: 1; background: #1e293b; color: #f97316; border: 1px solid #ea580c;">شهد الصيدلانية: سهم ناري يحرق الشاشة 5 ثوانٍ</button>
        </div>
      </div>
    </div>

    <!-- Game Over Screen -->
    <div id="gameOverModal" class="screen-overlay">
      <div class="modal-card" style="border-color: #ef4444;">
        <h2 style="color: #ef4444; font-size: 26px; margin-bottom: 8px;">سقط المتراس واجتاح الزومبي السوبرماركت! ☠</h2>
        <p style="color: #94a3b8; font-size: 13px; margin-bottom: 16px;">لم تنجح في الصمود حتى الصباح. حاول مجدداً مع توزيع أفضل للساعات والأسلحة.</p>
        <button class="btn" id="btnRestart" style="padding: 10px 24px; font-size: 14px; background: #ef4444; color: white;">إعادة المحاولة من الليلة الأولى 🔄</button>
      </div>
    </div>
  </div>

  <div style="margin-top: 12px; color: #94a3b8; font-size: 12px; display: flex; gap: 14px; flex-wrap: wrap;">
    <span>[W/S أو الفأرة] تحريك للأعلى والأسفل</span>
    <span>[الفأرة يسار] إطلاق النار</span>
    <span>[Q] تبديل السلاح</span>
    <span>[R] تلقيم</span>
    <span>[E] تفعيل قدرة الناجي (كل 20 ثانية)</span>
    <span>[F] لغم أرضي</span>
    <span>[G] زجاجة مولوتوف</span>
  </div>

  <script>
    // Audio Synthesizer (Realistic Web Audio API)
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    let actx = null;
    function getAudio() {
      if (!actx) actx = new AudioCtx();
      if (actx.state === 'suspended') actx.resume();
      return actx;
    }
    function playSfx(type) {
      const a = getAudio(); if (!a) return;
      const t = a.currentTime;
      const o = a.createOscillator(), g = a.createGain();
      o.connect(g); g.connect(a.destination);

      if (type === 'shotgun') {
        o.type = 'sawtooth'; o.frequency.setValueAtTime(160, t);
        o.frequency.exponentialRampToValueAtTime(30, t + 0.22);
        g.gain.setValueAtTime(0.5, t); g.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
        o.start(); o.stop(t + 0.25);
      } else if (type === 'plasma') {
        o.type = 'sine'; o.frequency.setValueAtTime(520, t);
        o.frequency.linearRampToValueAtTime(940, t + 0.08);
        g.gain.setValueAtTime(0.25, t); g.gain.linearRampToValueAtTime(0.01, t + 0.08);
        o.start(); o.stop(t + 0.08);
      } else if (type === 'acid') {
        o.type = 'sawtooth'; o.frequency.setValueAtTime(800, t);
        o.frequency.linearRampToValueAtTime(200, t + 0.15);
        g.gain.setValueAtTime(0.35, t); g.gain.linearRampToValueAtTime(0.01, t + 0.15);
        o.start(); o.stop(t + 0.15);
      } else if (type === 'headshot') {
        o.type = 'square'; o.frequency.setValueAtTime(380, t);
        o.frequency.exponentialRampToValueAtTime(80, t + 0.12);
        g.gain.setValueAtTime(0.4, t); g.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
        o.start(); o.stop(t + 0.12);
      } else if (type === 'click') {
        o.type = 'triangle'; o.frequency.setValueAtTime(600, t);
        g.gain.setValueAtTime(0.15, t); g.gain.exponentialRampToValueAtTime(0.01, t + 0.04);
        o.start(); o.stop(t + 0.04);
      } else {
        o.type = 'square'; o.frequency.setValueAtTime(240, t);
        o.frequency.exponentialRampToValueAtTime(45, t + 0.1);
        g.gain.setValueAtTime(0.3, t); g.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
        o.start(); o.stop(t + 0.1);
      }
    }

    // Core State
    const cv = document.getElementById('cv');
    const ctx = cv.getContext('2d');
    let day = 1;
    let barricadeHp = 400, maxBarricadeHp = 400;
    let playerY = 270, targetPlayerY = 270;
    let mouseX = 500, mouseY = 270, isMouseDown = false;
    let activeWeapon = 'shotgun';
    let secondaryWeapon = 'plasma_rifle';
    let currentClip = 7, maxClip = 7, totalShells = 45;
    let plasmaBattery = 20.0; // 20.0s duration
    let plasmaTargetId = null, plasmaFocusTime = 0, plasmaDamage = 2; // Ramps 2 to 6
    let plasmaBeamEnd = { x: 960, y: 270 };
    let bullets = [], particles = [], zombies = [], acidSpits = [], landmines = [], fireZones = [];
    let zombiesKilled = 0, headshots = 0, barricadeDamageTaken = 0;
    let totalNightZombies = 35, zombiesSpawned = 0;
    let waveStep = 1, isEnded = false, isCombat = true;
    let equippedAbility = 'baraq';
    let abilityCooldown = 0;
    let mineCount = 2, molotovCount = 2;

    // Daytime Hub Hours (12 Hours Single-Use Rule)
    let availableHours = 12;
    let hasUsedDayHours = false;
    let scavHours = 5, weapHours = 5, survHours = 0, repHours = 2;
    let unlockedShotgun = true, unlockedUzi = false;
    let recruitedBaraq = false, recruitedShahd = false;

    // Controls
    window.addEventListener('mousemove', e => {
      const r = cv.getBoundingClientRect();
      mouseX = (e.clientX - r.left) * (cv.width / r.width);
      mouseY = (e.clientY - r.top) * (cv.height / r.height);
      if (mouseX < 230) targetPlayerY = Math.max(130, Math.min(480, mouseY));
    });
    window.addEventListener('mousedown', e => {
      if (e.button === 0 && isCombat && !isEnded) {
        isMouseDown = true;
        shoot();
      }
    });
    window.addEventListener('mouseup', () => {
      isMouseDown = false;
      plasmaTargetId = null; plasmaDamage = 2;
    });
    window.addEventListener('keydown', e => {
      if (!isCombat) return;
      if (e.code === 'KeyW' || e.code === 'ArrowUp') targetPlayerY = Math.max(130, targetPlayerY - 45);
      if (e.code === 'KeyS' || e.code === 'ArrowDown') targetPlayerY = Math.min(480, targetPlayerY + 45);
      if (e.code === 'KeyR') reload();
      if (e.code === 'KeyQ') switchWeapon();
      if (e.code === 'KeyE') triggerAbility();
      if (e.code === 'KeyF') plantMine();
      if (e.code === 'KeyG') throwMolotov();
    });

    document.getElementById('btnSwitch').onclick = switchWeapon;
    document.getElementById('btnReload').onclick = reload;
    document.getElementById('btnAbility').onclick = triggerAbility;
    document.getElementById('btnMine').onclick = plantMine;
    document.getElementById('btnMolo').onclick = throwMolotov;

    function switchWeapon() {
      playSfx('click');
      const temp = activeWeapon; activeWeapon = secondaryWeapon; secondaryWeapon = temp;
      if (activeWeapon === 'shotgun') { maxClip = 7; currentClip = 7; }
      else if (activeWeapon === 'uzi') { maxClip = 32; currentClip = 32; }
      else { maxClip = 120; currentClip = 120; }
      plasmaTargetId = null; plasmaDamage = 2; updateUI();
    }

    function reload() {
      playSfx('click'); currentClip = maxClip; updateUI();
    }

    function plantMine() {
      if (mineCount <= 0 || !isCombat || isEnded) return;
      mineCount--; playSfx('click');
      landmines.push({ x: Math.max(260, mouseX), y: Math.max(140, Math.min(460, mouseY)), r: 35, dmg: 180 });
      updateUI();
    }

    function throwMolotov() {
      if (molotovCount <= 0 || !isCombat || isEnded) return;
      molotovCount--; playSfx('acid');
      fireZones.push({ x: Math.max(280, mouseX), y: mouseY, r: 65, life: 300 });
      updateUI();
    }

    function triggerAbility() {
      if (abilityCooldown > 0 || !isCombat || isEnded) return;
      abilityCooldown = 20;
      playSfx('shotgun');
      if (equippedAbility === 'baraq') {
        let count = 0;
        for (let z of zombies) {
          if (!z.isDead && count < 5) {
            z.hp -= 280; if (z.hp <= 0) { z.isDead = true; zombiesKilled++; headshots++; }
            count++;
          }
        }
      } else {
        for (let z of zombies) {
          if (!z.isDead) { z.isBurning = true; z.hp -= 120; if (z.hp <= 0) { z.isDead = true; zombiesKilled++; } }
        }
      }
    }

    function shoot() {
      if (isEnded || !isCombat) return;
      const startX = 180, startY = playerY;
      const angle = Math.atan2(mouseY - startY, mouseX - startX);

      if (activeWeapon === 'plasma_rifle') {
        if (plasmaBattery <= 0) { playSfx('click'); return; }
        playSfx('plasma');
        const maxEndX = startX + Math.cos(angle) * 850;
        const maxEndY = startY + Math.sin(angle) * 850;

        // 1. Vaporize flying acid spit projectiles
        for (let i = acidSpits.length - 1; i >= 0; i--) {
          const a = acidSpits[i];
          const dist = Math.hypot(a.x - (startX + Math.cos(angle) * 320), a.y - (startY + Math.sin(angle) * 320));
          if (dist < 45) { playSfx('acid'); acidSpits.splice(i, 1); }
        }

        // 2. Hit single closest zombie without piercing!
        let closest = null, minDist = 9999;
        for (let z of zombies) {
          if (z.isDead) continue;
          const dist = Math.hypot(z.x - startX, z.y - startY);
          const lineDist = Math.abs((z.y - startY) - Math.tan(angle) * (z.x - startX));
          if (lineDist < 32 && z.x > startX && dist < minDist) {
            minDist = dist; closest = z;
          }
        }

        if (closest) {
          plasmaBeamEnd = { x: closest.x, y: closest.y };
          if (plasmaTargetId !== closest.id) {
            plasmaTargetId = closest.id; plasmaFocusTime = Date.now(); plasmaDamage = 2;
          } else {
            const secs = Math.floor((Date.now() - plasmaFocusTime) / 1000);
            plasmaDamage = Math.min(6, 2 + secs);
          }
          closest.hp -= plasmaDamage; closest.isBurning = true;
          if (closest.hp <= 0) {
            closest.isDead = true; zombiesKilled++;
            plasmaTargetId = null; plasmaDamage = 2;
          }
        } else {
          plasmaBeamEnd = { x: maxEndX, y: maxEndY };
          plasmaTargetId = null; plasmaDamage = 2;
        }
      } else if (activeWeapon === 'shotgun') {
        if (currentClip <= 0) { reload(); return; }
        currentClip--; playSfx('shotgun');
        // Exactly 5 pellets exit shotgun barrel
        for (let p = 0; p < 5; p++) {
          const spread = (Math.random() - 0.5) * 0.16;
          bullets.push({ x: startX, y: startY, vx: Math.cos(angle + spread) * 26, vy: Math.sin(angle + spread) * 26, dmg: 22, life: 42 });
        }
      } else {
        if (currentClip <= 0) { reload(); return; }
        currentClip--; playSfx('pistol');
        bullets.push({ x: startX, y: startY, vx: Math.cos(angle) * 25, vy: Math.sin(angle) * 25, dmg: 25, life: 45 });
      }
      updateUI();
    }

    // Spawn single zombie
    function spawnZombie(type) {
      if (zombiesSpawned >= totalNightZombies) return;
      zombiesSpawned++;
      let hp = type === 'boss' ? 7000 : type === 'fat' ? 140 : type === 'spitter' ? 70 : 60;
      let spd = type === 'boss' ? 0.42 : type === 'fat' ? 0.6 : type === 'runner' ? 1.4 : 0.9;
      zombies.push({
        id: Math.random(), type,
        x: 980 + Math.random() * 40, y: 150 + Math.random() * 300,
        hp, maxHp: hp, speed: spd, isDead: false,
        steps: 0, hasSpit: false, isBurning: false
      });
    }

    // Normal Nights: 20 all at once, then 25, then 35
    function checkWaves() {
      const living = zombies.filter(z => !z.isDead).length;
      if (day === 3) {
        // Boss Night 3
        if (waveStep === 1) {
          spawnZombie('boss');
          for (let i = 0; i < 15; i++) spawnZombie('normal');
          waveStep = 2;
        }
        return;
      }

      if (waveStep === 1) {
        const count = Math.min(20, totalNightZombies - zombiesSpawned);
        for (let i = 0; i < count; i++) {
          spawnZombie(day === 1 ? (Math.random() < 0.12 ? 'fat' : 'normal') : day === 4 ? (Math.random() < 0.3 ? 'spitter' : 'normal') : 'normal');
        }
        waveStep = 2;
      } else if (waveStep === 2 && living <= 10 && zombiesSpawned < totalNightZombies) {
        const count = Math.min(25, totalNightZombies - zombiesSpawned);
        for (let i = 0; i < count; i++) {
          spawnZombie(day === 1 ? (Math.random() < 0.12 ? 'fat' : 'normal') : day === 4 ? (Math.random() < 0.3 ? 'spitter' : 'normal') : 'normal');
        }
        waveStep = 3;
      } else if (waveStep === 3 && living <= 10 && zombiesSpawned < totalNightZombies) {
        const count = Math.min(35, totalNightZombies - zombiesSpawned);
        for (let i = 0; i < count; i++) {
          spawnZombie(day === 1 ? (Math.random() < 0.12 ? 'fat' : 'normal') : day === 4 ? (Math.random() < 0.3 ? 'spitter' : 'normal') : 'normal');
        }
        waveStep = 4;
      }
    }

    function updateUI() {
      document.getElementById('hudNight').innerText = 'الليلة ' + day;
      document.getElementById('hudZombies').innerText = 'الزومبي المتبقي: ' + Math.max(0, totalNightZombies - zombiesKilled);
      document.getElementById('hudBarricade').innerText = '🛡️ المتراس: ' + Math.max(0, Math.round(barricadeHp)) + '/' + maxBarricadeHp + ' HP';
      document.getElementById('tbWeapon').innerText = activeWeapon === 'shotgun' ? 'بندقية صيد بامب شوزن (5 مقذوفات)' : activeWeapon === 'plasma_rifle' ? 'سلاح بلازما الحارق' : 'رشاش ميكرو عوزي';
      document.getElementById('tbAmmo').innerText = activeWeapon === 'plasma_rifle' ? plasmaBattery.toFixed(1) + 's / 20.0s' : currentClip + ' / ' + maxClip;
      const pd = document.getElementById('tbPlasmaDmg');
      if (activeWeapon === 'plasma_rifle') { pd.style.display = 'inline-block'; pd.innerText = '⚡ الضرر: ' + plasmaDamage + '/6'; }
      else { pd.style.display = 'none'; }
      document.getElementById('btnAbility').innerText = abilityCooldown > 0 ? '⚡ قدرة ' + (equippedAbility === 'baraq' ? 'براق' : 'شهد') + ' (' + Math.ceil(abilityCooldown) + 's)' : '⚡ قدرة ' + (equippedAbility === 'baraq' ? 'براق' : 'شهد') + ' [E]';
      document.getElementById('btnMine').innerText = 'لغم [F] (' + mineCount + ')';
      document.getElementById('btnMolo').innerText = 'مولوتوف [G] (' + molotovCount + ')';
      document.getElementById('bossBadge').style.display = day === 3 ? 'inline-flex' : 'none';
    }

    // 3-Second Summary Modal
    function show3SecSummary() {
      isEnded = true;
      document.getElementById('sumKills').innerText = '☠ عدد قتلى الزومبي: ' + zombiesKilled;
      document.getElementById('sumHeadshots').innerText = '🎯 إصابات الرأس القاتلة (هيدشوت): ' + headshots;
      document.getElementById('sumDamage').innerText = '🛡️ ضرر الزومبي للمتاريس: -' + Math.round(barricadeDamageTaken) + ' HP';
      document.getElementById('summaryModal').style.display = 'flex';

      let sec = 3;
      const timer = setInterval(() => {
        sec--;
        document.getElementById('sumCountdown').innerText = 'الانتقال التلقائي إلى ورشة النهار وتوزيع الساعات خلال ' + sec + ' ثوانٍ...';
        if (sec <= 0) {
          clearInterval(timer);
          document.getElementById('summaryModal').style.display = 'none';
          openDaytimeHub();
        }
      }, 1000);
    }

    function openDaytimeHub() {
      isCombat = false;
      availableHours = 12; // Player receives 12 hours upon winning
      hasUsedDayHours = false;
      document.getElementById('dayHubScreen').style.display = 'flex';
      updateHubDisplay();
    }

    function updateHubDisplay() {
      const total = scavHours + weapHours + survHours + repHours;
      const rem = Math.max(0, 12 - total);
      document.getElementById('hubHoursNotice').innerText = hasUsedDayHours ? '✓ تم استنفاد ساعات هذا اليوم بنجاح (استعد لليلة الدفاع)' : 'المتبقي: ' + rem + ' ساعات غير موزعة (استخدام الساعات لمرة واحدة فقط)';
      document.getElementById('scavHoursText').innerText = scavHours + 'س';
      document.getElementById('repHoursText').innerText = repHours + 'س';
      document.getElementById('scavYield').innerText = '+' + (scavHours * 3) + ' قطع غيار / ' + Math.floor(scavHours / 2) + ' بطارية';
      document.getElementById('repYield').innerText = '+' + (repHours * 25) + ' HP تصليح';
      document.getElementById('weapYield').innerText = weapHours >= 10 ? '🎉 سلاحان: شوزن + عوزي' : weapHours >= 5 ? '🎉 سلاح مضمون: شوزن بامب' : '⚠️ يتطلب 5 ساعات على الأقل';
      document.getElementById('survYield').innerText = survHours >= 10 ? '🎉 إنقاذ ناجٍ مضمون!' : '⚠️ يتطلب 10 ساعات بنفس اليوم';

      const btnExec = document.getElementById('btnExecuteDay');
      btnExec.disabled = hasUsedDayHours;
      btnExec.innerText = hasUsedDayHours ? '✓ تم تنفيذ ساعات اليوم بالكامل' : 'تنفيذ الساعات وجمع الغنائم 📦';
    }

    // Hub button events
    document.getElementById('btnScavMinus').onclick = () => { if (!hasUsedDayHours && scavHours > 0) { scavHours--; updateHubDisplay(); } };
    document.getElementById('btnScavPlus').onclick = () => { if (!hasUsedDayHours && (scavHours + weapHours + survHours + repHours < 12)) { scavHours++; updateHubDisplay(); } };
    document.getElementById('btnRepMinus').onclick = () => { if (!hasUsedDayHours && repHours > 0) { repHours--; updateHubDisplay(); } };
    document.getElementById('btnRepPlus').onclick = () => { if (!hasUsedDayHours && (scavHours + weapHours + survHours + repHours < 12)) { repHours++; updateHubDisplay(); } };
    document.getElementById('btnWeap0').onclick = () => { if (!hasUsedDayHours) { weapHours = 0; updateHubDisplay(); } };
    document.getElementById('btnWeap5').onclick = () => { if (!hasUsedDayHours) { weapHours = 5; updateHubDisplay(); } };
    document.getElementById('btnWeap10').onclick = () => { if (!hasUsedDayHours) { weapHours = 10; updateHubDisplay(); } };
    document.getElementById('btnSurv0').onclick = () => { if (!hasUsedDayHours) { survHours = 0; updateHubDisplay(); } };
    document.getElementById('btnSurv10').onclick = () => { if (!hasUsedDayHours) { survHours = 10; updateHubDisplay(); } };

    document.getElementById('btnEquipBaraq').onclick = () => {
      equippedAbility = 'baraq'; playSfx('click');
      document.getElementById('btnEquipBaraq').style.borderColor = '#0284c7';
      document.getElementById('btnEquipShahd').style.borderColor = '#334155';
    };
    document.getElementById('btnEquipShahd').onclick = () => {
      equippedAbility = 'shahd'; playSfx('click');
      document.getElementById('btnEquipShahd').style.borderColor = '#ea580c';
      document.getElementById('btnEquipBaraq').style.borderColor = '#334155';
    };

    // Execute Daytime Hours (Single use per won night!)
    document.getElementById('btnExecuteDay').onclick = () => {
      if (hasUsedDayHours) return;
      hasUsedDayHours = true;
      playSfx('shotgun');
      barricadeHp = Math.min(maxBarricadeHp, barricadeHp + repHours * 25);
      plasmaBattery = 20.0; // Recharge battery
      mineCount += 1; molotovCount += 1;
      updateHubDisplay();
      alert('تم تنفيذ خطة الساعات بنجاح! تم الحصول على الغنائم وإصلاح المتراس.');
    };

    // Start Next Night
    document.getElementById('btnStartNextNight').onclick = () => {
      document.getElementById('dayHubScreen').style.display = 'none';
      isCombat = true; isEnded = false;
      day++;
      totalNightZombies = day === 2 ? 45 : day === 3 ? 16 : day === 4 ? 65 : totalNightZombies + 20;
      zombiesSpawned = 0; waveStep = 1; zombiesKilled = 0; headshots = 0; barricadeDamageTaken = 0;
      zombies = []; bullets = []; acidSpits = [];
      updateUI();
    };

    document.getElementById('btnRestart').onclick = () => {
      location.reload();
    };

    // Main 60 FPS Game Loop
    function gameLoop() {
      requestAnimationFrame(gameLoop);
      if (!isCombat) return;

      playerY += (targetPlayerY - playerY) * 0.15;
      checkWaves();
      if (abilityCooldown > 0) abilityCooldown = Math.max(0, abilityCooldown - 0.016);
      if (activeWeapon === 'plasma_rifle' && isMouseDown && plasmaBattery > 0) {
        plasmaBattery = Math.max(0, plasmaBattery - 0.016);
        shoot();
      }

      // Bullets & raycast collisions
      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.x += b.vx; b.y += b.vy; b.life--;
        // Check flying acid
        for (let ap = acidSpits.length - 1; ap >= 0; ap--) {
          const a = acidSpits[ap];
          if (Math.hypot(b.x - a.x, b.y - a.y) < 18) {
            playSfx('acid'); acidSpits.splice(ap, 1); b.life = 0; break;
          }
        }
        // Check zombies
        for (let z of zombies) {
          if (!z.isDead && Math.hypot(b.x - z.x, b.y - z.y) < (z.type === 'boss' ? 44 : 22)) {
            z.hp -= b.dmg;
            if (z.hp <= 0) {
              z.isDead = true; zombiesKilled++;
              if (Math.random() < 0.35) { headshots++; playSfx('headshot'); }
            }
            b.life = 0; break;
          }
        }
        if (b.life <= 0) bullets.splice(i, 1);
      }

      // Spitter acid projectiles
      for (let ap = acidSpits.length - 1; ap >= 0; ap--) {
        const a = acidSpits[ap];
        a.x -= 4.2;
        if (a.x <= 246) {
          barricadeHp = Math.max(0, barricadeHp - 15);
          barricadeDamageTaken += 15;
          acidSpits.splice(ap, 1);
        }
      }

      // Landmines
      for (let m = landmines.length - 1; m >= 0; m--) {
        const mine = landmines[m];
        for (let z of zombies) {
          if (!z.isDead && Math.hypot(z.x - mine.x, z.y - mine.y) < mine.r) {
            playSfx('shotgun');
            z.hp -= mine.dmg; if (z.hp <= 0) { z.isDead = true; zombiesKilled++; }
            landmines.splice(m, 1); break;
          }
        }
      }

      // Zombies update
      for (let z of zombies) {
        if (z.isDead) continue;
        if (z.type === 'spitter' && !z.hasSpit) {
          z.steps++;
          if (z.steps > 120) {
            z.hasSpit = true; playSfx('acid');
            acidSpits.push({ x: z.x - 10, y: z.y });
          }
        }

        // Boss grab nearby zombie to heal +75 HP
        if (z.type === 'boss') {
          for (let oz of zombies) {
            if (oz !== z && !oz.isDead && Math.hypot(oz.x - z.x, oz.y - z.y) < 35) {
              oz.isDead = true; z.hp = Math.min(z.maxHp, z.hp + 75);
              playSfx('headshot'); break;
            }
          }
        }

        if (z.x > 246) z.x -= z.speed;
        else {
          barricadeHp = Math.max(0, barricadeHp - 0.25);
          barricadeDamageTaken += 0.25;
        }
      }

      // Check Barricade Death
      if (barricadeHp <= 0 && isCombat) {
        isEnded = true; isCombat = false;
        document.getElementById('gameOverModal').style.display = 'flex';
      }

      // Check Night Victory
      const living = zombies.filter(z => !z.isDead).length;
      if (zombiesSpawned >= totalNightZombies && living === 0 && !isEnded && isCombat) {
        show3SecSummary();
      }

      // Canvas Rendering
      ctx.fillStyle = '#090d16'; ctx.fillRect(0, 0, cv.width, cv.height);
      // Floor lines
      ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1;
      for (let y = 140; y < 500; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(960, y); ctx.stroke(); }
      // Barricade
      ctx.fillStyle = '#334155'; ctx.fillRect(234, 80, 14, 420);
      ctx.fillStyle = '#64748b'; ctx.fillRect(230, 100, 22, 10); ctx.fillRect(230, 260, 22, 10); ctx.fillRect(230, 420, 22, 10);
      // Player
      ctx.fillStyle = '#f59e0b'; ctx.beginPath(); ctx.arc(180, playerY, 13, 0, Math.PI * 2); ctx.fill();
      // Beam (Stops at hit target)
      if (activeWeapon === 'plasma_rifle' && isMouseDown && plasmaBattery > 0) {
        ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(180, playerY); ctx.lineTo(plasmaBeamEnd.x, plasmaBeamEnd.y); ctx.stroke();
      }
      // Bullets
      ctx.fillStyle = '#fde047';
      for (let b of bullets) { ctx.beginPath(); ctx.arc(b.x, b.y, 3, 0, Math.PI * 2); ctx.fill(); }
      // Acid Spits
      ctx.fillStyle = '#22c55e';
      for (let a of acidSpits) { ctx.beginPath(); ctx.arc(a.x, a.y, 6, 0, Math.PI * 2); ctx.fill(); }
      // Landmines
      ctx.fillStyle = '#ef4444';
      for (let m of landmines) { ctx.beginPath(); ctx.arc(m.x, m.y, 6, 0, Math.PI * 2); ctx.fill(); }
      // Zombies
      for (let z of zombies) {
        if (z.isDead) continue;
        ctx.fillStyle = z.type === 'boss' ? '#991b1b' : z.type === 'fat' ? '#16a34a' : z.type === 'spitter' ? '#047857' : z.type === 'runner' ? '#ea580c' : '#15803d';
        ctx.beginPath();
        if (z.type === 'boss') ctx.arc(z.x, z.y, 28, 0, Math.PI * 2);
        else ctx.ellipse(z.x, z.y, z.type === 'fat' ? 18 : 12, 24, 0, 0, Math.PI * 2);
        ctx.fill();

        // Health bar above zombie
        const barW = z.type === 'boss' ? 60 : 26;
        ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(z.x - barW/2, z.y - 30, barW, 4);
        ctx.fillStyle = z.type === 'boss' ? '#ef4444' : '#22c55e';
        ctx.fillRect(z.x - barW/2, z.y - 30, barW * Math.max(0, z.hp / z.maxHp), 4);
      }

      updateUI();
    }

    gameLoop();
  </script>
</body>
</html>`;
}
