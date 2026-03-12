import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button-variants"
import { cn } from "@/lib/utils"
import Link from "next/link"

import { ResultsFilters } from "./results-filters"
import { ResultsTableClient } from "./results-table-client"

export default async function AdminResultsPage(props: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    sim_type?: string;
    status?: string;
  }>
}) {
  const searchParams = await props.searchParams
  const page = parseInt(searchParams.page || "1")
  const search = searchParams.search || ""
  const simType = searchParams.sim_type || ""
  const status = searchParams.status || ""
  const pageSize = 25
  const supabase = await createClient()

  // Fetch results with count for pagination
  let query = supabase
    .from('test_results')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })

  // Apply filters
  if (search) {
    query = query.or(`participant_name.ilike.%${search}%,participant_email.ilike.%${search}%`)
  }
  if (simType && simType !== 'all') {
    query = query.eq('sim_type', simType)
  }
  if (status && status !== 'all') {
    query = query.eq('pass_status', status === 'pass')
  }

  const { data: results, count, error } = await query
    .range((page - 1) * pageSize, page * pageSize - 1)

  const totalPages = count ? Math.ceil(count / pageSize) : 0

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Test Results</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Participant Scores</CardTitle>
          <CardDescription>
            View scores and pass/fail status of all participants.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ResultsFilters />
          <ResultsTableClient results={results || []} page={page} pageSize={pageSize} />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between py-2">
              <p className="text-sm text-muted-foreground italic">
                Showing {Math.min((page - 1) * pageSize + 1, count || 0)} to {Math.min(page * pageSize, count || 0)} of {count} entries
              </p>
              <div className="flex items-center space-x-2">
                <Link
                  href={`/admin/results?page=${page - 1}${search ? `&search=${search}` : ''}${simType ? `&sim_type=${simType}` : ''}${status ? `&status=${status}` : ''}`}
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
                  href={`/admin/results?page=${page + 1}${search ? `&search=${search}` : ''}${simType ? `&sim_type=${simType}` : ''}${status ? `&status=${status}` : ''}`}
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
