"""
VoiceScheme - Eligibility Matching & Scoring Engine
Ranks welfare schemes based on extracted profile attributes and generates spoken responses.
"""

from typing import List, Dict, Any

def match_schemes(all_schemes: List[Dict[str, Any]], entities: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Ranks schemes based on extracted profile entities.
    
    Args:
        all_schemes (list): Complete list of scheme records.
        entities (dict): Extracted citizen profile attributes.
        
    Returns:
        list: Top 3 matched schemes sorted by relevance score.
    """
    scored = []
    user_cats = entities.get("categories", set())
    
    for scheme in all_schemes:
        score = 0
        scheme_tags = set(scheme.get("target_group", []))
        
        # Base intersection match
        matched_tags = user_cats.intersection(scheme_tags)
        score += len(matched_tags) * 3
        
        # Priority context boosts
        if "farmer" in user_cats and scheme["id"] in ["pm_kisan", "pm_fasal_bima"]:
            score += 6
        if "widow" in user_cats and scheme["id"] == "widow_pension":
            score += 8
        if "housing" in user_cats and scheme["id"] == "pm_awas_yojana":
            score += 7
        if "elderly" in user_cats and scheme["id"] == "old_age_pension":
            score += 8
        if "girl_child" in user_cats and scheme["id"] == "sukanya_samriddhi":
            score += 7
        if "student" in user_cats and scheme["id"] == "post_matric_scholarship":
            score += 7
        if "health" in user_cats and scheme["id"] == "ayushman_bharat":
            score += 6
        if "artisan" in user_cats and scheme["id"] == "pm_vishwakarma":
            score += 8
        if "business" in user_cats and scheme["id"] == "pm_mudra_yojana":
            score += 7
        if "labor" in user_cats and scheme["id"] == "mgnrega":
            score += 7
        if "gas" in user_cats and scheme["id"] == "pm_ujjwala":
            score += 7
            
        if score > 0:
            scored.append((score, scheme))
            
    # Sort descending by score
    scored.sort(key=lambda x: x[0], reverse=True)
    
    # Return top 3 matched schemes (or fallback to first 3 if generic)
    if scored:
        return [item[1] for item in scored[:3]]
    else:
        return all_schemes[:3]


def generate_speech_reply(schemes: List[Dict[str, Any]], lang: str = "en") -> str:
    """
    Constructs an empathetic, spoken natural language response.
    
    Args:
        schemes (list): Matched schemes.
        lang (str): Language code ('en', 'hi', 'te', 'ta').
        
    Returns:
        str: Conversational voice response text.
    """
    if not schemes:
        if lang == "hi":
            return "नमस्ते! कृपया अपने काम, परिवार या समस्या के बारे में बताएं, और मैं आपके लिए सरकारी योजनाएं खोजूंगा।"
        elif lang == "te":
            return "నమస్కారం! మీ వృత్తి మరియు కుటుంబ వివరాలు మాట్లాడండి, మీ కోసం ప్రభుత్వ సంక్షేమ పథకాలను వెతుకుతాను."
        elif lang == "ta":
            return "வணக்கம்! உங்கள் தொழில் அல்லது குடும்ப நிலையைப் பற்றி பேசுங்கள், உங்களுக்கான நலத்திட்டங்களை கண்டறிவோம்."
        else:
            return "Namaste! Please speak about your occupation, family, or situation, and I will find the right welfare schemes for you."

    top_scheme = schemes[0]
    num = len(schemes)

    if lang == "hi":
        scheme_name = top_scheme.get("name_hi", top_scheme["name"])
        benefit = top_scheme.get("benefit_hi", top_scheme["benefit"])
        docs = top_scheme.get("required_documents_hi", top_scheme.get("required_documents", []))[:2]
        docs_str = ', '.join(docs) if docs else "आधार कार्ड"
        text = f"नमस्ते! आपके विवरण के अनुसार आप {num} मुख्य सरकारी योजनाओं के पात्र हैं। "
        text += f"सबसे महत्वपूर्ण है {scheme_name}, जिसमें {benefit} "
        text += f"आवेदन के लिए मुख्य रूप से {docs_str} की आवश्यकता होगी। नीचे दिए गए कार्ड्स में पूरा विवरण देखें।"
        return text
        
    elif lang == "te":
        scheme_name = top_scheme.get("name_te", top_scheme["name"])
        benefit = top_scheme.get("benefit_te", top_scheme["benefit"])
        docs = top_scheme.get("required_documents_te", top_scheme.get("required_documents", []))[:2]
        docs_str = ', '.join(docs) if docs else "ఆధార్ కార్డు"
        text = f"నమస్కారం! మీ వివరాల ప్రకారం మీరు {num} ముఖ్యమైన ప్రభుత్వ సంక్షేమ పథకాలకు అర్హులు. "
        text += f"మొదటిది {scheme_name}. ఇందులో {benefit} "
        text += f"దరఖాస్తు చేసుకోవడానికి ముఖ్యంగా {docs_str} అవసరం. పూర్తి వివరాలు క్రింద చూడవచ్చు."
        return text

    elif lang == "ta":
        scheme_name = top_scheme.get("name_ta", top_scheme["name"])
        benefit = top_scheme.get("benefit_ta", top_scheme["benefit"])
        docs = top_scheme.get("required_documents_ta", top_scheme.get("required_documents", []))[:2]
        docs_str = ', '.join(docs) if docs else "ஆதார் அட்டை"
        text = f"வணக்கம்! உங்கள் விவரங்களின்படி நீங்கள் {num} முக்கிய அரசு திட்டங்களுக்கு தகுதியானவர். "
        text += f"முக்கியமானது {scheme_name}. இதில் {benefit} "
        text += f"விண்ணப்பிக்க {docs_str} தேவை. விரிவான விவரங்கள் கீழே உள்ள அட்டையில் உள்ளன."
        return text

    else:
        docs = ', '.join(top_scheme.get('required_documents', ['Aadhaar Card'])[:2])
        text = f"Namaste! Based on what you shared, you qualify for {num} key government welfare schemes. "
        text += f"The primary scheme is {top_scheme['name']}, which provides {top_scheme['benefit']}. "
        text += f"You will need {docs} to apply at your local Gram Panchayat or CSC center."
        return text
