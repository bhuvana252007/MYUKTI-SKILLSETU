/**
 * Live Voice Conversation Modal
 * Flow:
 * 1. User speaks via browser SpeechRecognition in selected language (kn-IN, hi-IN, en-IN, etc.)
 * 2. Transcribed text is sent to Gemini (/api/chat)
 * 3. Reply is spoken back using browser's speechSynthesis in the same language
 * All errors logged to console.
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  X, 
  Volume2, 
  VolumeX,
  Sparkles, 
  AlertCircle,
  Send,
  MessageSquare,
  Square
} from 'lucide-react';
import { SupportedLanguage } from '../types';

interface LiveVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
  onNavigateToAssistant?: () => void;
}

const SAMPLE_VOICE_QUERIES: Record<SupportedLanguage, string[]> = {
  en: [
    'Namaste Setu! What services are popular on SkillSetu?',
    'How do I calculate tailoring rates for blouses and suits?',
    'Tell me about the Lakhpati Didi scheme and SHG loans.',
    'Can I start a home tiffin and pickle business without a license?',
  ],
  hi: [
    'नमस्ते सेतु! क्या मुझे सिलाई काम का सही दाम बता सकती हो?',
    'लखपति दीदी योजना और स्वयं सहायता समूह लोन की जानकारी दो।',
    'स्किलसेतु पर मैं अपने काम की लिस्टिंग कैसे बनाऊं?',
    'घर से टिफिन या पापड़-अचार का काम कैसे शुरू करें?',
  ],
  kn: [
    'ನಮಸ್ತೆ ಸೇತು! ಸ್ಕಿಲ್ಸೇತುವಿನಲ್ಲಿ ಟೈಲರಿಂಗ್ ಕೆಲಸಕ್ಕೆ ಎಷ್ಟು ಶುಲ್ಕ ನಿಗದಿಪಡಿಸಬೇಕು?',
    'ಲಕ್ಷಪತಿ ದೀದಿ ಯೋಜನೆ ಮತ್ತು SHG ಸಾಲಗಳ ಬಗ್ಗೆ ತಿಳಿಸಿ.',
    'ಮನೆಯಿಂದ ಊಟದ ಸರಬರಾಜು ಅಥವಾ ತಿಂಡಿ ವ್ಯಾಪಾರ ಹೇಗೆ ಶುರು ಮಾಡುವುದು?',
  ],
  ta: [
    'வணக்கம் சேது! தையல் வேலைக்கு எவ்வளவு கட்டணம் நிர்ணயிக்கலாம்?',
    'லக்கபதி தீதி திட்டம் மற்றும் மகளிர் சுயஉதவிக் குழு கடன் விவரங்கள் சொல்லுங்கள்.',
  ],
  te: [
    'నమస్కారం సేతూ! కుట్టుపని లేదా బ్యూటీషియన్ సేవల ధర ఎలా నిర్ణయించాలి?',
    'లఖ్‌పతి దీదీ పథకం మరియు స్వయం సహాయక సంఘం రుణాల వివరాలు చెప్పండి.',
  ],
};

export const LiveVoiceModal: React.FC<LiveVoiceModalProps> = ({ 
  isOpen, 
  onClose, 
  language,
  onNavigateToAssistant 
}) => {
  const [voiceState, setVoiceState] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [transcript, setTranscript] = useState('');
  const [lastUserSpeech, setLastUserSpeech] = useState<string | null>(null);
  const [lastModelReply, setLastModelReply] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [textInput, setTextInput] = useState('');

  const recognitionRef = useRef<any>(null);
  const isMutedRef = useRef(false);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Clean up when modal closes
  useEffect(() => {
    if (!isOpen) {
      stopAllVoiceActivity();
      setTranscript('');
      setLastUserSpeech(null);
      setLastModelReply(null);
      setErrorMessage(null);
      setVoiceState('idle');
    }
  }, [isOpen]);

  const getLocaleCode = (lang: SupportedLanguage): string => {
    switch (lang) {
      case 'kn': return 'kn-IN';
      case 'hi': return 'hi-IN';
      case 'ta': return 'ta-IN';
      case 'te': return 'te-IN';
      case 'en':
      default:
        return 'en-IN';
    }
  };

  const stopAllVoiceActivity = () => {
    // Stop speech recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (err) {
        console.error('Error stopping speech recognition:', err);
      }
      recognitionRef.current = null;
    }

    // Stop speech synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (err) {
        console.error('Error cancelling speech synthesis:', err);
      }
    }
  };

  // Speak text back using browser's speechSynthesis in the matching language
  const speakReply = (textToSpeak: string) => {
    if (isMutedRef.current) {
      setVoiceState('idle');
      return;
    }

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser.');
      setVoiceState('idle');
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      const targetLocale = getLocaleCode(language);
      utterance.lang = targetLocale;
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      // Try selecting a matching voice if available
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const matchingVoice = voices.find(
          (v) => v.lang.replace('_', '-').toLowerCase() === targetLocale.toLowerCase()
        ) || voices.find((v) => v.lang.startsWith(targetLocale.split('-')[0]));
        if (matchingVoice) {
          utterance.voice = matchingVoice;
        }
      }

      utterance.onstart = () => {
        setVoiceState('speaking');
      };

      utterance.onend = () => {
        setVoiceState('idle');
      };

      utterance.onerror = (err) => {
        console.error('Speech synthesis error:', err);
        setVoiceState('idle');
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Failed to speak reply via speechSynthesis:', err);
      setVoiceState('idle');
    }
  };

  // Send transcribed text to Gemini API
  const sendToGemini = async (speechText: string) => {
    const trimmed = speechText.trim();
    if (!trimmed) {
      setVoiceState('idle');
      return;
    }

    setLastUserSpeech(trimmed);
    setTranscript('');
    setVoiceState('thinking');
    setErrorMessage(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: trimmed }],
          language,
          role: 'general',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Sorry, I couldn't connect. Please try again.");
      }

      const reply = data.text || "Sorry, I couldn't connect. Please try again.";
      setLastModelReply(reply);
      // Speak the reply back using browser's speechSynthesis
      speakReply(reply);
    } catch (err: any) {
      console.error('Live Voice Gemini API error:', err);
      const fallbackMsg = "Sorry, I couldn't connect. Please try again.";
      setErrorMessage(fallbackMsg);
      setLastModelReply(fallbackMsg);
      speakReply(fallbackMsg);
    }
  };

  // Start microphone listening using browser's SpeechRecognition API
  const startListening = () => {
    stopAllVoiceActivity();
    setErrorMessage(null);
    setTranscript('');

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      const errorStr = 'Speech recognition is not supported in this browser. Please use Chrome or Edge.';
      console.error(errorStr);
      setErrorMessage(errorStr);
      setVoiceState('idle');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false; // Capture user turn cleanly
      recognition.interimResults = true;
      recognition.lang = getLocaleCode(language);

      let finalCapturedText = '';

      recognition.onstart = () => {
        setVoiceState('listening');
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        for (let i = 0; i < event.results.length; i++) {
          const item = event.results[i];
          if (item.isFinal) {
            finalCapturedText += item[0].transcript;
          } else {
            currentInterim += item[0].transcript;
          }
        }
        const combined = (finalCapturedText + ' ' + currentInterim).trim();
        setTranscript(combined);
      };

      recognition.onerror = (event: any) => {
        console.error('Live voice speech recognition error:', event.error, event);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setErrorMessage('Microphone permission was denied. Please allow microphone access in your browser settings.');
        } else if (event.error === 'no-speech') {
          // No speech detected, silently revert to idle
        } else {
          setErrorMessage(`Microphone notice: ${event.error}. Please try again.`);
        }
        setVoiceState('idle');
      };

      recognition.onend = () => {
        recognitionRef.current = null;
        // If we captured speech text, send it to Gemini
        if (finalCapturedText.trim() || transcript.trim()) {
          const textToSend = (finalCapturedText || transcript).trim();
          sendToGemini(textToSend);
        } else {
          setVoiceState('idle');
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Failed to start Live Voice recognition:', err);
      if (err?.name === 'NotAllowedError' || err?.message?.toLowerCase().includes('permission')) {
        setErrorMessage('Microphone permission was denied. Please allow microphone access in your browser settings.');
      } else {
        setErrorMessage(err?.message || 'Could not start microphone listening.');
      }
      setVoiceState('idle');
    }
  };

  const handleMicButtonClick = () => {
    if (voiceState === 'listening') {
      // User tapped to finish listening early and submit
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
    } else if (voiceState === 'speaking') {
      // User tapped to interrupt speaking
      stopAllVoiceActivity();
      setVoiceState('idle');
    } else {
      startListening();
    }
  };

  const handleSelectSampleQuery = (queryText: string) => {
    stopAllVoiceActivity();
    sendToGemini(queryText);
  };

  const handleSendTextInput = () => {
    const text = textInput.trim();
    if (!text) return;
    setTextInput('');
    stopAllVoiceActivity();
    sendToGemini(text);
  };

  if (!isOpen) return null;

  const currentSampleQueries = SAMPLE_VOICE_QUERIES[language] || SAMPLE_VOICE_QUERIES.en;
  const currentLocale = getLocaleCode(language);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF5EB] rounded-3xl w-full max-w-lg shadow-2xl border-2 border-[#1E4D38]/20 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-[#1E4D38] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#DDA74F]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight flex items-center gap-2">
                Live Voice Call
                <span className="text-xs bg-[#DDA74F]/20 text-[#DDA74F] px-2 py-0.5 rounded-full font-mono border border-[#DDA74F]/30">
                  {currentLocale}
                </span>
              </h2>
              <p className="text-xs text-white/80">Speak in your language & hear Setu reply</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 transition-colors text-white/80 hover:text-white cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Visualizer */}
        <div className="p-6 overflow-y-auto flex flex-col items-center justify-center text-center">
          {/* Status Badge */}
          <div className="mb-3">
            {voiceState === 'listening' && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                Listening... Speak now
              </span>
            )}
            {voiceState === 'thinking' && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                <span className="w-2 h-2 rounded-full bg-amber-600 animate-bounce" />
                Setu is thinking...
              </span>
            )}
            {voiceState === 'speaking' && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <Volume2 className="w-3.5 h-3.5 text-emerald-700 animate-bounce" />
                Setu is speaking...
              </span>
            )}
            {voiceState === 'idle' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200">
                Tap the microphone below to talk
              </span>
            )}
          </div>

          {/* Animated Central Sphere / Mic Action */}
          <div className="relative my-4 flex items-center justify-center">
            {/* Pulsing rings */}
            <div 
              className={`absolute rounded-full transition-all duration-300 ${
                voiceState === 'listening'
                  ? 'w-44 h-44 bg-red-500/20 animate-ping'
                  : voiceState === 'speaking'
                  ? 'w-44 h-44 bg-[#DDA74F]/25 animate-pulse'
                  : voiceState === 'thinking'
                  ? 'w-40 h-40 bg-amber-500/20 animate-pulse'
                  : 'w-36 h-36 bg-[#1E4D38]/10'
              }`}
            />
            
            {/* Interactive button */}
            <button
              onClick={handleMicButtonClick}
              className={`relative z-10 w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-xl transition-all duration-300 cursor-pointer ${
                voiceState === 'listening'
                  ? 'bg-gradient-to-tr from-red-600 to-rose-500 text-white scale-105 ring-4 ring-red-300'
                  : voiceState === 'speaking'
                  ? 'bg-gradient-to-tr from-[#DDA74F] to-amber-500 text-white scale-105 ring-4 ring-amber-200'
                  : voiceState === 'thinking'
                  ? 'bg-gradient-to-tr from-amber-600 to-[#1E4D38] text-white opacity-90'
                  : 'bg-gradient-to-tr from-[#1E4D38] to-[#2E7254] text-white hover:scale-105 hover:shadow-2xl'
              }`}
              title={
                voiceState === 'listening'
                  ? 'Tap to finish speaking'
                  : voiceState === 'speaking'
                  ? 'Tap to stop Setu from speaking'
                  : 'Tap to speak'
              }
              aria-label="Microphone control"
            >
              {voiceState === 'listening' ? (
                <>
                  <MicOff className="w-10 h-10 animate-pulse" />
                  <span className="text-[11px] font-bold mt-1">Tap Done</span>
                </>
              ) : voiceState === 'speaking' ? (
                <>
                  <Square className="w-8 h-8 fill-current" />
                  <span className="text-[11px] font-bold mt-1">Stop Voice</span>
                </>
              ) : voiceState === 'thinking' ? (
                <>
                  <Sparkles className="w-9 h-9 animate-spin text-[#DDA74F]" />
                  <span className="text-[11px] font-bold mt-1">Thinking...</span>
                </>
              ) : (
                <>
                  <Mic className="w-10 h-10" />
                  <span className="text-[11px] font-bold mt-1">Tap to Speak</span>
                </>
              )}
            </button>
          </div>

          {/* Real-time Spoken Transcript or Status Instruction */}
          <div className="mt-2 min-h-[44px] max-w-sm px-2 flex items-center justify-center">
            {voiceState === 'listening' ? (
              <p className="text-sm font-semibold text-[#C2542D] italic">
                {transcript ? `"${transcript}"` : 'Listening... Speak now'}
              </p>
            ) : voiceState === 'thinking' ? (
              <p className="text-sm text-stone-600">
                Generating answer in {currentLocale}...
              </p>
            ) : voiceState === 'speaking' ? (
              <p className="text-xs text-[#1E4D38] font-medium line-clamp-2">
                &ldquo;{lastModelReply}&rdquo;
              </p>
            ) : lastModelReply ? (
              <p className="text-xs text-[#2A221E] font-medium line-clamp-2">
                <strong>Setu:</strong> {lastModelReply}
              </p>
            ) : (
              <p className="text-xs text-[#6A5D54]">
                Tap the microphone button to ask anything in {currentLocale}
              </p>
            )}
          </div>

          {/* Last user speech badge */}
          {lastUserSpeech && voiceState !== 'listening' && (
            <div className="mt-2 text-xs bg-white border border-[#DDA74F]/40 text-[#1E4D38] px-3 py-1.5 rounded-xl max-w-sm truncate shadow-xs">
              <strong>You asked:</strong> &ldquo;{lastUserSpeech}&rdquo;
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="mt-3 p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 text-left max-w-sm flex items-start gap-2 shadow-xs">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Quick Voice Prompt Chips */}
          <div className="mt-4 w-full text-left">
            <p className="text-xs font-bold text-[#6B5749] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#DDA74F]" />
              Tap to Ask Instantly:
            </p>
            <div className="flex flex-col gap-1.5 max-h-32 overflow-y-auto pr-1">
              {currentSampleQueries.map((query, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSampleQuery(query)}
                  disabled={voiceState === 'thinking'}
                  className="text-left text-xs bg-white hover:bg-stone-50 text-[#3D2B1F] p-2 rounded-xl border border-stone-200 transition-colors flex items-center justify-between group disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  <span className="line-clamp-1">{query}</span>
                  <Volume2 className="w-3.5 h-3.5 text-[#DDA74F] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1" />
                </button>
              ))}
            </div>
          </div>

          {/* Text input fallback */}
          <div className="mt-3 w-full flex items-center gap-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSendTextInput();
                }
              }}
              placeholder="Or type a question to hear Setu speak..."
              disabled={voiceState === 'thinking'}
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#D8C7B5] bg-white text-[#3D2B1F] outline-none focus:border-[#1E4D38] focus:ring-1 focus:ring-[#1E4D38] placeholder:text-[#9F9185]"
            />
            <button
              onClick={handleSendTextInput}
              disabled={!textInput.trim() || voiceState === 'thinking'}
              className="px-3 py-2 bg-[#1E4D38] text-white rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-[#163829] disabled:opacity-50 transition-colors cursor-pointer"
              title="Send text"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask</span>
            </button>
          </div>

          {/* Action buttons footer */}
          <div className="mt-5 flex items-center justify-center gap-3 w-full">
            {/* Mute audio playback toggle */}
            <button
              onClick={() => {
                const nextMute = !isMuted;
                setIsMuted(nextMute);
                if (nextMute && voiceState === 'speaking') {
                  stopAllVoiceActivity();
                  setVoiceState('idle');
                }
              }}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                isMuted
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-amber-700" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{isMuted ? 'Voice Muted' : 'Voice Enabled'}</span>
            </button>

            {/* Jump to Text Chat */}
            {onNavigateToAssistant && (
              <button
                onClick={() => {
                  stopAllVoiceActivity();
                  onClose();
                  onNavigateToAssistant();
                }}
                className="px-4 py-2 rounded-xl bg-[#FFFDF9] border border-[#1E4D38]/30 text-[#1E4D38] font-bold text-xs flex items-center gap-1.5 hover:bg-stone-100 transition-all cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#DDA74F]" />
                <span>Text Chat</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer info banner */}
        <div className="bg-[#FAF5EB] border-t border-stone-200 px-6 py-2.5 text-center shrink-0">
          <p className="text-[11px] text-[#6A5D54]">
            Powered by <strong>Gemini 3.8 Flash</strong> and browser SpeechSynthesis voice.
          </p>
        </div>
      </div>
    </div>
  );
};
