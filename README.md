This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# 社交聆听平台 (Social Listening Platform)

社交聆听平台是一个强大的工具，用于收集、分析和可视化用户生成内容(UGC)，如评论、反馈和社交媒体发帖。该平台使用智能标签系统来组织和分类内容，提取有意义的见解，并支持数据驱动决策。

## 项目架构

本项目基于Next.js构建，采用现代化的前端技术栈，包括：

- **Next.js** - React框架，提供服务端渲染和路由功能
- **TypeScript** - 提供类型安全的JavaScript开发体验
- **Tailwind CSS** - 用于构建响应式UI的实用工具CSS框架
- **Shadcn UI** - 基于Radix UI的组件库，提供高质量的UI组件

## 主要功能模块

项目包含以下主要功能模块：

1. **仪表盘 (Dashboard)** - 提供数据概览和关键指标可视化
2. **自动打标 (Auto Tagging)** - 智能分类和标记用户反馈
3. **数据库 (Data Library)** - 浏览和搜索用户评论及反馈
4. **分析 (Analytics)** - 高级数据分析和趋势识别
5. **洞察 (Insights)** - 提取业务洞察和行动建议
6. **报告 (Reports)** - 生成结构化报告和数据摘要

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

## 自动打标流程 (Auto Tagging Workflow)

自动打标功能支持以下工作流程：

1. **内容选择与筛选**
   - 通过时间窗口、主题类别、现有标签和指标条件筛选内容

2. **标签定义配置**
   - 选择主题类别（如ux, gameplay, story）
   - 标签命名（如#BalanceIssues, #ServerLag）
   - 撰写标签定义
   - 设置相关指标（情感分数、关键词提取等）

3. **处理模式选择**
   - 完整处理 - 对内容进行打标并更新指标
   - 仅标记模式 - 只添加标签而不影响分析指标
   - 模拟预览 - 预览打标效果但不实际应用

4. **执行计划设置**
   - 即时执行（单次）
   - 周期执行（每日/每周/每月）
   - 触发式执行（数据更新触发/阈值触发）
   - 特殊时段执行（营销活动期间/版本更新后）

5. **任务监控**
   - 跟踪任务名称、提交人、审核人和任务状态

## 项目结构

```
social-lens/
├── app/                    # Next.js 应用主目录
│   ├── dashboard/          # 仪表盘页面
│   ├── data-library/       # 数据库页面
│   ├── auto-tagging/       # 自动打标页面
│   ├── analytics/          # 分析页面
│   ├── insight/            # 洞察页面
│   ├── tagging-assistant/  # 标签助手
│   ├── reports/            # 报告页面
│   └── page.tsx            # 首页
├── components/             # 共享UI组件
├── hooks/                  # React Hooks
├── lib/                    # 工具函数和库
├── public/                 # 静态资源
├── scripts/                # 数据处理脚本
│   └── process_comments.py # 评论处理脚本
└── README.md               # 项目文档
```

## 开始使用

首先，安装项目依赖：

```bash
npm install
# 或
yarn 
# 或
pnpm install
```

然后，运行开发服务器：

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
# 或
bun dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 数据库集成

本项目支持与PostgreSQL数据库集成，标签数据通过以下结构存储：

```sql
CREATE TABLE tag_insights (
  id SERIAL PRIMARY KEY,
  theme VARCHAR(50) NOT NULL,
  tag VARCHAR(100) NOT NULL,
  metrics JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 未来扩展

- 支持多语言标签（如 `lang: zh`, `lang: en`）
- 标签时间序列趋势追踪
- 用户级标签影响评分
- 自动标签建议系统

## Learn More

要了解更多关于Next.js的信息，请查看以下资源：

- [Next.js文档](https://nextjs.org/docs) - 了解Next.js功能和API。
- [学习Next.js](https://nextjs.org/learn) - 交互式Next.js教程。

您可以查看[Next.js GitHub存储库](https://github.com/vercel/next.js) - 欢迎您的反馈和贡献！

## 部署

部署Next.js应用的最简单方法是使用[Vercel平台](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)。

查看[Next.js部署文档](https://nextjs.org/docs/app/building-your-application/deploying)了解更多细节。
