"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "An interactive area chart"

const chartData = [
  { day: "Day 0", shadows: 320, valhalla: 180 },
  { day: "Day 5", shadows: 155, valhalla: 72 },
  { day: "Day 10", shadows: 128, valhalla: 95 },
  { day: "Day 15", shadows: 94, valhalla: 88 },
  { day: "Day 20", shadows: 35, valhalla: 65 },
  { day: "Day 25", shadows: 60, valhalla: 42 },
  { day: "Day 30", shadows: 70, valhalla: 85 },
  { day: "Day 35", shadows: 58, valhalla: 76 },
  { day: "Day 40", shadows: 82, valhalla: 45 },
  { day: "Day 45", shadows: 52, valhalla: 87 },
  { day: "Day 50", shadows: 68, valhalla: 132 },
  { day: "Day 55", shadows: 72, valhalla: 95 },
  { day: "Day 60", shadows: 75, valhalla: 78 },
  { day: "Day 65", shadows: 68, valhalla: 65 },
  { day: "Day 70", shadows: 63, valhalla: 87 },
  { day: "Day 75", shadows: 58, valhalla: 76 },
  { day: "Day 80", shadows: 72, valhalla: 85 },
  { day: "Day 85", shadows: 65, valhalla: 92 },
  { day: "Day 90", shadows: 78, valhalla: 68 },
  { day: "Day 95", shadows: 68, valhalla: 63 },
  { day: "Day 100", shadows: 72, valhalla: 76 },
  { day: "Day 105", shadows: 83, valhalla: 72 },
  { day: "Day 110", shadows: 68, valhalla: 54 },
  { day: "Day 115", shadows: 72, valhalla: 48 },
  { day: "Day 120", shadows: 68, valhalla: 72 },
  { day: "Day 125", shadows: 75, valhalla: 65 },
  { day: "Day 130", shadows: 62, valhalla: 58 },
  { day: "Day 135", shadows: 58, valhalla: 63 },
  { day: "Day 140", shadows: 63, valhalla: 48 },
  { day: "Day 145", shadows: 72, valhalla: 56 },
  { day: "Day 150", shadows: 68, valhalla: 52 },
  { day: "Day 155", shadows: 72, valhalla: 68 },
  { day: "Day 160", shadows: 54, valhalla: 58 },
  { day: "Day 165", shadows: 62, valhalla: 72 },
  { day: "Day 170", shadows: 68, valhalla: 63 },
  { day: "Day 175", shadows: 58, valhalla: 52 },
  { day: "Day 180", shadows: 48, valhalla: 63 },
]

const chartConfig = {
  visitors: {
    label: "Mentions",
  },
  shadows: {
    label: "Assassin's Creed Shadows",
    color: "#fbbf24",
  },
  valhalla: {
    label: "Assassin's Creed Valhalla",
    color: "#d1d5db",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("180d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("90d")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const dayNumber = parseInt(item.day.split(" ")[1])
    let daysToShow = 180
    if (timeRange === "90d") {
      daysToShow = 90
    } else if (timeRange === "30d") {
      daysToShow = 30
    }
    return dayNumber <= daysToShow
  })

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Assassin's Creed Shadows vs Valhalla</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Daily buzz on social platforms since release (Day 0–180)
          </span>
          <span className="@[540px]/card:hidden">Daily Mentions since release</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="180d">Day 0-180</ToggleGroupItem>
            <ToggleGroupItem value="90d">Day 0-90</ToggleGroupItem>
            <ToggleGroupItem value="30d">Day 0-30</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Day 0-180" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="180d" className="rounded-lg">
                Day 0-180
              </SelectItem>
              <SelectItem value="90d" className="rounded-lg">
                Day 0-90
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Day 0-30
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillShadows" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-shadows)"
                  stopOpacity={0.7}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-shadows)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillValhalla" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-valhalla)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-valhalla)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                return value
              }}
            />
            <Area
              dataKey="shadows"
              type="monotone"
              stroke="var(--color-shadows)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#fillShadows)"
            />
            <Area
              dataKey="valhalla"
              type="monotone"
              stroke="var(--color-valhalla)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#fillValhalla)"
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return value
                  }}
                  indicator="dot"
                />
              }
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
