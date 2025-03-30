import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CommentCard, CommentData } from "./comment-card"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CommentDialogProps {
  comment: CommentData
  open: boolean
  onOpenChange: (open: boolean) => void
}

// 评论详情对话框组件
export function CommentDialog({ comment, open, onOpenChange }: CommentDialogProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // 获取所有主题
  const themes = comment.tag_details.map(theme => theme.theme)

  // 根据主题名称获取主题对象
  const getThemeObj = (themeName: string) => {
    return comment.tag_details.find(t => t.theme === themeName)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>Comment Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="px-6 max-h-[calc(90vh-8rem)]">
          <div className="mt-4">
            <CommentCard comment={comment} expanded={true} />
          </div>
          <Tabs defaultValue="overview" className="mt-6" onValueChange={setActiveTab}>
            <TabsList className="mb-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              {themes.map((theme) => (
                <TabsTrigger key={theme} value={theme}>
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="overview" className="mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {themes.map((theme) => {
                  const themeObj = getThemeObj(theme)
                  if (!themeObj || themeObj.tags.length === 0) return null
                  
                  return (
                    <Card key={theme}>
                      <CardContent className="pt-6">
                        <h3 className="text-lg font-semibold mb-3 capitalize">{theme}</h3>
                        <div className="space-y-3">
                          {themeObj.tags.map((tag, index) => (
                            <div key={index} className="space-y-1">
                              <div className="flex justify-between">
                                <span className="text-sm font-medium">{tag.name}</span>
                                <span className="text-sm">{tag.metrics.sentiment_label}</span>
                              </div>
                              <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-100">
                                <div
                                  className={`absolute h-full ${
                                    tag.metrics.sentiment_label === "Positive"
                                      ? "bg-green-500"
                                      : tag.metrics.sentiment_label === "Negative"
                                      ? "bg-red-500"
                                      : "bg-yellow-500"
                                  }`}
                                  style={{ width: `${tag.metrics.sentiment_score * 100}%` }}
                                />
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {tag.metrics.keywords.map((keyword, kidx) => (
                                  <span key={kidx} className="text-xs bg-gray-100 px-2 py-0.5 rounded-md">
                                    {keyword}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>
            {themes.map((theme) => {
              const themeObj = getThemeObj(theme)
              if (!themeObj) return null
              
              return (
                <TabsContent key={theme} value={theme} className="mt-2">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        {themeObj.tags.map((tag, index) => (
                          <div key={index} className="border-b pb-4 last:border-0">
                            <h3 className="text-md font-semibold mb-2">{tag.name}</h3>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm">Sentiment: {tag.metrics.sentiment_label}</span>
                              <span className="text-sm">Score: {tag.metrics.sentiment_score.toFixed(2)}</span>
                            </div>
                            <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-100 mb-3">
                              <div
                                className={`absolute h-full ${
                                  tag.metrics.sentiment_label === "Positive"
                                    ? "bg-green-500"
                                    : tag.metrics.sentiment_label === "Negative"
                                    ? "bg-red-500"
                                    : "bg-yellow-500"
                                }`}
                                style={{ width: `${tag.metrics.sentiment_score * 100}%` }}
                              />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-2">Keywords:</h4>
                              <div className="flex flex-wrap gap-2">
                                {tag.metrics.keywords.map((keyword, kidx) => (
                                  <span
                                    key={kidx}
                                    className="text-sm bg-gray-100 px-2 py-1 rounded-md"
                                  >
                                    {keyword}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )
            })}
          </Tabs>
          <div className="pb-6"></div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
} 