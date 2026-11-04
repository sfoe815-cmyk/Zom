import React, { useEffect, useState } from 'react';
import { NightStats, Language } from '../types/game';
import { Skull, Crosshair, Shield, Sun, Clock } from 'lucide-react';

interface NightSummaryModalProps {
  stats: NightStats;
  survivors?: any;
  activeWeapon?: any;
  secondaryWeapon?: any;
  allWeapons?: any;
  ammoStock?: any;
  onContinue: () => void;
  language: Language;
}

export const NightSummaryModal: React.FC<NightSummaryModalProps> = ({
  stats,
  onContinue,
  language
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(3);
  const onContinueRef = React.useRef(onContinue);
  onContinueRef.current = onContinue;

  // Automatically transition to Daytime Hub after exactly 3 seconds!
  useEffect(() => {
    if (secondsLeft <= 0) {
      onContinueRef.current();
      return;
    }

    const timer = setTimeout(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [secondsLeft]);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="bg-slate-900 border-2 border-amber-500/60 rounded-2xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-5 text-slate-100 relative overflow-hidden">
        {/* Top 3-Second Countdown Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-800">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-1000 ease-linear"
            style={{ width: `${(secondsLeft / 3) * 100}%` }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Sun className="w-6 h-6 animate-spin" style={{ animationDuration: '15s' }} />
            </div>
            <div>
              <span className="text-xs font-mono uppercase text-amber-400 font-bold tracking-wider">
                {language === 'ar' ? `نجاح الدفاع · الليلة ${stats.day}` : `NIGHT ${stats.day} DEFENSE SURVIVED`}
              </span>
              <h2 className="text-xl font-black text-white">
                {language === 'ar' ? 'بزوغ الفجر على السوبرماركت!' : 'Dawn Breaks Over Supermarket!'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono text-amber-300">
            <Clock className="w-3.5 h-3.5 animate-pulse text-amber-400" />
            <span>{secondsLeft}s</span>
          </div>
        </div>

        {/* The Exact 3 Required Stats Cards */}
        <div className="flex flex-col gap-3">
          {/* 1. عدد القتلى (Kills) */}
          <div className="bg-slate-950/80 border border-emerald-500/40 p-4 rounded-xl flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                <Skull className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-medium">
                  {language === 'ar' ? 'عدد قتلى الزومبي:' : 'Zombies Killed:'}
                </span>
                <span className="text-xs text-emerald-400/80 font-mono">
                  {language === 'ar' ? 'تصفية كاملة للموجات' : 'Waves Cleared'}
                </span>
              </div>
            </div>
            <span className="text-2xl font-black font-mono text-emerald-400">
              {stats.zombiesKilled}
            </span>
          </div>

          {/* 2. عدد إصابات الرأس (Headshots) */}
          <div className="bg-slate-950/80 border border-amber-500/40 p-4 rounded-xl flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-950 border border-amber-500/50 flex items-center justify-center text-amber-400">
                <Crosshair className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-medium">
                  {language === 'ar' ? 'إصابات الرأس القاتلة (هيدشوت):' : 'Fatal Headshots:'}
                </span>
                <span className="text-xs text-amber-400/80 font-mono">
                  {language === 'ar' ? 'ضربات رأس قاتلة' : 'Critical Hits'}
                </span>
              </div>
            </div>
            <span className="text-2xl font-black font-mono text-amber-400">
              {stats.headshots}
            </span>
          </div>

          {/* 3. دمج الزومبي للدفاعات (Barricade Damage Taken) */}
          <div className="bg-slate-950/80 border border-red-500/40 p-4 rounded-xl flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-950 border border-red-500/50 flex items-center justify-center text-red-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-medium">
                  {language === 'ar' ? 'ضرر الزومبي للمتاريس (عربات التسوق):' : 'Zombie Damage to Barricade:'}
                </span>
                <span className="text-xs text-red-400/80 font-mono">
                  {language === 'ar' ? 'نقاط صحة مفقودة' : 'Barricade HP Lost'}
                </span>
              </div>
            </div>
            <span className="text-2xl font-black font-mono text-red-400">
              -{stats.barricadeDamageTaken} HP
            </span>
          </div>
        </div>

        {/* Transition notice */}
        <div className="text-center">
          <p className="text-xs text-slate-400">
            {language === 'ar' 
              ? `الانتقال التلقائي إلى ورشة النهار وتوزيع الساعات خلال ${secondsLeft} ثوانٍ...`
              : `Transitioning to Daytime Hours Hub in ${secondsLeft}s...`}
          </p>
        </div>

        {/* Continue Immediately Button */}
        <button
          onClick={onContinue}
          className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
        >
          <span>{language === 'ar' ? 'الانتقال للورشة وتوزيع الساعات الآن' : 'Go to Hours Hub Now'}</span>
        </button>
      </div>
    </div>
  );
};
