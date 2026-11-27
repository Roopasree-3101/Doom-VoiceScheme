/**
 * VoiceScheme - Frontend Voice & Dynamic Indic UI Engine
 * Build for Bharat | Scaler x Wispr Flow Hackathon
 */

document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const micBtn = document.getElementById("mic-btn");
    const micIcon = document.getElementById("mic-icon");
    const micStatus = document.getElementById("mic-status");
    const micStatusText = document.getElementById("mic-status-text");
    const transcriptText = document.getElementById("transcript-text");
    const detectedLangBadge = document.getElementById("detected-language-badge");
    const voiceReplyBox = document.getElementById("voice-reply-box");
    const voiceReplyText = document.getElementById("voice-reply-text");
    const replayVoiceBtn = document.getElementById("replay-voice-btn");
    const schemesGrid = document.getElementById("schemes-grid");
    const resultsCount = document.getElementById("results-count");
    const langBtns = document.querySelectorAll(".lang-btn");
    const sampleChips = document.querySelectorAll(".sample-chip");
    const audioPlayer = document.getElementById("audio-player");
    const heroTitle = document.getElementById("hero-title");
    const heroSubtitle = document.getElementById("hero-subtitle");

    // Local State
    let currentLanguage = "en"; // 'en', 'hi', 'te', 'ta'
    let isRecording = false;
    let recognition = null;
    let currentSchemes = [];
    let currentVoiceResponse = "";
    let activeAudioBtn = null;

    // Comprehensive Indic UI Localization Strings
    const UI_TEXT = {
        en: {
            heroTitle: "Speak your needs. Discover your welfare schemes.",
            heroSubtitle: "No typing or complex forms. Just tap the microphone and tell us your work, family, or situation in your mother tongue.",
            placeholder: "Tap the microphone above or click one of the sample citizen scenarios below...",
            listening: "Listening to your voice... Speak now",
            matching: "Matching eligible welfare schemes...",
            matchedSuccess: "Matched successfully! Tap mic to ask again.",
            benefitLabel: "Benefit",
            eligibilityLabel: "Eligibility Checklist:",
            documentsLabel: "Documents Required:",
            listenBtn: "Listen",
            playingBtn: "Stop Audio",
            applyBtn: "How to Apply",
            replayBtn: "Replay Audio",
            voiceSpeaks: "VoiceScheme Speaks:",
            govtOfIndia: "Govt of India",
            topVerified: "Top Verified Schemes",
            headerSubtitle: "Civic Welfare & Scheme Discovery Assistant",
            zeroBadge: "Zero Secret Keys Needed \u2022 Sourced from myscheme.gov.in",
            transcriptLabel: "Live Voice Transcript",
            samplePromptLabel: "Or click a real citizen scenario to test instantly:",
            resultsHeading: "Matched Government Welfare Schemes",
            resultsSubtitle: "Verified against National and State portals",
            micDefault: "Tap microphone to start speaking",
            footerLine1: "<strong>VoiceScheme</strong> \u2022 Built for Bharat Hackathon 2026",
            footerLine2: "Theme: Public Infrastructure & Civic Welfare \u2022 Zero API Keys Required"
        },
        hi: {
            heroTitle: "अपनी बात बोलें। अपनी सरकारी योजनाएं जानें।",
            heroSubtitle: "कोई टाइपिंग या फॉर्म भरने की जरूरत नहीं। माइक दबाएं और अपने काम या परिवार के बारे में बताएं।",
            placeholder: "माइक दबाकर बोलें या नीचे दिए गए किसी उदाहरण पर क्लिक करें...",
            listening: "आपकी आवाज़ सुन रहे हैं... कृपया बोलें",
            matching: "पात्र सरकारी योजनाएं खोजी जा रही हैं...",
            matchedSuccess: "सफलतापूर्वक मिलान हुआ! दोबारा पूछने के लिए माइक दबाएं।",
            benefitLabel: "मुख्य लाभ",
            eligibilityLabel: "पात्रता शर्तें:",
            documentsLabel: "आवश्यक दस्तावेज:",
            listenBtn: "सुनें",
            playingBtn: "रोकें",
            applyBtn: "आवेदन कैसे करें",
            replayBtn: "ऑडियो दोबारा सुनें",
            voiceSpeaks: "वॉइस-स्कीम बोलता है:",
            govtOfIndia: "भारत सरकार",
            topVerified: "शीर्ष सत्यापित योजनाएं",
            headerSubtitle: "नागरिक कल्याण और योजना खोज सहायक",
            zeroBadge: "कोई गुप्त कुंजी नहीं \u2022 myscheme.gov.in से डेटा",
            transcriptLabel: "लाइव वॉइस ट्रांसक्रिप्ट",
            samplePromptLabel: "या कोई नागरिक परिदृश्य चुनें:",
            resultsHeading: "मिली सरकारी कल्याण योजनाएं",
            resultsSubtitle: "राष्ट्रीय और राज्य पोर्टल से सत्यापित",
            micDefault: "माइक दबाएं और बोलें",
            footerLine1: "<strong>वॉइस-स्कीम</strong> \u2022 भारत हैकाथॉन 2026",
            footerLine2: "थीम: सार्वजनिक अवसंरचना एवं नागरिक कल्याण \u2022 कोई API कुंजी नहीं"
        },
        te: {
            heroTitle: "మీ అవసరాలు మాట్లాడండి. ప్రభుత్వ సంక్షేమ పథకాలు పొందండి.",
            heroSubtitle: "టైపింగ్ లేదా పెద్ద ఫారమ్‌లు అవసరం లేదు. మైక్ నొక్కి మీ సమస్య లేదా పని గురించి మాట్లాడండి.",
            placeholder: "మైక్రోఫోన్ నొక్కి మాట్లాడండి లేదా క్రింద ఇచ్చిన ఉదాహరణను క్లిక్ చేయండి...",
            listening: "మీ మాటలను వింటున్నాము... మాట్లాడండి",
            matching: "అర్హత కలిగిన పథకాలను అన్వేషిస్తున్నాము...",
            matchedSuccess: "పథకాలు విజయవంతంగా వచ్చాయి! మళ్ళీ మాట్లాడటానికి మైక్ నొక్కండి.",
            benefitLabel: "ప్రధాన ప్రయోజనం",
            eligibilityLabel: "అర్హత నిబంధనలు:",
            documentsLabel: "కావలసిన పత్రాలు:",
            listenBtn: "వినండి",
            playingBtn: "ఆపండి",
            applyBtn: "దరఖాస్తు విధానం",
            replayBtn: "ఆడియో మళ్లీ వినండి",
            voiceSpeaks: "వాయిస్ స్కీమ్ సహాయకుడు:",
            govtOfIndia: "భారత ప్రభుత్వం",
            topVerified: "అత్యుత్తమ పథకాలు",
            headerSubtitle: "పౌర సంక్షేమ పథక సహాయకుడు",
            zeroBadge: "రహస్య కీ అవసరం లేదు \u2022 myscheme.gov.in నుండి డేటా",
            transcriptLabel: "లైవ్ వాయిస్ ట్రాన్స్‌క్రిప్ట్",
            samplePromptLabel: "లేదా ఒక ఉదాహరణ పరిస్థితిని ఎంచుకోండి:",
            resultsHeading: "అర్హత కలిగిన ప్రభుత్వ సంక్షేమ పథకాలు",
            resultsSubtitle: "జాతీయ మరియు రాష్ట్ర పోర్టల్‌ల ద్వారా ధృవీకరించబడింది",
            micDefault: "మైక్ నొక్కి మాట్లాడండి",
            footerLine1: "<strong>వాయిస్‌స్కీమ్</strong> \u2022 భారత్ హ్యాకథాన్ 2026",
            footerLine2: "థీమ్: పౌర మౌలిక సదుపాయాలు \u2022 API కీ అవసరం లేదు"
        },
        ta: {
            heroTitle: "உங்கள் தேவைகளைப் பேசுங்கள். நலத்திட்டங்களை கண்டறியுங்கள்.",
            heroSubtitle: "எழுதுவதோ படிவங்களோ தேவையில்லை. மைக்ரோஃபோனை அழுத்தி உங்கள் தொழில் அல்லது தேவையைத் தமிழில் பேசுங்கள்.",
            placeholder: "மைக்ரோஃபோனை அழுத்திப் பேசுங்கள் அல்லது கீழே உள்ள உதாரணத்தை சொடுக்கவும்...",
            listening: "கேட்கிறது... இப்போது பேசுங்கள்",
            matching: "தகுதியான நலத்திட்டங்களை தேடுகிறது...",
            matchedSuccess: "திட்டங்கள் வெற்றிகரமாக கண்டறியப்பட்டன! மீண்டும் கேட்க மைக்கை அழுத்தவும்.",
            benefitLabel: "முக்கிய பயன்",
            eligibilityLabel: "தகுதி வரம்புகள்:",
            documentsLabel: "தேவையான ஆவணங்கள்:",
            listenBtn: "கேளுங்கள்",
            playingBtn: "நிறுத்து",
            applyBtn: "விண்ணப்பிப்பது எப்படி",
            replayBtn: "மீண்டும் கேட்க",
            voiceSpeaks: "வாய்ஸ்-ஸ்கீம் கூறுகிறது:",
            govtOfIndia: "இந்திய அரசு",
            topVerified: "முக்கிய திட்டங்கள்",
            headerSubtitle: "குடிமை நல திட்ட உதவியாளர்",
            zeroBadge: "ரகசிய கீ தேவையில்லை \u2022 myscheme.gov.in இலிருந்து தரவு",
            transcriptLabel: "நேரடி குரல் படியெடுப்பு",
            samplePromptLabel: "அல்லது ஒரு உதாரணத்தைத் தேர்ந்தெடுக்கவும்:",
            resultsHeading: "பொருந்திய அரசு நலத்திட்டங்கள்",
            resultsSubtitle: "தேசிய மற்றும் மாநில தளங்கள் மூலம் சரிபார்க்கப்பட்டது",
            micDefault: "மைக்ரோஃபோனை அழுத்திப் பேசுங்கள்",
            footerLine1: "<strong>வாய்ஸ்ஸ்கீம்</strong> \u2022 பாரத் ஹேக்கதான் 2026",
            footerLine2: "தீம்: குடிமை உள்கட்டமைப்பு \u2022 API கீ தேவையில்லை"
        }
    };

    // ================= AUDIO CONTROLLER =================

    /**
     * Stops all active audio playback (both audio element and speech synthesis)
     * and resets any active button UI.
     */
    function stopAllAudio() {
        if (audioPlayer) {
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
            audioPlayer.onended = null;
            audioPlayer.onerror = null;
        }

        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }

        if (activeAudioBtn) {
            resetButtonUi(activeAudioBtn);
            activeAudioBtn = null;
        }
    }

    /**
     * Resets a button's UI back to its idle state
     */
    function resetButtonUi(btn) {
        if (!btn) return;
        const isReplayBtn = (btn === replayVoiceBtn);
        const lang = currentLanguage || "en";
        const t = UI_TEXT[lang] || UI_TEXT.en;

        if (isReplayBtn) {
            btn.innerHTML = `<i class="fa-solid fa-rotate-right"></i> ${t.replayBtn}`;
            btn.classList.remove("bg-rose-500/20", "text-rose-300", "border-rose-500/30");
            btn.classList.add("bg-amber-500/20", "text-amber-300");
        } else {
            btn.innerHTML = `<i class="fa-solid fa-volume-high"></i> ${t.listenBtn}`;
            btn.classList.remove("bg-rose-500/20", "text-rose-300", "border-rose-500/30");
            btn.classList.add("bg-amber-500/10", "text-amber-400");
        }
    }

    /**
     * Plays text audio cleanly in the given language without overlapping
     */
    function speakAudio(text, lang, triggerBtn = null) {
        // If clicking the button that is already playing, toggle it OFF (stop)
        if (triggerBtn && triggerBtn === activeAudioBtn && !audioPlayer.paused) {
            stopAllAudio();
            return;
        }

        // Stop any previous audio before starting new playback
        stopAllAudio();

        if (!text || text.trim() === "") return;

        const targetLang = lang || currentLanguage || "en";
        const t = UI_TEXT[targetLang] || UI_TEXT.en;

        // Set active button UI to playing state
        if (triggerBtn) {
            activeAudioBtn = triggerBtn;
            triggerBtn.innerHTML = `<i class="fa-solid fa-stop"></i> ${t.playingBtn}`;
            triggerBtn.classList.remove("bg-amber-500/10", "bg-amber-500/20", "text-amber-300", "text-amber-400");
            triggerBtn.classList.add("bg-rose-500/20", "text-rose-300", "border-rose-500/30");
        }

        // Endpoint for authentic regional Indic accent via gTTS
        const ttsUrl = `/api/tts?lang=${encodeURIComponent(targetLang)}&text=${encodeURIComponent(text.substring(0, 300))}`;
        audioPlayer.src = ttsUrl;

        audioPlayer.onended = () => {
            stopAllAudio();
        };

        audioPlayer.onerror = (e) => {
            console.warn("gTTS audio stream error, attempting local synthesis fallback:", e);
            fallbackSpeechSynthesis(text, targetLang);
        };

        audioPlayer.play().catch(e => {
            // Ignore intentional AbortErrors from quick clicks
            if (e.name === "AbortError") return;
            console.warn("HTML5 audio play blocked, attempting local speech synthesis fallback:", e);
            fallbackSpeechSynthesis(text, targetLang);
        });
    }

    /**
     * Fallback to Web Speech API SpeechSynthesis
     */
    function fallbackSpeechSynthesis(text, lang) {
        if (!('speechSynthesis' in window)) {
            stopAllAudio();
            return;
        }
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        const langMap = { "en": "en-IN", "hi": "hi-IN", "te": "te-IN", "ta": "ta-IN" };
        utterance.lang = langMap[lang] || "en-IN";
        utterance.rate = 0.95;

        utterance.onend = () => {
            stopAllAudio();
        };
        utterance.onerror = () => {
            stopAllAudio();
        };

        window.speechSynthesis.speak(utterance);
    }

    // Replay Audio button click
    replayVoiceBtn.addEventListener("click", () => {
        if (currentVoiceResponse) {
            speakAudio(currentVoiceResponse, currentLanguage, replayVoiceBtn);
        }
    });

    // ================= SPEECH RECOGNITION (WEB SPEECH API) =================

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            stopAllAudio();
            isRecording = true;
            micBtn.classList.add("mic-recording");
            micIcon.className = "fa-solid fa-stop";
            const t = UI_TEXT[currentLanguage] || UI_TEXT.en;
            micStatus.innerHTML = `
                <span class="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                <span class="text-amber-400 font-bold">${t.listening}</span>
            `;
            transcriptText.innerText = "Listening...";
        };

        recognition.onresult = (event) => {
            let interimTranscript = "";
            let finalTranscript = "";

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            const currentText = finalTranscript || interimTranscript;
            if (currentText) {
                transcriptText.innerText = `"${currentText}"`;
            }

            if (finalTranscript) {
                handleVoiceQuery(finalTranscript);
            }
        };

        recognition.onerror = (event) => {
            console.warn("Speech recognition error:", event.error);
            stopRecording();
            micStatus.innerHTML = `
                <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span class="text-slate-300">Voice capture stopped (${event.error}). Tap mic again or click a sample scenario.</span>
            `;
        };

        recognition.onend = () => {
            stopRecording();
        };
    } else {
        micStatus.innerHTML = `
            <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span class="text-amber-300">Speech API not active. Please use Chrome/Edge or click a sample scenario below!</span>
        `;
    }

    function startRecording() {
        if (!recognition) return;
        try {
            const langMap = { "en": "en-IN", "hi": "hi-IN", "te": "te-IN", "ta": "ta-IN" };
            recognition.lang = langMap[currentLanguage] || "en-IN";
            recognition.start();
        } catch (e) {
            console.error("Mic start error:", e);
        }
    }

    function stopRecording() {
        isRecording = false;
        micBtn.classList.remove("mic-recording");
        micIcon.className = "fa-solid fa-microphone";
        const t = UI_TEXT[currentLanguage] || UI_TEXT.en;
        micStatus.innerHTML = `
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span id="mic-status-text">${t.micDefault}</span>
        `;
    }

    micBtn.addEventListener("click", () => {
        if (isRecording) {
            if (recognition) recognition.stop();
            stopRecording();
        } else {
            startRecording();
        }
    });

    // ================= LANGUAGE QUICK SELECTOR =================

    langBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            stopAllAudio();
            langBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentLanguage = btn.dataset.lang;
            detectedLangBadge.innerText = `Lang: ${currentLanguage.toUpperCase()}`;
            
            // 1. Update static UI text
            updateLanguagePlaceholders(currentLanguage);

            // 2. Re-render cards in the new language immediately
            if (currentSchemes && currentSchemes.length > 0) {
                renderSchemes(currentSchemes, currentLanguage);
                updateSpokenTextForCurrentSchemes(currentLanguage);
            }
        });
    });

    // Update static UI placeholders
    function updateLanguagePlaceholders(lang) {
        const t = UI_TEXT[lang] || UI_TEXT.en;
        // Hero section
        heroTitle.innerText = t.heroTitle;
        heroSubtitle.innerText = t.heroSubtitle;
        transcriptText.innerText = `"${t.placeholder}"`;
        resultsCount.innerText = t.topVerified;
        // Header subtitle
        const headerSub = document.getElementById("header-subtitle");
        if (headerSub) headerSub.innerText = t.headerSubtitle;
        // Zero keys badge
        const zeroBadge = document.getElementById("zero-keys-badge");
        if (zeroBadge) zeroBadge.innerText = t.zeroBadge;
        // Transcript label
        const transcriptLabel = document.getElementById("transcript-label");
        if (transcriptLabel) transcriptLabel.innerText = t.transcriptLabel;
        // VoiceScheme Speaks label
        const voiceSpeaksLabel = document.getElementById("voice-speaks-label");
        if (voiceSpeaksLabel) voiceSpeaksLabel.innerHTML = `<i class="fa-solid fa-volume-high"></i> ${t.voiceSpeaks}`;
        // Sample prompt label
        const samplePromptLabel = document.getElementById("sample-prompt-label");
        if (samplePromptLabel) samplePromptLabel.innerText = t.samplePromptLabel;
        // Results heading & subtitle
        const resultsHeading = document.getElementById("results-heading");
        if (resultsHeading) resultsHeading.innerText = t.resultsHeading;
        const resultsSubtitle = document.getElementById("results-subtitle");
        if (resultsSubtitle) resultsSubtitle.innerText = t.resultsSubtitle;
        // Mic status default text (only if not currently recording)
        const micStatusText = document.getElementById("mic-status-text");
        if (micStatusText && !isRecording) micStatusText.innerText = t.micDefault;
        // Replay button text
        if (voiceReplyBox && !voiceReplyBox.classList.contains("hidden")) {
            replayVoiceBtn.innerHTML = `<i class="fa-solid fa-rotate-right"></i> ${t.replayBtn}`;
        }
        // Footer
        const footer1 = document.getElementById("footer-line1");
        if (footer1) footer1.innerHTML = t.footerLine1;
        const footer2 = document.getElementById("footer-line2");
        if (footer2) footer2.innerHTML = t.footerLine2;
    }

    // ================= SAMPLE CHIPS CLICK =================

    sampleChips.forEach(chip => {
        chip.addEventListener("click", () => {
            stopAllAudio();
            const query = chip.dataset.query;
            const lang = chip.dataset.lang || "en";

            currentLanguage = lang;
            langBtns.forEach(b => {
                b.classList.toggle("active", b.dataset.lang === lang);
            });
            detectedLangBadge.innerText = `Lang: ${lang.toUpperCase()}`;
            updateLanguagePlaceholders(lang);

            transcriptText.innerText = `"${query}"`;
            handleVoiceQuery(query);
        });
    });

    // ================= API VOICE QUERY =================

    async function handleVoiceQuery(queryText) {
        stopAllAudio();
        const t = UI_TEXT[currentLanguage] || UI_TEXT.en;

        micStatus.innerHTML = `
            <div class="sound-wave">
                <span></span><span></span><span></span><span></span><span></span>
            </div>
            <span class="text-amber-400 font-bold ml-2">${t.matching}</span>
        `;

        try {
            const response = await fetch("/api/voice-query", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: queryText,
                    language: currentLanguage
                })
            });

            if (!response.ok) throw new Error("API call failed");

            const data = await response.json();

            // Save matched schemes in memory
            currentSchemes = data.matched_schemes || [];
            const returnedLang = data.language || currentLanguage;

            // Auto-switch language if the API detected a different one (e.g. "telugulo" / "hindi mai")
            if (returnedLang !== currentLanguage) {
                currentLanguage = returnedLang;
                langBtns.forEach(b => {
                    b.classList.toggle("active", b.dataset.lang === currentLanguage);
                });
                updateLanguagePlaceholders(currentLanguage);
            } else {
                currentLanguage = returnedLang;
            }

            // Update badge
            detectedLangBadge.innerText = `Lang: ${currentLanguage.toUpperCase()}`;

            // Show spoken response
            currentVoiceResponse = data.speech_reply;
            showVoiceReply(data.speech_reply);

            // Play voice reply cleanly
            speakAudio(data.speech_reply, currentLanguage, replayVoiceBtn);

            // Render cards in the detected/chosen language
            renderSchemes(currentSchemes, currentLanguage);

            const countText = (currentLanguage === "te") ? `${data.schemes_count} అర్హత గల పథకాలు` :
                              (currentLanguage === "hi") ? `${data.schemes_count} पात्र सरकारी योजनाएं` :
                              `${data.schemes_count} Matched Schemes`;
            resultsCount.innerText = countText;

            micStatus.innerHTML = `
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span class="text-emerald-400 font-semibold">${t.matchedSuccess}</span>
            `;
        } catch (err) {
            console.error("Query Error:", err);
            micStatus.innerHTML = `
                <span class="w-2 h-2 rounded-full bg-rose-500"></span>
                <span class="text-rose-400">Error processing voice query. Please retry.</span>
            `;
        }
    }

    // Display Voice Assistant Reply Box
    function showVoiceReply(replyText) {
        voiceReplyBox.classList.remove("hidden");
        voiceReplyText.innerText = replyText;
        const t = UI_TEXT[currentLanguage] || UI_TEXT.en;
        replayVoiceBtn.innerHTML = `<i class="fa-solid fa-rotate-right"></i> ${t.replayBtn}`;
    }

    // Update voice reply text when language switches
    function updateSpokenTextForCurrentSchemes(lang) {
        if (!currentSchemes || currentSchemes.length === 0) return;
        const topScheme = currentSchemes[0];
        const num = currentSchemes.length;
        let text = "";

        if (lang === "te") {
            const name = topScheme.name_te || topScheme.name;
            const benefit = topScheme.benefit_te || topScheme.benefit;
            const docs = (topScheme.required_documents_te || topScheme.required_documents || []).slice(0, 2).join(", ");
            text = `నమస్కారం! మీ వివరాల ప్రకారం మీరు ${num} ముఖ్యమైన ప్రభుత్వ సంక్షేమ పథకాలకు అర్హులు. మొదటిది ${name}. ఇందులో ${benefit} దరఖాస్తు కోసం ముఖ్యంగా ${docs} అవసరం.`;
        } else if (lang === "hi") {
            const name = topScheme.name_hi || topScheme.name;
            const benefit = topScheme.benefit_hi || topScheme.benefit;
            const docs = (topScheme.required_documents_hi || topScheme.required_documents || []).slice(0, 2).join(", ");
            text = `नमस्ते! आपके विवरण के अनुसार आप ${num} मुख्य सरकारी योजनाओं के पात्र हैं। सबसे महत्वपूर्ण है ${name}, जिसमें ${benefit} आवेदन के लिए ${docs} आवश्यक हैं।`;
        } else {
            const name = topScheme.name;
            const benefit = topScheme.benefit;
            const docs = (topScheme.required_documents || []).slice(0, 2).join(", ");
            text = `Namaste! Based on what you shared, you qualify for ${num} key government welfare schemes. The primary scheme is ${name}, which provides ${benefit}. You will need ${docs} to apply.`;
        }

        currentVoiceResponse = text;
        showVoiceReply(text);
    }

    // ================= DYNAMIC INDIC SCHEME CARD RENDERER =================

    function renderSchemes(schemes, lang) {
        if (!schemes || schemes.length === 0) {
            schemesGrid.innerHTML = `
                <div class="col-span-full text-center py-12 text-slate-400">
                    <i class="fa-solid fa-circle-question text-4xl mb-3 text-slate-500"></i>
                    <p class="text-base font-medium">No direct matching schemes found.</p>
                    <p class="text-xs text-slate-500 mt-1">Try mentioning your work (farmer, artisan, student) or family situation.</p>
                </div>
            `;
            return;
        }

        const t = UI_TEXT[lang] || UI_TEXT.en;

        schemesGrid.innerHTML = schemes.map((scheme, index) => {
            // Localized Name
            const displayName = (lang === "te" && scheme.name_te) ? scheme.name_te :
                                (lang === "hi" && scheme.name_hi) ? scheme.name_hi :
                                (lang === "ta" && scheme.name_ta) ? scheme.name_ta :
                                scheme.name;

            // Localized Category
            const displayCategory = (lang === "te" && scheme.category_te) ? scheme.category_te :
                                    (lang === "hi" && scheme.category_hi) ? scheme.category_hi :
                                    (lang === "ta" && scheme.category_ta) ? scheme.category_ta :
                                    scheme.category;

            // Localized Benefit
            const displayBenefit = (lang === "te" && scheme.benefit_te) ? scheme.benefit_te :
                                   (lang === "hi" && scheme.benefit_hi) ? scheme.benefit_hi :
                                   (lang === "ta" && scheme.benefit_ta) ? scheme.benefit_ta :
                                   scheme.benefit;

            // Localized Eligibility Checklist
            const rawElig = (lang === "te" && scheme.eligibility_te) ? scheme.eligibility_te :
                            (lang === "hi" && scheme.eligibility_hi) ? scheme.eligibility_hi :
                            (lang === "ta" && scheme.eligibility_ta) ? scheme.eligibility_ta :
                            scheme.eligibility || [];
            const eligArray = Array.isArray(rawElig) ? rawElig : [rawElig];
            const criteriaList = eligArray.map(c => 
                `<li class="flex items-start gap-1.5"><i class="fa-solid fa-check text-emerald-400 text-[10px] mt-1 shrink-0"></i><span>${c}</span></li>`
            ).join("");

            // Localized Required Documents
            const rawDocs = (lang === "te" && scheme.required_documents_te) ? scheme.required_documents_te :
                            (lang === "hi" && scheme.required_documents_hi) ? scheme.required_documents_hi :
                            (lang === "ta" && scheme.required_documents_ta) ? scheme.required_documents_ta :
                            scheme.required_documents || [];
            const docsBadges = rawDocs.map(doc => 
                `<span class="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-700">${doc}</span>`
            ).join(" ");

            // Text that the "Listen" button speaks aloud
            let cardAudioText = "";
            if (lang === "te") {
                cardAudioText = `${displayName}. ${displayBenefit}. కావలసిన పత్రాలు: ${rawDocs.join(", ")}.`;
            } else if (lang === "hi") {
                cardAudioText = `${displayName}। ${displayBenefit}। आवश्यक दस्तावेज: ${rawDocs.join(", ")}।`;
            } else if (lang === "ta") {
                cardAudioText = `${displayName}. ${displayBenefit}. தேவையான ஆவணங்கள்: ${rawDocs.join(", ")}.`;
            } else {
                cardAudioText = `${displayName}. ${displayBenefit}. Required documents: ${rawDocs.join(", ")}.`;
            }

            return `
                <div class="scheme-card rounded-2xl p-5 flex flex-col justify-between">
                    <div>
                        <!-- Category & Ministry Header -->
                        <div class="flex items-center justify-between mb-3 text-[11px]">
                            <span class="bg-amber-500/20 text-amber-400 font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30 uppercase text-[10px]">
                                ${displayCategory || 'Welfare'}
                            </span>
                            <span class="text-slate-400 truncate max-w-[150px] text-right text-[11px]">
                                ${t.govtOfIndia}
                            </span>
                        </div>

                        <!-- Scheme Name -->
                        <h4 class="text-base font-extrabold text-white mb-2 leading-snug">
                            ${displayName}
                        </h4>

                        <!-- Benefit Box -->
                        <div class="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3 mb-4">
                            <span class="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block mb-0.5">${t.benefitLabel}</span>
                            <p class="text-xs font-semibold text-emerald-200">
                                <i class="fa-solid fa-hand-holding-dollar mr-1"></i> ${displayBenefit}
                            </p>
                        </div>

                        <!-- Eligibility Checklist -->
                        <div class="text-xs text-slate-300 mb-4">
                            <p class="font-bold text-slate-400 text-[11px] mb-1.5 uppercase tracking-wider">${t.eligibilityLabel}</p>
                            <ul class="space-y-1 text-[11px] text-slate-300">
                                ${criteriaList}
                            </ul>
                        </div>

                        <!-- Documents Required -->
                        <div class="mb-4">
                            <p class="font-bold text-slate-400 text-[11px] mb-1.5 uppercase tracking-wider">${t.documentsLabel}</p>
                            <div class="flex flex-wrap gap-1">
                                ${docsBadges}
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="pt-4 border-t border-slate-800 flex items-center justify-between gap-2 mt-2">
                        <button class="listen-scheme-btn text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition"
                            data-text="${cardAudioText.replace(/"/g, '&quot;')}"
                            data-lang="${lang}">
                            <i class="fa-solid fa-volume-high"></i> ${t.listenBtn}
                        </button>
                        <a href="${scheme.official_portal || 'https://www.myscheme.gov.in'}" target="_blank" rel="noopener noreferrer"
                            class="text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-700 transition flex items-center gap-1">
                            <span>${t.applyBtn}</span>
                            <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                        </a>
                    </div>
                </div>
            `;
        }).join("");

        // Attach event listeners to all newly rendered "Listen" buttons
        document.querySelectorAll(".listen-scheme-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const textToSpeak = btn.getAttribute("data-text");
                const cardLang = btn.getAttribute("data-lang") || currentLanguage;
                speakAudio(textToSpeak, cardLang, btn);
            });
        });
    }

    // ================= INITIAL DATA LOAD =================

    async function loadInitialSchemes() {
        try {
            const res = await fetch("/api/schemes");
            if (res.ok) {
                const data = await res.json();
                currentSchemes = data.slice(0, 6);
                renderSchemes(currentSchemes, currentLanguage);
            }
        } catch (e) {
            console.warn("Could not load initial schemes:", e);
        }
    }

    loadInitialSchemes();
});
