# v0.1.0
# { "Depends": "py-genlayer:latest" }

from genlayer import *
import json


class AITruthOracle(gl.Contract):
    """
    Testnet-safe AI Truth Oracle

    FLOW:
    1. ask_question(question)        -> WRITE (stores question)
    2. resolve_question(question_id) -> WRITE (AI runs here)
    3. get_answer(question_id)       -> VIEW
    4. get_recent_questions(count)   -> VIEW
    5. get_total_questions()         -> VIEW
    """

    # ─────────────────────────────────────────────
    # Storage
    # ─────────────────────────────────────────────
    questions: TreeMap[u256, str]
    answers: TreeMap[u256, str]
    resolved: TreeMap[u256, bool]

    question_counter: u256

    # ─────────────────────────────────────────────
    # Init (ONLY primitives)
    # ─────────────────────────────────────────────
    def __init__(self):
        self.question_counter = u256(0)

    # ─────────────────────────────────────────────
    # WRITE: Ask question (NO AI)
    # ─────────────────────────────────────────────
    @gl.public.write
    def ask_question(self, question: str):
        self.question_counter += u256(1)
        qid = self.question_counter

        self.questions[qid] = question
        self.resolved[qid] = False

        return {
            "success": True,
            "question_id": qid
        }

    # ─────────────────────────────────────────────
    # WRITE: Resolve question (AI HERE)
    # ─────────────────────────────────────────────
    @gl.public.write
    def resolve_question(self, question_id: int):
        qid = u256(question_id)

        question = self.questions.get(qid)
        if question is None:
            return {"success": False, "error": "Question not found"}

        if self.resolved.get(qid, False):
            return {"success": False, "error": "Already resolved"}

        prompt = f"""
You are a factual oracle.

Question:
{question}

Respond with JSON only:
{{
  "answer": "string",
  "confidence": "low" | "medium" | "high"
}}
"""

        def judge():
            return gl.nondet.exec_prompt(prompt).strip()

        result = gl.eq_principle.prompt_comparative(
            judge,
            'must be valid JSON with keys "answer" and "confidence"'
        )

        try:
            answer = json.dumps(json.loads(result))
        except:
            answer = json.dumps({
                "answer": "Unable to determine",
                "confidence": "low"
            })

        self.answers[qid] = answer
        self.resolved[qid] = True

        return {
            "success": True,
            "question_id": qid
        }

    # ─────────────────────────────────────────────
    # VIEW: Get answer
    # ─────────────────────────────────────────────
    @gl.public.view
    def get_answer(self, question_id: int):
        qid = u256(question_id)

        if not self.questions.get(qid):
            return {"success": False, "error": "Question not found"}

        return {
            "success": True,
            "question": self.questions[qid],
            "resolved": self.resolved.get(qid, False),
            "answer": self.answers.get(qid, "pending")
        }

    # ─────────────────────────────────────────────
    # VIEW: Total questions
    # ─────────────────────────────────────────────
    @gl.public.view
    def get_total_questions(self):
        return int(self.question_counter)

    # ─────────────────────────────────────────────
    # VIEW: Recent questions
    # ─────────────────────────────────────────────
    @gl.public.view
    def get_recent_questions(self, count: int):
        total = int(self.question_counter)
        n = min(count, total)

        results = []
        i = total

        while i > 0 and len(results) < n:
            qid = u256(i)
            q = self.questions.get(qid)
            if q:
                results.append({
                    "question_id": i,
                    "question": q,
                    "resolved": self.resolved.get(qid, False),
                    "answer": self.answers.get(qid, "pending")
                })
            i -= 1

        return results
