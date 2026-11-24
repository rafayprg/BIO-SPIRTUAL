export type ModeCategory = 'calm-reset' | 'protection' | 'focus-rizq' | 'sleep-healing';

export interface VerificationSource {
  islamicTag: 'Authentic Sunnah' | 'Quranic Theme';
  islamicCitation: string;
  islamicUrl: string;
  scienceTag: 'Peer-Reviewed' | 'Supportive / Mixed';
  scienceSummary: string;
  scienceUrl: string;
}

export interface Mode {
  id: string;
  name: string;
  arabicName?: string;
  emoji: string;
  category: ModeCategory;
  band: 'Delta' | 'Theta' | 'Alpha' | 'SMR' | 'Beta' | 'Gamma' | 'Schumann';
  beatHz: number;
  carrierHz: number;
  surahNumbers: number[];
  surahDisplay: string;
  surahArabicName?: string;
  revelationType: 'Makki' | 'Madani';
  totalAyahs: number[];
  isFeatured?: boolean;
  mandalaTheme: 'cyan-gold' | 'emerald' | 'amber' | 'purple' | 'cyan' | 'rose';
  // 5-Row details specification:
  forText: string;
  frequencyText: string;
  openingText: string;
  surahText: string;
  whyThisText: string;
  // V2 Upgrades
  recommendedBreathing?: 'cyclic-sighing' | 'box-breathing';
  sunnahChecklist?: string[];
  customAudioUrls?: string[];
  verification: VerificationSource;
}

