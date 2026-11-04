import React, { useState } from 'react';
import { Language } from '../types/game';
import { 
  Download, 
  Smartphone, 
  Laptop, 
  Share2, 
  MoreVertical, 
  PlusSquare, 
  CheckCircle2, 
  X, 
  Sparkles,
  Zap,
  Code,
  Copy,
  FileCode,
  QrCode,
  MessageCircle,
  ExternalLink,
  Rocket,
  FolderArchive,
  ArrowRight
} from 'lucide-react';
import { generateStandaloneHtml } from '../utils/exportGameHtml';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
  language: Language;
}

export const InstallModal: React.FC<InstallModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  language
}) => {
  const [activeTab, setActiveTab] = useState<'playstore' | 'share' | 'android' | 'ios' | 'pc' | 'code'>('playstore');
  const [installedSuccess, setInstalledSuccess] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  if (!isOpen) return null;

  // Real Public URL that any friend or tool can open
  const publicShareUrl = typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost')
    ? window.location.origin
    : 'https://ais-pre-oei7z3mjsv7ad34rofvsz4-710555862070.europe-west1.run.app';

  const handleNativeInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstalledSuccess(true);
    }
  };

  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(publicShareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Aisle of the Dead - Supermarket Last Stand',
          text: 'جرب لعبة سوبرماركت الموتى (The Last Stand) مباشرة على هاتفك دون تحميل من المتجر!',
          url: publicShareUrl
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyShareLink();
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `🧟‍♂️ تعال جرب لعبة "سوبرماركت الموتى - Aisle of the Dead"!\nتقدر تلعبها وتثبتها على هاتفك كتطبيق بدون متجر:\n${publicShareUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleDownloadZip = async () => {
    try {
      const response = await fetch('/aisle-of-the-dead-source-code.zip');
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'aisle-of-the-dead-source-code.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        return;
      }
    } catch {
      // fallback
    }
    const link = document.createElement('a');
    link.href = '/aisle-of-the-dead-source-code.zip';
    link.download = 'aisle-of-the-dead-source-code.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadHtml = async () => {
    try {
      const response = await fetch('/Aisle_of_the_Dead_Supermarket_Stand.html');
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Aisle_of_the_Dead_Supermarket_Stand.html';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        return;
      }
    } catch {
      // fallback
    }
    const htmlCode = generateStandaloneHtml();
    const blob = new Blob([htmlCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Aisle_of_the_Dead_Supermarket_Stand.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyHtml = async () => {
    try {
      const response = await fetch('/Aisle_of_the_Dead_Supermarket_Stand.html');
      if (response.ok) {
        const text = await response.text();
        await navigator.clipboard.writeText(text);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 3000);
        return;
      }
    } catch {
      // fallback
    }
    const htmlCode = generateStandaloneHtml();
    try {
      await navigator.clipboard.writeText(htmlCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 3000);
    } catch {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 3000);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Rocket className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>{language === 'ar' ? 'نشر اللعبة على Google Play وتثبيتها' : 'Publish to Google Play & Install'}</span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-mono">
                  Google Play & PWA
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'ar' 
                  ? 'طريقة نشر اللعبة على متجر جوجل بلاي، تحميل السورس كود الكامل ZIP، أو تثبيتها فوراً!'
                  : 'How to publish to Google Play Store, download full source code ZIP, or install as app!'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Fast Install Banner */}
        {deferredPrompt && !installedSuccess && (
          <div className="mx-5 mt-4 p-3.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-transparent border border-amber-500/40 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0 animate-bounce" />
              <div>
                <p className="font-bold text-amber-200 text-xs sm:text-sm">
                  {language === 'ar' ? 'جهازك يدعم التثبيت الفوري بنقرة واحدة!' : 'Instant 1-Click Install Available!'}
                </p>
                <p className="text-[11px] text-slate-300">
                  {language === 'ar' ? 'اضغط لتثبيت اللعبة فوراً كأيقونة على هاتفك' : 'Click to install directly to home screen'}
                </p>
              </div>
            </div>
            <button
              onClick={handleNativeInstall}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-lg transition-all shadow-lg shadow-amber-500/30 flex items-center gap-1.5 shrink-0"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>{language === 'ar' ? 'تثبيت الآن' : 'Install Now'}</span>
            </button>
          </div>
        )}

        {installedSuccess && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/60 flex items-center gap-3 text-emerald-200 text-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{language === 'ar' ? '✓ تم تثبيت اللعبة بنجاح! يمكنك الآن فتحها من شاشة هاتفك الرئيسية كأي تطبيق!' : 'Game installed successfully!'}</span>
          </div>
        )}

        {/* Device & Share Tabs */}
        <div className="flex border-b border-slate-800 px-5 pt-3 gap-1 sm:gap-2 bg-slate-950/40 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('playstore')}
            className={`flex items-center gap-1.5 px-3 py-2 font-bold rounded-t-lg transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'playstore'
                ? 'border-amber-400 text-amber-400 bg-slate-800/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Rocket className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'ar' ? '🚀 النشر على Google Play' : 'Google Play & ZIP'}</span>
          </button>

          <button
            onClick={() => setActiveTab('share')}
            className={`flex items-center gap-1.5 px-3 py-2 font-bold rounded-t-lg transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'share'
                ? 'border-amber-400 text-amber-400 bg-slate-800/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 text-sky-400" />
            <span>{language === 'ar' ? '📲 مشاركة الرابط للهواتف' : 'Share for Mobile'}</span>
          </button>

          <button
            onClick={() => setActiveTab('android')}
            className={`flex items-center gap-1.5 px-3 py-2 font-bold rounded-t-lg transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'android'
                ? 'border-amber-400 text-amber-400 bg-slate-800/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'ar' ? 'أندرويد (Chrome)' : 'Android'}</span>
          </button>

          <button
            onClick={() => setActiveTab('ios')}
            className={`flex items-center gap-1.5 px-3 py-2 font-bold rounded-t-lg transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'ios'
                ? 'border-amber-400 text-amber-400 bg-slate-800/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-pink-400" />
            <span>{language === 'ar' ? 'آيفون (Safari)' : 'iPhone'}</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-3 py-2 font-bold rounded-t-lg transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'code'
                ? 'border-amber-400 text-amber-400 bg-slate-800/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-indigo-400" />
            <span>{language === 'ar' ? 'ملف HTML مدمج' : 'Single HTML'}</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-slate-200 text-sm">
          {/* TAB: GOOGLE PLAY STORE & SOURCE CODE ZIP */}
          {activeTab === 'playstore' && (
            <div className="space-y-4">
              {/* Highlight Box */}
              <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-amber-950/40 border border-emerald-500/50 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-1.5">
                  <Rocket className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-white font-bold text-sm">
                    {language === 'ar' ? 'كيف تنشر هذه اللعبة على متجر Google Play بدقة؟' : 'How to Publish to Google Play Store'}
                  </h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {language === 'ar'
                    ? 'الألعاب المصممة بتقنية PWA تُقبل رسمياً على متجر Google Play عبر نظام Trusted Web Activity (TWA) وتتحول إلى ملف .aab أو .apk في دقائق معدودة!'
                    : 'PWA games are fully accepted on Google Play via Trusted Web Activity (TWA) and can be bundled into .aab in minutes!'}
                </p>
              </div>

              {/* Download Full Source Code ZIP */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <FolderArchive className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs sm:text-sm">
                      {language === 'ar' ? 'كود المشروع الكامل بملف مضغوط (Source Code ZIP)' : 'Complete Project Source Code (.zip)'}
                    </h5>
                    <p className="text-[11px] text-slate-400">
                      {language === 'ar'
                        ? 'يحتوي على كافة ملفات اللعبة (src, components, data, sound, icons, vite) بحجم ~2 ميجابايت.'
                        : 'Contains all source files (src, assets, data, canvas, package.json).'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleDownloadZip}
                  className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 shrink-0 transition-transform active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>{language === 'ar' ? 'تنزيل سورس كود اللعبة ZIP' : 'Download Source ZIP'}</span>
                </button>
              </div>

              {/* Method 1: Official PWABuilder (2 Minutes) */}
              <div className="border border-slate-700/80 rounded-xl p-4 bg-slate-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs">
                    {language === 'ar' ? 'الطريقة 1 (الأسهل والأسرع - أداة مايكروسوفت وجوجل الرسمية)' : 'Method 1 (Official & Fastest)'}
                  </span>
                  <a
                    href="https://www.pwabuilder.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-bold"
                  >
                    <span>فتح موقع PWABuilder</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                  <div className="flex items-start gap-2">
                    <span className="font-mono font-bold text-amber-400">1.</span>
                    <p>
                      {language === 'ar'
                        ? 'ادخل إلى موقع www.pwabuilder.com وضع رابط اللعبة المباشر:'
                        : 'Open www.pwabuilder.com and paste the live game URL:'}
                    </p>
                  </div>
                  <div className="p-2 bg-black/60 rounded border border-slate-800 font-mono text-[11px] text-amber-300 flex items-center justify-between select-all">
                    <span>{publicShareUrl}</span>
                    <button
                      onClick={handleCopyShareLink}
                      className="text-slate-400 hover:text-white ms-2 text-[10px] px-2 py-0.5 rounded bg-slate-800"
                    >
                      {copiedLink ? '✓ تم' : 'نسخ'}
                    </button>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="font-mono font-bold text-amber-400">2.</span>
                    <p>
                      {language === 'ar'
                        ? 'اضغط "Start". ستجد أن اللعبة جاهزة وحاصلة على تقييم كامل لأننا أضفنا لها الـ Manifest والأيقونات والـ Service Worker.'
                        : 'Click "Start". PWABuilder verifies manifest, icons, and service worker.'}
                    </p>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="font-mono font-bold text-amber-400">3.</span>
                    <p>
                      {language === 'ar'
                        ? 'اضغط على زر "Generate Android Package" -> سيقوم بإنشاء ملف .aab (حزمة أندرويد الرسمية) وملف .apk جاهز للرفع على Google Play Console مباشرة!'
                        : 'Click "Generate Android Package" to get the signed .aab ready for Google Play Console!'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Method 2: Android Studio & Capacitor */}
              <div className="border border-slate-700/80 rounded-xl p-4 bg-slate-800/40 space-y-2 text-xs">
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-bold text-[11px]">
                  {language === 'ar' ? 'الطريقة 2 (للمطورين عبر Android Studio)' : 'Method 2 (For Developers via Android Studio)'}
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {language === 'ar'
                    ? 'بعد تنزيل ملف ZIP أعلاه، يمكنك فك الضغط وتشغيل أوامر Capacitor لإنشاء مشروع Android أصلي:'
                    : 'Extract the ZIP above, install dependencies, and wrap using Capacitor:'}
                </p>
                <div className="p-2.5 bg-black/70 rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-400 space-y-1 dir-ltr text-left">
                  <div>npm install</div>
                  <div>npm run build</div>
                  <div>npx cap init "Aisle of the Dead" com.game.aisleofthedead</div>
                  <div>npm install @capacitor/android && npx cap add android</div>
                  <div>npx cap open android</div>
                </div>
                <p className="text-[11px] text-slate-400">
                  {language === 'ar'
                    ? 'سيفتح مشروع اللعبة مباشرة داخل Android Studio ويمكنك استخراج ملف APK أو AAB بضغطة زر (Build -> Generate Signed Bundle / APK).'
                    : 'Opens in Android Studio where you can export Signed APK/Bundle.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: SHARE & QR CODE FOR PHONES */}
          {activeTab === 'share' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-950 border border-amber-500/40 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h4 className="text-white font-bold text-sm">
                    {language === 'ar' ? 'رابط اللعبة المباشر لتجربتها وتثبيتها على الهواتف' : 'Direct Mobile Play & Install Link'}
                  </h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {language === 'ar'
                    ? 'شارك هذا الرابط مع أصدقائك، بمجرد فتحه من أي هاتف (أندرويد أو آيفون) يمكنهم اللعب مباشرة وتثبيت اللعبة كتطبيق كامل بضغطة زر!'
                    : 'Share this link. Friends can open it on their phones to play and install directly to their home screens!'}
                </p>
              </div>

              {/* Share URL Box */}
              <div className="bg-slate-950 border border-slate-700/80 rounded-xl p-3 flex flex-col sm:flex-row items-center gap-3">
                <div className="w-full flex-1 overflow-hidden">
                  <div className="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
                    <span>{language === 'ar' ? 'رابط المشاركة المباشر:' : 'Shareable Link:'}</span>
                    <span className="text-emerald-400 text-[10px]">HTTPS • Ready to Install</span>
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={publicShareUrl}
                    className="w-full bg-slate-900 text-amber-300 font-mono text-xs px-3 py-2 rounded-lg border border-slate-800 select-all outline-none"
                  />
                </div>

                <div className="flex w-full sm:w-auto items-center gap-2 shrink-0">
                  <button
                    onClick={handleCopyShareLink}
                    className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-lg border transition-all flex items-center justify-center gap-1.5 ${
                      copiedLink
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                        : 'bg-amber-500 hover:bg-amber-400 border-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                    }`}
                  >
                    {copiedLink ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{language === 'ar' ? 'تم النسخ!' : 'Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>{language === 'ar' ? 'نسخ الرابط' : 'Copy Link'}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleWhatsAppShare}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
                    title={language === 'ar' ? 'إرسال عبر واتساب' : 'Share to WhatsApp'}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">{language === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
                  </button>

                  <button
                    onClick={handleNativeShare}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold border border-slate-700"
                    title={language === 'ar' ? 'مشاركة' : 'Share'}
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* QR Code */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
                <div className="flex flex-col items-center justify-center p-2 bg-white rounded-lg shrink-0 w-32 h-32 mx-auto">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(publicShareUrl)}`}
                    alt="QR Code to play on phone"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="sm:col-span-2 space-y-2 text-xs">
                  <p className="font-bold text-amber-300 flex items-center gap-1.5 text-sm">
                    <QrCode className="w-4 h-4 text-amber-400" />
                    <span>{language === 'ar' ? 'امسح الرمز بكاميرا هاتفك لتفتح فوراً!' : 'Scan QR code with phone camera!'}</span>
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    {language === 'ar'
                      ? '1. افتح كاميرا هاتفك ووجهها نحو رمز الـ QR أعلاه.'
                      : '1. Open phone camera and point at the QR code above.'}
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    {language === 'ar'
                      ? '2. اضغط على الرابط الذي يظهر لفتح اللعبة في المتصفح.'
                      : '2. Tap the link to open the game in your browser.'}
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    {language === 'ar'
                      ? '3. اضغط "تثبيت التطبيق" لتصبح أيقونة لعبة دائمة على هاتفك تعمل بدون نت!'
                      : '3. Tap "Install App" to add an offline icon to your home screen!'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ANDROID CHROME INSTRUCTIONS */}
          {activeTab === 'android' && (
            <div className="space-y-3">
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-200">
                {language === 'ar' 
                  ? '📱 خطوات تثبيت اللعبة على هواتف أندرويد (سامسونج، شاومي، هواوي، ريلمي، جوجل بكسل):'
                  : 'Steps for Android phones (Chrome / Edge / Samsung Internet):'}
              </div>

              <div className="flex items-start gap-3 bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </span>
                <div>
                  <p className="font-semibold text-white">
                    {language === 'ar' ? 'افتح رابط اللعبة في متصفح Google Chrome' : 'Open the link in Google Chrome'}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {language === 'ar' ? 'تأكد من فتح الرابط داخل متصفح Chrome على هاتفك.' : 'Ensure you are browsing via Chrome.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </span>
                <div>
                  <p className="font-semibold text-white flex items-center gap-1.5">
                    <span>{language === 'ar' ? 'اضغط على زر القائمة' : 'Tap the menu'}</span>
                    <MoreVertical className="w-4 h-4 text-amber-400 inline" />
                    <span>{language === 'ar' ? '(ثلاث نقاط أعلى يسار أو يمين الشاشة)' : '(three dots at the top)'}</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {language === 'ar' ? 'أو قد يظهر لك شريط تلقائي أسفل الشاشة مكتوب عليه "تثبيت Aisle of the Dead".' : 'Or tap the banner "Install Aisle of the Dead".'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </span>
                <div>
                  <p className="font-semibold text-white flex items-center gap-1.5">
                    <span>{language === 'ar' ? 'اختر "تثبيت التطبيق" (Install app)' : 'Select "Install App" or "Add to Home screen"'}</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {language === 'ar' 
                      ? 'ستظهر أيقونة اللعبة فوراً بين تطبيقات هاتفك! ستفتح اللعبة بملء الشاشة وبسرعة فائقة ودون الحاجة لاتصال إنترنت.'
                      : 'The game icon appears in your app drawer and opens full screen offline.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: IOS SAFARI INSTRUCTIONS */}
          {activeTab === 'ios' && (
            <div className="space-y-3">
              <div className="p-3 bg-sky-950/40 border border-sky-500/40 rounded-xl text-xs text-sky-200">
                {language === 'ar' 
                  ? '🍏 خطوات تثبيت اللعبة على هواتف آيفون وأجهزة آيباد (iPhone / iPad):'
                  : 'Steps for Apple iPhone & iPad (Safari):'}
              </div>

              <div className="flex items-start gap-3 bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </span>
                <div>
                  <p className="font-semibold text-white">
                    {language === 'ar' ? 'افتح الرابط في متصفح Safari' : 'Open in Apple Safari'}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {language === 'ar' ? 'نظام iOS يدعم التثبيت المباشر عبر متصفح سفاري الرسمي فقط.' : 'iOS requires Safari for home screen apps.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </span>
                <div>
                  <p className="font-semibold text-white flex items-center gap-1.5">
                    <span>{language === 'ar' ? 'اضغط على زر المشاركة' : 'Tap the Share button'}</span>
                    <Share2 className="w-4 h-4 text-sky-400 inline" />
                    <span>{language === 'ar' ? '(أيقونة المربع مع سهم لأعلى أسفل شاشة سفاري)' : '(box with arrow pointing up)'}</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {language === 'ar' ? 'ستفتح نافذة خيارات المشاركة في نظام iOS.' : 'This opens the iOS share sheet.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </span>
                <div>
                  <p className="font-semibold text-white flex items-center gap-1.5">
                    <span>{language === 'ar' ? 'مرر للأسفل واختر' : 'Scroll down and tap'}</span>
                    <PlusSquare className="w-4 h-4 text-emerald-400 inline" />
                    <span>{language === 'ar' ? '"إضافة إلى الصفحة الرئيسية" (Add to Home Screen)' : '"Add to Home Screen"'}</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {language === 'ar' ? 'اضغط "إضافة (Add)" أعلى اليمين، وستصبح اللعبة جاهزة على شاشتك الرئيسية فوراً!' : 'Tap Add on top right.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: STANDALONE SINGLE-FILE HTML */}
          {activeTab === 'code' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-950 border border-amber-500/50 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <FileCode className="w-5 h-5 text-amber-400" />
                  <h4 className="text-white font-bold text-sm">
                    {language === 'ar' ? 'ملف اللعبة المدمج الكامل (HTML + CSS + JavaScript)' : 'Standalone Game File (index.html)'}
                  </h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {language === 'ar'
                    ? 'كود لعبة المعاينة بالكامل مجمع في ملف واحد بصيغة index.html. يمكنك تنزيله كملف أو نسخه مباشرة وفتحه في أي جهاز دون اتصال بالإنترنت!'
                    : 'The complete game packed into a single standalone index.html file.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleDownloadHtml}
                  className="px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-950/50 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Download className="w-4 h-4" />
                  <span>{language === 'ar' ? 'تنزيل ملف index.html للكمبيوتر/الهاتف' : 'Download index.html File'}</span>
                </button>

                <button
                  onClick={handleCopyHtml}
                  className={`px-4 py-3 font-bold text-xs rounded-xl border flex items-center justify-center gap-2 transition-all ${
                    copiedCode
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                      : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-100'
                  }`}
                >
                  {copiedCode ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{language === 'ar' ? '✓ تم نسخ الكود كاملاً إلى الحافظة!' : '✓ Full Code Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>{language === 'ar' ? 'نسخ كود index.html كاملاً' : 'Copy Full index.html Code'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {language === 'ar' ? '💡 يمكنك تحميل السورس كود كاملاً أو نشره على جوجل بلاي في دقائق!' : '💡 Download full source or publish to Google Play in minutes!'}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
          >
            {language === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
