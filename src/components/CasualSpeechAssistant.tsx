import React, { useState, useRef, useEffect } from 'react';
import { SupportedLanguage, SkillCategory } from '../types';
import { LANGUAGE_OPTIONS } from '../translations';
import { 
  extractListingFromSpeech, 
  ExtractedListingData,
  fetchExtractionPrompt 
} from '../utils/translationService';
import { 
  Mic, 
  MicOff, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Code2, 
  ArrowDown, 
  RotateCcw, 
  Check, 
  Info,
  X,
  Volume2,
  FileText
} from 'lucide-react';

interface CasualSpeechAssistantProps {
  language: SupportedLanguage;
  onExtracted: (data: ExtractedListingData) => void;
  onScrollToForm?: () => void;
}

interface SpokenSample {
  id: string;
  langTag: string;
  langName: string;
  text: string;
  expectedCategory: SkillCategory;
}

const CONVERSATIONAL_SAMPLES: SpokenSample[] = [
  {
    id: 'kannada-tailoring',
    langTag: 'kn',
    langName: 'Kannada / Kanglish',
    text: 'Nanna hesru Lakshmi, naanu blouse mattu salwar hoLiyodu maaduthini, ondu blouse ge 200 rupees, naanu Malleshwaram alli iddini',
    expectedCategory: 'Tailoring',
  },
  {
    id: 'hindi-cooking',
    langTag: 'hi',
    langName: 'Hindi / Hinglish',
    text: 'मेरा नाम सुमित्रा है, मैं घर पर टिफिन और खाना बनाती हूँ, एक थाली 100 रुपये, राजेन्द्र नगर में रहती हूँ',
    expectedCategory: 'Cooking',
  },
  {
    id: 'english-tutoring',
    langTag: 'en',
    langName: 'English',
    text: 'Hello I am Anita, I teach maths and science to primary school kids for 500 rupees per month, living in Indiranagar',
    expectedCategory: 'Tutoring',
  },
  {
    id: 'tamil-mehendi',
    langTag: 'ta',
    langName: 'Tamil',
    text: 'Vanakkam, en peyar Priya, bridal mehendi design pannuven, oru kai-ku 350 rooba, T Nagar la irukken',
    expectedCategory: 'Mehendi',
  },
  {
    id: 'telugu-tailoring',
    langTag: 'te',
    langName: 'Telugu',
    text: 'Naa peru Parvathi, nenu blouses inka sarees fall pico chesthanu, oka blouse ki 220 rupees, Ameerpet lo untanu',
    expectedCategory: 'Tailoring',
  },
];

