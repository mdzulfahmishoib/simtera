import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { buttonVariants } from "@/components/ui/button-variants"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { MessageSquareQuote } from "lucide-react"

export default async function AdminFeedbacksPage(props: {
  searchParams: Promise<{
    page?: string;
  }>
}) {
  const searchParams = await props.searchParams
  const page = parseInt(searchParams.page || "1")
  const pageSize = 10
  const supabase = await createClient()

  const { data: feedbacks, count, error } = await supabase
    .from('feedbacks')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1)

  const totalPages = count ? Math.ceil(count / pageSize) : 0

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Kritik & Saran</h2>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>User Feedbacks</CardTitle>
          </div>
          <CardDescription>
            Tinjau masukan, saran, dan laporan kesalahan soal dari pengguna.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[50px] text-center">No.</TableHead>
                  <TableHead className="w-[150px]">Tanggal</TableHead>
                  <TableHead className="w-[200px]">Peserta</TableHead>
                  <TableHead>Isi Masukan (Kritik/Saran/Koreksi)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feedbacks?.map((f, index) => (
                  <TableRow key={f.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium text-xs text-center">
                      {(page - 1) * pageSize + index + 1}
                    </TableCell>
                    <TableCell className="text-xs">
                      {new Date(f.created_at).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">{f.participant_name}</span>
                        <span className="text-[10px] text-muted-foreground">{f.participant_email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm border-l italic bg-muted/10 px-4">
                      "{f.content}"
                    </TableCell>
                  </TableRow>
                ))}
                {!feedbacks?.length && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground italic">
                      Belum ada masukan dari pengguna.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between py-2">
              <p className="text-[10px] text-muted-foreground italic uppercase tracking-widest">
                Menampilkan {Math.min((page - 1) * pageSize + 1, count || 0)} - {Math.min(page * pageSize, count || 0)} dari {count} masukan
              </p>
              <div className="flex items-center space-x-2">
                <Link
                  href={`/admin/feedbacks?page=${page - 1}`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "h-8 rounded-lg",
                    page <= 1 && "pointer-events-none opacity-50"
                  )}
                >
                  Previous
                </Link>
                <div className="text-xs font-bold text-[#21479B] dark:text-white px-3">
                  Hal {page} / {totalPages}
                </div>
                <Link
                  href={`/admin/feedbacks?page=${page + 1}`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "h-8 rounded-lg",
                    page >= totalPages && "pointer-events-none opacity-50"
                  )}
                >
                  Next
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
