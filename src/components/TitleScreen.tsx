import React from 'react';
import { Language } from '../types/game';
import { Shield, Crosshair, Wrench, Hammer, Play, Globe } from 'lucide-react';
import supermarketCoverImage from '../assets/images/supermarket_game_cover_1793184846233.jpg';

interface TitleScreenProps {
  onStartGame: (mode: 'CAMPAIGN' | 'ENDLESS') => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  language,
  setLanguage
}) => {
  return (
    <div 
      className="relative w-full max-w-5xl mx-auto rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-950 flex flex-col"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Hero Visual Area with Cover Art */}
      <div className="relative w-full aspect-[16/8] sm:aspect-[16/7] overflow-hidden">
        <img
          src={supermarketCoverImage}
          alt="Aisle of the Dead: Supermarket Last Stand"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

        {/* Language switch button in top corner */}
        <div className="absolute top-4 end-4 z-10">
          <button
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur-md border border-slate-700 text-xs text-white font-medium transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'ar' ? 'English' : 'العربية'}</span>
          </button>
        </div>

        {/* Game Title overlay */}
        <div className="absolute bottom-6 inset-x-6 flex flex-col items-start gap-2">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>{language === 'ar' ? 'مستوحاة من أسطورة المتصفح The Last Stand' : 'Inspired by the Flash classic The Last Stand'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
            {language === 'ar' ? 'سوبرماركت الموتى: الوقفة الأخيرة' : 'Aisle of the Dead: Supermarket Stand'}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            {language === 'ar'
              ? 'صمد متاريس عربات التسوق، نظّم ساعات النهار لتمشيط أروقة السوبرماركت، اصنع الأسلحة والمولوتوف، وأنقذ الناجين حتى وصول مروحية الإخلاء على السطح في اليوم العاشر!'
              : 'Defend your shopping cart barricade, allocate daylight hours to scavenge store aisles, craft improvised weapons & Molotovs, and hold until the Day 10 rooftop extraction!'}
          </p>
        </div>
      </div>

      {/* Action Buttons & Game Controls */}
      <div className="p-6 bg-slate-950 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6 border-t border-slate-800">
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => onStartGame('CAMPAIGN')}
            className="w-full sm:w-auto px-8 py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold text-base rounded-xl shadow-lg shadow-red-950/60 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>{language === 'ar' ? 'بدء الحملة (10 أيام صمود)' : 'Start Campaign (10 Days)'}</span>
          </button>

          <button
            onClick={() => onStartGame('ENDLESS')}
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Shield className="w-4 h-4 text-sky-400" />
            <span>{language === 'ar' ? 'طور الصمود اللانهائي' : 'Endless Survival Mode'}</span>
          </button>
        </div>

        {/* Quick Controls Cheat Sheet */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-slate-400 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <div>
            <b className="text-amber-400 block">{language === 'ar' ? '[W / S]' : '[W / S]'}</b>
            <span>{language === 'ar' ? 'تحريك اللاعب' : 'Move along barrier'}</span>
          </div>
          <div>
            <b className="text-amber-400 block">{language === 'ar' ? '[الفأرة]' : '[Mouse]'}</b>
            <span>{language === 'ar' ? 'تصويب + إطلاق' : 'Aim & Fire'}</span>
          </div>
          <div>
            <b className="text-amber-400 block">{language === 'ar' ? '[R]' : '[R]'}</b>
            <span>{language === 'ar' ? 'تلقيم السلاح' : 'Reload Weapon'}</span>
          </div>
          <div>
            <b className="text-amber-400 block">{language === 'ar' ? '[G / T]' : '[G / T]'}</b>
            <span>{language === 'ar' ? 'مولوتوف / قنبلة' : 'Molotov / Pipe Bomb'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
