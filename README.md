# Reddit Sentiment Analysis

A full-stack sentiment analysis app that fetches Reddit posts and analyzes them using a custom fine-tuned emotion detection model. Built with React on the frontend and FastAPI on the backend.

**Live demo:** https://valerieliang.github.io/reddit-sentiment-analyzer

---

## What it does

- Fetches posts from any public subreddit or user profile via the Reddit JSON API
- Runs each post through a fine-tuned DistilBERT model trained on the `go_emotions` dataset (28 emotion labels)
- Returns emotion scores, a breakdown chart, and an AI-generated summary of community sentiment
- Four fetch modes: subreddit keyword search, subreddit recent posts, user post history, user comment history

---

## Architecture

```
Browser (GitHub Pages)
  ├── fetches posts directly from Reddit's public JSON API
  └── POSTs post text to HuggingFace Spaces backend
        ├── runs DistilBERT emotion classification
        └── generates summary via Groq (Llama 3) or programmatic fallback
```

| Layer | Technology | Hosting |
|---|---|---|
| Frontend | React + Vite | GitHub Pages |
| Backend | FastAPI + Python | HuggingFace Spaces |
| Sentiment model | DistilBERT fine-tuned on go_emotions | HuggingFace Hub |
| Summary | Groq API (Llama 3 8B) | Groq (free tier) |

---

## Project structure

```
reddit-sentiment-analyzer/
├── src/
│   ├── components/
│   │   ├── SearchForm.jsx        # mode selector + search inputs
│   │   ├── SummaryCard.jsx       # top emotion + stat grid + summary text
│   │   ├── EmotionBars.jsx       # horizontal bar chart of emotion scores
│   │   └── PostCard.jsx          # individual post with emotion badges
│   ├── utils/
│   │   ├── reddit.js             # Reddit public JSON API fetch functions
│   │   ├── api.js                # POST to HuggingFace Spaces backend
│   │   └── sentiment.js          # emotion colors, emoji, stat aggregation
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── backend/
│   ├── app.py                    # FastAPI routes
│   ├── models.py                 # sentiment inference + summary generation
│   ├── requirements.txt
│   ├── Dockerfile
│   └── README.md                 # HuggingFace Spaces config
├── train.py                      # model fine-tuning script (run once)
└── .github/workflows/deploy.yml  # auto-deploy to GitHub Pages on push
```

---

## Model

The sentiment model is a DistilBERT classifier fine-tuned on the [`go_emotions`](https://huggingface.co/datasets/google-research-datasets/go_emotions) dataset — a corpus of ~58,000 Reddit comments labeled across 28 emotion categories.

**Training details:**
- Base model: `distilbert-base-uncased`
- Dataset: `go_emotions` simplified (28 labels, multi-label classification)
- Epochs: 3
- Best eval F1: **0.9700** (epoch 2)
- Loss function: `BCEWithLogitsLoss` (multi-label)

**Emotion labels:**
admiration, amusement, anger, annoyance, approval, caring, confusion, curiosity, desire, disappointment, disapproval, disgust, embarrassment, excitement, fear, gratitude, grief, joy, love, nervousness, optimism, pride, realization, relief, remorse, sadness, surprise, neutral

Model published at: `huggingface.co/valerieliang/reddit-sentiment-model`

---

## Local development

### Prerequisites

- Node.js 18+
- Python 3.11+
- Conda

### Frontend

```bash
# install dependencies
npm install

# run dev server
npm run dev
# → http://localhost:5173/reddit-sentiment-analyzer/

# build for production
npm run build
```

### Backend

```bash
# create and activate conda environment
conda create -n sentiment-analysis python=3.11 -y
conda activate sentiment-analysis

# install dependencies
cd backend
pip install -r requirements.txt

# set environment variable
export GROQ_API_KEY=your_key_here   # Windows: $env:GROQ_API_KEY="your_key_here"

# run server
uvicorn app:app --reload --port 7860
# → http://localhost:7860
# → http://localhost:7860/docs  (interactive API docs)
```

### Retrain the model

```bash
conda activate sentiment-analysis
pip install transformers datasets evaluate accelerate huggingface_hub

# log in to HuggingFace
huggingface-cli login

# edit HF_REPO in train.py to point to your model repo
python train.py
# takes ~2-4 hours on CPU, ~20 min on GPU
```

---

## Deployment

### Frontend → GitHub Pages

Deploys automatically on every push to `main` via GitHub Actions.

To deploy manually:
```bash
npm run deploy
```

### Backend → HuggingFace Spaces

The `backend/` folder is a separate git repo pointed at a HuggingFace Space with Docker SDK.

```bash
cd backend
git remote add origin https://huggingface.co/spaces/valerieliang/reddit-sentiment-backend
git push origin main
```

**Required Space secrets** (Settings → Variables and secrets):
```
GROQ_API_KEY    your Groq API key from console.groq.com
```

---

## API

### `POST /analyze`

Accepts a list of Reddit posts, returns emotion scores and a summary.

**Request:**
```json
{
  "posts": [
    {
      "id": "abc123",
      "title": "Post title here",
      "text": "Post body text",
      "upvotes": 42,
      "author": "username",
      "created": 1234567890,
      "numComments": 5,
      "url": "https://reddit.com/r/..."
    }
  ]
}
```

**Response:**
```json
{
  "posts": [
    {
      "...original fields...",
      "emotions": [
        { "label": "admiration", "score": 0.83 },
        { "label": "joy", "score": 0.61 }
      ]
    }
  ],
  "summary": "Sentiment across 25 posts is largely positive...",
  "postCount": 25
}
```

### `GET /health`

Returns `{"status": "ok"}` — used to check if the Space is awake.

---

## Tech stack

| | |
|---|---|
| Frontend framework | React 18 |
| Build tool | Vite 6 |
| Charts | Recharts |
| Fonts | DM Sans + DM Mono (Google Fonts) |
| Backend framework | FastAPI |
| ML framework | PyTorch + HuggingFace Transformers |
| Summary LLM | Groq (Llama 3 8B) |
| Frontend hosting | GitHub Pages |
| Backend hosting | HuggingFace Spaces (Docker) |
| CI/CD | GitHub Actions |
