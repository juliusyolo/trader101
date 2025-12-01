"use client"

import * as React from "react"
import { XAxis, YAxis, CartesianGrid, Area, AreaChart } from "recharts"

import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import type { TimePeriod } from "@/types/dashboard"
import { Bullet } from "@/components/ui/bullet"
import { Skeleton } from "@/components/ui/skeleton"

type ChartDataPoint = {
  date: string
  earnings: number
}

const chartConfig = {
  earnings: {
    label: "Trading Earnings",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export default function DashboardChart() {
  const [activeTab, setActiveTab] = React.useState<TimePeriod>("day")
  const [chartData, setChartData] = useState<Record<TimePeriod, ChartDataPoint[]>>({
    day: [],
    week: [],
    month: [],
    year: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchChartData() {
      try {
        const { data, error } = await supabase
          .from('chart_data_view')
          .select('*')
          .order('sort_date', { ascending: true })

        if (error) {
          console.error('Error fetching chart data:', error)
        } else {
          // Group by period
          const groupedData: Record<TimePeriod, ChartDataPoint[]> = {
            day: [],
            week: [],
            month: [],
            year: []
          }

            ; (data as any[]).forEach(item => {
              if (groupedData[item.period as TimePeriod]) {
                groupedData[item.period as TimePeriod].push({
                  date: item.date,
                  earnings: Number(item.earnings)
                })
              }
            })

          setChartData(groupedData)
        }
      } catch (err) {
        console.error('Unexpected error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchChartData()
  }, [])

  const handleTabChange = (value: string) => {
    if (value === "day" || value === "week" || value === "month" || value === "year") {
      setActiveTab(value as TimePeriod)
    }
  }

  const formatYAxisValue = (value: number) => {
    if (value === 0) {
      return "0"
    }

    const absValue = Math.abs(value)
    const sign = value < 0 ? "-" : ""

    if (absValue >= 1000000) {
      return `${sign}$${(absValue / 1000000).toFixed(1)}M`
    } else if (absValue >= 1000) {
      return `${sign}$${(absValue / 1000).toFixed(1)}K`
    }
    return `${sign}$${absValue}`
  }

  const renderChart = (data: ChartDataPoint[]) => {
    return (
      <div className="bg-accent rounded-lg p-3">
        <ChartContainer className="md:aspect-[3/1] w-full" config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 0,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <defs>
              <linearGradient id="fillEarnings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-earnings)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-earnings)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid
              horizontal={false}
              strokeDasharray="8 8"
              strokeWidth={2}
              stroke="var(--muted-foreground)"
              opacity={0.3}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={12}
              strokeWidth={1.5}
              className="uppercase text-sm fill-muted-foreground"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={6}
              width={60}
              className="text-sm fill-muted-foreground"
              tickFormatter={formatYAxisValue}
              domain={["auto", "auto"]}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  className="min-w-[200px] px-4 py-3"
                  formatter={(value) => `$${value.toLocaleString()}`}
                />
              }
            />
            <Area
              dataKey="earnings"
              type="linear"
              fill="url(#fillEarnings)"
              fillOpacity={0.4}
              stroke="var(--color-earnings)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    )
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="max-md:gap-4">
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex items-center gap-6">
          {Object.entries(chartConfig).map(([key, value]) => (
            <ChartLegend key={key} label={value.label} color={value.color} />
          ))}
        </div>
        <div className="flex items-center justify-between max-md:contents">
          <TabsList className="max-md:w-full">
            <TabsTrigger value="day">DAY</TabsTrigger>
            <TabsTrigger value="week">WEEK</TabsTrigger>
            <TabsTrigger value="month">MONTH</TabsTrigger>
            <TabsTrigger value="year">YEAR</TabsTrigger>
          </TabsList>
        </div>
      </div>
      <TabsContent value="day" className="space-y-4">
        {loading ? <Skeleton className="h-[300px] w-full rounded-lg" /> : renderChart(chartData.day)}
      </TabsContent>
      <TabsContent value="week" className="space-y-4">
        {loading ? <Skeleton className="h-[300px] w-full rounded-lg" /> : renderChart(chartData.week)}
      </TabsContent>
      <TabsContent value="month" className="space-y-4">
        {loading ? <Skeleton className="h-[300px] w-full rounded-lg" /> : renderChart(chartData.month)}
      </TabsContent>
      <TabsContent value="year" className="space-y-4">
        {loading ? <Skeleton className="h-[300px] w-full rounded-lg" /> : renderChart(chartData.year)}
      </TabsContent>
    </Tabs>
  )
}

export const ChartLegend = ({
  label,
  color,
}: {
  label: string
  color: string
}) => {
  return (
    <div className="flex items-center gap-2 uppercase">
      <Bullet style={{ backgroundColor: color }} className="rotate-45" />
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
    </div>
  )
}
