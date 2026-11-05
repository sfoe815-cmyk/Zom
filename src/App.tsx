import React, { useState, useEffect } from 'react';
import { 
  GamePhase, 
  GameMode, 
  Language, 
  Weapon, 
  WeaponId, 
  BarricadeState, 
  Resources, 
  AmmoStock, 
  Survivor, 
  NightStats 
} from './types/game';
import { INITIAL_WEAPONS, INITIAL_SURVIVORS } from './data/gameData';
import { TitleScreen } from './components/TitleScreen';
import { CombatCanvas } from './components/CombatCanvas';
import { DaytimeHub } from './components/DaytimeHub';
import { NightSummaryModal } from './components/NightSummaryModal';
import { GameOverModal } from './components/GameOverModal';
import { VictoryModal } from './components/VictoryModal';
import { InstallModal } from './components/InstallModal';
import { audio } from './utils/audio';
import { Globe, RotateCcw, Shield, ShoppingCart, Volume2, VolumeX, Download } from 'lucide-react';

export default function App() {
  const [phase, setPhase] = useState<GamePhase>('TITLE');
  const [gameMode, setGameMode] = useState<GameMode>('CAMPAIGN');
  const [language, setLanguage] = useState<Language>('ar');
  const [day, setDay] = useState<number>(1);

  // Active survivor ultimate ability (20s cooldown - unlocked only when a survivor is recruited)
  const [equippedAbilityId, setEquippedAbilityId] = useState<string | null>(null);

  // Install / PWA Modal
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Player Stats
  const [playerHealth, setPlayerHealth] = useState<number>(100);
  const [maxPlayerHealth] = useState<number>(100);

  // Barricade State
  const [barricade, setBarricade] = useState<BarricadeState>({
    hp: 300,
    maxHp: 300,
    hasBarbedWire: false,
    hasElectricGrid: false,
    reinforcedLevel: 1
  });

  // Weapons & Loadout
  const [allWeapons, setAllWeapons] = useState<Record<WeaponId, Weapon>>(INITIAL_WEAPONS);
  const [activeWeapon, setActiveWeapon] = useState<Weapon>(INITIAL_WEAPONS.nail_gun);
  const [secondaryWeapon, setSecondaryWeapon] = useState<Weapon | null>(INITIAL_WEAPONS.knife);

  // Scavenged Survival Resources
  const [resources, setResources] = useState<Resources>({
    food: 4,
    water: 4,
    medkit: 2,
    scrapMetal: 4,
    alcohol: 2,
    cloth: 3,
    chemicals: 2,
    battery: 1
  });

  // Ammo Reserves
  const [ammoStock, setAmmoStock] = useState<AmmoStock>({
    nails: 120,
    smg: 60,
    shell: 24,
    rifle: 80,
    energy: 600
  });

  // Survivors
  const [survivors, setSurvivors] = useState<Survivor[]>(INITIAL_SURVIVORS);

  // Crafted Consumables
  const [molotovCount, setMolotovCount] = useState<number>(1);
  const [pipeBombCount, setPipeBombCount] = useState<number>(1);
  const [mineCount, setMineCount] = useState<number>(2);
  const [firstAidKitCount, setFirstAidKitCount] = useState<number>(1);

  // Night Statistics
  const [lastNightStats, setLastNightStats] = useState<NightStats | null>(null);

  // Daylight Hours Management: strictly 12 hours awarded ONLY upon winning a night defense, usable ONCE per night!
  const [availableDaylightHours, setAvailableDaylightHours] = useState<number>(0);
  const [hasUsedDayHours, setHasUsedDayHours] = useState<boolean>(true);

  // Sound State
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Restart / Reset Game
  const handleRestart = () => {
    setDay(1);
    setPlayerHealth(100);
    setBarricade({
      hp: 300,
      maxHp: 300,
      hasBarbedWire: false,
      hasElectricGrid: false,
      reinforcedLevel: 1
    });
    setAllWeapons(INITIAL_WEAPONS);
    setActiveWeapon(INITIAL_WEAPONS.nail_gun);
    setSecondaryWeapon(INITIAL_WEAPONS.knife);
    setResources({
      food: 4,
      water: 4,
      medkit: 2,
      scrapMetal: 4,
      alcohol: 2,
      cloth: 3,
      chemicals: 2,
      battery: 1
    });
    setAmmoStock({
      nails: 120,
      smg: 60,
      shell: 24,
      rifle: 80,
      energy: 600
    });
    setSurvivors(INITIAL_SURVIVORS.map(s => ({ ...s, isRecruited: false, isDead: false, health: s.maxHealth })));
    setEquippedAbilityId(null);
    setMolotovCount(1);
    setPipeBombCount(1);
    setMineCount(2);
    setFirstAidKitCount(1);
    setLastNightStats(null);
    setAvailableDaylightHours(0);
    setHasUsedDayHours(true);
    setPhase('TITLE');
  };

  const handleStartGame = (mode: 'CAMPAIGN' | 'ENDLESS') => {
    setGameMode(mode);
    setAvailableDaylightHours(0);
    setHasUsedDayHours(true);
    setPhase('NIGHT_COMBAT'); // Start right into the night 1 action like The Last Stand!
  };

  const handleNightComplete = (stats: NightStats) => {
    setLastNightStats(stats);
    // Player survived and won the night! Award exactly 12 daylight hours, usable ONCE:
    setAvailableDaylightHours(12);
    setHasUsedDayHours(false);

    // Apply survivor hunger/thirst degradation between days
    setSurvivors(prev => prev.map(s => {
      if (s.isRecruited && !s.isDead) {
        // Layla passive healing
        const laylaRecruited = prev.some(p => p.id === 'layla' && p.isRecruited && !p.isDead);
        const healBonus = laylaRecruited ? 15 : 0;
        return {
          ...s,
          hunger: Math.max(0, s.hunger - 20),
          thirst: Math.max(0, s.thirst - 25),
          health: Math.min(s.maxHealth, s.health + healBonus)
        };
      }
      return s;
    }));

    if (gameMode === 'CAMPAIGN' && day >= 10) {
      setPhase('VICTORY');
    } else {
      setPhase('NIGHT_SUMMARY');
    }
  };

  const handleContinueToDayHub = () => {
    setDay(prev => prev + 1);
    setPhase('DAY_HUB');
  };

  const handleStartNextNight = () => {
    setPhase('NIGHT_COMBAT');
  };

  return (
    <div 
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Top Bar Contract: Zone 1 (Wordmark) - Zone 2 (4-5 Nav Links) - Zone 3 (1 Primary Action) */}
      <header className="flex items-center justify-between gap-8 px-6 py-3.5 border-b border-slate-800 bg-slate-950/95 sticky top-0 z-40 backdrop-blur-md">
        {/* Zone 1: Single text element wordmark */}
        <div 
          onClick={() => setPhase('TITLE')}
          className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer"
        >
          <span className="text-amber-400">Aisle of the Dead</span>
          <span className="text-slate-600">/</span>
          <span className="text-xs text-slate-400 font-normal">
            {language === 'ar' ? 'سوبرماركت الموتى' : 'The Last Stand'}
          </span>
        </div>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
          <button 
            onClick={() => setPhase('TITLE')} 
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            {language === 'ar' ? 'الرئيسية' : 'Home'}
          </button>
          <button 
            onClick={() => {
              if (phase !== 'TITLE' && phase !== 'NIGHT_COMBAT') {
                setPhase('DAY_HUB');
              }
            }} 
            disabled={phase === 'NIGHT_COMBAT'}
            className={`transition-colors whitespace-nowrap shrink-0 ${phase === 'NIGHT_COMBAT' ? 'text-slate-600 cursor-not-allowed opacity-50' : 'hover:text-white'}`}
            title={phase === 'NIGHT_COMBAT' ? (language === 'ar' ? 'المتجر متاح بالنهار فقط بعد الفوز بالليلة' : 'Store open in daytime only after night defense') : ''}
          >
            {language === 'ar' ? 'المتجر والورشة' : 'Store & Workshop'}
          </button>
          <button 
            onClick={() => {
              const nextMuted = !isMuted;
              setIsMuted(nextMuted);
              audio.setMuted(nextMuted);
            }} 
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{isMuted ? (language === 'ar' ? 'تشغيل الصوت' : 'Unmute') : (language === 'ar' ? 'كتم الصوت' : 'Mute')}</span>
          </button>
          <button 
            onClick={handleRestart} 
            className="hover:text-red-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 text-slate-500"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{language === 'ar' ? 'إعادة اللعبة' : 'Reset'}</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsInstallModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 rounded-lg hover:brightness-110 shadow-md shadow-amber-500/20 transition-all whitespace-nowrap shrink-0"
            title={language === 'ar' ? 'تحميل وتثبيت اللعبة على هاتفك أو حاسوبك' : 'Download and install game'}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'تحميل اللعبة 📲' : 'Install Game 📲'}</span>
          </button>

          <button
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'ar' ? 'English' : 'العربية'}</span>
          </button>
        </div>
      </header>

      {/* Main Game Surface */}
      <main className="flex-1 w-full max-w-6xl mx-auto p-4 sm:p-6 flex flex-col justify-center">
        {phase === 'TITLE' && (
          <TitleScreen
            onStartGame={handleStartGame}
            language={language}
            setLanguage={setLanguage}
          />
        )}

        {phase === 'NIGHT_COMBAT' && (
          <CombatCanvas
            day={day}
            playerHealth={playerHealth}
            maxPlayerHealth={maxPlayerHealth}
            setPlayerHealth={setPlayerHealth}
            activeWeapon={activeWeapon}
            secondaryWeapon={secondaryWeapon}
            setActiveWeapon={setActiveWeapon}
            setSecondaryWeapon={setSecondaryWeapon}
            allWeapons={allWeapons}
            setAllWeapons={setAllWeapons}
            equippedAbilityId={equippedAbilityId}
            setEquippedAbilityId={setEquippedAbilityId}
            barricade={barricade}
            setBarricade={setBarricade}
            resources={resources}
            setResources={setResources}
            ammoStock={ammoStock}
            setAmmoStock={setAmmoStock}
            survivors={survivors}
            setSurvivors={setSurvivors}
            molotovCount={molotovCount}
            setMolotovCount={setMolotovCount}
            pipeBombCount={pipeBombCount}
            setPipeBombCount={setPipeBombCount}
            mineCount={mineCount}
            setMineCount={setMineCount}
            onNightComplete={handleNightComplete}
            onGameOver={() => setPhase('GAME_OVER')}
            language={language}
          />
        )}

        {phase === 'DAY_HUB' && (
          <DaytimeHub
            day={day}
            playerHealth={playerHealth}
            maxPlayerHealth={maxPlayerHealth}
            setPlayerHealth={setPlayerHealth}
            activeWeapon={activeWeapon}
            setActiveWeapon={setActiveWeapon}
            secondaryWeapon={secondaryWeapon}
            setSecondaryWeapon={setSecondaryWeapon}
            allWeapons={allWeapons}
            setAllWeapons={setAllWeapons}
            barricade={barricade}
            setBarricade={setBarricade}
            resources={resources}
            setResources={setResources}
            ammoStock={ammoStock}
            setAmmoStock={setAmmoStock}
            survivors={survivors}
            setSurvivors={setSurvivors}
            molotovCount={molotovCount}
            setMolotovCount={setMolotovCount}
            pipeBombCount={pipeBombCount}
            setPipeBombCount={setPipeBombCount}
            mineCount={mineCount}
            setMineCount={setMineCount}
            firstAidKitCount={firstAidKitCount}
            setFirstAidKitCount={setFirstAidKitCount}
            equippedAbilityId={equippedAbilityId}
            setEquippedAbilityId={setEquippedAbilityId}
            availableDaylightHours={availableDaylightHours}
            setAvailableDaylightHours={setAvailableDaylightHours}
            hasUsedDayHours={hasUsedDayHours}
            setHasUsedDayHours={setHasUsedDayHours}
            onStartNight={handleStartNextNight}
            language={language}
          />
        )}

        {/* Modal: Night Summary */}
        {phase === 'NIGHT_SUMMARY' && lastNightStats && (
          <NightSummaryModal
            stats={lastNightStats}
            survivors={survivors}
            activeWeapon={activeWeapon}
            secondaryWeapon={secondaryWeapon}
            allWeapons={allWeapons}
            ammoStock={ammoStock}
            onContinue={handleContinueToDayHub}
            language={language}
          />
        )}

        {/* Modal: Game Over */}
        {phase === 'GAME_OVER' && (
          <GameOverModal
            day={day}
            onRestart={handleRestart}
            language={language}
          />
        )}

        {/* Modal: Campaign Victory */}
        {phase === 'VICTORY' && (
          <VictoryModal
            survivors={survivors}
            onRestart={handleRestart}
            language={language}
          />
        )}

        {/* Modal: Download & Install Guide */}
        <InstallModal
          isOpen={isInstallModalOpen}
          onClose={() => setIsInstallModalOpen(false)}
          deferredPrompt={deferredPrompt}
          language={language}
        />
      </main>

      {/* Subtle Footer */}
      <footer className="border-t border-slate-900 py-3 px-6 text-center text-xs text-slate-500 font-mono">
        <span>Aisle of the Dead: Supermarket Stand · 2D Flash-Inspired Barricade Defense & Crafting System</span>
      </footer>
    </div>
  );
}
