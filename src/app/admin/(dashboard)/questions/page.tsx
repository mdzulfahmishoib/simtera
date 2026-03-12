import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { buttonVariants } from "@/components/ui/button-variants"
import { CreateQuestionModal } from "./create-question-modal"
import { EditQuestionModal } from "./edit-question-modal"
import { cn } from "@/lib/utils"
import { DeleteQuestionButton } from "./delete-button"
import { TableFilters } from "./table-filters"
import Link from "next/link"

export default async function AdminQuestionsPage(props: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    category?: string;
    sim_type?: string;
    module?: string;
  }>
}) {
  const searchParams = await props.searchParams
  const page = parseInt(searchParams.page || "1")
  const search = searchParams.search || ""
  const category = searchParams.category || ""
  const simType = searchParams.sim_type || ""
  const module = searchParams.module || ""
  const pageSize = 25
  const supabase = await createClient()

  // Fetch questions with count for pagination
  let query = supabase
    .from('questions')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })

  // Apply filters
  if (search) {
    query = query.or(`text.ilike.%${search}%,correct_answer.ilike.%${search}%`)
  }
  if (category && category !== 'all') {
    query = query.eq('category', category)
  }
  if (simType && simType !== 'all') {
    query = query.eq('sim_type', simType)
  }
  if (module && module !== 'all') {
    query = query.eq('module', module)
  }

  const { data: questions, count, error } = await query
    .range((page - 1) * pageSize, page * pageSize - 1)

  const totalPages = count ? Math.ceil(count / pageSize) : 0

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Question Bank</h2>
        <CreateQuestionModal />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Questions</CardTitle>
          <CardDescription>
            Manage the database of questions for SIM A and SIM C simulations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <TableFilters />
          <div className="rounded-md border overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">No.</TableHead>
                  <TableHead className="w-[120px]">Category</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead className="w-[80px]">SIM</TableHead>
                  <TableHead className="w-[100px]">Modul</TableHead>
                  <TableHead className="w-[200px]">Correct Answer</TableHead>
                  <TableHead className="w-[100px]">Media</TableHead>
                  <TableHead className="w-[100px]">Audio</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questions?.map((q, index) => (
                  <TableRow key={q.id}>
                    <TableCell className="font-medium text-xs text-center">{(page - 1) * pageSize + index + 1}</TableCell>
                    <TableCell className="font-medium text-xs">{q.category}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={q.text}>
                      {q.text}
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${q.sim_type === 'A'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                        : 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'
                        }`}>
                        SIM {q.sim_type}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs font-medium">{q.module}</TableCell>
                    <TableCell className="text-sm text-green-600 max-w-[150px] truncate" title={q.correct_answer}>
                      {q.correct_answer}
                    </TableCell>
                    <TableCell>
                      {q.media_type ? (
                        <Link href={q.media_url} target="_blank" className="text-blue-500 hover:underline text-xs">
                          {q.media_type.toUpperCase()}
                        </Link>
                      ) : (
                        <span className="text-xs text-muted-foreground">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {q.audio_url ? (
                        <audio
                          src={q.audio_url}
                          controls
                          className="h-7 w-[120px]"
                        />
                      ) : (
                        <span className="text-xs text-muted-foreground">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <EditQuestionModal question={q} />
                        <DeleteQuestionButton id={q.id} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!questions?.length && (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No questions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between py-2">
              <p className="text-sm text-muted-foreground italic">
                Showing {Math.min((page - 1) * pageSize + 1, count || 0)} to {Math.min(page * pageSize, count || 0)} of {count} entries
              </p>
              <div className="flex items-center space-x-2">
                <Link
                  href={`/admin/questions?page=${page - 1}${search ? `&search=${search}` : ''}${category ? `&category=${category}` : ''}${simType ? `&sim_type=${simType}` : ''}`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    page <= 1 && "pointer-events-none opacity-50"
                  )}
                >
                  Previous
                </Link>
                <div className="text-sm font-medium">
                  Page {page} of {totalPages}
                </div>
                <Link
                  href={`/admin/questions?page=${page + 1}${search ? `&search=${search}` : ''}${category ? `&category=${category}` : ''}${simType ? `&sim_type=${simType}` : ''}`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
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
