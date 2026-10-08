import React, { useState } from 'react';
import { SupportedLanguage, UserRole, ProviderType, MockUser } from '../types';
import { LANGUAGE_OPTIONS, TRANSLATIONS } from '../translations';
import { 
  getMockUser, 
  saveMockUser, 
  getStoredCommunity 
} from '../utils/communityStorage';
import { 
  ShoppingBag, 
  Sparkles, 
  Users, 
  UserCheck, 
  Building2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Phone, 
  User, 
  Check, 
  HelpCircle,
  Award
} from 'lucide-react';

interface RoleSelectionScreenProps {
  language: SupportedLanguage;
  onSelectBuyer: () => void;
  onSelectShgMember: () => void;
  onSelectIndependent: () => void;
  onSelectCommunity: () => void;
  onSelectCommunityDashboard: () => void;
  onChangeLanguage: () => void;
}

const ROLE_TEXTS: Record<SupportedLanguage, {
  changeLanguage: string;
  quickSignIn: string;
  fullName: string;
  namePlaceholder: string;
  phoneLabel: string;
  mainTitle: string;
  mainSubtitle: string;
  buyerBadge: string;
  buyerTitle: string;
  buyerQuote: string;
  buyerBullet1: string;
  buyerBullet2: string;
  buyerBullet3: string;
  buyerBtn: string;
  providerBadge: string;
  providerTitle: string;
  providerQuote: string;
  providerBullet1: string;
  providerBullet2: string;
  providerBullet3: string;
  providerBtn: string;
  providerTypeTitle: string;
  providerTypeSubtitle: string;
  shgTitle: string;
  shgDesc: string;
  shgBtn: string;
  indepTitle: string;
  indepDesc: string;
  indepBtn: string;
  commTitle: string;
  commDesc: string;
  commBtn: string;
  featured: string;
}> = {
  en: {
    changeLanguage: 'Change Language',
    quickSignIn: 'Quick Sign-in (Stored on this device)',
    fullName: 'Your Full Name',
    namePlaceholder: 'e.g. Anita Sharma',
    phoneLabel: 'Mobile Number',
    mainTitle: 'How are you participating?',
    mainSubtitle: 'Select your role to get started on SkillSetu',
    buyerBadge: 'Local Shopper',
    buyerTitle: 'I am a Buyer',
    buyerQuote: 'I want to purchase products or services from verified providers',
    buyerBullet1: 'Browse verified tailoring, cooking, tutoring & crafts',
    buyerBullet2: 'Direct WhatsApp & call contact with zero commission',
    buyerBullet3: 'Multilingual audio and AI assistance in your dialect',
    buyerBtn: 'Enter as Buyer (Search Services)',
    providerBadge: 'Earner / Artisan / Leader',
    providerTitle: 'I am a Provider',
    providerQuote: 'I provide products or services to buyers',
    providerBullet1: 'List your tailoring, cooking, tuition or handmade craft',
    providerBullet2: 'Receive verified badges and village community trust',
    providerBullet3: 'Register your SHG collective or community group',
    providerBtn: 'Continue as Provider',
    providerTypeTitle: 'What type of provider are you?',
    providerTypeSubtitle: 'Select the provider category that fits your work best',
    shgTitle: 'SHG Member',
    shgDesc: 'Part of a Self-Help Group (Bachat Gat / Mahila Mandal). Create an individual service listing backed by group endorsement.',
    shgBtn: 'Create Service Listing',
    indepTitle: 'Independent Participant',
    indepDesc: 'Individual skilled woman artisan, home baker, tutor, or tailor working independently for neighborhood buyers.',
    indepBtn: 'Create Service Listing',
    commTitle: 'Community',
    commDesc: 'Register your community and bring verified members onto the platform.',
    commBtn: 'Register Community (4-Step Wizard)',
    featured: 'Featured',
  },
  hi: {
    changeLanguage: 'भाषा बदलें',
    quickSignIn: 'त्वरित साइन-इन (इस फोन पर सुरक्षित)',
    fullName: 'आपका पूरा नाम',
    namePlaceholder: 'जैसे: अनिता शर्मा',
    phoneLabel: 'मोबाइल नंबर',
    mainTitle: 'आप किस रूप में जुड़ना चाहते हैं?',
    mainSubtitle: 'SkillSetu पर शुरुआत करने के लिए अपनी भूमिका चुनें',
    buyerBadge: 'स्थानीय खरीदार',
    buyerTitle: 'मैं खरीदार हूँ',
    buyerQuote: 'मैं सत्यापित सेवा प्रदाताओं से सेवाएं या उत्पाद लेना चाहता हूँ',
    buyerBullet1: 'सत्यापित सिलाई, खाना, ट्यूशन और हस्तकला खोजें',
    buyerBullet2: 'बिना किसी कमीशन के सीधे फोन या व्हाट्सएप पर बात करें',
    buyerBullet3: 'अपनी भाषा में बोलकर खोज और ऑडियो सहायता',
    buyerBtn: 'खरीदार के रूप में प्रवेश करें',
    providerBadge: 'कमाई / हुनरमंद / उद्यमी',
    providerTitle: 'मैं सेवा प्रदाता हूँ',
    providerQuote: 'मैं ग्राहकों को अपने हुनर की सेवाएं या उत्पाद देती हूँ',
    providerBullet1: 'अपनी सिलाई, खाना, ट्यूशन या हस्तकला की लिस्टिंग बनाएं',
    providerBullet2: 'सत्यापित पहचान और समुदाय का विश्वास प्राप्त करें',
    providerBullet3: 'अपने स्वयं सहायता समूह (SHG) या समुदाय को जोड़ें',
    providerBtn: 'सेवा प्रदाता के रूप में आगे बढ़ें',
    providerTypeTitle: 'आप किस प्रकार की सेवा प्रदाता हैं?',
    providerTypeSubtitle: 'अपने काम के अनुसार सही श्रेणी चुनें',
    shgTitle: 'स्वयं सहायता समूह सदस्य',
    shgDesc: 'महिला बचत गट / महिला मंडल की सदस्य। समूह के भरोसे के साथ अपनी व्यक्तिगत सेवा जोड़ें।',
    shgBtn: 'सेवा लिस्टिंग बनाएं',
    indepTitle: 'स्वतंत्र हुनरमंद',
    indepDesc: 'सिलाई, खाना, ट्यूशन या हस्तकला का स्वतंत्र काम करने वाली हुनरमंद महिला।',
    indepBtn: 'सेवा लिस्टिंग बनाएं',
    commTitle: 'सामूहिक संगठन',
    commDesc: 'अपने समुदाय को पंजीकृत करें और सत्यापित सदस्यों को जोड़ें।',
    commBtn: 'समुदाय पंजीकृत करें',
    featured: 'विशेष',
  },
  kn: {
    changeLanguage: 'ಭಾಷೆ ಬದಲಾಯಿಸಿ',
    quickSignIn: 'ತ್ವರಿತ ಸೈನ್-ಇನ್ (ಈ ಸಾಧನದಲ್ಲಿ ಸಂಗ್ರಹಿಸಲಾಗಿದೆ)',
    fullName: 'ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು',
    namePlaceholder: 'ಉದಾ: ಅನಿತಾ ಶರ್ಮಾ',
    phoneLabel: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
    mainTitle: 'ನೀವು ಹೇಗೆ ಭಾಗವಹಿಸುತ್ತಿದ್ದೀರಿ?',
    mainSubtitle: 'SkillSetu ನಲ್ಲಿ ಮುಂದುವರಿಯಲು ನಿಮ್ಮ ಪಾತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    buyerBadge: 'ಸ್ಥಳೀಯ ಗ್ರಾಹಕ',
    buyerTitle: 'ನಾನು ಖರೀದಿದಾರ',
    buyerQuote: 'ದೃಢೀಕೃತ ಮಹಿಳೆಯರಿಂದ ಉತ್ಪನ್ನ ಅಥವಾ ಸೇವೆಗಳನ್ನು ಪಡೆಯಲು ಬಯಸುತ್ತೇನೆ',
    buyerBullet1: 'ದೃಢೀಕೃತ ಹೊಲಿಗೆ, ಅಡುಗೆ, ಪಾಠ ಮತ್ತು ಕರಕುಶಲತೆ ವೀಕ್ಷಿಸಿ',
    buyerBullet2: 'ಯಾವುದೇ ಕಮಿಷನ್ ಇಲ್ಲದೆ ನೇರ ವಾಟ್ಸಾಪ್ ಮತ್ತು ಫೋನ್ ಸಂಪರ್ಕ',
    buyerBullet3: 'ನಿಮ್ಮ ಮಾತೃಭಾಷೆಯಲ್ಲಿ ಆಡಿಯೋ ಮತ್ತು ಧ್ವನಿ ಬೆಂಬಲ',
    buyerBtn: 'ಖರೀದಿದಾರರಾಗಿ ಮುಂದುವರಿಯಿರಿ',
    providerBadge: 'ಕೌಶಲ್ಯವಂತೆ / ಕುಶಲಕರ್ಮಿ',
    providerTitle: 'ನಾನು ಸೇವಾಕರ್ತೆ',
    providerQuote: 'ನಾನು ಗ್ರಾಹಕರಿಗೆ ನನ್ನ ಕೌಶಲ್ಯದ ಸೇವೆಗಳನ್ನು ನೀಡುತ್ತೇನೆ',
    providerBullet1: 'ನಿಮ್ಮ ಹೊಲಿಗೆ, ಅಡುಗೆ, ಪಾಠ ಅಥವಾ ಕರಕುಶಲ ಸೇವೆಯನ್ನು ಪಟ್ಟಿ ಮಾಡಿ',
    providerBullet2: 'ದೃಢೀಕೃತ ಬ್ಯಾಡ್ಜ್ ಮತ್ತು ಸಮುದಾಯದ ವಿಶ್ವಾಸ ಗಳಿಸಿ',
    providerBullet3: 'ನಿಮ್ಮ ಸ್ವಸಹಾಯ ಸಂಘ ಅಥವಾ ಸಮುದಾಯ ಗುಂಪನ್ನು ನೋಂದಾಯಿಸಿ',
    providerBtn: 'ಸೇವಾಕರ್ತೆಯಾಗಿ ಮುಂದುವರಿಯಿರಿ',
    providerTypeTitle: 'ನೀವು ಯಾವ ರೀತಿಯ ಸೇವಾಕರ್ತೆ?',
    providerTypeSubtitle: 'ನಿಮ್ಮ ಕೆಲಸಕ್ಕೆ ಸೂಕ್ತವಾದ ವರ್ಗವನ್ನು ಆರಿಸಿ',
    shgTitle: 'ಸ್ವಸಹಾಯ ಸಂಘದ ಸದಸ್ಯೆ',
    shgDesc: 'ಸ್ವಸಹಾಯ ಸಂಘದ (ಬಚತ್ ಗಟ್) ಸದಸ್ಯೆ. ಸಂಘದ ಬೆಂಬಲದೊಂದಿಗೆ ವೈಯಕ್ತಿಕ ಸೇವೆ ಪಟ್ಟಿ ಮಾಡಿ.',
    shgBtn: 'ಸೇವಾ ಪಟ್ಟಿ ರಚಿಸಿ',
    indepTitle: 'ಸ್ವತಂತ್ರ ಸೇವಾಕರ್ತೆ',
    indepDesc: 'ಸ್ವತಂತ್ರವಾಗಿ ಹೊಲಿಗೆ, ಅಡುಗೆ, ಪಾಠ ಅಥವಾ ಕರಕುಶಲ ಕೆಲಸ ಮಾಡುವ ಮಹಿಳೆ.',
    indepBtn: 'ಸೇವಾ ಪಟ್ಟಿ ರಚಿಸಿ',
    commTitle: 'ಸಮುದಾಯ ಸಂಘಟನೆ',
    commDesc: 'ನಿಮ್ಮ ಸಮುದಾಯವನ್ನು ನೋಂದಾಯಿಸಿ ಸದಸ್ಯರನ್ನು ವೇದಿಕೆಗೆ ತನ್ನಿ.',
    commBtn: 'ಸಮುದಾಯ ನೋಂದಾಯಿಸಿ',
    featured: 'ವಿಶೇಷ',
  },
  ta: {
    changeLanguage: 'மொழி மாற்றுக',
    quickSignIn: 'விரைவு உள்நுழைவு (இந்த சாதனத்தில் சேமிக்கப்பட்டது)',
    fullName: 'உங்கள் முழு பெயர்',
    namePlaceholder: 'உதா: அனிதா சர்மா',
    phoneLabel: 'கைபேசி எண்',
    mainTitle: 'நீங்கள் எவ்வாறு இணைகிறீர்கள்?',
    mainSubtitle: 'SkillSetu இல் தொடங்க உங்கள் பங்களிப்பைத் தேர்வுசெய்யவும்',
    buyerBadge: 'உள்ளூர் வாடிக்கையாளர்',
    buyerTitle: 'நான் வாங்குபவர்',
    buyerQuote: 'சரிபார்க்கப்பட்ட பெண்களிடமிருந்து தயாரிப்புகள் அல்லது சேவைகளைப் பெற விரும்புகிறேன்',
    buyerBullet1: 'தையல், சமையல், கல்வி மற்றும் கைவினை சேவைகளைப் பாருங்கள்',
    buyerBullet2: 'கமிஷன் இன்றி நேரடி வாட்ஸ்அப் மற்றும் போன் தொடர்பு',
    buyerBullet3: 'உங்கள் மொழியில் குரல் மற்றும் உதவி',
    buyerBtn: 'வாங்குபவராக தொடரவும்',
    providerBadge: 'வருமானம் / கைவினைஞர்',
    providerTitle: 'நான் சேவை வழங்குநர்',
    providerQuote: 'நான் வாடிக்கையாளர்களுக்கு என் சேவை அல்லது தயாரிப்புகளை வழங்குகிறேன்',
    providerBullet1: 'தையல், சமையல், பாடம் அல்லது கைவினை சேவையைப் பட்டியலிடுங்கள்',
    providerBullet2: 'சரிபார்க்கப்பட்ட பேட்ஜ் மற்றும் சமூக நம்பிக்கையைப் பெறுங்கள்',
    providerBullet3: 'உங்கள் சுயஉதவி குழுவை இணைக்கவும்',
    providerBtn: 'சேவை வழங்குநராக தொடரவும்',
    providerTypeTitle: 'நீங்கள் எந்த வகையான சேவை வழங்குநர்?',
    providerTypeSubtitle: 'உங்கள் பணிக்கு ஏற்ற வகையைத் தேர்ந்தெடுக்கவும்',
    shgTitle: 'சுயஉதவி குழு உறுப்பினர்',
    shgDesc: 'மகளிர் சுயஉதவிக் குழு உறுப்பினர். குழுவின் ஆதரவுடன் தனிப்பட்ட சேவையை உருவாக்குங்கள்.',
    shgBtn: 'சேவை பட்டியலை உருவாக்கவும்',
    indepTitle: 'சுயாதீன கலைஞர்',
    indepDesc: 'சுயமாக தையல், சமையல் அல்லது பாடம் கற்பிக்கும் திறமை வாய்ந்த பெண்.',
    indepBtn: 'சேவை பட்டியலை உருவாக்கவும்',
    commTitle: 'சமூக கூட்டமைப்பு',
    commDesc: 'உங்கள் சமூகத்தைப் பதிவு செய்து உறுப்பினர்களை இணையுங்கள்.',
    commBtn: 'சமூகத்தைப் பதிவு செய்க',
    featured: 'சிறப்பு',
  },
  te: {
    changeLanguage: 'భాషను మార్చండి',
    quickSignIn: 'త్వరిత సైన్-ఇన్ (ఈ పరికరంలో భద్రపరచబడింది)',
    fullName: 'మీ పూర్తి పేరు',
    namePlaceholder: 'ఉదా: అనిత శర్మ',
    phoneLabel: 'మొబైల్ నంబర్',
    mainTitle: 'మీరు ఎలా పాల్గొంటున్నారు?',
    mainSubtitle: 'SkillSetu లో ప్రారంభించడానికి మీ పాత్రను ఎంచుకోండి',
    buyerBadge: 'స్థానిక కొనుగోలుదారు',
    buyerTitle: 'నేను కొనుగోలుదారుని',
    buyerQuote: 'ధృవీకరించబడిన ప్రొవైడర్ల నుండి ఉత్పత్తులు లేదా సేవలను పొందాలనుకుంటున్నాను',
    buyerBullet1: 'కుట్టుపని, వంట, ట్యూషన్ మరియు చేతిపనుల సేవలను చూడండి',
    buyerBullet2: 'ఎటువంటి కమీషన్ లేకుండా ప్రత్యక్ష వాట్సాప్ మరియు ఫోన్ కాల్',
    buyerBullet3: 'మీ భాషలో ఆడియో మరియు వాయిస్ సహాయం',
    buyerBtn: 'కొనుగోలుదారుగా ప్రవేశించండి',
    providerBadge: 'ఉపాధి / కళాకారిణి',
    providerTitle: 'నేను సేవా ప్రదాతని',
    providerQuote: 'నేను కొనుగోలుదారులకు నా నైపుణ్య సేవలను అందిస్తాను',
    providerBullet1: 'మీ కుట్టుపని, వంట, ట్యూషన్ లేదా చేతిపనుల జాబితాను రూపొందించండి',
    providerBullet2: 'ధృవీకరించబడిన బ్యాడ్జ్ మరియు సమాజ నమ్మకాన్ని పొందండి',
    providerBullet3: 'మీ స్వయం సహాయక సంఘాన్ని లేదా సమాజాన్ని నమోదు చేయండి',
    providerBtn: 'సేవా ప్రదాతగా కొనసాగండి',
    providerTypeTitle: 'మీరు ఏ రకమైన సేవా ప్రదాత?',
    providerTypeSubtitle: 'మీ పనికి తగిన వర్గాన్ని ఎంచుకోండి',
    shgTitle: 'స్వయం సహాయక సంఘం సభ్యురాలు',
    shgDesc: 'మహిళా పొదుపు సంఘం సభ్యురాలు. సమూహ మద్దతుతో వ్యక్తిగత సేవను జోడించండి.',
    shgBtn: 'సేవా జాబితాను సృష్టించండి',
    indepTitle: 'స్వతంత్ర కళాకారిణి',
    indepDesc: 'స్వతంత్రంగా కుట్టుపని, వంట, ట్యూషన్ లేదా చేతిపనులు చేసే మహిళ.',
    indepBtn: 'సేవా జాబితాను సృష్టించండి',
    commTitle: 'సమాజ సమూహం',
    commDesc: 'మీ సమాజాన్ని నమోదు చేసి సభ్యులను ప్లాట్‌ఫారమ్‌కు తీసుకురండి.',
    commBtn: 'సమాజాన్ని నమోదు చేయండి',
    featured: 'ప్రత్యేకం',
  },
};

