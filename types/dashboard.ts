export interface DashboardStat {
  label: string
  value: string
  description: string
  intent: "positive" | "negative" | "neutral"
  tag?: string
  direction?: "up" | "down"
}

export interface ChartDataPoint {
  date: string
  spendings: number
  sales: number
  coffee: number
  earnings?: number
}

export interface ChartData {
  day: ChartDataPoint[]
  week: ChartDataPoint[]
  month: ChartDataPoint[]
  year: ChartDataPoint[]
}

export interface RebelRanking {
  id: number
  name: string
  handle: string
  streak: string
  points: number
  avatar: string
  featured?: boolean
  subtitle?: string
}

export interface SecurityStatus {
  title: string
  value: string
  status: string
  variant: "success" | "warning" | "destructive"
}

export interface Notification {
  id: string
  title: string
  message: string
  timestamp: string
  type: "info" | "warning" | "success" | "error"
  read: boolean
  priority: "low" | "medium" | "high"
}

export interface WidgetData {
  location: string
  timezone: string
  temperature: string
  weather: string
  date: string
}

export type TimePeriod = "day" | "week" | "month" | "year"
