/**
 * Setu AI Multi-turn Gemini Assistant
 * Implements:
 * - Multi-turn conversational history in scrollable thread
 * - Role-specific system instructions
 * - Model selection:
 *   * Complex: gemini-3.1-pro-preview (SHG Advisory & Scheme Specialist)
 *   * General: gemini-3.5-flash (Community Guide)
 *   * Fast: gemini-3.1-flash-lite (Instant Answers)
 * - Google Search Grounding with web citations
 * - Google Maps Grounding with place links & snippets
 * - Audio transcription via microphone using gemini-3.5-transcribe
 * - Shortcut to Gemini 3.8 Live API real-time voice call
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Sparkles, 
  MapPin, 
  Globe, 
  Zap, 
  GraduationCap, 
  Compass, 
  ExternalLink, 
  Radio, 
  Loader2, 
  Bot, 
  User, 
  RotateCcw,
  Copy,
  Check
} from 'lucide-react';
import { ChatMessage, ChatRole, SupportedLanguage } from '../types';
import { MicAudioRecorder, transcribeAudioWithGemini } from '../utils/audioUtils';

interface GeminiChatAssistantProps {
  language: SupportedLanguage;
  onOpenLiveVoice: () => void;
  onNavigateHome?: () => void;
}

const INITIAL_MESSAGES: Record<ChatRole, string> = {
  general: "Namaste! I am Setu Saheli, your community marketplace companion. Ask me anything about local services, finding verified tailors or cooks, fair pricing in your area, or getting raw materials!",
  advisor: "Namaste! I am your SHG & Financial Scheme Specialist. Ask me about Lakhpati Didi, DAY-NRLM bank linkage, Mudra loans, bookkeeping registers, food safety rules (FSSAI), or scaling your small enterprise.",
  fast: "Namaste! Setu Quick Helper ready. Ask any quick question for instant facts or quick service details."
};

const SUGGESTED_PROMPTS: Record<ChatRole, string[]> = {
  general: [
    "Find nearby blouse tailors or materials",
    "What is the average price for daily tiffin services?",
    "How does SHG verification work on SkillSetu?",
    "Show me tailoring shops or lace stores nearby"
  ],
  advisor: [
    "How can our SHG apply for a Mudra loan?",
    "What are the benefits of Lakhpati Didi Yojana?",
    "How to calculate pricing for homemade festive snacks?",
    "Do I need FSSAI for small home tiffin service?"
  ],
  fast: [
    "What is the standard rate for Kurti stitching?",
    "How to contact a seller directly?",
    "Nearby vegetable and spice wholesale market"
  ]
};

export const GeminiChatAssistant: React.FC<GeminiChatAssistantProps> = ({
  onOpenLiveVoice,
}) => {
  const [role, setRole] = useState<ChatRole>('general');
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-1',
      role: 'model',
      content: INITIAL_MESSAGES.general,
      timestamp: Date.now(),
      modelUsed: 'gemini-3.5-flash',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useSearch, setUseSearch] = useState(false);
  const [useMaps, setUseMaps] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'fetching' | 'available' | 'denied'>('idle');

  // Audio recording & transcription state (gemini-3.5-transcribe)
  const [isRecordingMic, setIsRecordingMic] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const recorderRef = useRef<MicAudioRecorder | null>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isTranscribing]);

  // Request user location if Maps Grounding is enabled
  const handleToggleMaps = () => {
    const nextState = !useMaps;
    setUseMaps(nextState);
    if (nextState) {
      setUseSearch(false); // Gemini guidelines: googleMaps cannot be combined with googleSearch
      if (!userLocation && navigator.geolocation) {
        setLocationStatus('fetching');
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setUserLocation({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            });
            setLocationStatus('available');
          },
          (err) => {
            console.warn('Geolocation denied or unavailable:', err.message);
            setLocationStatus('denied');
          },
          { timeout: 8000 }
        );
      }
    }
  };

  const handleToggleSearch = () => {
    const nextState = !useSearch;
    setUseSearch(nextState);
    if (nextState) {
      setUseMaps(false); // Mutually exclusive
    }
  };

  const handleSwitchRole = (newRole: ChatRole) => {
    if (newRole === role) return;
    setRole(newRole);
    setMessages([
      {
        id: `role-switch-${Date.now()}`,
        role: 'model',
        content: INITIAL_MESSAGES[newRole],
        timestamp: Date.now(),
        modelUsed: newRole === 'advisor' ? 'gemini-3.1-pro-preview' : newRole === 'fast' ? 'gemini-3.1-flash-lite' : 'gemini-3.5-flash',
      },
    ]);
  };

  // Microphone Audio Recording & Transcription with gemini-3.5-transcribe
  const handleToggleMicRecording = async () => {
    if (isRecordingMic) {
      // Stop recording and send to /api/transcribe
      setIsRecordingMic(false);
      setIsTranscribing(true);
      try {
        if (!recorderRef.current) return;
        const { base64, mimeType } = await recorderRef.current.stop();
        const transcription = await transcribeAudioWithGemini(base64, mimeType);
        if (transcription.trim()) {
          setInputText((prev) => (prev ? `${prev} ${transcription.trim()}` : transcription.trim()));
        }
      } catch (err: any) {
        console.error('Transcription error:', err);
        alert(`Transcription notice: ${err?.message || 'Could not transcribe audio'}`);
      } finally {
        setIsTranscribing(false);
        recorderRef.current = null;
      }
    } else {
      // Start recording
      try {
        const recorder = new MicAudioRecorder();
        await recorder.start();
        recorderRef.current = recorder;
        setIsRecordingMic(true);
      } catch (err: any) {
        console.error('Microphone access denied:', err);
        alert('Please allow microphone permissions to use voice transcription.');
      }
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = (textToSend !== undefined ? textToSend : inputText).trim();
    if (!prompt || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: prompt,
      timestamp: Date.now(),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputText('');
    setIsLoading(true);

    try {
      // Format messages for server API (preserving multi-turn conversation)
      const formattedHistory = newHistory.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: formattedHistory,
          role,
          useSearch,
          useMaps,
          userLocation,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to get response from Gemini');
      }

      const assistantMessage: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: data.text || 'I could not generate an answer at this moment.',
        timestamp: Date.now(),
        modelUsed: data.modelUsed,
        sources: data.sources && data.sources.length > 0 ? data.sources : undefined,
        mapPlaces: data.mapPlaces && data.mapPlaces.length > 0 ? data.mapPlaces : undefined,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        content: `Notice: ${err?.message || 'Could not connect to Gemini service.'} Please try again.`,
        timestamp: Date.now(),
        modelUsed: 'system',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        content: INITIAL_MESSAGES[role],
        timestamp: Date.now(),
        modelUsed: role === 'advisor' ? 'gemini-3.1-pro-preview' : role === 'fast' ? 'gemini-3.1-flash-lite' : 'gemini-3.5-flash',
      },
    ]);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header card with role selector and Live Voice button */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-[#1E4D38] text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#DDA74F]" />
              </div>
              <h1 className="text-2xl font-black text-[#1E4D38] tracking-tight">
                Setu Saheli AI Assistant
              </h1>
            </div>
            <p className="text-sm text-[#6A5D54]">
              Multi-turn conversational guide powered by Google Gemini, Google Search & Maps Grounding.
            </p>
          </div>

          {/* Action buttons: Live Voice + Reset */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenLiveVoice}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#1E4D38] to-[#28664B] text-white font-bold text-sm flex items-center gap-2 hover:shadow-md transition-all cursor-pointer border border-[#DDA74F]/40 hover:scale-[1.02]"
            >
              <Radio className="w-4 h-4 text-[#DDA74F] animate-pulse" />
              <span>Live Voice Call</span>
              <span className="text-[10px] bg-[#DDA74F] text-[#1E4D38] px-1.5 py-0.5 rounded font-black">
                gemini-3.8-live
              </span>
            </button>

            <button
              onClick={handleResetChat}
              className="p-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
              title="Reset Conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Roles Tabs */}
        <div className="mt-6 pt-5 border-t border-stone-100 flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            Assistant Role:
          </span>

          <button
            onClick={() => handleSwitchRole('general')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              role === 'general'
                ? 'bg-[#1E4D38] text-white shadow-sm'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Community Guide
            <span className="text-[10px] opacity-80 font-mono">gemini-3.5-flash</span>
          </button>

          <button
            onClick={() => handleSwitchRole('advisor')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              role === 'advisor'
                ? 'bg-[#C2542D] text-white shadow-sm'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            SHG & Scheme Advisor (Complex)
            <span className="text-[10px] opacity-80 font-mono">gemini-3.1-pro-preview</span>
          </button>

          <button
            onClick={() => handleSwitchRole('fast')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              role === 'fast'
                ? 'bg-[#2A221E] text-white shadow-sm'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Quick Helper (Fast)
            <span className="text-[10px] opacity-80 font-mono">gemini-3.1-flash-lite</span>
          </button>
        </div>

        {/* Real-time Grounding Toggles */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-stone-500 font-medium">Grounding Tools:</span>

          <button
            onClick={handleToggleMaps}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              useMaps
                ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
            }`}
            title="Ground answers with Google Maps data (places, reviews, addresses)"
          >
            <MapPin className="w-3 h-3" />
            Google Maps Grounding
            {useMaps && (
              <span className="text-[10px] bg-blue-700 px-1.5 py-0.2 rounded font-mono">
                {locationStatus === 'available' ? '📍 GPS Active' : 'Active'}
              </span>
            )}
          </button>

          <button
            onClick={handleToggleSearch}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              useSearch
                ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
            }`}
            title="Ground answers with live Google Search results"
          >
            <Globe className="w-3 h-3" />
            Google Search Grounding
            {useSearch && (
              <span className="text-[10px] bg-emerald-800 px-1.5 py-0.2 rounded font-mono">
                Active
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Chat Thread Container */}
      <div className="bg-white rounded-3xl shadow-sm border border-stone-200/80 flex flex-col h-[600px] overflow-hidden">
        {/* Scrollable Messages Thread */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {messages.map((msg) => {
            const isModel = msg.role === 'model';
            return (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${isModel ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                    isModel ? 'bg-[#1E4D38] text-white' : 'bg-[#C2542D] text-white'
                  }`}
                >
                  {isModel ? <Bot className="w-5 h-5 text-[#DDA74F]" /> : <User className="w-5 h-5" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[82%] rounded-3xl p-4 sm:p-5 text-sm leading-relaxed ${
                    isModel
                      ? 'bg-[#FAF5EB] text-[#2A221E] border border-stone-200/70 shadow-xs'
                      : 'bg-[#1E4D38] text-white shadow-xs rounded-tr-none'
                  }`}
                >
                  {/* Model header info */}
                  {isModel && (
                    <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-stone-200/60 text-xs text-[#6A5D54]">
                      <span className="font-bold text-[#1E4D38] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#DDA74F]" />
                        {msg.modelUsed?.includes('pro') 
                          ? 'SHG Advisor (gemini-3.1-pro-preview)'
                          : msg.modelUsed?.includes('lite')
                          ? 'Quick Helper (gemini-3.1-flash-lite)'
                          : 'Setu Saheli (gemini-3.5-flash)'}
                      </span>
                      <button
                        onClick={() => copyToClipboard(msg.id, msg.content)}
                        className="p-1 hover:bg-stone-200/60 rounded text-stone-500 transition-colors cursor-pointer"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}

                  {/* Message Body */}
                  <div className="whitespace-pre-wrap font-sans text-[14.5px] leading-relaxed">
                    {msg.content}
                  </div>

                  {/* Google Maps Grounded Place Cards */}
                  {msg.mapPlaces && msg.mapPlaces.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-stone-200">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 mb-2">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Google Maps Locations & Places:</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {msg.mapPlaces.map((place, idx) => (
                          <a
                            key={idx}
                            href={place.uri || `https://maps.google.com/?q=${encodeURIComponent(place.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-xl bg-white border border-blue-200 hover:border-blue-400 hover:shadow-xs transition-all flex flex-col justify-between group text-xs text-[#2A221E]"
                          >
                            <div>
                              <div className="font-bold group-hover:text-blue-700 flex items-center justify-between">
                                <span className="truncate">{place.title}</span>
                                <ExternalLink className="w-3 h-3 text-blue-500 shrink-0 ml-1" />
                              </div>
                              {place.address && (
                                <p className="text-[11px] text-stone-500 mt-0.5 truncate">{place.address}</p>
                              )}
                              {place.snippet && (
                                <p className="text-[11px] text-stone-600 mt-1 italic line-clamp-2">
                                  &ldquo;{place.snippet}&rdquo;
                                </p>
                              )}
                            </div>
                            <span className="text-[10px] text-blue-600 font-semibold mt-2 flex items-center gap-1">
                              View on Google Maps →
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Google Search Grounded Web Sources */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-stone-200">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 mb-2">
                        <Globe className="w-3.5 h-3.5" />
                        <span>Search Sources & References:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.sources.map((src, idx) => (
                          <a
                            key={idx}
                            href={src.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs transition-colors"
                          >
                            <span className="max-w-[200px] truncate font-medium">{src.title}</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Loading bubble */}
          {isLoading && (
            <div className="flex gap-3.5 items-start">
              <div className="w-9 h-9 rounded-2xl bg-[#1E4D38] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Bot className="w-5 h-5 text-[#DDA74F]" />
              </div>
              <div className="bg-[#FAF5EB] rounded-3xl p-4 text-sm text-[#6A5D54] border border-stone-200 flex items-center gap-3">
                <Loader2 className="w-4 h-4 animate-spin text-[#1E4D38]" />
                <span>
                  {useMaps 
                    ? 'Retrieving Google Maps data with gemini-3.5-flash...' 
                    : useSearch 
                    ? 'Searching Google web data with gemini-3.5-flash...' 
                    : role === 'advisor'
                    ? 'Analyzing with gemini-3.1-pro-preview...'
                    : 'Setu Saheli is thinking...'}
                </span>
              </div>
            </div>
          )}

          {/* Audio Transcribing indicator */}
          {isTranscribing && (
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-700" />
              <span>Transcribing microphone audio using model <strong>gemini-3.5-transcribe</strong>...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Pills */}
        <div className="px-6 py-2.5 bg-stone-50 border-t border-stone-200/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-stone-400 uppercase shrink-0">Try asking:</span>
          {SUGGESTED_PROMPTS[role].map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="px-3 py-1 rounded-full bg-white hover:bg-stone-200 text-stone-700 text-xs border border-stone-200 shrink-0 transition-colors cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar with Microphone (gemini-3.5-transcribe) */}
        <div className="p-4 bg-white border-t border-stone-200">
          <div className="flex items-end gap-2 bg-[#FAF5EB] rounded-2xl p-2 border border-stone-300 focus-within:border-[#1E4D38] focus-within:ring-2 focus-within:ring-[#1E4D38]/20 transition-all">
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isRecordingMic
                  ? 'Listening to microphone... Speak clearly and tap the red mic when finished.'
                  : 'Ask a question or describe what you need in Hindi, Kannada, Tamil, English...'
              }
              rows={1}
              className="flex-1 bg-transparent resize-none border-none outline-none text-sm text-[#2A221E] px-2 py-1.5 max-h-28 min-h-[38px] placeholder:text-stone-400"
            />

            {/* Audio Transcription Microphone Button (gemini-3.5-transcribe) */}
            <button
              type="button"
              onClick={handleToggleMicRecording}
              disabled={isLoading || isTranscribing}
              className={`p-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                isRecordingMic
                  ? 'bg-red-600 text-white animate-pulse shadow-md'
                  : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
              }`}
              title={isRecordingMic ? 'Stop recording & transcribe with gemini-3.5-transcribe' : 'Transcribe voice with gemini-3.5-transcribe'}
            >
              {isRecordingMic ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-[#1E4D38]" />}
            </button>

            {/* Send Button */}
            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isLoading}
              className="p-2.5 rounded-xl bg-[#1E4D38] text-white hover:bg-[#163829] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Micro-label for user awareness */}
          <div className="mt-2 flex items-center justify-between text-[11px] text-stone-400 px-1">
            <span>
              Microphone transcription powered by <strong>gemini-3.5-transcribe</strong>.
            </span>
            <span>Press Enter to send (Shift+Enter for newline)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
