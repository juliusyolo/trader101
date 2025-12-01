"use client"

import type * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import BracketsIcon from "@/components/icons/brackets"
import BoomIcon from "@/components/icons/boom"
import { Bullet } from "@/components/ui/bullet"
import Image from "next/image"
import { usePathname } from "next/navigation"

// This is sample data for the sidebar
const data = {
  navMain: [
    {
      title: "Hello, Trader101",
      items: [
        {
          title: "Overview",
          url: "/",
          icon: BracketsIcon,
          locked: false
        },
        {
          title: "Trade Details",
          url: "/trade-details",
          icon: BoomIcon,
          locked: false
        },
      ],
    },
  ]
}

export function DashboardSidebar({ className, ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar {...props} className={cn("py-sides", className)}>
      <SidebarHeader className="rounded-t-lg flex gap-3 flex-row rounded-b-none">
        <div className="flex overflow-clip size-12 shrink-0 items-center justify-center rounded bg-sidebar-primary-foreground/10 transition-colors group-hover:bg-sidebar-primary">
          <Image
            src="/images/trader101-logo.png"
            alt="trader101 logo"
            width={48}
            height={48}
            className="object-contain group-hover:scale-[1.1] origin-center transition-transform"
          />
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="text-2xl font-display">trader101</span>
          <span className="text-xs uppercase">Trading Record</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {data.navMain.map((group, i) => (
          <SidebarGroup className={cn(i === 0 && "rounded-t-none")} key={group.title}>
            <SidebarGroupLabel>
              <Bullet className="mr-2" />
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = item.url === "/" ? pathname === "/" : pathname?.startsWith(item.url)
                  return (
                    <SidebarMenuItem
                      key={item.title}
                      className={cn(item.locked && "pointer-events-none opacity-50")}
                      data-disabled={item.locked}
                    >
                      <SidebarMenuButton
                        asChild={!item.locked}
                        isActive={isActive}
                        disabled={item.locked}
                        className={cn("disabled:cursor-not-allowed", item.locked && "pointer-events-none")}
                      >
                        {item.locked ? (
                          <div className="flex items-center gap-3 w-full">
                            <item.icon className="size-5" />
                            <span>{item.title}</span>
                          </div>
                        ) : (
                          <a href={item.url}>
                            <item.icon className="size-5" />
                            <span>{item.title}</span>
                          </a>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-0 flex flex-col gap-4 pb-4 px-2 md:px-0">
        {/* Manifesto Section */}
        <div className="px-2 md:px-4 py-3 bg-sidebar-primary-foreground/5 rounded border border-sidebar-primary-foreground/10">
          <p className="text-xs text-sidebar-foreground/70 leading-relaxed">
            <span className="font-semibold text-sidebar-foreground">Julius’s Trading Journey.</span> Make small improvements every day.
          </p>
        </div>

        {/* Social Links */}
        <div className="px-2 md:px-4 flex gap-3 justify-center">
          <a
            href="https://x.com/_juliusyolo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
            aria-label="Twitter"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
          </a>
          <a
            href="https://t.me/trader101_official"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
            aria-label="Telegram"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.328-.373-.115l-6.869 4.332-2.961-.924c-.643-.204-.658-.643.135-.953l11.593-4.47c.537-.196 1.006.128.832.941z" />
            </svg>
          </a>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
