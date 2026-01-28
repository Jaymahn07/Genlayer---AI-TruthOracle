# v0.1.0
# { "Depends": "py-genlayer:latest" }

from genlayer import *
import json


class AITruthOracle(gl.Contract):
    """
    Minimal AI Truth Oracle
    - ask_question()        -> WRITE
    - get_answer()          -> VIEW
    - get_recent_questions  -> VIEW
    - get_total_questions   -> VIEW
    """

    questions: TreeMap[u256, str]
    answers: TreeMap[u256, str]
    answered: TreeMap[u256, bool]

    question_counter: u256

    def __init__(self):
        self.question_counter = u256(0)

    # ─────────────────────────────────────────────
    # WRITE: Ask a question
    # ─────────────────────────────────────────────
    @gl.public.write
    def ask_question(self, question: str):
        self.question_counter += u256(1)
        qid = self.question_counter

        self.questions[qid] = question
        self.answered[qid] = False

        prompt = f"""
You are a fact-checking oracle.

Question:
{question}

Answer ONLY with valid JSON:
{{
  "answer": "yes" | "no" | "unknown",
  "reason": "short explanation"
}}
"""

        def judge():
            return gl.nondet.exec_prompt(prompt).strip()

        result = gl.eq_principle.prompt_comparative(
            judge,
            'answer must be "yes", "no", or "unknown"'
        )

        try:
            parsed = json.loads(result)
            answer = parsed.get("answer", "unknown")
        except:
            answer = "unknown"

        if answer not in ["yes", "no", "unknown"]:
            answer = "unknown"

        self.answers[qid] = answer
        self.answered[qid] = True

        return {
            "success": True,
            "question_id": qid,
            "answer": answer
        }

    # ─────────────────────────────────────────────
    # VIEW: Get single answer
    # ─────────────────────────────────────────────
    @gl.public.view
    def get_answer(self, question_id: int):
        qid = u256(question_id)

        if not self.questions.get(qid):
            return {"success": False, "error": "Question not found"}

        return {
            "success": True,
            "question": self.questions[qid],
            "answered": self.answered.get(qid, False),
            "answer": self.answers.get(qid, "pending")
        }

    # ─────────────────────────────────────────────
    # VIEW: Total questions
    # ─────────────────────────────────────────────
    @gl.public.view
    def get_total_questions(self):
        return {
            "success": True,
            "total": self.question_counter
        }

    # ─────────────────────────────────────────────
    # VIEW: Recent questions
    # ─────────────────────────────────────────────
    @gl.public.view
    def get_recent_questions(self, count: int):
        if count <= 0:
            return {"success": True, "questions": []}

        total = int(self.question_counter)
        n = min(count, total)

        results = []
        i = total
        fetched = 0

        while i > 0 and fetched < n:
            qid = u256(i)
            question = self.questions.get(qid)
            if question:
                results.append({
                    "question_id": qid,
                    "question": question,
                    "answered": self.answered.get(qid, False),
                    "answer": self.answers.get(qid, "pending")
                })
                fetched += 1
            i -= 1

        return {
            "success": True,
            "count": fetched,
            "questions": results
        }
