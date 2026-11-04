import React from 'react';
import { Language, Survivor } from '../types/game';
import { Trophy, CheckCircle2, RotateCcw, Shield } from 'lucide-react';

interface VictoryModalProps {
  survivors: Survivor[];
  onRestart: () => void;
  language: Language;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  survivors,
  onRestart,
  language
}) => {
  const aliveSurvivors = survivors.filter(s => s.isRecruited && !s.isDead);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="bg-slate-900 border border-amber-500/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl flex flex-col items-center text-center gap-5 text-slate-100">
        <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-400">
          <Trophy className="w-8 h-8 animate-pulse" />
        </div>

        <div>
          <span className="text-xs font-mono uppercase text-amber-400 font-bold tracking-widest">
            {language === 'ar' ? 'اليوم العاشر: إخلاء السطح' : 'DAY 10: EXTRACTION SUCCESS'}
          </span>
          <h2 className="text-3xl font-black text-white mt-1">
            {language === 'ar' ? 'وصلت مروحية الحرس الوطني!' : 'Rooftop Evacuation Secured!'}
          </h2>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            {language === 'ar'
              ? 'هبطت مروحية الإنقاذ على سطح السوبرماركت وتم إجلاؤك أنت وفريقك سالمين وسط ألسنة اللهب. لقد نجوت من أشرس كارثة موتى أحياء!'
              : 'The National Guard Black Hawk landed on the supermarket rooftop. You and your defenders boarded safely amid the burning aisles. You survived the supermarket outbreak!'}
          </p>
        </div>

        {/* Rescued team list */}
        <div className="w-full bg-slate-800/80 border border-slate-700 p-4 rounded-xl text-start">
          <span className="text-xs text-slate-400 font-bold block mb-2">
            {language === 'ar' ? 'الأبطال الناجون الذين تم إجلاؤهم:' : 'Evacuated Defenders:'}
          </span>
          <div className="space-y-1.5 text-xs text-slate-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'ar' ? 'أنت (قائد الدفاع والصناعة)' : 'You (Defense Commander)'}</span>
            </div>
            {aliveSurvivors.map(s => (
              <div key={s.id} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'ar' ? `${s.nameAr} (${s.roleAr})` : `${s.name} (${s.role})`}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onRestart}
          className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{language === 'ar' ? 'خوض التحدي مجدداً' : 'Play Again'}</span>
        </button>
      </div>
    </div>
  );
};
