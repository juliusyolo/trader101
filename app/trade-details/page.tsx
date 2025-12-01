import DashboardPageLayout from "@/components/dashboard/layout"
import BoomIcon from "@/components/icons/boom"

import TradeDetailsTable from "@/components/trade-details/trade-details-table"
export default function TradeDetailsPage() {
  return (
    <DashboardPageLayout
      header={{
        title: "Trade Details",
        description: "View all Julius's trading transactions",
        icon: BoomIcon,
      }}
    >
      <TradeDetailsTable />
    </DashboardPageLayout>
  )
}
