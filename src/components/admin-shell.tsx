"use client"

import { useState, useEffect } from "react"
import { AdminSidebar } from "./admin-sidebar"
import { cn } from "@/lib/utils"

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const saved = localStorage.getItem("admin-sidebar-collapsed")
    if (saved === "true") {
      setIsCollapsed(true)
    }
  }, [])

  const toggleSidebar = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem("admin-sidebar-collapsed", newState.toString())
  }

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <AdminSidebar 
        isCollapsed={isMounted ? isCollapsed : false} 
        onToggle={toggleSidebar} 
      />
      <div 
        className={cn(
          "flex flex-col sm:gap-4 sm:py-4 transition-all duration-300 w-full",
          isMounted && isCollapsed ? "sm:pl-16" : "sm:pl-64"
        )}
      >
        {children}
      </div>
    </div>
  )
}
