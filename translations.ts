export type TranslationKeys = {
  // Landing
  title: string;
  subtitle: string;
  start: string;
  loading: string;
  signup: string;

  // Auth
  welcomeBack: string;
  email: string;
  password: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
  loginButton: string;
  or: string;
  continueGoogle: string;
  noAccount: string;
  haveAccount: string;   // ✅ added
  signin: string;        // ✅ added

  // Dashboard
  home: string;
  arcade: string;
  document: string;
  podcast: string;
  flashcards: string;
  account: string;

  dashboardTitle: string;
  dashboardSubtitle: string;

  summarize: string;
  uploadSmart: string;

  generateFlashcards: string;
  revisionCards: string;

  aiPodcast: string;
  turnNotes: string;

  playGames: string;

  uploadInstruction: string;
  dropYourPDFFHere: string;
  myFiles: string;
};

export const translations: Record<"en" | "hi", TranslationKeys> = {
  en: {
    // Landing
    title: "Your Personalized Learning Island",
    subtitle:
      "Discover AI-powered notes, flashcards, quizzes, and fun interactive learning tools designed just for you.",
    start: "Start Your Journey →",
    loading: "Loading your island...",
    signup: "Sign Up",

    // Auth
    welcomeBack: "Welcome Back",
    email: "Email",
    password: "Password",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "••••••••",
    loginButton: "Login",
    or: "— OR —",
    continueGoogle: "Continue with Google",
    noAccount: "Don’t have an account?",
    haveAccount: "Already have an account?",   // ✅ added
    signin: "Sign In",                         // ✅ added

    // Dashboard
    home: "Home",
    arcade: "Arcade",
    document: "Document",
    podcast: "Podcast",
    flashcards: "Flashcards",
    account: "Account",

    dashboardTitle: "Dashboard",
    dashboardSubtitle: "Create and manage your AI study tools",

    summarize: "Summarize Document",
    uploadSmart: "Upload PDF & get smart notes",

    generateFlashcards: "Generate Flashcards",
    revisionCards: "Auto-create exam revision cards",

    aiPodcast: "AI Podcast",
    turnNotes: "Turn notes into audio",

    playGames: "Play fun mini-games",

    uploadInstruction: "Drop your PDF here or click to upload",
    dropYourPDFFHere: "Drop your PDF here or click to upload",
    myFiles: "My Files",
  },

  hi: {
    // Landing
    title: "आपका व्यक्तिगत लर्निंग आइलैंड",
    subtitle:
      "AI-आधारित नोट्स, फ्लैशकार्ड, क्विज़ और मज़ेदार इंटरैक्टिव लर्निंग टूल्स खोजें जो सिर्फ आपके लिए डिज़ाइन किए गए हैं।",
    start: "अपनी यात्रा शुरू करें →",
    loading: "आपका आइलैंड लोड हो रहा है...",
    signup: "साइन अप",

    // Auth
    welcomeBack: "वापसी पर स्वागत है",
    email: "ईमेल",
    password: "पासवर्ड",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "••••••••",
    loginButton: "लॉगिन",
    or: "— या —",
    continueGoogle: "Google से जारी रखें",
    noAccount: "क्या आपका अकाउंट नहीं है?",
    haveAccount: "क्या आपके पास पहले से अकाउंट है?",   // ✅ added
    signin: "साइन इन",                                  // ✅ added

    // Dashboard
    home: "होम",
    arcade: "आर्केड",
    document: "डॉक्यूमेंट",
    podcast: "पॉडकास्ट",
    flashcards: "फ्लैशकार्ड",
    account: "अकाउंट",

    dashboardTitle: "डैशबोर्ड",
    dashboardSubtitle: "अपने AI स्टडी टूल्स बनाएं और मैनेज करें",

    summarize: "डॉक्यूमेंट सारांश",
    uploadSmart: "PDF अपलोड करें और स्मार्ट नोट्स पाएं",

    generateFlashcards: "फ्लैशकार्ड बनाएं",
    revisionCards: "ऑटो एग्जाम रिवीजन कार्ड्स बनाएं",

    aiPodcast: "AI पॉडकास्ट",
    turnNotes: "नोट्स को ऑडियो में बदलें",

    playGames: "मज़ेदार मिनी गेम्स खेलें",

    uploadInstruction: "अपनी PDF यहाँ ड्रॉप करें या अपलोड करने के लिए क्लिक करें",
    dropYourPDFFHere: "अपनी PDF यहाँ ड्रॉप करें या अपलोड करने के लिए क्लिक करें",
    myFiles: "मेरी फाइलें",
  },
};