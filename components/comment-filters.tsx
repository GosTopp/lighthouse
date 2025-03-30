import React, { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

interface FilterOption {
  value: string
  label: string
}

// 游戏选项
const GAME_OPTIONS: FilterOption[] = [
  { value: "all", label: "All Games" },
  { value: "Tom Clancy's Rainbow Six Siege", label: "Rainbow Six Siege" },
  { value: "Watch Dogs: Legion", label: "Watch Dogs: Legion" },
  { value: "Assassin's Creed Valhalla", label: "Assassin's Creed Valhalla" }
]

// 平台选项
const PLATFORM_OPTIONS: FilterOption[] = [
  { value: "all", label: "All Platforms" },
  { value: "Steam", label: "Steam" },
  { value: "RedBook", label: "RedBook" },
  { value: "Bilibili", label: "Bilibili" }
]

// 主题选项
const THEME_OPTIONS: FilterOption[] = [
  { value: "all", label: "All Themes" },
  { value: "story", label: "Story" },
  { value: "ux", label: "User Experience" },
  { value: "risk", label: "Risk" }
]

// 标签选项（根据主题动态生成）
const TAG_OPTIONS_BY_THEME: Record<string, FilterOption[]> = {
  story: [
    { value: "all", label: "All Tags" },
    { value: "#OperatorBackground", label: "Operator Background" },
    { value: "#LoreExpansion", label: "Lore Expansion" },
    { value: "#MissionVariety", label: "Mission Variety" },
    { value: "#EventNarratives", label: "Event Narratives" },
    { value: "#WorldBuilding", label: "World Building" },
    { value: "#VillainQuality", label: "Villain Quality" },
    { value: "#ContentRepetition", label: "Content Repetition" },
    { value: "#StoryPacing", label: "Story Pacing" }
  ],
  ux: [
    { value: "all", label: "All Tags" },
    { value: "#HitRegistration", label: "Hit Registration" },
    { value: "#MatchmakingTime", label: "Matchmaking Time" },
    { value: "#WeaponFeel", label: "Weapon Feel" },
    { value: "#OpenWorldNavigation", label: "Open World Navigation" },
    { value: "#WorldDesign", label: "World Design" },
    { value: "#CraftingSystem", label: "Crafting System" },
    { value: "#MenuDesign", label: "Menu Design" },
    { value: "#UIClarity", label: "UI Clarity" }
  ],
  risk: [
    { value: "all", label: "All Tags" },
    { value: "#BalanceIssues", label: "Balance Issues" },
    { value: "#Cheaters", label: "Cheaters" },
    { value: "#TechnicalDebt", label: "Technical Debt" },
    { value: "#QuestBugs", label: "Quest Bugs" },
    { value: "#AIGlitches", label: "AI Glitches" },
    { value: "#SaveCorruption", label: "Save Corruption" },
    { value: "#ServerIssues", label: "Server Issues" },
    { value: "#FrameRateIssues", label: "Frame Rate Issues" }
  ]
}

// 日期范围选项
const DATE_RANGE_OPTIONS: FilterOption[] = [
  { value: "all", label: "All Time" },
  { value: "7days", label: "Last 7 Days" },
  { value: "30days", label: "Last 30 Days" },
  { value: "90days", label: "Last 90 Days" }
]

// 情感倾向选项
const SENTIMENT_OPTIONS: FilterOption[] = [
  { value: "all", label: "All Sentiments" },
  { value: "Positive", label: "Positive" },
  { value: "Negative", label: "Negative" },
  { value: "Mixed", label: "Mixed" }
]

interface CommentFiltersProps {
  onSearch: (value: string) => void
  onGameChange: (value: string) => void
  onPlatformChange: (value: string) => void
  onTagCategoryChange: (value: string) => void
  onTagChange: (value: string) => void
  onDateRangeChange: (value: string) => void
  onSentimentChange: (value: string) => void
  onClearFilters: () => void
  selectedFilters: {
    search: string
    game: string
    platform: string
    tagCategory: string
    tag: string
    dateRange: string
    sentiment: string
  }
}

export function CommentFilters({
  onSearch,
  onGameChange,
  onPlatformChange,
  onTagCategoryChange,
  onTagChange,
  onDateRangeChange,
  onSentimentChange,
  onClearFilters,
  selectedFilters
}: CommentFiltersProps) {
  const [availableTags, setAvailableTags] = useState<FilterOption[]>([
    { value: "all", label: "All Tags" }
  ])

  // 当主题变化时更新可用的标签
  useEffect(() => {
    if (selectedFilters.tagCategory === "all") {
      setAvailableTags([{ value: "all", label: "All Tags" }])
      if (selectedFilters.tag !== "all") {
        onTagChange("all") // 重置标签选择
      }
    } else {
      const tags = TAG_OPTIONS_BY_THEME[selectedFilters.tagCategory] || [
        { value: "all", label: "All Tags" }
      ]
      setAvailableTags(tags)
      if (selectedFilters.tag !== "all" && !tags.some(t => t.value === selectedFilters.tag)) {
        onTagChange("all") // 如果当前选中的标签不在新主题的标签列表中，重置标签选择
      }
    }
  }, [selectedFilters.tagCategory, onTagChange, selectedFilters.tag])

  const hasActiveFilters = Object.values(selectedFilters).some(
    value => value && value !== "all"
  ) || selectedFilters.search !== ""

  const getSelectedOptionLabel = (options: FilterOption[], value: string) => {
    const option = options.find(opt => opt.value === value)
    return option ? option.label : ""
  }

  const renderActiveFilters = () => {
    const filters = []

    if (selectedFilters.game && selectedFilters.game !== "all") {
      filters.push({
        label: `Game: ${getSelectedOptionLabel(GAME_OPTIONS, selectedFilters.game)}`,
        value: selectedFilters.game
      })
    }

    if (selectedFilters.platform && selectedFilters.platform !== "all") {
      filters.push({
        label: `Platform: ${getSelectedOptionLabel(PLATFORM_OPTIONS, selectedFilters.platform)}`,
        value: selectedFilters.platform
      })
    }

    if (selectedFilters.tagCategory && selectedFilters.tagCategory !== "all") {
      filters.push({
        label: `Theme: ${getSelectedOptionLabel(THEME_OPTIONS, selectedFilters.tagCategory)}`,
        value: selectedFilters.tagCategory
      })
    }

    if (selectedFilters.tag && selectedFilters.tag !== "all") {
      filters.push({
        label: `Tag: ${getSelectedOptionLabel(availableTags, selectedFilters.tag)}`,
        value: selectedFilters.tag
      })
    }

    if (selectedFilters.dateRange && selectedFilters.dateRange !== "all") {
      filters.push({
        label: `Time: ${getSelectedOptionLabel(DATE_RANGE_OPTIONS, selectedFilters.dateRange)}`,
        value: selectedFilters.dateRange
      })
    }

    if (selectedFilters.sentiment && selectedFilters.sentiment !== "all") {
      filters.push({
        label: `Sentiment: ${getSelectedOptionLabel(SENTIMENT_OPTIONS, selectedFilters.sentiment)}`,
        value: selectedFilters.sentiment
      })
    }

    if (selectedFilters.search) {
      filters.push({
        label: `Search: ${selectedFilters.search}`,
        value: "search"
      })
    }

    return filters
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <div className="space-y-2">
          <Label htmlFor="game">Game</Label>
          <Select
            value={selectedFilters.game}
            onValueChange={onGameChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select game" />
            </SelectTrigger>
            <SelectContent>
              {GAME_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="platform">Platform</Label>
          <Select
            value={selectedFilters.platform}
            onValueChange={onPlatformChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              {PLATFORM_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tag-category">Theme</Label>
          <Select
            value={selectedFilters.tagCategory}
            onValueChange={onTagCategoryChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              {THEME_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tag">Tag</Label>
          <Select
            value={selectedFilters.tag}
            onValueChange={onTagChange}
            disabled={selectedFilters.tagCategory === "all"}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select tag" />
            </SelectTrigger>
            <SelectContent>
              {availableTags.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date-range">Time Range</Label>
          <Select
            value={selectedFilters.dateRange}
            onValueChange={onDateRangeChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              {DATE_RANGE_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sentiment">Sentiment</Label>
          <Select
            value={selectedFilters.sentiment}
            onValueChange={onSentimentChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select sentiment" />
            </SelectTrigger>
            <SelectContent>
              {SENTIMENT_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search comments..."
            className="pl-8"
            value={selectedFilters.search}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        {hasActiveFilters && (
          <Button variant="outline" onClick={onClearFilters}>
            Clear Filters
          </Button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {renderActiveFilters().map((filter, index) => (
            <Badge key={index} variant="secondary" className="gap-1">
              {filter.label}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
} 