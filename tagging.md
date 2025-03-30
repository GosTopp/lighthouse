# Tagging System Specification for Social Listening Dashboard

## Overview
This document outlines the design and structure of the **Tagging System** used in the Social Listening Dashboard. The system enables structured classification, analysis, and visualization of user-generated content (UGC) such as reviews and social media posts.

## Purpose
The goal of this system is to:
- Provide a **multi-level tag architecture** for classifying user feedback.
- Support both **fixed** and **flexible** tagging attributes for AI auto-tagging.
- Enable structured storage, querying, and visualization in PostgreSQL and frontend dashboards.

## Tagging Structure
The tagging system is organized into a **three-level hierarchy**:

### Level 1: Theme (`theme`)
Represents the high-level category or theme of feedback.

- Example Values (enumeration):
  - `ux` – User Experience
  - `story` – Narrative and Lore
  - `risk` – Negative signals or product issues

### Level 2: Tag (`tag`)
Represents a specific topic or sub-theme under each theme.

- Example:
  - `#MatchmakingTime`
  - `#OperatorBackground`
  - `#QuestBugs`

### Level 3: Metrics (`metrics`)
A flexible collection of structured metadata describing the tag's signal strength, relevance, and emotional weight.

- Example fields (stored as JSONB in PostgreSQL):
  - `sentiment_score`: Numeric value between 0–1
  - `sentiment_label`: Enum (`Positive`, `Negative`, `Mixed`)
  - `keywords`: Array of extracted keywords
  - `engagement_rate`: Optional engagement metric

### Sample Data Structure
```json
{
  "theme": "ux",
  "tag": "#MatchmakingTime",
  "metrics": {
    "sentiment_score": 0.42,
    "sentiment_label": "Mixed",
    "keywords": ["slow matchmaking", "wait time"]
  }
}
```

## Database Implementation (PostgreSQL)

```sql
CREATE TABLE tag_insights (
  id SERIAL PRIMARY KEY,
  theme VARCHAR(50) NOT NULL,
  tag VARCHAR(100) NOT NULL,
  metrics JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Example Insert
```sql
INSERT INTO tag_insights (theme, tag, metrics) VALUES (
  'ux',
  '#MatchmakingTime',
  '{
    "sentiment_score": 0.42,
    "sentiment_label": "Mixed",
    "keywords": ["slow matchmaking", "wait time"]
  }'::jsonb
);
```

### Query Example
```sql
SELECT tag, metrics->>'sentiment_score' AS sentiment_score
FROM tag_insights
WHERE theme = 'ux';
```

## Indexing and Optimization
To support fast querying:
```sql
CREATE INDEX idx_sentiment_score ON tag_insights ((metrics->>'sentiment_score'));
```

## Use in Dashboard
- Display by theme tabs: `ux`, `story`, `risk`
- Each tag card shows:
  - Tag (e.g., #MatchmakingTime)
  - Key metrics (sentiment score)
  - One representative comment or keyword cluster

## Future Extension
- Support language-specific tags (e.g., `lang: zh`, `lang: en`)
- Time series tracking per tag
- User-level tag influence scoring

---
This tagging system enables scalable and insightful social data monitoring and supports real-time dashboard analytics.

