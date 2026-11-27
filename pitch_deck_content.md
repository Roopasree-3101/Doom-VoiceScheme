# VoiceScheme - Pitch Deck Document
### Scaler x Wispr Flow Hackathon ("Build for Bharat") | Round 2 Submission
**Theme:** Public Infrastructure and Civic Services  
**Project:** VoiceScheme — Multilingual Voice-First Welfare Discovery Assistant  
**Author:** Roopa Sree (Doom-VoiceScheme)  

---

## SLIDE 1: Title & Vision
* **Project Name:** VoiceScheme (Doom-VoiceScheme)
* **Tagline:** Unlocking Bharat’s Civic Welfare through the Power of Voice.
* **Core Mission:** Enabling 300+ million non-English speaking, rural, and digitally hesitant citizens to discover and access government benefits simply by speaking in their mother tongue.
* **Key Innovation:** Zero typing, zero dropdown menus, zero middlemen exploitation. 100% voice-first in Indic languages (Hindi, Telugu, Tamil, and Indian English).

---

## SLIDE 2: Problem & Solution
### The Problem:
* Over ₹1.5 lakh crore in Direct Benefit Transfer (DBT) welfare funds are allocated annually by Central and State Governments.
* Yet, over **300 million citizens** (marginal farmers, rural widows, daily-wage laborers, unorganized sector artisans) remain excluded because:
  1. **Text & Literacy Barrier:** Existing discovery portals (like myscheme.gov.in) require complex written forms, drop-downs, and bureaucratic terminology.
  2. **Exploitative Intermediaries:** Illiterate citizens pay ₹200 to ₹1,000 to cyber café agents and middlemen just to find out what they are eligible for.
  3. **Lack of Indic Dialogue:** Government schemes have strict eligibility rules (landholding limits, age brackets, income tiers) that rural citizens cannot translate into database filters.

### The VoiceScheme Solution:
* **Natural Conversational Speech:** A farmer or citizen simply taps a single microphone button and speaks their natural life story: *"I am a small farmer with 2 acres land in Karnataka, my paddy crop was damaged by rains."*
* **Intelligent Indic NLP Matching:** The system extracts key attributes (occupation, landholding, income, gender, distress factors) without needing any cloud API keys.
* **Spoken + Visual Assistance:** Speaks back the top eligible schemes with a concise checklist of documents needed and direct application steps, eliminating intermediary corruption.

---

## SLIDE 3: Who It Is For (Target Audience & Market Size)
### Primary User Personas:
1. **Marginal & Small Farmers (120+ Million):** Need seasonal crop insurance (PM Fasal Bima), direct income support (PM-Kisan), and subsidized fertilizers.
2. **Rural & Urban BPL Families (150+ Million):** Require health coverage (Ayushman Bharat - ₹5 Lakhs), housing subsidies (PMAY), and clean cooking gas (Ujjwala).
3. **Unorganized Artisans & Daily-Wage Workers (80+ Million):** Need collateral-free micro-loans (PM Mudra, PM Vishwakarma) and rural employment guarantee (MGNREGA).
4. **Vulnerable Demographics (Widows, Elderly, Students):** Seeking social security pensions (NSAP) and post-matric education scholarships.

### Total Addressable Market (TAM / SAM / SOM):
* **TAM:** 900+ million citizens in India eligible for at least one social welfare program.
* **SAM (Serviceable Addressable Market):** 350+ million smartphone and feature phone internet users who struggle with English and text typing.
* **SOM (Serviceable Obtainable Market):** 25 million rural citizens in the first 18 months through Common Service Centers (CSC) and Gram Panchayat kiosks.

---

## SLIDE 4: Technology Dependencies, Resilience & Fallbacks
### What It Depends On:
1. **Speech-to-Text (STT):**
   * Primary: Web Speech API (`webkitSpeechRecognition`) for zero-latency, in-browser edge transcription.
   * Wispr Flow API / Bhashini / Whisper: Plug-and-play for advanced noisy rural acoustic environments.
2. **Conversational Entity Extraction Engine:**
   * Custom Rule-Based Indic Tokenizer & NLP Mapper (`INDIC_VOCABULARY`).
   * **Crucial Resilience Feature:** Requires **zero secret API keys** and runs completely offline. No downtime or billing shocks from third-party LLM token limits.
3. **Text-to-Speech (TTS):**
   * Primary: Regional Indic `gTTS` audio synthesis with browser SpeechSynthesis fallback.

### What Happens If Services Get Costly or Stop Working?
* **Zero-Cost Architectural Guarantee:** The core discovery engine is deterministic and runs locally on lightweight CPU hardware (containerized in Docker with <200MB RAM footprint).
* **Graceful Degradation:** If internet connectivity drops or cloud TTS fails, the app automatically switches to local device speech synthesis.
* **No Vendor Lock-In:** Designed to run equally well on a \$30 Android phone, a village kiosk Raspberry Pi, or a high-end cloud server.

---

## SLIDE 5: Launch Plan & Growth Strategy
### Phase 1: Kiosk & Gram Panchayat Deployment (Months 1–3)
* Deploy VoiceScheme as a dedicated voice kiosk bookmark across 500+ **Common Service Centers (CSCs)** and village Panchayats in Andhra Pradesh, Telangana, and Uttar Pradesh.
* Partner with Village Level Entrepreneurs (VLEs) who assist villagers in paperwork.

### Phase 2: WhatsApp Voice Bot Integration (Months 4–6)
* Launch VoiceScheme on WhatsApp voice notes via Twilio/Gupshup.
* Citizens send a 10-second voice note describing their problem, and receive an instant voice note reply listing eligible schemes and nearest enrollment camps.

### Phase 3: Telephony IVR Line (Toll-Free 1800 Voice Number) (Months 7–12)
* Extend VoiceScheme to 250 million feature-phone (JioBharat / 2G) users through a toll-free IVR number where users speak and hear responses over standard cellular phone calls without internet.

---

## SLIDE 6: Measurable Impact & Success Metrics
* **Key Metric:** Number of verified scheme enrollments successfully completed without paying bribes or agent fees.
* **Goal (Year 1):** 1 Million citizens guided; ₹200+ Crores in legitimate DBT welfare benefits unlocked.
* **Efficiency:** Reduces scheme discovery time from 3 hours of physical travel and queueing to **45 seconds** of spoken dialogue.
