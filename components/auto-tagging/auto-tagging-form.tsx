"use client"

import { useState } from "react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Check, AlertCircle, X } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

// Theme options
const themeOptions = [
  { value: "ux", label: "User Experience (UX)" },
  { value: "gameplay", label: "Gameplay" },
  { value: "story", label: "Story & Narrative" },
  { value: "risk", label: "Risk Issues" },
]

// Existing tags options for filtering
const existingTagOptions = [
  { value: "balanceIssues", label: "#BalanceIssues" },
  { value: "matchmakingTime", label: "#MatchmakingTime" },
  { value: "serverLag", label: "#ServerLag" },
  { value: "operatorBackground", label: "#OperatorBackground" },
  { value: "questBugs", label: "#QuestBugs" },
]

// Metrics options
const metricsOptions = [
  { value: "sentiment_score", label: "Sentiment Score", type: "number" },
  { value: "sentiment_label", label: "Sentiment Label", type: "select", options: ["Positive", "Neutral", "Negative"] },
  { value: "keywords", label: "Keywords", type: "text" },
  { value: "engagement_rate", label: "Engagement Rate", type: "number" },
]

// 比较运算符选项
const operatorOptions = {
  number: [
    { value: "gt", label: ">" },
    { value: "gte", label: ">=" },
    { value: "lt", label: "<" },
    { value: "lte", label: "<=" },
    { value: "eq", label: "=" },
    { value: "neq", label: "!=" }
  ],
  text: [
    { value: "contains", label: "contains" },
    { value: "not_contains", label: "does not contain" },
    { value: "starts_with", label: "starts with" },
    { value: "ends_with", label: "ends with" },
    { value: "equals", label: "equals" }
  ],
  select: [
    { value: "eq", label: "is" },
    { value: "neq", label: "is not" }
  ]
}

// Form state type definition
interface FormState {
  selection: {
    timeWindow: { start: string; end: string };
    theme: string;
    existingTags: string[];
    metricsConditions: {
      id: string;
      metricName: string;
      metricId: string;
      operator: string;
      value: string;
      display: string;
    }[];
  };
  tagConfig: {
    theme: string;
    tagName: string;
    tagDefinition: string;
    metrics: string[];
  };
  processingMode: string;
  schedule: {
    type: string;
    periodic: {
      frequency: string;
    };
    trigger: {
      type: string;
    };
    special: {
      type: string;
    };
  };
}

