import React, { useState, useEffect } from 'react';
import { X, Search, BookOpen, Loader2, Copy, Check, ExternalLink } from 'lucide-react';
import type { Mode } from '../data/modes';

interface QuranReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: Mode;
}

interface AyahData {
  number: number;
  numberInSurah: number;
  arabicText: string;
  englishText: string;
}

interface SurahResponse {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: AyahData[];
}

// In-memory cache to avoid redundant network calls
const surahCache: Record<number, SurahResponse> = {};

const SURAH_NAMES: Record<number, string> = {
  1: 'Al-Fatiha',
  2: 'Al-Baqarah',
  3: "Ali 'Imran",
  12: 'Yusuf',
  30: 'Ar-Rum',
  49: 'Al-Hujurat',
  55: 'Ar-Rahman',
  65: 'At-Talaq',
  67: 'Al-Mulk',
  73: 'Al-Muzzammil',
  93: 'Ad-Duha',
  94: 'Ash-Sharh',
  96: "Al-'Alaq",
  113: 'Al-Falaq',
  114: 'An-Nas',
};

const TARGET_AYAHS_BY_MODE: Record<string, Record<number, number[]>> = {
  'waswasah-shield': { 2: [255] },
  'anger-impulse-reset': { 3: [134] },
  'rizq-tawakkul-clarity': { 65: [2, 3] },
};

