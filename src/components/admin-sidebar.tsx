"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Users, FileQuestion, BarChart3, LogOut, ShieldCheck, House, MessageSquarePlus, ChevronLeft, ChevronRight, PanelLeftClose, PanelLeftOpen } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { logout } from "@/app/admin/login/actions"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface AdminSidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

export function AdminSidebar({ isCollapsed, onToggle }: AdminSidebarProps) {
  return (
    <TooltipProvider delay={0}>
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-20 hidden flex-col border-r bg-background sm:flex transition-all duration-300 overflow-hidden",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex h-14 items-center justify-between border-b px-4 lg:h-[60px] lg:px-6">
          {!isCollapsed && (
            <Link href="/" className="flex items-center gap-2 font-semibold text-[#21479B] dark:text-white truncate">
              <ShieldCheck className="h-6 w-6" />
              <span className="text-sm lg:text-base">Admin Panel</span>
            </Link>
          )}
          {isCollapsed && (
            <ShieldCheck className="h-6 w-6 text-[#21479B] dark:text-white mx-auto" />
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggle}
            className={cn("h-8 w-8", isCollapsed ? "mx-auto mt-0" : "")}
          >
            {isCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>
        </div>
        
        <div className="flex-1 py-4">
          <nav className="grid items-start px-2 text-sm font-medium">
            <SidebarLink 
              href="/admin" 
              icon={<House className="h-4 w-4" />} 
              label="Dashboard" 
              isCollapsed={isCollapsed} 
            />
            <SidebarLink 
              href="/admin/questions" 
              icon={<FileQuestion className="h-4 w-4" />} 
              label="Questions" 
              isCollapsed={isCollapsed} 
            />
            <SidebarLink 
              href="/admin/results" 
              icon={<BarChart3 className="h-4 w-4" />} 
              label="Test Results" 
              isCollapsed={isCollapsed} 
            />
            <SidebarLink 
              href="/admin/users" 
              icon={<Users className="h-4 w-4" />} 
              label="Admin Users" 
              isCollapsed={isCollapsed} 
            />
            <SidebarLink 
              href="/admin/feedbacks" 
              icon={<MessageSquarePlus className="h-4 w-4" />} 
              label="Kritik & Saran" 
              isCollapsed={isCollapsed} 
            />
          </nav>
        </div>

        <div className={cn(
          "mt-auto p-4 flex items-center gap-2 border-t transition-all",
          isCollapsed ? "flex-col px-2" : "justify-between"
        )}>
          <ThemeToggle hideText />
          <form action={logout} className={isCollapsed ? "w-full flex justify-center" : ""}>
            <Tooltip>
              <TooltipTrigger render={<Button type="submit" variant="outline" size="icon" title="Logout" />}>
                <LogOut className="h-4 w-4 text-red-500" />
                <span className="sr-only">Logout</span>
              </TooltipTrigger>
              {isCollapsed && <TooltipContent side="right">Logout</TooltipContent>}
            </Tooltip>
          </form>
        </div>
      </aside>
    </TooltipProvider>
  )
}

function SidebarLink({ 
  href, 
  icon, 
  label, 
  isCollapsed
}: { 
  href: string; 
  icon: React.ReactNode; 
  label: string; 
  isCollapsed: boolean;
}) {
  const content = (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary dark:text-white",
        isCollapsed ? "justify-center px-0 h-10 w-10 mx-auto" : ""
      )}
    >
      {icon}
      {!isCollapsed && <span>{label}</span>}
    </Link>
  )

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger render={content} />
        <TooltipContent side="right">
          {label}
        </TooltipContent>
      </Tooltip>
    )
  }

  return content
}
