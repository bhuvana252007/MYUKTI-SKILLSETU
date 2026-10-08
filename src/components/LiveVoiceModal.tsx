/**
 * Live Voice Conversation Modal powered by Gemini 3.8 Live API (model: gemini-3.8-live)
 * Enables real-time, low-latency, two-way voice conversations with audio streaming.
 * Includes graceful fallback for environments without a physical microphone device.
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  X, 
  Volume2, 
  Sparkles, 
  Radio, 
  RefreshCw, 
  AlertCircle,
  Send,
  MessageSquare,
  VolumeX
} from 'lucide-react';
import { float32ToPcm16Base64, pcm16Base64ToAudioBuffer } from '../utils/audioUtils';
import { SupportedLanguage } from '../types';

interface LiveVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
  onNavigateToAssistant?: () => void;
}

const SAMPLE_VOICE_QUERIES: Record<SupportedLanguage, string[]> = {
  en: [
    'Namaste Saheli! What services are popular on SkillSetu?',
    'How do I calculate tailoring rates for blouses and suits?',
    'Tell me about the Lakhpati Didi scheme and SHG loans.',
    'Can I start a home tiffin and pickle business without a license?',
  ],
  hi: [
    'नमस्ते सहेली! क्या मुझे सिलाई काम का सही दाम बता सकती हो?',
    'लखपति दीदी योजना और स्वयं सहायता समूह लोन की जानकारी दो।',
    'स्किलसेतु पर मैं अपने काम की लिस्टिंग कैसे बनाऊं?',
    'घर से टिफिन या पापड़-अचार का काम कैसे शुरू करें?',
  ],
  kn: [
    'ನಮಸ್ತೆ ಸಹೇಲಿ! ಸ್ಕಿಲ್ಸೇತುವಿನಲ್ಲಿ ಟೈಲರಿಂಗ್ ಕೆಲಸಕ್ಕೆ ಎಷ್ಟು ಶುಲ್ಕ ನಿಗದಿಪಡಿಸಬೇಕು?',
    'ಲಕ್ಷಪತಿ ದೀದಿ ಯೋಜನೆ ಮತ್ತು SHG ಸಾಲಗಳ ಬಗ್ಗೆ ತಿಳಿಸಿ.',
    'ಮನೆಯಿಂದ ಊಟದ ಸರಬರಾಜು ಅಥವಾ ತಿಂಡಿ ವ್ಯಾಪಾರ ಹೇಗೆ ಶುರು ಮಾಡುವುದು?',
  ],
  ta: [
    'வணக்கம் சஹேலி! தையல் வேலைக்கு எவ்வளவு கட்டணம் நிர்ணயிக்கலாம்?',
    'லக்கபதி தீதி திட்டம் மற்றும் மகளிர் சுயஉதவிக் குழு கடன் விவரங்கள் சொல்லுங்கள்.',
  ],
  te: [
    'నమస్కారం సహేలీ! కుట్టుపని లేదా బ్యూటీషియన్ సేవల ధర ఎలా నిర్ణయించాలి?',
    'లఖ్‌పతి దీదీ పథకం మరియు స్వయం సహాయక సంఘం రుణాల వివరాలు చెప్పండి.',
  ],
};

export const LiveVoiceModal: React.FC<LiveVoiceModalProps> = ({ 
  isOpen, 
  onClose, 
  language,
  onNavigateToAssistant 
}) => {
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error' | 'disconnected'>('disconnected');
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false); // Model is speaking
  const [isListening, setIsListening] = useState(false); // User is speaking / mic active
  const [hasMicrophone, setHasMicrophone] = useState<boolean>(true);
  const [micNotice, setMicNotice] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [micVolume, setMicVolume] = useState(0);
  const [userPromptInput, setUserPromptInput] = useState('');
  const [lastUserQuery, setLastUserQuery] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const inputCtxRef = useRef<AudioContext | null>(null);
  const outputCtxRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const isMutedRef = useRef(false);

  // Sync ref with state
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    if (isOpen) {
      startLiveSession();
    } else {
      cleanupSession();
    }
    return () => {
      cleanupSession();
    };
  }, [isOpen]);

  const cleanupSession = () => {
    // Stop and clear all audio sources
    activeSourcesRef.current.forEach((source) => {
      try {
        source.stop();
      } catch (_) {}
    });
    activeSourcesRef.current = [];
    nextStartTimeRef.current = 0;

    // Disconnect mic audio nodes
    if (processorRef.current) {
      try {
        processorRef.current.disconnect();
      } catch (_) {}
      processorRef.current = null;
    }

    // Stop mic stream
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }

    // Close AudioContexts
    if (inputCtxRef.current && inputCtxRef.current.state !== 'closed') {
      try {
        inputCtxRef.current.close();
      } catch (_) {}
      inputCtxRef.current = null;
    }

    if (outputCtxRef.current && outputCtxRef.current.state !== 'closed') {
      try {
        outputCtxRef.current.close();
      } catch (_) {}
      outputCtxRef.current = null;
    }

    // Close WebSocket
    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch (_) {}
      wsRef.current = null;
    }

    setConnectionStatus('disconnected');
    setIsSpeaking(false);
    setIsListening(false);
    setMicVolume(0);
    setLastUserQuery(null);
  };

  const startLiveSession = async () => {
    cleanupSession();
    setConnectionStatus('connecting');
    setErrorMessage(null);
    setMicNotice(null);

    try {
      // 1. Initialize AudioContext for 24kHz audio playback (output from Gemini Live)
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const outputCtx = new AudioCtx({ sampleRate: 24000 });
        outputCtxRef.current = outputCtx;
        if (outputCtx.state === 'suspended') {
          await outputCtx.resume().catch(() => {});
        }
      }

      // 2. Safely attempt to acquire microphone device without fatal failure
      let stream: MediaStream | null = null;
      let micDetected = false;

      if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          // Attempt preferred audio constraints
          stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              channelCount: 1,
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            },
          });
          micDetected = true;
        } catch (firstErr: any) {
          // If detailed constraints failed, retry with basic audio: true
          try {
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            micDetected = true;
          } catch (micErr: any) {
            console.warn('Microphone hardware acquisition notice:', micErr?.name, micErr?.message);
            micDetected = false;
            setMicNotice(
              micErr?.name === 'NotFoundError' || micErr?.message?.toLowerCase().includes('device not found')
                ? 'No hardware microphone detected on this device. You can still test voice answers by tapping the sample questions below.'
                : 'Microphone access was denied or not available. You can still ask questions below to hear real-time voice answers.'
            );
          }
        }
      } else {
        setMicNotice('Microphone access is not supported by your browser.');
      }

      setHasMicrophone(micDetected);

      // 3. Connect WebSocket to /live (Gemini 3.8 Live API bridge)
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('Live voice WebSocket opened');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'ready') {
            setConnectionStatus('connected');
            if (micDetected) {
              setIsListening(true);
            }
          } else if (data.type === 'audio' && data.audio) {
            setIsSpeaking(true);
            playAudioChunk(data.audio);
          } else if (data.type === 'interrupted') {
            stopCurrentAudioPlayback();
            setIsSpeaking(false);
          } else if (data.type === 'turnComplete') {
            setTimeout(() => {
              if (outputCtxRef.current && outputCtxRef.current.currentTime >= nextStartTimeRef.current) {
                setIsSpeaking(false);
              }
            }, 300);
          } else if (data.type === 'error') {
            console.error('Live server message error:', data.message);
            setErrorMessage(data.message || 'Live voice session error');
            setConnectionStatus('error');
          }
        } catch (e) {
          console.error('Error handling live message:', e);
        }
      };

      ws.onerror = (err) => {
        console.error('WebSocket live error:', err);
        setErrorMessage('Could not connect to real-time voice server. Check server or internet connection.');
        setConnectionStatus('error');
      };

      ws.onclose = () => {
        if (connectionStatus !== 'error') {
          setConnectionStatus('disconnected');
        }
      };

      // 4. If microphone is present and acquired, hook up 16kHz audio capture
      if (stream && AudioCtx) {
        micStreamRef.current = stream;
        const inputCtx = new AudioCtx({ sampleRate: 16000 });
        inputCtxRef.current = inputCtx;
        if (inputCtx.state === 'suspended') {
          await inputCtx.resume().catch(() => {});
        }

        const micSource = inputCtx.createMediaStreamSource(stream);
        const processor = inputCtx.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;

        processor.onaudioprocess = (e) => {
          if (isMutedRef.current || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            return;
          }

          const channelData = e.inputBuffer.getChannelData(0);
          let sum = 0;
          for (let i = 0; i < channelData.length; i++) {
            sum += channelData[i] * channelData[i];
          }
          const rms = Math.sqrt(sum / channelData.length);
          setMicVolume(Math.min(100, Math.round(rms * 400)));

          // Send 16-bit PCM to server for Gemini Live API
          const base64Pcm = float32ToPcm16Base64(channelData);
          wsRef.current.send(JSON.stringify({ audio: base64Pcm }));
        };

        micSource.connect(processor);
        const silentGain = inputCtx.createGain();
        silentGain.gain.value = 0;
        processor.connect(silentGain);
        silentGain.connect(inputCtx.destination);
      }
    } catch (err: any) {
      console.error('Failed to initialize live voice session:', err);
      setErrorMessage(err?.message || 'Failed to start Live session');
      setConnectionStatus('error');
    }
  };

  const playAudioChunk = (base64Audio: string) => {
    const ctx = outputCtxRef.current;
    if (!ctx || ctx.state === 'closed') return;

    try {
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const buffer = pcm16Base64ToAudioBuffer(base64Audio, ctx);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);

      const currentTime = ctx.currentTime;
      const startAt = Math.max(currentTime, nextStartTimeRef.current);
      source.start(startAt);
      nextStartTimeRef.current = startAt + buffer.duration;

      activeSourcesRef.current.push(source);
      source.onended = () => {
        activeSourcesRef.current = activeSourcesRef.current.filter((s) => s !== source);
        if (activeSourcesRef.current.length === 0 && ctx.currentTime >= nextStartTimeRef.current) {
          setIsSpeaking(false);
        }
      };
    } catch (e) {
      console.error('Error playing audio chunk:', e);
    }
  };

  const stopCurrentAudioPlayback = () => {
    activeSourcesRef.current.forEach((source) => {
      try {
        source.stop();
      } catch (_) {}
    });
    activeSourcesRef.current = [];
    if (outputCtxRef.current) {
      nextStartTimeRef.current = outputCtxRef.current.currentTime;
    }
  };

  const handleSendPrompt = (textToSend?: string) => {
    const query = (textToSend !== undefined ? textToSend : userPromptInput).trim();
    if (!query) return;

    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      setErrorMessage('Voice connection not ready. Please tap Reconnect.');
      return;
    }

    // Stop previous audio if any
    stopCurrentAudioPlayback();
    setLastUserQuery(query);
    setUserPromptInput('');

    // Resume AudioContext if suspended by browser autoplay policy
    if (outputCtxRef.current && outputCtxRef.current.state === 'suspended') {
      outputCtxRef.current.resume().catch(() => {});
    }

    // Send text turn to Gemini Live session
    wsRef.current.send(JSON.stringify({ text: query }));
  };

  if (!isOpen) return null;

  const currentSampleQueries = SAMPLE_VOICE_QUERIES[language] || SAMPLE_VOICE_QUERIES.en;

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
                Setu Live Voice
                <span className="text-xs bg-[#DDA74F]/20 text-[#DDA74F] px-2 py-0.5 rounded-full font-medium border border-[#DDA74F]/30">
                  gemini-3.8-live
                </span>
              </h2>
              <p className="text-xs text-white/80">Real-time two-way voice call</p>
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
          <div className="mb-4">
            {connectionStatus === 'connecting' && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Connecting to Gemini Live API...
              </span>
            )}
            {connectionStatus === 'connected' && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                Live Conversation Connected
              </span>
            )}
            {connectionStatus === 'error' && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-300">
                <AlertCircle className="w-3.5 h-3.5" />
                Voice Connection Issue
              </span>
            )}
            {connectionStatus === 'disconnected' && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700">
                <Radio className="w-3.5 h-3.5 text-stone-400" />
                Call Disconnected
              </span>
            )}
          </div>

          {/* Animated Visualizer Sphere */}
          <div className="relative my-3 flex items-center justify-center">
            {/* Outer animated glow pulses */}
            <div 
              className={`absolute rounded-full transition-all duration-300 ${
                isSpeaking 
                  ? 'w-40 h-40 bg-[#DDA74F]/25 animate-pulse' 
                  : isListening && !isMuted && hasMicrophone
                  ? 'w-36 h-36 bg-[#1E4D38]/15 animate-ping' 
                  : 'w-32 h-32 bg-stone-200/40'
              }`}
            />
            
            {/* Mid ring */}
            <div 
              className={`w-32 h-32 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 ${
                isSpeaking 
                  ? 'bg-gradient-to-tr from-[#DDA74F] to-amber-500 scale-105 text-white' 
                  : isListening && !isMuted && hasMicrophone
                  ? 'bg-gradient-to-tr from-[#1E4D38] to-emerald-700 scale-100 text-white' 
                  : 'bg-gradient-to-tr from-[#1E4D38] to-[#2E7254] text-white'
              }`}
              style={{
                transform: hasMicrophone && !isMuted && micVolume > 10 ? `scale(${1 + micVolume * 0.0015})` : undefined
              }}
            >
              {isSpeaking ? (
                <Volume2 className="w-12 h-12 animate-bounce" />
              ) : isMuted ? (
                <MicOff className="w-12 h-12 text-stone-300" />
              ) : !hasMicrophone ? (
                <Volume2 className="w-12 h-12 text-[#DDA74F]" />
              ) : (
                <Mic className="w-12 h-12" />
              )}
            </div>
          </div>

          {/* Dynamic state instruction */}
          <div className="mt-2 min-h-[36px]">
            {isSpeaking ? (
              <p className="font-bold text-sm text-[#C2542D] animate-pulse">
                Setu Saheli is speaking... (tap or speak to interrupt)
              </p>
            ) : hasMicrophone && connectionStatus === 'connected' && !isMuted ? (
              <p className="font-semibold text-xs sm:text-sm text-[#2A221E]">
                Listening to microphone... Speak in Hindi, Kannada, Tamil, Telugu, or English
              </p>
            ) : isMuted ? (
              <p className="font-medium text-xs text-stone-500">
                Microphone is muted. Tap Unmute to speak.
              </p>
            ) : (
              <p className="text-xs text-[#6A5D54]">
                Tap a question below or enter text to hear Gemini 3.8 Live speak in real-time
              </p>
            )}
          </div>

          {/* Last question sent badge */}
          {lastUserQuery && (
            <div className="mt-2 text-xs bg-white/70 border border-[#DDA74F]/40 text-[#1E4D38] px-3 py-1 rounded-xl max-w-sm truncate">
              <strong>Spoken query:</strong> &ldquo;{lastUserQuery}&rdquo;
            </div>
          )}

          {/* Microphone Hardware Notice Banner (if device not detected) */}
          {micNotice && (
            <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 text-left max-w-sm flex items-start gap-2">
              <VolumeX className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{micNotice}</p>
                <p className="mt-0.5 text-stone-600">Audio playback remains active so you can hear Setu Saheli respond with live voice audio.</p>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="mt-3 p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 text-left max-w-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold">Notice:</span> {errorMessage}
                {onNavigateToAssistant && (
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToAssistant();
                    }}
                    className="mt-1 block underline font-bold text-[#1E4D38] hover:text-[#163829] cursor-pointer"
                  >
                    Open Setu AI Chat instead →
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Quick Voice Prompt Chips */}
          <div className="mt-4 w-full text-left">
            <p className="text-xs font-bold text-[#6B5749] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#DDA74F]" />
              Tap to Ask Live Voice
            </p>
            <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto pr-1">
              {currentSampleQueries.map((query, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendPrompt(query)}
                  disabled={connectionStatus !== 'connected'}
                  className="text-left text-xs bg-white hover:bg-stone-50 text-[#3D2B1F] p-2 rounded-xl border border-stone-200 transition-colors flex items-center justify-between group disabled:opacity-50 cursor-pointer"
                >
                  <span className="line-clamp-1">{query}</span>
                  <Volume2 className="w-3.5 h-3.5 text-[#DDA74F] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1" />
                </button>
              ))}
            </div>
          </div>

          {/* Voice Prompt Text Bar */}
          <div className="mt-3 w-full flex items-center gap-2">
            <input
              type="text"
              value={userPromptInput}
              onChange={(e) => setUserPromptInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSendPrompt();
                }
              }}
              placeholder="Or type a question to hear Gemini Live answer..."
              disabled={connectionStatus !== 'connected'}
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#D8C7B5] bg-white text-[#3D2B1F] outline-none focus:border-[#1E4D38] focus:ring-1 focus:ring-[#1E4D38] placeholder:text-[#9F9185]"
            />
            <button
              onClick={() => handleSendPrompt()}
              disabled={!userPromptInput.trim() || connectionStatus !== 'connected'}
              className="px-3 py-2 bg-[#1E4D38] text-white rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-[#163829] disabled:opacity-50 transition-colors cursor-pointer"
              title="Send to Live Voice"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask</span>
            </button>
          </div>

          {/* Controls */}
          <div className="mt-5 flex items-center justify-center gap-3 w-full">
            {hasMicrophone && (
              <button
                onClick={() => setIsMuted(!isMuted)}
                disabled={connectionStatus !== 'connected'}
                className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  isMuted
                    ? 'bg-red-100 text-red-700 border border-red-300 hover:bg-red-200'
                    : 'bg-[#1E4D38]/10 text-[#1E4D38] border border-[#1E4D38]/20 hover:bg-[#1E4D38]/20'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                {isMuted ? 'Unmute Mic' : 'Mute Mic'}
              </button>
            )}

            {connectionStatus === 'error' || connectionStatus === 'disconnected' ? (
              <button
                onClick={startLiveSession}
                className="px-5 py-2 rounded-xl bg-[#1E4D38] text-white font-bold text-xs flex items-center gap-1.5 hover:bg-[#163829] transition-all cursor-pointer shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reconnect
              </button>
            ) : (
              <button
                onClick={cleanupSession}
                className="px-4 py-2 rounded-xl bg-stone-200 text-stone-800 font-bold text-xs flex items-center gap-1.5 hover:bg-stone-300 transition-all cursor-pointer"
              >
                End Call
              </button>
            )}

            {onNavigateToAssistant && (
              <button
                onClick={() => {
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
            Powered by <strong>gemini-3.8-live</strong> with bidirectional 24kHz audio playback.
          </p>
        </div>
      </div>
    </div>
  );
};
