"""
VoiceScheme - Deterministic Indic NLP Entity Extraction Engine
Extracts civic welfare attributes without external LLM dependencies or API keys.
"""

import re
from typing import Dict, Any, Set

# Comprehensive Multilingual Indic Vocabulary (English, Romanized/Hinglish, Devanagari Hindi, Telugu, Tamil)
INDIC_VOCABULARY = {
    "farmer": [
        "farmer", "kisan", "kisaan", "farming", "agriculture", "land", "crop", "crops",
        "fasal", "kheti", "zameen", "rythu", "raithu", "vyavasayam", "vivasayam",
        "ullavan", "paddy", "cotton", "seeds", "fertilizer", "acre", "acres", "bigha",
        # Devanagari Hindi
        "किसान", "खेती", "फसल", "जमीन", "खेत", "कृषि", "धान", "बीज", "खाद", "एकड़", "बीघा",
        # Telugu
        "రైతు", "వ్యవసాయం", "పంట", "భూమి", "ఎకరం", "వరి", "విత్తనాలు",
        # Tamil
        "விவசாயி", "பயிர்", "நிலம்", "விவசாயம்"
    ],
    "health": [
        "health", "hospital", "doctor", "medical", "treatment", "medicine", "illness",
        "disease", "operation", "surgery", "bimari", "ilaj", "davakhana", "aspatal",
        "arogyam", "maruthuvam", "rogam", "tablet", "ayushman",
        # Devanagari Hindi
        "इलाज", "अस्पताल", "बीमारी", "दवा", "ऑपरेशन", "आयुष्मान", "डॉक्टर", "स्वास्थ्य",
        # Telugu
        "ఆరోగ్య", "చికిత్స", "ఆసుపత్రి", "రోగం", "మందులు", "డాక్టర్",
        # Tamil
        "மருத்துவம்", "மருத்துவமனை", "சிகிச்சை"
    ],
    "disaster": [
        "damage", "rain", "drought", "flood", "loss", "sukha", "badh", "barish",
        "crop loss", "keeda", "peshi", "nashtam", "varsham", "varumai",
        # Devanagari Hindi
        "नुकसान", "बारिश", "बाढ़", "सूखा", "कीड़ा", "बर्बाद", "ओलावृष्टि",
        # Telugu
        "నష్టం", "వర్షం", "వరద", "కరువు"
    ],
    "girl_child": [
        "daughter", "girl", "child", "female", "baby", "beti", "ladki", "kanya",
        "papa", "ammayi", "pen", "magal", "marriage", "shaadi", "pelli",
        # Devanagari Hindi
        "बेटी", "लड़की", "कन्या", "बच्ची", "विवाह", "शादी",
        # Telugu
        "కుమార్తె", "కూతురు", "అమ్మాయి", "పిల్ల", "పెళ్లి"
    ],
    "widow": [
        "widow", "widowed", "husband died", "single mother", "vidhwa", "vidhava",
        "kanavani", "destitute", "pati mar gaya",
        # Devanagari Hindi
        "विधवा", "पति", "देहांत", "मौत", "मृत्यु", "निराश्रित", "पति का देहांत",
        # Telugu
        "వితంతు", "భర్త చనిపోయిన", "వితంతువు"
    ],
    "elderly": [
        "elderly", "old age", "senior", "senior citizen", "grandmother", "grandfather",
        "buddha", "buddhi", "vriddha", "peddavallu", "thaatha", "paati", "60", "pension",
        # Devanagari Hindi
        "वृद्ध", "बुजुर्ग", "बूढ़े", "पेंशन", "६०", "दादा", "दादी",
        # Telugu
        "వృద్ధాప్య", "వృద్ధులు", "పెన్షన్", "తాత", "బామ్మ"
    ],
    "housing": [
        "house", "housing", "shelter", "roof", "hut", "kaccha house", "homeless",
        "makaan", "ghar", "kutiya", "illu", "veedu", "awas", "nirman",
        # Devanagari Hindi
        "घर", "मकान", "कच्चा", "छत", "झोपड़ी", "आवास", "कुटिया", "बेघर",
        # Telugu
        "ఇల్లు", "గృహం", "గుడిసె", "ఆవాస్", "పక్కా ఇల్లు"
    ],
    "artisan": [
        "artisan", "carpenter", "blacksmith", "tailor", "cobbler", "barber", "potter",
        "mason", "sculptor", "badhai", "lohar", "darzi", "kumbhar", "vishwakarma",
        "kammara", "kummari", "tools", "toolkit",
        # Devanagari Hindi
        "कारीगर", "विश्वकर्मा", "बढ़ई", "लुहार", "दर्जी", "कुम्हार", "मोची", "औजार", "शिल्पकार",
        # Telugu
        "వడ్రంగి", "చేతివృత్తులు", "విశ్వకర్మ", "కమ్మరి", "కుమ్మరి", "దర్జీ", "ఉపకరణాలు"
    ],
    "student": [
        "student", "college", "school", "scholarship", "study", "fees", "degree",
        "education", "padhai", "shiksha", "vidya", "chhatravritti", "10th", "12th",
        "chaduvu", "palli", "kalluri",
        # Devanagari Hindi
        "छात्र", "छात्रा", "पढ़ाई", "छात्रवृत्ति", "स्कूल", "कॉलेज", "फीस", "शिक्षा", "डिग्री",
        # Telugu
        "విద్యార్థి", "చదువు", "స్కాలర్‌షిప్", "కళాశాల", "బడి", "ఫీజు"
    ],
    "business": [
        "business", "shop", "store", "tea stall", "vendor", "retail", "loan",
        "vyapar", "dukaan", "dhandha", "mudra", "karobar", "vyaparam", "kadai",
        # Devanagari Hindi
        "व्यापार", "दुकान", "लोन", "कर्ज", "मुद्रा", "रोजगार", "ठेला",
        # Telugu
        "వ్యాపారం", "దుకాణం", "రుణం", "ముద్రా"
    ],
    "labor": [
        "unemployed", "daily wage", "labor", "worker", "jobless", "majdoor", "mazdoor",
        "rojgar", "kaam", "nrega", "mgnrega", "kooli", "pani", "velai",
        # Devanagari Hindi
        "मजदूर", "मजदूरी", "रोजगार", "काम", "मनरेगा", "बेरोजगार",
        # Telugu
        "కూలీ", "పని", "ఉపాధి", "ఉపాధి హామీ"
    ],
    "gas": [
        "gas", "cylinder", "stove", "cooking", "smoke", "firewood", "chulha",
        "ujjwala", "dhuan", "vantagas",
        # Devanagari Hindi
        "गैस", "सिलेंडर", "चूल्हा", "धुआं", "उज्ज्वला", "लकड़ी",
        # Telugu
        "గ్యాస్", "సిలిండర్", "పొయ్యి"
    ]
}

