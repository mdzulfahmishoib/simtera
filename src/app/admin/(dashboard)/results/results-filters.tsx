"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useDebounce } from "@/hooks/use-debounce"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ResultsFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [status, setStatus] = useState(searchParams.get("status") || "all")
  const [simType, setSimType] = useState(searchParams.get("sim_type") || "all")

  const debouncedSearch = useDebounce(search, 500)

  // Sync state with URL when pagination or other params change
  useEffect(() => {
    setSearch(searchParams.get("search") || "")
    setStatus(searchParams.get("status") || "all")
    setSimType(searchParams.get("sim_type") || "all")
  }, [searchParams])

  useEffect(() => {
    // Only sync search when it actually changes (debounced)
    const params = new URLSearchParams(searchParams.toString())

    if (debouncedSearch === "") {
      params.delete("search")
    } else {
      params.set("search", debouncedSearch)
    }

    // Reset to page 1 only when search changes
    params.delete("page")

    router.push(`/admin/results?${params.toString()}`)
  }, [debouncedSearch])

  const handleStatusChange = (val: string | null) => {
    if (!val) return
    setStatus(val)
    const params = new URLSearchParams(searchParams.toString())

    if (val === "all") {
      params.delete("status")
    } else {
      params.set("status", val)
    }

    // Reset to page 1 when filter changes
    params.delete("page")

    router.push(`/admin/results?${params.toString()}`)
  }

  const handleSimTypeChange = (val: string | null) => {
    if (!val) return
    setSimType(val)
    const params = new URLSearchParams(searchParams.toString())

    if (val === "all") {
      params.delete("sim_type")
    } else {
      params.set("sim_type", val)
    }

    // Reset to page 1 when filter changes
    params.delete("page")

    router.push(`/admin/results?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearch("")
    setStatus("all")
    setSimType("all")
    router.push("/admin/results")
  }

  const hasFilters = search !== "" || status !== "all" || simType !== "all"

  return (
    <div className="flex flex-col md:flex-row gap-3 mb-6 items-stretch">
      {/* Search Bar - Flex-1 membuatnya mengambil sisa ruang di desktop */}
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari nama atau email..."
          className="pl-9 bg-white dark:bg-transparent w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Container untuk Select agar rapi di mobile (sejajar) */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="w-full md:w-[160px]">
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="bg-white dark:bg-transparent w-full">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="pass">Lulus</SelectItem>
              <SelectItem value="fail">Tidak Lulus</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-[140px]">
          <Select value={simType} onValueChange={handleSimTypeChange}>
            <SelectTrigger className="bg-white dark:bg-transparent w-full">
              <SelectValue placeholder="SIM Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua SIM</SelectItem>
              <SelectItem value="A">SIM A</SelectItem>
              <SelectItem value="C">SIM C</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tombol Clear */}
      {hasFilters && (
        <Button
          variant="ghost"
          onClick={clearFilters}
          className="px-3 w-full md:w-auto hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <X className="h-4 w-4 mr-2" />
          Clear
        </Button>
      )}
    </div>
  )
}
