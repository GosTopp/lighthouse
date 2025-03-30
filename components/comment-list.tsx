import { useState } from "react"
import { CommentCard, CommentData } from "./comment-card"
import { CommentDialog } from "./comment-dialog"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

interface CommentListProps {
  comments: CommentData[]
  loading?: boolean
}

export function CommentList({ comments, loading = false }: CommentListProps) {
  const [visibleComments, setVisibleComments] = useState(12)
  const [selectedComment, setSelectedComment] = useState<CommentData | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleLoadMore = () => {
    setVisibleComments(prevCount => prevCount + 12)
  }

  const handleCommentClick = (comment: CommentData) => {
    setSelectedComment(comment)
    setIsDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-[260px] rounded-lg border border-border bg-card p-4 shadow-sm animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (comments.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dashed py-20">
        <div className="flex flex-col items-center text-center">
          <h3 className="mt-4 text-lg font-semibold">No comments found</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            Try different filters or clear all filters to search again.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {comments.slice(0, visibleComments).map((comment, index) => (
          <div
            key={index}
            className="cursor-pointer transition-all hover:shadow-md"
            onClick={() => handleCommentClick(comment)}
          >
            <CommentCard comment={comment} />
          </div>
        ))}
      </div>

      {visibleComments < comments.length && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            className="gap-2"
            onClick={handleLoadMore}
          >
            Load More
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      )}

      {selectedComment && (
        <CommentDialog
          comment={selectedComment}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      )}
    </div>
  )
} 