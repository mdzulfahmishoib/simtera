"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Users,
  FileQuestion,
  BarChart3,
  LogOut,
  ShieldCheck,
  House,
  MessageSquarePlus,
  Menu,
  X
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { logout } from "@/app/admin/login/actions"
import { cn } from "@/lib/utils"

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { href: "/admin", icon: <House className="h-4 w-4" />, label: "Dashboard" },
    { href: "/admin/questions", icon: <FileQuestion className="h-4 w-4" />, label: "Questions" },
    { href: "/admin/results", icon: <BarChart3 className="h-4 w-4" />, label: "Results" },
    { href: "/admin/feedbacks", icon: <MessageSquarePlus className="h-4 w-4" />, label: "Feedbacks" },
    { href: "/admin/users", icon: <Users className="h-4 w-4" />, label: "Users" },
  ]

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {/* Top Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-14 items-center justify-between px-4 lg:h-[60px]">
          {/* Logo */}
          <Link href="/admin" className="flex items-center gap-2 font-bold text-[#21479B] dark:text-white">
            <ShieldCheck className="h-6 w-6" />
            <span className="hidden sm:inline-block">Admin SIMTERA</span>
            <span className="sm:hidden text-lg">SIMTERA</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap",
                  pathname === link.href
                    ? "bg-[#21479B] text-white"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 border-r pr-2 border-muted">
              <ThemeToggle hideText />
            </div>
            <div className="sm:hidden">
              <ThemeToggle hideText />
            </div>

            <form action={logout} className="hidden sm:block">
              <Button type="submit" variant="outline" size="sm" className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200 dark:border-red-900/30 dark:hover:bg-red-950/20">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </form>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t bg-background animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col p-4 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                    pathname === link.href
                      ? "bg-[#21479B] text-white"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 pt-2 border-t">
                <form action={logout}>
                  <Button type="submit" variant="ghost" className="w-full justify-start gap-4 text-red-500 hover:text-red-600 hover:bg-red-50 px-4 h-12">
                    <LogOut className="h-5 w-5" />
                    <span className="font-semibold">Keluar (Logout)</span>
                  </Button>
                </form>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
