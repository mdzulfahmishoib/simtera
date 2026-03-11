import { ShieldCheck, Award, Timer, BookOpen, Users, TrendingUp, CheckCircle2, Heart, GraduationCap, ChartBar } from "lucide-react"
import { StartQuizModal } from "@/components/start-quiz-modal"
import { ThemeToggle } from "@/components/theme-toggle"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button-variants"
import { cn } from "@/lib/utils"
import DownloadSection from "@/components/download-ebook"
import FAQSection from "@/components/faq"

export default async function Home() {
  const supabase = await createClient()

  // Fetch public stats for the landing page
  const [
    { count: totalTests },
    { count: passCount },
  ] = await Promise.all([
    supabase.from('test_results').select('*', { count: 'exact', head: true }),
    supabase.from('test_results').select('*', { count: 'exact', head: true }).eq('pass_status', true),
  ])

  const total = totalTests || 0
  const passed = passCount || 0
  const passRate = total > 0 ? Math.round((passed / total) * 100) : 0

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header / Nav */}
      <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 font-bold text-[#21479B] dark:text-white text-xl">
            <ShieldCheck className="h-8 w-8" />
            <span>SIMTERA</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="https://tako.id/fahmi.shoib"
              target="_blank"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "items-center gap-2 border-pink-200 bg-pink-50/50 text-pink-700 hover:bg-pink-100/50 hover:text-pink-800 dark:border-pink-900/30 dark:bg-pink-900/20 dark:text-pink-400 dark:hover:bg-pink-900/40"
              )}
            >
              <Heart className="h-4 w-4 fill-current" />
              <span>Donasi</span>
            </Link>
            <ThemeToggle hideText />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-38 pb-16 md:pt-38 md:pb-32 px-4 bg-gradient-to-b from-blue-50 to-background dark:from-blue-950/20">
          <div className="container mx-auto text-center max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full border border-emerald-500/50 bg-transparent text-emerald-600 text-xs font-semibold tracking-wide dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-none">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Simulasi & Test Edukasi Berkendara
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-2">
              Simulasi Ujian Teori
            </h1>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-5">
              <span className="text-[#21479B] dark:text-blue-500">SIM A & SIM C</span>
            </h1>
            <p className="md:text-xl text-sm text-muted-foreground mb-8 max-w-2xl mx-auto">
              Persiapkan diri Anda dengan simulasi ujian teori SIM yang akurat,
              mengikuti ebook materi ujian terbaru dari Korlantas Polri.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-6 px-4 sm:px-0">
              <StartQuizModal />
              <Link
                href="#download-ebook"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }), // Menggunakan variant outline dari Shadcn
                  "border-emerald-500 text-emerald-600 dark:bg-transparent hover:bg-emerald-100 hover:text-emerald-700 dark:border-emerald-500/50 dark:text-emerald-400 dark:hover:bg-emerald-500/10 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full shadow-md transition-all w-full sm:w-auto"
                )}
              >
                <BookOpen className="h-5 w-5 mr-2" />
                Download E-Book
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-blue-100 dark:bg-[#21479B] rounded-lg flex items-center justify-center mb-4 text-[#21479B] dark:text-white">
                  <Timer className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Batas Waktu Akurat</h3>
                <p className="text-muted-foreground">
                  Setiap sesi memiliki batas waktu pengerjaan otomatis seperti ujian aslinya.
                </p>
              </div>
              <div className="p-6 rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-blue-100 dark:bg-[#21479B] rounded-lg flex items-center justify-center mb-4 text-[#21479B] dark:text-white">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Tiga Materi Utama</h3>
                <p className="text-muted-foreground">
                  Persepsi Bahaya, Wawasan, dan Pengetahuan mencakup total 65 soal.
                </p>
              </div>
              <div className="p-6 rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-blue-100 dark:bg-[#21479B] rounded-lg flex items-center justify-center mb-4 text-[#21479B] dark:text-white">
                  <Award className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Hasil Instan</h3>
                <p className="text-muted-foreground">
                  Dapatkan skor detail dan status kelulusan secara instan setelah selesai.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        {total > 0 && (

          <section className="py-24 px-4 bg-gradient-to-b from-slate-50 to-white dark:from-[#171717] dark:to-[#0a0a0a] overflow-hidden">
            <div className="container mx-auto max-w-6xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                
                {/* Kolom Kiri: Heading & Deskripsi */}
                <div className="text-left space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-wider uppercase relative">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Statistik Real-Time
                  </div>
                  <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
                    Segera Lakukan Tes <br />
                    <span className="text-[#21479B] dark:text-blue-500">Simulasi SIM</span> Sekarang
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-slate-400 max-w-md">
                    Sudah banyak yang berhasil lulus tes simulasi SIM dengan menggunakan platform kami. Bergabunglah dengan ribuan pengemudi cerdas lainnya.
                  </p>
                </div>

                {/* Kolom Kanan: Statistik Layout Baru */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Card 1: Total Simulasi (Span 2 Kolom) */}
                  <div className="sm:col-span-2 p-6 rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:backdrop-blur-sm shadow-sm flex items-center gap-6">
                    <div className="h-14 w-14 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                      <Users className="h-7 w-7" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        {total.toLocaleString("id-ID")}
                      </div>
                      <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Total Simulasi Dilakukan</p>
                    </div>
                  </div>

                  {/* Card 2: Pengguna Lulus */}
                  <div className="p-6 rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:backdrop-blur-sm shadow-sm space-y-4">
                    <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                      <GraduationCap className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {passed.toLocaleString("id-ID")}
                      </div>
                      <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Pengguna Lulus</p>
                    </div>
                  </div>

                  {/* Card 3: Persentase */}
                  <div className="p-6 rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:backdrop-blur-sm shadow-sm space-y-4 font-sans">
                    <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                      <ChartBar className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {passRate}%
                      </div>
                      <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Tingkat Kelulusan</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </section>
        )}

        <section>
          <DownloadSection />
          <FAQSection />
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t py-8 px-4 bg-muted/30 text-center">
        <div className="container mx-auto">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} SIMTERA - Simulasi & Test Edukasi Berkendara
          </p>
        </div>
      </footer>
    </div>
  )
}