def extract_entities(text: str) -> Dict[str, Any]:
    """
    Extracts semantic entities and citizen attributes from conversational voice query text.
    
    Args:
        text (str): Voice transcript.
        
    Returns:
        dict: Extracted profile parameters (categories, age, land_acres, is_bpl, gender).
    """
    if not text:
        return {
            "categories": set(),
            "age": None,
            "land_acres": None,
            "is_bpl": False,
            "gender": None
        }

    text_lower = text.lower()
    entities: Dict[str, Any] = {
        "categories": set(),
        "age": None,
        "land_acres": None,
        "is_bpl": False,
        "gender": None
    }

    # Extract categories from multilingual lexicon
    for cat, keywords in INDIC_VOCABULARY.items():
        for kw in keywords:
            if kw in text_lower:
                entities["categories"].add(cat)
                break

    # Age extraction pattern
    age_match = re.search(r'\b(\d{1,2})\s*(?:years?|yrs?|saal|varsha|సంవత్సరాలు)\b', text_lower)
    if age_match:
        try:
            entities["age"] = int(age_match.group(1))
        except ValueError:
            pass

    # Land size pattern (acres / bigha / ekad)
    land_match = re.search(r'\b(\d+(?:\.\d+)?)\s*(?:acres?|acre|bigha|ekad|ఎకరాలు|एकड़)\b', text_lower)
    if land_match:
        try:
            entities["land_acres"] = float(land_match.group(1))
            entities["categories"].add("farmer")
        except ValueError:
            pass

    # BPL / Low Income recognition
    bpl_indicators = [
        "bpl", "poor", "gareeb", "ration card", "yellow card", "white card", "pehchan",
        "गरीब", "राशन कार्ड", "बीपीएल", "పేద", "తెల్ల రేషన్ కార్డు"
    ]
    if any(w in text_lower for w in bpl_indicators):
        entities["is_bpl"] = True

    # Gender cues
    female_cues = [
        "widow", "woman", "mother", "female", "beti", "ladki", "vidhwa", "aurat",
        "विधवा", "महिला", "औरत", "మహిళ", "స్త్రీ"
    ]
    male_cues = [
        "husband", "father", "son", "man", "male", "aadmi", "पुरुष", "మనిషి"
    ]
    if any(w in text_lower for w in female_cues):
        entities["gender"] = "female"
    elif any(w in text_lower for w in male_cues):
        entities["gender"] = "male"

    return entities


# ============================================================
# VOICE LANGUAGE INTENT DETECTION
# Detects phrases like "telugulo cheppu" / "hindi mai batao"
# and returns the requested language code, or None if not found.
# ============================================================

LANGUAGE_INTENT_KEYWORDS = {
    "te": [
        "telugulo", "telugu lo", "telugu లో", "in telugu", "telugu లో చెప్పు",
        "telugu lo cheppu", "telugulo cheppu", "telugu లో చెప్పండి"
    ],
    "hi": [
        "hindi mai", "hindi mein", "hindi me", "हिंदी में", "हिंदी mai",
        "in hindi", "hindi lo", "hindi main batao", "hindi mein batao",
        "hindi mai batao", "हिंदी में बताओ"
    ],
    "ta": [
        "tamil il", "in tamil", "தமிழில்", "தமிழ் இல்", "tamil la",
        "tamizh il", "tamil lo"
    ],
    "en": [
        "in english", "english lo", "english లో", "english mein",
        "english mai", "english में", "tell me in english"
    ]
}


def detect_language_intent(text: str):
    """
    Scans the query for explicit language-switch intent phrases.
    Example: "telugulo cheppu" → returns "te"
             "hindi mai batao" → returns "hi"
    Returns the language code string if found, else None.
    """
    if not text:
        return None
    text_lower = text.lower().strip()
    for lang_code, keywords in LANGUAGE_INTENT_KEYWORDS.items():
        for kw in keywords:
            if kw.lower() in text_lower:
                return lang_code
    return None
