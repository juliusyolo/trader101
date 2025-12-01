"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bullet } from "@/components/ui/bullet"
import TransactionItem from "./transaction-item"
import type { Notification } from "@/types/dashboard"
import { AnimatePresence, motion } from "framer-motion"

import { supabase } from "@/lib/supabase"
import { useEffect } from "react"

interface RecentTransactionsProps {
  initialTransactions?: Notification[] // Make optional
}

export default function RecentTransactions({ initialTransactions = [] }: RecentTransactionsProps) {
  const [transactions, setTransactions] = useState<Notification[]>(initialTransactions)
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .order('time', { ascending: false })
          .limit(6) // Limit to recent ones

        if (error) {
          console.error('Error fetching transactions:', error)
        } else {
          // Map transactions to notifications format
          const mappedData = (data as any[]).map(tx => ({
            id: tx.id,
            title: `${tx.symbol} ${tx.type}`,
            message: `Qty: ${Number(tx.quantity).toFixed(3)} | Price: $${Number(tx.price).toFixed(3)} | Fee: $${Number(tx.transaction_fee).toFixed(3)}`,
            timestamp: tx.time,
            type: tx.type === 'BUY' ? 'info' : 'success', // Simple color coding
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

  const displayedTransactions = showAll ? transactions : transactions.slice(0, 3)

  const markAsRead = (id: string) => {
    setTransactions((prev) => prev.map((txn) => (txn.id === id ? { ...txn, read: true } : txn)))
  }

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((txn) => txn.id !== id))
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex items-center justify-between pl-3 pr-1">
        <CardTitle className="flex items-center gap-2.5 text-sm font-medium uppercase">
          <Bullet />
          Recent Transactions
        </CardTitle>
      </CardHeader>

      <CardContent className="bg-accent p-1.5 overflow-hidden">
        <div className="space-y-2">
          {loading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Loading transactions...</div>
          ) : (
            <AnimatePresence initial={false} mode="popLayout">
              {displayedTransactions.map((transaction) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  key={transaction.id}
                >
                  <TransactionItem transaction={transaction} onMarkAsRead={markAsRead} onDelete={deleteTransaction} />
                </motion.div>
              ))}

              {transactions.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">No recent transactions</p>
                </div>
              )}

              {transactions.length > 3 && (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="w-full"
                >
                  <Button variant="ghost" size="sm" onClick={() => setShowAll(!showAll)} className="w-full">
                    {showAll ? "Show Less" : `Show All (${transactions.length})`}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
