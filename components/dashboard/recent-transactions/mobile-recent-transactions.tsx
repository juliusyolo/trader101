"use client"
import { Badge } from "@/components/ui/badge"
import { Bullet } from "@/components/ui/bullet"
import type { Notification } from "@/types/dashboard"
import { SheetClose, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import TransactionItem from "./transaction-item"

import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface MobileRecentTransactionsProps {
  initialTransactions?: Notification[]
}

export default function MobileRecentTransactions({ initialTransactions = [] }: MobileRecentTransactionsProps) {
  const [transactions, setTransactions] = useState<Notification[]>(initialTransactions)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .order('time', { ascending: false })
          .limit(6)

        if (error) {
          console.error('Error fetching transactions:', error)
        } else {
          // Map transactions to notifications/transactions format
          const mappedData = (data as any[]).map(tx => ({
            id: tx.id,
            title: `${tx.symbol} ${tx.type}`,
            message: `Qty: ${Number(tx.quantity).toFixed(3)} | Price: $${Number(tx.price).toFixed(3)} | Fee: $${Number(tx.transaction_fee).toFixed(3)}`,
            timestamp: tx.time,
            type: tx.type === 'BUY' ? 'info' : 'success',
            read: false,
            priority: 'medium'
          }))
          setTransactions(mappedData as Notification[])
        }
      } catch (err) {
        console.error('Unexpected error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])
  return (
    <div className="h-full flex flex-col">
      {/* Accessibility Title */}
      <SheetHeader className="sr-only">
        <SheetTitle>Recent Transactions</SheetTitle>
      </SheetHeader>

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <Bullet />
          <h2 className="text-sm font-medium uppercase">Recent Transactions</h2>
        </div>
        <SheetClose>
          <Badge variant="secondary" className="uppercase text-muted-foreground">
            Close
          </Badge>
        </SheetClose>
      </div>

      {/* Transactions List */}
      <div className="flex-1 overflow-y-auto overflow-x-clip p-2 space-y-2 bg-muted">
        {loading ? (
          Array(5).fill(0).map((_, i) => (
            <div key={i} className="p-3 bg-card rounded-lg border border-border">
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          ))
        ) : transactions.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-sm text-muted-foreground">No transactions</p>
          </div>
        ) : (
          transactions.map((transaction) => (
            <div key={transaction.id}>
              <TransactionItem
                transaction={transaction}
                onMarkAsRead={() => { }}
                onDelete={() => { }}
              />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
