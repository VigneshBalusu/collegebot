import os
import re
import logging
from typing import List, Dict, Set, Any, Optional
from rapidfuzz import process, fuzz
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

# --- Logging (Kept as is) ---
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - [RCEBot] - %(message)s'
)

# --- All your constants are unchanged ---
STOP_WORDS = {
    'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your',
    'yours', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself',
    'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves',
    'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
    'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if',
    'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with',
    'about', 'against', 'between', 'into', 'through', 'during', 'before',
    'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on',
    'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there',
    'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more',
    'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same',
    'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don',
    'should', 'now', 'tell', 'me'
}
ABBREVIATIONS = {
    "md": "managing director", "m.d": "managing director", "m.e": "mtech",
    "b.e": "btech", "b.e.": "btech", "b.tech": "btech", "m.tech": "mtech",
    "mba": "mba", "bba": "bba"
}
COMMON_MISSPELLINGS: Dict[str, str] = {
    "hte": "the", "teh": "the", "principol": "principal", "princpal": "principal",
    "pricipal": "principal", "priciple": "principal", "pricipol": "principal",
    "trnspotation": "transportation", "transporation": "transportation",
    "trasnport": "transport", "kreay": "kreya"
}
COMMON_FUNCTION_WORDS: Set[str] = {
    "the", "is", "are", "who", "what", "where", "when", "why", "how",
    "of", "in", "on", "to", "for", "and", "or"
}

