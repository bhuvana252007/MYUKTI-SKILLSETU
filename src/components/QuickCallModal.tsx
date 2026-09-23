import React, { useState, useEffect, useRef } from 'react';
import { SellerListing, SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../translations';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Grid3X3, 
  MessageSquare, 
  CheckCircle, 
  ShieldCheck, 
  Sparkles,
  X
} from 'lucide-react';

interface QuickCallModalProps {
  seller: SellerListing;
  language: SupportedLanguage;
  isOpen: boolean;
  onClose: () => void;
  onOpenWhatsApp?: () => void;
}

export const QuickCallModal: React.FC<QuickCallModalProps> = ({
  seller,
  language,
  isOpen,
  onClose,
  onOpenWhatsApp,
}) => {
  const t = TRANSLATIONS[language];
  const [callState, setCallState] = useState<'ringing' | 'connected' | 'ended'>('ringing');
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [showKeypad, setShowKeypad] = useState(false);
  const [pressedKeys, setPressedKeys] = useState<string>('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Formatted phone number
  const phoneNumber = seller.phone || '+91 98765 43210';

  // Simulated seller audio/voice lines in multiple languages
  const spokenGreetingByLang: Record<SupportedLanguage, string> = {
    en: `Hello! Thank you for calling ${seller.name} via SkillSetu. Yes, I provide ${seller.category} services in ${seller.location}. How can I assist you today?`,
    hi: `नमस्ते! SkillSetu के माध्यम से ${seller.name} को कॉल करने के लिए धन्यवाद। जी हाँ, मैं ${seller.location} में ${seller.category} की सेवा देती हूँ। बताइये मैं आपकी क्या मदद करूँ?`,
    kn: `ನಮಸ್ಕಾರ! SkillSetu ಮೂಲಕ ${seller.name} ಅವರಿಗೆ ಕರೆ ಮಾಡಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು. ಹೌದು, ನಾನು ${seller.location} ನಲ್ಲಿ ${seller.category} ಕೆಲಸ ಮಾಡುತ್ತೇನೆ. ನಿಮಗೆ ಏನು ಬೇಕು ತಿಳಿಸಿ?`,
    ta: `வணக்கம்! SkillSetu வழியாக ${seller.name} அவர்களை அழைத்ததற்கு நன்றி. ஆம், நான் ${seller.location} பகுதியில் ${seller.category} சேவை வழங்குகிறேன். என்ன தேவை?`,
    te: `నమస్కారం! SkillSetu ద్వారా ${seller.name} గారికి కాల్ చేసినందుకు ధన్యవాదాలు. అవును, నేను ${seller.location} లో ${seller.category} సేవలు అందిస్తున్నాను. వివరాలు చెప్పండి?`,
  };

  const currentGreeting = spokenGreetingByLang[language] || spokenGreetingByLang.en;

  // Speak greeting using Web SpeechSynthesis if supported
  const playSimulatedVoice = () => {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(currentGreeting);
        utterance.rate = 0.95;
        utterance.pitch = 1.05;
        // set matching language voice if available
        if (language === 'hi') utterance.lang = 'hi-IN';
        else if (language === 'kn') utterance.lang = 'kn-IN';
        else if (language === 'ta') utterance.lang = 'ta-IN';
        else if (language === 'te') utterance.lang = 'te-IN';
        else utterance.lang = 'en-IN';

        utterance.onstart = () => setIsPlayingAudio(true);
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);

        window.speechSynthesis.speak(utterance);
      } catch (_) {
        setIsPlayingAudio(false);
      }
    }
  };

  // Reset and start call when modal opens
  useEffect(() => {
    if (!isOpen) {
      setCallState('ringing');
      setDurationSeconds(0);
      setIsMuted(false);
      setShowKeypad(false);
      setPressedKeys('');
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    // Start ringing, then automatically connect after 2.2 seconds
    setCallState('ringing');
    setDurationSeconds(0);

    const connectTimeout = setTimeout(() => {
      setCallState('connected');
      playSimulatedVoice();
    }, 2200);

    return () => {
      clearTimeout(connectTimeout);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isOpen]);

  // Handle call timer when connected
  useEffect(() => {
    if (callState === 'connected') {
      timerRef.current = setInterval(() => {
        setDurationSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callState]);

  if (!isOpen) return null;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallState('ended');
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleKeyPress = (num: string) => {
    setPressedKeys((prev) => (prev + num).slice(-8));
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="quick-call-simulated-screen"
        className="relative w-full max-w-sm rounded-[2.5rem] overflow-hidden bg-[#1A1412] text-[#FAF5EB] shadow-2xl border-4 border-[#3D2B1F] flex flex-col justify-between min-h-[580px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Phone Notch Bar */}
        <div className="pt-3 px-6 flex items-center justify-between text-[11px] text-[#A8988B] font-medium select-none">
          <span>SkillSetu Mobile</span>
          <div className="w-16 h-3.5 bg-black rounded-full mx-auto"></div>
          <span>SIM 1 • HD</span>
        </div>

        {/* Top Info & Caller Profile */}
        <div className="pt-6 pb-4 px-6 text-center flex flex-col items-center">
          {/* Avatar with pulsing rings */}
          <div className="relative mb-5">
            {callState === 'ringing' && (
              <>
                <span className="absolute -inset-3 rounded-full bg-[#1E4D38]/30 animate-ping"></span>
                <span className="absolute -inset-1 rounded-full bg-[#D49B24]/40 animate-pulse"></span>
              </>
            )}
            {callState === 'connected' && (
              <span className="absolute -inset-2 rounded-full bg-[#1E4D38]/40 animate-pulse"></span>
            )}
            <img
              src={seller.photo}
              alt={seller.name}
              className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-[#FAF5EB] shadow-xl"
              referrerPolicy="no-referrer"
            />
            {seller.isShgVerified && (
              <div className="absolute bottom-0 right-0 bg-[#1E4D38] text-white p-1.5 rounded-full border-2 border-[#1A1412] shadow-sm" title="SHG Verified">
                <CheckCircle className="w-4 h-4 fill-[#1E4D38] text-white" />
              </div>
            )}
          </div>

          {/* Caller Name & Skill */}
          <h2 className="text-2xl font-bold font-heritage text-white tracking-wide mb-1">
            {seller.name}
          </h2>
          <p className="text-xs text-[#D49B24] font-semibold uppercase tracking-wider mb-1">
            {t.categories[seller.category]?.title || seller.category} • {seller.location}
          </p>
          <p className="text-xs text-[#A8988B] font-mono mb-3">
            {phoneNumber}
          </p>

          {/* Call Status Badge */}
          {callState === 'ringing' && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3D2517] text-[#D49B24] text-xs font-bold animate-pulse">
              <Phone className="w-3.5 h-3.5 animate-bounce" />
              <span>Calling... Ringing</span>
            </div>
          )}

          {callState === 'connected' && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#143526] text-[#69D89E] text-xs font-bold font-mono">
              <span className="w-2 h-2 rounded-full bg-[#69D89E] animate-ping"></span>
              <span>Connected • {formatTimer(durationSeconds)}</span>
            </div>
          )}

          {callState === 'ended' && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3D1E16] text-[#E57A54] text-xs font-bold">
              <span>Call Ended • Total time {formatTimer(durationSeconds)}</span>
            </div>
          )}
        </div>

        {/* Middle Area: Interactive Transcript / Keypad */}
        <div className="px-6 py-2 flex-1 flex flex-col justify-center">
          {showKeypad ? (
            <div className="bg-[#241A16] rounded-2xl p-4 border border-[#3D2B1F] animate-fadeIn">
              <div className="text-center font-mono text-lg text-white mb-3 min-h-[1.5rem] tracking-widest">
                {pressedKeys || 'Enter digits'}
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
                  <button
                    key={digit}
                    onClick={() => handleKeyPress(digit)}
                    className="p-2.5 rounded-xl bg-[#2D211C] hover:bg-[#3D2B1F] text-white font-bold text-sm transition-colors active:scale-95 cursor-pointer"
                  >
                    {digit}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            callState === 'connected' && (
              <div className="bg-[#241A16] rounded-2xl p-4 border border-[#3D2B1F] text-left space-y-2 animate-fadeIn shadow-inner">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#D49B24] uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{seller.name} Speaking Live</span>
                  </span>
                  <button
                    onClick={playSimulatedVoice}
                    className="text-xs text-[#FAF5EB] hover:text-[#D49B24] underline cursor-pointer"
                  >
                    Replay Audio
                  </button>
                </div>
                <p className="text-xs text-[#FAF5EB] leading-relaxed italic bg-[#1A1412] p-2.5 rounded-xl border border-[#35251D]">
                  "{currentGreeting}"
                </p>
                <div className="flex items-center gap-1 text-[11px] text-[#A8988B]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1E4D38]" />
                  <span>Simulated direct call powered by SkillSetu</span>
                </div>
              </div>
            )
          )}

          {callState === 'ended' && (
            <div className="bg-[#241A16] rounded-2xl p-5 border border-[#3D2B1F] text-center space-y-3 animate-fadeIn">
              <CheckCircle className="w-8 h-8 text-[#1E4D38] mx-auto" />
              <div>
                <h4 className="text-sm font-bold text-white">Call Finished</h4>
                <p className="text-xs text-[#A8988B] mt-0.5">
                  Would you also like to message {seller.name} on WhatsApp or close the call?
                </p>
              </div>
              <div className="space-y-2 pt-1">
                {onOpenWhatsApp && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenWhatsApp();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat on WhatsApp</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#3D2B1F] hover:bg-[#4D3728] text-[#FAF5EB] font-bold text-xs transition-colors cursor-pointer"
                >
                  Close Call Screen
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Call Action Buttons */}
        <div className="p-6 pt-2">
          {callState !== 'ended' ? (
            <div className="space-y-4">
              {/* Controls Row: Mute, Keypad, Speaker */}
              <div className="grid grid-cols-3 gap-4 text-center">
                {/* Mute Button */}
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all cursor-pointer ${
                    isMuted ? 'bg-[#C2542D] text-white' : 'bg-[#2D211C] text-[#FAF5EB] hover:bg-[#3D2B1F]'
                  }`}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  <span className="text-[11px] font-medium">{isMuted ? 'Muted' : 'Mute'}</span>
                </button>

                {/* Keypad Toggle Button */}
                <button
                  type="button"
                  onClick={() => setShowKeypad(!showKeypad)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all cursor-pointer ${
                    showKeypad ? 'bg-[#D49B24] text-[#1A1412]' : 'bg-[#2D211C] text-[#FAF5EB] hover:bg-[#3D2B1F]'
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                  <span className="text-[11px] font-medium">Keypad</span>
                </button>

                {/* Speaker Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all cursor-pointer ${
                    isSpeakerOn ? 'bg-[#1E4D38] text-white' : 'bg-[#2D211C] text-[#FAF5EB] hover:bg-[#3D2B1F]'
                  }`}
                >
                  {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  <span className="text-[11px] font-medium">{isSpeakerOn ? 'Speaker' : 'Earpiece'}</span>
                </button>
              </div>

              {/* End Call Button */}
              <div className="flex justify-center pt-2">
                <button
                  id="end-quick-call-btn"
                  onClick={handleEndCall}
                  className="w-16 h-16 rounded-full bg-[#C2542D] hover:bg-[#A13D19] text-white flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer"
                  title="End Call"
                >
                  <PhoneOff className="w-7 h-7" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center pb-2">
              <button
                onClick={onClose}
                className="text-xs text-[#A8988B] hover:text-white underline cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
