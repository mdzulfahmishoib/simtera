import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileQuestion, BarChart3, TrendingUp, CheckCircle2, XCircle, Car, Bike } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Fetch basic stats
  const [
    { count: userCount },
    { count: questionCount },
    { count: resultCount },
    { count: passCount },
    { count: simACount },
    { count: simCCount },
    { data: recentResults },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'admin'),
    supabase.from('questions').select('*', { count: 'exact', head: true }),
    supabase.from('test_results').select('*', { count: 'exact', head: true }),
    supabase.from('test_results').select('*', { count: 'exact', head: true }).eq('pass_status', true),
    supabase.from('test_results').select('*', { count: 'exact', head: true }).eq('sim_type', 'A'),
    supabase.from('test_results').select('*', { count: 'exact', head: true }).eq('sim_type', 'C'),
    supabase.from('test_results')
      .select('participant_name, participant_email, sim_type, total_score, pass_status, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const total = resultCount || 0
  const passed = passCount || 0
  const failed = total - passed
  const passRate = total > 0 ? Math.round((passed / total) * 100) : 0

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
      </div>

      {/* Top stat cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

        {/* Card: Total Simulasi */}
        <Link href="/admin/results" className="transition-transform hover:scale-[1.02] active:scale-95">
          <Card className="border-l-4 border-l-blue-500 hover:bg-blue-50/50 dark:hover:bg-transparent cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Total Simulasi Dilakukan</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{total}</div>
              <p className="text-xs text-muted-foreground">Hasil tes yang tersimpan</p>
            </CardContent>
          </Card>
        </Link>

        {/* Card: Total Questions */}
        <Link href="/admin/questions" className="transition-transform hover:scale-[1.02] active:scale-95">
          <Card className="border-l-4 border-l-green-400 hover:bg-green-50/50 dark:hover:bg-transparent cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-400">Total Questions</CardTitle>
              <FileQuestion className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{questionCount || 0}</div>
              <p className="text-xs text-muted-foreground">Soal pada bank soal</p>
            </CardContent>
          </Card>
        </Link>

        {/* Card: Total Admin Users */}
        <Link href="/admin/users" className="transition-transform hover:scale-[1.02] active:scale-95">
          <Card className="border-l-4 border-l-amber-500 hover:bg-amber-50/50 dark:hover:bg-transparent cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-700">Total Admin Users</CardTitle>
              <Users className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userCount || 0}</div>
              <p className="text-xs text-muted-foreground">Akun operator yang terdaftar</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Statistics Section */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Statistik Peserta Simulasi</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

          {/* Pass Rate */}
          <Card className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tingkat Kelulusan</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-4xl font-black ${passRate >= 70 ? 'text-green-600 dark:text-green-400' : passRate >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                {passRate}%
              </div>
              <div className="mt-2 w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${passRate >= 70 ? 'bg-green-500' : passRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${passRate}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">dari {total} peserta</p>
            </CardContent>
          </Card>

          {/* Lulus */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Peserta Lulus</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{passed}</div>
              <p className="text-xs text-muted-foreground mt-1">peserta berhasil lulus</p>
            </CardContent>
          </Card>

          {/* Tidak Lulus */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Peserta Tidak Lulus</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-500 dark:text-red-400">{failed}</div>
              <p className="text-xs text-muted-foreground mt-1">peserta belum lulus</p>
            </CardContent>
          </Card>

          {/* SIM A vs SIM C */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Distribusi SIM</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Car className="h-4 w-4 text-blue-500" />
                  <span>SIM A</span>
                </div>
                <span className="font-bold text-blue-600 dark:text-blue-500">{simACount || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Bike className="h-4 w-4 text-orange-500" />
                  <span>SIM C</span>
                </div>
                <span className="font-bold text-orange-600 dark:text-orange-400">{simCCount || 0}</span>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Recent Test Results */}
      {recentResults && recentResults.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Simulasi Terbaru</h3>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {recentResults.map((r: any, i: number) => (
                  <div key={i} className="flex items-center justify-between px-3 py-3 gap-2">
                    {/* Bagian Kiri: Nama & Email */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className={`flex-shrink-0 rounded-full p-1.5 ${r.pass_status ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-red-100 dark:bg-red-900/30 text-red-500'}`}>
                        {r.pass_status ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      </div>
                      <div className="min-w-0"> {/* Penting: min-w-0 agar truncate jalan */}
                        <p className="text-sm font-medium truncate">{r.participant_name}</p>
                        <p className="text-xs text-muted-foreground truncate">{r.participant_email}</p>
                      </div>
                    </div>

                    {/* Bagian Kanan: Badge SIM & Skor */}
                    <div className="flex items-center gap-3 text-right flex-shrink-0">
                      <div className="flex-shrink-0">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${r.sim_type === 'A'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                          : 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'
                          }`}>
                          SIM {r.sim_type}
                        </span>
                      </div>
                      <div className="min-w-[70px] flex-shrink-0"> {/* Memberi ruang pasti untuk skor & tanggal */}
                        <p className="text-sm font-bold">{r.total_score}<span className="text-muted-foreground font-normal">/100</span></p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(r.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
