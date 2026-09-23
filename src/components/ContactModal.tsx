import React, { useState, useEffect } from 'react';
import { SellerListing, SupportedLanguage } from '../types';
import { TRANSLATIONS, LANGUAGE_OPTIONS } from '../translations';
import { TypeSpeakControl } from './TypeSpeakControl';
import { translateText } from '../utils/translationService';
import { 
  X, 
  Phone, 
  MessageSquare, 
  Send, 
  CheckCircle, 
  HeartHandshake,
  Sparkles,
  Loader2,
  Languages,
  ArrowRight
} from 'lucide-react';

interface ContactModalProps {
  seller: SellerListing;
  language: SupportedLanguage;
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  seller,
  language,
  isOpen,
  onClose,
}) => {
  const t = TRANSLATIONS[language];
  const [customNote, setCustomNote] = useState('');
  const [inquirySent, setInquirySent] = useState(false);

  // Auto-translation for seller's native language
  const targetSellerLang: SupportedLanguage = seller.originalLanguage || (language === 'hi' ? 'en' : 'hi');
  const sellerLangOption = LANGUAGE_OPTIONS.find((l) => l.id === targetSellerLang) || LANGUAGE_OPTIONS[0];
  const buyerLangOption = LANGUAGE_OPTIONS.find((l) => l.id === language) || LANGUAGE_OPTIONS[0];

  const [sellerTranslatedNote, setSellerTranslatedNote] = useState('');
  const [isTranslatingNote, setIsTranslatingNote] = useState(false);

  // Auto-translate custom note to seller's language via Gemini
  useEffect(() => {
    if (!customNote.trim()) {
      setSellerTranslatedNote('');
      return;
    }

    if (language === targetSellerLang) {
      setSellerTranslatedNote(customNote);
      return;
    }

    const timer = setTimeout(async () => {
      setIsTranslatingNote(true);
      try {
        const translated = await translateText(customNote, targetSellerLang, language);
        setSellerTranslatedNote(translated);
      } catch (err) {
        console.warn('Note translation error:', err);
      } finally {
        setIsTranslatingNote(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [customNote, targetSellerLang, language]);

  if (!isOpen) return null;

  const phoneNumber = seller.phone || '+91 98765 43210';
  const rawWhatsApp = seller.whatsapp || '919876543210';

  const defaultGreetingByLang: Record<SupportedLanguage, string> = {
    en: `Hello ${seller.name} ji, I saw your ${seller.category} service listing on SkillSetu. I would like more details.`,
    hi: `नमस्ते ${seller.name} जी, मैंने SkillSetu पर आपकी ${seller.category} की सेवा देखी है। मुझे इस बारे में जानकारी चाहिए।`,
    kn: `ನಮಸ್ಕಾರ ${seller.name} ಅವರೇ, ನಾನು SkillSetu ನಲ್ಲಿ ನಿಮ್ಮ ${seller.category} ಸೇವೆಯ ಪಟ್ಟಿಯನ್ನು ನೋಡಿದ್ದೇನೆ. ಹೆಚ್ಚಿನ ವಿವರಗಳು ಬೇಕು.`,
    ta: `வணக்கம் ${seller.name} அவர்களே, நான் SkillSetu தளத்தில் உங்கள் ${seller.category} சேவையைப் பார்த்தேன். விவரங்கள் தேவை.`,
    te: `నమస్కారం ${seller.name} గారూ, నేను SkillSetu లో మీ ${seller.category} సేవా వివరాలను చూశాను. నాకు వివరాలు కావాలి.`,
  };

  const greetingInSellerLang = defaultGreetingByLang[targetSellerLang] || defaultGreetingByLang.en;

  const finalWhatsAppMessage = customNote
    ? sellerTranslatedNote && sellerTranslatedNote !== customNote
      ? `${greetingInSellerLang}\n\n[${sellerLangOption.nativeName}]: ${sellerTranslatedNote}\n[${buyerLangOption.nativeName} Original]: ${customNote}\n\n(Sent via SkillSetu)`
      : `${greetingInSellerLang}\n\n${customNote}\n\n(Sent via SkillSetu)`
    : greetingInSellerLang;

  const whatsappUrl = `https://wa.me/${rawWhatsApp}?text=${encodeURIComponent(finalWhatsAppMessage)}`;

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySent(true);
  };

  const handleTemplateClick = (text: string) => {
    setCustomNote((prev) => (prev ? `${prev} ${text}` : text));
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        id="contact-seller-modal"
        className="relative bg-[#FFFDF9] w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border-2 border-[#EADBCE] animate-scaleIn my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#FAF5EB] p-5 sm:p-6 border-b border-[#EADBCE] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={seller.photo}
              alt={seller.name}
              className="w-14 h-14 rounded-2xl object-cover border border-[#D8C7B5]"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xl font-bold font-heritage text-[#3D2B1F]">
                  {t.contactModal.contactTitle(seller.name)}
                </h3>
              </div>
              <p className="text-xs text-[#6B5749]">
                {t.categories[seller.category]?.title || seller.category} • <span className="font-bold text-[#C2542D]">{seller.price}</span>
              </p>
            </div>
          </div>

          <button
            id="close-contact-modal-btn"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#FFFDF9] border border-[#D8C7B5] flex items-center justify-center text-[#6B5749] hover:text-[#3D2B1F] hover:bg-[#EFE4D3] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Quick Direct Actions */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-[#6B5749] uppercase tracking-wider">
              {t.contactModal.directOptionsLabel}
            </p>

            {/* Direct Phone Call */}
            <a
              id="modal-phone-call-btn"
              href={`tel:${phoneNumber.replace(/\s+/g, '')}`}
              className="w-full py-3.5 px-4 rounded-xl bg-[#1E4D38] hover:bg-[#143526] text-white font-bold text-base flex items-center justify-center gap-2.5 transition-colors shadow-xs"
            >
              <Phone className="w-5 h-5" />
              <span>{t.contactModal.callPhoneBtn(phoneNumber)}</span>
            </a>

            {/* WhatsApp Chat */}
            <a
              id="modal-whatsapp-btn"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-base flex items-center justify-center gap-2.5 transition-colors shadow-xs"
            >
              <MessageSquare className="w-5 h-5" />
              <span>{t.contactModal.messageWhatsAppBtn}</span>
            </a>
          </div>

          {/* Quick Questions Helper */}
          <div>
            <p className="text-xs font-bold text-[#6B5749] uppercase tracking-wider mb-2">
              {t.contactModal.quickQuestionsLabel}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleTemplateClick(t.contactModal.qAvailability)}
                className="text-xs font-medium px-3 py-1.5 rounded-xl bg-[#FAF5EB] border border-[#EADBCE] text-[#3D2B1F] hover:bg-[#EFE4D3] transition-colors cursor-pointer"
              >
                📅 {t.contactModal.qAvailability}
              </button>
              <button
                type="button"
                onClick={() => handleTemplateClick(t.contactModal.qHomeVisit)}
                className="text-xs font-medium px-3 py-1.5 rounded-xl bg-[#FAF5EB] border border-[#EADBCE] text-[#3D2B1F] hover:bg-[#EFE4D3] transition-colors cursor-pointer"
              >
                🏠 {t.contactModal.qHomeVisit}
              </button>
              <button
                type="button"
                onClick={() => handleTemplateClick(t.contactModal.qPriceDetails)}
                className="text-xs font-medium px-3 py-1.5 rounded-xl bg-[#FAF5EB] border border-[#EADBCE] text-[#3D2B1F] hover:bg-[#EFE4D3] transition-colors cursor-pointer"
              >
                💰 {t.contactModal.qPriceDetails}
              </button>
            </div>
          </div>

          {/* "What do you need?" Field with Type / Speak Toggle & Auto-Translate */}
          <form onSubmit={handleSendInquiry} className="space-y-3 pt-2 border-t border-[#EADBCE]">
            <TypeSpeakControl
              id="buyer-inquiry-note"
              label={t.contactModal.sendNoteLabel}
              helperText={`Type or speak in ${buyerLangOption.nativeName}. It will be auto-translated for ${seller.name} into ${sellerLangOption.nativeName}.`}
              value={customNote}
              onChange={setCustomNote}
              placeholder={t.contactModal.notePlaceholder}
              language={language}
              isTextarea
              rows={3}
            />

            {/* Auto-Translation Live Preview for Seller */}
            {customNote.trim() && language !== targetSellerLang && (
              <div className="p-3 rounded-2xl bg-[#EEF6F2] border border-[#C7E4D3] space-y-1.5 animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-bold text-[#1E4D38]">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C2542D]" />
                    <span>Auto-Translated for {seller.name} ({sellerLangOption.nativeName}):</span>
                  </div>
                  {isTranslatingNote && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C2542D]" />}
                </div>

                <p className="text-xs sm:text-sm text-[#1E4D38] font-medium italic">
                  "{sellerTranslatedNote || 'Translating with Gemini...'}"
                </p>

                <p className="text-[11px] text-[#426653]">
                  ✓ The seller will receive your message translated into {sellerLangOption.nativeName} so she can understand easily.
                </p>
              </div>
            )}

            {inquirySent ? (
              <div className="p-3 bg-[#EEF6F2] border border-[#C7E4D3] rounded-xl text-[#1E4D38] text-sm font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>{t.contactModal.messageNoted(seller.name)}</span>
              </div>
            ) : (
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-[#FAF5EB] hover:bg-[#EFE4D3] border border-[#D8C7B5] text-[#3D2B1F] font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4 text-[#C2542D]" />
                <span>{t.contactModal.saveAndWhatsAppBtn}</span>
              </button>
            )}
          </form>

          {/* Safety & Trust Note */}
          <div className="p-4 rounded-2xl bg-[#FAF5EB] border border-[#EADBCE] text-xs text-[#5C4433] flex items-start gap-2.5">
            <HeartHandshake className="w-5 h-5 shrink-0 text-[#D49B24] mt-0.5" />
            <div className="leading-relaxed">
              <strong className="block text-[#3D2B1F] mb-0.5">{t.contactModal.promiseTitle}</strong>
              {t.contactModal.promiseDesc(seller.name)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
