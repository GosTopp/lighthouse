"use client"

import * as React from "react"
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconGripVertical,
  IconLayoutColumns,
  IconLoader,
  IconPlus,
  IconTrendingUp,
  IconPencil,
  IconClipboardCopy,
  IconEye,
  IconTrash,
  IconAlertTriangleFilled,
  IconInfoCircle,
} from "@tabler/icons-react"
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { toast } from "sonner"
import { z } from "zod"
import { cn } from "@/lib/utils"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  Button,
  Button as UiButton,
} from "@/components/ui/button"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useKeyboardHandlers } from "@/hooks/use-keyboard-handlers"
import { Badge } from "@/components/ui/badge"
import { HoverCardContent as UiHoverCardContent } from "@/components/ui/hover-card"

export const schema = z.object({
  id: z.number(),
  game: z.string(),
  platform: z.string(),
  status: z.string(),
  total_buzz: z.number(),
  sentiment_score: z.number(),
  emerging_issues: z.number(),
  top_tags: z.array(z.string()),
  review: z.string()
})

// Create a separate component for the drag handle
function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({
    id,
  })

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "game",
    header: "Game",
    cell: ({ row }) => (
      <div className="ml-2 font-medium">
        {row.original.game}
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "platform",
    header: "Platform",
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.platform}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-1.5">
        {row.original.status.includes("Stable") ? (
          <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
        ) : (
          <IconLoader />
        )}
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "total_buzz",
    header: () => <div className="w-full text-right">Total Buzz</div>,
    cell: ({ row }) => (
      <div className="text-right pr-4">
        {row.original.total_buzz.toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: "sentiment_score",
    header: () => <div className="w-full text-right">Sentiment Score</div>,
    cell: ({ row }) => (
      <div className="text-right pr-4">
        {row.original.sentiment_score}
      </div>
    ),
  },
  {
    accessorKey: "emerging_issues",
    header: "Emerging Issues",
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.emerging_issues}
      </div>
    ),
  },
  {
    accessorKey: "top_tags",
    header: "Top Tags",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1 max-w-[200px]">
        {row.original.top_tags.map((topic, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {topic}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "review",
    header: "Review Summary",
    cell: ({ row }) => (
      <div className="max-w-[400px] whitespace-normal">
        {row.original.review}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label="Open menu"
              variant="ghost"
              className="flex size-8 p-0 data-[state=open]:bg-muted"
            >
              <IconDotsVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem>
              <IconEye className="mr-2 size-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <IconClipboardCopy className="mr-2 size-4" />
              Copy Data
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

// 定义UX标签数据类型
export type UxTag = {
  tag_name: string;
  tag_description: string;
  sentiment_score: number;
  sentiment_label: string;
  volume: number;
  trend: number;
  tgi: number;
  sample_comment: string;
};

export type TagData = {
  id: number;
  game: string;
  tag_details: {
    ux: UxTag[];
    story: any[];
    risk: any[];
  };
};

export function DataTable({
  data: initialData,
  tagsData
}: {
  data: z.infer<typeof schema>[]
  tagsData?: TagData[]
}) {
  const [data, setData] = React.useState(() => initialData)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const [activeTab, setActiveTab] = React.useState("outline")
  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  // 定义 UX 表格的列配置
  const uxColumns = [
    { id: "id", label: "ID", checked: true },
    { id: "game", label: "Game", checked: true },
    { id: "ux_tag", label: "UX Tag", checked: true },
    { id: "description", label: "Description", checked: true },
    { id: "sentiment", label: "Sentiment", checked: true },
    { id: "volume", label: "Volume", checked: true },
    { id: "sample_comment", label: "Sample Comment", checked: true }
  ]
  
  // 定义 Story 表格的列配置
  const storyColumns = [
    { id: "id", label: "ID", checked: true },
    { id: "game", label: "Game", checked: true },
    { id: "story_tag", label: "Story Tag", checked: true },
    { id: "description", label: "Description", checked: true },
    { id: "sentiment", label: "Sentiment", checked: true },
    { id: "volume", label: "Volume", checked: true },
    { id: "sample_comment", label: "Sample Comment", checked: true }
  ]
  
  // 定义 Risk 表格的列配置
  const riskColumns = [
    { id: "id", label: "ID", checked: true },
    { id: "game", label: "Game", checked: true },
    { id: "risk_tag", label: "Risk Tag", checked: true },
    { id: "description", label: "Description", checked: true },
    { id: "sentiment", label: "Sentiment", checked: true },
    { id: "volume", label: "Volume", checked: true },
    { id: "sample_comment", label: "Sample Comment", checked: true }
  ]
  
  const [visibleUxColumns, setVisibleUxColumns] = React.useState(
    uxColumns.reduce((acc, column) => {
      acc[column.id] = column.checked
      return acc
    }, {} as Record<string, boolean>)
  )
  
  const [visibleStoryColumns, setVisibleStoryColumns] = React.useState(
    storyColumns.reduce((acc, column) => {
      acc[column.id] = column.checked
      return acc
    }, {} as Record<string, boolean>)
  )
  
  const [visibleRiskColumns, setVisibleRiskColumns] = React.useState(
    riskColumns.reduce((acc, column) => {
      acc[column.id] = column.checked
      return acc
    }, {} as Record<string, boolean>)
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  function handleTabChange(value: string) {
    setActiveTab(value)
  }

  return (
    <Tabs
      defaultValue="outline"
      className="w-full flex-col justify-start gap-6"
      onValueChange={handleTabChange}
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select defaultValue="outline">
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            size="sm"
            id="view-selector"
          >
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="outline">Outline</SelectItem>
            <SelectItem value="past-performance">UX</SelectItem>
            <SelectItem value="key-personnel">Story</SelectItem>
            <SelectItem value="focus-documents">Risk</SelectItem>
          </SelectContent>
        </Select>
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="outline">Outline</TabsTrigger>
          <TabsTrigger value="past-performance">
            UX
          </TabsTrigger>
          <TabsTrigger value="key-personnel">
            Story
          </TabsTrigger>
          <TabsTrigger value="focus-documents">Risk</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {activeTab === "outline" ? 
                table
                  .getAllColumns()
                  .filter(
                    (column) =>
                      typeof column.accessorFn !== "undefined" &&
                      column.getCanHide()
                  )
                  .map((column) => {
                    // 为列名称创建更用户友好的显示
                    const displayName = {
                      'game': 'Game',
                      'platform': 'Platform',
                      'status': 'Status',
                      'total_buzz': 'Total Buzz',
                      'sentiment_score': 'Sentiment Score',
                      'emerging_issues': 'Emerging Issues',
                      'top_tags': 'Top Tags',
                      'review': 'Review'
                    }[column.id] || column.id;
                    
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {displayName}
                      </DropdownMenuCheckboxItem>
                    )
                  }) 
                : activeTab === "past-performance" ?
                  uxColumns.map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={visibleUxColumns[column.id]}
                      onCheckedChange={(value) => {
                        setVisibleUxColumns({
                          ...visibleUxColumns,
                          [column.id]: !!value
                        })
                      }}
                    >
                      {column.label}
                    </DropdownMenuCheckboxItem>
                  ))
                : activeTab === "key-personnel" ?
                  storyColumns.map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={visibleStoryColumns[column.id]}
                      onCheckedChange={(value) => {
                        setVisibleStoryColumns({
                          ...visibleStoryColumns,
                          [column.id]: !!value
                        })
                      }}
                    >
                      {column.label}
                    </DropdownMenuCheckboxItem>
                  ))
                : 
                  riskColumns.map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={visibleRiskColumns[column.id]}
                      onCheckedChange={(value) => {
                        setVisibleRiskColumns({
                          ...visibleRiskColumns,
                          [column.id]: !!value
                        })
                      }}
                    >
                      {column.label}
                    </DropdownMenuCheckboxItem>
                  ))
              }
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm">
            <IconPlus />
            <span className="hidden lg:inline">Add Section</span>
          </Button>
        </div>
      </div>
      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent
        value="past-performance"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">UX Tags Analysis</h3>
          <div className="flex items-center gap-4 rounded-md border px-3 py-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
              <span className="text-sm">Positive</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
              <span className="text-sm">Negative</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-yellow-500"></span>
              <span className="text-sm">Mixed</span>
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              <TableRow>
                {visibleUxColumns.id && <TableHead>ID</TableHead>}
                {visibleUxColumns.game && <TableHead>Game</TableHead>}
                {visibleUxColumns.ux_tag && <TableHead>UX Tag</TableHead>}
                {visibleUxColumns.description && <TableHead>Description</TableHead>}
                {visibleUxColumns.sentiment && <TableHead>Sentiment</TableHead>}
                {visibleUxColumns.volume && <TableHead>Volume</TableHead>}
                {visibleUxColumns.sample_comment && <TableHead>Sample Comment</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {tagsData && tagsData.map((item: TagData) => (
                item.tag_details.ux && item.tag_details.ux.map((tag: UxTag, tagIndex: number) => (
                  <TableRow key={`${item.id}-${tagIndex}`}>
                    {visibleUxColumns.id && <TableCell>{tagIndex === 0 ? item.id : ''}</TableCell>}
                    {visibleUxColumns.game && <TableCell className="font-medium">{tagIndex === 0 ? item.game : ''}</TableCell>}
                    {visibleUxColumns.ux_tag && (
                      <TableCell>
                        <Badge variant="outline" className={`px-1.5 ${tag.sentiment_label === "Positive" ? "text-green-500" : tag.sentiment_label === "Negative" ? "text-red-500" : "text-yellow-500"}`}>
                          {tag.tag_name}
                        </Badge>
                      </TableCell>
                    )}
                    {visibleUxColumns.description && (
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{tag.tag_description}</span>
                      </TableCell>
                    )}
                    {visibleUxColumns.sentiment && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`inline-block w-2 h-2 rounded-full ${tag.sentiment_label === "Positive" ? "bg-green-500" : tag.sentiment_label === "Negative" ? "bg-red-500" : "bg-yellow-500"}`}></span>
                          <span className={`font-medium ${tag.sentiment_label === "Positive" ? "text-green-600" : tag.sentiment_label === "Negative" ? "text-red-600" : "text-yellow-600"}`}>{(tag.sentiment_score * 100).toFixed(0)}%</span>
                        </div>
                      </TableCell>
                    )}
                    {visibleUxColumns.volume && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{tag.volume}</span>
                          <Badge variant="outline" className={`px-1.5 text-xs ${tag.trend > 1 ? "text-green-500" : "text-red-500"}`}>
                            {tag.trend > 1 ? `↑ ${(tag.trend * 100 - 100).toFixed(0)}%` : `↓ ${(100 - tag.trend * 100).toFixed(0)}%`}
                          </Badge>
                        </div>
                      </TableCell>
                    )}
                    {visibleUxColumns.sample_comment && (
                      <TableCell>
                        <div className="max-w-xs truncate text-xs text-muted-foreground">
                          {tag.sample_comment}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ))}
            </TableBody>
          </Table>
        </div>
      </TabsContent>
      <TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Story Tags Analysis</h3>
          <div className="flex items-center gap-4 rounded-md border px-3 py-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
              <span className="text-sm">Positive</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
              <span className="text-sm">Negative</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-yellow-500"></span>
              <span className="text-sm">Mixed</span>
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              <TableRow>
                {visibleStoryColumns.id && <TableHead>ID</TableHead>}
                {visibleStoryColumns.game && <TableHead>Game</TableHead>}
                {visibleStoryColumns.story_tag && <TableHead>Story Tag</TableHead>}
                {visibleStoryColumns.description && <TableHead>Description</TableHead>}
                {visibleStoryColumns.sentiment && <TableHead>Sentiment</TableHead>}
                {visibleStoryColumns.volume && <TableHead>Volume</TableHead>}
                {visibleStoryColumns.sample_comment && <TableHead>Sample Comment</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {tagsData && tagsData.map((item: TagData) => (
                item.tag_details.story && item.tag_details.story.map((tag: any, tagIndex: number) => (
                  <TableRow key={`${item.id}-story-${tagIndex}`}>
                    {visibleStoryColumns.id && <TableCell>{tagIndex === 0 ? item.id : ''}</TableCell>}
                    {visibleStoryColumns.game && <TableCell className="font-medium">{tagIndex === 0 ? item.game : ''}</TableCell>}
                    {visibleStoryColumns.story_tag && (
                      <TableCell>
                        <Badge variant="outline" className={`px-1.5 ${tag.sentiment_label === "Positive" ? "text-green-500" : tag.sentiment_label === "Negative" ? "text-red-500" : "text-yellow-500"}`}>
                          {tag.tag_name}
                        </Badge>
                      </TableCell>
                    )}
                    {visibleStoryColumns.description && (
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{tag.tag_description}</span>
                      </TableCell>
                    )}
                    {visibleStoryColumns.sentiment && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`inline-block w-2 h-2 rounded-full ${tag.sentiment_label === "Positive" ? "bg-green-500" : tag.sentiment_label === "Negative" ? "bg-red-500" : "bg-yellow-500"}`}></span>
                          <span className={`font-medium ${tag.sentiment_label === "Positive" ? "text-green-600" : tag.sentiment_label === "Negative" ? "text-red-600" : "text-yellow-600"}`}>{(tag.sentiment_score * 100).toFixed(0)}%</span>
                        </div>
                      </TableCell>
                    )}
                    {visibleStoryColumns.volume && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{tag.volume}</span>
                          <Badge variant="outline" className={`px-1.5 text-xs ${tag.trend > 1 ? "text-green-500" : "text-red-500"}`}>
                            {tag.trend > 1 ? `↑ ${(tag.trend * 100 - 100).toFixed(0)}%` : `↓ ${(100 - tag.trend * 100).toFixed(0)}%`}
                          </Badge>
                        </div>
                      </TableCell>
                    )}
                    {visibleStoryColumns.sample_comment && (
                      <TableCell>
                        <div className="max-w-xs truncate text-xs text-muted-foreground">
                          {tag.sample_comment}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ))}
            </TableBody>
          </Table>
        </div>
      </TabsContent>
      <TabsContent value="focus-documents" className="flex flex-col px-4 lg:px-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Risk Tags Analysis</h3>
          <div className="flex items-center gap-4 rounded-md border px-3 py-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
              <span className="text-sm">Positive</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
              <span className="text-sm">Negative</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-yellow-500"></span>
              <span className="text-sm">Mixed</span>
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              <TableRow>
                {visibleRiskColumns.id && <TableHead>ID</TableHead>}
                {visibleRiskColumns.game && <TableHead>Game</TableHead>}
                {visibleRiskColumns.risk_tag && <TableHead>Risk Tag</TableHead>}
                {visibleRiskColumns.description && <TableHead>Description</TableHead>}
                {visibleRiskColumns.sentiment && <TableHead>Sentiment</TableHead>}
                {visibleRiskColumns.volume && <TableHead>Volume</TableHead>}
                {visibleRiskColumns.sample_comment && <TableHead>Sample Comment</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {tagsData && tagsData.map((item: TagData) => (
                item.tag_details.risk && item.tag_details.risk.map((tag: any, tagIndex: number) => (
                  <TableRow key={`${item.id}-risk-${tagIndex}`}>
                    {visibleRiskColumns.id && <TableCell>{tagIndex === 0 ? item.id : ''}</TableCell>}
                    {visibleRiskColumns.game && <TableCell className="font-medium">{tagIndex === 0 ? item.game : ''}</TableCell>}
                    {visibleRiskColumns.risk_tag && (
                      <TableCell>
                        <Badge variant="outline" className={`px-1.5 ${tag.sentiment_label === "Positive" ? "text-green-500" : tag.sentiment_label === "Negative" ? "text-red-500" : "text-yellow-500"}`}>
                          {tag.tag_name}
                        </Badge>
                      </TableCell>
                    )}
                    {visibleRiskColumns.description && (
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{tag.tag_description}</span>
                      </TableCell>
                    )}
                    {visibleRiskColumns.sentiment && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`inline-block w-2 h-2 rounded-full ${tag.sentiment_label === "Positive" ? "bg-green-500" : tag.sentiment_label === "Negative" ? "bg-red-500" : "bg-yellow-500"}`}></span>
                          <span className={`font-medium ${tag.sentiment_label === "Positive" ? "text-green-600" : tag.sentiment_label === "Negative" ? "text-red-600" : "text-yellow-600"}`}>{(tag.sentiment_score * 100).toFixed(0)}%</span>
                        </div>
                      </TableCell>
                    )}
                    {visibleRiskColumns.volume && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{tag.volume}</span>
                          <Badge variant="outline" className={`px-1.5 text-xs ${tag.trend > 1 ? "text-green-500" : "text-red-500"}`}>
                            {tag.trend > 1 ? `↑ ${(tag.trend * 100 - 100).toFixed(0)}%` : `↓ ${(100 - tag.trend * 100).toFixed(0)}%`}
                          </Badge>
                        </div>
                      </TableCell>
                    )}
                    {visibleRiskColumns.sample_comment && (
                      <TableCell>
                        <div className="max-w-xs truncate text-xs text-muted-foreground">
                          {tag.sample_comment}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ))}
            </TableBody>
          </Table>
        </div>
      </TabsContent>
    </Tabs>
  )
}

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig

function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  return (
    <div className="ml-2 truncate">
      <span className="text-sm font-medium">{item.game}</span>
    </div>
  )
}
