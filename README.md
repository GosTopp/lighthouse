This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# 社交聆听平台 (Social Listening Platform)

## 标签层级结构 (Tagging Hierarchy)

本项目实现了一个三层标签结构来组织用户评论数据：

1. **主题 (Theme)**: 反馈的高级分类
   - 例如：ux, story, risk

2. **标签 (Tag)**: 每个主题下的具体话题或问题
   - 例如：#MatchmakingTime, #OperatorBackground, #QuestBugs

3. **指标 (Metrics)**: 描述标签情感和分析属性的结构化数据
   - 情感得分 (sentiment_score): 0.42
   - 情感标签 (sentiment_label): "Mixed"
   - 关键词 (keywords): ["slow matchmaking", "wait time"]
   - 参与率 (engagement_rate): 0.13 (可选)

### 数据处理

我们使用 Python 脚本 `scripts/process_comments.py` 将原始评论数据重构为符合标签层级的结构。

#### 原始数据结构:
```json
"tag_details": {
  "ux": [
    {
      "tag_name": "#HitRegistration",
      "sentiment_score": 0.4,
      "sentiment_label": "Mixed",
      "keywords": ["命中注册", "不准确", "偶尔"]
    }
  ]
}
```

#### 重构后的数据结构:
```json
"tag_details": [
  {
    "theme": "ux",
    "tags": [
      {
        "name": "#HitRegistration", 
        "metrics": {
          "sentiment_score": 0.4,
          "sentiment_label": "Mixed",
          "keywords": ["命中注册", "不准确", "偶尔"]
        }
      }
    ]
  }
]
```

要处理数据，请运行:
```bash
python scripts/process_comments.py
```

处理后的数据将保存到 `public/comments_restructured.json`。

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
