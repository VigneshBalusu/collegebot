import os
import re
import logging
from typing import List, Dict, Set
from rapidfuzz import process, fuzz
from pymongo import MongoClient

# --- Logging ---
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - [RCEBot] - %(message)s'
)

# --- Stop Words ---
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

# --- Abbreviation Mapping ---
ABBREVIATIONS = {
    "md": "managing director",
    "m.d": "managing director",
    "m.e": "mtech",
    "b.e": "btech",
    "b.e.": "btech",
    "b.tech": "btech",
    "m.tech": "mtech",
    "mba": "mba",
    "bba": "bba"
}

class RceSmartBot:

    DIRECT_MATCH_CUTOFF = 90
    SPELLING_CORRECTION_THRESHOLD = 80
    FALLBACK_CUTOFF = 80

    FALLBACK_KEYWORDS = {
        "admission": ["apply", "admissions", "enroll", "entry"],
        "courses": ["course", "program", "degree", "study"],
        "fee": ["fees", "tuition", "cost", "payment"],
        "hostel": ["hostels", "accommodation", "dorm", "residence"],
        "placement": ["placements", "job", "career", "recruitment"],
        "director": ["md", "managing director", "head", "chairman"],
        "buses":["bus","transport","vehicle","daily service"],
        "fest":["fests","kreya","clutural","enojyment"]
    }

    def __init__(self, faqs_data: List[Dict[str, str]]):
        self.faqs = faqs_data
        if not self.faqs:
            logging.warning("No FAQs provided during initialization.")
        self.processed_questions = [self._preprocess_text(f['question']) for f in self.faqs]
        self.faq_vocabulary = self._build_vocab()
        self.faq_keywords = [self._extract_keywords(f"{f['question']} {f['answer']}") for f in self.faqs]

    def _normalize_abbreviations(self, text: str) -> str:
        words = text.lower().split()
        return " ".join(ABBREVIATIONS.get(word.strip("."), word) for word in words)

    def _preprocess_text(self, text: str) -> str:
        text = self._normalize_abbreviations(text)
        text = re.sub(r"[^\w\s]", "", text)
        return text.strip()

    def _build_vocab(self) -> Set[str]:
        all_text = " ".join(f"{f['question']} {f['answer']}" for f in self.faqs)
        return self._extract_keywords(all_text)

    def _extract_keywords(self, text: str) -> Set[str]:
        words = self._preprocess_text(text).split()
        return {w for w in words if w not in STOP_WORDS and w.isalpha() and len(w) > 2}

    def _correct_spelling(self, sentence: str) -> str:
        words = sentence.split()
        corrected = []
        for word in words:
            match, score, _ = process.extractOne(word, self.faq_vocabulary, scorer=fuzz.WRatio)
            corrected.append(match if score >= self.SPELLING_CORRECTION_THRESHOLD else word)
        return " ".join(corrected)

    def get_answer(self, user_question: str) -> Dict[str, any]:
        clean = self._preprocess_text(user_question)
        logging.info(f"Processing question: {user_question}")

        # Layer 1: Direct Match
        match = process.extractOne(clean, self.processed_questions, scorer=fuzz.WRatio, score_cutoff=self.DIRECT_MATCH_CUTOFF)
        if match:
            idx = match[2]
            logging.info(f"Direct match found: {self.faqs[idx]['question']} with score {match[1]}")
            return {"answer": self.faqs[idx]['answer'], "matched_question": self.faqs[idx]['question'], "score": match[1]}

        # Layer 2: Spelling Correction
        logging.info("No direct match found, attempting spelling correction")
        corrected = self._correct_spelling(clean)
        if corrected != clean:
            logging.info(f"Spelling corrected to: {corrected}")
        match = process.extractOne(corrected, self.processed_questions, scorer=fuzz.WRatio, score_cutoff=self.SPELLING_CORRECTION_THRESHOLD)
        if match:
            idx = match[2]
            logging.info(f"Spelling-corrected match found: {self.faqs[idx]['question']} with score {match[1]}")
            return {"answer": self.faqs[idx]['answer'], "matched_question": self.faqs[idx]['question'], "score": match[1]}

        # Layer 3: Fallback Keywords
        logging.info("No spelling-corrected match found, attempting fallback keywords")
        user_keywords = self._extract_keywords(corrected)
        for main_keyword, synonyms in self.FALLBACK_KEYWORDS.items():
            if any(syn in clean for syn in synonyms):
                logging.info(f"Fallback keyword detected: {main_keyword}")
                relevant_questions = [f['question'] for f in self.faqs if any(k in f['question'].lower() for k in [main_keyword] + synonyms)]
                if relevant_questions:
                    match = process.extractOne(clean, relevant_questions, scorer=fuzz.WRatio, score_cutoff=self.FALLBACK_CUTOFF)
                    if match:
                        q = match[0]
                        for faq in self.faqs:
                            if faq['question'].lower() == q.lower():
                                logging.info(f"Fallback match found: {faq['question']} with score {match[1]}")
                                return {"answer": faq['answer'], "matched_question": faq['question'], "score": match[1]}

        # Layer 4: Final fallback
        logging.info("No match found in any layer")
        return {
            "answer": "I'm sorry, I couldn't find a confident answer. Could you try rephrasing?",
            "matched_question": None,
            "score": 0
        }

# --- Database Loader ---
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

# --- Main Entry Point ---
if __name__ == "__main__":
    faqs = load_faqs_from_database()
    bot = RceSmartBot(faqs)

    # Example Test
    test_question = "Tell me about the md"
    result = bot.get_answer(test_question)

    print(f"\nQuestion: {test_question}")
    print(f"Answer: {result['answer']}")
    print(f"Matched Question: {result['matched_question']}")
    print(f"Score: {result['score']}")
