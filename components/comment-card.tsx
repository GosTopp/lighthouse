import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { StarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

// 评论卡片接口定义
export interface CommentData {
  user: string
  avatar: string
  game: string
  platform: string
  publish_at: string
  rating: number
  content: string
  tag_details: Array<{
    theme: string
    tags: Array<{
      name: string
      metrics: {
        sentiment_score: number
        sentiment_label: string
        keywords: string[]
      }
    }>
  }>
}

interface CommentCardProps {
  comment: CommentData
  expanded?: boolean
}

// 评论卡片组件
export function CommentCard({ comment, expanded = false }: CommentCardProps) {
  // 格式化发布日期
  const formattedDate = new Date(comment.publish_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  // 获取所有标签
  const getAllTags = () => {
    const tags: { tag: string; sentiment: string; category: string }[] = []
    
    comment.tag_details.forEach(themeObj => {
      const category = themeObj.theme;
      themeObj.tags.forEach(tagItem => {
        tags.push({
          tag: tagItem.name,
          sentiment: tagItem.metrics.sentiment_label,
          category
        })
      })
    })
    
    return tags
  }

  // 所有标签
  const allTags = getAllTags()

  // 获取标签对应的颜色
  const getTagColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return 'bg-green-100 text-green-800 hover:bg-green-200'
      case 'negative':
        return 'bg-red-100 text-red-800 hover:bg-red-200'
      case 'mixed':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
      default:
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200'
    }
  }

  // 渲染评分
  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon
            key={i}
            className={cn(
              "h-4 w-4",
              i < rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
            )}
          />
        ))}
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex space-x-2">
          <Avatar>
            <AvatarImage src={comment.avatar} alt={comment.user} />
            <AvatarFallback>{comment.user.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="font-semibold leading-none">{comment.user}</h3>
            <p className="text-sm text-muted-foreground">{comment.game}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">{formattedDate}</div>
          <div className="text-sm text-muted-foreground">{comment.platform}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-2">{renderRating(comment.rating)}</div>
        <p className={cn(
          "text-sm leading-relaxed",
          !expanded && "line-clamp-3"
        )}>
          {comment.content}
        </p>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-1 pt-1">
        {allTags.slice(0, expanded ? allTags.length : 3).map((tagItem, index) => (
          <HoverCard key={index}>
            <HoverCardTrigger asChild>
              <Badge 
                variant="outline" 
                className={cn("cursor-pointer", getTagColor(tagItem.sentiment))}
              >
                {tagItem.tag}
              </Badge>
            </HoverCardTrigger>
            <HoverCardContent className="w-64">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">{tagItem.tag}</h4>
                <p className="text-xs text-muted-foreground">Theme: {tagItem.category}</p>
                <p className="text-xs text-muted-foreground">Sentiment: {tagItem.sentiment}</p>
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}
        {!expanded && allTags.length > 3 && (
          <Badge variant="outline" className="cursor-pointer">
            +{allTags.length - 3}
          </Badge>
        )}
      </CardFooter>
    </Card>
  )
} 