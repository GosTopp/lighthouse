## Sidebar
- Workspace
  - Dashboard
  - Auto Tagging
    - Tagging Hierarchy:
        - Level 1: Theme
          description: High-level category of feedback.
          examples: [ux, story, risk]

        - Level 2: Tag
          description: Specific topic or issue under each theme.
          examples: ["#MatchmakingTime", "#OperatorBackground", "#QuestBugs"]

        - Level 3: Metrics
          description: Structured attributes describing the tag's emotional and analytical properties.
          examples:
            - sentiment_score: 0.42
            - sentiment_label: "Mixed"
            - keywords: ["slow matchmaking", "wait time"]
            - engagement_rate: 0.13  # optional
    - 自动打标流程 (Auto Tagging Workflow)
      - Step 1: 内容选择与筛选 (Content Selection)
        - 通过多维度筛选器确定打标范围：
          - 时间窗口 (Time Window)
          - 主题类别 (Theme) 
          - 现有标签 (Existing Tags)
          - 指标条件 (Metrics Criteria)

      - Step 2: 标签定义配置 (Tag Configuration)
        - 选择主题类别 (Theme Selection)，例如：ux, gameplay, story
        - 标签命名 (Tag Naming)，例如：#BalanceIssues, #ServerLag
        - 标签定义撰写 (Tag Definition)，例如：
          "指玩家对游戏中存在数值或机制不平衡的反馈，常集中在某些角色、武器、技能或战斗机制过强或过弱，影响了整体游戏体验与公平性。该标签下的评论通常伴随'强弱不均'、'破坏公平'、'玩法固定化'等关键词，反映出玩家对当前版本平衡性的担忧或不满。"
        - 关联指标设置 (Metrics Configuration)：
          - 情感分数 (sentiment_score)
          - 情感标签 (sentiment_label)
          - 关键词提取 (keywords)
          - 互动率分析 (engagement_rate)

      - Step 3: 处理模式选择 (Processing Mode)
        - 完整处理 (Complete Processing) - 对内容进行打标，更新数据库，并刷新关联指标和分析结果
        - 仅标记模式 (Tag Only) - 仅添加标签标记，不影响现有分析指标
        - 模拟预览 (Simulation) - 预览打标效果但不实际应用，用于验证标签准确性

      - Step 4: 执行计划设置 (Execution Schedule)
        - 即时执行 (Immediate)
          - 单次执行 (One-time) - 立即处理一次后完成
        - 周期执行 (Periodic)
          - 每日更新 (Daily)
          - 每周更新 (Weekly)
          - 每月更新 (Monthly)
        - 触发式执行 (Trigger-based)
          - 数据更新触发 (On Data Update)
          - 阈值触发 (On Threshold) - 当相关内容量达到设定值时
        - 特殊时段执行 (Special Period)
          - 营销活动期间 (Campaign Period)
          - 游戏版本更新后 (Post-Release Period)
        - Step 5: 生成打标预览，填写任务信息，提交任务
        - Step 6: 显示任务状态：包含任务名称、提交人、审核人、任务状态等。

  - Analytics
  - Insight
- Documents
  - Data Library
    - 简介：用户评论显示
    - 功能：通过时间、游戏、平台、标签进行筛选，也可以通过搜索获得相关评论
    - 样式：用户评论以卡片的形式展现，可以点开查看完整内容
    - UI/UX:参考 shadcn ui 
  - Reports
  - Tagging Assistant   