export const QuranReaderModal: React.FC<QuranReaderModalProps> = ({
  isOpen,
  onClose,
  mode,
}) => {
  const [activeSurahNumber, setActiveSurahNumber] = useState<number>(mode.surahNumbers[0]);
  const [surahData, setSurahData] = useState<SurahResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedAyahNumber, setCopiedAyahNumber] = useState<number | null>(null);

  const targetAyahs = TARGET_AYAHS_BY_MODE[mode.id]?.[activeSurahNumber];

  // Synchronize active surah when mode changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveSurahNumber(mode.surahNumbers[0]);
    }
  }, [isOpen, mode]);

  // Fetch Surah data
  useEffect(() => {
    if (!isOpen) return;

    const fetchSurah = async () => {
      if (surahCache[activeSurahNumber]) {
        setSurahData(surahCache[activeSurahNumber]);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `https://api.alquran.cloud/v1/surah/${activeSurahNumber}/editions/quran-uthmani,en.asad`
        );
        if (!res.ok) {
          throw new Error(`Failed to load Surah (HTTP ${res.status})`);
        }
        const json = await res.json();
        if (json.code !== 200 || !json.data || json.data.length < 2) {
          throw new Error('Invalid response structure from Quran API');
        }

        const arabicEdition = json.data[0];
        const englishEdition = json.data[1];

        const ayahs: AyahData[] = arabicEdition.ayahs.map(
          (item: { number: number; numberInSurah: number; text: string }, index: number) => ({
            number: item.number,
            numberInSurah: item.numberInSurah,
            arabicText: item.text,
            englishText: englishEdition.ayahs[index]?.text || '',
          })
        );

        const data: SurahResponse = {
          number: arabicEdition.number,
          name: arabicEdition.name,
          englishName: arabicEdition.englishName,
          englishNameTranslation: arabicEdition.englishNameTranslation,
          revelationType: arabicEdition.revelationType,
          numberOfAyahs: arabicEdition.numberOfAyahs,
          ayahs,
        };

        surahCache[activeSurahNumber] = data;
        setSurahData(data);
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Network error loading Quran verses';
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchSurah();
  }, [isOpen, activeSurahNumber]);

  if (!isOpen) return null;

  const handleCopyAyah = (ayah: AyahData) => {
    const textToCopy = `${ayah.arabicText}\n\n"${ayah.englishText}"\n— [Surah ${surahData?.englishName} ${surahData?.number}:${ayah.numberInSurah}]`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedAyahNumber(ayah.numberInSurah);
    setTimeout(() => {
      setCopiedAyahNumber(null);
    }, 2000);
  };

  const filteredAyahs = surahData?.ayahs.filter((ayah) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      ayah.englishText.toLowerCase().includes(q) ||
      ayah.arabicText.includes(searchQuery) ||
      ayah.numberInSurah.toString() === searchQuery.trim()
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[88vh] sm:max-h-[90vh] bg-[#0c1827] border-t sm:border border-cyan-500/30 rounded-t-3xl sm:rounded-2xl shadow-cyan-glow-lg flex flex-col overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator Handle */}
        <div className="sm:hidden w-10 h-1 bg-white/20 rounded-full mx-auto mt-2.5 mb-1 shrink-0" />

        {/* Golden-amber top accent */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-cyan-400 via-amber-400 to-cyan-400" />

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#09131f]/90 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-950/60 border border-teal-500/40 flex items-center justify-center text-teal-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-amber-400">
                  Quran &amp; Translation Reader
                </span>
                {surahData && (
                  <span className="text-[10px] uppercase font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                    {surahData.revelationType} · {surahData.numberOfAyahs} Ayahs
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mt-0.5">
                <h3 className="text-base sm:text-lg font-bold text-slate-100">
                  {surahData ? `${surahData.englishName} (${surahData.englishNameTranslation})` : 'Loading Surah...'}
                </h3>
                {surahData && (
                  <span className="font-arabic text-amber-300 text-lg font-bold">
                    {surahData.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-Surah Tabs & Search Bar */}
        <div className="p-3 sm:px-5 bg-slate-900/40 border-b border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Multi-Surah Tabs (e.g. for Crypto Trading: 113 + 114) */}
          {mode.surahNumbers.length > 1 ? (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {mode.surahNumbers.map((sNum) => (
                <button
                  key={sNum}
                  onClick={() => setActiveSurahNumber(sNum)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                    activeSurahNumber === sNum
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-cyan-glow'
                      : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700/80 border border-slate-700'
                  }`}
                >
                  Surah #{sNum} {SURAH_NAMES[sNum] ? `· ${SURAH_NAMES[sNum]}` : ''}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
              <span>Reciter:</span>
              <span className="text-cyan-300 font-semibold">Mishary Rashid Alafasy</span>
              <span className="text-slate-600">|</span>
              <span>Translation:</span>
              <span className="text-amber-300 font-semibold">Muhammad Asad</span>
            </div>
          )}

          {/* Search box */}
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search translation or verse #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Target Focus Ayah Banner for Specific Single-Ayah Modes */}
          {targetAyahs && !loading && !error && (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-xs">
              <span className="text-amber-200 font-semibold flex items-center gap-1.5">
                <span>⭐ Mode Primary Focus:</span>
                <span className="text-white font-bold">Ayah {targetAyahs.join(', ')}</span>
              </span>
              <button
                onClick={() => setSearchQuery(searchQuery === targetAyahs[0].toString() ? '' : targetAyahs[0].toString())}
                className="px-3 py-1 rounded-xl bg-amber-400 text-slate-950 font-bold hover:bg-amber-300 transition-colors cursor-pointer text-[11px] shadow-sm"
              >
                {searchQuery === targetAyahs[0].toString() ? 'Show All Ayahs' : 'Isolate Focus Verse'}
              </button>
            </div>
          )}

          {loading && (
            <div className="py-20 flex flex-col items-center justify-center text-center gap-3">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
              <p className="text-sm text-slate-300 font-medium">
                Fetching authentic Uthmani Quran script &amp; translation...
              </p>
            </div>
          )}

          {error && !loading && (
            <div className="py-16 flex flex-col items-center justify-center text-center gap-3">
              <div className="p-3 rounded-full bg-rose-950/50 border border-rose-500/40 text-rose-300">
                <X className="w-6 h-6" />
              </div>
              <p className="text-sm text-rose-300 font-semibold">{error}</p>
              <button
                onClick={() => {
                  delete surahCache[activeSurahNumber];
                  setActiveSurahNumber(activeSurahNumber);
                }}
                className="mt-2 px-4 py-2 rounded-lg bg-cyan-600 text-slate-950 text-xs font-bold hover:bg-cyan-500 cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          {/* Ayah List */}
          {!loading && !error && filteredAyahs && (
            <div className="space-y-4">
              {filteredAyahs.map((ayah) => {
                const isTarget = targetAyahs?.includes(ayah.numberInSurah);
                return (
                  <div
                    key={ayah.number}
                    className={`group relative p-4 rounded-xl transition-all ${
                      isTarget
                        ? 'bg-amber-950/25 border-2 border-amber-400/70 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                        : 'bg-slate-900/50 hover:bg-slate-800/40 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/60">
                      {/* Verse badge */}
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-full font-mono text-xs font-bold flex items-center justify-center ${
                          isTarget
                            ? 'bg-amber-400 text-slate-950 shadow-md'
                            : 'bg-cyan-950/80 border border-cyan-500/40 text-cyan-300'
                        }`}>
                          {ayah.numberInSurah}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Ayah #{ayah.number}
                        </span>
                        {isTarget && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/50">
                            ★ Primary Focus
                          </span>
                        )}
                      </div>

                    {/* Copy action */}
                    <button
                      onClick={() => handleCopyAyah(ayah)}
                      title="Copy Ayah & Translation"
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-all cursor-pointer text-xs flex items-center gap-1"
                    >
                      {copiedAyahNumber === ayah.numberInSurah ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-[10px] text-emerald-300">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-[10px]">Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Arabic Text (RTL with Uthmani script font) */}
                  <p className="font-arabic text-xl sm:text-2xl text-amber-200 text-right leading-loose tracking-wide select-text py-1">
                    {ayah.arabicText}
                  </p>

                  {/* English Translation */}
                  <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal select-text">
                    {ayah.englishText}
                  </p>
                </div>
              );
            })}

              {filteredAyahs.length === 0 && (
                <div className="py-12 text-center text-slate-500 text-sm">
                  No verses matched "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:px-5 border-t border-slate-800 bg-[#09131f] flex items-center justify-between text-[11px] text-slate-400">
          <span>Powered by AlQuran Cloud API &amp; Islamic Network CDN</span>
          <a
            href={`https://quran.com/${activeSurahNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>Open in Quran.com</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