export const CasualSpeechAssistant: React.FC<CasualSpeechAssistantProps> = ({
  language,
  onExtracted,
  onScrollToForm,
}) => {
  const langConfig = LANGUAGE_OPTIONS.find((l) => l.id === language) || LANGUAGE_OPTIONS[0];

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [speechError, setSpeechError] = useState<string | null>(null);

  const [isExtracting, setIsExtracting] = useState(false);
  const [lastExtracted, setLastExtracted] = useState<ExtractedListingData | null>(null);
  const [detectedLangName, setDetectedLangName] = useState<string | null>(null);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [cachedPrompt, setCachedPrompt] = useState<string>('');
  const [rawGeminiResponse, setRawGeminiResponse] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const isUserListeningRef = useRef<boolean>(false);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const endReasonRef = useRef<string>('User stopped');
  const transcriptRef = useRef<string>('');

  // Keep transcriptRef in sync
  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  // Load backend prompt on mount for the inspector modal
  useEffect(() => {
    fetchExtractionPrompt().then((p) => {
      if (p) setCachedPrompt(p);
    });
  }, []);

  // Clear silence timer helper
  const clearSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  // Reset silence timer to 9 seconds (at least 8-10 seconds of silence before auto-stopping)
  const resetSilenceTimer = () => {
    clearSilenceTimer();
    silenceTimerRef.current = setTimeout(() => {
      console.log('[SpeechRecognition Ended]: Stopped after 9 seconds of silence.');
      endReasonRef.current = '8-10s silence timeout (9000ms elapsed without speech)';
      const hadSpeech = transcriptRef.current.trim().length > 0;
      stopListening(false);
      if (!hadSpeech) {
        setSpeechError("Didn't catch that, please try again");
      }
    }, 9000);
  };

  // Web Speech API cleanup
  const stopListening = (userInitiated = true) => {
    isUserListeningRef.current = false;
    clearSilenceTimer();
    endReasonRef.current = userInitiated ? 'User explicitly tapped button to stop' : endReasonRef.current;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }
    setIsListening(false);
    setInterimText('');
  };

  // Clean up on unmount
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

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError(
        'Speech recognition is not supported in this browser. You can click an example or type an informal sentence below.'
      );
      return;
    }

    try {
      stopListening(false);
      setSpeechError(null);
      setTranscript('');
      transcriptRef.current = '';
      setLastExtracted(null);
      isUserListeningRef.current = true;
      endReasonRef.current = 'Active listening session';

      const recognition = new SpeechRecognition();
      // Requirement 1: continuous = true
      recognition.continuous = true;
      // Requirement 2: interimResults = true
      recognition.interimResults = true;
      recognition.lang = langConfig.speechCode;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
        console.log(
          `[SpeechRecognition Started]: Listening session began at ${new Date().toLocaleTimeString()} (language: ${langConfig.nativeName} [${langConfig.speechCode}])`
        );
        resetSilenceTimer();
      };

      recognition.onresult = (event: any) => {
        // Active speech detected - reset the 9-second silence timer
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
          setTranscript((prev) => {
            const updated = prev ? `${prev} ${finalChunk.trim()}` : finalChunk.trim();
            transcriptRef.current = updated;
            return updated;
          });
        }
      };

      // Requirement 3: onerror handler that logs specific error type
      recognition.onerror = (event: any) => {
        const errorType = event.error || 'unknown';
        console.warn(
          `[SpeechRecognition Status]: Specific error type="${errorType}", Message="${event.message || 'No additional details'}"`
        );

        // 'no-speech' happens when the browser detects a pause. Do NOT close the session immediately!
        if (errorType === 'no-speech') {
          console.log(
            '[SpeechRecognition]: "no-speech" event detected by browser engine. Maintaining active listening state within 8-10s silence window...'
          );
          // Keep listening active; do not stop or display error unless silence timer expires
          return;
        }

        // Prevent any automatic reconnect loops on hardware/permission errors
        isUserListeningRef.current = false;
        clearSilenceTimer();

        if (errorType === 'audio-capture') {
          endReasonRef.current = 'Audio capture failure (no audio input device detected)';
          setSpeechError(
            'Microphone not detected or audio input is unavailable on this device. You can test voice extraction using any sample voice below or type directly.'
          );
          stopListening(false);
        } else if (errorType === 'not-allowed' || errorType === 'service-not-allowed') {
          endReasonRef.current = `Permission denied (${errorType})`;
          setSpeechError(
            'Microphone permission was denied. Please allow microphone access in your browser or select an example below.'
          );
          stopListening(false);
        } else if (errorType === 'network') {
          endReasonRef.current = 'Network error (network)';
          setSpeechError("Didn't catch that, please try again (network connection interrupted).");
          stopListening(false);
        } else if (errorType === 'aborted') {
          endReasonRef.current = 'Session aborted (aborted)';
          stopListening(false);
        } else {
          endReasonRef.current = `Error: ${errorType}`;
          setSpeechError("Didn't catch that, please try again");
          stopListening(false);
        }
      };

      // Requirement 4: onend handler that logs when and why the session ended
      recognition.onend = () => {
        console.log(
          `[SpeechRecognition Ended]: Stopped at ${new Date().toLocaleTimeString()}. Reason: ${endReasonRef.current || 'Session ended'}`
        );

        // If the user did NOT explicitly tap stop, and silence timer has not expired, seamlessly continue
        if (isUserListeningRef.current) {
          console.log('[SpeechRecognition Session]: Seamlessly continuing recognition stream...');
          try {
            recognition.start();
          } catch (restartErr) {
            console.warn('[SpeechRecognition Session]: Reconnect attempt failed:', restartErr);
            setIsListening(false);
            if (!transcriptRef.current.trim()) {
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
      console.warn('[SpeechRecognition Init Warning]:', err?.message || err);
      setSpeechError("Microphone input unavailable. You can click 'Test Sample Voice' below or type naturally.");
      setIsListening(false);
    }
  };

  // Perform Gemini AI Extraction on text
  const handleExtract = async (textToExtract: string) => {
    const query = textToExtract.trim();
    if (!query) return;

    stopListening();
    setIsExtracting(true);
    setSpeechError(null);

    try {
      const res = await extractListingFromSpeech(query, language);
      if (res.success && res.extracted) {
        setLastExtracted(res.extracted);
        setDetectedLangName(res.extracted.detectedLanguage || langConfig.nativeName);
        if (res.promptUsed) setCachedPrompt(res.promptUsed);
        if (res.rawGeminiText) setRawGeminiResponse(res.rawGeminiText);

        // Auto-fill form fields
        onExtracted(res.extracted);
      } else {
        setSpeechError(res.error || 'Could not extract details. Please check the text and try again.');
      }
    } catch (err: any) {
      console.error('Extraction error:', err);
      setSpeechError(err?.message || 'Gemini extraction failed. Please try again.');
    } finally {
      setIsExtracting(false);
    }
  };

  // Quick select sample
  const handleSelectSample = (sample: SpokenSample) => {
    stopListening();
    setTranscript(sample.text);
    handleExtract(sample.text);
  };

  const fullDisplayTranscript = transcript + (interimText ? ` ${interimText}` : '');

  return (
    <div 
      id="casual-speech-hero-assistant"
      className="mb-8 rounded-3xl border-2 border-[#D5C7B8] bg-gradient-to-b from-[#FFFDF9] via-[#FAF6F0] to-[#F5ECE0] p-5 sm:p-7 shadow-sm transition-all"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#C2542D] text-white flex items-center justify-center shadow-xs">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold font-display text-[#2A221E]">
                Smart Casual Speech Assistant
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-[#FBEEE8] text-[#C2542D] border border-[#F4DDD2] text-[11px] font-extrabold uppercase tracking-wide flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Gemini AI
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#6A5D54]">
              Speak naturally about your work in any Indian language. Gemini extracts & fills the form automatically.
            </p>
          </div>
        </div>

        {/* View Prompt Button */}
        <button
          type="button"
          id="view-gemini-prompt-btn"
          onClick={() => setShowPromptModal(true)}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#D5C7B8] text-[#5A4F47] hover:text-[#2A221E] hover:bg-[#FAF6F0] text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
        >
          <Code2 className="w-3.5 h-3.5 text-[#C2542D]" />
          <span>View Gemini Prompt</span>
        </button>
      </div>

      {/* Interactive Speech & Extraction Controls */}
      <div className="bg-white rounded-2xl border border-[#E8DED2] p-4 sm:p-5 shadow-2xs space-y-4">
        {/* Main Microphone Button & Visual Status */}
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {isListening ? (
              <button
                type="button"
                id="stop-casual-speech-btn"
                onClick={() => {
                  const textToProcess = (transcript + (interimText ? ` ${interimText}` : '')).trim();
                  stopListening(true);
                  if (textToProcess) {
                    handleExtract(textToProcess);
                  }
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#C2542D] hover:bg-[#A13D19] text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-sm cursor-pointer transition-all animate-pulse"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                </span>
                <MicOff className="w-4 h-4" />
                <span>Listening... (Tap to Finish)</span>
              </button>
            ) : (
              <button
                type="button"
                id="start-casual-speech-btn"
                onClick={startListening}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#1E4D38] hover:bg-[#143526] text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-sm transition-all hover:shadow cursor-pointer"
              >
                <Mic className="w-4 h-4 text-emerald-300" />
                <span>Tap to Speak Naturally</span>
              </button>
            )}

            {/* Language hint */}
            <div className="hidden md:flex items-center gap-1.5 text-xs text-[#6A5D54]">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Input language: <strong>{langConfig.nativeName} ({langConfig.speechCode})</strong></span>
            </div>
          </div>

          {/* Action to extract text if user manually typed or spoke */}
          {transcript.trim() && !isListening && (
            <button
              type="button"
              id="extract-transcript-btn"
              disabled={isExtracting}
              onClick={() => handleExtract(transcript)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#FBEEE8] hover:bg-[#F5DBD0] text-[#C2542D] border border-[#EAC9BC] text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {isExtracting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Extracting with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Organize with Gemini</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Listening Active Waveform / Live Box */}
        {isListening && (
          <div className="p-4 rounded-xl bg-[#EEF6F2] border-2 border-[#86C9A4] animate-fadeIn space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1E4D38]">
                <span className="px-2.5 py-0.5 rounded-full bg-[#1E4D38] text-white font-extrabold text-[11px] uppercase tracking-wide flex items-center gap-1.5 shadow-2xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                  </span>
                  Listening...
                </span>
                <span className="text-xs font-medium text-[#2A5E47]">
                  Listening live in {langConfig.nativeName} ({langConfig.speechCode})
                </span>
              </div>
              <div className="flex gap-1 items-center h-4">
                <span className="w-1 h-3 bg-[#1E4D38] rounded-full animate-bounce"></span>
                <span className="w-1 h-5 bg-[#1E4D38] rounded-full animate-bounce delay-100"></span>
                <span className="w-1 h-2 bg-[#1E4D38] rounded-full animate-bounce delay-150"></span>
                <span className="w-1 h-4 bg-[#1E4D38] rounded-full animate-bounce delay-200"></span>
              </div>
            </div>

            <div className="bg-white/90 p-3.5 rounded-lg border border-[#BDE0CE] min-h-[3.5rem] flex flex-col justify-center">
              {fullDisplayTranscript ? (
                <p className="text-sm sm:text-base text-[#1E4D38] font-medium leading-relaxed">
                  <span>{transcript}</span>
                  {interimText && (
                    <span className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded ml-1 animate-pulse italic">
                      {interimText}
                    </span>
                  )}
                </p>
              ) : (
                <p className="text-sm text-[#5D8070] italic">
                  Listening... Speak casually (e.g., your name, what you sew or cook, your rate, and area). Pausing briefly won't stop the microphone.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Spoken Text Display / Editable Transcript */}
        {!isListening && (
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-[#5A4F47] mb-1.5">
              <span>Spoken or Typed Sentence:</span>
              {transcript && (
                <button
                  type="button"
                  onClick={() => {
                    setTranscript('');
                    transcriptRef.current = '';
                    setLastExtracted(null);
                  }}
                  className="text-xs text-[#C2542D] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Clear
                </button>
              )}
            </div>
            <textarea
              id="casual-spoken-transcript-input"
              value={transcript}
              onChange={(e) => {
                setTranscript(e.target.value);
                transcriptRef.current = e.target.value;
              }}
              placeholder="Your spoken words will appear here. Or type casually: 'Nanna hesru Lakshmi, naanu blouse mattu salwar hoLiyodu maaduthini, ondu blouse ge 200 rupees, naanu Malleshwaram alli iddini'"
              rows={2}
              className="w-full p-3 rounded-xl border border-[#D5C7B8] focus:border-[#C2542D] focus:ring-1 focus:ring-[#FBEEE8] text-sm text-[#2A221E] outline-none placeholder:text-[#9F9185] bg-[#FCFAF7]"
            />
          </div>
        )}

        {/* Error message */}
        {speechError && (
          <div 
            id="speech-recognition-error-alert"
            className="p-3.5 rounded-xl bg-[#FDF1EC] border border-[#F5C2AF] text-[#C2542D] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-medium animate-fadeIn"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#C2542D]" />
              <span className="font-semibold">{speechError}</span>
            </div>
            <button
              type="button"
              id="retry-speech-btn"
              onClick={startListening}
              className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-[#C2542D] text-white font-bold text-xs hover:bg-[#A13D19] transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 shadow-2xs"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
          </div>
        )}

        {/* Try an Example Chips */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#5A4F47] uppercase tracking-wider flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-[#C2542D]" />
              <span>Or Click to Test a Casual Spoken Example:</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CONVERSATIONAL_SAMPLES.map((sample) => (
              <button
                type="button"
                key={sample.id}
                id={`sample-phrase-${sample.id}`}
                onClick={() => handleSelectSample(sample)}
                disabled={isExtracting}
                className="text-left p-2.5 rounded-xl border border-[#E8DED2] bg-[#FAF6F0] hover:bg-[#F2E8DC] hover:border-[#D5C7B8] transition-all text-xs group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#C2542D] text-[11px] group-hover:underline">
                    {sample.langName} • {sample.expectedCategory}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-[#5A4F47] font-semibold border border-[#E8DED2]">
                    Try Speech
                  </span>
                </div>
                <p className="text-[#2A221E] line-clamp-2 italic">
                  "{sample.text}"
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* EXTRACTED CONFIRMATION CARD (Step 3 & 4: Review before final submission) */}
      {isExtracting && (
        <div className="mt-4 p-5 rounded-2xl bg-white border border-[#D5C7B8] flex items-center justify-center gap-3 text-[#1E4D38] font-bold text-sm animate-pulse shadow-xs">
          <Loader2 className="w-5 h-5 animate-spin text-[#C2542D]" />
          <span>Gemini AI is parsing casual speech into structured fields...</span>
        </div>
      )}

      {lastExtracted && !isExtracting && (
        <div 
          id="extracted-fields-review-card"
          className="mt-5 p-5 sm:p-6 rounded-2xl bg-[#EEF6F2] border-2 border-[#1E4D38] shadow-sm animate-fadeIn space-y-4"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#C6E6D4] pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#1E4D38] text-white flex items-center justify-center">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1E4D38]">
                  Extracted Details (Auto-Filled in Form)
                </h3>
                <p className="text-xs text-[#385B49]">
                  {detectedLangName ? `Spoken in ${detectedLangName}` : 'Understood from spoken text'} • Review and edit below before submitting
                </p>
              </div>
            </div>

            <button
              type="button"
              id="scroll-to-form-btn"
              onClick={onScrollToForm}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1E4D38] text-white text-xs font-bold hover:bg-[#143526] transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
            >
              <span>Review Form Fields Below</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Grid of Extracted Values */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs sm:text-sm">
            {/* Name */}
            <div className="p-3 rounded-xl bg-white border border-[#BDE0CE] shadow-2xs">
              <span className="block text-[11px] font-bold text-[#6A5D54] uppercase tracking-wider mb-0.5">
                Full Name
              </span>
              <span className="text-base font-bold text-[#2A221E]">
                {lastExtracted.name || <em className="text-gray-400 font-normal">Not detected</em>}
              </span>
            </div>

            {/* Skill Category */}
            <div className="p-3 rounded-xl bg-white border border-[#BDE0CE] shadow-2xs">
              <span className="block text-[11px] font-bold text-[#6A5D54] uppercase tracking-wider mb-0.5">
                Skill Category
              </span>
              <span className="inline-flex items-center gap-1.5 text-base font-bold text-[#C2542D]">
                <span>{lastExtracted.category}</span>
              </span>
            </div>

            {/* Price */}
            <div className="p-3 rounded-xl bg-white border border-[#BDE0CE] shadow-2xs">
              <span className="block text-[11px] font-bold text-[#6A5D54] uppercase tracking-wider mb-0.5">
                Price / Fees
              </span>
              <span className="text-base font-extrabold text-[#1E4D38]">
                {lastExtracted.price || <em className="text-gray-400 font-normal">Not detected</em>}
              </span>
            </div>

            {/* Location */}
            <div className="p-3 rounded-xl bg-white border border-[#BDE0CE] shadow-2xs">
              <span className="block text-[11px] font-bold text-[#6A5D54] uppercase tracking-wider mb-0.5">
                Location
              </span>
              <span className="text-sm font-semibold text-[#2A221E]">
                {lastExtracted.location || <em className="text-gray-400 font-normal">Not detected</em>}
              </span>
            </div>

            {/* Description (spans 2 cols) */}
            <div className="p-3 rounded-xl bg-white border border-[#BDE0CE] shadow-2xs sm:col-span-2">
              <span className="block text-[11px] font-bold text-[#6A5D54] uppercase tracking-wider mb-0.5">
                Description of Work
              </span>
              <p className="text-sm text-[#2A221E] font-medium leading-relaxed">
                "{lastExtracted.description || lastExtracted.category}"
              </p>
            </div>
          </div>

          {/* Reassurance Banner */}
          <div className="flex items-start gap-2 text-xs text-[#2F5240] bg-[#E2F0EA] p-3 rounded-xl border border-[#BDE0CE]">
            <Info className="w-4 h-4 shrink-0 text-[#1E4D38] mt-0.5" />
            <div>
              <strong>Ready for final review:</strong> The form fields below are now pre-filled with these values. You can change any field, upload a photo, or add your phone number before clicking <em>"Submit Listing"</em>.
            </div>
          </div>
        </div>
      )}

      {/* GEMINI PROMPT INSPECTOR MODAL */}
      {showPromptModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowPromptModal(false)}
        >
          <div 
            id="gemini-prompt-modal"
            className="relative bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-[#E8DED2] max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 bg-[#FAF6F0] border-b border-[#E8DED2] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#C2542D] text-white flex items-center justify-center">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#2A221E]">
                    Gemini AI Extraction Prompt
                  </h3>
                  <p className="text-xs text-[#6A5D54]">
                    Review the system instructions and structured JSON schema used for informal speech parsing
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPromptModal(false)}
                className="w-8 h-8 rounded-full bg-white border border-[#D5C7B8] flex items-center justify-center text-[#5A4F47] hover:text-[#2A221E] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs font-mono">
              <div>
                <span className="block text-xs font-sans font-bold text-[#2A221E] uppercase tracking-wider mb-1">
                  Model & Capabilities:
                </span>
                <p className="text-xs font-sans text-[#5A4F47]">
                  Using <strong>gemini-3.8-flash</strong> with <code>responseMimeType: 'application/json'</code> and typed JSON schema via <code>@google/genai</code> SDK.
                </p>
              </div>

              <div>
                <span className="block text-xs font-sans font-bold text-[#2A221E] uppercase tracking-wider mb-1">
                  System Prompt:
                </span>
                <pre className="p-4 rounded-xl bg-[#1E1E1E] text-[#E0E0E0] text-[11px] leading-relaxed whitespace-pre-wrap overflow-x-auto">
                  {cachedPrompt || 'Loading prompt...'}
                </pre>
              </div>

              {lastExtracted && (
                <div>
                  <span className="block text-xs font-sans font-bold text-[#2A221E] uppercase tracking-wider mb-1">
                    Latest Structured JSON Output:
                  </span>
                  <pre className="p-4 rounded-xl bg-[#1E1E1E] text-emerald-400 text-[11px] leading-relaxed whitespace-pre-wrap overflow-x-auto">
                    {JSON.stringify(lastExtracted, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#FAF6F0] border-t border-[#E8DED2] flex justify-end">
              <button
                type="button"
                onClick={() => setShowPromptModal(false)}
                className="px-5 py-2.5 rounded-xl bg-[#1E4D38] hover:bg-[#143526] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
