from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from fastapi.responses import JSONResponse
import logging

app = FastAPI()

# -----------------------------
# CORS
# -----------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)

# -----------------------------
# Request Schemas
# -----------------------------

class AIRequest(BaseModel):
    ngo_name: str
    location: str
    report_text: str
    people_affected: int


class Volunteer(BaseModel):
    name: str
    skills: List[str]
    location: str


class Report(BaseModel):
    id: int
    category: str
    urgency: str
    location: str


class MatchRequest(BaseModel):
    volunteer: Volunteer
    reports: List[Report]


# =========================================================
# ML MODULES
# =========================================================

# -----------------------------
# CATEGORY CLASSIFIER
# -----------------------------

def classify_category(text: str):

    text = text.lower()

    if "flood" in text or "earthquake" in text or "cyclone" in text:
        return "disaster"

    if "medical" in text or "injury" in text or "hospital" in text:
        return "health"

    if "food" in text or "hunger" in text:
        return "food_supply"

    return "general"


# -----------------------------
# URGENCY DETECTOR
# -----------------------------

def detect_urgency(text: str, people: int):

    text = text.lower()

    if "urgent" in text or people > 100:
        return "high"

    if people > 30:
        return "medium"

    return "low"


# -----------------------------
# NEED PREDICTION
# -----------------------------

def predict_needs(text: str):

    text = text.lower()

    resource_keywords = {
        "food": ["food", "hunger", "ration"],
        "water": ["water", "drinking water", "clean water"],
        "medicine": ["medicine", "medical", "doctor"],
        "shelter": ["shelter", "housing", "homeless"],
        "rescue": ["rescue", "trapped", "evacuate"],
        "clothing": ["clothes", "blanket"],
        "transport": ["transport", "vehicle"]
    }

    resources = []

    for resource, keywords in resource_keywords.items():

        for keyword in keywords:

            if keyword in text:
                resources.append(resource)
                break

    if not resources:
        resources.append("support")

    return resources


# -----------------------------
# SUMMARY GENERATOR
# -----------------------------

def generate_summary(text: str):

    if len(text) <= 120:
        return text

    return text[:120] + "..."


# -----------------------------
# PRIORITY RANKING
# -----------------------------

def compute_priority(urgency, people, category, text):

    urgency_score = {
        "low": 0.3,
        "medium": 0.6,
        "high": 1.0
    }[urgency]

    people_score = min(people / 200, 1)

    category_weight = {
        "disaster": 1.0,
        "health": 0.8,
        "food_supply": 0.6,
        "general": 0.4
    }[category]

    need_intensity = 1 if "urgent" in text.lower() else 0.5

    priority = (
        0.4 * urgency_score +
        0.3 * people_score +
        0.2 * category_weight +
        0.1 * need_intensity
    )

    return round(min(priority, 1), 2)


# =========================================================
# AI AGENT PIPELINE
# =========================================================

def ai_agent_pipeline(req: AIRequest):

    category = classify_category(req.report_text)

    urgency = detect_urgency(
        req.report_text,
        req.people_affected
    )

    resources = predict_needs(req.report_text)

    summary = generate_summary(req.report_text)

    priority = compute_priority(
        urgency,
        req.people_affected,
        category,
        req.report_text
    )

    return {
        "urgency": urgency,
        "category": category,
        "summary": summary,
        "needed_resources": resources,
        "priority_score": priority
    }


# =========================================================
# VOLUNTEER MATCHING
# =========================================================

def skill_overlap(volunteer_skills, report_category):

    for skill in volunteer_skills:
        if skill.lower() in report_category.lower():
            return 1

    return 0.3


def location_match(vol_loc, rep_loc):

    if vol_loc.lower() == rep_loc.lower():
        return 1

    return 0.5


def compute_match(volunteer, report):

    skill_score = skill_overlap(
        volunteer.skills,
        report.category
    )

    location_score = location_match(
        volunteer.location,
        report.location
    )

    urgency_weight = {
        "low": 0.3,
        "medium": 0.6,
        "high": 1.0
    }[report.urgency]

    score = (
        0.5 * skill_score +
        0.3 * location_score +
        0.2 * urgency_weight
    )

    return min(round(score, 2), 1.0)


# =========================================================
# API ENDPOINTS
# =========================================================

@app.get("/health")
def health():

    return {"status": "ok"}


@app.post("/ai-agent")
def ai_agent(req: AIRequest):

    try:

        result = ai_agent_pipeline(req)

        return {
            "final_result": result
        }

    except Exception as e:

        return JSONResponse(
            status_code=500,
            content={
                "error": True,
                "message": str(e)
            }
        )


@app.post("/match-volunteers")
def match_volunteers(req: MatchRequest):

    try:

        matches = []

        for report in req.reports:

            score = compute_match(
                req.volunteer,
                report
            )

            matches.append({
                "report_id": report.id,
                "score": score,
                "reason": "Skill + location + urgency match"
            })

        matches.sort(
            key=lambda x: x["score"],
            reverse=True
        )

        return {
            "matches": matches
        }

    except Exception as e:

        return JSONResponse(
            status_code=500,
            content={
                "error": True,
                "message": str(e)
            }
        )
