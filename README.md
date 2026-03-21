# ⬡ PathForge — AI-Adaptive Onboarding Engine

> An intelligent learning pathway generator that parses a new hire's capabilities and dynamically maps a personalized training roadmap to reach role-specific competency.

![PathForge Banner](https://img.shields.io/badge/PathForge-AI%20Onboarding%20Engine-00D4AA?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![Groq](https://img.shields.io/badge/Groq-LLaMA%203.3-F55036?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Solution Overview](#-solution-overview)
- [Architecture & Workflow](#-architecture--workflow)
- [Tech Stack](#-tech-stack)
- [Skill Gap Analysis Logic](#-skill-gap-analysis-logic)
- [Adaptive Pathing Algorithm](#-adaptive-pathing-algorithm)
- [Dataset & Models](#-datasets--models)
- [Project Structure](#-project-structure)
- [Setup Instructions](#-setup-instructions)
- [Features](#-features)
- [Evaluation Criteria Coverage](#-evaluation-criteria-coverage)

---

## 🎯 Problem Statement

Corporate onboarding often relies on static, one-size-fits-all curricula:

- **Experienced hires** waste time on concepts they already know
- **Beginners** get overwhelmed by advanced modules out of sequence
- **No personalization** means redundant training hours and lower retention

**PathForge** solves this by intelligently parsing a candidate's existing skillset and dynamically generating an optimized, personalized learning pathway — skipping what they know and focusing only on what they need.

---

## 💡 Solution Overview

PathForge is a three-stage AI pipeline:

```
Resume + Job Description
        ↓
  [Stage 1] Skill Extraction
  LLM parses both documents → structured skill lists
        ↓
  [Stage 2] Gap Analysis
  Identifies missing skills + priority ordering
        ↓
  [Stage 3] Adaptive Course Mapping
  Semantic search → Grounded recommendations → Ordered pathway
        ↓
  Personalized Learning Pathway + Impact Metrics + Reasoning Trace
```

### Key Differentiators
- **Zero hallucinations** — every recommended course is validated against the catalog
- **Semantic matching** — uses vector embeddings, not keyword search
- **Full reasoning trace** — every decision is explainable
- **Quantified impact** — shows exact hours saved vs. standard onboarding

---

## 🏗️ Architecture & Workflow

```
┌─────────────────────────────────────────────────────────┐
│                        CLIENT                           │
│  ┌──────────────┐    ┌──────────────────────────────┐  │
│  │  Upload Form │    │  Results Dashboard            │  │
│  │  Resume PDF  │    │  ├─ Skill Gap Chart           │  │
│  │  JD Text/PDF │    │  ├─ Learning Pathway Timeline │  │
│  └──────┬───────┘    │  ├─ Mermaid Roadmap           │  │
│         │            │  ├─ Reasoning Trace           │  │
│         │            │  ├─ Impact Metrics            │  │
│         │            │  └─ PDF Download              │  │
└─────────┼────────────└──────────────────────────────────┘
          │ POST /api/analyze
┌─────────▼────────────────────────────────────────────────┐
│                     SERVER (Next.js API)                  │
│                                                           │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐ │
│  │  parsePDF   │  │ extractSkills│  │recommendCourses │ │
│  │  (pdf-parse)│  │  (Groq LLM)  │  │  (Groq LLM)     │ │
│  └─────────────┘  └──────────────┘  └────────┬────────┘ │
│                                               │          │
│                                    ┌──────────▼────────┐ │
│                                    │  searchCatalog    │ │
│                                    │  (Transformers.js │ │
│                                    │  + Cosine Search) │ │
│                                    └──────────┬────────┘ │
│                                               │          │
│                                    ┌──────────▼────────┐ │
│                                    │ Grounding         │ │
│                                    │ Validator         │ │
│                                    └───────────────────┘ │
└──────────────────────────────────────────────────────────┘
          │
┌─────────▼──────────┐
│    DATA LAYER      │
│  catalog_          │
│  embeddings.json   │
│  (pre-computed     │
│  vector store)     │
└────────────────────┘
```

### Data Flow

1. User uploads **Resume** (PDF or text) + **Job Description** (PDF or text)
2. `parsePDF.ts` extracts raw text from PDF files
3. `extractSkills.ts` sends both to **Groq (LLaMA 3.3-70b)** → returns structured skill gap JSON
4. `searchCatalog.ts` embeds missing skills using **Transformers.js** → cosine similarity search against pre-computed catalog embeddings → top 15 relevant courses
5. `recommendCourses.ts` sends skill gap + relevant courses to **Groq** → ordered pathway with reasoning
6. **Grounding validator** checks every recommended course exists in the catalog
7. `calculateImpact.ts` computes training hours saved vs. standard onboarding
8. Full response returned to client including pathway, trace, grounding stats, and impact metrics

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | Next.js 15 + TypeScript | Full-stack framework |
| **UI** | React + Tailwind CSS | Component rendering |
| **Charts** | Recharts | Skill gap visualization |
| **Diagrams** | Mermaid.js | Learning roadmap flowchart |
| **PDF Export** | html2pdf.js | Downloadable report generation |
| **LLM** | Groq — LLaMA 3.3-70b-versatile | Skill extraction + pathway generation |
| **Embeddings** | Transformers.js (nomic-embed-text-v1) | Local semantic vector search |
| **PDF Parsing** | pdf-parse | Resume PDF text extraction |
| **Vector Search** | In-memory cosine similarity | Catalog matching (no external DB) |

### Why These Choices

- **Groq** — fastest inference available, critical for real-time UX
- **Transformers.js** — runs embeddings locally in Node.js, no external API key needed for judges
- **In-memory cosine similarity** — pre-computed embeddings committed to repo, zero setup for judges
- **Next.js API routes** — single repo, no separate backend needed

---

## 🧠 Skill Gap Analysis Logic

### Extraction Prompt Strategy

The skill extraction uses a structured prompt with explicit output schema enforcement:

```
Resume Text + Job Description Text
            ↓
    LLM Prompt (temp=0.1)
    - Extract resume_skills[]
    - Extract jd_skills[]
    - Compute missing_skills[] = jd_skills - resume_skills
    - Order priority[] by importance/frequency in JD
    - Assess skill_levels{} for each resume skill
    - Generate reasoning paragraph
            ↓
    JSON Validation + Parse
```

**Temperature set to 0.1** — near-deterministic output for consistent, reliable extraction.



---

## 🗺️ Adaptive Pathing Algorithm

### Stage 1 — Semantic Retrieval

```
missing_skills[] → embed with nomic-embed-text-v1
                 → cosine similarity against catalog_embeddings.json
                 → top 15 courses returned
```

Embedding text per course:
```
"Course: {title} Skills: {skills} Level: {level} Prerequisites: {prerequisites}"
```

This ensures semantic matching captures conceptual similarity, not just keyword overlap.

### Stage 2 — LLM Pathway Ordering

The top 15 retrieved courses are sent to the LLM with:
- Missing skills in priority order
- Full course metadata including prerequisites
- Strict instruction to only use provided courses

The LLM orders courses by:
1. **Prerequisite satisfaction** — foundational courses first
2. **Skill priority** — highest priority missing skills addressed early
3. **Level progression** — beginner → intermediate → advanced

### Stage 3 — Grounding Validation

```typescript
// Every recommended course name is checked against catalog
const catalogNames = new Set(loadEmbeddings().map(c => c.course.toLowerCase()));
const validated = pathway.filter(c => catalogNames.has(c.course.toLowerCase()));
```

Any course not found in the catalog is **silently removed** and logged as a hallucination. The grounding score is surfaced to the user.

### Impact Calculation

```typescript
hours_saved = (jd_skills.length × avg_hours) - (missing_skills.length × avg_hours)
efficiency_gain = hours_saved / total_hours × 100
```

Average hours per skill: Beginner=40h, Intermediate=80h, Advanced=120h

---

## 📊 Datasets & Models

### Course Catalog
- **Source:** [Coursera Course Dataset — Kaggle](https://www.kaggle.com/)
- **Enrichment:** Prerequisites and `skill_level_required` fields generated using Gemini 2.0 Flash with structured prompting
- **Processing:** Skills column cleaned (removed curly braces, normalized whitespace), embeddings pre-computed with `nomic-embed-text-v1`
- **Final schema:** `course`, `skills`, `level`, `duration`, `rating`, `certificate_type`, `prerequisites`, `skill_level_required`, `embedding`

### Models Used

| Model | Provider | Usage | License |
|---|---|---|---|
| `llama-3.3-70b-versatile` | Groq / Meta | Skill extraction, pathway generation | Llama 3.3 Community License |
| `nomic-embed-text-v1` | Nomic AI (via Transformers.js) | Course + skill embeddings | Apache 2.0 |

### Validation Metrics

- **Grounding rate:** % of recommended courses found in catalog (shown in UI)
- **Coverage rate:** % of missing skills addressed by pathway
- **Hallucination count:** courses rejected by grounding validator (logged server-side)

---

## 📁 Project Structure

```
PathForge/
├── src/
│   ├── app/
│   │   ├── page.tsx                  # Main page — upload form + results
│   │   ├── globals.css               # Global styles + keyframes
│   │   └── api/
│   │       └── analyze/
│   │           └── route.ts          # POST /api/analyze — main endpoint
│   │
│   ├── components/
│   │   ├── UploadForm.tsx            # Resume + JD upload with PDF/text toggle
│   │   ├── ResultTabs.tsx            # Tab navigation for results
│   │   ├── SkillGapChart.tsx         # Recharts horizontal bar chart
│   │   ├── PathwayTimeline.tsx       # Vertical timeline of course cards
│   │   ├── MermaidRoadmap.tsx        # Mermaid.js flowchart diagram
│   │   ├── TraceAccordion.tsx        # Collapsible reasoning trace
│   │   ├── ImpactMetrics.tsx         # Training hours saved dashboard
│   │   └── DownloadReport.tsx        # PDF report generator
│   │
│   ├── lib/
│   │   ├── groq.ts                   # Groq client (OpenAI-compatible)
│   │   ├── parsePDF.ts               # PDF text extraction
│   │   ├── extractSkills.ts          # LLM skill extraction prompt
│   │   ├── recommendCourses.ts       # LLM pathway generation + grounding
│   │   ├── searchCatalog.ts          # Embedding search + cosine similarity
│   │   └── calculateImpact.ts        # Training impact metrics
│   │
│   ├── hooks/
│   │   └── useAnalyze.ts             # API call logic + state management
│   │
│   ├── types/
│   │   └── index.ts                  # Shared TypeScript interfaces
│   │
│   └── styles/
│       └── tokens.ts                 # Design tokens (colors, fonts, spacing)
│
├── data/
│   ├── coursera_enriched.csv         # Cleaned + enriched course catalog
│   └── catalog_embeddings.json       # Pre-computed embeddings (committed)
│
├── scripts/
│   └── generateEmbeddings.ts         # One-time embedding generation script
│
├── .env.example                      # Environment variable template
├── .env.local                        # Local secrets (not committed)
├── next.config.ts                    # Next.js configuration
├── package.json
└── README.md
```

---

## ⚙️ Setup Instructions

### Prerequisites

- Node.js 18+
- A [Groq API key](https://console.groq.com) (free)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/ai-onboarding.git
cd ai-onboarding

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Add your GROQ_API_KEY to .env.local

# 4. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

> **Note:** `catalog_embeddings.json` is pre-committed to the repository. No embedding generation step is required to run the app.

### Environment Variables

```env
GROQ_API_KEY=your_groq_api_key_here
```

Get your free Groq API key at [console.groq.com](https://console.groq.com)

### Optional: Regenerate Embeddings

If you update the course catalog, regenerate embeddings:

```bash
npx tsx src/scripts/generateEmbeddings.ts
```

---

##  Features

- **Resume parsing** — PDF upload or paste text
- **JD parsing** — PDF upload or paste text
- **Skill gap analysis** — visual bar chart of have vs. missing skills
- **Personalized pathway** — ordered course timeline with prerequisites
- **Mermaid roadmap** — visual flowchart of skill → course → outcome
- **Reasoning trace** — step-by-step accordion explaining every decision
- **Impact metrics** — training hours saved vs. standard onboarding
- **Grounding score** — % of courses validated against catalog
- **PDF export** — downloadable formatted report

---

##  Evaluation Criteria Coverage

| Criteria | Weight | How We Address It |
|---|---|---|
| **Technical Sophistication** | 20% | LLM extraction + semantic vector search + cosine similarity + prerequisite-aware ordering |
| **Grounding & Reliability** | 15% | Every course validated against catalog; hallucination count tracked and displayed |
| **Reasoning Trace** | 10% | 3-step trace (extraction → gap analysis → course matching) with input/output/reasoning |
| **Product Impact** | 10% | Quantified hours saved, efficiency gain %, estimated completion weeks |
| **User Experience** | 15% | Dark dashboard UI, tab navigation, charts, timeline, roadmap, PDF download |
| **Cross-Domain Scalability** | 10% | Semantic embeddings generalize across domains; tested on tech and non-tech roles |
| **Communication & Documentation** | 20% | This README + demo video + 5-slide deck |

---

##  Acknowledgements

- [Groq](https://groq.com) — ultra-fast LLM inference
- [Nomic AI](https://nomic.ai) — open-source embedding model
- [Coursera Dataset — Kaggle](https://www.kaggle.com/) — course catalog data
- [ARTPARK CodeForge Hackathon](https://artpark.in) — challenge organizers
