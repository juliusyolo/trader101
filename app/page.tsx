"use client"

import DashboardPageLayout from "@/components/dashboard/layout"
import DashboardStat from "@/components/dashboard/stat"
import DashboardChart from "@/components/dashboard/chart"
import BracketsIcon from "@/components/icons/brackets"
import GearIcon from "@/components/icons/gear"
import ProcessorIcon from "@/components/icons/proccesor"
import BoomIcon from "@/components/icons/boom"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

// Icon mapping
const iconMap = {
  gear: GearIcon,
  proccesor: ProcessorIcon,
  boom: BoomIcon,
}

interface DashboardStatData {
  id: string
  label: string
  value: string
  description: string
  intent: "positive" | "negative" | "neutral" | "warning"
  icon: string
  direction: "up" | "down" | "neutral"
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStatData[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string>("Loading...")

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch stats
        const { data: statsData, error: statsError } = await supabase
          .from('dashboard_stats_view')
          .select('*')
          .order('sort_order', { ascending: true })

        if (statsError) {
          console.error('Error fetching dashboard stats:', statsError)
        } else {
          setStats(statsData as DashboardStatData[])
        }

        // Fetch last updated time
        const { data: statusData, error: statusError } = await supabase
          .from('system_status')
          .select('last_updated')
          .limit(1)
          .single()

        if (statusError) {
          console.error('Error fetching system status:', statusError)
          setLastUpdated("Unknown")
        } else if (statusData) {
          const date = new Date(statusData.last_updated)
          const year = date.getFullYear()
          const month = String(date.getMonth() + 1).padStart(2, '0')
          const day = String(date.getDate()).padStart(2, '0')
          const hours = String(date.getHours()).padStart(2, '0')
          const minutes = String(date.getMinutes()).padStart(2, '0')
          const seconds = String(date.getSeconds()).padStart(2, '0')
          setLastUpdated(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`)
        }

      } catch (err) {
        console.error('Unexpected error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <DashboardPageLayout
      header={{
        title: "Overview",
        description: `Last updated ${lastUpdated}`,
        icon: BracketsIcon,
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow p-6 h-[140px] flex flex-col justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-3/4" />
              </div>
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))
        ) : (
          stats.map((stat) => (
            <DashboardStat
              key={stat.id}
              label={stat.label}
              value={stat.value}
              description={stat.description}
              tag={""}
              intent={stat.intent as any}
              direction={stat.direction as any}
            />
          ))
        )}
      </div>

      <div className="w-full">
        <DashboardChart />
      </div>
    </DashboardPageLayout>
  )
}
