"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { deleteResults } from "./actions"

export function ResultsTableClient({ results, page, pageSize }: { results: any[], page: number, pageSize: number }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isDeleting, setIsDeleting] = useState(false)

  const toggleSelectAll = () => {
    if (selectedIds.length === results.length && results.length > 0) {
      setSelectedIds([])
    } else {
      setSelectedIds(results.map(r => r.id))
    }
  }

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const handleDeleteMany = async () => {
    if (selectedIds.length === 0) return
    const isConfirmed = confirm(`Apakah Anda yakin ingin menghapus ${selectedIds.length} data ujian terpilih?`)
    if (!isConfirmed) return

    setIsDeleting(true)
    const result = await deleteResults(selectedIds)
    setIsDeleting(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(`${selectedIds.length} data berhasil dihapus.`)
      setSelectedIds([])
    }
  }

  const handleDeleteSingle = async (id: string) => {
    const isConfirmed = confirm(`Apakah Anda yakin ingin menghapus data ujian ini?`)
    if (!isConfirmed) return
    
    setIsDeleting(true)
    const result = await deleteResults([id])
    setIsDeleting(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Data berhasil dihapus.")
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id))
    }
  }

  return (
    <div className="space-y-4">
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-4 bg-muted/50 p-2 rounded-md border text-sm animate-in fade-in">
          <span className="font-medium">{selectedIds.length} data terpilih</span>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleDeleteMany}
            disabled={isDeleting}
            className="h-8 gap-2 ml-auto"
          >
            <Trash2 className="h-4 w-4" />
            Hapus Terpilih
          </Button>
        </div>
      )}

      <div className="rounded-md border max-h-[600px] overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px] text-center">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 w-4 h-4 text-[#21479B] focus:ring-[#21479B] cursor-pointer"
                  checked={selectedIds.length === results.length && results.length > 0}
                  onChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead className="w-[50px] text-center">No.</TableHead>
              <TableHead className="w-[150px]">Waktu Tes</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Jenis SIM</TableHead>
              <TableHead className="text-right">Nilai</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results?.map((r, index) => (
              <TableRow key={r.id}>
                <TableCell className="text-center">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 w-4 h-4 text-[#21479B] focus:ring-[#21479B] cursor-pointer"
                    checked={selectedIds.includes(r.id)}
                    onChange={() => toggleSelect(r.id)}
                  />
                </TableCell>
                <TableCell className="font-medium text-xs text-center">
                  {(page - 1) * pageSize + index + 1}
                </TableCell>
                <TableCell className="text-sm whitespace-nowrap">
                  {new Date(r.created_at).toLocaleString('id-ID', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </TableCell>
                <TableCell className="font-medium">{r.participant_name}</TableCell>
                <TableCell>{r.participant_email}</TableCell>
                <TableCell>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${r.sim_type === 'A'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                    : 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'
                    }`}>
                    SIM {r.sim_type}
                  </span>
                </TableCell>
                <TableCell className="text-right font-bold">{r.total_score}</TableCell>
                <TableCell>
                  {r.pass_status ? (
                    <span className="text-green-600 dark:text-green-400 font-semibold p-1 px-2 bg-green-100 dark:bg-green-900/30 rounded text-[10px]">LULUS</span>
                  ) : (
                    <span className="text-red-600 dark:text-red-400 font-semibold p-1 px-2 bg-red-100 dark:bg-red-900/30 rounded text-[10px]">TIDAK LULUS</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                    onClick={() => handleDeleteSingle(r.id)}
                    disabled={isDeleting}
                    title="Hapus Nilai"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!results?.length && (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  No test results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
