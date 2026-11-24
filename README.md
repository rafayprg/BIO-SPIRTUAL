# Bio Spiritual Hacking — Neuro Reset Console

A production-ready web application for **Bio Spiritual Hacking / Neuro Reset Console** that combines golden-ratio Web Audio harmonic synthesis, stereo binaural brainwave entrainment, and Quran recitation layering (recited by Sheikh Mishary Rashid Alafasy).

---

## 🌟 Key Features

1. **Aesthetic & Visual Identity:**
   - **Dark Navy / Charcoal Palette:** Deep radial gradient (`#0d1b2a` to `#09131f`) with cyber grid background.
   - **Glowing Crescent Moon Header:** Illuminated emerald/teal crescent badge with wide tracked typography (`BIO SPIRITUAL HACKING`).
   - **Cyber Neuro Graphic:** Faint geometric wireframe grid and neural cranium SVG integrated behind the header.
   - **Glow & Border System:** Cyan/teal active selection glow (`#22d3ee` / `#14b8a6`) with golden-amber (`#f59e0b`) accent lines.
   - **Authentic Arabic Typography:** Native RTL Arabic script support (`Amiri` / `Noto Naskh Arabic`) with full vowel diacritics (Tashkeel).

2. **Dual-Layer Web Audio Synthesis Engine:**
   - **Layer 1 — Stereo Binaural Beat (Headphones):**
     - Separate Left and Right `OscillatorNode`s routed into a stereo `ChannelMergerNode`.
     - Left ear = `carrierHz` (432 Hz or 528 Hz), Right ear = `carrierHz + beatHz`.
     - Supports **Alpha (10 Hz)**, **Theta (4–6 Hz)**, **Gamma (40 Hz)**, **Delta (2 Hz)**, **Beta (18 Hz)**, and **Schumann Earth Resonance (7.83 Hz)**.
   - **Layer 2 — Golden-Ratio Harmonic Opening + Bismillah + Quran Recitation:**
     - Pure sine harmonic opening chord tuned to the Golden Ratio: **432 Hz**, **576 Hz** (4:3 perfect fourth), and **699 Hz** (φ ≈ 1.618033).
     - Layered with *A'udhu billah + Bismillah* recitation.
     - Smooth crossfade into high-fidelity streaming recitation by **Sheikh Mishary Rashid Alafasy** (`ar.alafasy`).
     - Automated seamless looping, including multi-surah queueing (e.g. Surah 113 Al-Falaq → Surah 114 An-Nas).

3. **Complete Mode Protocol Library:**
   - **📊 Crypto Trading: Calm & Cool** *(Featured Top Card)* — Alpha 10 Hz · 432 Hz · Al-Falaq (#113) + An-Nas (#114)
   - **🧠 Mind Reset** *(Default)* — Alpha 10 Hz · 432 Hz · Ar-Rahman (#55)
   - **💚 Jealousy · Hasad (حسد)** — Theta 6 Hz · 432 Hz · Al-Falaq (#113)
   - **😒 Gheebah · Backbiting (غیبت)** — Alpha 10 Hz · 432 Hz · Al-Hujurat (#49)
   - **🎯 Focus & Study** — Gamma 40 Hz · 432 Hz · Al-'Alaq (#96)
   - **😌 Anxiety & Calm** — Theta 6 Hz · 432 Hz · Ash-Sharh (#94)
   - **😴 Deep Sleep** — Delta 2 Hz · 432 Hz · Al-Mulk (#67)
   - **📿 Dhikr & Meditation** — Theta 4 Hz · 432 Hz · Al-Muzzammil (#73)
   - **🚀 Motivation / Energy** — Beta 18 Hz · 432 Hz · Ad-Duha (#93)
   - **💗 Love & Connection** — Schumann 7.83 Hz · 528 Hz Solfeggio · Ar-Rum (#30)
   - **🌿 Healing & Shifa** — Schumann 7.83 Hz · 432 Hz · Al-Fatiha (#1)

4. **Dynamic 5-Row Specification Panel:**
   - Displays **FOR**, **FREQUENCY**, **OPENING**, **SURAH**, and **WHY THIS** for every selected mode.

5. **Audio Controls & Live Visualizer:**
   - Primary **Start / Stop Session** button with live state feedback.
   - Independent sliders for **Reset Frequency (Hz)** volume and **Quran Recitation** volume.
   - Live **HTML5 Canvas Oscilloscope / Waveform Visualizer** driven by Web Audio `AnalyserNode`.
   - **Headphones Recommended** indicator badge.

6. **Interactive Quran & Translation Drawer:**
   - Fetches authentic Uthmani Arabic text and English translation (Muhammad Asad) from AlQuran Cloud API.
   - In-memory caching for zero-latency switching.
   - Multi-surah tabs (e.g. switch between Surah 113 and 114).
   - In-reader search filter by verse text or number.
   - One-click copy Ayah and translation.

---

## 🚀 Running the Project

### Development
```bash
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build
```bash
npm run build
npm run preview
```
