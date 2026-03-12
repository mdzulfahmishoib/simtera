"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useDebounce } from "@/hooks/use-debounce"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function TableFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [category, setCategory] = useState(searchParams.get("category") || "")
  const [simType, setSimType] = useState(searchParams.get("sim_type") || "")
  const [module, setModule] = useState(searchParams.get("module") || "")

  const debouncedSearch = useDebounce(search, 500)

  // Sync state with URL when pagination or other params change
  useEffect(() => {
    setSearch(searchParams.get("search") || "")
    setCategory(searchParams.get("category") || "")
    setSimType(searchParams.get("sim_type") || "")
    setModule(searchParams.get("module") || "")
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

    router.push(`/admin/questions?${params.toString()}`)
  }, [debouncedSearch])

  const handleCategoryChange = (val: string | null) => {
    if (!val) return
    const newVal = val === "all" ? "" : val
    setCategory(newVal)
    const params = new URLSearchParams(searchParams.toString())

    if (newVal === "") {
      params.delete("category")
    } else {
      params.set("category", newVal)
    }

    // Reset to page 1 when filter changes
    params.delete("page")

    router.push(`/admin/questions?${params.toString()}`)
  }

  const handleSimTypeChange = (val: string | null) => {
    if (!val) return
    const newVal = val === "all" ? "" : val
    setSimType(newVal)
    const params = new URLSearchParams(searchParams.toString())

    if (newVal === "") {
      params.delete("sim_type")
    } else {
      params.set("sim_type", newVal)
    }

    // Reset to page 1 when filter changes
    params.delete("page")

    router.push(`/admin/questions?${params.toString()}`)
  }

  const handleModuleChange = (val: string | null) => {
    if (!val) return
    const newVal = val === "all" ? "" : val
    setModule(newVal)
    const params = new URLSearchParams(searchParams.toString())

    if (newVal === "") {
      params.delete("module")
    } else {
      params.set("module", newVal)
    }

    // Reset to page 1 when filter changes
    params.delete("page")

    router.push(`/admin/questions?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearch("")
    setCategory("")
    setSimType("")
    setModule("")
    router.push("/admin/questions")
  }

  const hasFilters = search !== "" || category !== "" || simType !== "" || module !== ""

  return (
    <div className="flex flex-col md:flex-row gap-3 mb-6 items-stretch md:items-center">
      {/* Search Bar - Mengambil sisa ruang di desktop, full-width di mobile */}
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search questions..."
          className="pl-9 bg-white dark:bg-transparent w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Filter Group - Menggunakan w-full agar di mobile rapi */}
      <div className="w-full md:w-[180px]">
        <Select value={category} onValueChange={handleCategoryChange}>
          <SelectTrigger className="bg-white dark:bg-transparent w-full">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Pilih Kategori</SelectItem>
            <SelectItem value="Persepsi Bahaya">Persepsi Bahaya</SelectItem>
            <SelectItem value="Wawasan">Wawasan</SelectItem>
            <SelectItem value="Pengetahuan">Pengetahuan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full md:w-[150px]">
        <Select value={simType} onValueChange={handleSimTypeChange}>
          <SelectTrigger className="bg-white dark:bg-transparent w-full">
            <SelectValue placeholder="SIM Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Pilih Tipe SIM</SelectItem>
            <SelectItem value="A">SIM A</SelectItem>
            <SelectItem value="C">SIM C</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full md:w-[140px]">
        <Select value={module} onValueChange={handleModuleChange}>
          <SelectTrigger className="bg-white dark:bg-transparent w-full">
            <SelectValue placeholder="Modul" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Pilih Modul</SelectItem>
            <SelectItem value="Modul 1">Modul 1</SelectItem>
            <SelectItem value="Modul 2">Modul 2</SelectItem>
            <SelectItem value="Modul 3">Modul 3</SelectItem>
            <SelectItem value="Modul 4">Modul 4</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tombol Clear - Full width di mobile agar mudah ditekan */}
      {hasFilters && (
        <Button
          variant="ghost"
          onClick={clearFilters}
          className="px-3 w-full md:w-auto text-destructive md:text-foreground"
        >
          <X className="h-4 w-4 mr-2" />
          Clear
        </Button>
      )}
    </div>
  )
}
