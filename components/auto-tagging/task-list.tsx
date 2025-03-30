"use client"

import { useState } from "react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, MoreHorizontal, CheckCircle, XCircle, Clock, PlayCircle, PauseCircle } from "lucide-react"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Task types definition
interface TaskDetail {
  theme: string;
  tagName: string;
  processingMode: string;
  schedule: string;
  affectedContents: number;
  timeWindow: {
    start: string;
    end: string;
  };
}

interface Task {
  id: number;
  name: string;
  submitter: string;
  reviewer: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  details: TaskDetail;
}

// Mock task data
const mockTasks: Task[] = [
  {
    id: 1,
    name: "#BalanceIssues - Rainbow Six Siege",
    submitter: "example@artefact.com",
    reviewer: "jiaoliang.chen@artefact.com",
    status: "completed", // pending, running, completed, rejected, paused
    createdAt: "2023-03-25T12:00:00",
    updatedAt: "2023-03-26T15:30:00",
    details: {
      theme: "ux",
      tagName: "#BalanceIssues",
      processingMode: "complete",
      schedule: "One-time",
      affectedContents: 128,
      timeWindow: {
        start: "2023-02-01",
        end: "2023-03-01"
      }
    }
  },
  {
    id: 2,
    name: "#Matchmaking - Rainbow Six Siege",
    submitter: "example@artefact.com",
    reviewer: "jiaoliang.chen@artefact.com",
    status: "running",
    createdAt: "2023-03-27T09:15:00",
    updatedAt: "2023-03-27T09:15:00",
    details: {
      theme: "ux",
      tagName: "#MatchmakingTime",
      processingMode: "tagOnly",
      schedule: "Daily",
      affectedContents: 78,
      timeWindow: {
        start: "2023-03-01",
        end: "2023-03-27"
      }
    }
  },
  {
    id: 3,
    name: "#Background - Assassin's Creed",
    submitter: "example@artefact.com",
    reviewer: "jiaoliang.chen@artefact.com",
    status: "pending",
    createdAt: "2023-03-28T11:45:00",
    updatedAt: "2023-03-28T11:45:00",
    details: {
      theme: "story",
      tagName: "#StoryDepth",
      processingMode: "simulation",
      schedule: "One-time",
      affectedContents: 0,
      timeWindow: {
        start: "2023-01-01",
        end: "2023-03-15"
      }
    }
  },
  {
    id: 4,
    name: "#ControlIssues - Assassin's Creed",
    submitter: "example@artefact.com",
    reviewer: "jiaoliang.chen@artefact.com",
    status: "rejected",
    createdAt: "2023-03-20T14:30:00",
    updatedAt: "2023-03-22T10:15:00",
    details: {
      theme: "ux",
      tagName: "#ControlScheme",
      processingMode: "complete",
      schedule: "Weekly",
      affectedContents: 0,
      timeWindow: {
        start: "2023-02-15",
        end: "2023-03-15"
      }
    }
  },
  {
    id: 5,
    name: "#DifficultyBalance - Rainbow Six Siege",
    submitter: "example@artefact.com",
    reviewer: "jiaoliang.chen@artefact.com",
    status: "paused",
    createdAt: "2023-03-18T08:45:00",
    updatedAt: "2023-03-23T16:20:00",
    details: {
      theme: "gameplay",
      tagName: "#DifficultyBalance",
      processingMode: "complete",
      schedule: "Daily",
      affectedContents: 45,
      timeWindow: {
        start: "2023-03-01",
        end: "2023-03-18"
      }
    }
  }
]

export function TaskList() {
  const [tasks] = useState<Task[]>(mockTasks)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200 px-2 py-0.5 font-medium">
            <CheckCircle className="w-3.5 h-3.5 mr-1" />
            Completed
          </Badge>
        )
      case 'running':
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200 px-2 py-0.5 font-medium">
            <Clock className="w-3.5 h-3.5 mr-1 animate-spin" />
            Running
          </Badge>
        )
      case 'pending':
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200 px-2 py-0.5 font-medium">
            <Clock className="w-3.5 h-3.5 mr-1" />
            Pending
          </Badge>
        )
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200 px-2 py-0.5 font-medium">
            <XCircle className="w-3.5 h-3.5 mr-1" />
            Rejected
          </Badge>
        )
      case 'paused':
        return (
          <Badge variant="outline" className="bg-slate-100 text-slate-800 hover:bg-slate-100 border-slate-200 px-2 py-0.5 font-medium">
            <PauseCircle className="w-3.5 h-3.5 mr-1" />
            Paused
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const viewTaskDetails = (task: Task) => {
    setSelectedTask(task)
    setDetailsOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Auto Tagging Task List</h2>
          <p className="text-muted-foreground">
            View and manage your auto tagging tasks
          </p>
        </div>
        <Button size="sm" className="gap-1">
          <Clock className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task Name</TableHead>
              <TableHead>Submitter</TableHead>
              <TableHead>Reviewer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map(task => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.name}</TableCell>
                <TableCell>{task.submitter}</TableCell>
                <TableCell>{task.reviewer}</TableCell>
                <TableCell>{getStatusBadge(task.status)}</TableCell>
                <TableCell>{formatDate(task.createdAt)}</TableCell>
                <TableCell>{formatDate(task.updatedAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end">
                    <Button variant="ghost" size="icon" onClick={() => viewTaskDetails(task)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {task.status === 'pending' && (
                          <>
                            <DropdownMenuItem>
                              <CheckCircle className="mr-2 h-4 w-4" /> Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <XCircle className="mr-2 h-4 w-4" /> Reject
                            </DropdownMenuItem>
                          </>
                        )}
                        {task.status === 'running' && (
                          <DropdownMenuItem>
                            <PauseCircle className="mr-2 h-4 w-4" /> Pause
                          </DropdownMenuItem>
                        )}
                        {task.status === 'paused' && (
                          <DropdownMenuItem>
                            <PlayCircle className="mr-2 h-4 w-4" /> Resume
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <Clock className="mr-2 h-4 w-4" /> View History
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Task Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
            <DialogDescription>
              View details of the auto tagging task
            </DialogDescription>
          </DialogHeader>
          
          {selectedTask && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">{selectedTask.name}</h3>
                <p className="text-sm text-muted-foreground">ID: {selectedTask.id}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Submitter</p>
                  <p className="text-sm">{selectedTask.submitter}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Reviewer</p>
                  <p className="text-sm">{selectedTask.reviewer}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <div>{getStatusBadge(selectedTask.status)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium">Execution Schedule</p>
                  <p className="text-sm">{selectedTask.details.schedule}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Theme</p>
                  <p className="text-sm">{selectedTask.details.theme}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Tag Name</p>
                  <p className="text-sm">{selectedTask.details.tagName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Processing Mode</p>
                  <p className="text-sm">{selectedTask.details.processingMode}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Affected Contents</p>
                  <p className="text-sm">{selectedTask.details.affectedContents}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium">Time Range</p>
                <p className="text-sm">
                  {selectedTask.details.timeWindow.start} to {selectedTask.details.timeWindow.end}
                </p>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button onClick={() => setDetailsOpen(false)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 