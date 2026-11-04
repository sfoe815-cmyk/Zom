import React, { useState } from 'react';
import { 
  Weapon, 
  Survivor, 
  BarricadeState, 
  Resources, 
  AmmoStock, 
  CraftingRecipe,
  Language, 
  WeaponId,
  ResourceId
} from '../types/game';
import { CRAFTING_RECIPES, SUPERMARKET_AISLES } from '../data/gameData';
import { audio } from '../utils/audio';
import { 
  Wrench, 
  Search, 
  Users, 
  Hammer, 
  Shield, 
  Crosshair, 
  Radio, 
  Heart, 
  Utensils, 
  Droplet, 
  Plus, 
  Minus, 
  Clock, 
  Flame, 
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  PackageCheck,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Zap
} from 'lucide-react';

interface DaytimeHubProps {
  day: number;
  playerHealth: number;
  maxPlayerHealth: number;
  setPlayerHealth: React.Dispatch<React.SetStateAction<number>>;
  activeWeapon: Weapon;
  setActiveWeapon: (w: Weapon) => void;
  secondaryWeapon: Weapon | null;
  setSecondaryWeapon: (w: Weapon | null) => void;
  allWeapons: Record<WeaponId, Weapon>;
  setAllWeapons: React.Dispatch<React.SetStateAction<Record<WeaponId, Weapon>>>;
  barricade: BarricadeState;
  setBarricade: React.Dispatch<React.SetStateAction<BarricadeState>>;
  resources: Resources;
  setResources: React.Dispatch<React.SetStateAction<Resources>>;
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
  firstAidKitCount: number;
  setFirstAidKitCount: React.Dispatch<React.SetStateAction<number>>;
  equippedAbilityId: string | null;
  setEquippedAbilityId: (id: string | null) => void;
  availableDaylightHours?: number;
  setAvailableDaylightHours?: React.Dispatch<React.SetStateAction<number>>;
  hasUsedDayHours?: boolean;
  setHasUsedDayHours?: React.Dispatch<React.SetStateAction<boolean>>;
  onStartNight: () => void;
  language: Language;
}

interface ExecutionReport {
  repairedHp: number;
  foundWeapon: Weapon | null;
  foundSurvivor: Survivor | null;
  foundResources: Partial<Resources>;
  foundAmmo: Partial<AmmoStock>;
}