export const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({
  language,
  onSelectBuyer,
  onSelectShgMember,
  onSelectIndependent,
  onSelectCommunity,
  onSelectCommunityDashboard,
  onChangeLanguage,
}) => {
  const existingUser = getMockUser();
  const existingCommunity = getStoredCommunity();
  const rText = ROLE_TEXTS[language] || ROLE_TEXTS.en;

  const [step, setStep] = useState<'main' | 'provider-type'>('main');
  const [name, setName] = useState(existingUser?.name || '');
  const [phone, setPhone] = useState(existingUser?.phone || '');
  const [errorMsg, setErrorMsg] = useState('');

  const currentLangConfig = LANGUAGE_OPTIONS.find((l) => l.id === language) || LANGUAGE_OPTIONS[0];

  const validateAndSaveUser = (role: UserRole, providerType?: ProviderType): boolean => {
    const trimmedName = name.trim() || (role === 'buyer' ? 'Valued Buyer' : 'Skilled Provider');
    const cleanPhone = phone.replace(/[^0-9]/g, '') || '9876543210';

    const user: MockUser = {
      name: trimmedName,
      phone: cleanPhone,
      role,
      providerType,
      signedInAt: Date.now(),
    };
    saveMockUser(user);
    return true;
  };

  const handleChooseBuyer = () => {
    validateAndSaveUser('buyer');
    onSelectBuyer();
  };

  const handleOpenProviderTypes = () => {
    setStep('provider-type');
  };

  const handleChooseShg = () => {
    validateAndSaveUser('provider', 'shg_member');
    onSelectShgMember();
  };

  const handleChooseIndependent = () => {
    validateAndSaveUser('provider', 'independent');
    onSelectIndependent();
  };

  const handleChooseCommunity = () => {
    validateAndSaveUser('provider', 'community');
    onSelectCommunity();
  };

  return (
    <div className="min-h-screen bg-[#FAF5EB] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-3xl bg-[#FFFDF9] rounded-3xl border-2 border-[#EADBCE] shadow-xl p-6 sm:p-10 my-6 animate-fadeIn">
        {/* Top bar with logo and language switch */}
        <div className="flex items-center justify-between border-b border-[#EADBCE] pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl overflow-hidden border border-[#C2542D]/20 bg-[#FAF5EB] shrink-0">
              <img 
                src="/app-logo.png" 
                alt="SkillSetu Logo" 
                className="w-full h-full object-contain" 
              />
            </div>
            <div>
              <span className="text-xl font-bold font-heritage tracking-tight text-[#3D2B1F]">
                Skill<span className="text-[#C2542D]">Setu</span>
              </span>
              <p className="text-[11px] text-[#7A6455] font-semibold">
                {TRANSLATIONS[language]?.appTagline || TRANSLATIONS.en.appTagline}
              </p>
            </div>
          </div>

          <button
            onClick={onChangeLanguage}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#FAF5EB] hover:bg-[#F0E6D8] text-[#5C4533] border border-[#EADBCE] transition-colors cursor-pointer"
          >
            🌐 {currentLangConfig.nativeName} ({rText.changeLanguage})
          </button>
        </div>

        {/* Mock Sign-In Card (name + phone) */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-[#FAF5EB] border border-[#EADBCE]">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-[#C2542D]" />
            <h3 className="text-xs sm:text-sm font-bold text-[#3D2B1F] uppercase tracking-wider">
              {rText.quickSignIn}
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#6B5749] mb-1">
                {rText.fullName}
              </label>
              <input
                type="text"
                placeholder={rText.namePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D8C7B4] text-sm text-[#2A221E] focus:outline-none focus:ring-2 focus:ring-[#C2542D]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6B5749] mb-1">
                {rText.phoneLabel}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-sm font-semibold text-[#8C7E74]">
                  +91
                </span>
                <input
                  type="tel"
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-12 pr-3.5 py-2.5 rounded-xl bg-white border border-[#D8C7B4] text-sm text-[#2A221E] focus:outline-none focus:ring-2 focus:ring-[#C2542D]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* STAGE 1: "How are you participating?" */}
        {step === 'main' && (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-4xl font-bold font-heritage text-[#3D2B1F] mb-2 tracking-tight">
                {rText.mainTitle}
              </h1>
              <p className="text-sm sm:text-base text-[#6B5749]">
                {rText.mainSubtitle}
              </p>
            </div>

            {/* TWO LARGE CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {/* CARD 1: I am a Buyer */}
              <button
                id="role-buyer-card"
                onClick={handleChooseBuyer}
                className="group relative p-6 sm:p-8 rounded-3xl border-2 border-[#C7E4D3] bg-gradient-to-b from-[#FFFDF9] to-[#EEF6F2]/40 hover:border-[#1E4D38] hover:shadow-xl transition-all duration-200 text-left flex flex-col justify-between cursor-pointer active:scale-[0.99]"
              >
                <div>
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#EEF6F2] border border-[#C7E4D3] text-[#1E4D38] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-xs">
                    <ShoppingBag className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>

                  <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#1E4D38] text-white mb-2 shadow-2xs">
                    {rText.buyerBadge}
                  </span>

                  <h2 className="text-2xl font-bold font-heritage text-[#1E4D38] mb-2 group-hover:text-[#163829]">
                    {rText.buyerTitle}
                  </h2>

                  <p className="text-sm font-semibold text-[#2C3E35] leading-relaxed mb-4">
                    "{rText.buyerQuote}"
                  </p>

                  <ul className="space-y-2 text-xs sm:text-sm text-[#4E6759] mb-6">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#1E4D38] shrink-0" />
                      {rText.buyerBullet1}
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#1E4D38] shrink-0" />
                      {rText.buyerBullet2}
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#1E4D38] shrink-0" />
                      {rText.buyerBullet3}
                    </li>
                  </ul>
                </div>

                <div className="w-full py-3.5 px-4 rounded-2xl bg-[#1E4D38] group-hover:bg-[#163829] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm transition-colors">
                  <span>{rText.buyerBtn}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* CARD 2: I am a Provider */}
              <button
                id="role-provider-card"
                onClick={handleOpenProviderTypes}
                className="group relative p-6 sm:p-8 rounded-3xl border-2 border-[#F3D2C4] bg-gradient-to-b from-[#FFFDF9] to-[#FBEEE8]/40 hover:border-[#C2542D] hover:shadow-xl transition-all duration-200 text-left flex flex-col justify-between cursor-pointer active:scale-[0.99]"
              >
                <div>
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#FBEEE8] border border-[#F3D2C4] text-[#C2542D] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-xs">
                    <Sparkles className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>

                  <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#C2542D] text-white mb-2 shadow-2xs">
                    {rText.providerBadge}
                  </span>

                  <h2 className="text-2xl font-bold font-heritage text-[#C2542D] mb-2 group-hover:text-[#A13D19]">
                    {rText.providerTitle}
                  </h2>

                  <p className="text-sm font-semibold text-[#4A2617] leading-relaxed mb-4">
                    "{rText.providerQuote}"
                  </p>

                  <ul className="space-y-2 text-xs sm:text-sm text-[#7D5341] mb-6">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#C2542D] shrink-0" />
                      {rText.providerBullet1}
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#C2542D] shrink-0" />
                      {rText.providerBullet2}
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#C2542D] shrink-0" />
                      {rText.providerBullet3}
                    </li>
                  </ul>
                </div>

                <div className="w-full py-3.5 px-4 rounded-2xl bg-[#C2542D] group-hover:bg-[#A13D19] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm transition-colors">
                  <span>{rText.providerBtn}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>
          </div>
        )}

        {/* STAGE 2: "What type of provider are you?" */}
        {step === 'provider-type' && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setStep('main')}
                className="p-2 rounded-xl bg-[#FAF5EB] hover:bg-[#EFE4D3] text-[#3D2B1F] transition-colors cursor-pointer"
                title="Go back to role selection"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold font-heritage text-[#3D2B1F]">
                  {rText.providerTypeTitle}
                </h2>
                <p className="text-xs sm:text-sm text-[#6B5749]">
                  {rText.providerTypeSubtitle}
                </p>
              </div>
            </div>

            {/* THREE CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
              {/* CARD A: SHG Member */}
              <button
                id="provider-type-shg"
                onClick={handleChooseShg}
                className="p-5 sm:p-6 rounded-2xl border-2 border-[#EADBCE] bg-[#FFFDF9] hover:border-[#1E4D38] hover:bg-[#EEF6F2]/30 hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#EEF6F2] text-[#1E4D38] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border border-[#C7E4D3]">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold font-heritage text-[#1E4D38] mb-1.5">
                    {rText.shgTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C4533] leading-relaxed mb-4">
                    {rText.shgDesc}
                  </p>
                </div>
                <div className="text-xs font-bold text-[#1E4D38] flex items-center gap-1 mt-2">
                  <span>{rText.shgBtn}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* CARD B: Independent Participant */}
              <button
                id="provider-type-independent"
                onClick={handleChooseIndependent}
                className="p-5 sm:p-6 rounded-2xl border-2 border-[#EADBCE] bg-[#FFFDF9] hover:border-[#C2542D] hover:bg-[#FBEEE8]/30 hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#FBEEE8] text-[#C2542D] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border border-[#F3D2C4]">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold font-heritage text-[#C2542D] mb-1.5">
                    {rText.indepTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C4533] leading-relaxed mb-4">
                    {rText.indepDesc}
                  </p>
                </div>
                <div className="text-xs font-bold text-[#C2542D] flex items-center gap-1 mt-2">
                  <span>{rText.indepBtn}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* CARD C: Community */}
              <button
                id="provider-type-community"
                onClick={handleChooseCommunity}
                className="p-5 sm:p-6 rounded-2xl border-2 border-[#DDA74F] bg-gradient-to-b from-[#FFFDF9] to-[#FDF5EA] hover:border-[#B88226] hover:shadow-lg transition-all text-left flex flex-col justify-between group cursor-pointer relative"
              >
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-[#DDA74F] text-[#3D2B1F]">
                    {rText.featured}
                  </span>
                </div>

                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#FDF5EA] text-[#DDA74F] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border border-[#E8C888]">
                    <Building2 className="w-6 h-6 text-[#A06C17]" />
                  </div>
                  <h3 className="text-lg font-bold font-heritage text-[#8C5D10] mb-1.5">
                    {rText.commTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C4533] leading-relaxed mb-4">
                    "{rText.commDesc}"
                  </p>
                </div>
                <div className="text-xs font-bold text-[#8C5D10] flex items-center gap-1 mt-2">
                  <span>{rText.commBtn}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>

            {/* If community is already registered in local storage, allow jumping straight to dashboard */}
            {existingCommunity && (
              <div className="mt-6 p-4 rounded-2xl bg-[#EEF6F2] border border-[#C7E4D3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-[#1E4D38] shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-[#1E4D38]">
                      Registered Community: {existingCommunity.name}
                    </h4>
                    <p className="text-xs text-[#4E6759]">
                      {existingCommunity.members.length} members enrolled • {existingCommunity.village}, {existingCommunity.district}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onSelectCommunityDashboard}
                  className="px-4 py-2 rounded-xl bg-[#1E4D38] text-white font-bold text-xs hover:bg-[#163829] transition-colors cursor-pointer shrink-0"
                >
                  Open Community Dashboard →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