class RceSmartBot:
    # --- All your thresholds and weights are unchanged ---
    DIRECT_MATCH_CUTOFF = 90
    SPELLING_CORRECTION_THRESHOLD = 80
    FALLBACK_CUTOFF = 80
    CONFIDENCE_THRESHOLD = 82
    SCORE_WEIGHTS = {'WRatio': 0.5, 'TokenSetRatio': 0.5}
    FALLBACK_KEYWORDS = {
        "admission": ["apply", "admissions", "enroll", "entry"],
        "courses": ["course", "program", "degree", "study"],
        "fee": ["fees", "tuition", "cost", "payment"],
        "hostel": ["hostels", "accommodation", "dorm", "residence"],
        "placement": ["placements", "job", "career", "recruitment"],
        "director": ["md", "managing director", "head", "chairman"],
        "buses": [
            "bus", "transport", "transportation", "vehicle", "daily service",
            "college bus", "shuttle", "pickup", "drop", "routes", "stops", "transport facility"
        ],
        "fest": ["fests", "kreya", "clutural", "enojyment", "cultural", "festival", "college fest"],
        "wifi": ["wi-fi", "wi fi", "internet", "wireless", "broadband", "hotspot", "connectivity", "network", "lan"]
    }

    # --- __init__ is unchanged ---
    def __init__(self, faqs_data: List[Dict[str, str]]):
        self.faqs = faqs_data or []
        if not self.faqs:
            logging.warning("No FAQs provided during initialization.")
        self.processed_questions: List[str] = [self._preprocess_text(f['question']) for f in self.faqs]
        self._proc_q_to_indices: Dict[str, List[int]] = {}
        for idx, pq in enumerate(self.processed_questions):
            self._proc_q_to_indices.setdefault(pq, []).append(idx)
        self.faq_vocabulary: Set[str] = self._build_vocab()
        self._faq_vocab_list: List[str] = list(self.faq_vocabulary)

    # --- Preprocessing helpers ---
    def _normalize_abbreviations(self, text: str) -> str:
        words = text.lower().split()
        return " ".join(ABBREVIATIONS.get(word.strip("."), word) for word in words)

    def _preprocess_text(self, text: str) -> str:
        text = self._normalize_abbreviations(text)
        text = re.sub(r"[^\w\s]", "", text)
        text = re.sub(r"\s+", " ", text).strip()
        return text

    # ###############################################################
    # ############## THIS FUNCTION CONTAINS THE FIX #################
    # ###############################################################
    def _build_vocab(self) -> Set[str]:
        all_text = " ".join(f"{f['question']} {f['answer']}" for f in self.faqs)
        # CORRECTED: Was using 'text', now correctly uses 'all_text'
        words = self._preprocess_text(all_text).split()
        return {w for w in words if w not in STOP_WORDS and w.isalpha() and len(w) > 2}

    def _correct_spelling(self, sentence: str) -> str:
        words = sentence.split()
        corrected: List[str] = []
        for word in words:
            lw = word.lower()
            if lw in COMMON_MISSPELLINGS:
                corrected.append(COMMON_MISSPELLINGS[lw])
                continue
            if self._faq_vocab_list:
                match = process.extractOne(lw, self._faq_vocab_list, scorer=fuzz.WRatio)
                if match:
                    cand, score, _ = match
                    if score >= self.SPELLING_CORRECTION_THRESHOLD:
                        corrected.append(cand)
                        continue
            corrected.append(word)
        return " ".join(corrected)

    def _calculate_hybrid_score(self, query: str, choice: str, **kwargs) -> float:
        w_ratio_score = fuzz.WRatio(query, choice)
        token_set_score = fuzz.token_set_ratio(query, choice)
        return (w_ratio_score * self.SCORE_WEIGHTS['WRatio'] + token_set_score * self.SCORE_WEIGHTS['TokenSetRatio'])

    def _indices_for_processed_choice(self, processed_choice: str) -> List[int]:
        return self._proc_q_to_indices.get(processed_choice, [])

    # -------------------------------
    # Main get_answer method with the correct fallback logic
    # -------------------------------
    def get_answer(self, user_question: str) -> Dict[str, Any]:
        if not self.faqs or not self.processed_questions:
            return {"answer": "My knowledge base is currently unavailable.", "matched_question": None, "score": 0}

        clean_query = self._preprocess_text(user_question)
        logging.info(f"Processing question: {user_question}")

        # --- Layer 1: Direct Match ---
        match = process.extractOne(
            clean_query, self.processed_questions, scorer=self._calculate_hybrid_score,
            score_cutoff=self.DIRECT_MATCH_CUTOFF
        )
        if match:
            processed_choice, score, _ = match
            idx = self._indices_for_processed_choice(processed_choice)[0]
            logging.info(f"Direct match found: {self.faqs[idx]['question']} (score={score})")
            return {"answer": self.faqs[idx]['answer'], "matched_question": self.faqs[idx]['question'], "score": score}

        # --- Layer 2: Spelling Correction ---
        logging.info("No direct match; attempting spelling correction.")
        corrected_query = self._correct_spelling(clean_query)
        if corrected_query != clean_query:
            logging.info(f"Spelling corrected: '{clean_query}' -> '{corrected_query}'")

        match = process.extractOne(
            corrected_query, self.processed_questions, scorer=self._calculate_hybrid_score,
            score_cutoff=self.SPELLING_CORRECTION_THRESHOLD
        )
        if match:
            processed_choice, score, _ = match
            idx = self._indices_for_processed_choice(processed_choice)[0]
            logging.info(f"Spelling-corrected match: {self.faqs[idx]['question']} (score={score})")
            return {"answer": self.faqs[idx]['answer'], "matched_question": self.faqs[idx]['question'], "score": score}

        # --- Layer 3: Fallback Keywords (Correct Logic) ---
        logging.info("No spelling-corrected match found, attempting fallback keywords")
        
        triggered_topic_keyword = None
        
        for main_keyword, synonyms in self.FALLBACK_KEYWORDS.items():
            all_terms_to_check = [main_keyword] + synonyms
            for term in all_terms_to_check:
                if fuzz.partial_ratio(term, corrected_query) >= 90:
                    triggered_topic_keyword = main_keyword
                    logging.info(f"Fallback keyword topic triggered: '{triggered_topic_keyword}'")
                    break
            if triggered_topic_keyword:
                break
        
        if triggered_topic_keyword:
            bucket_terms = [triggered_topic_keyword] + self.FALLBACK_KEYWORDS[triggered_topic_keyword]
            
            candidate_indices = []
            for i, pq in enumerate(self.processed_questions):
                for term in bucket_terms:
                    if fuzz.partial_ratio(term, pq) >= 75:
                        candidate_indices.append(i)
                        break
            candidate_indices = sorted(list(set(candidate_indices)))

            if candidate_indices:
                candidate_questions = [self.processed_questions[i] for i in candidate_indices]
                logging.info(f"Found {len(candidate_questions)} candidate questions for topic '{triggered_topic_keyword}'.")

                match = process.extractOne(
                    triggered_topic_keyword,
                    candidate_questions,
                    scorer=fuzz.token_set_ratio,
                    score_cutoff=self.FALLBACK_CUTOFF
                )

                if match:
                    processed_choice, score, _ = match
                    pos = candidate_questions.index(processed_choice)
                    idx = candidate_indices[pos]
                    
                    logging.info(f"Fallback match found: {self.faqs[idx]['question']} (score={score})")
                    return {
                        "answer": self.faqs[idx]['answer'],
                        "matched_question": self.faqs[idx]['question'],
                        "score": score
                    }

        # --- Final Fallback ---
        logging.info("No match found in any layer.")
        return {
            "answer": "I'm sorry, I couldn't find a confident answer. Could you please try rephrasing?",
            "matched_question": None,
            "score": 0
        }

# --- Database Loader (Unchanged) ---
def load_faqs_from_database() -> List[Dict[str, str]]:
    logging.info("🔌 Loading FAQs from MongoDB...")
    MONGO_URI = os.getenv("MONGO_URI")
    if not MONGO_URI:
        logging.error("MONGO_URI not set in environment variables.")
        return []

    try:
        client = MongoClient(MONGO_URI)
        db = client[os.getenv("MONGO_DB_NAME", "rce_faqs_db")]
        collection = db[os.getenv("MONGO_COLLECTION_NAME", "faqs")]
        faqs = list(collection.find({}, {"_id": 0, "question": 1, "answer": 1}))
        logging.info(f"✅ Loaded {len(faqs)} FAQ entries from the database.")
        return faqs
    except Exception as e:
        logging.error(f"❌ Failed to load from MongoDB: {e}", exc_info=True)
        return []