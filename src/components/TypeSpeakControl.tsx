import React, { useState, useEffect, useRef } from 'react';
import { SupportedLanguage } from '../types';
import { LANGUAGE_OPTIONS } from '../translations';
import { Keyboard, Mic, MicOff, Check, AlertCircle, Sparkles } from 'lucide-react';

interface TypeSpeakControlProps {
  id: string;
  label: string;
  helperText?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  language: SupportedLanguage;
  isTextarea?: boolean;
  rows?: number;
  required?: boolean;
  errorMessage?: string | null;
  extraHeaderAction?: React.ReactNode;
}

export const TypeSpeakControl: React.FC<TypeSpeakControlProps> = ({
  id,
  label,
  helperText,
  value,
  onChange,
  placeholder,
  language,
  isTextarea = false,
  rows = 3,
  required = false,
  errorMessage,
  extraHeaderAction,
}) => {
  const [mode, setMode] = useState<'type' | 'speak'>('type');
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [interimText, setInterimText] = useState('');
  const recognitionRef = useRef<any>(null);

  const langConfig = LANGUAGE_OPTIONS.find((l) => l.id === language) || LANGUAGE_OPTIONS[0];
  const speechLangCode = langConfig.speechCode;

  // Localized Mode Labels
  const labels: Record<SupportedLanguage, { type: string; speak: string; listening: string; stop: string; speakHint: string }> = {
    en: {
      type: 'Type',
      speak: 'Speak',
      listening: `Listening in English (${speechLangCode})... Speak clearly`,
      stop: 'Done / Stop',
      speakHint: 'Speak into your phone/mic to automatically fill this field.',
    },
    hi: {
      type: 'लिखें (Type)',
      speak: 'बोलें (Speak)',
      listening: `हिन्दी (${speechLangCode}) में सुन रहे हैं... बोलिए`,
      stop: 'हो गया / बंद करें',
      speakHint: 'बोलकर भरें, आपका बोला हुआ शब्द यहाँ लिखा जाएगा।',
    },
    kn: {
      type: 'ಟೈಪ್ ಮಾಡಿ (Type)',
      speak: 'ಮಾತನಾಡಿ (Speak)',
      listening: `ಕನ್ನಡದಲ್ಲಿ (${speechLangCode}) ಆಲಿಸಲಾಗುತ್ತಿದೆ... ಮಾತನಾಡಿ`,
      stop: 'ಮುಗಿಯಿತು / ನಿಲ್ಲಿಸಿ',
      speakHint: 'ಮೈಕ್ರೊಫೋನ್ ಬಳಸಿ ಮಾತನಾಡಿ, ನಿಮ್ಮ ಮಾತು ಇಲ್ಲಿ ಟೈಪ್ ಆಗುತ್ತದೆ.',
    },
    ta: {
      type: 'டைப் செய்க (Type)',
      speak: 'பேசுக (Speak)',
      listening: `தமிழில் (${speechLangCode}) கேட்கிறது... பேசுங்கள்`,
      stop: 'முடிந்தது / நிறுத்து',
      speakHint: 'பேசி நிரப்பவும், நீங்கள் பேசும் வார்த்தைகள் இங்கே எழுதப்படும்.',
    },
    te: {
      type: 'టైప్ చేయండి (Type)',
      speak: 'మాట్లాడండి (Speak)',
      listening: `తెలుగులో (${speechLangCode}) వింటున్నాము... మాట్లాడండి`,
      stop: 'పూర్తయింది / ఆపండి',
      speakHint: 'మైక్రోఫోన్‌తో మాట్లాడండి, మీ మాటలు ఇక్కడ రాయబడతాయి.',
    },
  };

  const currentLabel = labels[language] || labels.en;

  const isUserListeningRef = useRef<boolean>(false);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const endReasonRef = useRef<string>('User stopped');
  const valueRef = useRef<string>(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const clearSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  const resetSilenceTimer = () => {
    clearSilenceTimer();
    silenceTimerRef.current = setTimeout(() => {
      console.log(`[SpeechRecognition Ended - ${id}]: Stopped after 9 seconds of continuous silence.`);
      endReasonRef.current = '8-10s silence timeout (9000ms elapsed without speech)';
      const hadSpeech = (valueRef.current || '').trim().length > 0;
      stopListening(false);
      if (!hadSpeech) {
        setSpeechError("Didn't catch that, please try again");
      }
    }, 9000);
  };

  // Setup / Clean Web Speech Recognition
  const stopListening = (userInitiated = true) => {
    isUserListeningRef.current = false;
    clearSilenceTimer();
    endReasonRef.current = userInitiated ? 'User tapped stop' : endReasonRef.current;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }
    setIsListening(false);
    setInterimText('');
  };

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError('Speech recognition is not supported in this browser. You can type directly.');
      setMode('type');
      return;
    }

    try {
      stopListening(false);
      setSpeechError(null);
      isUserListeningRef.current = true;
      endReasonRef.current = 'Active listening';

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = speechLangCode;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
        console.log(`[SpeechRecognition Started - ${id}]: Listening began at ${new Date().toLocaleTimeString()} (lang: ${speechLangCode})`);
        resetSilenceTimer();
      };

      recognition.onresult = (event: any) => {
        resetSilenceTimer();

        let currentInterim = '';
        let finalChunk = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalChunk += event.results[i][0].transcript;
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }

        setInterimText(currentInterim);

        if (finalChunk.trim()) {
          const updated = valueRef.current ? `${valueRef.current.trim()} ${finalChunk.trim()}` : finalChunk.trim();
          valueRef.current = updated;
          onChange(updated);
        }
      };

      recognition.onerror = (event: any) => {
        const errorType = event.error || 'unknown';
        console.error(`[SpeechRecognition Error - ${id}]: Specific error type="${errorType}", Message="${event.message || 'None'}"`);

        if (errorType === 'no-speech') {
          console.log(`[SpeechRecognition - ${id}]: "no-speech" reported by browser. Maintaining active state within silence window...`);
          return;
        }

        if (errorType === 'not-allowed' || errorType === 'service-not-allowed') {
          endReasonRef.current = `Permission denied (${errorType})`;
          setSpeechError('Microphone permission needed. Please allow microphone access or switch to Type.');
          stopListening(false);
          setMode('type');
        } else if (errorType === 'audio-capture') {
          endReasonRef.current = 'Audio capture failure (audio-capture)';
          setSpeechError('Microphone not available or audio capture failed. You can type directly below.');
          stopListening(false);
          setMode('type');
        } else if (errorType === 'aborted') {
          endReasonRef.current = 'Session aborted (aborted)';
          if (!isUserListeningRef.current) {
            stopListening(false);
          }
        } else {
          endReasonRef.current = `Error: ${errorType}`;
          setSpeechError("Didn't catch that, please try speaking again or switch to Type mode.");
          stopListening(false);
        }
      };

      recognition.onend = () => {
        console.log(`[SpeechRecognition Ended - ${id}]: Stopped at ${new Date().toLocaleTimeString()}. Reason: ${endReasonRef.current}`);

        if (isUserListeningRef.current) {
          console.log(`[SpeechRecognition - ${id}]: Continuing recognition stream...`);
          try {
            recognition.start();
          } catch (restartErr) {
            console.warn(`[SpeechRecognition - ${id}]: Reconnect attempt failed:`, restartErr);
            setIsListening(false);
            if (!valueRef.current.trim()) {
              setSpeechError("Didn't catch that, please try again");
            }
          }
        } else {
          setIsListening(false);
          setInterimText('');
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error(`Failed to start speech recognition on ${id}:`, err);
      setSpeechError("Didn't catch that, please try again");
      setIsListening(false);
    }
  };

  const handleSelectMode = (newMode: 'type' | 'speak') => {
    setMode(newMode);
    if (newMode === 'speak') {
      startListening();
    } else {
      stopListening(true);
    }
  };

  useEffect(() => {
    return () => {
      isUserListeningRef.current = false;
      clearSilenceTimer();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
    };
  }, []);

  return (
    <div className="space-y-1.5" id={`control-group-${id}`}>
      {/* Field Header: Label & Type/Speak Toggles */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <label htmlFor={id} className="block text-sm sm:text-base font-bold text-[#2A221E]">
            {label} {required && <span className="text-[#C2542D]">*</span>}
          </label>
          {helperText && <p className="text-xs text-[#6A5D54]">{helperText}</p>}
        </div>

        {/* TOGGLE BUTTONS: "Type" vs "Speak" */}
        <div className="flex items-center gap-2">
          {extraHeaderAction}

          <div className="inline-flex rounded-xl p-0.5 bg-[#EFE7DA] border border-[#D5C7B8] shadow-2xs">
            <button
              type="button"
              id={`${id}-toggle-type-btn`}
              onClick={() => handleSelectMode('type')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                mode === 'type'
                  ? 'bg-white text-[#2A221E] shadow-xs'
                  : 'text-[#6A5D54] hover:text-[#2A221E]'
              }`}
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>{currentLabel.type}</span>
            </button>

            <button
              type="button"
              id={`${id}-toggle-speak-btn`}
              onClick={() => handleSelectMode('speak')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                mode === 'speak'
                  ? 'bg-[#C2542D] text-white shadow-xs'
                  : 'text-[#6A5D54] hover:text-[#C2542D]'
              }`}
            >
              <Mic className={`w-3.5 h-3.5 ${isListening ? 'animate-pulse' : ''}`} />
              <span>{currentLabel.speak}</span>
            </button>
          </div>
        </div>
      </div>

      {/* SPEAK MODE ACTIVE BANNER */}
      {mode === 'speak' && (
        <div className="p-3 rounded-xl bg-[#FBEEE8] border border-[#EACEC1] flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              isListening ? 'bg-[#C2542D] text-white animate-pulse' : 'bg-white text-[#C2542D]'
            }`}>
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-[#2A221E]">
                {isListening ? currentLabel.listening : currentLabel.speakHint}
              </p>
              {interimText && (
                <p className="text-xs italic text-[#C2542D] font-medium truncate max-w-xs sm:max-w-md">
                  "{interimText}"
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {isListening ? (
              <button
                type="button"
                onClick={stopListening}
                className="px-2.5 py-1 rounded-lg bg-[#C2542D] text-white text-xs font-bold hover:bg-[#A13D19] transition-colors cursor-pointer"
              >
                {currentLabel.stop}
              </button>
            ) : (
              <button
                type="button"
                onClick={startListening}
                className="px-2.5 py-1 rounded-lg bg-white border border-[#C2542D] text-[#C2542D] text-xs font-bold hover:bg-[#FAF6F0] transition-colors cursor-pointer"
              >
                {currentLabel.speak}
              </button>
            )}
          </div>
        </div>
      )}

      {/* SPEECH ERROR NOTICE */}
      {speechError && (
        <div className="p-2.5 rounded-xl bg-[#FDF5EA] border border-[#EED7B8] text-xs text-[#734A1B] flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-[#D9822B] shrink-0 mt-0.5" />
          <span>{speechError}</span>
        </div>
      )}

      {/* INPUT FIELD (ALWAYS EDITABLE, POPULATED BY SPEECH OR TYPING) */}
      <div className="relative">
        {isTextarea ? (
          <textarea
            id={id}
            rows={rows}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full px-4 py-3 rounded-xl border text-base text-[#2A221E] outline-none transition-all bg-white placeholder:text-[#9F9185] ${
              errorMessage
                ? 'border-[#C2542D] ring-1 ring-[#C2542D] focus:ring-2 focus:ring-[#FBEEE8]'
                : 'border-[#D5C7B8] focus:border-[#C2542D] focus:ring-2 focus:ring-[#FBEEE8]'
            }`}
          />
        ) : (
          <input
            id={id}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full px-4 py-3 rounded-xl border text-base text-[#2A221E] outline-none transition-all bg-white placeholder:text-[#9F9185] ${
              errorMessage
                ? 'border-[#C2542D] ring-1 ring-[#C2542D] focus:ring-2 focus:ring-[#FBEEE8]'
                : 'border-[#D5C7B8] focus:border-[#C2542D] focus:ring-2 focus:ring-[#FBEEE8]'
            }`}
          />
        )}
      </div>

      {/* INLINE VALIDATION ERROR MESSAGE */}
      {errorMessage && (
        <p id={`${id}-inline-error`} className="text-xs font-semibold text-[#C2542D] flex items-center gap-1.5 mt-1 animate-fadeIn">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </p>
      )}
    </div>
  );
};
