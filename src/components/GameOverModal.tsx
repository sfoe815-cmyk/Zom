import React from 'react';
import { Language } from '../types/game';
import { AlertOctagon, RotateCcw } from 'lucide-react';

interface GameOverModalProps {
  day: number;
  onRestart: () => void;
  language: Language;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  day,
  onRestart,
  language
}) => {
  return (
    <div 
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="bg-slate-900 border border-red-700/80 rounded-2xl max-w-md w-full p-6 shadow-2xl flex flex-col items-center text-center gap-5 text-slate-100">
        <div className="w-16 h-16 rounded-full bg-red-950/60 border border-red-600 flex items-center justify-center text-red-500 animate-bounce">
          <AlertOctagon className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-mono uppercase text-red-400 font-bold tracking-widest">
            {language === 'ar' ? 'سقوط خط الدفاع' : 'DEFENSE OVERRUN'}
          </span>
          <h2 className="text-2xl font-black text-white mt-1">
            {language === 'ar' ? 'اجتاح الموتى السوبرماركت!' : 'The Supermarket Has Fallen!'}
          </h2>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            {language === 'ar'
              ? `تم اختراق متاريس عربات التسوق وسقط المدافعون في الليلة ${day}. صمودك كان شجاعاً وسط الظلام.`
              : `The shopping cart barricades were breached in Night ${day}. Your stand in the supermarket was heroic.`}
          </p>
        </div>

        <button
          onClick={onRestart}
          className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-red-950/80 flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{language === 'ar' ? 'إعادة المحاولة من الليلة الأولى' : 'Restart from Night 1'}</span>
        </button>
      </div>
    </div>
  );
};
