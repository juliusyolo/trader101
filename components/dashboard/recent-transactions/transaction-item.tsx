"use client"
import { cn } from "@/lib/utils"
import type { Notification } from "@/types/dashboard"

interface TransactionItemProps {
  transaction: Notification
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
}

export default function TransactionItem({ transaction, onMarkAsRead, onDelete }: TransactionItemProps) {
  const isSuccess = transaction.type === "success"
  const isWarning = transaction.type === "warning"

  return (
    <div className="w-full text-left px-3 py-3 rounded-md border-b last:border-b-0">
      <div className="flex items-start gap-3">
        <div
          className={cn("mt-1 shrink-0 w-2 h-2 rounded-full", isSuccess && "bg-success", isWarning && "bg-warning")}
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase leading-tight truncate">{transaction.title}</p>
          <p className="text-xs text-muted-foreground leading-tight mt-1 line-clamp-2">{transaction.message}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {(() => {
              const d = new Date(transaction.timestamp)
              const year = d.getFullYear()
              const month = String(d.getMonth() + 1).padStart(2, '0')
              const day = String(d.getDate()).padStart(2, '0')
              const hours = String(d.getHours()).padStart(2, '0')
              const minutes = String(d.getMinutes()).padStart(2, '0')
              const seconds = String(d.getSeconds()).padStart(2, '0')
              return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
            })()}
          </p>
        </div>
      </div>
    </div>
  )
}
