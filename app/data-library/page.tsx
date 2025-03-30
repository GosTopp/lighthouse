"use client"

import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { CommentFilters } from "@/components/comment-filters"
import { CommentList } from "@/components/comment-list"
import { CommentData } from "@/components/comment-card"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { RefreshCcw, Info } from "lucide-react"

export default function DataLibraryPage() {
  const [comments, setComments] = useState<CommentData[]>([])
  const [filteredComments, setFilteredComments] = useState<CommentData[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [filters, setFilters] = useState({
    search: "",
    game: "all",
    platform: "all",
    tagCategory: "all",
    tag: "all",
    dateRange: "all",
    sentiment: "all"
  })

  // 加载评论数据
  const fetchComments = async () => {
    try {
      setLoading(true)
      const response = await fetch("/comments.json")
      const data = await response.json()
      setComments(data)
      setFilteredComments(data)
    } catch (error) {
      console.error("Error loading comments:", error)
    } finally {
      setLoading(false)
    }
  }

  // 首次加载
  useEffect(() => {
    fetchComments()
  }, [])

  // 刷新数据
  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchComments()
    setRefreshing(false)
  }

  // 应用筛选
  useEffect(() => {
    let result = [...comments]

    // 搜索筛选
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        comment => 
          comment.content.toLowerCase().includes(searchLower) ||
          comment.user.toLowerCase().includes(searchLower)
      )
    }

    // 游戏筛选
    if (filters.game !== "all") {
      result = result.filter(comment => comment.game === filters.game)
    }

    // 平台筛选
    if (filters.platform !== "all") {
      result = result.filter(comment => comment.platform === filters.platform)
    }

    // 主题筛选
    if (filters.tagCategory !== "all") {
      result = result.filter(comment => 
        comment.tag_details && 
        comment.tag_details.some(themeObj => themeObj.theme === filters.tagCategory && themeObj.tags.length > 0)
      )
    }

    // 标签筛选
    if (filters.tag !== "all") {
      result = result.filter(comment => 
        comment.tag_details && 
        comment.tag_details.some(themeObj => 
          themeObj.tags.some(tag => tag.name === filters.tag)
        )
      )
    }

    // 情感倾向筛选
    if (filters.sentiment !== "all") {
      result = result.filter(comment => {
        if (!comment.tag_details) return false
        
        // 检查任何主题中的任何标签是否有匹配的情感标签
        return comment.tag_details.some(themeObj => 
          themeObj.tags.some(tag => tag.metrics.sentiment_label === filters.sentiment)
        )
      })
    }

    // 日期范围筛选
    if (filters.dateRange !== "all") {
      const now = new Date()
      let daysToSubtract = 0
      
      switch(filters.dateRange) {
        case "7days":
          daysToSubtract = 7
          break
        case "30days":
          daysToSubtract = 30
          break
        case "90days":
          daysToSubtract = 90
          break
      }
      
      if (daysToSubtract > 0) {
        const cutoffDate = new Date(now.setDate(now.getDate() - daysToSubtract))
        result = result.filter(comment => {
          const commentDate = new Date(comment.publish_at)
          return commentDate >= cutoffDate
        })
      }
    }

    setFilteredComments(result)
  }, [comments, filters])

  // 处理筛选变更
  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }))
  }

  const handleGameChange = (value: string) => {
    setFilters(prev => ({ ...prev, game: value }))
  }

  const handlePlatformChange = (value: string) => {
    setFilters(prev => ({ ...prev, platform: value }))
  }

  const handleTagCategoryChange = (value: string) => {
    setFilters(prev => ({ ...prev, tagCategory: value }))
  }

  const handleTagChange = (value: string) => {
    setFilters(prev => ({ ...prev, tag: value }))
  }

  const handleDateRangeChange = (value: string) => {
    setFilters(prev => ({ ...prev, dateRange: value }))
  }

  const handleSentimentChange = (value: string) => {
    setFilters(prev => ({ ...prev, sentiment: value }))
  }

  const handleClearFilters = () => {
    setFilters({
      search: "",
      game: "all",
      platform: "all",
      tagCategory: "all",
      tag: "all",
      dateRange: "all",
      sentiment: "all"
    })
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Data Library">
          {/* 从这里移除刷新按钮 */}
        </SiteHeader>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight">User Comments Library</h1>
                    <p className="text-muted-foreground">
                      Browse and filter game comments to analyze user feedback
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Info className="mr-1 h-4 w-4" />
                      Total: {filteredComments.length} comments
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      onClick={handleRefresh}
                      disabled={refreshing}
                    >
                      <RefreshCcw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                      {refreshing ? 'Refreshing...' : 'Refresh Data'}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-8">
                  <div className="rounded-lg border p-4">
                    <CommentFilters
                      onSearch={handleSearchChange}
                      onGameChange={handleGameChange}
                      onPlatformChange={handlePlatformChange}
                      onTagCategoryChange={handleTagCategoryChange}
                      onTagChange={handleTagChange}
                      onDateRangeChange={handleDateRangeChange}
                      onSentimentChange={handleSentimentChange}
                      onClearFilters={handleClearFilters}
                      selectedFilters={filters}
                    />
                  </div>
                  
                  <CommentList comments={filteredComments} loading={loading} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 