export function AutoTaggingForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [taskName, setTaskName] = useState("")
  const [submitter, setSubmitter] = useState("")
  const [formState, setFormState] = useState<FormState>({
    // Step 1: Content Selection
    selection: {
      timeWindow: { start: "", end: "" },
      theme: "",
      existingTags: [],
      metricsConditions: []
    },
    // Step 2: Tag Configuration
    tagConfig: {
      theme: "",
      tagName: "#BalanceIssues",
      tagDefinition: "Refers to user feedback that highlights perceived imbalances in the game's mechanics, characters, weapons, or systems.\nThese comments often express frustration over unfair advantages, overpowered elements, or broken gameplay loops.",
      metrics: []
    },
    // Step 3: Processing Mode
    processingMode: "complete", // complete, tagOnly, simulation
    // Step 4: Execution Schedule
    schedule: {
      type: "immediate", // immediate, periodic, trigger, special
      periodic: {
        frequency: "daily" // daily, weekly, monthly
      },
      trigger: {
        type: "dataUpdate" // dataUpdate, threshold
      },
      special: {
        type: "campaign" // campaign, postRelease
      }
    }
  })

  // 当前正在编辑的指标条件
  const [currentMetric, setCurrentMetric] = useState<string>("")
  const [currentOperator, setCurrentOperator] = useState<string>("")
  const [currentValue, setCurrentValue] = useState<string>("")

  // 根据表单状态确定是否选择了"All Time"
  const isAllTime = !formState.selection.timeWindow.start && !formState.selection.timeWindow.end;

  // 处理"All Time"切换
  const handleAllTimeToggle = (checked: boolean) => {
    if (checked) {
      // 选择"All Time"时清空日期
      updateFormState('selection', 'timeWindow', { start: "", end: "" });
    } else if (isAllTime) {
      // 当从"All Time"切换到自定义时间范围时，设置默认的时间范围
      const today = new Date();
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(today.getMonth() - 1);
      
      updateFormState('selection', 'timeWindow', { 
        start: oneMonthAgo.toISOString().split('T')[0], 
        end: today.toISOString().split('T')[0] 
      });
    }
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    // Call API to submit the task
    toast.success("Task created successfully!", {
      description: `${taskName} has been submitted for approval.`,
    })
    
    // Reset the form
    setCurrentStep(1)
    setTaskName("")
    setSubmitter("")
    setFormState({
      selection: {
        timeWindow: { start: "", end: "" },
        theme: "",
        existingTags: [],
        metricsConditions: []
      },
      tagConfig: {
        theme: "",
        tagName: "#BalanceIssues",
        tagDefinition: "Refers to user feedback that highlights perceived imbalances in the game's mechanics, characters, weapons, or systems.\nThese comments often express frustration over unfair advantages, overpowered elements, or broken gameplay loops.",
        metrics: []
      },
      processingMode: "complete",
      schedule: {
        type: "immediate",
        periodic: {
          frequency: "daily"
        },
        trigger: {
          type: "dataUpdate"
        },
        special: {
          type: "campaign"
        }
      }
    })
  }

  // Helper function to update form state
  const updateFormState = (section: keyof FormState, field: string, value: any) => {
    setFormState(prev => ({
      ...prev,
      [section]: typeof prev[section] === 'object' && !Array.isArray(prev[section])
        ? { ...prev[section] as object, [field]: value }
        : value
    }))
  }

  // Add tag to selection
  const addTag = (tag: string) => {
    if (!formState.selection.existingTags.includes(tag)) {
      updateFormState('selection', 'existingTags', [...formState.selection.existingTags, tag])
    }
  }

  // Remove tag from selection
  const removeTag = (tag: string) => {
    updateFormState('selection', 'existingTags', formState.selection.existingTags.filter(t => t !== tag))
  }

  // 添加度量条件
  const addMetricCondition = () => {
    if (!currentMetric || !currentOperator || (!currentValue && currentValue !== "0")) {
      toast.error("Please select a metric, operator, and value");
      return;
    }

    // 找到当前选择的度量
    const selectedMetric = metricsOptions.find(m => m.value === currentMetric);
    if (!selectedMetric) return;

    // 创建新的条件对象
    const newCondition = {
      id: `condition-${Date.now()}`, // 唯一ID
      metricName: selectedMetric.label,
      metricId: currentMetric,
      operator: currentOperator,
      value: currentValue,
      display: `${selectedMetric.label} ${getOperatorDisplay(currentOperator)} ${currentValue}`
    };

    // 更新表单状态
    const updatedConditions = [...formState.selection.metricsConditions, newCondition];
    updateFormState('selection', 'metricsConditions', updatedConditions);

    // 重置选择
    setCurrentMetric("");
    setCurrentOperator("");
    setCurrentValue("");
  };

  // 删除度量条件
  const removeMetricCondition = (id: string) => {
    const updatedConditions = formState.selection.metricsConditions.filter(
      condition => condition.id !== id
    );
    updateFormState('selection', 'metricsConditions', updatedConditions);
  };

  // 获取运算符显示文本
  const getOperatorDisplay = (operator: string) => {
    const operatorMap: Record<string, string> = {
      "eq": "=",
      "neq": "≠",
      "gt": ">",
      "gte": "≥",
      "lt": "<",
      "lte": "≤",
      "contains": "contains",
      "not_contains": "doesn't contain",
      "starts_with": "starts with",
      "ends_with": "ends with"
    };
    return operatorMap[operator] || operator;
  };

  // 根据度量类型获取可用的运算符
  const getOperatorsByMetricType = (metricType: string) => {
    switch (metricType) {
      case "number":
        return [
          { value: "eq", label: "= (Equal)" },
          { value: "neq", label: "≠ (Not Equal)" },
          { value: "gt", label: "> (Greater Than)" },
          { value: "gte", label: "≥ (Greater Than or Equal)" },
          { value: "lt", label: "< (Less Than)" },
          { value: "lte", label: "≤ (Less Than or Equal)" }
        ];
      case "text":
        return [
          { value: "eq", label: "= (Equal)" },
          { value: "neq", label: "≠ (Not Equal)" },
          { value: "contains", label: "Contains" },
          { value: "not_contains", label: "Doesn't Contain" },
          { value: "starts_with", label: "Starts With" },
          { value: "ends_with", label: "Ends With" }
        ];
      case "select":
        return [
          { value: "eq", label: "= (Equal)" },
          { value: "neq", label: "≠ (Not Equal)" }
        ];
      default:
        return [];
    }
  };

  // 获取当前选择的度量类型
  const getCurrentMetricType = () => {
    const metric = metricsOptions.find(m => m.value === currentMetric);
    return metric?.type || "text";
  };

  // 获取指标条件的显示文本
  const getConditionText = (condition: {id: string; metricName: string; metricId: string; operator: string; value: string; display: string;}) => {
    return condition.display;
  };

  return (
    <div className="space-y-8">
      {/* 任务信息 */}
      <Card>
        <CardHeader>
          <CardTitle>Task Information</CardTitle>
          <CardDescription>Basic information about this auto tagging task</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="taskName">Task Name</Label>
              <Input
                id="taskName"
                placeholder="e.g. Balance Issues Tag - Rainbow Six Siege"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="submitter">Submitter</Label>
              <Input
                id="submitter"
                placeholder="Your name"
                value={submitter}
                onChange={(e) => setSubmitter(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 步骤标题和进度指示 */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold tracking-tight">
          Step {currentStep}: {
            currentStep === 1 ? "Content Selection" :
            currentStep === 2 ? "Tag Configuration" :
            currentStep === 3 ? "Processing Mode" :
            currentStep === 4 ? "Execution Schedule" :
            "Review & Submit"
          }
        </h2>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map(step => (
            <div 
              key={step}
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep === step 
                  ? "border-primary bg-primary text-primary-foreground" 
                  : "border-muted bg-background text-muted-foreground"
              }`}
            >
              {step}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border p-6">
        {/* Step content containers */}
        {currentStep === 1 && (
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Select content to tag using multi-dimensional filters</h3>
              
              {/* Time range selection */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="allTime"
                    checked={isAllTime}
                    onChange={(e) => handleAllTimeToggle(e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="allTime" className="text-base font-medium">All Time (no time restriction)</Label>
                </div>
                
                {!isAllTime && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formState.selection.timeWindow.start}
                        onChange={(e) => updateFormState('selection', 'timeWindow', { ...formState.selection.timeWindow, start: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formState.selection.timeWindow.end}
                        onChange={(e) => updateFormState('selection', 'timeWindow', { ...formState.selection.timeWindow, end: e.target.value })}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Theme Selection */}
              <div className="space-y-2">
                <Label htmlFor="theme-select">Theme</Label>
                <Select 
                  value={formState.selection.theme} 
                  onValueChange={(value) => updateFormState('selection', 'theme', value)}
                >
                  <SelectTrigger id="theme-select">
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {themeOptions.map(theme => (
                      <SelectItem key={theme.value} value={theme.value}>
                        {theme.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Existing Tags Selection */}
              <div className="space-y-2">
                <Label>Existing Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formState.selection.existingTags.map(tag => {
                    const tagLabel = existingTagOptions.find(t => t.value === tag)?.label || tag
                    return (
                      <Badge key={tag} className="py-1 px-3 flex items-center gap-1">
                        {tagLabel}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 rounded-full hover:bg-primary/20"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )
                  })}
                </div>
                
                {existingTagOptions.length === formState.selection.existingTags.length ? (
                  <div className="w-full p-2 bg-secondary/20 border rounded-md text-center text-sm text-muted-foreground">
                    All available tags have been selected
                  </div>
                ) : (
                  <Select 
                    key={`tag-select-${formState.selection.existingTags.length}`}
                    onValueChange={(value) => addTag(value)}
                  >
                    <SelectTrigger id="tag-select" className="w-full">
                      <SelectValue placeholder="Add existing tags" />
                    </SelectTrigger>
                    <SelectContent>
                      {existingTagOptions
                        .filter(tag => !formState.selection.existingTags.includes(tag.value))
                        .map(tag => (
                          <SelectItem key={tag.value} value={tag.value}>
                            {tag.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Metrics Conditions */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Metrics Filtering</Label>
                  <Badge variant="outline" className="text-xs px-2 py-0">Advanced</Badge>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Create conditions to filter content by metrics criteria (e.g., sentiment score {'>'} 0.7)
                </p>
                
                <div className="flex flex-col space-y-4">
                  {/* 输入新条件 */}
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Select value={currentMetric} onValueChange={setCurrentMetric}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Metric" />
                        </SelectTrigger>
                        <SelectContent>
                          {metricsOptions.map((metric) => (
                            <SelectItem key={metric.value} value={metric.value}>
                              {metric.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Select 
                        value={currentOperator} 
                        onValueChange={setCurrentOperator}
                        disabled={!currentMetric}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Operator" />
                        </SelectTrigger>
                        <SelectContent>
                          {getOperatorsByMetricType(getCurrentMetricType()).map((op) => (
                            <SelectItem key={op.value} value={op.value}>
                              {op.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Input 
                        placeholder="Value" 
                        value={currentValue}
                        onChange={(e) => setCurrentValue(e.target.value)}
                        disabled={!currentMetric || !currentOperator}
                        type={getCurrentMetricType() === "number" ? "number" : "text"}
                      />
                      <Button 
                        type="button" 
                        variant="secondary" 
                        size="sm"
                        onClick={addMetricCondition}
                        disabled={!currentMetric || !currentOperator || (!currentValue && currentValue !== "0")}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                  
                  {/* 已添加的条件列表 */}
                  {formState.selection.metricsConditions.length > 0 && (
                    <div className="border rounded-md p-3 bg-secondary/20">
                      <div className="text-sm font-medium mb-2">Active Conditions:</div>
                      <div className="flex flex-wrap gap-2">
                        {formState.selection.metricsConditions.map((condition) => (
                          <Badge 
                            key={condition.id} 
                            variant="secondary"
                            className="flex items-center space-x-1 text-sm py-1.5 px-3"
                          >
                            <span>{condition.display}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 ml-1"
                              onClick={() => removeMetricCondition(condition.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {formState.selection.metricsConditions.length === 0 && (
                    <div className="text-center p-4 border border-dashed rounded-md text-muted-foreground">
                      <p className="text-sm">No conditions added yet</p>
                      <p className="text-xs mt-1">Add conditions to filter content based on metrics</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* 添加下一步按钮 */}
            <div className="flex justify-end mt-6">
              <Button onClick={handleNext} className="px-6">Next</Button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Tag Configuration</CardTitle>
              <CardDescription>
                Define tag properties and associated metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tag-theme">Theme</Label>
                  <Select 
                    value={formState.tagConfig.theme} 
                    onValueChange={(value) => updateFormState('tagConfig', 'theme', value)}
                  >
                    <SelectTrigger id="tag-theme">
                      <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                    <SelectContent>
                      {themeOptions.map(theme => (
                        <SelectItem key={theme.value} value={theme.value}>
                          {theme.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tag-name">Tag Name</Label>
                  <Input 
                    id="tag-name" 
                    placeholder="e.g. #BalanceIssues"
                    value={formState.tagConfig.tagName}
                    onChange={(e) => updateFormState('tagConfig', 'tagName', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tag-definition">Tag Definition</Label>
                  <Textarea 
                    id="tag-definition" 
                    placeholder="Describe the tag definition and criteria..."
                    className="min-h-[120px]"
                    value={formState.tagConfig.tagDefinition}
                    onChange={(e) => updateFormState('tagConfig', 'tagDefinition', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Metrics Configuration</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {metricsOptions.map(metric => (
                      <div key={metric.value} className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id={`metric-${metric.value}`}
                          checked={formState.tagConfig.metrics.includes(metric.value)}
                          onChange={(e) => {
                            const newMetrics = e.target.checked 
                              ? [...formState.tagConfig.metrics, metric.value]
                              : formState.tagConfig.metrics.filter(m => m !== metric.value);
                            updateFormState('tagConfig', 'metrics', newMetrics);
                          }}
                        />
                        <Label htmlFor={`metric-${metric.value}`}>{metric.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePrevious}>Previous</Button>
              <Button onClick={handleNext}>Next</Button>
            </CardFooter>
          </Card>
        )}

        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 3: Processing Mode</CardTitle>
              <CardDescription>
                Choose how the tagging should be processed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-secondary/50" 
                    onClick={() => updateFormState('processingMode', '', 'complete')}>
                    <input 
                      type="radio" 
                      id="mode-complete" 
                      name="processing-mode"
                      checked={formState.processingMode === 'complete'}
                      onChange={() => updateFormState('processingMode', '', 'complete')}
                      className="mt-1"
                    />
                    <div>
                      <Label htmlFor="mode-complete" className="text-base font-medium">Complete Processing</Label>
                      <p className="text-sm text-muted-foreground">Tag content, update database, and refresh associated metrics and analysis</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-secondary/50"
                    onClick={() => updateFormState('processingMode', '', 'tagOnly')}>
                    <input 
                      type="radio" 
                      id="mode-tag-only" 
                      name="processing-mode"
                      checked={formState.processingMode === 'tagOnly'}
                      onChange={() => updateFormState('processingMode', '', 'tagOnly')}
                      className="mt-1"
                    />
                    <div>
                      <Label htmlFor="mode-tag-only" className="text-base font-medium">Tag Only</Label>
                      <p className="text-sm text-muted-foreground">Only add tags without affecting existing analysis metrics</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-secondary/50"
                    onClick={() => updateFormState('processingMode', '', 'simulation')}>
                    <input 
                      type="radio" 
                      id="mode-simulation" 
                      name="processing-mode"
                      checked={formState.processingMode === 'simulation'}
                      onChange={() => updateFormState('processingMode', '', 'simulation')}
                      className="mt-1"
                    />
                    <div>
                      <Label htmlFor="mode-simulation" className="text-base font-medium">Simulation</Label>
                      <p className="text-sm text-muted-foreground">Preview tagging effect without actual application, for verifying tag accuracy</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePrevious}>Previous</Button>
              <Button onClick={handleNext}>Next</Button>
            </CardFooter>
          </Card>
        )}

        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 4: Execution Schedule</CardTitle>
              <CardDescription>
                Set task execution time and frequency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs 
                defaultValue="immediate" 
                value={formState.schedule.type}
                onValueChange={(value) => updateFormState('schedule', 'type', value)}
                className="w-full"
              >
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="immediate">Immediate</TabsTrigger>
                  <TabsTrigger value="periodic">Periodic</TabsTrigger>
                  <TabsTrigger value="trigger">Trigger-based</TabsTrigger>
                  <TabsTrigger value="special">Special Period</TabsTrigger>
                </TabsList>
                
                <TabsContent value="immediate" className="space-y-4">
                  <div className="flex items-start space-x-3 p-4 border rounded-lg">
                    <input 
                      type="radio" 
                      id="schedule-one-time" 
                      name="immediate-schedule"
                      checked={true}
                      readOnly
                      className="mt-1"
                    />
                    <div>
                      <Label htmlFor="schedule-one-time" className="text-base font-medium">One-time</Label>
                      <p className="text-sm text-muted-foreground">Process once immediately and complete</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="periodic" className="space-y-4">
                  <div className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-secondary/50"
                    onClick={() => updateFormState('schedule', 'periodic', {frequency: 'daily'})}>
                    <input 
                      type="radio" 
                      id="schedule-daily" 
                      name="periodic-schedule"
                      checked={formState.schedule.periodic.frequency === 'daily'}
                      onChange={() => updateFormState('schedule', 'periodic', {frequency: 'daily'})}
                      className="mt-1"
                    />
                    <div>
                      <Label htmlFor="schedule-daily" className="text-base font-medium">Daily</Label>
                      <p className="text-sm text-muted-foreground">Execute automatically once every day</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-secondary/50"
                    onClick={() => updateFormState('schedule', 'periodic', {frequency: 'weekly'})}>
                    <input 
                      type="radio" 
                      id="schedule-weekly" 
                      name="periodic-schedule"
                      checked={formState.schedule.periodic.frequency === 'weekly'}
                      onChange={() => updateFormState('schedule', 'periodic', {frequency: 'weekly'})}
                      className="mt-1"
                    />
                    <div>
                      <Label htmlFor="schedule-weekly" className="text-base font-medium">Weekly</Label>
                      <p className="text-sm text-muted-foreground">Execute automatically once every week</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-secondary/50"
                    onClick={() => updateFormState('schedule', 'periodic', {frequency: 'monthly'})}>
                    <input 
                      type="radio" 
                      id="schedule-monthly" 
                      name="periodic-schedule"
                      checked={formState.schedule.periodic.frequency === 'monthly'}
                      onChange={() => updateFormState('schedule', 'periodic', {frequency: 'monthly'})}
                      className="mt-1"
                    />
                    <div>
                      <Label htmlFor="schedule-monthly" className="text-base font-medium">Monthly</Label>
                      <p className="text-sm text-muted-foreground">Execute automatically once every month</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="trigger" className="space-y-4">
                  <div className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-secondary/50"
                    onClick={() => updateFormState('schedule', 'trigger', {type: 'dataUpdate'})}>
                    <input 
                      type="radio" 
                      id="trigger-data-update" 
                      name="trigger-schedule"
                      checked={formState.schedule.trigger.type === 'dataUpdate'}
                      onChange={() => updateFormState('schedule', 'trigger', {type: 'dataUpdate'})}
                      className="mt-1"
                    />
                    <div>
                      <Label htmlFor="trigger-data-update" className="text-base font-medium">On Data Update</Label>
                      <p className="text-sm text-muted-foreground">Execute automatically when new data is added to the system</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-secondary/50"
                    onClick={() => updateFormState('schedule', 'trigger', {type: 'threshold'})}>
                    <input 
                      type="radio" 
                      id="trigger-threshold" 
                      name="trigger-schedule"
                      checked={formState.schedule.trigger.type === 'threshold'}
                      onChange={() => updateFormState('schedule', 'trigger', {type: 'threshold'})}
                      className="mt-1"
                    />
                    <div>
                      <Label htmlFor="trigger-threshold" className="text-base font-medium">On Threshold</Label>
                      <p className="text-sm text-muted-foreground">Execute automatically when relevant content volume reaches a set value</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="special" className="space-y-4">
                  <div className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-secondary/50"
                    onClick={() => updateFormState('schedule', 'special', {type: 'campaign'})}>
                    <input 
                      type="radio" 
                      id="special-campaign" 
                      name="special-schedule"
                      checked={formState.schedule.special.type === 'campaign'}
                      onChange={() => updateFormState('schedule', 'special', {type: 'campaign'})}
                      className="mt-1"
                    />
                    <div>
                      <Label htmlFor="special-campaign" className="text-base font-medium">Campaign Period</Label>
                      <p className="text-sm text-muted-foreground">Execute frequently during marketing campaign periods</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-secondary/50"
                    onClick={() => updateFormState('schedule', 'special', {type: 'postRelease'})}>
                    <input 
                      type="radio" 
                      id="special-post-release" 
                      name="special-schedule"
                      checked={formState.schedule.special.type === 'postRelease'}
                      onChange={() => updateFormState('schedule', 'special', {type: 'postRelease'})}
                      className="mt-1"
                    />
                    <div>
                      <Label htmlFor="special-post-release" className="text-base font-medium">Post-Release Period</Label>
                      <p className="text-sm text-muted-foreground">Execute frequently after game version updates</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePrevious}>Previous</Button>
              <Button onClick={handleNext}>Next</Button>
            </CardFooter>
          </Card>
        )}

        {currentStep === 5 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 5: Review & Submit</CardTitle>
              <CardDescription>
                Review task settings and submit for execution
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Task Summary</h3>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium">Content Selection</h4>
                    <p className="text-sm text-muted-foreground">
                      Time Range: {formState.selection.timeWindow.start || 'Not set'} to {formState.selection.timeWindow.end || 'Not set'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Theme: {themeOptions.find(t => t.value === formState.selection.theme)?.label || 'Not selected'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Selected Tags: {formState.selection.existingTags.length > 0 
                        ? formState.selection.existingTags.map(t => existingTagOptions.find(o => o.value === t)?.label || t).join(', ') 
                        : 'None'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Metrics Criteria: {formState.selection.metricsConditions.length > 0 
                        ? formState.selection.metricsConditions.map(condition => getConditionText(condition)).join(', ') 
                        : 'None'}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">Tag Configuration</h4>
                    <p className="text-sm text-muted-foreground">
                      Tag Name: {formState.tagConfig.tagName || 'Not set'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Associated Metrics: {formState.tagConfig.metrics.length > 0 
                        ? formState.tagConfig.metrics.map(m => metricsOptions.find(o => o.value === m)?.label || m).join(', ') 
                        : 'None'}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">Processing Mode</h4>
                    <p className="text-sm text-muted-foreground">
                      {formState.processingMode === 'complete' && 'Complete Processing'}
                      {formState.processingMode === 'tagOnly' && 'Tag Only'}
                      {formState.processingMode === 'simulation' && 'Simulation'}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">Execution Schedule</h4>
                    <p className="text-sm text-muted-foreground">
                      {formState.schedule.type === 'immediate' && 'One-time'}
                      {formState.schedule.type === 'periodic' && (
                        formState.schedule.periodic.frequency === 'daily' ? 'Daily' :
                        formState.schedule.periodic.frequency === 'weekly' ? 'Weekly' :
                        'Monthly'
                      )}
                      {formState.schedule.type === 'trigger' && (
                        formState.schedule.trigger.type === 'dataUpdate' ? 'On Data Update' :
                        'On Threshold'
                      )}
                      {formState.schedule.type === 'special' && (
                        formState.schedule.special.type === 'campaign' ? 'Campaign Period' :
                        'Post-Release Period'
                      )}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">Submission Info</h4>
                    <p className="text-sm text-muted-foreground">
                      Submitter: {submitter || 'Not provided'}
                    </p>
                  </div>
                </div>
                
                {(!taskName || !submitter) && (
                  <div className="flex items-center p-3 bg-yellow-50 text-yellow-800 rounded-md">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <span>Please provide a task name and submitter</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePrevious}>Previous</Button>
              <Button 
                onClick={handleSubmit} 
                disabled={!taskName || !submitter}
              >
                Submit Task
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
} 