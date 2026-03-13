import { Award, Timer, BookOpen, Users, GraduationCap, ChartBar } from "lucide-react"
import { StartQuizModal } from "@/components/start-quiz-modal"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button-variants"
import { cn } from "@/lib/utils"
import DownloadEbook from "@/components/download-ebook"
import FAQSection from "@/components/faq"
import Header from "@/components/header"
import Footer from "@/components/footer"

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
      <Header />
      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-28 pb-12 lg:pt-30 lg:pb-20 overflow-hidden">
          {/* Background Decorations */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-blue-400/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[50%] bg-emerald-400/20 blur-[100px] rounded-full" />
          </div>

          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column: Content */}
              <div className="text-left space-y-8 animate-in fade-in slide-in-from-left duration-1000">
                <div className=" mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-200 bg-green-50/50 dark:bg-transparent text-green-600 text-xs font-bold tracking-wider uppercase dark:text-green-400 dark:border-green-500/30">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
                  </span>
                  Simulasi & Test Edukasi Berkendara
                </div>

                <div className="space-y-4 md:mb-4">
                  <h1 className="text-4xl md:text-6xl font-black tracking-tighter md:leading-[1.1]">
                    Raih SIM Anda <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#21479B] to-blue-500">
                      Lebih Percaya Diri
                    </span>
                  </h1>
                  <p className="text-md md:text-lg text-muted-foreground max-w-xl">
                    Platform simulasi ujian teori SIM terlengkap di Indonesia.
                    Dilengkapi ribuan soal terbaru yang disusun berdasarkan
                    <span className="font-semibold text-foreground"> E-book Korlantas Polri {new Date().getFullYear()}</span>
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2 md:py-1">
                  <StartQuizModal />
                  <Link
                    href="#download-ebook"
                    className={cn(
                      buttonVariants({ size: "lg", variant: "outline" }),
                      "w-fit border-emerald-500 text-emerald-600 dark:bg-transparent hover:bg-emerald-50 dark:border-emerald-500/50 dark:text-emerald-400 dark:hover:bg-emerald-500/10 text-base font-bold px-6 py-5 sm:px-8 sm:py-6 rounded-2xl shadow-sm flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
                    )}
                  >
                    <BookOpen className="h-5 w-5" />
                    Pelajari Materi
                  </Link>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex -space-x-3">
                    {/* Icon 1 */}
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-emerald-500 dark:bg-slate-600 text-white border-3 border-white dark:border-[#0A0A0A] z-40">
                      <Users className="h-4 w-4" />
                    </div>

                    {/* Icon 2 */}
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-emerald-400 dark:bg-slate-700 text-white border-3 border-white dark:border-[#0A0A0A] z-30">
                      <Users className="h-4 w-4" />
                    </div>

                    {/* Icon 3 */}
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-emerald-200 dark:bg-slate-800 text-white border-3 border-white dark:border-[#0A0A0A] z-20">
                      <Users className="h-4 w-4" />
                    </div>

                    {/* Icon 4 */}
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-emerald-100 dark:bg-slate-900 text-white border-3 border-white dark:border-[#0A0A0A] z-10">
                      <Users className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="text-xs md:text-sm font-medium">
                    <span className="text-foreground font-bold">100+</span> Peserta telah berlatih minggu ini
                  </div>
                </div>
              </div>

              {/* Right Column: Visual */}
              <div className="relative hidden lg:flex justify-end items-center animate-in slide-in-from-right duration-1000 delay-200">
                <div className="relative z-10 w-full max-w-lg translate-x-12 xl:translate-x-12">
                  <img
                    src="https://txdgzmrkpptjzidfvyyj.supabase.co/storage/v1/object/public/ebook-avis/hero-avatar.webp"
                    alt="Simtera Hero Avatar"
                    className="w-full h-auto object-contain"
                  />

                  {/* Floating Elements (Visual Polish) - Pindahkan ke dalam div yang sama agar ikut bergeser */}
                  <div className="absolute -top-8 right-3 p-6 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-muted">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <Award className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Passing Rate</p>
                        <p className="text-sm font-bold">98% Success</p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -bottom-1 -left-10 p-5 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-muted">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <Timer className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Real-time</p>
                        <p className="text-sm font-bold">Live Tracking</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-0 px-4 pb-12 md:pb-20">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Fitur <span className="text-[#21479B]">Unggulan</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-6 rounded-2xl border bg-card hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-blue-100 dark:bg-[#21479B] rounded-lg flex items-center justify-center mb-4 text-[#21479B] dark:text-white">
                  <Timer className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Batas Waktu Akurat</h3>
                <p className="text-muted-foreground">
                  Setiap sesi memiliki batas waktu pengerjaan otomatis seperti ujian aslinya.
                </p>
              </div>
              <div className="p-6 rounded-2xl border bg-card hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-blue-100 dark:bg-[#21479B] rounded-lg flex items-center justify-center mb-4 text-[#21479B] dark:text-white">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Tiga Materi Utama</h3>
                <p className="text-muted-foreground">
                  Persepsi Bahaya, Wawasan, dan Pengetahuan mencakup total 65 soal.
                </p>
              </div>
              <div className="p-6 rounded-2xl border bg-card hover:shadow-md transition-shadow">
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
          <DownloadEbook />
          <FAQSection />
          <Footer />
        </section>

      </main>
    </div>
  )
}
