export interface Mode {
  id: string;
  name: string;
  arabicName?: string;
  emoji: string;
  band: 'Alpha' | 'Theta' | 'Gamma' | 'Delta' | 'Beta' | 'Schumann';
  beatHz: number;
  carrierHz: number;
  surahNumbers: number[];
  surahDisplay: string;
  surahArabicName?: string;
  revelationType: 'Makki' | 'Madani';
  totalAyahs: number[];
  isFeatured?: boolean;
  mandalaTheme: 'cyan-gold' | 'emerald' | 'amber' | 'purple' | 'cyan';
  // 5-Row details specification:
  forText: string;
  frequencyText: string;
  openingText: string;
  surahText: string;
  whyThisText: string;
}

export const MODES: Mode[] = [
  {
    id: 'crypto-trading',
    name: 'Crypto Trading: Calm & Cool',
    emoji: '📈',
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
    forText: 'Calm and cool under market pressure: no panic sells, no revenge trades, no impulsive entries.',
    frequencyText: '432 Hz carrier · Alpha · 10 Hz beat (headphones)',
    openingText: "A'udhu billah + Bismillah over a golden-ratio 432 Hz tone (432 · 576 · 699 Hz = 1 : 4/3 : φ), before every surah",
    surahText: 'Al-Falaq + An-Nas [Makki] #113 + #114 · fades in · loops · Mishary Rashid Alafasy',
    whyThisText: 'Al-Falaq: refuge from "the darkness when it settles" and "the envier when he envies". An-Nas: refuge from "the whisperer who withdraws", the inner voice that says go all in, chase the pump, win it back. Recited morning and evening, they "suffice you against everything" (Abu Dawud 5082).'
  },
  {
    id: 'mind-reset',
    name: 'Mind Reset',
    emoji: '🧠',
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
    whyThisText: "Its refrain \"Which of your Lord's favours will you deny?\" comes 31 times, resetting overstimulated dopamine pathways and restoring profound gratitude."
  },
  {
    id: 'jealousy-hasad',
    name: 'Jealousy · Hasad',
    arabicName: 'حسد',
    emoji: '💚',
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
    whyThisText: 'Commands explicit refuge from the envier when he envies ("wa min sharri hasidin idha hasad"). Reframes the threat from the envier outside and cools the fire of envy inside.'
  },
  {
    id: 'gheebah-backbiting',
    name: 'Gheebah · Backbiting',
    arabicName: 'غیبت',
    emoji: '🫠',
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
    whyThisText: 'Strikes at the root of social poison by likening backbiting to eating the flesh of one’s dead brother, cultivating empathy and mindful speech.'
  },
  {
    id: 'motivation-energy',
    name: 'Motivation & Energy',
    emoji: '🚀',
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
    whyThisText: '"Your Lord has not forsaken you, nor is He displeased" — breathes hope into barren seasons, renewing biological vigor and spiritual mission.'
  },
  {
    id: 'focus-study',
    name: 'Focus & Study',
    emoji: '🎯',
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
    whyThisText: 'The primordial command: "Iqra! Read in the name of your Lord who created", elevating intellect, learning, and disciplined focus.'
  },
  {
    id: 'anxiety-calm',
    name: 'Anxiety & Calm',
    emoji: '😌',
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
    whyThisText: '"Did We not expand for you your breast?" and "Verily, with hardship comes ease" — activates parasympathetic calm and relieves tightness in the chest.'
  },
  {
    id: 'deep-sleep',
    name: 'Deep Sleep',
    emoji: '😴',
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
    whyThisText: 'The canonical Sunnah protector before sleeping every night, guarding the soul and quietening nighttime restlessness.'
  },
  {
    id: 'dhikr-meditation',
    name: 'Dhikr & Meditation',
    emoji: '📿',
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
    whyThisText: 'Command to stand at night and recite the Quran with measured rhythmic recitation (Tarteel).'
  },
  {
    id: 'love-connection',
    name: 'Love & Connection',
    emoji: '💖',
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
    whyThisText: 'Highlights the divine sign of creating spouses that you may find tranquility, placing affection (Mawaddah) and mercy (Rahmah) between hearts.'
  },
  {
    id: 'healing-shifa',
    name: 'Healing & Shifa',
    emoji: '🌿',
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
    whyThisText: 'Known as "The Cure" (Ash-Shifa) and the greatest Surah in the Quran; recited for spiritual and physical wholeness.'
  }
];
