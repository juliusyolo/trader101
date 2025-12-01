import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image"
import MobileRecentTransactions from "@/components/dashboard/recent-transactions/mobile-recent-transactions"
import BellIcon from "@/components/icons/bell"

export function MobileHeader() {
  // const transactionCount = 0 // TODO: Fetch count if needed, or remove badge


  return (
    <div className="lg:hidden h-header-mobile sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Sidebar Menu */}
        <SidebarTrigger />

        {/* Center: Trader101 Logo */}
        <div className="flex items-center gap-2">
          <Image
            src="/images/trader101-logo.png"
            alt="trader101 logo"
            width={32}
            height={32}
            className="object-contain"
          />
        </div>

        <Sheet>
          {/* Right: Recent Transactions Menu */}
          <SheetTrigger asChild>
            <Button variant="secondary" size="icon" className="relative">
              {/* Badge removed as we don't have count passed down anymore */}

              <BellIcon className="size-4" />
            </Button>
          </SheetTrigger>

          {/* Recent Transactions Sheet */}
          <SheetContent closeButton={false} side="right" className="w-[80%] max-w-md p-0">
            <MobileRecentTransactions />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
