# Tagging Assistant – README

## Overview
The Tagging Assistant provides an intelligent tagging framework and execution workflow for social listening and content analysis. It combines an extensible tag system with automated tagging logic to support user-generated content classification, emotional signal extraction, and dashboard visualization.

## Tagging System Structure
The tagging framework is designed with a **three-level hierarchy** to support both structured storage and flexible AI-based annotation.

### Level 1: Theme (`theme`)
Represents the high-level category of user feedback.
- Examples: `ux`, `story`, `risk`

### Level 2: Tag (`tag`)
A specific issue or topic under the corresponding theme.
- Examples: `#MatchmakingTime`, `#OperatorBackground`, `#QuestBugs`

### Level 3: Metrics (`metrics`)
Structured attributes that describe the signal strength or emotional tone associated with the tag.
- Examples:
  - `sentiment_score`: 0.42
  - `sentiment_label`: "Mixed"
  - `keywords`: ["slow matchmaking", "wait time"]
  - `engagement_rate`: Optional

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

## Auto Tagging Workflow

### Step 1: Content Selection
Select content to be tagged using filters:
- Time Window
- Theme Category
- Existing Tags
- Metrics Criteria (e.g., sentiment > 0.7)

### Step 2: Tag Configuration
- Choose a theme (e.g., ux, story, risk)
- Define tag name (e.g., `#BalanceIssues`, `#ServerLag`)
- Write tag definition (e.g., "玩家对游戏中存在数值不平衡的反馈…")
- Configure related metrics:
  - `sentiment_score`
  - `sentiment_label`
  - `keywords`
  - `engagement_rate`

### Step 3: Processing Mode
- Complete Processing – Tag content, update metrics, and refresh insights
- Tag Only – Only assign tags without recalculating metrics
- Simulation – Preview tag results without committing changes

### Step 4: Execution Schedule
- Immediate:
  - One-time execution
- Periodic:
  - Daily / Weekly / Monthly
- Trigger-based:
  - On data update
  - On threshold (e.g., content count reaches a defined level)
- Special Period:
  - During marketing campaigns
  - Post product or game release

### Step 5: Preview and Submit
- Review tag impact and metrics preview
- Fill in task info and submit tagging job

### Step 6: Task Monitoring
Track job status including:
- Task name
- Submitted by
- Reviewed by
- Status (pending, processing, complete)

## PostgreSQL Implementation
```sql
CREATE TABLE tag_insights (
  id SERIAL PRIMARY KEY,
  theme VARCHAR(50) NOT NULL,
  tag VARCHAR(100) NOT NULL,
  metrics JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Query Example
```sql
SELECT tag, metrics->>'sentiment_score' AS sentiment_score
FROM tag_insights
WHERE theme = 'ux';
```

## Dashboard Use Cases
- Display content by theme tabs (`ux`, `story`, `risk`)
- Each tag card shows:
  - Tag name (e.g., `#MatchmakingTime`)
  - Key metrics (e.g., sentiment score)
  - Sample comment or keywords cluster

## Extensions
- Support for multilingual tagging (e.g., `lang: zh`, `lang: en`)
- Time-series trend tracking
- Tag-level influence score per user

---
This Tagging Assistant supports automated, scalable, and structured user feedback tagging, and enables deep insight generation for social listening and content analytics.