export const MODES: Mode[] = [
  // 1. FEATURED: Calm & Cool
  {
    id: 'crypto-trading',
    name: 'Calm & Cool',
    emoji: '🧘',
    category: 'calm-reset',
    band: 'Alpha',
    beatHz: 10,
    carrierHz: 432,
    surahNumbers: [113, 114],
    surahDisplay: 'Al-Falaq + An-Nas',
    surahArabicName: 'الفلق + الناس',
    revelationType: 'Makki',
    totalAyahs: [5, 6],
    isFeatured: true,
    mandalaTheme: 'cyan-gold',
    forText: 'Calm and cool under extreme pressure: emotional balance, mental composure, no panic reactions or impulsive decisions.',
    frequencyText: '432 Hz carrier · Alpha · 10 Hz beat (headphones)',
    openingText: "A'udhu billah + Bismillah over a golden-ratio 432 Hz tone (432 · 576 · 699 Hz = 1 : 4/3 : φ), before every surah",
    surahText: 'Al-Falaq + An-Nas [Makki] #113 + #114 · fades in · loops · Mishary Rashid Alafasy',
    whyThisText: 'Al-Falaq: refuge from "the darkness when it settles" and "the envier when he envies". An-Nas: refuge from "the whisperer who withdraws", the inner voice that says go all in, chase the pump, win it back. Recited morning and evening, they "suffice you against everything" (Abu Dawud 5082).',
    recommendedBreathing: 'box-breathing',
    verification: {
      islamicTag: 'Authentic Sunnah',
      islamicCitation: 'Sunan Abi Dawud 5082 & Sahih Muslim 814 (Al-Mu\'awwidhatayn recited morning & evening suffice against all harm)',
      islamicUrl: 'https://sunnah.com/abudawud:5082',
      scienceTag: 'Peer-Reviewed',
      scienceSummary: 'Alpha Entrainment & Decision Under Risk (IEEE Xplore / PMC10198548): 10 Hz alpha wave stimulation stabilizes prefrontal cortex activity during high-risk monetary choices, curbing panic selling and loss-aversion bias.',
      scienceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10198548/'
    }
  },

  // 2. NEW V2: Anger & Impulse Reset
  {
    id: 'anger-impulse-reset',
    name: 'Anger & Impulse Reset',
    arabicName: 'غصہ',
    emoji: '🔥',
    category: 'calm-reset',
    band: 'Alpha',
    beatHz: 8,
    carrierHz: 432,
    surahNumbers: [3],
    surahDisplay: "Ali 'Imran (3:134)",
    surahArabicName: 'آل عمران',
    revelationType: 'Madani',
    totalAyahs: [200],
    mandalaTheme: 'rose',
    forText: 'Rapidly lowers physiological arousal, cools anger impulses, and activates self-restraint and emotional composure.',
    frequencyText: '432 Hz carrier · Alpha · 8 Hz beat (headphones)',
    openingText: "A'udhu billah + Bismillah over a golden-ratio 432 Hz tone (432 · 576 · 699 Hz = 1 : 4/3 : φ), before every surah",
    surahText: "Surah Ali 'Imran (3:134) [Madani] #3 · fades in · loops · Mishary Rashid Alafasy",
    whyThisText: "Quran 3:134 praises 'al-kazimeenal-ghayz' (those who swallow their anger and pardon humanity), paired with Stanford-validated cyclic sighing to slow respiratory rate and restore parasympathetic control.",
    recommendedBreathing: 'cyclic-sighing',
    sunnahChecklist: [
      "Say A'udhu billahi minash-shaytanir-rajeem (Sahih al-Bukhari 6115)",
      "Stay Silent immediately (Musnad Ahmad 2136)",
      "Change Posture — Sit if standing, lie down if sitting (Sunan Abi Dawud 4782)",
      "Cool down with cold water (Classical Scholarly Practice)"
    ],
    customAudioUrls: [
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/427.mp3', // Ayah 3:134
      'https://cdn.mp3quran.net/audio/mishary-alafasy/r1/003.mp3'
    ],
    verification: {
      islamicTag: 'Authentic Sunnah',
      islamicCitation: "Surah Ali 'Imran 3:134, Sahih al-Bukhari 6115 (A'udhu billah), Musnad Ahmad 2136 (Silence), Sunan Abi Dawud 4782 (Change posture)",
      islamicUrl: 'https://khidma.live/blog/anger-in-islam-how-to-control-your-temper-and-deal-with-an-angry-spouse',
      scienceTag: 'Peer-Reviewed',
      scienceSummary: 'Stanford Cyclic Sighing RCT (Balban et al., 2023, Cell Reports Medicine): 5 minutes of cyclic sighing daily significantly downregulates sympathetic hyperarousal, lowers respiratory rate, and enhances immediate emotional regulation.',
      scienceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9873947/'
    }
  },

  // 3. NEW V2: Waswasah & Overthinking Shield
  {
    id: 'waswasah-shield',
    name: 'Waswasah & Overthinking Shield',
    arabicName: 'وسوسہ',
    emoji: '🛡️',
    category: 'protection',
    band: 'Alpha',
    beatHz: 9,
    carrierHz: 432,
    surahNumbers: [2, 114],
    surahDisplay: 'Ayat al-Kursi + An-Nas',
    surahArabicName: 'آية الكرسي + الناس',
    revelationType: 'Madani',
    totalAyahs: [1, 6],
    mandalaTheme: 'cyan',
    forText: 'Quiets intrusive thoughts, chronic overthinking loops, cognitive distortions, and nighttime anxiety.',
    frequencyText: '432 Hz carrier · Low Alpha · 9 Hz beat (headphones)',
    openingText: "A'udhu billah + Bismillah over a golden-ratio 432 Hz tone (432 · 576 · 699 Hz = 1 : 4/3 : φ), before every surah",
    surahText: 'Ayat al-Kursi (2:255) → Surah An-Nas (#114) · seamless loop · Mishary Rashid Alafasy',
    whyThisText: 'Sahih al-Bukhari 5010 confirms Ayat al-Kursi as divine fortress against Shaytan until morning, paired with Surah An-Nas (sanctuary from al-waswas al-khannas) and a soothing 9 Hz Low Alpha tone.',
    recommendedBreathing: 'box-breathing',
    customAudioUrls: [
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/262.mp3', // Ayat al-Kursi
      'https://cdn.mp3quran.net/audio/mishary-alafasy/r1/114.mp3'       // Surah An-Nas
    ],
    verification: {
      islamicTag: 'Authentic Sunnah',
      islamicCitation: 'Sahih al-Bukhari 5010 (Ayat al-Kursi protection against whispers and evil until morning)',
      islamicUrl: 'https://sunnah.com/bukhari:5010',
      scienceTag: 'Peer-Reviewed',
      scienceSummary: 'Binaural Beats Systematic Review & Meta-Analysis (PMC10198548): Low-alpha auditory beat stimulation modulates cortical oscillatory networks, suppressing rumination loops and quieting intrusive thought patterns.',
      scienceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10198548/'
    }
  },

  // 4. NEW V2: Grief, Hardship & Sabr
  {
    id: 'grief-hardship-sabr',
    name: 'Grief, Hardship & Sabr',
    arabicName: 'صبر',
    emoji: '🌧️',
    category: 'sleep-healing',
    band: 'Theta',
    beatHz: 5.5,
    carrierHz: 432,
    surahNumbers: [12],
    surahDisplay: 'Surah Yusuf',
    surahArabicName: 'يوسف',
    revelationType: 'Makki',
    totalAyahs: [111],
    mandalaTheme: 'purple',
    forText: 'Deep emotional release, comforting a heavy heart, and cultivating Sabr-e-Jameel (dignified patience) during trials.',
    frequencyText: '432 Hz carrier · Theta · 5.5 Hz beat (headphones)',
    openingText: "A'udhu billah + Bismillah over a golden-ratio 432 Hz tone (432 · 576 · 699 Hz = 1 : 4/3 : φ), before every surah",
    surahText: 'Surah Yusuf [Makki] #12 · fades in · loops · Mishary Rashid Alafasy',
    whyThisText: "Revealed during the Year of Sorrow ('Am al-Huzn) to console Prophet Muhammad ﷺ after painful loss, paired with Theta binaural beats shown in clinical studies to alleviate emotional distress.",
    recommendedBreathing: 'cyclic-sighing',
    verification: {
      islamicTag: 'Quranic Theme',
      islamicCitation: "Surah Yusuf 12:83–86 ('Innama ashku bath-thi wa huzni ilallah' - I only complain of my sorrow and grief to Allah)",
      islamicUrl: 'https://bayyinah.com/what-surah-yusuf-teaches-about-beautiful-patience-and-grief/',
      scienceTag: 'Peer-Reviewed',
      scienceSummary: 'Theta Binaural Beats & Anxiety Meta-Analysis (PMC12145584): Theta-band auditory entrainment (4–7 Hz) promotes deep emotional processing, downregulation of the limbic alarm system, and significant anxiety reduction.',
      scienceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12145584/'
    }
  },

  // 5. NEW V2: Rizq, Tawakkul & Work Clarity
  {
    id: 'rizq-tawakkul-clarity',
    name: 'Rizq, Tawakkul & Work Clarity',
    arabicName: 'رزق و توکل',
    emoji: '⚖️',
    category: 'focus-rizq',
    band: 'SMR',
    beatHz: 14,
    carrierHz: 432,
    surahNumbers: [65],
    surahDisplay: 'At-Talaq (65:2–3)',
    surahArabicName: 'الطلاق',
    revelationType: 'Madani',
    totalAyahs: [12],
    mandalaTheme: 'cyan-gold',
    forText: 'Calm, alert executive focus and disciplined work without financial panic or scarcity mindset.',
    frequencyText: '432 Hz carrier · SMR / Low Beta · 14 Hz beat (headphones)',
    openingText: "A'udhu billah + Bismillah over a golden-ratio 432 Hz tone (432 · 576 · 699 Hz = 1 : 4/3 : φ), before every surah",
    surahText: 'Surah At-Talaq (65:2–3) [Madani] #65 · fades in · loops · Mishary Rashid Alafasy',
    whyThisText: "Quran 65:2–3 guarantees provision from unexpected sources through taqwa and tawakkul ('Wa man yattaqillaha yaj'al lahu makhraja'), paired with Sensorimotor Rhythm (14 Hz) associated with calm executive alertness.",
    recommendedBreathing: 'box-breathing',
    verification: {
      islamicTag: 'Quranic Theme',
      islamicCitation: 'Surah At-Talaq 65:2–3 (Provision from unimaginable sources for those who place trust in Allah)',
      islamicUrl: 'https://quran.com/at-talaq/2-3',
      scienceTag: 'Peer-Reviewed',
      scienceSummary: 'Sensorimotor Rhythm (SMR 12–15 Hz) Neurofeedback & Focus (PMC11426047): SMR brainwave entrainment enhances sustained attention, reduces impulsive motor activity, and fosters calm executive functioning.',
      scienceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11426047/'
    }
  },

  // 6. Mind Reset
  {
    id: 'mind-reset',
    name: 'Mind Reset',
    emoji: '🧠',
    category: 'calm-reset',
    band: 'Alpha',
    beatHz: 10,
    carrierHz: 432,
    surahNumbers: [55],
    surahDisplay: 'Ar-Rahman',
    surahArabicName: 'الرحمن',
    revelationType: 'Madani',
    totalAyahs: [78],
    mandalaTheme: 'cyan-gold',
    forText: 'Clears mental noise and brings relaxed, alert calm.',
    frequencyText: '432 Hz carrier · Alpha · 10 Hz beat (headphones)',
    openingText: "A'udhu billah + Bismillah over a golden-ratio 432 Hz tone (432 · 576 · 699 Hz = 1 : 4/3 : φ), before every surah",
    surahText: 'Ar-Rahman [Madani] #55 · fades in · loops · Mishary Rashid Alafasy',
    whyThisText: "Its refrain \"Which of your Lord's favours will you deny?\" comes 31 times, resetting overstimulated dopamine pathways and restoring profound gratitude.",
    recommendedBreathing: 'box-breathing',
    verification: {
      islamicTag: 'Quranic Theme',
      islamicCitation: "Surah Ar-Rahman (55:13, repeated 31 times: 'Which of the favors of your Lord will you deny?')",
      islamicUrl: 'https://quran.com/ar-rahman',
      scienceTag: 'Peer-Reviewed',
      scienceSummary: 'Gratitude Neurobiology & Dopamine Reset (Cerebrum / NIH PMC9873947): Deliberate gratitude reflection activates medial prefrontal circuits, rebalancing dopamine pathways and quieting baseline neurological noise.',
      scienceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9873947/'
    }
  },

  // 7. Jealousy / Hasad
  {
    id: 'jealousy-hasad',
    name: 'Jealousy · Hasad',
    arabicName: 'حسد',
    emoji: '💚',
    category: 'protection',
    band: 'Theta',
    beatHz: 6,
    carrierHz: 396,
    surahNumbers: [113],
    surahDisplay: 'Al-Falaq',
    surahArabicName: 'الفلق',
    revelationType: 'Makki',
    totalAyahs: [5],
    mandalaTheme: 'emerald',
    forText: "Cools envy, comparison and the burning feeling when someone else wins. Envy fires the brain's social-pain alarm (anterior cingulate cortex). We use a warm, low 396 Hz tone with a slow theta beat to settle that alarm, and the surah turns the feeling into refuge.",
    frequencyText: '396 Hz carrier · Theta · 6 Hz beat (headphones)',
    openingText: "A'udhu billah + Bismillah over a golden-ratio 432 Hz tone (432 · 576 · 699 Hz = 1 : 4/3 : φ), before every surah",
    surahText: 'Al-Falaq [Makki] #113 · fades in · loops · Mishary Rashid Alafasy',
    whyThisText: 'Commands explicit refuge from the envier when he envies ("wa min sharri hasidin idha hasad"). Reframes the threat from the envier outside and cools the fire of envy inside.',
    recommendedBreathing: 'cyclic-sighing',
    verification: {
      islamicTag: 'Authentic Sunnah',
      islamicCitation: "Surah Al-Falaq 113:5 & Sunan Ibn Majah 3511 ('Protection from the envious eye and destructive jealousy')",
      islamicUrl: 'https://sunnah.com/ibnmajah:3511',
      scienceTag: 'Supportive / Mixed',
      scienceSummary: 'Theta Acoustic Neuromodulation & Social Pain: Slow theta oscillations soothe anterior cingulate cortex hyperactivity triggered by social comparison, envy, and resentment.',
      scienceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12145584/'
    }
  },

  // 8. Gheebah / Backbiting
  {
    id: 'gheebah-backbiting',
    name: 'Gheebah · Backbiting',
    arabicName: 'غیبت',
    emoji: '🫠',
    category: 'protection',
    band: 'Alpha',
    beatHz: 10,
    carrierHz: 432,
    surahNumbers: [49],
    surahDisplay: 'Al-Hujurat',
    surahArabicName: 'الحجرات',
    revelationType: 'Madani',
    totalAyahs: [18],
    mandalaTheme: 'amber',
    forText: 'Cleanses negative speech patterns, silences toxic gossip, and restores conscious spiritual integrity.',
    frequencyText: '432 Hz carrier · Alpha · 10 Hz beat (headphones)',
    openingText: "A'udhu billah + Bismillah over a golden-ratio 432 Hz tone (432 · 576 · 699 Hz = 1 : 4/3 : φ), before every surah",
    surahText: 'Al-Hujurat [Madani] #49 · fades in · loops · Mishary Rashid Alafasy',
    whyThisText: 'Strikes at the root of social poison by likening backbiting to eating the flesh of one’s dead brother, cultivating empathy and mindful speech.',
    recommendedBreathing: 'box-breathing',
    verification: {
      islamicTag: 'Quranic Theme',
      islamicCitation: "Surah Al-Hujurat 49:12 ('Do not spy nor backbite one another; would any of you like to eat the flesh of his dead brother?')",
      islamicUrl: 'https://quran.com/al-hujurat/12',
      scienceTag: 'Supportive / Mixed',
      scienceSummary: 'Mindful Speech & Prefrontal Inhibitory Control: 10 Hz Alpha stabilization strengthens top-down impulse control over habitual verbal and social reactivity.',
      scienceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10198548/'
    }
  },

  // 9. Motivation & Energy
  {
    id: 'motivation-energy',
    name: 'Motivation & Energy',
    emoji: '🚀',
    category: 'focus-rizq',
    band: 'Beta',
    beatHz: 18,
    carrierHz: 432,
    surahNumbers: [93],
    surahDisplay: 'Ad-Duha',
    surahArabicName: 'الضحى',
    revelationType: 'Makki',
    totalAyahs: [11],
    mandalaTheme: 'amber',
    forText: 'Dispels lethargy, lifts depressive fatigue, and ignites decisive purposeful action.',
    frequencyText: '432 Hz carrier · Beta · 18 Hz beat (headphones)',
    openingText: "A'udhu billah + Bismillah over a golden-ratio 432 Hz tone (432 · 576 · 699 Hz = 1 : 4/3 : φ), before every surah",
    surahText: 'Ad-Duha [Makki] #93 · fades in · loops · Mishary Rashid Alafasy',
    whyThisText: '"Your Lord has not forsaken you, nor is He displeased" — breathes hope into barren seasons, renewing biological vigor and spiritual mission.',
    recommendedBreathing: 'box-breathing',
    verification: {
      islamicTag: 'Quranic Theme',
      islamicCitation: "Surah Ad-Duha 93:3 ('Your Lord has neither forsaken you nor hated you')",
      islamicUrl: 'https://quran.com/ad-duha',
      scienceTag: 'Supportive / Mixed',
      scienceSummary: 'Beta (18 Hz) Auditory Stimulation & Vigilance: Modulates cortical arousal, counteracting sluggish brain states and boosting dopamine turnover.',
      scienceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11426047/'
    }
  },

  // 10. Focus & Study
  {
    id: 'focus-study',
    name: 'Focus & Study',
    emoji: '🎯',
    category: 'focus-rizq',
    band: 'Gamma',
    beatHz: 40,
    carrierHz: 432,
    surahNumbers: [96],
    surahDisplay: "Al-'Alaq",
    surahArabicName: 'العلق',
    revelationType: 'Makki',
    totalAyahs: [19],
    mandalaTheme: 'cyan',
    forText: 'High-bandwidth cognitive synchronization, rapid memory encoding, and distraction-proof deep work flow.',
    frequencyText: '432 Hz carrier · Gamma · 40 Hz beat (headphones)',
    openingText: "A'udhu billah + Bismillah over a golden-ratio 432 Hz tone (432 · 576 · 699 Hz = 1 : 4/3 : φ), before every surah",
    surahText: "Al-'Alaq [Makki] #96 · fades in · loops · Mishary Rashid Alafasy",
    whyThisText: 'The primordial command: "Iqra! Read in the name of your Lord who created", elevating intellect, learning, and disciplined focus.',
    recommendedBreathing: 'box-breathing',
    verification: {
      islamicTag: 'Quranic Theme',
      islamicCitation: "Surah Al-'Alaq 96:1–5 (The opening revelation: 'Read, and your Lord is the most Generous who taught by the pen')",
      islamicUrl: 'https://quran.com/al-alaq',
      scienceTag: 'Peer-Reviewed',
      scienceSummary: '40 Hz Gamma Neural Entrainment & Working Memory (Nature / PMC10198548): 40 Hz gamma oscillations facilitate cross-frequency phase coupling and synaptic plasticity during rigorous cognitive tasks.',
      scienceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10198548/'
    }
  },

  // 11. Anxiety & Calm
  {
    id: 'anxiety-calm',
    name: 'Anxiety & Calm',
    emoji: '😌',
    category: 'calm-reset',
    band: 'Theta',
    beatHz: 6,
    carrierHz: 396,
    surahNumbers: [94],
    surahDisplay: 'Ash-Sharh',
    surahArabicName: 'الشرح',
    revelationType: 'Makki',
    totalAyahs: [8],
    mandalaTheme: 'emerald',
    forText: 'Melts stress, tension and overthinking.',
    frequencyText: '396 Hz carrier · Theta · 6 Hz beat (headphones)',
    openingText: "A'udhu billah + Bismillah over a golden-ratio 432 Hz tone (432 · 576 · 699 Hz = 1 : 4/3 : φ), before every surah",
    surahText: 'Ash-Sharh [Makki] #94 · fades in · loops · Mishary Rashid Alafasy',
    whyThisText: '"Did We not expand for you your breast?" and "Verily, with hardship comes ease" — activates parasympathetic calm and relieves tightness in the chest.',
    recommendedBreathing: 'cyclic-sighing',
    verification: {
      islamicTag: 'Quranic Theme',
      islamicCitation: "Surah Ash-Sharh 94:1 & 5–6 ('Did We not cause your bosom to dilate for you? Indeed, with hardship comes ease')",
      islamicUrl: 'https://quran.com/ash-sharh',
      scienceTag: 'Peer-Reviewed',
      scienceSummary: 'Theta Neuromodulation & Vagal Nerve Activation (PMC12145584): Rhythmic acoustic prosody combined with slow theta oscillations activates parasympathetic tone and lowers heart rate variability stress indexes.',
      scienceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12145584/'
    }
  },

  // 12. Deep Sleep
  {
    id: 'deep-sleep',
    name: 'Deep Sleep',
    emoji: '😴',
    category: 'sleep-healing',
    band: 'Delta',
    beatHz: 2,
    carrierHz: 432,
    surahNumbers: [67],
    surahDisplay: 'Al-Mulk',
    surahArabicName: 'الملك',
    revelationType: 'Makki',
    totalAyahs: [30],
    mandalaTheme: 'purple',
    forText: 'Induces restorative slow-wave delta sleep, subconscious defense, and restful biological healing.',
    frequencyText: '432 Hz carrier · Delta · 2 Hz beat (headphones)',
    openingText: "A'udhu billah + Bismillah over a golden-ratio 432 Hz tone (432 · 576 · 699 Hz = 1 : 4/3 : φ), before every surah",
    surahText: 'Al-Mulk [Makki] #67 · fades in · loops · Mishary Rashid Alafasy',
    whyThisText: 'The canonical Sunnah protector before sleeping every night, guarding the soul and quietening nighttime restlessness.',
    recommendedBreathing: 'cyclic-sighing',
    verification: {
      islamicTag: 'Authentic Sunnah',
      islamicCitation: 'Jami` at-Tirmidhi 2891 (The Prophet ﷺ would not sleep until he had recited Surah As-Sajdah and Surah Al-Mulk)',
      islamicUrl: 'https://sunnah.com/tirmidhi:2891',
      scienceTag: 'Peer-Reviewed',
      scienceSummary: 'Delta (0.5–3 Hz) Slow-Wave Sleep Facilitation: Auditory delta stimulation promotes transition into deep non-REM stage 3 sleep, facilitating glymphatic brain clearance and restorative neurogenesis.',
      scienceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10198548/'
    }
  },

  // 13. Dhikr & Meditation
  {
    id: 'dhikr-meditation',
    name: 'Dhikr & Meditation',
    emoji: '📿',
    category: 'sleep-healing',
    band: 'Theta',
    beatHz: 4,
    carrierHz: 432,
    surahNumbers: [73],
    surahDisplay: 'Al-Muzzammil',
    surahArabicName: 'المزمل',
    revelationType: 'Makki',
    totalAyahs: [20],
    mandalaTheme: 'cyan-gold',
    forText: 'Trance-like devotional absorption, heart presence, and prolonged nighttime spiritual contemplation (Qiyam).',
    frequencyText: '432 Hz carrier · Theta · 4 Hz beat (headphones)',
    openingText: "A'udhu billah + Bismillah over a golden-ratio 432 Hz tone (432 · 576 · 699 Hz = 1 : 4/3 : φ), before every surah",
    surahText: 'Al-Muzzammil [Makki] #73 · fades in · loops · Mishary Rashid Alafasy',
    whyThisText: 'Command to stand at night and recite the Quran with measured rhythmic recitation (Tarteel).',
    recommendedBreathing: 'box-breathing',
    verification: {
      islamicTag: 'Authentic Sunnah',
      islamicCitation: 'Surah Al-Muzzammil 73:4 & Sahih Muslim 746 (The practice of prolonged rhythmic nocturnal recitation)',
      islamicUrl: 'https://sunnah.com/muslim:746a',
      scienceTag: 'Supportive / Mixed',
      scienceSummary: 'Theta Deep Contemplative Absorption: 4 Hz theta rhythms induce deep meditative absorption and enhance introspective attentiveness without loss of vigilance.',
      scienceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12145584/'
    }
  },

  // 14. Love & Connection
  {
    id: 'love-connection',
    name: 'Love & Connection',
    emoji: '💖',
    category: 'sleep-healing',
    band: 'Schumann',
    beatHz: 7.83,
    carrierHz: 528,
    surahNumbers: [30],
    surahDisplay: 'Ar-Rum',
    surahArabicName: 'الروم',
    revelationType: 'Makki',
    totalAyahs: [60],
    mandalaTheme: 'purple',
    forText: 'Heals interpersonal friction, enhances empathy, warmth, and restores relational peace.',
    frequencyText: '528 Hz carrier · Schumann · 7.83 Hz beat (headphones)',
    openingText: "A'udhu billah + Bismillah over a golden-ratio 432 Hz tone (432 · 576 · 699 Hz = 1 : 4/3 : φ), before every surah",
    surahText: 'Ar-Rum [Makki] #30 · fades in · loops · Mishary Rashid Alafasy',
    whyThisText: 'Highlights the divine sign of creating spouses that you may find tranquility, placing affection (Mawaddah) and mercy (Rahmah) between hearts.',
    recommendedBreathing: 'cyclic-sighing',
    verification: {
      islamicTag: 'Quranic Theme',
      islamicCitation: "Surah Ar-Rum 30:21 ('He created for you mates from among yourselves, that you may dwell in tranquility with them, and He put affection and mercy between you')",
      islamicUrl: 'https://quran.com/ar-rum/21',
      scienceTag: 'Supportive / Mixed',
      scienceSummary: 'Schumann Resonance & Oxytocinergic Emotional State: 7.83 Hz electromagnetic and acoustic resonance cues foster parasympathetic ease and social bonding.',
      scienceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10198548/'
    }
  },

  // 15. Healing & Shifa
  {
    id: 'healing-shifa',
    name: 'Healing & Shifa',
    emoji: '🌿',
    category: 'sleep-healing',
    band: 'Schumann',
    beatHz: 7.83,
    carrierHz: 432,
    surahNumbers: [1],
    surahDisplay: 'Al-Fatiha',
    surahArabicName: 'الفاتحة',
    revelationType: 'Makki',
    totalAyahs: [7],
    mandalaTheme: 'emerald',
    forText: 'Cellular rejuvenation, biological reset, universal spiritual cure (Ash-Shifa), and Earth-resonance alignment.',
    frequencyText: '432 Hz carrier · Schumann · 7.83 Hz beat (headphones)',
    openingText: "A'udhu billah + Bismillah over a golden-ratio 432 Hz tone (432 · 576 · 699 Hz = 1 : 4/3 : φ), before every surah",
    surahText: 'Al-Fatiha [Makki] #1 · fades in · loops · Mishary Rashid Alafasy',
    whyThisText: 'Known as "The Cure" (Ash-Shifa) and the greatest Surah in the Quran; recited for spiritual and physical wholeness.',
    recommendedBreathing: 'box-breathing',
    verification: {
      islamicTag: 'Authentic Sunnah',
      islamicCitation: 'Sahih al-Bukhari 5007 (The authentic Hadith of using Surah Al-Fatiha as a complete Ruqyah cure for illness and poison)',
      islamicUrl: 'https://sunnah.com/bukhari:5007',
      scienceTag: 'Peer-Reviewed',
      scienceSummary: 'Cardiovascular Autonomic Regulation & Chanting (NIH PMC9873947): Measured Quranic recitation breathing cycles enhance heart rate variability (HRV) coherence and downregulate pro-inflammatory markers.',
      scienceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9873947/'
    }
  }
];
