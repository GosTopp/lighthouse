"use client"

import React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"

export function TaggingAssistantContent() {
  return (
    <div className="space-y-6">
      <Card className="shadow-md border-muted">
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl font-bold">Tagging Assistant</CardTitle>
          <CardDescription>
            Intelligent tagging framework and execution workflow for social listening and content analysis
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="structure">Tagging Structure</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="implementation">Implementation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                The Tagging Assistant provides an intelligent tagging framework and execution workflow for social listening and content analysis.
                It combines an extensible tag system with automated tagging logic to support user-generated content classification, emotional signal extraction, and dashboard visualization.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="structure" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tagging System Structure</CardTitle>
              <CardDescription>
                The tagging framework is designed with a three-level hierarchy to support both structured storage and flexible AI-based annotation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-900">
                  <h3 className="text-lg font-medium mb-2">Level 1: Theme (`theme`)</h3>
                  <p className="text-muted-foreground">Represents the high-level category of user feedback.</p>
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">Examples:</p>
                    <ul className="list-disc list-inside ml-2 mt-1 text-sm">
                      <li><code>ux</code></li>
                      <li><code>story</code></li>
                      <li><code>risk</code></li>
                    </ul>
                  </div>
                </div>

                <div className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-900">
                  <h3 className="text-lg font-medium mb-2">Level 2: Tag (`tag`)</h3>
                  <p className="text-muted-foreground">A specific issue or topic under the corresponding theme.</p>
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">Examples:</p>
                    <ul className="list-disc list-inside ml-2 mt-1 text-sm">
                      <li><code>#MatchmakingTime</code></li>
                      <li><code>#OperatorBackground</code></li>
                      <li><code>#QuestBugs</code></li>
                    </ul>
                  </div>
                </div>

                <div className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-900">
                  <h3 className="text-lg font-medium mb-2">Level 3: Metrics (`metrics`)</h3>
                  <p className="text-muted-foreground">Structured attributes that describe the signal strength or emotional tone associated with the tag.</p>
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">Examples:</p>
                    <ul className="list-disc list-inside ml-2 mt-1 text-sm">
                      <li><code>sentiment_score</code>: 0.42</li>
                      <li><code>sentiment_label</code>: "Mixed"</li>
                      <li><code>keywords</code>: ["slow matchmaking", "wait time"]</li>
                      <li><code>engagement_rate</code>: Optional</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-900">
                <h3 className="text-lg font-medium mb-2">Sample Data Structure</h3>
                <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md overflow-auto text-sm">
{`{
  "theme": "ux",
  "tag": "#MatchmakingTime",
  "metrics": {
    "sentiment_score": 0.42,
    "sentiment_label": "Mixed",
    "keywords": ["slow matchmaking", "wait time"]
  }
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Auto Tagging Workflow</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="step1">
                  <AccordionTrigger className="text-lg font-medium">Step 1: Content Selection</AccordionTrigger>
                  <AccordionContent className="prose">
                    <p>Select content to be tagged using filters:</p>
                    <ul className="list-disc pl-6 mt-2">
                      <li>Time Window</li>
                      <li>Theme Category</li>
                      <li>Existing Tags</li>
                      <li>Metrics Criteria (e.g., sentiment &gt; 0.7)</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="step2">
                  <AccordionTrigger className="text-lg font-medium">Step 2: Tag Configuration</AccordionTrigger>
                  <AccordionContent className="prose">
                    <ul className="list-disc pl-6 mt-2">
                      <li>Choose a theme (e.g., ux, story, risk)</li>
                      <li>Define tag name (e.g., <code>#BalanceIssues</code>, <code>#ServerLag</code>)</li>
                      <li>Write tag definition (e.g., "玩家对游戏中存在数值不平衡的反馈…")</li>
                      <li>
                        Configure related metrics:
                        <ul className="list-disc pl-6 mt-2">
                          <li><code>sentiment_score</code></li>
                          <li><code>sentiment_label</code></li>
                          <li><code>keywords</code></li>
                          <li><code>engagement_rate</code></li>
                        </ul>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="step3">
                  <AccordionTrigger className="text-lg font-medium">Step 3: Processing Mode</AccordionTrigger>
                  <AccordionContent className="prose">
                    <ul className="list-disc pl-6 mt-2">
                      <li>Complete Processing – Tag content, update metrics, and refresh insights</li>
                      <li>Tag Only – Only assign tags without recalculating metrics</li>
                      <li>Simulation – Preview tag results without committing changes</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="step4">
                  <AccordionTrigger className="text-lg font-medium">Step 4: Execution Schedule</AccordionTrigger>
                  <AccordionContent className="prose">
                    <ul className="list-disc pl-6 mt-2">
                      <li>
                        Immediate:
                        <ul className="list-disc pl-6 mt-2">
                          <li>One-time execution</li>
                        </ul>
                      </li>
                      <li>
                        Periodic:
                        <ul className="list-disc pl-6 mt-2">
                          <li>Daily / Weekly / Monthly</li>
                        </ul>
                      </li>
                      <li>
                        Trigger-based:
                        <ul className="list-disc pl-6 mt-2">
                          <li>On data update</li>
                          <li>On threshold (e.g., content count reaches a defined level)</li>
                        </ul>
                      </li>
                      <li>
                        Special Period:
                        <ul className="list-disc pl-6 mt-2">
                          <li>During marketing campaigns</li>
                          <li>Post product or game release</li>
                        </ul>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="step5">
                  <AccordionTrigger className="text-lg font-medium">Step 5: Preview and Submit</AccordionTrigger>
                  <AccordionContent className="prose">
                    <ul className="list-disc pl-6 mt-2">
                      <li>Review tag impact and metrics preview</li>
                      <li>Fill in task info and submit tagging job</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="step6">
                  <AccordionTrigger className="text-lg font-medium">Step 6: Task Monitoring</AccordionTrigger>
                  <AccordionContent className="prose">
                    <p>Track job status including:</p>
                    <ul className="list-disc pl-6 mt-2">
                      <li>Task name</li>
                      <li>Submitted by</li>
                      <li>Reviewed by</li>
                      <li>Status (pending, processing, complete)</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="implementation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>PostgreSQL Implementation</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md overflow-auto text-sm">
{`CREATE TABLE tag_insights (
  id SERIAL PRIMARY KEY,
  theme VARCHAR(50) NOT NULL,
  tag VARCHAR(100) NOT NULL,
  metrics JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);`}
              </pre>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Query Example</h3>
                <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md overflow-auto text-sm">
{`SELECT tag, metrics->>'sentiment_score' AS sentiment_score
FROM tag_insights
WHERE theme = 'ux';`}
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dashboard Use Cases</CardTitle>
            </CardHeader>
            <CardContent className="prose">
              <ul className="list-disc pl-6 mt-2">
                <li>Display content by theme tabs (<code>ux</code>, <code>story</code>, <code>risk</code>)</li>
                <li>
                  Each tag card shows:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Tag name (e.g., <code>#MatchmakingTime</code>)</li>
                    <li>Key metrics (e.g., sentiment score)</li>
                    <li>Sample comment or keywords cluster</li>
                  </ul>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Extensions</CardTitle>
            </CardHeader>
            <CardContent className="prose">
              <ul className="list-disc pl-6 mt-2">
                <li>Support for multilingual tagging (e.g., <code>lang: zh</code>, <code>lang: en</code>)</li>
                <li>Time-series trend tracking</li>
                <li>Tag-level influence score per user</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 