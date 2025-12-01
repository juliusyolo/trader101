"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface TradeRecord {
  id: string
  symbol: string
  type: "BUY" | "SELL"
  quantity: number
  price: number
  transactionFee: number
  time: string
}

import { supabase } from "@/lib/supabase"
import { useEffect } from "react"

export default function TradeDetailsTable() {
  const [trades, setTrades] = useState<TradeRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [sortColumn, setSortColumn] = useState<keyof TradeRecord>("time")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    async function fetchTrades() {
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .order('time', { ascending: false })
          .limit(100)

        if (error) {
          console.error('Error fetching trades:', error)
        } else {
          // Transform data to match TradeRecord interface
          const formattedData = (data as any[]).map(tx => ({
            id: tx.id,
            symbol: tx.symbol,
            type: tx.type,
            quantity: tx.quantity,
            price: tx.price,
            transactionFee: tx.transaction_fee,
            time: (() => {
              const d = new Date(tx.time)
              const year = d.getFullYear()
              const month = String(d.getMonth() + 1).padStart(2, '0')
              const day = String(d.getDate()).padStart(2, '0')
              const hours = String(d.getHours()).padStart(2, '0')
              const minutes = String(d.getMinutes()).padStart(2, '0')
              const seconds = String(d.getSeconds()).padStart(2, '0')
              return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
            })()
          }))
          setTrades(formattedData)
        }
      } catch (err) {
        console.error('Unexpected error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTrades()
  }, [])

  const handleSort = (column: keyof TradeRecord) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("desc")
    }
  }

  const sortedTrades = [...trades].sort((a, b) => {
    const aValue = a[sortColumn]
    const bValue = b[sortColumn]

    if (typeof aValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue as string) : (bValue as string).localeCompare(aValue)
    }

    if (typeof aValue === "number") {
      return sortDirection === "asc" ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number)
    }

    return 0
  })

  if (loading) {
    return (
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {Array(6).fill(0).map((_, i) => (
                  <th key={i} className="px-4 py-3 text-left text-sm font-semibold">
                    <Skeleton className="h-4 w-20" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array(5).fill(0).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  {Array(6).fill(0).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left text-sm font-semibold">
                <button
                  onClick={() => handleSort("symbol")}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  Symbol {sortColumn === "symbol" && (sortDirection === "asc" ? "↑" : "↓")}
                </button>
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                <button
                  onClick={() => handleSort("type")}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  Type {sortColumn === "type" && (sortDirection === "asc" ? "↑" : "↓")}
                </button>
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold">
                <button
                  onClick={() => handleSort("quantity")}
                  className="hover:text-primary transition-colors cursor-pointer ml-auto"
                >
                  Quantity {sortColumn === "quantity" && (sortDirection === "asc" ? "↑" : "↓")}
                </button>
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold">
                <button
                  onClick={() => handleSort("price")}
                  className="hover:text-primary transition-colors cursor-pointer ml-auto"
                >
                  Price {sortColumn === "price" && (sortDirection === "asc" ? "↑" : "↓")}
                </button>
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold">
                <button
                  onClick={() => handleSort("transactionFee")}
                  className="hover:text-primary transition-colors cursor-pointer ml-auto"
                >
                  Fee {sortColumn === "transactionFee" && (sortDirection === "asc" ? "↑" : "↓")}
                </button>
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold">
                <button
                  onClick={() => handleSort("time")}
                  className="hover:text-primary transition-colors cursor-pointer ml-auto"
                >
                  Time {sortColumn === "time" && (sortDirection === "asc" ? "↑" : "↓")}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedTrades.map((trade) => (
              <tr key={trade.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-semibold">{trade.symbol}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-semibold ${trade.type === "BUY" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                      }`}
                  >
                    {trade.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">{Number(trade.quantity).toFixed(3)}</td>
                <td className="px-4 py-3 text-right">${trade.price.toFixed(3)}</td>
                <td className="px-4 py-3 text-right">${trade.transactionFee.toFixed(3)}</td>
                <td className="px-4 py-3 text-right text-muted-foreground">{trade.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
