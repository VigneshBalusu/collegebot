from src.ai.embedding_engine import find_best_match
import traceback

def process_question(question_text):
    try:
        return find_best_match(question_text)
    except Exception as e:
        traceback.print_exc()
        return {
            "error": "Something went wrong in FAQ processing",
            "details": str(e)
        }
