import { useState, useEffect } from 'react';

export interface LiveAyah {
  numberInSurah: number;
  arabicText: string;
  translation: string;
}

const cache: Record<number, LiveAyah[]> = {};

export function useSurahAyahs(surahNumber: number) {
  const [ayahs, setAyahs] = useState<LiveAyah[]>(cache[surahNumber] || []);
  const [loading, setLoading] = useState<boolean>(!cache[surahNumber]);

  useEffect(() => {
    if (!surahNumber) return;

    if (cache[surahNumber]) {
      setAyahs(cache[surahNumber]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,en.asad`)
      .then((res) => res.json())
      .then((json) => {
        if (!isMounted) return;
        if (json?.data && json.data.length >= 2) {
          const arabic = json.data[0].ayahs;
          const english = json.data[1].ayahs;
          const mapped: LiveAyah[] = arabic.map((a: { numberInSurah: number; text: string }, i: number) => ({
            numberInSurah: a.numberInSurah,
            arabicText: a.text,
            translation: english[i]?.text || '',
          }));
          cache[surahNumber] = mapped;
          setAyahs(mapped);
        }
      })
      .catch((err) => {
        console.warn('Ayah fetch warning:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [surahNumber]);

  return { ayahs, loading };
}
