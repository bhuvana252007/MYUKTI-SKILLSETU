import { SupportedLanguage, LanguageConfig } from '../types';

export const LANGUAGE_OPTIONS: LanguageConfig[] = [
  {
    id: 'en',
    name: 'English',
    nativeName: 'English',
    greeting: 'Welcome',
    speechCode: 'en-IN',
  },
  {
    id: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    greeting: 'नमस्ते',
    speechCode: 'hi-IN',
  },
  {
    id: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    greeting: 'ನಮಸ್ಕಾರ',
    speechCode: 'kn-IN',
  },
  {
    id: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    greeting: 'வணக்கம்',
    speechCode: 'ta-IN',
  },
  {
    id: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    greeting: 'నమస్కారం',
    speechCode: 'te-IN',
  },
];

export interface TranslationDictionary {
  appTagline: string;
  taglineHero: string;
  shgBadge: string;
  nav: {
    home: string;
    findServices: string;
    offerService: string;
    myListings: string;
    changeLanguage: string;
  };
  home: {
    heroBadge: string;
    heroTitle: string;
    heroSubtitle: string;
    btnOffer: string;
    btnOfferSub: string;
    btnOfferAction: string;
    btnNeed: string;
    btnNeedSub: string;
    btnNeedAction: string;
    voiceTip: string;
    categoriesTitle: string;
    categoriesSubtitle: string;
    viewAllCategories: string;
    findInArea: string;
    featuredTitle: string;
    featuredSubtitle: string;
    seeAll: string;
    directContactBadge: string;
    viewProfileArrow: string;
    howItWorksTitle: string;
    howItWorksSubtitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
  };
  myListings: {
    pageTitle: string;
    pageSubtitle: string;
    emptyTitle: string;
    emptySubtitle: string;
    createFirstBtn: string;
    createNewBtn: string;
    viewAsBuyerBtn: string;
    editBtn: string;
    deleteBtn: string;
    confirmDeleteTitle: string;
    confirmDeleteDesc: string;
    confirmDeleteAction: string;
    cancelAction: string;
  };
  categories: Record<
    string,
    {
      title: string;
      subtitle: string;
      desc: string;
    }
  >;
  sellerListing: {
    backToHome: string;
    createTitle: string;
    createSubtitle: string;
    editTitle: string;
    editSubtitle: string;
    nameLabel: string;
    nameHelper: string;
    namePlaceholder: string;
    categoryLabel: string;
    categoryHelper: string;
    priceLabel: string;
    priceHelper: string;
    pricePlaceholder: string;
    locationLabel: string;
    locationHelper: string;
    locationPlaceholder: string;
    descLabel: string;
    descHelper: string;
    descPlaceholder: string;
    listeningIndicator: string;
    doneStop: string;
    photoLabel: string;
    photoHelper: string;
    uploadPhotoBtn: string;
    photoSelected: string;
    photoPresetsLabel: string;
    selectedPhotoText: string;
    removePhoto: string;
    phoneLabel: string;
    phoneHelper: string;
    phonePlaceholder: string;
    shgCheckbox: string;
    shgHelper: string;
    shgGroupPlaceholder: string;
    submitBtn: string;
    saveChangesBtn: string;
    submitSubtext: string;
    successTitle: string;
    successDesc: (name: string, category: string) => string;
    viewOnSearchBtn: string;
    addAnotherBtn: string;
    errorName: string;
    errorCategory: string;
    errorPrice: string;
    errorLocation: string;
    errorDesc: string;
    errorFile: string;
  };
  buyerSearch: {
    backToHome: string;
    offerServiceInstead: string;
    searchTitle: string;
    searchSubtitle: string;
    filterCategoryLabel: string;
    allCategories: string;
    filterLocationLabel: string;
    allLocations: string;
    searchKeywordLabel: string;
    searchPlaceholder: string;
    showing: string;
    matchingResults: string;
    resetFilters: string;
    viewProfileBtn: string;
    noResultsTitle: string;
    noResultsDesc: string;
    clearFiltersBtn: string;
  };
  sellerProfile: {
    backToSearch: string;
    shareProfile: string;
    linkCopied: string;
    shgVerifiedMember: string;
    priceRates: string;
    locationLabel: string;
    experienceLabel: string;
    yearsPracticalSkill: string;
    experiencedArtisan: string;
    availabilityLabel: string;
    shgBoxTitle: string;
    shgBoxDesc: (groupName?: string) => string;
    trusted100: string;
    aboutTitle: string;
    highlightsTitle: string;
    hlDirectDelivery: string;
    hlFairPricing: string;
    hlNoCommission: string;
    hlDirectPay: string;
    contactSellerBtn: string;
    contactSubtext: string;
  };
  contactModal: {
    contactTitle: (name: string) => string;
    directOptionsLabel: string;
    callPhoneBtn: (phone: string) => string;
    messageWhatsAppBtn: string;
    quickQuestionsLabel: string;
    qAvailability: string;
    qHomeVisit: string;
    qPriceDetails: string;
    sendNoteLabel: string;
    notePlaceholder: string;
    saveAndWhatsAppBtn: string;
    messageNoted: (name: string) => string;
    promiseTitle: string;
    promiseDesc: (name: string) => string;
  };
  footer: {
    mission: string;
    shgSupport: string;
    exploreTitle: string;
    homeLink: string;
    buyerSearchLink: string;
    sellerListingLink: string;
    localSkillsTitle: string;
    copyright: string;
    resetDataBtn: string;
  };
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    appTagline: 'her voice.her income.her life',
    taglineHero: 'her voice.her income.her life',
    shgBadge: 'SHG Verified',
    nav: {
      home: 'Home',
      findServices: 'Find Services',
      offerService: 'Offer Service',
      myListings: 'My Listings',
      changeLanguage: 'Language',
    },
    home: {
      heroBadge: 'SHG Verified • Grassroots Women Empowerment',
      heroTitle: 'Connect with Skilled Women in Your Neighborhood',
      heroSubtitle:
        'Find trusted local women for tailoring, home cooking, child tutoring, and festive mehendi. Or share your own skills and start earning with dignity.',
      btnOffer: 'I offer a service',
      btnOfferSub: 'अपनी सेवा जोड़ें • For women who have a skill',
      btnOfferAction: 'List Service Now',
      btnNeed: 'I need a service',
      btnNeedSub: 'मुझे सेवा चाहिए • Find verified women nearby',
      btnNeedAction: 'Search Listings',
      voiceTip: 'Voice typing enabled! Speak in your language to describe your service.',
      categoriesTitle: 'Browse by Local Skills',
      categoriesSubtitle: 'Select a skill to find verified women near you',
      viewAllCategories: 'View all categories',
      findInArea: 'Find in your area',
      featuredTitle: 'Featured Neighborhood Sellers',
      featuredSubtitle: 'Verified women ready to provide services today',
      seeAll: 'See All',
      directContactBadge: 'Direct Contact',
      viewProfileArrow: 'View Profile →',
      howItWorksTitle: 'How SkillSetu Works',
      howItWorksSubtitle: 'Simple, direct, and zero commission for local women',
      step1Title: '1. Select Your Language',
      step1Desc: 'Choose English, Hindi, or Kannada. The entire app communicates in your preferred tongue.',
      step2Title: '2. Speak or Type Naturally',
      step2Desc: 'Describe your skill or service need in casual, colloquial speech using our voice assistant.',
      step3Title: '3. AI Creates Listing & Translates',
      step3Desc: 'Gemini AI automatically organizes your words into structured fields and translates across languages.',
      step4Title: '4. Connect Directly',
      step4Desc: 'Reach local verified women directly via phone call or WhatsApp with zero commission taken.',
    },
    myListings: {
      pageTitle: 'My Listings',
      pageSubtitle: 'Manage your active service offerings and make updates anytime',
      emptyTitle: 'You have not listed any skills yet',
      emptySubtitle: 'Offer tailoring, home cooking, tutoring, mehendi, or other skills to local neighborhood buyers with zero commission.',
      createFirstBtn: 'Create Your First Listing Now',
      createNewBtn: 'Add New Service Listing',
      viewAsBuyerBtn: 'View as Buyer',
      editBtn: 'Edit Listing',
      deleteBtn: 'Delete Listing',
      confirmDeleteTitle: 'Delete this listing?',
      confirmDeleteDesc: 'Are you sure you want to remove this service listing? This action cannot be undone.',
      confirmDeleteAction: 'Yes, Delete',
      cancelAction: 'Cancel',
    },
    categories: {
      Tailoring: {
        title: 'Tailoring',
        subtitle: 'सिलाई व कटिंग',
        desc: 'Blouses, suits, kurti, saree pico & alterations',
      },
      Cooking: {
        title: 'Cooking',
        subtitle: 'घर का खाना व टिफिन',
        desc: 'Fresh homemade daily meals, tiffins & festive sweets',
      },
      Tutoring: {
        title: 'Tutoring',
        subtitle: 'बच्चों की ट्यूशन',
        desc: 'Primary & middle school maths, reading, and homework help',
      },
      Mehendi: {
        title: 'Mehendi',
        subtitle: 'सुंदर मेहंदी कला',
        desc: 'Bridal, festival & celebration herbal organic mehendi',
      },
      Other: {
        title: 'Other Skills',
        subtitle: 'अन्य हुनर',
        desc: 'Embroidery, handicrafts & traditional artisan works',
      },
    },
    sellerListing: {
      backToHome: 'Back to Home',
      createTitle: 'Create Your Skill Listing',
      createSubtitle:
        'Fill in your details below. You can also tap the microphone to speak your description in your language!',
      editTitle: 'Edit Your Skill Listing',
      editSubtitle: 'Update your service details, price, or description below.',
      nameLabel: 'Your Full Name',
      nameHelper: 'आपका पूरा नाम (e.g. Sunita Devi)',
      namePlaceholder: 'e.g. Sunita Devi',
      categoryLabel: 'Skill Category',
      categoryHelper: 'What skill or service do you offer?',
      priceLabel: 'Price / Fees',
      priceHelper: 'e.g. ₹200/blouse or ₹120/tiffin',
      pricePlaceholder: 'e.g. ₹200/blouse',
      locationLabel: 'Location / Neighborhood Area',
      locationHelper: 'Your neighborhood, town, or area (e.g. Rampur Sector 4)',
      locationPlaceholder: 'e.g. Rampur Sector 4, Near Shiva Temple',
      descLabel: 'Short Description',
      descHelper: 'Describe what services you offer and your experience. Tap the mic to speak!',
      descPlaceholder:
        'e.g. Expert in designer blouses and kurti stitching with 8 years experience. Fast delivery and accurate fitting.',
      listeningIndicator: 'Listening... Speak now...',
      doneStop: 'Done / Stop',
      photoLabel: 'Profile / Work Photo',
      photoHelper: 'Upload a picture of you or your work (or choose a sample photo below)',
      uploadPhotoBtn: 'Upload Photo from Phone',
      photoSelected: 'Photo Selected',
      photoPresetsLabel: 'Or pick a ready-made sample photo:',
      selectedPhotoText: 'Selected Profile Photo',
      removePhoto: 'Remove photo',
      phoneLabel: 'Contact Phone / WhatsApp Number',
      phoneHelper: 'Buyers will contact you directly on this number',
      phonePlaceholder: 'e.g. +91 98765 43210',
      shgCheckbox: 'I am a member of a Self-Help Group (SHG / Mahila Bachat Gat)',
      shgHelper: 'Adds the green "SHG Verified" badge to your card so buyers trust your service.',
      shgGroupPlaceholder: 'e.g. Maa Durga Mahila Bachat Gat (Optional group name)',
      submitBtn: 'Submit Listing • सेवा जोड़ें',
      saveChangesBtn: 'Save Changes • बदलाव सहेजें',
      submitSubtext: 'Saved instantly to your browser. Zero commission or registration fees.',
      successTitle: 'Congratulations! Your Service is Listed',
      successDesc: (name, category) =>
        `${name}, your listing for ${category} has been saved and is now visible to nearby buyers on SkillSetu.`,
      viewOnSearchBtn: 'View on Buyer Search Page →',
      addAnotherBtn: 'Add Another Service',
      errorName: 'Please enter your full name.',
      errorCategory: 'Please select a skill category.',
      errorPrice: 'Please enter your price (e.g. ₹200/blouse or ₹150/hour).',
      errorLocation: 'Please enter your neighborhood or area location.',
      errorDesc: 'Please add a short description of what services you provide.',
      errorFile: 'Please upload a valid image file (JPG, PNG, WebP) under 2.5MB.',
    },
    buyerSearch: {
      backToHome: 'Back to Home',
      offerServiceInstead: 'Offer a Service Instead',
      searchTitle: 'Find Local Women Services',
      searchSubtitle:
        'Browse verified women providing tailoring, cooking, tutoring, mehendi, and more near you.',
      filterCategoryLabel: 'Filter by Skill Category',
      allCategories: 'All Categories (सभी हुनर)',
      filterLocationLabel: 'Filter by Location',
      allLocations: 'All Locations (सभी क्षेत्र)',
      searchKeywordLabel: 'Search by Keyword or Name',
      searchPlaceholder: 'e.g. blouse, tiffin, maths...',
      showing: 'Showing',
      matchingResults: 'matching results',
      resetFilters: 'Reset All Filters',
      viewProfileBtn: 'View Full Profile & Contact →',
      noResultsTitle: 'No listings found',
      noResultsDesc: 'No service providers match your current filters. Try changing your selection.',
      clearFiltersBtn: 'Clear All Filters',
    },
    sellerProfile: {
      backToSearch: 'Back to Search Results',
      shareProfile: 'Share Profile',
      linkCopied: 'Link Copied!',
      shgVerifiedMember: 'SHG Verified Member',
      priceRates: 'Price / Rates',
      locationLabel: 'Location',
      experienceLabel: 'Experience',
      yearsPracticalSkill: 'Years Practical Skill',
      experiencedArtisan: 'Experienced Local Artisan',
      availabilityLabel: 'Availability',
      shgBoxTitle: 'Self-Help Group (SHG) Verified Member',
      shgBoxDesc: (groupName) =>
        groupName
          ? `Member of "${groupName}". Verified identity, fair pricing, and neighborhood accountability.`
          : 'Verified local woman entrepreneur associated with grassroots Mahila Bachat Gat.',
      trusted100: '100% Trusted',
      aboutTitle: 'About the Service & Craft',
      highlightsTitle: 'Key Service Highlights',
      hlDirectDelivery: 'Direct neighborhood delivery',
      hlFairPricing: 'Fair, transparent pricing',
      hlNoCommission: 'Zero middleman commission',
      hlDirectPay: 'Cash or UPI direct payment',
      contactSellerBtn: 'Contact Seller (संपर्क करें)',
      contactSubtext: 'Instant phone call or WhatsApp message • Direct connect',
    },
    contactModal: {
      contactTitle: (name) => `Contact ${name}`,
      directOptionsLabel: 'Direct Contact Options',
      callPhoneBtn: (phone) => `Call on Phone (${phone})`,
      messageWhatsAppBtn: 'Message on WhatsApp',
      quickQuestionsLabel: 'Tap a quick question to add:',
      qAvailability: 'Are you available this week?',
      qHomeVisit: 'Do you provide home visits?',
      qPriceDetails: 'Can you share more price details?',
      sendNoteLabel: 'Send a Message or Note',
      notePlaceholder: 'Type your message or specific requirements here...',
      saveAndWhatsAppBtn: 'Save Note & Open WhatsApp',
      messageNoted: (name) => `Message noted! You can now call or WhatsApp ${name} directly.`,
      promiseTitle: 'Fair Trade Community Promise',
      promiseDesc: (name) =>
        `SkillSetu takes 0% commission. You pay ${name} directly upon service delivery. Please treat local women providers with dignity and respect.`,
    },
    footer: {
      mission:
        'Building bridges between skilled rural and semi-urban women and neighborhood buyers. Empowering local micro-entrepreneurs with dignity and zero commission.',
      shgSupport: 'Supporting Self-Help Groups (SHGs) across India',
      exploreTitle: 'Explore',
      homeLink: 'Home',
      buyerSearchLink: 'Find a Service (Buyer Search)',
      sellerListingLink: 'Offer a Service (Seller Listing)',
      localSkillsTitle: 'Local Skills',
      copyright: 'SkillSetu. Empowering grassroots women entrepreneurs.',
      resetDataBtn: 'Reset Sample Data',
    },
  },

  hi: {
    appTagline: 'उसकी आवाज़ • उसकी आमदनी • उसका जीवन',
    taglineHero: 'उसकी आवाज़ • उसकी आमदनी • उसका जीवन • her voice.her income.her life',
    shgBadge: 'स्वयं सहायता समूह सत्यापित',
    nav: {
      home: 'होम',
      findServices: 'सेवा खोजें',
      offerService: 'सेवा जोड़ें',
      myListings: 'मेरी सेवाएं',
      changeLanguage: 'भाषा बदलें',
    },
    home: {
      heroBadge: 'SHG सत्यापित • महिला सशक्तिकरण',
      heroTitle: 'अपने मोहल्ले की हुनरमंद बहनों से सीधे जुड़ें',
      heroSubtitle:
        'सिलाई, घर का शुद्ध खाना, बच्चों की पढ़ाई और सुंदर मेहंदी के लिए पास की सत्यापित महिलाओं से जुड़ें। या अपने हुनर से सम्मानपूर्वक कमाई शुरू करें।',
      btnOffer: 'मैं सेवा देती हूँ',
      btnOfferSub: 'अपनी सेवा जोड़ें • हुनरमंद बहनों के लिए',
      btnOfferAction: 'अभी सेवा जोड़ें',
      btnNeed: 'मुझे सेवा चाहिए',
      btnNeedSub: 'सत्यापित महिलाएं खोजें • पड़ोस में सेवा पाएं',
      btnNeedAction: 'सेवाएं खोजें',
      voiceTip: 'माइक से बोलकर लिखें! अपनी भाषा में सेवा का विवरण दें।',
      categoriesTitle: 'हुनर के अनुसार खोजें',
      categoriesSubtitle: 'अपने पास की हुनरमंद बहनों को खोजने के लिए श्रेणी चुनें',
      viewAllCategories: 'सभी श्रेणियां देखें',
      findInArea: 'अपने क्षेत्र में खोजें',
      featuredTitle: 'पड़ोस की प्रमुख हुनरमंद बहनें',
      featuredSubtitle: 'सत्यापित महिलाएं जो आज ही सेवा देने के लिए तैयार हैं',
      seeAll: 'सभी देखें',
      directContactBadge: 'सीधा संपर्क',
      viewProfileArrow: 'प्रोफाइल देखें →',
      howItWorksTitle: 'SkillSetu कैसे काम करता है',
      howItWorksSubtitle: 'सरल, सीधा और महिलाओं के लिए शून्य कमीशन',
      step1Title: '1. अपनी भाषा चुनें',
      step1Desc: 'हिन्दी, कन्नड़ या अंग्रेजी चुनें। पूरा ऐप आपकी चुनी हुई भाषा में बात करता है।',
      step2Title: '2. बोलकर या लिखकर बताएं',
      step2Desc: 'अपनी बोलचाल की भाषा में माइक से अपनी सेवा या जरूरत बताएं।',
      step3Title: '3. AI सेवा सूची बनाता है व अनुवाद करता है',
      step3Desc: 'Gemini AI आपकी बात को समझकर अपने आप सेवा विवरण तैयार करता है और दोतरफा अनुवाद करता है।',
      step4Title: '4. सीधे फोन या व्हाट्सएप पर जुड़ें',
      step4Desc: 'बिना किसी बिचौलिये या कमीशन के सीधे फोन कॉल या व्हाट्सएप पर बात करें।',
    },
    myListings: {
      pageTitle: 'मेरी सेवाएं (My Listings)',
      pageSubtitle: 'अपनी सक्रिय सेवाओं को देखें, संपादित करें या कभी भी बदलें',
      emptyTitle: 'आपने अभी तक कोई सेवा नहीं जोड़ी है',
      emptySubtitle: 'सिलाई, खाना, ट्यूशन या मेहंदी की सेवा जोड़कर बिना किसी कमीशन के सीधे पड़ोसियों से कमाई शुरू करें।',
      createFirstBtn: 'अपनी पहली सेवा अभी जोड़ें',
      createNewBtn: 'नई सेवा जोड़ें',
      viewAsBuyerBtn: 'खरीदार के रूप में देखें',
      editBtn: 'संपादित करें',
      deleteBtn: 'हटाएं',
      confirmDeleteTitle: 'क्या आप इस सेवा को हटाना चाहते हैं?',
      confirmDeleteDesc: 'क्या आप वाकई इस सेवा सूची को हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।',
      confirmDeleteAction: 'हाँ, हटाएं',
      cancelAction: 'रद्द करें',
    },
    categories: {
      Tailoring: {
        title: 'सिलाई व कटिंग',
        subtitle: 'ब्लाउज, सूट, कुर्ती',
        desc: 'ब्लाउज, सूट, कुर्ती, साड़ी फॉल पिको व सटीक सिलाई',
      },
      Cooking: {
        title: 'घर का खाना व टिफिन',
        subtitle: 'शुद्ध शाकाहारी भोजन',
        desc: 'ताजा स्वादिष्ट दैनिक भोजन, टिफिन व घरेलू मिठाइयाँ',
      },
      Tutoring: {
        title: 'बच्चों की ट्यूशन',
        subtitle: 'प्राथमिक व माध्यमिक पढ़ाई',
        desc: 'कक्षा 1 से 8 तक गणित, भाषा, वाचन व स्कूल होमवर्क',
      },
      Mehendi: {
        title: 'सुंदर मेहंदी कला',
        subtitle: 'शादी व त्योहार मेहंदी',
        desc: 'शादी, त्योहार व उत्सव के लिए प्राकृतिक हर्बल मेहंदी',
      },
      Other: {
        title: 'अन्य हुनर',
        subtitle: 'हस्तशिल्प व कारीगरी',
        desc: 'कढ़ाई, हस्तकला और स्थानीय कारीगरी के काम',
      },
    },
    sellerListing: {
      backToHome: 'होम पर वापस जाएं',
      createTitle: 'अपनी सेवा की सूची बनाएं',
      createSubtitle:
        'नीचे अपनी जानकारी भरें। आप विवरण टाइप करने के बजाय माइक दबाकर बोल भी सकती हैं!',
      editTitle: 'अपनी सेवा संपादित करें',
      editSubtitle: 'अपनी सेवा का विवरण, शुल्क या जानकारी नीचे अपडेट करें।',
      nameLabel: 'आपका पूरा नाम',
      nameHelper: 'जैसे: सुनिता देवी',
      namePlaceholder: 'जैसे: सुनिता देवी',
      categoryLabel: 'हुनर की श्रेणी',
      categoryHelper: 'आप किस काम में सेवा देना चाहती हैं?',
      priceLabel: 'सेवा का शुल्क',
      priceHelper: 'जैसे: ₹200/ब्लाउज या ₹120/टिफिन',
      pricePlaceholder: 'जैसे: ₹200/ब्लाउज',
      locationLabel: 'मोहल्ला / गाँव / क्षेत्र',
      locationHelper: 'आपका गाँव, कस्बा या मोहल्ला (जैसे: रामपुर सेक्टर 4)',
      locationPlaceholder: 'जैसे: रामपुर सेक्टर 4, मंदिर के पास',
      descLabel: 'सेवा का विवरण',
      descHelper: 'बताएं कि आप क्या काम करती हैं और कितना अनुभव है। माइक दबाकर बोलें!',
      descPlaceholder:
        'जैसे: 8 साल के अनुभव के साथ डिजाइनर ब्लाउज और कुर्ती सिलाई। सही फिटिंग और समय पर काम।',
      listeningIndicator: 'सुन रहे हैं... बोलिए...',
      doneStop: 'पूरा हुआ / रोकें',
      photoLabel: 'प्रोफाइल / काम की फोटो',
      photoHelper: 'अपनी या अपने काम की फोटो फोन से अपलोड करें या नीचे से चुनें',
      uploadPhotoBtn: 'फोन से फोटो अपलोड करें',
      photoSelected: 'फोटो चुनी गई',
      photoPresetsLabel: 'या नीचे दिए गए नमूनों में से चुनें:',
      selectedPhotoText: 'चुनी गई प्रोफाइल फोटो',
      removePhoto: 'फोटो हटाएं',
      phoneLabel: 'फोन / व्हाट्सएप नंबर',
      phoneHelper: 'ग्राहक आपसे इस नंबर पर सीधा संपर्क करेंगे',
      phonePlaceholder: 'जैसे: +91 98765 43210',
      shgCheckbox: 'मैं स्वयं सहायता समूह (महिला बचत गट) की सदस्य हूँ',
      shgHelper: 'ग्राहकों के भरोसे के लिए आपके कार्ड पर हरा SHG बैज लगाया जाएगा।',
      shgGroupPlaceholder: 'जैसे: माँ दुर्गा महिला बचत गट (समूह का नाम)',
      submitBtn: 'सेवा जमा करें • Submit Listing',
      saveChangesBtn: 'बदलाव सहेजें • Save Changes',
      submitSubtext: 'ब्राउज़र में तुरंत सुरक्षित। कोई शुल्क या कमीशन नहीं।',
      successTitle: 'बधाई हो! आपकी सेवा जुड़ गई है',
      successDesc: (name, category) =>
        `${name}, आपकी ${category} सेवा अब SkillSetu पर पास के ग्राहकों को दिखाई दे रही है।`,
      viewOnSearchBtn: 'खरीदार खोज पृष्ठ पर देखें →',
      addAnotherBtn: 'एक और सेवा जोड़ें',
      errorName: 'कृपया अपना पूरा नाम दर्ज करें।',
      errorCategory: 'कृपया हुनर की श्रेणी चुनें।',
      errorPrice: 'कृपया शुल्क दर्ज करें (जैसे: ₹200/ब्लाउज)।',
      errorLocation: 'कृपया अपना मोहल्ला या क्षेत्र दर्ज करें।',
      errorDesc: 'कृपया अपनी सेवा का विवरण दर्ज करें।',
      errorFile: 'कृपया 2.5MB से छोटी वैध फोटो फाइल चुनें।',
    },
    buyerSearch: {
      backToHome: 'होम पर वापस जाएं',
      offerServiceInstead: 'अपनी सेवा भी जोड़ें',
      searchTitle: 'स्थानीय महिलाओं की सेवाएं खोजें',
      searchSubtitle:
        'सिलाई, खाना, ट्यूशन, मेहंदी और अन्य सेवाओं के लिए अपने पास की सत्यापित महिलाओं से जुड़ें।',
      filterCategoryLabel: 'हुनर के अनुसार चुनें',
      allCategories: 'सभी श्रेणियां',
      filterLocationLabel: 'क्षेत्र के अनुसार चुनें',
      allLocations: 'सभी क्षेत्र',
      searchKeywordLabel: 'नाम या शब्द से खोजें',
      searchPlaceholder: 'जैसे: ब्लाउज, टिफिन, गणित...',
      showing: 'दिखा रहे हैं',
      matchingResults: 'परिणाम मिले',
      resetFilters: 'सभी फिल्टर हटाएं',
      viewProfileBtn: 'प्रोफाइल देखें और संपर्क करें →',
      noResultsTitle: 'कोई सेवा नहीं मिली',
      noResultsDesc: 'आपके चुने हुए फिल्टर से कोई परिणाम नहीं मिला। कृपया दूसरा विकल्प चुनें।',
      clearFiltersBtn: 'सभी फिल्टर हटाएं',
    },
    sellerProfile: {
      backToSearch: 'खोज परिणाम पर वापस जाएं',
      shareProfile: 'शेयर करें',
      linkCopied: 'लिंक कॉपी हो गया!',
      shgVerifiedMember: 'SHG सत्यापित सदस्य',
      priceRates: 'शुल्क / दर',
      locationLabel: 'स्थान',
      experienceLabel: 'अनुभव',
      yearsPracticalSkill: 'वर्षों का हुनर व अनुभव',
      experiencedArtisan: 'अनुभवी स्थानीय कारीगर',
      availabilityLabel: 'उपलब्धता',
      shgBoxTitle: 'स्वयं सहायता समूह (SHG) सत्यापित सदस्य',
      shgBoxDesc: (groupName) =>
        groupName
          ? `सदस्य: "${groupName}"। सत्यापित पहचान, उचित मूल्य और पड़ोस का विश्वास।`
          : 'स्थानीय महिला बचत गट की सत्यापित सदस्य।',
      trusted100: '100% विश्वसनीय',
      aboutTitle: 'काम और हुनर के बारे में',
      highlightsTitle: 'प्रमुख विशेषताएं',
      hlDirectDelivery: 'सीधी स्थानीय सेवा',
      hlFairPricing: 'उचित और पारदर्शी दर',
      hlNoCommission: 'शून्य बिचौलिया कमीशन',
      hlDirectPay: 'नकद या यूपीआई द्वारा सीधा भुगतान',
      contactSellerBtn: 'संपर्क करें (Contact Seller)',
      contactSubtext: 'सीधे फोन कॉल या व्हाट्सएप संदेश द्वारा बात करें',
    },
    contactModal: {
      contactTitle: (name) => `${name} से संपर्क करें`,
      directOptionsLabel: 'सीधा संपर्क विकल्प',
      callPhoneBtn: (phone) => `फोन पर कॉल करें (${phone})`,
      messageWhatsAppBtn: 'व्हाट्सएप पर संदेश भेजें',
      quickQuestionsLabel: 'पूछने के लिए प्रश्न चुनें:',
      qAvailability: 'क्या आप इस हफ्ते उपलब्ध हैं?',
      qHomeVisit: 'क्या आप घर आकर सेवा देती हैं?',
      qPriceDetails: 'कृपया काम और शुल्क के बारे में बताएं।',
      sendNoteLabel: 'संदेश या विशेष आवश्यकता लिखें',
      notePlaceholder: 'अपनी आवश्यकता या प्रश्न यहाँ लिखें...',
      saveAndWhatsAppBtn: 'संदेश तैयार कर व्हाट्सएप खोलें',
      messageNoted: (name) => `संदेश नोट हुआ! अब आप सीधे ${name} से बात कर सकते हैं।`,
      promiseTitle: 'विश्वसनीय समुदाय का संकल्प',
      promiseDesc: (name) =>
        `SkillSetu कोई कमीशन नहीं लेता। 100% भुगतान सीधे ${name} को जाता है। कृपया महिला कारीगरों से सम्मानपूर्वक व्यवहार करें।`,
    },
    footer: {
      mission:
        'गाँव और छोटे शहरों की हुनरमंद बहनों और पड़ोस के ग्राहकों को सीधे जोड़ने का मंच। गरिमा और शून्य कमीशन।',
      shgSupport: 'भारत भर के स्वयं सहायता समूहों (SHGs) का समर्थन',
      exploreTitle: 'नेविगेशन',
      homeLink: 'होम',
      buyerSearchLink: 'सेवा खोजें',
      sellerListingLink: 'सेवा जोड़ें',
      localSkillsTitle: 'स्थानीय हुनर',
      copyright: 'SkillSetu. महिला सूक्ष्म-उद्यमियों का मंच।',
      resetDataBtn: 'नमूना डेटा रीसेट करें',
    },
  },

  kn: {
    appTagline: 'ಅವಳ ಧ್ವನಿ • ಅವಳ ಆದಾಯ • ಅವಳ ಜೀವನ',
    taglineHero: 'ಅವಳ ಧ್ವನಿ • ಅವಳ ಆದಾಯ • ಅವಳ ಜೀವನ • her voice.her income.her life',
    shgBadge: 'ಸ್ವಸಹಾಯ ಸಂಘ ದೃಢೀಕೃತ',
    nav: {
      home: 'ಮುಖಪುಟ',
      findServices: 'ಸೇವೆ ಹುಡುಕಿ',
      offerService: 'ಸೇವೆ ನೀಡಿ',
      myListings: 'ನನ್ನ ಸೇವೆಗಳು',
      changeLanguage: 'ಭಾಷೆ ಬದಲಾಯಿಸಿ',
    },
    home: {
      heroBadge: 'ಸ್ವಸಹಾಯ ಸಂಘ ದೃಢೀಕೃತ • ಮಹಿಳಾ ಸಬಲೀಕರಣ',
      heroTitle: 'ನಿಮ್ಮ ಬಡಾವಣೆಯ ನುರಿತ ಮಹಿಳೆಯರೊಂದಿಗೆ ನೇರವಾಗಿ ಸಂಪರ್ಕಿಸಿ',
      heroSubtitle:
        'ಹೊಲಿಗೆ, ಮನೆಯ ಶುದ್ಧ ಊಟ, ಮಕ್ಕಳ ಟ್ಯೂಷನ್ ಮತ್ತು ಮೆಹಂದಿಗಾಗಿ ನಿಮ್ಮ ಸಮೀಪದ ವಿಶ್ವಾಸಾರ್ಹ ಮಹಿಳೆಯರನ್ನು ಸಂಪರ್ಕಿಸಿ. ಅಥವಾ ನಿಮ್ಮ ಕೌಶಲ್ಯದಿಂದ ಗೌರವಯುತವಾಗಿ ಗಳಿಸಿ.',
      btnOffer: 'ನಾನು ಸೇವೆ ನೀಡುತ್ತೇನೆ',
      btnOfferSub: 'ನಿಮ್ಮ ಸೇವೆ ಸೇರಿಸಿ • ಕೌಶಲ್ಯವಿರುವ ಮಹಿಳೆಯರಿಗೆ',
      btnOfferAction: 'ಈಗಲೇ ಸೇವೆ ಸೇರಿಸಿ',
      btnNeed: 'ನನಗೆ ಸೇವೆ ಬೇಕು',
      btnNeedSub: 'ಸಮೀಪದ ದೃಢೀಕೃತ ಮಹಿಳೆಯರನ್ನು ಹುಡುಕಿ',
      btnNeedAction: 'ಸೇವೆಗಳನ್ನು ಹುಡುಕಿ',
      voiceTip: 'ಧ್ವನಿ ಮೂಲಕ ಟೈಪ್ ಮಾಡಿ! ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲೇ ಸೇವೆ ವಿವರಿಸಿ.',
      categoriesTitle: 'ಸ್ಥಳೀಯ ಕೌಶಲ್ಯಗಳ ಪ್ರಕಾರ ಬ್ರೌಸ್ ಮಾಡಿ',
      categoriesSubtitle: 'ನಿಮ್ಮ ಸಮೀಪದ ಮಹಿಳೆಯರನ್ನು ಹುಡುಕಲು ಕೌಶಲ್ಯ ಆಯ್ಕೆಮಾಡಿ',
      viewAllCategories: 'ಎಲ್ಲಾ ವಿಭಾಗಗಳನ್ನು ನೋಡಿ',
      findInArea: 'ನಿಮ್ಮ ಪ್ರದೇಶದಲ್ಲಿ ಹುಡುಕಿ',
      featuredTitle: 'ವಿಶೇಷ ಸ್ಥಳೀಯ ಸೇವಾಕರ್ತರು',
      featuredSubtitle: 'ಇಂದೇ ಸೇವೆ ನೀಡಲು ಸಿದ್ಧವಿರುವ ದೃಢೀಕೃತ ಮಹಿಳೆಯರು',
      seeAll: 'ಎಲ್ಲವನ್ನೂ ನೋಡಿ',
      directContactBadge: 'ನೇರ ಸಂಪರ್ಕ',
      viewProfileArrow: 'ಪ್ರೊಫೈಲ್ ನೋಡಿ →',
      howItWorksTitle: 'SkillSetu ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ',
      howItWorksSubtitle: 'ಸ್ಥಳೀಯ ಮಹಿಳೆಯರಿಗೆ ಸುಲಭ, ನೇರ ಮತ್ತು ಶೂನ್ಯ ಕಮಿಷನ್',
      step1Title: '1. ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
      step1Desc: 'ಕನ್ನಡ, ಹಿಂದಿ ಅಥವಾ ಇಂಗ್ಲಿಷ್ ಆಯ್ಕೆಮಾಡಿ. ಇಡೀ ಆ್ಯಪ್ ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲೇ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ.',
      step2Title: '2. ಮಾತನಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ',
      step2Desc: 'ನಿಮ್ಮ ಕೌಶಲ್ಯ ಅಥವಾ ಅಗತ್ಯವನ್ನು ಸಾಮಾನ್ಯ ಆಡುಮಾತಿನಲ್ಲಿ ಮೈಕ್ ಮೂಲಕ ಸುಲಭವಾಗಿ ತಿಳಿಸಿ.',
      step3Title: '3. AI ಪಟ್ಟಿಯನ್ನು ರಚಿಸಿ ಅನುವಾದಿಸುತ್ತದೆ',
      step3Desc: 'Gemini AI ನಿಮ್ಮ ಮಾತನ್ನು ಗ್ರಹಿಸಿ ತಕ್ಷಣವೇ ವಿವರವಾದ ಸೇವಾ ಪಟ್ಟಿಯನ್ನು ಸಿದ್ಧಪಡಿಸುತ್ತದೆ.',
      step4Title: '4. ನೇರವಾಗಿ ಸಂಪರ್ಕಿಸಿ',
      step4Desc: 'ಯಾವುದೇ ಕಮಿಷನ್ ಅಥವಾ ಮಧ್ಯವರ್ತಿಗಳಿಲ್ಲದೆ ನೇರವಾಗಿ ಫೋನ್ ಕರೆ ಅಥವಾ ವಾಟ್ಸಾಪ್ ಮೂಲಕ ಸಂಪರ್ಕಿಸಿ.',
    },
    myListings: {
      pageTitle: 'ನನ್ನ ಸೇವೆಗಳು (My Listings)',
      pageSubtitle: 'ನಿಮ್ಮ ಸಕ್ರಿಯ ಸೇವೆಗಳನ್ನು ನಿರ್ವಹಿಸಿ ಮತ್ತು ಯಾವುದೇ ಸಮಯದಲ್ಲಿ ನವೀಕರಿಸಿ',
      emptyTitle: 'ನೀವು ಇನ್ನೂ ಯಾವುದೇ ಸೇವೆಯನ್ನು ಪಟ್ಟಿ ಮಾಡಿಲ್ಲ',
      emptySubtitle: 'ಹೊಲಿಗೆ, ಅಡುಗೆ, ಟ್ಯೂಷನ್ ಅಥವಾ ಮೆಹಂದಿ ಕೌಶಲ್ಯಗಳನ್ನು ಪಟ್ಟಿ ಮಾಡಿ ಯಾವುದೇ ಕಮಿಷನ್ ಇಲ್ಲದೆ ಗಳಿಸಲು ಪ್ರಾರಂಭಿಸಿ.',
      createFirstBtn: 'ನಿಮ್ಮ ಮೊದಲ ಸೇವೆಯನ್ನು ಈಗಲೇ ಸೇರಿಸಿ',
      createNewBtn: 'ಹೊಸ ಸೇವೆಯನ್ನು ಸೇರಿಸಿ',
      viewAsBuyerBtn: 'ಖರೀದಿದಾರರಂತೆ ವೀಕ್ಷಿಸಿ',
      editBtn: 'ಸಂಪಾದಿಸಿ',
      deleteBtn: 'ಅಳಿಸಿ',
      confirmDeleteTitle: 'ಈ ಸೇವೆಯನ್ನು ಅಳಿಸಲು ಖಚಿತವೇ?',
      confirmDeleteDesc: 'ನೀವು ನಿಜವಾಗಿಯೂ ಈ ಸೇವಾ ಪಟ್ಟಿಯನ್ನು ಅಳಿಸಲು ಬಯಸುವಿರಾ? ಈ ಕ್ರಿಯೆಯನ್ನು ರದ್ದುಗೊಳಿಸಲಾಗುವುದಿಲ್ಲ.',
      confirmDeleteAction: 'ಹೌದು, ಅಳಿಸಿ',
      cancelAction: 'ರದ್ದುಮಾಡಿ',
    },
    categories: {
      Tailoring: {
        title: 'ಹೊಲಿಗೆ ಕೆಲಸ',
        subtitle: 'ಬ್ಲೌಸ್, ಕುರ್ತಿ, ಸೀರೆ',
        desc: 'ಬ್ಲೌಸ್, ಚೂಡಿದಾರ್, ಕುರ್ತಿ, ಸೀರೆ ಫಾಲ್ ಪಿಕೋ ಮತ್ತು ಆಲ್ಟರೇಶನ್',
      },
      Cooking: {
        title: 'ಅಡುಗೆ ಮತ್ತು ಟಿಫಿನ್',
        subtitle: 'ಮನೆಯ ಶುದ್ಧ ಊಟ',
        desc: 'ಮನೆಯ ಶುದ್ಧ ತಾಜಾ ಊಟ, ಟಿಫಿನ್ ಮತ್ತು ಹಬ್ಬದ ತಿಂಡಿಗಳು',
      },
      Tutoring: {
        title: 'ಮಕ್ಕಳ ಟ್ಯೂಷನ್',
        subtitle: 'ಪಾಠ ಮತ್ತು ಹೋಂವರ್ಕ್',
        desc: '1 ರಿಂದ 8 ನೇ ತರಗತಿಯ ಗಣಿತ, ಓದು ಮತ್ತು ಹೋಂವರ್ಕ್ ಸಹಾಯ',
      },
      Mehendi: {
        title: 'ಮೆಹಂದಿ ಕಲೆ',
        subtitle: 'ಮದುವೆ ಮತ್ತು ಹಬ್ಬದ ಮೆಹಂದಿ',
        desc: 'ಮದುವೆ, ಹಬ್ಬ ಮತ್ತು ಸಮಾರಂಭಗಳಿಗೆ ನೈಸರ್ಗಿಕ ಮೂಲಿಕೆ ಮೆಹಂದಿ',
      },
      Other: {
        title: 'ಇತರ ಕೌಶಲ್ಯಗಳು',
        subtitle: 'ಕರಕುಶಲ ಮತ್ತು ಕಲೆ',
        desc: 'ಕಸೂತಿ, ಕರಕುಶಲ ಮತ್ತು ಸ್ಥಳೀಯ ಕಲಾತ್ಮಕ ಕೆಲಸಗಳು',
      },
    },
    sellerListing: {
      backToHome: 'ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ',
      createTitle: 'ನಿಮ್ಮ ಕೌಶಲ್ಯ ಪಟ್ಟಿಯನ್ನು ರಚಿಸಿ',
      createSubtitle:
        'ಕೆಳಗೆ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ. ವಿವರವನ್ನು ಮಾತನಾಡಲು ಮೈಕ್ ಒತ್ತಿ ಧ್ವನಿ ಮೂಲಕವೂ ನಮೂದಿಸಬಹುದು!',
      editTitle: 'ನಿಮ್ಮ ಸೇವೆಯನ್ನು ಸಂಪಾದಿಸಿ',
      editSubtitle: 'ನಿಮ್ಮ ಸೇವಾ ವಿವರಗಳು, ದರ ಅಥವಾ ಮಾಹಿತಿಯನ್ನು ಕೆಳಗೆ ನವೀಕರಿಸಿ.',
      nameLabel: 'ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು',
      nameHelper: 'ಉದಾಹರಣೆಗೆ: ಸುನೀತಾ ದೇವಿ',
      namePlaceholder: 'ಉದಾ: ಸುನೀತಾ ದೇವಿ',
      categoryLabel: 'ಕೌಶಲ್ಯದ ವರ್ಗ',
      categoryHelper: 'ನೀವು ಯಾವ ಸೇವೆಯನ್ನು ನೀಡಲು ಬಯಸುತ್ತೀರಿ?',
      priceLabel: 'ದರ / ಶುಲ್ಕ',
      priceHelper: 'ಉದಾ: ₹200/ಬ್ಲೌಸ್ ಅಥವಾ ₹120/ಊಟ',
      pricePlaceholder: 'ಉದಾ: ₹200/ಬ್ಲೌಸ್',
      locationLabel: 'ಸ್ಥಳ / ಪ್ರದೇಶ / ಬಡಾವಣೆ',
      locationHelper: 'ನಿಮ್ಮ ಊರು, ಬಡಾವಣೆ ಅಥವಾ ರಸ್ತೆ',
      locationPlaceholder: 'ಉದಾ: ರಾಂಪುರ, ದೇವಸ್ಥಾನದ ಹತ್ತಿರ',
      descLabel: 'ಸೇವೆಯ ಸಂಕ್ಷಿಪ್ತ ವಿವರಣೆ',
      descHelper: 'ನಿಮ್ಮ ಕೆಲಸ ಮತ್ತು ಅನುಭವವನ್ನು ತಿಳಿಸಿ. ಮಾತನಾಡಲು ಮೈಕ್ ಒತ್ತಿ!',
      descPlaceholder:
        'ಉದಾ: 8 ವರ್ಷಗಳ ಅನುಭವದೊಂದಿಗೆ ಸುಂದರವಾದ ಬ್ಲೌಸ್ ಹೊಲಿಗೆ. ಸೂಕ್ತ ಫಿಟ್ಟಿಂಗ್ ಮತ್ತು ತ್ವರಿತ ಸೇವೆ.',
      listeningIndicator: 'ಕೇಳುತ್ತಿದ್ದೇವೆ... ಮಾತನಾಡಿ...',
      doneStop: 'ಸಾಕು / ನಿಲ್ಲಿಸಿ',
      photoLabel: 'ಪ್ರೊಫೈಲ್ / ಕೆಲಸದ ಫೋಟೋ',
      photoHelper: 'ನಿಮ್ಮ ಅಥವಾ ಕೆಲಸದ ಫೋಟೋ ಫೋನ್‌ನಿಂದ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಅಥವಾ ಕೆಳಗೆ ಆಯ್ಕೆಮಾಡಿ',
      uploadPhotoBtn: 'ಫೋನ್‌ನಿಂದ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
      photoSelected: 'ಫೋಟೋ ಆಯ್ಕೆಯಾಗಿದೆ',
      photoPresetsLabel: 'ಅಥವಾ ಸಿದ್ಧ ಮಾದರಿ ಫೋಟೋ ಆಯ್ಕೆಮಾಡಿ:',
      selectedPhotoText: 'ಆಯ್ಕೆಮಾಡಿದ ಪ್ರೊಫೈಲ್ ಫೋಟೋ',
      removePhoto: 'ಫೋಟೋ ತೆಗೆದುಹಾಕಿ',
      phoneLabel: 'ಸಂಪರ್ಕ ಫೋನ್ / ವಾಟ್ಸಾಪ್',
      phoneHelper: 'ಗ್ರಾಹಕರು ಈ ಸಂಖ್ಯೆಯಲ್ಲಿ ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತಾರೆ',
      phonePlaceholder: 'ಉದಾ: +91 98765 43210',
      shgCheckbox: 'ನಾನು ಮಹಿಳಾ ಸ್ವಸಹಾಯ ಸಂಘದ (ಬಚತ್ ಗಟ್) ಸದಸ್ಯೆ',
      shgHelper: 'ಗ್ರಾಹಕರ ನಂಬಿಕೆಗಾಗಿ ನಿಮ್ಮ ಕಾರ್ಡ್‌ಗೆ ಹಸಿರು SHG ಬ್ಯಾಡ್ಜ್ ಸೇರಿಸುತ್ತದೆ.',
      shgGroupPlaceholder: 'ಉದಾ: ದುರ್ಗಾ ಮಹಿಳಾ ಬಚತ್ ಗಟ್',
      submitBtn: 'ಸೇವೆಯನ್ನು ಸಲ್ಲಿಸಿ • Submit Listing',
      saveChangesBtn: 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ • Save Changes',
      submitSubtext: 'ಬ್ರೌಸರ್‌ನಲ್ಲಿ ತಕ್ಷಣ ಉಳಿಯುತ್ತದೆ. ಯಾವುದೇ ನೋಂದಣಿ ಶುಲ್ಕವಿಲ್ಲ.',
      successTitle: 'ಅಭಿನಂದನೆಗಳು! ನಿಮ್ಮ ಸೇವೆ ಸೇರಿಸಲ್ಪಟ್ಟಿದೆ',
      successDesc: (name, category) =>
        `${name}, ನಿಮ್ಮ ${category} ಸೇವೆ ಈಗ SkillSetu ನಲ್ಲಿ ಗ್ರಾಹಕರಿಗೆ ಕಾಣಿಸುತ್ತದೆ.`,
      viewOnSearchBtn: 'ಹುಡುಕಾಟ ಪುಟದಲ್ಲಿ ನೋಡಿ →',
      addAnotherBtn: 'ಮತ್ತೊಂದು ಸೇವೆ ಸೇರಿಸಿ',
      errorName: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರನ್ನು ನಮೂದಿಸಿ.',
      errorCategory: 'ದಯವಿಟ್ಟು ಕೌಶಲ್ಯದ ವರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
      errorPrice: 'ದಯವಿಟ್ಟು ದರವನ್ನು ನಮೂದಿಸಿ (ಉದಾ: ₹200/ಬ್ಲೌಸ್).',
      errorLocation: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸ್ಥಳ ಅಥವಾ ಬಡಾವಣೆಯನ್ನು ನಮೂದಿಸಿ.',
      errorDesc: 'ದಯವಿಟ್ಟು ಸೇವೆಯ ವಿವರಣೆಯನ್ನು ನಮೂದಿಸಿ.',
      errorFile: 'ದಯವಿಟ್ಟು 2.5MB ಗಿಂತ ಕಡಿಮೆ ಇರುವ ಫೋಟೋ ಆಯ್ಕೆಮಾಡಿ.',
    },
    buyerSearch: {
      backToHome: 'ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ',
      offerServiceInstead: 'ನಿಮ್ಮ ಸೇವೆಯನ್ನೂ ಸೇರಿಸಿ',
      searchTitle: 'ಸ್ಥಳೀಯ ಮಹಿಳಾ ಸೇವೆಗಳನ್ನು ಹುಡುಕಿ',
      searchSubtitle:
        'ಹೊಲಿಗೆ, ಅಡುಗೆ, ಟ್ಯೂಷನ್, ಮೆಹಂದಿ ಮುಂತಾದ ಸೇವೆಗಳಿಗೆ ಸಮೀಪದ ದೃಢೀಕೃತ ಮಹಿಳೆಯರನ್ನು ನೋಡಿ.',
      filterCategoryLabel: 'ಕೌಶಲ್ಯದ ಪ್ರಕಾರ ಫಿಲ್ಟರ್ ಮಾಡಿ',
      allCategories: 'ಎಲ್ಲಾ ವಿಭಾಗಗಳು',
      filterLocationLabel: 'ಸ್ಥಳದ ಪ್ರಕಾರ ಫಿಲ್ಟರ್ ಮಾಡಿ',
      allLocations: 'ಎಲ್ಲಾ ಸ್ಥಳಗಳು',
      searchKeywordLabel: 'ಹೆಸರು ಅಥವಾ ಪದದಿಂದ ಹುಡುಕಿ',
      searchPlaceholder: 'ಉದಾ: ಬ್ಲೌಸ್, ಊಟ, ಗಣಿತ...',
      showing: 'ತೋರಿಸಲಾಗುತ್ತಿದೆ',
      matchingResults: 'ಫಲಿತಾಂಶಗಳು',
      resetFilters: 'ಎಲ್ಲಾ ಫಿಲ್ಟರ್ ರದ್ದುಮಾಡಿ',
      viewProfileBtn: 'ಪೂರ್ಣ ಪ್ರೊಫೈಲ್ ನೋಡಿ ಮತ್ತು ಸಂಪರ್ಕಿಸಿ →',
      noResultsTitle: 'ಯಾವುದೇ ಸೇವೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ',
      noResultsDesc: 'ನಿಮ್ಮ ಫಿಲ್ಟರ್‌ಗೆ ಹೊಂದಿಕೆಯಾಗುವ ಸೇವೆಗಳಿಲ್ಲ. ದಯವಿಟ್ಟು ಬೇರೆ ಆಯ್ಕೆ ಪ್ರಯತ್ನಿಸಿ.',
      clearFiltersBtn: 'ಎಲ್ಲಾ ಫಿಲ್ಟರ್ ರದ್ದುಮಾಡಿ',
    },
    sellerProfile: {
      backToSearch: 'ಹುಡುಕಾಟ ಫಲಿತಾಂಶಕ್ಕೆ ಹಿಂತಿರುಗಿ',
      shareProfile: 'ಹಂಚಿಕೊಳ್ಳಿ',
      linkCopied: 'ಲಿಂಕ್ ನಕಲಿಸಲಾಗಿದೆ!',
      shgVerifiedMember: 'ಸ್ವಸಹಾಯ ಸಂಘ ದೃಢೀಕೃತ ಸದಸ್ಯೆ',
      priceRates: 'ದರ / ಬೆಲೆ',
      locationLabel: 'ಸ್ಥಳ',
      experienceLabel: 'ಅನುಭವ',
      yearsPracticalSkill: 'ವರ್ಷಗಳ ನೈಜ ಕೌಶಲ್ಯ',
      experiencedArtisan: 'ಅನುಭವಿ ಸ್ಥಳೀಯ ಕುಶಲಕರ್ಮಿ',
      availabilityLabel: 'ಲಭ್ಯತೆ',
      shgBoxTitle: 'ಸ್ವಸಹಾಯ ಸಂಘ (SHG) ದೃಢೀಕೃತ ಸದಸ್ಯೆ',
      shgBoxDesc: (groupName) =>
        groupName
          ? `ಸದಸ್ಯೆ: "${groupName}". ಪರಿಶೀಲಿಸಿದ ಗುರುತು, ನ್ಯಾಯಯುತ ಬೆಲೆ ಮತ್ತು ವಿಶ್ವಾಸಾರ್ಹತೆ.`
          : 'ಸ್ಥಳೀಯ ಮಹಿಳಾ ಸ್ವಸಹಾಯ ಸಂಘದ ದೃಢೀಕೃತ ಸದಸ್ಯೆ.',
      trusted100: '100% ನಂಬಿಕಾರ್ಹ',
      aboutTitle: 'ಕೆಲಸ ಮತ್ತು ಕೌಶಲ್ಯದ ಬಗ್ಗೆ',
      highlightsTitle: 'ಪ್ರಮುಖ ಮುಖ್ಯಾಂಶಗಳು',
      hlDirectDelivery: 'ನೇರ ಸ್ಥಳೀಯ ಸೇವೆ',
      hlFairPricing: 'ನ್ಯಾಯಯುತ ಮತ್ತು ಸ್ಪಷ್ಟ ಬೆಲೆ',
      hlNoCommission: 'ಯಾವುದೇ ಮಧ್ಯವರ್ತಿ ಕಮಿಷನ್ ಇಲ್ಲ',
      hlDirectPay: 'ನಗದು ಅಥವಾ ಯುಪಿಐ ಮೂಲಕ ನೇರ ಪಾವತಿ',
      contactSellerBtn: 'ಸಂಪರ್ಕಿಸಿ (Contact Seller)',
      contactSubtext: 'ನೇರ ಫೋನ್ ಕರೆ ಅಥವಾ ವಾಟ್ಸಾಪ್ ಸಂದೇಶ',
    },
    contactModal: {
      contactTitle: (name) => `${name} ಅವರನ್ನು ಸಂಪರ್ಕಿಸಿ`,
      directOptionsLabel: 'ನೇರ ಸಂಪರ್ಕದ ಆಯ್ಕೆಗಳು',
      callPhoneBtn: (phone) => `ಫೋನ್ ಕರೆ ಮಾಡಿ (${phone})`,
      messageWhatsAppBtn: 'ವಾಟ್ಸಾಪ್ ಸಂದೇಶ ಕಳುಹಿಸಿ',
      quickQuestionsLabel: 'ತ್ವರಿತ ಪ್ರಶ್ನೆಯನ್ನು ಆರಿಸಿ:',
      qAvailability: 'ನೀವು ಈ ವಾರ ಲಭ್ಯವಿದ್ದೀರಾ?',
      qHomeVisit: 'ನೀವು ಮನೆಗೆ ಬಂದು ಸೇವೆ ನೀಡುತ್ತೀರಾ?',
      qPriceDetails: 'ದಯವಿಟ್ಟು ದರ ವಿವರಗಳನ್ನು ತಿಳಿಸಿ.',
      sendNoteLabel: 'ಸಂದೇಶ ಅಥವಾ ಅಗತ್ಯವನ್ನು ಟೈಪ್ ಮಾಡಿ',
      notePlaceholder: 'ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ...',
      saveAndWhatsAppBtn: 'ಸಂದೇಶ ಸಿದ್ಧಪಡಿಸಿ ವಾಟ್ಸಾಪ್ ತೆರೆಯಿರಿ',
      messageNoted: (name) => `ಸಂದೇಶ ಸಿದ್ಧವಾಗಿದೆ! ಈಗ ನೀವು ನೇರವಾಗಿ ${name} ಅವರೊಂದಿಗೆ ಮಾತನಾಡಬಹುದು.`,
      promiseTitle: 'ನ್ಯಾಯಯುತ ಸಮುದಾಯ ಭರವಸೆ',
      promiseDesc: (name) =>
        `SkillSetu ಶೂನ್ಯ ಕಮಿಷನ್ ತೆಗೆದುಕೊಳ್ಳುತ್ತದೆ. ಸೇವೆ ಮುಗಿದ ನಂತರ ನೇರವಾಗಿ ಹಣ ನೀಡಿ. ದಯವಿಟ್ಟು ಮಹಿಳಾ ಸೇವಾಕರ್ತರನ್ನು ಗೌರವದಿಂದ ಕಾಣಿರಿ.`,
    },
    footer: {
      mission:
        'ಗ್ರಾಮೀಣ ಮತ್ತು ಅರೆ-ನಗರ ಮಹಿಳಾ ಕೌಶಲ್ಯಗಳನ್ನು ನೆರೆಹೊರೆಯ ಗ್ರಾಹಕರೊಂದಿಗೆ ನೇರವಾಗಿ ಬೆಸೆಯುವ ವೇದಿಕೆ. ಶೂನ್ಯ ಕಮಿಷನ್ ಮತ್ತು ಗೌರವ.',
      shgSupport: 'ಭಾರತದಾದ್ಯಂತ ಮಹಿಳಾ ಸ್ವಸಹಾಯ ಸಂಘಗಳಿಗೆ ಬೆಂಬಲ',
      exploreTitle: 'ಪುಟಗಳು',
      homeLink: 'ಮುಖಪುಟ',
      buyerSearchLink: 'ಸೇವೆ ಹುಡುಕಿ',
      sellerListingLink: 'ಸೇವೆ ನೀಡಿ',
      localSkillsTitle: 'ಸ್ಥಳೀಯ ಕೌಶಲ್ಯಗಳು',
      copyright: 'SkillSetu. ಸ್ಥಳೀಯ ಮಹಿಳಾ ಉದ್ಯಮಿಗಳ ವೇದಿಕೆ.',
      resetDataBtn: 'ಮಾದರಿ ಡೇಟಾ ಮರುಹೊಂದಿಸಿ',
    },
  },

  ta: {
    appTagline: 'அவள் குரல் • அவள் வருமானம் • அவள் வாழ்க்கை',
    taglineHero: 'அவள் குரல் • அவள் வருமானம் • அவள் வாழ்க்கை • her voice.her income.her life',
    shgBadge: 'சுயஉதவி குழு சரிபார்க்கப்பட்டது',
    nav: {
      home: 'முகப்பு',
      findServices: 'சேவை தேடுங்கள்',
      offerService: 'சேவை வழங்குங்கள்',
      myListings: 'என் சேவைகள்',
      changeLanguage: 'மொழி மாற்று',
    },
    home: {
      heroBadge: 'சுயஉதவி குழு சரிபார்க்கப்பட்டது • பெண்கள் மேம்பாடு',
      heroTitle: 'உங்கள் பகுதியில் உள்ள திறமையான பெண்களுடன் நேரடியாக இணையுங்கள்',
      heroSubtitle:
        'தையல், வீட்டு சமையல், பாடம் கற்பித்தல் மற்றும் மெஹந்திக்கு நம்பிக்கையான பெண்களைத் தேடுங்கள். அல்லது உங்கள் திறனால் சுயமரியாதையுடன் சம்பாதிக்கத் தொடங்குங்கள்.',
      btnOffer: 'நான் சேவை வழங்குகிறேன்',
      btnOfferSub: 'சேவை சேர்க்கவும் • திறமை உள்ள பெண்களுக்கு',
      btnOfferAction: 'இப்போதே சேவை சேர்க்கவும்',
      btnNeed: 'எனக்கு சேவை தேவை',
      btnNeedSub: 'சரிபார்க்கப்பட்ட பெண்களைக் கண்டறியவும்',
      btnNeedAction: 'சேவைகளைத் தேடுங்கள்',
      voiceTip: 'குரல் தட்டச்சு வசதி! உங்கள் மொழியில் பேசி சேவை விவரங்களை உள்ளிடவும்.',
      categoriesTitle: 'உள்ளூர் திறன்கள் மூலம் தேடுங்கள்',
      categoriesSubtitle: 'உங்களுக்கு அருகிலுள்ள பெண்களைக் கண்டறிய திறனைத் தேர்ந்தெடுக்கவும்',
      viewAllCategories: 'அனைத்து பிரிவுகளையும் காண்க',
      findInArea: 'உங்கள் பகுதியில் தேடுங்கள்',
      featuredTitle: 'சிறப்பு உள்ளூர் சேவை வழங்குநர்கள்',
      featuredSubtitle: 'இன்றே சேவை வழங்கத் தயாராக உள்ள சரிபார்க்கப்பட்ட பெண்கள்',
      seeAll: 'அனைத்தையும் காண்க',
      directContactBadge: 'நேரடி தொடர்பு',
      viewProfileArrow: 'சுயவிவரம் காண்க →',
      howItWorksTitle: 'SkillSetu எப்படி செயல்படுகிறது',
      howItWorksSubtitle: 'உள்ளூர் பெண்களுக்கு எளிய, நேரடி மற்றும் பூஜ்ஜிய கமிஷன்',
      step1Title: '1. உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்',
      step1Desc: 'தமிழ், இந்தி அல்லது ஆங்கிலத்தைத் தேர்ந்தெடுக்கவும். முழு செயலியும் உங்கள் மொழியில் பேசும்.',
      step2Title: '2. பேசி அல்லது தட்டச்சு செய்து பகிருங்கள்',
      step2Desc: 'உங்கள் திறமையை அல்லது தேவையை மைக் மூலம் உங்கள் இயல்பான மொழியில் பேசுங்கள்.',
      step3Title: '3. AI பட்டியலை உருவாக்கி மொழிபெயர்க்கிறது',
      step3Desc: 'Gemini AI உங்கள் பேச்சைப் புரிந்துகொண்டு துல்லியமான சேவைப் பட்டியலை உருவாக்கி மொழிபெயர்க்கும்.',
      step4Title: '4. நேரடியாகத் தொடர்பு கொள்ளுங்கள்',
      step4Desc: 'பூஜ்ஜிய கமிஷன் அல்லது இடைத்தரகர் இன்றி நேரடியாக போன் அல்லது வாட்ஸ்அப்பில் பேசுங்கள்.',
    },
    myListings: {
      pageTitle: 'என் சேவைகள் (My Listings)',
      pageSubtitle: 'உங்கள் சேவைகளை எளிதாக நிர்வகிக்கவும் மாற்றவும்',
      emptyTitle: 'நீங்கள் இன்னும் எந்த சேவையையும் சேர்க்கவில்லை',
      emptySubtitle: 'தையல், சமையல், டியூஷன் அல்லது மெஹந்தி சேவையை உடனே சேர்த்து பூஜ்ஜிய கமிஷனில் சம்பாதிக்கத் தொடங்குங்கள்.',
      createFirstBtn: 'உங்கள் முதல் சேவையை இப்போது சேர்க்கவும்',
      createNewBtn: 'புதிய சேவையைச் சேர்க்கவும்',
      viewAsBuyerBtn: 'வாங்குபவராகப் பார்க்கவும்',
      editBtn: 'திருத்து',
      deleteBtn: 'நீக்கு',
      confirmDeleteTitle: 'இந்த சேவையை நீக்கவா?',
      confirmDeleteDesc: 'நீங்கள் நிச்சயமாக இந்த சேவைப் பட்டியலை நீக்க விரும்புகிறீர்களா? இதை மீட்டெடுக்க முடியாது.',
      confirmDeleteAction: 'ஆம், நீக்கு',
      cancelAction: 'ரத்து செய்',
    },
    categories: {
      Tailoring: {
        title: 'தையல் வேலை',
        subtitle: 'பிளவுஸ், சுடிதார்',
        desc: 'பிளவுஸ், சுடிதார், குர்தி, சேலை ஃபால் பிகோ மற்றும் சரியான தையல்',
      },
      Cooking: {
        title: 'சமையல் மற்றும் டிபன்',
        subtitle: 'சுத்தமான வீட்டு உணவு',
        desc: 'வீட்டு சுத்தமான உணவு, தினசரி டிபன் மற்றும் சுவையான பலகாரங்கள்',
      },
      Tutoring: {
        title: 'பாடம் கற்பித்தல்',
        subtitle: 'ஆரம்பக் கல்வி மற்றும் பாடம்',
        desc: '1 முதல் 8 ஆம் வகுப்பு மாணவர்களுக்கு கணிதம், வாசிப்பு மற்றும் வீட்டுப்பாடம்',
      },
      Mehendi: {
        title: 'மெஹந்தி கலை',
        subtitle: 'திருமணம் மற்றும் பண்டிகை',
        desc: 'திருமணம், பண்டிகைகளுக்கு மூலிகை இயற்கை மெஹந்தி கலை',
      },
      Other: {
        title: 'பிற திறன்கள்',
        subtitle: 'கைவினை மற்றும் கலைகள்',
        desc: 'எம்பிராய்டரி, கைவினைப்பொருட்கள் மற்றும் உள்ளூர் கைவினைப் பணிகள்',
      },
    },
    sellerListing: {
      backToHome: 'முகப்புக்குத் திரும்பு',
      createTitle: 'உங்கள் திறன் பட்டியலை உருவாக்கவும்',
      createSubtitle:
        'விவரங்களை நிரப்பவும். விளக்கத்தை பேச மைக் பொத்தானை அழுத்தி எளிதாகப் பேசலாம்!',
      editTitle: 'உங்கள் சேவையைத் திருத்தவும்',
      editSubtitle: 'உங்கள் சேவை விவரங்கள், கட்டணம் அல்லது தகவல்களை கீழே புதுப்பிக்கவும்.',
      nameLabel: 'உங்கள் முழுப் பெயர்',
      nameHelper: 'உதாரணம்: சுனிதா தேவி',
      namePlaceholder: 'உதா: சுனிதா தேவி',
      categoryLabel: 'திறன் பிரிவு',
      categoryHelper: 'நீங்கள் என்ன சேவை வழங்க விரும்புகிறீர்கள்?',
      priceLabel: 'விலை / கட்டணம்',
      priceHelper: 'உதா: ₹200/பிளவுஸ் அல்லது ₹120/டிபன்',
      pricePlaceholder: 'உதா: ₹200/பிளவுஸ்',
      locationLabel: 'இடம் / பகுதி / ஊர்',
      locationHelper: 'உங்கள் ஊர் அல்லது தெரு பெயர்',
      locationPlaceholder: 'உதா: ராம்பூர், கோவில் அருகில்',
      descLabel: 'குறுகிய விளக்கம்',
      descHelper: 'உங்கள் வேலை மற்றும் அனுபவத்தை விவரிக்கவும். பேச மைக்கை அழுத்தவும்!',
      descPlaceholder:
        'உதா: 8 வருட அனுபவத்துடன் பிளவுஸ் தையல். சரியான பொருத்தம் மற்றும் விரைவான சேவை.',
      listeningIndicator: 'கேட்கிறது... இப்போது பேசுங்கள்...',
      doneStop: 'முடிந்தது / நிறுத்து',
      photoLabel: 'சுயவிவர / வேலை புகைப்படம்',
      photoHelper: 'உங்கள் புகைப்படத்தைப் பதிவேற்றவும் அல்லது மாதிரியைத் தேர்ந்தெடுக்கவும்',
      uploadPhotoBtn: 'போனிலிருந்து புகைப்படத்தைப் பதிவேற்றவும்',
      photoSelected: 'புகைப்படம் தேர்ந்தெடுக்கப்பட்டது',
      photoPresetsLabel: 'அல்லது மாதிரி புகைப்படத்தைத் தேர்ந்தெடுக்கவும்:',
      selectedPhotoText: 'தேர்ந்தெடுக்கப்பட்ட புகைப்படம்',
      removePhoto: 'நீக்கு',
      phoneLabel: 'தொடர்பு தொலைபேசி / வாட்ஸ்அப்',
      phoneHelper: 'வாங்குபவர்கள் இந்த எண்ணில் தொடர்புகொள்வார்கள்',
      phonePlaceholder: 'உதா: +91 98765 43210',
      shgCheckbox: 'நான் மகளிர் சுயஉதவி குழுவின் (SHG) உறுப்பினர்',
      shgHelper: 'நம்பகத்தன்மைக்காக உங்கள் கார்டில் பச்சை பேட்ஜ் சேர்க்கப்படும்.',
      shgGroupPlaceholder: 'உதா: அன்னை மகளிர் குழு (குழு பெயர்)',
      submitBtn: 'சேவையைச் சமர்ப்பிக்கவும் • Submit Listing',
      saveChangesBtn: 'மாற்றங்களைச் சேமி • Save Changes',
      submitSubtext: 'உடனடியாக சேமிக்கப்படும். எந்த கட்டணமும் இல்லை.',
      successTitle: 'வாழ்த்துகள்! உங்கள் சேவை பட்டியலிடப்பட்டது',
      successDesc: (name, category) =>
        `${name}, உங்கள் ${category} சேவை இப்போது SkillSetu தளத்தில் வாங்குபவர்களுக்குக் காணப்படுகிறது.`,
      viewOnSearchBtn: 'தேடல் பக்கத்தில் காண்க →',
      addAnotherBtn: 'மற்றொரு சேவையைச் சேர்க்கவும்',
      errorName: 'தயவுசெய்து உங்கள் முழுப் பெயரை உள்ளிடவும்.',
      errorCategory: 'தயவுசெய்து திறன் பிரிவைத் தேர்ந்தெடுக்கவும்.',
      errorPrice: 'தயவுசெய்து கட்டணத்தை உள்ளிடவும் (உதா: ₹200/பிளவுஸ்).',
      errorLocation: 'தயவுசெய்து உங்கள் இடத்தை உள்ளிடவும்.',
      errorDesc: 'தயவுசெய்து சேவை விளக்கத்தை உள்ளிடவும்.',
      errorFile: 'தயவுசெய்து 2.5MB-க்குள் உள்ள புகைப்படத்தைத் தேர்ந்தெடுக்கவும்.',
    },
    buyerSearch: {
      backToHome: 'முகப்புக்குத் திரும்பு',
      offerServiceInstead: 'உங்கள் சேவையையும் சேர்க்கவும்',
      searchTitle: 'உள்ளூர் பெண்கள் சேவைகளைக் கண்டறியவும்',
      searchSubtitle:
        'தையல், சமையல், பாடம், மெஹந்தி வழங்கும் பெண்களைக் கண்டறிந்து நேரடியாக இணையுங்கள்.',
      filterCategoryLabel: 'திறன் வகை மூலம் வடிகட்டவும்',
      allCategories: 'அனைத்துப் பிரிவுகளும்',
      filterLocationLabel: 'இடத்தின் அடிப்படையில் வடிகட்டவும்',
      allLocations: 'அனைத்து இடங்களும்',
      searchKeywordLabel: 'பெயர் அல்லது சொல் மூலம் தேடுங்கள்',
      searchPlaceholder: 'உதா: பிளவுஸ், டிபன், கணிதம்...',
      showing: 'காட்டப்படுகிறது',
      matchingResults: 'முடிவுகள்',
      resetFilters: 'அனைத்து வடிப்பான்களையும் மீட்டமை',
      viewProfileBtn: 'முழு சுயவிவரத்தைக் கண்டு தொடர்பு கொள்ளவும் →',
      noResultsTitle: 'பட்டியல்கள் எதுவும் இல்லை',
      noResultsDesc: 'பொருத்தமான சேவைகள் இல்லை. வேறு தேர்வை முயற்சிக்கவும்.',
      clearFiltersBtn: 'அனைத்து வடிப்பான்களையும் மீட்டமை',
    },
    sellerProfile: {
      backToSearch: 'தேடல் முடிவுகளுக்குத் திரும்பு',
      shareProfile: 'பகிரவும்',
      linkCopied: 'இணைப்பு நகலெடுக்கப்பட்டது!',
      shgVerifiedMember: 'சுயஉதவி குழு உறுப்பினர்',
      priceRates: 'கட்டணம் / விலை',
      locationLabel: 'இடம்',
      experienceLabel: 'அனுபவம்',
      yearsPracticalSkill: 'வருட அனுபவம்',
      experiencedArtisan: 'அனுபவம் வாய்ந்த கைவினைஞர்',
      availabilityLabel: 'கிடைக்கும் நேரம்',
      shgBoxTitle: 'சுயஉதவி குழு (SHG) சரிபார்க்கப்பட்ட உறுப்பினர்',
      shgBoxDesc: (groupName) =>
        groupName
          ? `உறுப்பினர்: "${groupName}". சரிபார்க்கப்பட்ட அடையாளம் மற்றும் நம்பகத்தன்மை.`
          : 'உள்ளூர் மகளிர் சுயஉதவி குழுவின் சரிபார்க்கப்பட்ட உறுப்பினர்.',
      trusted100: '100% நம்பகமானது',
      aboutTitle: 'வேலை மற்றும் திறன் பற்றி',
      highlightsTitle: 'சிறப்பம்சங்கள்',
      hlDirectDelivery: 'நேரடி உள்ளூர் சேவை',
      hlFairPricing: 'நியாயமான வெளிப்படையான விலை',
      hlNoCommission: 'பூஜ்ஜிய கமிஷன்',
      hlDirectPay: 'நேரடி பணம் அல்லது யுபிஐ கட்டணம்',
      contactSellerBtn: 'தொடர்பு கொள்ளவும் (Contact Seller)',
      contactSubtext: 'நேரடி தொலைபேசி அழைப்பு அல்லது வாட்ஸ்அப் செய்தி',
    },
    contactModal: {
      contactTitle: (name) => `${name} என்பவரைத் தொடர்பு கொள்ளவும்`,
      directOptionsLabel: 'நேரடி தொடர்பு வழிகள்',
      callPhoneBtn: (phone) => `போன் செய்யவும் (${phone})`,
      messageWhatsAppBtn: 'வாட்ஸ்அப் செய்தி அனுப்பவும்',
      quickQuestionsLabel: 'விரைவு கேள்வியைத் தேர்ந்தெடுக்கவும்:',
      qAvailability: 'நீங்கள் இந்த வாரம் வர முடியுமா?',
      qHomeVisit: 'வீட்டுக்கு வந்து சேவை செய்வீர்களா?',
      qPriceDetails: 'கட்டண விவரங்களை கூற முடியுமா?',
      sendNoteLabel: 'செய்தியை உள்ளிடவும்',
      notePlaceholder: 'உங்கள் தேவையை இங்கே எழுதவும்...',
      saveAndWhatsAppBtn: 'செய்தியைத் தயார் செய்து வாட்ஸ்அப் திறக்கவும்',
      messageNoted: (name) => `செய்தி தயாராக உள்ளது! இப்போது நீங்கள் நேரடியாக ${name} உடன் பேசலாம்.`,
      promiseTitle: 'நம்பகமான சமூக உறுதிமொழி',
      promiseDesc: (name) =>
        `SkillSetu எந்த கமிஷனும் எடுப்பதில்லை. முழு கட்டணமும் நேரடியாக ${name} என்பவருக்குச் செல்கிறது. பெண்களை மரியாதையுடன் நடத்துங்கள்.`,
    },
    footer: {
      mission:
        'திறமையான பெண்களையும் வாங்குபவர்களையும் நேரடியாக இணைக்கும் பாலம். சுயமரியாதை மற்றும் பூஜ்ஜிய கமிஷன்.',
      shgSupport: 'இந்தியா முழுவதும் உள்ள மகளிர் சுயஉதவி குழுக்களுக்கு ஆதரவு',
      exploreTitle: 'பக்கங்கள்',
      homeLink: 'முகப்பு',
      buyerSearchLink: 'சேவை தேடுங்கள்',
      sellerListingLink: 'சேவை வழங்குங்கள்',
      localSkillsTitle: 'உள்ளூர் திறன்கள்',
      copyright: 'SkillSetu. பெண்களின் சுயதொழில் தளம்.',
      resetDataBtn: 'மாதிரித் தரவை மீட்டமை',
    },
  },

  te: {
    appTagline: 'ఆమె స్వరం • ఆమె ఆదాయం • ఆమె జీవితం',
    taglineHero: 'ఆమె స్వరం • ఆమె ఆదాయం • ఆమె జీవితం • her voice.her income.her life',
    shgBadge: 'స్వయం సహాయక సంఘం ధృవీకరించబడింది',
    nav: {
      home: 'హోమ్',
      findServices: 'సేవలను కనుగొనండి',
      offerService: 'సేవను అందించండి',
      myListings: 'నా సేవలు',
      changeLanguage: 'భాషను మార్చండి',
    },
    home: {
      heroBadge: 'SHG ధృవీకరించబడింది • మహిళా సాధికారత',
      heroTitle: 'మీ ప్రాంతంలోని నైపుణ్యం కలిగిన మహిళలతో నేరుగా కనెక్ట్ అవ్వండి',
      heroSubtitle:
        'టైలరింగ్, ఇంటి వంట, పిల్లల ట్యూషన్ మరియు మెహందీ కోసం నమ్మకమైన మహిళలతో కనెక్ట్ అవ్వండి. లేదా మీ నైపుణ్యాలతో గౌరవంగా సంపాదించడం ప్రారంభించండి.',
      btnOffer: 'నేను సేవ అందిస్తాను',
      btnOfferSub: 'మీ సేవను జోడించండి • నైపుణ్యం ఉన్న మహిళల కోసం',
      btnOfferAction: 'ఇప్పుడే సేవను జోడించండి',
      btnNeed: 'నాకు సేవ కావాలి',
      btnNeedSub: 'సమీపంలోని ధృవీకరించబడిన మహిళలను కనుగొనండి',
      btnNeedAction: 'సేవలను శోధించండి',
      voiceTip: 'వాయిస్ టైపింగ్ అందుబాటులో ఉంది! మీ భాషలో మాట్లాడి వివరించండి.',
      categoriesTitle: 'స్థానిక నైపుణ్యాల వారీగా బ్రౌజ్ చేయండి',
      categoriesSubtitle: 'మీ సమీపంలోని మహిళలను కనుగొనడానికి నైపుణ్యాన్ని ఎంచుకోండి',
      viewAllCategories: 'అన్ని వర్గాలను చూడండి',
      findInArea: 'మీ ప్రాంతంలో కనుగొనండి',
      featuredTitle: 'ప్రత్యేక స్థానిక సేవకులు',
      featuredSubtitle: 'ఈరోజే సేవలను అందించడానికి సిద్ధంగా ఉన్న మహిళలు',
      seeAll: 'అన్నీ చూడండి',
      directContactBadge: 'ప్రత్యక్ష సంప్రదింపు',
      viewProfileArrow: 'ప్రొఫైల్ చూడండి →',
      howItWorksTitle: 'SkillSetu ఎలా పనిచేస్తుంది',
      howItWorksSubtitle: 'స్థానిక మహిళలకు సులభమైన, ప్రత్యక్ష మరియు సున్నా కమీషన్',
      step1Title: '1. మీ భాషను ఎంచుకోండి',
      step1Desc: 'తెలుగు, హిందీ లేదా ఇంగ్లీష్ ఎంచుకోండి. యాప్ మొత్తం మీ భాషలోనే పనిచేస్తుంది.',
      step2Title: '2. మాట్లాడండి లేదా టైప్ చేయండి',
      step2Desc: 'మీ నైపుణ్యం లేదా అవసరాన్ని మైక్ ద్వారా మీ సహజమైన భాషలో సులభంగా మాట్లాడండి.',
      step3Title: '3. AI లిస్టింగ్‌ను సృష్టించి అనువదిస్తుంది',
      step3Desc: 'Gemini AI మీ మాటలను అర్థం చేసుకుని ఖచ్చితమైన సేవా వివరాలను సృష్టిస్తుంది.',
      step4Title: '4. నేరుగా సంప్రదించండి',
      step4Desc: 'సున్నా కమీషన్‌తో ఫోన్ లేదా వాట్సాప్ ద్వారా నేరుగా మాట్లాడండి. దళారులు లేరు.',
    },
    myListings: {
      pageTitle: 'నా సేవలు (My Listings)',
      pageSubtitle: 'మీ సక్రియ సేవా జాబితాలను నిర్వహించండి మరియు ఎప్పుడైనా నవీకరించండి',
      emptyTitle: 'మీరు ఇంకా ఎలాంటి సేవను నమోదు చేయలేదు',
      emptySubtitle: 'టైలరింగ్, వంట, ట్యూషన్ లేదా మెహందీ సేవను చేర్చి సున్నా కమీషన్‌తో సంపాదించడం ప్రారంభించండి.',
      createFirstBtn: 'మీ మొదటి సేవను ఇప్పుడే జోడించండి',
      createNewBtn: 'కొత్త సేవను జోడించండి',
      viewAsBuyerBtn: 'కొనుగోలుదారుగా చూడండి',
      editBtn: 'సవరించండి',
      deleteBtn: 'తొలగించండి',
      confirmDeleteTitle: 'ఈ సేవను తొలగించాలా?',
      confirmDeleteDesc: 'మీరు ఖచ్చితంగా ఈ సేవా జాబితాను తీసివేయాలనుకుంటున్నారా? దీన్ని తిరిగి పొందలేరు.',
      confirmDeleteAction: 'అవును, తొలగించండి',
      cancelAction: 'రద్దు చేయండి',
    },
    categories: {
      Tailoring: {
        title: 'టైలరింగ్',
        subtitle: 'బ్లౌజ్, కుర్తీ, కుట్లు',
        desc: 'బ్లౌజ్, కుర్తీ, సల్వార్ సూట్స్, చీర ఫాల్ పికో మరియు ఆల్టరేషన్స్',
      },
      Cooking: {
        title: 'వంట మరియు టిఫిన్',
        subtitle: 'ఇంటి స్వచ్ఛమైన భోజనం',
        desc: 'ఇంటి తాజా భోజనం, రోజువారీ టిఫిన్ మరియు పండుగ పిండివంటలు',
      },
      Tutoring: {
        title: 'పిల్లల ట్యూషన్',
        subtitle: 'చదువు మరియు హోంవర్క్',
        desc: '1 నుండి 8వ తరగతి వరకు లెక్కలు, చదవడం మరియు హోంవర్క్ సహాయం',
      },
      Mehendi: {
        title: 'మెహందీ కళ',
        subtitle: 'పెళ్లి మరియు పండుగ మెహందీ',
        desc: 'పెళ్లిళ్లు, పండుగలకు సహజసిద్ధమైన హెర్బల్ మెహందీ డిజైన్లు',
      },
      Other: {
        title: 'ఇతర నైపుణ్యాలు',
        subtitle: 'చేతిపనులు మరియు కళలు',
        desc: 'ఎంబ్రాయిడరీ, చేతిపనులు మరియు స్థానిక కళాత్మక పనులు',
      },
    },
    sellerListing: {
      backToHome: 'హోమ్‌కు తిరిగి వెళ్లండి',
      createTitle: 'మీ నైపుణ్య లిస్టింగ్‌ను సృష్టించండి',
      createSubtitle:
        'క్రింద వివరాలను పూరించండి. వివరణను మాట్లాడటానికి మైక్ నొక్కి వాయిస్ ద్వారా కూడా నమోదు చేయవచ్చు!',
      editTitle: 'మీ సేవా లిస్టింగ్‌ను సవరించండి',
      editSubtitle: 'మీ సేవా వివరాలు, రుసుము లేదా సమాచారాన్ని క్రింద నవీకరించండి.',
      nameLabel: 'మీ పూర్తి పేరు',
      nameHelper: 'ఉదాహరణకు: సునీతా దేవి',
      namePlaceholder: 'ఉదా: సునీతా దేవి',
      categoryLabel: 'నైపుణ్య వర్గం',
      categoryHelper: 'మీరు ఏ సేవను అందించాలనుకుంటున్నారు?',
      priceLabel: 'ధర / ఫీజు',
      priceHelper: 'ఉదా: ₹200/బ్లౌజ్ లేదా ₹120/భోజనం',
      pricePlaceholder: 'ఉదా: ₹200/బ్లౌజ్',
      locationLabel: 'ప్రాంతం / ఏరియా',
      locationHelper: 'మీ గ్రామం లేదా వీధి పేరు',
      locationPlaceholder: 'ఉదా: రాంపూర్, గుడి దగ్గర',
      descLabel: 'సంక్షిప్త వివరణ',
      descHelper: 'మీ పని మరియు అనుభవాన్ని వివరించండి. మాట్లాడటానికి మైక్ నొక్కండి!',
      descPlaceholder:
        'ఉదా: 8 సంవత్సరాల అనుభవంతో డిజైనర్ బ్లౌజ్ కుట్టడం. ఖచ్చితమైన ఫిట్టింగ్ మరియు వేగవంతమైన సేవ.',
      listeningIndicator: 'వింటున్నాము... మాట్లాడండి...',
      doneStop: 'పూర్తయింది / ఆపండి',
      photoLabel: 'ప్రొఫైల్ / పని ఫోటో',
      photoHelper: 'మీ ఫోటోను అప్‌లోడ్ చేయండి లేదా క్రింద నమూనాను ఎంచుకోండి',
      uploadPhotoBtn: 'ఫోన్ నుండి ఫోటోను అప్‌లోడ్ చేయండి',
      photoSelected: 'ఫోటో ఎంపిక చేయబడింది',
      photoPresetsLabel: 'లేదా రెడీమేడ్ నమూనా ఫోటోను ఎంచుకోండి:',
      selectedPhotoText: 'ఎంపిక చేసిన ప్రొఫైల్ ఫోటో',
      removePhoto: 'తొలగించండి',
      phoneLabel: 'సంప్రదింపు ఫోన్ / వాట్సాప్',
      phoneHelper: 'కొనుగోలుదారులు ఈ నంబర్‌లో మిమ్మల్ని సంప్రదిస్తారు',
      phonePlaceholder: 'ఉదా: +91 98765 43210',
      shgCheckbox: 'నేను స్వయం సహాయక సంఘం (మహిళా బచత్ గట్) సభ్యురాలిని',
      shgHelper: 'విశ్వసనీయత కోసం మీ కార్డుకు గ్రీన్ SHG బ్యాడ్జ్ జోడించబడుతుంది.',
      shgGroupPlaceholder: 'ఉదా: దుర్గా మహిళా బచత్ గట్',
      submitBtn: 'లిస్టింగ్‌ను సమర్పించండి • Submit Listing',
      saveChangesBtn: 'మార్పులను సేవ్ చేయండి • Save Changes',
      submitSubtext: 'వెంటనే బ్రౌజర్‌లో భద్రపరచబడుతుంది. ఎలాంటి ఫీజులు లేవు.',
      successTitle: 'అభినందనలు! మీ సేవ జాబితా చేయబడింది',
      successDesc: (name, category) =>
        `${name}, మీ ${category} సేవ ఇప్పుడు SkillSetu లో కొనుగోలుదారులకు అందుబాటులో ఉంది.`,
      viewOnSearchBtn: 'శోధన పేజీలో చూడండి →',
      addAnotherBtn: 'మరొక సేవను జోడించండి',
      errorName: 'దయచేసి మీ పూర్తి పేరును నమోదు చేయండి.',
      errorCategory: 'దయచేసి నైపుణ్య వర్గాన్ని ఎంచుకోండి.',
      errorPrice: 'దయచేసి ధరను నమోదు చేయండి (ఉదా: ₹200/బ్లౌజ్).',
      errorLocation: 'దయచేసి మీ ప్రాంతాన్ని నమోదు చేయండి.',
      errorDesc: 'దయచేసి సేవా వివరణను నమోదు చేయండి.',
      errorFile: 'దయచేసి 2.5MB లోపు ఉన్న ఫోటోను ఎంచుకోండి.',
    },
    buyerSearch: {
      backToHome: 'హోమ్‌కు తిరిగి వెళ్లండి',
      offerServiceInstead: 'మీ సేవను కూడా జోడించండి',
      searchTitle: 'స్థానిక మహిళా సేవలను కనుగొనండి',
      searchSubtitle:
        'టైలరింగ్, వంట, ట్యూషన్, మెహందీ అందించే మహిళలను బ్రౌజ్ చేసి నేరుగా సంప్రదించండి.',
      filterCategoryLabel: 'నైపుణ్య వర్గం వారీగా ఫిల్టర్ చేయండి',
      allCategories: 'అన్ని వర్గాలు',
      filterLocationLabel: 'ప్రాంతం వారీగా ఫిల్టర్ చేయండి',
      allLocations: 'అన్ని ప్రాంతాలు',
      searchKeywordLabel: 'పేరు లేదా కీవర్డ్ ద్వారా శోధించండి',
      searchPlaceholder: 'ఉదా: బ్లౌజ్, టిఫిన్, గణితం...',
      showing: 'చూపిస్తోంది',
      matchingResults: 'ఫలితాలు',
      resetFilters: 'అన్ని ఫిల్టర్‌లను రీసెట్ చేయండి',
      viewProfileBtn: 'పూర్తి ప్రొఫైల్‌ను వీక్షించి సంప్రదించండి →',
      noResultsTitle: 'ఎలాంటి లిస్టింగ్‌లు కనుగొనబడలేదు',
      noResultsDesc: 'మీ ఫిల్టర్‌లకు సరిపోయే సేవకులు లేరు. దయచేసి ఎంపికను మార్చండి.',
      clearFiltersBtn: 'అన్ని ఫిల్టర్‌లను రీసెట్ చేయండి',
    },
    sellerProfile: {
      backToSearch: 'శోధన ఫలితాలకు తిరిగి వెళ్లండి',
      shareProfile: 'షేర్ చేయండి',
      linkCopied: 'లింక్ కాపీ చేయబడింది!',
      shgVerifiedMember: 'SHG ధృవీకరించబడిన సభ్యురాలు',
      priceRates: 'ధర / రేటు',
      locationLabel: 'ప్రాంతం',
      experienceLabel: 'అనుభవం',
      yearsPracticalSkill: 'సంవత్సరాల అనుభవం',
      experiencedArtisan: 'అనుభవజ్ఞుడైన స్థానిక కళాకారిణి',
      availabilityLabel: 'అందుబాటు సమయం',
      shgBoxTitle: 'స్వయం సహాయక సంఘం (SHG) ధృవీకరించబడిన సభ్యురాలు',
      shgBoxDesc: (groupName) =>
        groupName
          ? `సభ్యురాలు: "${groupName}". ధృవీకరించబడిన గుర్తింపు, న్యాయమైన ధర మరియు విశ్వసనీయత.`
          : 'స్థానిక మహిళా పొదుపు సంఘం ధృవీకరించబడిన సభ్యురాలు.',
      trusted100: '100% విశ్వసనీయమైనది',
      aboutTitle: 'పని మరియు నైపుణ్యం గురించి',
      highlightsTitle: 'ముఖ్య ముఖ్యాంశాలు',
      hlDirectDelivery: 'ప్రత్యక్ష స్థానిక సేవ',
      hlFairPricing: 'న్యాయమైన స్పష్టమైన ధర',
      hlNoCommission: 'సున్నా కమీషన్',
      hlDirectPay: 'నగదు లేదా యుపిఐ ద్వారా చెల్లింపు',
      contactSellerBtn: 'సంప్రదించండి (Contact Seller)',
      contactSubtext: 'నేరుగా ఫోన్ కాల్ లేదా వాట్సాప్ సందేశం',
    },
    contactModal: {
      contactTitle: (name) => `${name} గారిని సంప్రదించండి`,
      directOptionsLabel: 'ప్రత్యక్ష సంప్రదింపు మార్గాలు',
      callPhoneBtn: (phone) => `ఫోన్ కాల్ చేయండి (${phone})`,
      messageWhatsAppBtn: 'వాట్సాప్ సందేశం పంపండి',
      quickQuestionsLabel: 'త్వరిత ప్రశ్నను ఎంచుకోండి:',
      qAvailability: 'మీరు ఈ వారం అందుబాటులో ఉన్నారా?',
      qHomeVisit: 'మీరు ఇంటికి వచ్చి సేవ అందిస్తారా?',
      qPriceDetails: 'దయచేసి ధర వివరాలను తెలుపగలరా?',
      sendNoteLabel: 'సందేశం లేదా అవసరాన్ని రాయండి',
      notePlaceholder: 'మీ అవసరాన్ని ఇక్కడ రాయండి...',
      saveAndWhatsAppBtn: 'సందేశం సిద్ధం చేసి వాట్సాప్‌ను తెరవండి',
      messageNoted: (name) => `సందేశం సిద్ధమైంది! ఇప్పుడు మీరు నేరుగా ${name} గారితో మాట్లాడవచ్చు.`,
      promiseTitle: 'న్యాయమైన సమాజ వాగ్దానం',
      promiseDesc: (name) =>
        `SkillSetu ఎలాంటి కమీషన్ తీసుకోదు. పూర్తి చెల్లింపు నేరుగా ${name} గారికి వెళ్తుంది. మహిళా సేవకులను గౌరవించండి.`,
    },
    footer: {
      mission:
        'నైపుణ్యం కలిగిన మహిళలను మరియు కొనుగోలుదారులను నేరుగా అనుసంధానించే వేదిక. గౌరవం మరియు సున్నా కమీషన్.',
      shgSupport: 'భారతదేశం అంతటా మహిళా స్వయం సహాయక సంఘాలకు మద్దతు',
      exploreTitle: 'పేజీలు',
      homeLink: 'హోమ్',
      buyerSearchLink: 'సేవలను కనుగొనండి',
      sellerListingLink: 'సేవను అందించండి',
      localSkillsTitle: 'స్థానిక నైపుణ్యాలు',
      copyright: 'SkillSetu. స్థానిక మహిళా పారిశ్రామికవేత్తల వేదిక.',
      resetDataBtn: 'నమూనా డేటాను రీసెట్ చేయండి',
    },
  },
};