export const DaytimeHub: React.FC<DaytimeHubProps> = ({
  day,
  playerHealth,
  maxPlayerHealth,
  setPlayerHealth,
  activeWeapon,
  setActiveWeapon,
  secondaryWeapon,
  setSecondaryWeapon,
  allWeapons,
  setAllWeapons,
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
  firstAidKitCount,
  setFirstAidKitCount,
  equippedAbilityId,
  setEquippedAbilityId,
  availableDaylightHours = 12,
  setAvailableDaylightHours,
  hasUsedDayHours = false,
  setHasUsedDayHours,
  onStartNight,
  language
}) => {
  // Navigation Tabs: 'HOURS' | 'ARMORY' | 'CRAFTING' | 'SURVIVORS'
  const [activeTab, setActiveTab] = useState<'HOURS' | 'ARMORY' | 'CRAFTING' | 'SURVIVORS'>('HOURS');

  // 12 daylight hours to distribute
  // 1. Repair Barricade
  // 2. Scavenge Supplies & Parts (Unified location: 1 hour = 3 parts/materials)
  // 3. Search Weapons Warehouse (Requires exactly 5 hours per weapon! 1st = Shotgun, 2nd = Uzi)
  // 4. Search Survivors (Requires 10 hours in the same day)
  const [repairHours, setRepairHours] = useState<number>(2);
  const [scavengeHours, setScavengeHours] = useState<number>(5);
  const [weaponHours, setWeaponHours] = useState<number>(5);
  const [survivorHours, setSurvivorHours] = useState<number>(0);

  // Execution state & report
  const [hasExecutedToday, setHasExecutedToday] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [executionReport, setExecutionReport] = useState<ExecutionReport | null>(null);

  const maxPool = hasUsedDayHours ? 0 : availableDaylightHours;
  const totalAllocated = hasUsedDayHours ? 0 : (repairHours + scavengeHours + weaponHours + survivorHours);
  const remainingHours = Math.max(0, maxPool - totalAllocated);

  // Survivor Perk bonuses
  const hasZiad = survivors.some(s => s.id === 'ziad' && s.isRecruited && !s.isDead);

  // Quick Preset Allocations
  const applyPreset = (r: number, s: number, w: number, surv: number) => {
    if (hasUsedDayHours || availableDaylightHours <= 0) return;
    audio.playMechanicalClick();
    setRepairHours(r);
    setScavengeHours(s);
    setWeaponHours(w);
    setSurvivorHours(surv);
  };

  // Stepper handlers
  const adjustHours = (type: 'repair' | 'scavenge' | 'weapon' | 'survivor', delta: number) => {
    if (hasUsedDayHours || availableDaylightHours <= 0) return;
    audio.playMechanicalClick();
    if (delta > 0 && remainingHours < delta) return;

    if (type === 'repair') {
      const next = Math.max(0, Math.min(12, repairHours + delta));
      setRepairHours(next);
    } else if (type === 'scavenge') {
      const next = Math.max(0, Math.min(12, scavengeHours + delta));
      setScavengeHours(next);
    } else if (type === 'weapon') {
      const next = Math.max(0, Math.min(10, weaponHours + delta));
      setWeaponHours(next);
    } else if (type === 'survivor') {
      const next = Math.max(0, Math.min(10, survivorHours + delta));
      setSurvivorHours(next);
    }
  };

  // EXECUTE DAYTIME ACTIVITIES IMMEDIATELY & REVEAL RESULTS! (Single use per won night!)
  // "استخدام ساعات تكون مرة واحدة لكل ليلة... اكو قلتش بلعبة يجعل لاعب يحصل على عدد ساعات لامنتهية وهو لم يفز بليلة"
  const handleExecuteDaytimeActivities = () => {
    if (hasUsedDayHours || availableDaylightHours <= 0) return;
    audio.playCashRegister();

    // 1. Barricade Repair
    let repairedHp = 0;
    if (repairHours > 0) {
      const rate = hasZiad ? 35 : 25;
      repairedHp = repairHours * rate;
      setBarricade(prev => ({
        ...prev,
        hp: Math.min(prev.maxHp, prev.hp + repairedHp)
      }));
    }

    // 2. Scavenge Supplies & Spare Parts (Unified location: 1 hour = 3 parts/materials)
    const gatheredResources: Partial<Resources> = {};
    const gatheredAmmo: Partial<AmmoStock> = {};
    if (scavengeHours > 0) {
      const totalParts = scavengeHours * 3; // Exactly 3 parts per hour as user requested!
      gatheredResources.scrapMetal = Math.ceil(totalParts * 0.45);
      gatheredResources.cloth = Math.floor(totalParts * 0.25);
      gatheredResources.chemicals = Math.floor(totalParts * 0.2);
      gatheredResources.medkit = Math.max(1, Math.floor(scavengeHours * 0.6));
      gatheredResources.alcohol = Math.floor(scavengeHours * 0.7);
      gatheredResources.food = scavengeHours * 2;
      gatheredResources.water = scavengeHours * 2;
      // Battery calculation: 2 hours = 1 battery; with Shahd (id: 'layla'), 2 batteries per 2 hours!
      const hasShahd = survivors.some(s => s.id === 'layla' && s.isRecruited && !s.isDead);
      let batts = Math.floor(scavengeHours / 2);
      if (hasShahd && scavengeHours >= 2) {
        batts = Math.floor(scavengeHours / 2) * 2;
      } else if (scavengeHours === 1) {
        batts = Math.random() < 0.5 ? 1 : 0;
      }
      gatheredResources.battery = batts;

      gatheredAmmo['9mm'] = scavengeHours * 12;
      gatheredAmmo['357'] = Math.floor(scavengeHours * 3);
      gatheredAmmo['shell'] = Math.floor(scavengeHours * 4);
      gatheredAmmo['rifle'] = Math.floor(scavengeHours * 6);

      setResources(prev => ({
        food: prev.food + (gatheredResources.food || 0),
        water: prev.water + (gatheredResources.water || 0),
        medkit: prev.medkit + (gatheredResources.medkit || 0),
        alcohol: prev.alcohol + (gatheredResources.alcohol || 0),
        cloth: prev.cloth + (gatheredResources.cloth || 0),
        scrapMetal: prev.scrapMetal + (gatheredResources.scrapMetal || 0),
        battery: prev.battery + (gatheredResources.battery || 0),
        chemicals: prev.chemicals + (gatheredResources.chemicals || 0)
      }));

      setAmmoStock(prev => ({
        ...prev,
        '9mm': prev['9mm'] + (gatheredAmmo['9mm'] || 0),
        '357': prev['357'] + (gatheredAmmo['357'] || 0),
        shell: prev.shell + (gatheredAmmo.shell || 0),
        rifle: prev.rifle + (gatheredAmmo.rifle || 0)
      }));
    }

    // 3. Search Weapons Warehouse (Requires exactly 5 hours per weapon! 1st = Shotgun, 2nd = Uzi)
    let unlockedWeapon: Weapon | null = null;
    if (weaponHours >= 5) {
      const weaponsToFind = Math.floor(weaponHours / 5);
      for (let w = 0; w < weaponsToFind; w++) {
        let targetId: WeaponId | null = null;
        if (!allWeapons.shotgun.unlocked) {
          targetId = 'shotgun';
        } else if (!allWeapons.uzi.unlocked) {
          targetId = 'uzi';
        } else {
          const list: WeaponId[] = ['revolver', 'hunting_rifle', 'm4', 'spiked_bat'];
          targetId = list.find(id => allWeapons[id] && !allWeapons[id].unlocked) || null;
        }

        if (targetId && allWeapons[targetId]) {
          unlockedWeapon = { ...allWeapons[targetId], unlocked: true };
          setAllWeapons(prev => ({
            ...prev,
            [targetId!]: { ...prev[targetId!], unlocked: true }
          }));

          // Give ammo for found weapon
          if (targetId === 'shotgun') {
            setAmmoStock(prev => ({ ...prev, shell: prev.shell + 21 }));
          } else if (targetId === 'uzi') {
            setAmmoStock(prev => ({ ...prev, '9mm': prev['9mm'] + 64 }));
          }

          if (!secondaryWeapon) {
            setSecondaryWeapon(unlockedWeapon);
          }
        }
      }
    }

    // 4. Search for Survivors (Requires 10 hours in the same day - Randomly rescues Baraq or Shahd)
    let rescuedSurvivor: Survivor | null = null;
    if (survivorHours >= 10) {
      const unrecruited = survivors.filter(s => !s.isRecruited && !s.isDead);
      if (unrecruited.length > 0) {
        const randomIndex = Math.floor(Math.random() * unrecruited.length);
        const nextUnrecruited = unrecruited[randomIndex];
        rescuedSurvivor = { ...nextUnrecruited, isRecruited: true };
        setSurvivors(prev => prev.map(s => s.id === nextUnrecruited.id ? { ...s, isRecruited: true } : s));

        // Unlock their weapon if not already unlocked
        if (allWeapons[nextUnrecruited.weaponId] && !allWeapons[nextUnrecruited.weaponId].unlocked) {
          setAllWeapons(prev => ({
            ...prev,
            [nextUnrecruited.weaponId]: { ...prev[nextUnrecruited.weaponId], unlocked: true }
          }));
        }

        // Auto-select their ability if no ability currently equipped
        if (!equippedAbilityId) {
          setEquippedAbilityId(nextUnrecruited.abilityId);
        }
      }
    }

    // Set Execution Report
    setExecutionReport({
      repairedHp,
      foundWeapon: unlockedWeapon,
      foundSurvivor: rescuedSurvivor,
      foundResources: gatheredResources,
      foundAmmo: gatheredAmmo
    });

    setHasExecutedToday(true);
    if (setHasUsedDayHours) setHasUsedDayHours(true);
    if (setAvailableDaylightHours) setAvailableDaylightHours(0);
    setShowReportModal(true);
  };

  // Crafting check
  const canCraft = (recipe: CraftingRecipe) => {
    return Object.entries(recipe.cost).every(([res, amount]) => {
      return (resources[res as ResourceId] || 0) >= (amount || 0);
    });
  };

  const handleCraft = (recipe: CraftingRecipe) => {
    if (!canCraft(recipe)) return;
    audio.playCraftSound();

    setResources(prev => {
      const next = { ...prev };
      Object.entries(recipe.cost).forEach(([res, amount]) => {
        next[res as ResourceId] -= (amount || 0);
      });
      return next;
    });

    if (recipe.id === 'molotov') {
      setMolotovCount(prev => prev + 2);
    } else if (recipe.id === 'pipe_bomb') {
      setPipeBombCount(prev => prev + 2);
    } else if (recipe.id === 'first_aid_kit') {
      setFirstAidKitCount(prev => prev + 1);
    } else if (recipe.id === 'barbed_wire') {
      setBarricade(prev => ({
        ...prev,
        hasBarbedWire: true,
        maxHp: prev.maxHp + 100,
        hp: prev.hp + 100
      }));
    } else if (recipe.id === 'electric_grid') {
      setBarricade(prev => ({ ...prev, hasElectricGrid: true }));
    } else if (recipe.id === 'spiked_bat_craft') {
      setAllWeapons(prev => ({
        ...prev,
        spiked_bat: { ...prev.spiked_bat, unlocked: true }
      }));
    } else if (recipe.id === 'craft_9mm') {
      setAmmoStock(prev => ({ ...prev, '9mm': prev['9mm'] + 30 }));
    } else if (recipe.id === 'craft_shells') {
      setAmmoStock(prev => ({ ...prev, shell: prev.shell + 10 }));
    } else if (recipe.id === 'craft_rifle') {
      setAmmoStock(prev => ({ ...prev, rifle: prev.rifle + 25 }));
    } else if (recipe.id === 'landmine' || recipe.id === 'floor_trap') {
      setMineCount(prev => prev + 2);
    }
  };

  // Use First Aid Kit
  const handleUseMedkit = (target: 'player' | string) => {
    if (firstAidKitCount <= 0) return;
    audio.playHealSound();
    setFirstAidKitCount(prev => prev - 1);

    if (target === 'player') {
      setPlayerHealth(prev => Math.min(maxPlayerHealth, prev + 55));
    } else {
      setSurvivors(prev => prev.map(s => {
        if (s.id === target) {
          return { ...s, health: Math.min(s.maxHealth, s.health + 55) };
        }
        return s;
      }));
    }
  };

  // Give Food / Water
  const handleGiveFood = (target: string) => {
    if (resources.food <= 0) return;
    audio.playEatDrinkSound();
    setResources(prev => ({ ...prev, food: prev.food - 1 }));
    setSurvivors(prev => prev.map(s => s.id === target ? { ...s, hunger: Math.min(100, s.hunger + 35) } : s));
  };

  const handleGiveWater = (target: string) => {
    if (resources.water <= 0) return;
    audio.playEatDrinkSound();
    setResources(prev => ({ ...prev, water: prev.water - 1 }));
    setSurvivors(prev => prev.map(s => s.id === target ? { ...s, thirst: Math.min(100, s.thirst + 40) } : s));
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-4 text-slate-100" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Top Banner & Radio */}
      <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-amber-400 font-mono font-bold">
                {language === 'ar' ? 'نداء الطوارئ الوطني' : 'NATIONAL GUARD RADIO'}
              </span>
              <span className="text-xs text-slate-500">·</span>
              <span className="text-xs text-slate-400">
                {language === 'ar' ? `اليوم ${day} من 10` : `Day ${day} of 10`}
              </span>
            </div>
            <p className="text-sm text-slate-300 font-medium">
              {language === 'ar'
                ? 'استغل ساعات النهار في تمشيط السوبرماركت للحصول على الأسلحة والمؤن، ثم استعد لليلة الدفاع القادمة.'
                : 'Spend your daylight hours to scavenge store aisles for guns & supplies, then brace for the incoming night!'}
            </p>
          </div>
        </div>

        {/* Start Night Action Button (Always prominent) */}
        <button
          onClick={onStartNight}
          className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-950/60 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Flame className="w-4 h-4 text-amber-300" />
          <span>{language === 'ar' ? 'بدء ليلة الدفاع عن السوبرماركت' : 'Start Night Defense'}</span>
        </button>
      </div>

      {/* Stockpile Bar */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span>🥫</span>
            <span>{language === 'ar' ? 'طعام:' : 'Food:'}</span>
            <span className="font-bold font-mono text-amber-400">{resources.food}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <span>💧</span>
            <span>{language === 'ar' ? 'ماء:' : 'Water:'}</span>
            <span className="font-bold font-mono text-sky-400">{resources.water}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <span>💊</span>
            <span>{language === 'ar' ? 'مؤن طبية:' : 'Meds:'}</span>
            <span className="font-bold font-mono text-emerald-400">{resources.medkit}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <span>⚙️</span>
            <span>{language === 'ar' ? 'خردة:' : 'Scrap:'}</span>
            <span className="font-bold font-mono text-slate-200">{resources.scrapMetal}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <span>🧪</span>
            <span>{language === 'ar' ? 'كحول:' : 'Alcohol:'}</span>
            <span className="font-bold font-mono text-purple-400">{resources.alcohol}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <span>🧨</span>
            <span>{language === 'ar' ? 'بارود/كيماويات:' : 'Chemicals:'}</span>
            <span className="font-bold font-mono text-orange-400">{resources.chemicals}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <span>🔋</span>
            <span>{language === 'ar' ? 'بطاريات:' : 'Battery:'}</span>
            <span className="font-bold font-mono text-cyan-400">{resources.battery}</span>
          </div>
        </div>

        {/* Consumables */}
        <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-s border-slate-700 sm:ps-3">
          <span className="text-orange-400 font-bold" title="Molotovs">🔥 {molotovCount}</span>
          <span className="text-red-400 font-bold" title="Pipe Bombs">💣 {pipeBombCount}</span>
          <span className="text-amber-400 font-bold" title="Landmines / Traps">💥 {mineCount}</span>
          <span className="text-emerald-400 font-bold" title="First Aid Kits">🩹 {firstAidKitCount}</span>
        </div>
      </div>

      {/* Modern Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('HOURS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'HOURS'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>{language === 'ar' ? 'خطة ساعات النهار (12 ساعة)' : 'Daytime Hours Plan (12h)'}</span>
        </button>

        <button
          onClick={() => setActiveTab('ARMORY')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'ARMORY'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Crosshair className="w-4 h-4" />
          <span>{language === 'ar' ? 'المخزن وتجهيز الأسلحة' : 'Armory & Weapons'}</span>
        </button>

        <button
          onClick={() => setActiveTab('CRAFTING')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'CRAFTING'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Hammer className="w-4 h-4" />
          <span>{language === 'ar' ? 'ورشة التصنيع والتركيب' : 'Crafting Workshop'}</span>
        </button>

        <button
          onClick={() => setActiveTab('SURVIVORS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'SURVIVORS'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{language === 'ar' ? 'فريق الناجين واحتياجاتهم' : 'Survivors Team'}</span>
        </button>
      </div>

      {/* TAB 1: HOURS ALLOCATION (SMOOTH, INTUITIVE, IMMEDIATE RESULTS) */}
      {activeTab === 'HOURS' && (
        <div className="flex flex-col gap-4">
          {/* Day 4 Secret Contract Parchment (If Day 4) */}
          {day === 4 && (
            <div className="bg-gradient-to-r from-amber-950/80 via-yellow-950/40 to-slate-900 border-2 border-amber-500 rounded-2xl p-5 shadow-2xl relative overflow-hidden animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-3xl shrink-0">
                  📜
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-500 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded font-mono">
                      {language === 'ar' ? 'عقد سري خاص' : 'SECRET CONTRACT'}
                    </span>
                    <span className="text-amber-400 text-xs font-bold font-mono">
                      {language === 'ar' ? 'الليلة الرابعة ⚡' : 'Night 4 ⚡'}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-white mt-1">
                    {language === 'ar' ? '📜 ورقة التحدي: سلاح بلازما الحارق!' : '📜 Challenge Contract: Incendiary Plasma Gun!'}
                  </h3>
                  <p className="text-xs text-amber-200/90 mt-1 leading-relaxed">
                    {language === 'ar'
                      ? '«اقتل في هذه الليلة عشرين زومبي (20) بطلقات رأس قاتلة (Headshot) وستحصل فوراً على سلاح بلازما الحارق! هذا السلاح يطلق شعاع بلازما مدمراً يقوم بحرق وإذابة الزومبي تدريجياً طالما سلطت الشعاع عليه.»'
                      : '«Kill 20 zombies with headshots in this night and you will instantly unlock the Incendiary Plasma Gun! Fires a continuous laser beam that melts zombies on contact.»'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Top 12-Hour Timeline Visualizer */}
          <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-mono text-amber-400 font-bold block">
                    {language === 'ar' ? 'مخطط ساعات النهار (12 ساعة)' : 'DAYLIGHT HOURS TIMELINE (12h)'}
                  </span>
                  {hasUsedDayHours && (
                    <span className="bg-emerald-950/80 border border-emerald-700/80 text-emerald-300 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                      {language === 'ar' ? '✓ تم الاستخدام لهذا اليوم' : '✓ Used For Today'}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-white mt-0.5">
                  {hasUsedDayHours
                    ? (language === 'ar' 
                      ? 'تم استهلاك 12 ساعة لهذا اليوم بنجاح · لا تضاف ساعات جديدة إلا بعد الفوز بليلة الدفاع القادمة'
                      : 'All 12 hours spent today · New hours unlocked only after defending successfully tonight')
                    : (language === 'ar' 
                      ? `المتبقي: ${remainingHours} ساعات غير موزعة (استخدام الساعات متاح مرة واحدة فقط)`
                      : `Remaining: ${remainingHours} hours unallocated (Single execution per won night)`)}
                </h3>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] text-slate-400">{language === 'ar' ? 'خطط سريعة:' : 'Presets:'}</span>
                <button
                  onClick={() => applyPreset(2, 5, 5, 0)}
                  disabled={hasUsedDayHours}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 text-amber-400 text-xs font-medium"
                >
                  {language === 'ar' ? '🔫 سلاح ومؤن (5س أسلحة)' : '🔫 Weapon Focus (5h)'}
                </button>
                <button
                  onClick={() => applyPreset(1, 1, 0, 10)}
                  disabled={hasUsedDayHours}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 text-emerald-400 text-xs font-medium"
                >
                  {language === 'ar' ? '👥 إنقاذ ناجٍ (10س)' : '👥 Survivor Focus (10h)'}
                </button>
                <button
                  onClick={() => applyPreset(2, 10, 0, 0)}
                  disabled={hasUsedDayHours}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 text-purple-400 text-xs font-medium"
                >
                  {language === 'ar' ? '📦 تمشيط مكثف (30 قطعة)' : '📦 Max Scavenge (30 parts)'}
                </button>
              </div>
            </div>

            {/* Visual 12 Segments Bar */}
            <div className="w-full bg-slate-950 p-1.5 rounded-xl border border-slate-800 flex gap-1 h-9">
              {Array.from({ length: 12 }).map((_, idx) => {
                let color = 'bg-slate-800';
                let label = '';
                if (idx < repairHours) {
                  color = 'bg-sky-500';
                  label = '🛠️';
                } else if (idx < repairHours + scavengeHours) {
                  color = 'bg-purple-500';
                  label = '📦';
                } else if (idx < repairHours + scavengeHours + weaponHours) {
                  color = 'bg-amber-500';
                  label = '🔫';
                } else if (idx < repairHours + scavengeHours + weaponHours + survivorHours) {
                  color = 'bg-emerald-500';
                  label = '👥';
                }

                return (
                  <div
                    key={idx}
                    className={`flex-1 rounded flex items-center justify-center text-[10px] font-bold text-slate-950 transition-all ${color}`}
                    title={`Hour ${idx + 1}`}
                  >
                    {label}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1 flex-wrap gap-2">
              <span className="flex items-center gap-1.5 text-sky-400">
                <span className="w-2 h-2 rounded-full bg-sky-500 inline-block" />
                {language === 'ar' ? `إصلاح المتراس (${repairHours}س)` : `Barricade (${repairHours}h)`}
              </span>
              <span className="flex items-center gap-1.5 text-purple-400">
                <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />
                {language === 'ar' ? `المؤن وقطع الغيار (${scavengeHours}س = ${scavengeHours * 3} قطع)` : `Parts & Meds (${scavengeHours}h)`}
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                {language === 'ar' ? `مخزن الأسلحة (${weaponHours}س)` : `Warehouse (${weaponHours}h)`}
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                {language === 'ar' ? `إنقاذ ناجين (${survivorHours}س)` : `Survivors (${survivorHours}h)`}
              </span>
            </div>
          </div>

          {/* 4 Main Interactive Activity Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Unified Scavenging (Meds, Spare Parts, Tools) */}
            <div className="bg-slate-900 border border-purple-500/60 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-purple-400" />
                    <h4 className="font-bold text-white text-sm">
                      {language === 'ar' ? 'تمشيط المؤن وقطع الغيار' : 'Scavenge Supplies & Parts'}
                    </h4>
                  </div>
                  <span className="font-mono text-sm text-purple-400 font-bold">{scavengeHours}س</span>
                </div>

                <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                  {language === 'ar'
                    ? 'مكان موحد لجمع قطع الغيار والأدوات والعلاجات والبطاريات. كل ساعة = 3 قطع غيار، وكل ساعتين = بطارية واحدة (مع شهد الصيدلانية تتضاعف إلى بطاريتين لكل ساعتين)!'
                    : 'Unified location for spare parts, meds, and batteries. 1h = 3 parts, 2h = 1 battery (doubles with Shahd)!'}
                </p>

                {/* Expected Return Box */}
                <div className="bg-purple-950/40 border border-purple-800/50 rounded-lg p-2.5 text-xs text-purple-200 mb-3">
                  <div className="font-bold mb-1 flex items-center gap-1 text-purple-300">
                    <PackageCheck className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'العائد المحسوب:' : 'Calculated Yield:'}</span>
                  </div>
                  <span className="font-bold text-purple-300 block">
                    {language === 'ar'
                      ? `+${scavengeHours * 3} قطع غيار وعلاجات + ${Math.floor(scavengeHours / 2) * (survivors.some(s => s.id === 'layla' && s.isRecruited && !s.isDead) ? 2 : 1)} بطارية 🔋 + ذخيرة متنوعة`
                      : `+${scavengeHours * 3} spare parts/meds + ${Math.floor(scavengeHours / 2) * (survivors.some(s => s.id === 'layla' && s.isRecruited && !s.isDead) ? 2 : 1)} battery 🔋 + ammo`}
                  </span>
                </div>
              </div>

              {/* Stepper */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <button
                  onClick={() => adjustHours('scavenge', -1)}
                  disabled={scavengeHours <= 0}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white flex items-center justify-center font-bold"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-mono text-sm font-bold text-white">{scavengeHours} / 12</span>
                <button
                  onClick={() => adjustHours('scavenge', 1)}
                  disabled={remainingHours <= 0}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white flex items-center justify-center font-bold"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Card 2: Weapons Warehouse (5h per weapon) */}
            <div className="bg-slate-900 border border-amber-500/70 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Crosshair className="w-5 h-5 text-amber-400" />
                    <h4 className="font-bold text-white text-sm">
                      {language === 'ar' ? 'مخزن الأسلحة (شرط 5س)' : 'Weapons Warehouse (5h)'}
                    </h4>
                  </div>
                  <span className="font-mono text-sm text-amber-400 font-bold">{weaponHours}س</span>
                </div>

                <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                  {language === 'ar'
                    ? 'يتطلب 5 ساعات بالضبط لكل سلاح ناري. المرة الأولى: شوزن، المرة الثانية: رشاش عوزي!'
                    : 'Requires 5 hours per firearm. 1st search = Pump Shotgun, 2nd search = Micro Uzi!'}
                </p>

                {/* Expected Return Box */}
                <div className="bg-amber-950/40 border border-amber-800/50 rounded-lg p-2.5 text-xs text-amber-200 mb-3">
                  <div className="font-bold mb-1 flex items-center gap-1 text-amber-300">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'السلاح المضمون:' : 'Guaranteed Weapon:'}</span>
                  </div>
                  {weaponHours >= 5 ? (
                    <span className="font-bold text-emerald-400 block">
                      {weaponHours >= 10 
                        ? (language === 'ar' ? '🎉 سلاحان: شوزن بامب + رشاش عوزي + ذخائر!' : '🎉 2 Weapons: Shotgun + Uzi + Ammo!')
                        : (!allWeapons.shotgun.unlocked 
                            ? (language === 'ar' ? '🎉 سلاح أول: بندقية صيد بامب شوزن + 21 خرطوش' : '🎉 1st: Pump Shotgun + 21 Shells')
                            : (language === 'ar' ? '🎉 سلاح ثانٍ: رشاش ميكرو عوزي + 64 طلقة' : '🎉 2nd: Micro Uzi + 64 Rounds'))}
                    </span>
                  ) : (
                    <span className="text-amber-400/80 block">
                      {language === 'ar' ? '⚠️ يحتاج 5 ساعات على الأقل للحصول على سلاح' : '⚠️ Requires 5h minimum for a weapon'}
                    </span>
                  )}
                </div>
              </div>

              {/* Stepper with 5h step buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 gap-2">
                <button
                  onClick={() => setWeaponHours(0)}
                  className={`flex-1 py-1 rounded text-xs font-bold transition-all ${
                    weaponHours === 0 ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  0س
                </button>
                <button
                  onClick={() => {
                    if (weaponHours !== 5 && remainingHours >= (5 - weaponHours)) {
                      setWeaponHours(5);
                    }
                  }}
                  disabled={weaponHours !== 5 && remainingHours < (5 - weaponHours)}
                  className={`flex-1 py-1 rounded text-xs font-bold transition-all disabled:opacity-30 ${
                    weaponHours === 5 ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-amber-400 hover:bg-slate-700'
                  }`}
                >
                  5س (سلاح 1)
                </button>
                <button
                  onClick={() => {
                    if (weaponHours !== 10 && remainingHours >= (10 - weaponHours)) {
                      setWeaponHours(10);
                    }
                  }}
                  disabled={weaponHours !== 10 && remainingHours < (10 - weaponHours)}
                  className={`flex-1 py-1 rounded text-xs font-bold transition-all disabled:opacity-30 ${
                    weaponHours === 10 ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-amber-400 hover:bg-slate-700'
                  }`}
                >
                  10س (سلاحان)
                </button>
              </div>
            </div>

            {/* Card 3: Search Survivors (10h same-day rule) */}
            <div className="bg-slate-900 border border-emerald-500/60 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-400" />
                    <h4 className="font-bold text-white text-sm">
                      {language === 'ar' ? 'إنقاذ ناجين (شرط 10س)' : 'Rescue Survivors (10h)'}
                    </h4>
                  </div>
                  <span className="font-mono text-sm text-emerald-400 font-bold">{survivorHours}س</span>
                </div>

                <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                  {language === 'ar'
                    ? 'شرط أساسي: 10 ساعات في نفس اليوم للعثور على ناجٍ جديد! لا يمكن تقسيمها بين الأيام.'
                    : 'Must spend 10 hours in the same day to rescue a survivor! No rollover across days.'}
                </p>

                {/* Expected Return Box */}
                <div className="bg-emerald-950/40 border border-emerald-800/50 rounded-lg p-2.5 text-xs text-emerald-200 mb-3">
                  <div className="font-bold mb-1 flex items-center gap-1 text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'حالة الإنقاذ:' : 'Rescue Status:'}</span>
                  </div>
                  {survivorHours >= 10 ? (
                    <span className="font-bold text-emerald-300 block">
                      {language === 'ar'
                        ? '🎉 مؤكد: إنقاذ ناجٍ جديد اليوم بسلاحه وقدرته القتالية!'
                        : '🎉 Guaranteed: Rescue a new survivor today!'}
                    </span>
                  ) : (
                    <span className="text-amber-400 block font-medium">
                      {language === 'ar'
                        ? '⚠️ خصص 10 ساعات في هذا اليوم لضمان الإنقاذ'
                        : '⚠️ Must allocate 10 hours in this day'}
                    </span>
                  )}
                </div>
              </div>

              {/* Stepper with 10h toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 gap-2">
                <button
                  onClick={() => setSurvivorHours(0)}
                  className={`flex-1 py-1 rounded text-xs font-bold transition-all ${
                    survivorHours === 0 ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  0س
                </button>
                <button
                  onClick={() => {
                    if (survivorHours !== 10 && remainingHours >= (10 - survivorHours)) {
                      setSurvivorHours(10);
                    }
                  }}
                  disabled={survivorHours !== 10 && remainingHours < (10 - survivorHours)}
                  className={`flex-1 py-1 rounded text-xs font-bold transition-all disabled:opacity-30 ${
                    survivorHours === 10 ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-800 text-emerald-400 hover:bg-slate-700'
                  }`}
                >
                  10س (ناجٍ مؤكد)
                </button>
              </div>
            </div>

            {/* Card 4: Repair Barricade */}
            <div className="bg-slate-900 border border-sky-500/60 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-sky-400" />
                    <h4 className="font-bold text-white text-sm">
                      {language === 'ar' ? 'إصلاح المتاريس' : 'Repair Barricade'}
                    </h4>
                  </div>
                  <span className="font-mono text-sm text-sky-400 font-bold">{repairHours}س</span>
                </div>

                <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                  {language === 'ar'
                    ? 'لحام عربات التسوق وتقويتها. كل ساعة تستعيد +25 نقطة صحة (+35 مع زياد).'
                    : 'Reinforce shopping carts. Restores +25 HP per hour (+35 with Ziad).'}
                </p>

                {/* Expected Return Box */}
                <div className="bg-sky-950/40 border border-sky-800/50 rounded-lg p-2.5 text-xs text-sky-200 mb-3">
                  <div className="font-bold mb-1 flex items-center gap-1 text-sky-300">
                    <Shield className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'استعادة الصحة:' : 'HP Restored:'}</span>
                  </div>
                  <span className="font-bold text-sky-300 block">
                    +{repairHours * (hasZiad ? 35 : 25)} HP ({barricade.hp}/{barricade.maxHp})
                  </span>
                </div>
              </div>

              {/* Stepper */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <button
                  onClick={() => adjustHours('repair', -1)}
                  disabled={repairHours <= 0}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white flex items-center justify-center font-bold"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-mono text-sm font-bold text-white">{repairHours} / 12</span>
                <button
                  onClick={() => adjustHours('repair', 1)}
                  disabled={remainingHours <= 0}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white flex items-center justify-center font-bold"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* ACTIVE SURVIVOR ULTIMATE ABILITY SELECTOR CARD */}
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h4 className="font-bold text-white text-sm">
                  {language === 'ar' ? 'اختيار القدرة الخارقة للناجي (تتفعل كل 20 ثانية أثناء المعركة [E])' : 'Equip Survivor Ultimate Ability (20s Cooldown [E])'}
                </h4>
              </div>
              <span className="text-xs text-slate-400">
                {language === 'ar' ? 'اختر قدرة واحدة فقط للمعركة' : 'Select only 1 active ability'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {survivors.map(s => {
                const isSelected = equippedAbilityId === s.abilityId;
                const canUse = s.isRecruited && !s.isDead;

                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      if (canUse) {
                        audio.playMechanicalClick();
                        setEquippedAbilityId(s.abilityId);
                      }
                    }}
                    disabled={!canUse}
                    className={`p-3 rounded-xl border text-start transition-all relative ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500 shadow-md ring-1 ring-amber-500'
                        : canUse
                        ? 'bg-slate-800/80 border-slate-700 hover:border-slate-500'
                        : 'bg-slate-950/40 border-slate-800/40 opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-white text-xs">
                        {language === 'ar' ? s.nameAr : s.name}
                      </span>
                      {isSelected && (
                        <span className="bg-amber-500 text-slate-950 font-extrabold text-[10px] px-2 py-0.5 rounded-full font-mono">
                          {language === 'ar' ? 'مجهزة ✓' : 'ACTIVE'}
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-bold text-amber-400 mb-1">
                      {s.abilityNameAr}
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {s.abilityDescAr}
                    </p>

                    {!canUse && (
                      <span className="text-[10px] text-red-400 block mt-1 font-mono">
                        {language === 'ar' ? 'غير منقذ بعد' : 'Not rescued yet'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Big Action Bar: Execute Plan Now */}
          <div className="bg-slate-900 border border-amber-500/60 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>
                  {hasUsedDayHours 
                    ? (language === 'ar' ? 'تم استنفاد ساعات هذا اليوم بنجاح ✓' : 'Today\'s Daylight Hours Exhausted ✓')
                    : (language === 'ar' ? 'تنفيذ خطة ساعات النهار الآن (12 ساعة)' : 'Execute Daytime Activities (12h)')}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {hasUsedDayHours
                  ? (language === 'ar'
                    ? 'لقد استخدمت ساعاتك النهارية بالفعل لهذا اليوم وحصلت على الغنائم. جهّز أسلحتك وابدأ ليلة الدفاع!'
                    : 'You have already spent your daylight hours for this day and collected your loot. Gear up for night combat!')
                  : (language === 'ar'
                    ? 'انقر للحصول على الأسلحة والمؤن وإصلاح المتراس فوراً ومشاهدة تقرير الغنائم قبل بدء الليل (استخدام الساعات متاح مرة واحدة لكل ليلة فائزة).'
                    : 'Click to collect your weapons, loot, and barricade repairs immediately before the night battle (single use per won night).')}
              </p>
            </div>

            <button
              onClick={handleExecuteDaytimeActivities}
              disabled={hasUsedDayHours || availableDaylightHours <= 0}
              className={`w-full sm:w-auto px-8 py-3.5 font-black text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all ${
                hasUsedDayHours || availableDaylightHours <= 0
                  ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed shadow-none'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-950/50 transform hover:-translate-y-0.5 active:translate-y-0'
              }`}
            >
              <PackageCheck className="w-5 h-5" />
              <span>
                {hasUsedDayHours || availableDaylightHours <= 0
                  ? (language === 'ar' ? '✓ تم استنفاد ساعات اليوم (استعد لليلة الدفاع)' : '✓ Hours Used (Prepare For Night)')
                  : (language === 'ar' ? 'تنفيذ الساعات وجمع الغنائم 📦' : 'Execute Plan & Collect Loot 📦')}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* DISCOVERY & LOOT REPORT MODAL */}
      {showReportModal && executionReport && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        >
          <div className="bg-slate-900 border border-amber-500/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-4 text-slate-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-400">
                <PackageCheck className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase text-amber-400 font-bold">
                  {language === 'ar' ? 'تقرير تمشيط النهار' : 'DAYTIME MISSION REPORT'}
                </span>
                <h3 className="text-xl font-extrabold text-white">
                  {language === 'ar' ? 'تم تنفيذ خطة الساعات بنجاح!' : 'Daytime Activities Completed!'}
                </h3>
              </div>
            </div>

            {/* NEW WEAPON HIGHLIGHT CARD (IF FOUND!) */}
            {executionReport.foundWeapon && (
              <div className="bg-gradient-to-r from-amber-950/60 to-slate-900 border-2 border-amber-500 rounded-xl p-4 flex items-center gap-4 shadow-lg shadow-amber-950/40">
                <div className="text-3xl">🔫</div>
                <div>
                  <span className="text-[11px] font-mono text-amber-400 uppercase font-bold block">
                    {language === 'ar' ? '🎉 سلاح ناري جديد تم العثور عليه!' : '🎉 NEW WEAPON DISCOVERED!'}
                  </span>
                  <h4 className="text-base font-extrabold text-white">
                    {language === 'ar' ? executionReport.foundWeapon.nameAr : executionReport.foundWeapon.name}
                  </h4>
                  <p className="text-xs text-slate-300">
                    {language === 'ar' ? executionReport.foundWeapon.descriptionAr : executionReport.foundWeapon.description}
                  </p>
                </div>
              </div>
            )}

            {/* NEW SURVIVOR HIGHLIGHT CARD (IF FOUND!) */}
            {executionReport.foundSurvivor && (
              <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 border-2 border-emerald-500 rounded-xl p-4 flex items-center gap-4 shadow-lg shadow-emerald-950/40">
                <div className="text-3xl">👥</div>
                <div>
                  <span className="text-[11px] font-mono text-emerald-400 uppercase font-bold block">
                    {language === 'ar' ? '🎉 تم إنقاذ ناجٍ جديد!' : '🎉 NEW SURVIVOR RESCUED!'}
                  </span>
                  <h4 className="text-base font-extrabold text-white">
                    {language === 'ar' ? executionReport.foundSurvivor.nameAr : executionReport.foundSurvivor.name} ({language === 'ar' ? executionReport.foundSurvivor.roleAr : executionReport.foundSurvivor.role})
                  </h4>
                  <p className="text-xs text-slate-300">
                    {language === 'ar' ? executionReport.foundSurvivor.perkAr : executionReport.foundSurvivor.perkEn}
                  </p>
                </div>
              </div>
            )}

            {/* Summary Breakdown Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <span className="text-slate-400 block mb-1">
                  {language === 'ar' ? 'صيانة المتراس:' : 'Barricade Repaired:'}
                </span>
                <span className="font-mono text-base font-bold text-sky-400">
                  +{executionReport.repairedHp} HP
                </span>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <span className="text-slate-400 block mb-1">
                  {language === 'ar' ? 'المؤن والخامات المجمعة:' : 'Supplies Gathered:'}
                </span>
                <div className="flex items-center gap-2 flex-wrap font-mono font-bold text-amber-300">
                  {Object.entries(executionReport.foundResources).map(([k, v]) => (
                    <span key={k}>{k}: +{v}</span>
                  ))}
                  {Object.keys(executionReport.foundResources).length === 0 && <span>-</span>}
                </div>
              </div>
            </div>

            {/* Ammo Added */}
            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">{language === 'ar' ? 'ذخيرة أضيفت للمخزن:' : 'Ammo added:'}</span>
              <div className="flex items-center gap-3 text-slate-200">
                <span>9mm: +{executionReport.foundAmmo['9mm'] || 0}</span>
                <span>.357: +{executionReport.foundAmmo['357'] || 0}</span>
                <span>Shells: +{executionReport.foundAmmo.shell || 0}</span>
                <span>Rifle: +{executionReport.foundAmmo.rifle || 0}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setActiveTab('ARMORY'); // Take user straight to Armory to view their new weapon!
                }}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Crosshair className="w-4 h-4 text-sky-400" />
                <span>{language === 'ar' ? 'تجهيز السلاح في المخزن' : 'Equip Weapon in Armory'}</span>
              </button>

              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>{language === 'ar' ? 'ممتاز، متابعة' : 'Done, Continue'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ARMORY (EQUIP WEAPONS) */}
      {activeTab === 'ARMORY' && (
        <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Crosshair className="w-5 h-5 text-sky-400" />
                <span>{language === 'ar' ? 'مخزن الأسلحة وتجهيز العتاد' : 'Armory & Weapon Loadout'}</span>
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'ar'
                  ? 'اختر سلاحك الأساسي والثانوي للقتال الليلي من الأسلحة التي عثرت عليها في السوبرماركت.'
                  : 'Equip your primary and secondary weapons from guns scavenged in the supermarket.'}
              </p>
            </div>

            {/* Ammo Stocks */}
            <div className="flex items-center gap-3 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-mono">
              <span className="text-slate-400">9mm: <b className="text-slate-200">{ammoStock['9mm']}</b></span>
              <span className="text-slate-400">.357: <b className="text-slate-200">{ammoStock['357']}</b></span>
              <span className="text-slate-400">Shells: <b className="text-slate-200">{ammoStock.shell}</b></span>
              <span className="text-slate-400">Rifle: <b className="text-slate-200">{ammoStock.rifle}</b></span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.values(allWeapons).map(w => {
              const isPrimary = activeWeapon.id === w.id;
              const isSecondary = secondaryWeapon?.id === w.id;

              return (
                <div
                  key={`armory-card-${w.id}`}
                  className={`border rounded-xl p-4 flex flex-col justify-between transition-all ${
                    w.unlocked
                      ? isPrimary
                        ? 'bg-amber-950/20 border-amber-500 text-white shadow-md'
                        : isSecondary
                        ? 'bg-sky-950/20 border-sky-500 text-white shadow-md'
                        : 'bg-slate-800/80 border-slate-700 text-slate-200'
                      : 'bg-slate-900/60 border-slate-800 text-slate-600 opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="font-bold text-sm">
                        {language === 'ar' ? w.nameAr : w.name}
                      </h4>
                      <span className="text-[10px] font-mono uppercase text-slate-400">
                        {w.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                      {language === 'ar' ? w.descriptionAr : w.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300 bg-slate-950/70 p-2.5 rounded-lg mb-3 border border-slate-800">
                      <div>
                        <span className="text-slate-400 block text-[9px]">{language === 'ar' ? 'الدمج / الضرر:' : 'Damage:'}</span>
                        <b className="text-amber-400 text-xs">💥 {w.damage * w.pellets}</b>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">{language === 'ar' ? 'سعة الخزنة:' : 'Clip Size:'}</span>
                        <b className="text-sky-400 text-xs">🎯 {w.clipSize} {language === 'ar' ? 'طلقة' : 'rds'}</b>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">{language === 'ar' ? 'الرصيد بالمخزن:' : 'Stock Reserve:'}</span>
                        <b className="text-emerald-400 text-xs">📦 {w.ammoType === 'none' ? '∞' : (ammoStock[w.ammoType as keyof AmmoStock] ?? 0)}</b>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">{language === 'ar' ? 'نمط الإطلاق:' : 'Fire Mode:'}</span>
                        <b className="text-slate-300 text-[10px]">
                          {w.isAutomatic 
                            ? (language === 'ar' ? 'آلي رشاش' : 'Auto') 
                            : w.category === 'shotgun' 
                            ? (language === 'ar' ? 'ضخ يدوي' : 'Pump') 
                            : (language === 'ar' ? 'نصف آلي' : 'Semi-Auto')}
                        </b>
                      </div>
                    </div>
                  </div>

                  {w.unlocked ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          audio.playMechanicalClick();
                          if (secondaryWeapon?.id === w.id) {
                            setSecondaryWeapon(activeWeapon.id === w.id ? null : activeWeapon);
                          }
                          setActiveWeapon(w);
                        }}
                        disabled={isPrimary}
                        className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                          isPrimary
                            ? 'bg-amber-500 text-slate-950 cursor-default'
                            : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                        }`}
                      >
                        {isPrimary ? (language === 'ar' ? 'سلاح أساسي' : 'Primary') : (language === 'ar' ? 'تحديد كأساسي' : 'Set Primary')}
                      </button>

                      <button
                        onClick={() => {
                          audio.playMechanicalClick();
                          if (activeWeapon.id === w.id) {
                            return;
                          }
                          setSecondaryWeapon(w);
                        }}
                        disabled={isSecondary || isPrimary}
                        className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                          isSecondary
                            ? 'bg-sky-500 text-slate-950 cursor-default'
                            : 'bg-slate-700 hover:bg-slate-600 text-slate-200 disabled:opacity-40'
                        }`}
                      >
                        {isSecondary ? (language === 'ar' ? 'سلاح ثانوي' : 'Secondary') : (language === 'ar' ? 'تحديد كثانوي' : 'Set Secondary')}
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-2 text-xs font-mono text-amber-500/80 bg-amber-950/20 border border-dashed border-amber-900/60 rounded-lg">
                      🔒 {language === 'ar' ? 'خصص ساعتين في المستودع لفتحه فوراً' : 'Allocate 2h in Warehouse to unlock'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: CRAFTING WORKSHOP */}
      {activeTab === 'CRAFTING' && (
        <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Hammer className="w-5 h-5 text-amber-400" />
                <span>{language === 'ar' ? 'طاولة التصنيع والتركيب' : 'Crafting Workbench'}</span>
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'ar'
                  ? 'اصنع زجاجات المولوتوف، قنابل الأنابيب، ترقيات المتاريس، والحقائب الطبية.'
                  : 'Craft Molotov cocktails, pipe bombs, barbed wire upgrades, and medical kits.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {CRAFTING_RECIPES.map(recipe => {
              const affordable = canCraft(recipe);
              return (
                <div 
                  key={recipe.id}
                  className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="font-bold text-slate-100 text-sm">
                        {language === 'ar' ? recipe.nameAr : recipe.name}
                      </h4>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                        {recipe.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mb-3">
                      {language === 'ar' ? recipe.descriptionAr : recipe.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="text-[11px] text-slate-500">{language === 'ar' ? 'المتطلبات:' : 'Cost:'}</span>
                      {Object.entries(recipe.cost).map(([res, amount]) => {
                        const current = resources[res as ResourceId] || 0;
                        const hasEnough = current >= (amount || 0);
                        return (
                          <span 
                            key={res} 
                            className={`text-xs px-2 py-0.5 rounded border font-mono ${
                              hasEnough 
                                ? 'bg-slate-900 border-slate-700 text-slate-300' 
                                : 'bg-red-950/40 border-red-800 text-red-400'
                            }`}
                          >
                            {res}: {current}/{amount}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={() => handleCraft(recipe)}
                    disabled={!affordable}
                    className="w-full py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-600 disabled:border-slate-700 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-amber-600"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'صناعة العنصر' : 'Craft Item'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: SURVIVORS TEAM */}
      {activeTab === 'SURVIVORS' && (
        <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <span>{language === 'ar' ? 'فريق المدافعين وشؤون البقاء' : 'Defenders & Survival'}</span>
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'ar'
                  ? 'اطعم واسقِ رفاقك بالمعلبات والمياه لمنع الإرهاق. استخدم الحقائب الطبية لعلاج المصابين.'
                  : 'Feed and hydrate defenders to prevent fatigue. Use first aid kits to heal injuries.'}
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
              <span className="text-slate-300">{language === 'ar' ? 'الحقائب المتوفرة:' : 'Medkits:'}</span>
              <span className="font-mono font-bold text-emerald-400">{firstAidKitCount}</span>
            </div>
          </div>

          {survivors.every(s => !s.isRecruited) && (
            <div className="bg-slate-800/90 border border-amber-500/40 rounded-xl p-3.5 mb-4 flex items-center gap-3 text-xs text-amber-200">
              <span className="text-2xl">🔒</span>
              <div>
                <p className="font-bold text-white mb-0.5">
                  {language === 'ar' ? 'لا توجد قدرة خارقة مجهزة حالياً' : 'No Ultimate Ability Equipped'}
                </p>
                <p className="text-slate-300">
                  {language === 'ar'
                    ? 'تبدأ الدفاع بدون أي قدرة. خصص 10 ساعات في خريطة النهار لإنقاذ براق أو شهد لفتح قدرتهما فوراً!'
                    : 'You start defense with no ability. Spend 10 hours in daytime to rescue Baraq or Shahd and unlock their ultimate ability!'}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Player Card */}
            <div className="bg-slate-800/90 border border-amber-500/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center font-bold text-amber-400">
                    P1
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">
                      {language === 'ar' ? 'أنت (قائد الدفاع)' : 'You (Leader)'}
                    </h4>
                    <span className="text-[11px] text-amber-400">
                      {language === 'ar' ? 'الناجي المتمرس' : 'Hardened Survivor'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleUseMedkit('player')}
                  disabled={firstAidKitCount <= 0 || playerHealth >= maxPlayerHealth}
                  className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white text-xs font-semibold disabled:opacity-40 transition-colors"
                >
                  🩹 {language === 'ar' ? 'علاج (+55)' : 'Heal (+55)'}
                </button>
              </div>

              <div className="space-y-1 mb-3">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>{language === 'ar' ? 'الصحة:' : 'Health:'}</span>
                  <span className="font-mono font-bold text-red-400">{playerHealth} / {maxPlayerHealth}</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div 
                    className="bg-red-500 h-full transition-all"
                    style={{ width: `${Math.round((playerHealth / maxPlayerHealth) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Recruited Survivors Cards */}
            {survivors.map(s => (
              <div 
                key={s.id}
                className={`border rounded-xl p-4 ${
                  s.isRecruited
                    ? 'bg-slate-800/90 border-slate-700'
                    : 'bg-slate-900/60 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-sky-500/20 border border-sky-500/50 flex items-center justify-center font-bold text-sky-400 text-sm">
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">
                        {language === 'ar' ? s.nameAr : s.name}
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        {language === 'ar' ? s.roleAr : s.role}
                      </span>
                    </div>
                  </div>

                  {s.isRecruited && !s.isDead && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleGiveFood(s.id)}
                        disabled={resources.food <= 0 || s.hunger >= 95}
                        className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-xs"
                        title="Give Food"
                      >
                        🥫
                      </button>
                      <button
                        onClick={() => handleGiveWater(s.id)}
                        disabled={resources.water <= 0 || s.thirst >= 95}
                        className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-xs"
                        title="Give Water"
                      >
                        💧
                      </button>
                      <button
                        onClick={() => handleUseMedkit(s.id)}
                        disabled={firstAidKitCount <= 0 || s.health >= s.maxHealth}
                        className="p-1.5 rounded bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 text-xs"
                        title="Heal"
                      >
                        🩹
                      </button>
                    </div>
                  )}
                </div>

                {s.isRecruited ? (
                  <div>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                      <div>
                        <div className="flex justify-between text-[11px] text-slate-400 mb-0.5">
                          <span>{language === 'ar' ? 'الشبع:' : 'Hunger:'}</span>
                          <span className="font-mono">{s.hunger}%</span>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full ${s.hunger < 30 ? 'bg-red-500' : 'bg-amber-500'}`}
                            style={{ width: `${s.hunger}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] text-slate-400 mb-0.5">
                          <span>{language === 'ar' ? 'الارتواء:' : 'Thirst:'}</span>
                          <span className="font-mono">{s.thirst}%</span>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full ${s.thirst < 30 ? 'bg-red-500' : 'bg-sky-500'}`}
                            style={{ width: `${s.thirst}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-emerald-400 bg-emerald-950/30 p-2 rounded border border-emerald-800/40 mb-2">
                      ⚡ {language === 'ar' ? s.perkAr : s.perkEn}
                    </p>

                    {/* Active Ability Equip Button */}
                    <div className="pt-2 border-t border-slate-700/80 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-amber-300">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span className="font-semibold">{language === 'ar' ? s.abilityNameAr : s.name}</span>
                      </div>
                      <button
                        onClick={() => {
                          audio.playMechanicalClick();
                          setEquippedAbilityId(s.abilityId);
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          equippedAbilityId === s.abilityId
                            ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                            : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                        }`}
                      >
                        {equippedAbilityId === s.abilityId
                          ? (language === 'ar' ? '✓ مجهزة للقتال' : '✓ Equipped')
                          : (language === 'ar' ? 'تجهيز هذه القدرة' : 'Equip Ability')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    {language === 'ar' 
                      ? 'مفقود داخل أروقة السوبرماركت... خصص 10 ساعات كاملة في نفس اليوم في خانة إنقاذ الناجين للعثور عليه.'
                      : 'Missing in the supermarket... Allocate 10 full hours on the same day to rescue.'}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
