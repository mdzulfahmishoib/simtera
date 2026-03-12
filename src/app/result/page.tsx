"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckCircle2, XCircle, Award, RotateCcw, Home, Heart, Coffee, QrCode, Clock } from "lucide-react"
import { FeedbackForm } from "@/components/feedback-form"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function ResultPage() {
  const router = useRouter()
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const resultId = sessionStorage.getItem("last_result_id")
    if (!resultId) {
      router.push("/")
      return
    }

    async function fetchResult() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("test_results")
        .select("*")
        .eq("id", resultId)
        .single()

      if (error) {
        console.error("Error fetching result:", error)
        router.push("/")
      } else {
        setResult(data)
      }
      setLoading(false)
    }

    fetchResult()
  }, [router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center">
        <Skeleton className="h-[450px] w-full max-w-xl rounded-2xl" />
      </div>
    )
  }

  if (!result) return null

  const isPassed = result.pass_status

  return (
    <div className="min-h-screen bg-background flex items-start lg:items-center justify-center px-6 py-6 md:p-6">
      <Header />
      <div className="mt-18 container mx-auto grid lg:grid-cols-12 gap-4 items-start">

        {/* Result Card */}
        <div className="lg:col-span-7 w-full order-1">
          <Card className="relative w-full shadow-xl border-none overflow-hidden text-center">
            <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-20 ${isPassed ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <div className={`absolute top-0 left-0 h-2 w-full ${isPassed ? 'bg-green-500' : 'bg-red-500'}`} />

            <CardContent className="p-5 md:p-6">
              <div className="flex flex-col items-center text-center space-y-4">

                {/* ICON */}
                <div className={`rounded-full p-3 ${isPassed
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-600'}`}>
                  {isPassed
                    ? <CheckCircle2 className="h-12 w-12" />
                    : <XCircle className="h-12 w-12" />}
                </div>

                {/* TITLE */}
                <div className="w-full">
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight uppercase">
                    {isPassed ? "LULUS" : "TIDAK LULUS"}
                  </h1>

                  <div className="mt-4 flex justify-between items-stretch w-full px-1">
                    {/* Kolom kiri: Informasi Peserta */}
                    <div className="flex flex-col justify-between py-1 text-left">
                      <p className="text-muted-foreground text-sm leading-none">
                        {" "}
                        <span className="font-bold text-foreground">
                          {result.participant_name}
                        </span>
                      </p>

                      <p className="text-muted-foreground text-sm leading-none mt-auto">
                        {" "}
                        <span className="font-semibold text-foreground">
                          {result.participant_email}
                        </span>
                      </p>
                      <p className="text-muted-foreground text-sm leading-none mt-auto">
                        {" "}
                        <span>
                          Tanggal Tes
                        </span>
                      </p>
                    </div>

                    {/* Kolom kanan: Badge bertumpuk */}
                    <div className="flex flex-col gap-1 items-end">
                      <span className="px-3 py-1 text-[12px] font-bold rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 uppercase">
                        SIM {result.sim_type}
                      </span>
                      <span className="px-3 py-1 text-[12px] font-bold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        Paket {result.module}
                      </span>
                      <div className="flex items-center text-[11px] md:text-[12px] text-muted-foreground">
                        <Clock className="h-3 w-3 mr-2" />
                        <span>{format(new Date(result.created_at), "dd/MM/yyyy HH:mm", { locale: id })}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SCORE SECTION */}
                <div className="w-full grid md:grid-cols-2 gap-3">

                  {/* TOTAL SCORE */}
                  <Card className="bg-muted/50 border-none">
                    <CardContent className="text-center">
                      <p className="text-[12px] text-muted-foreground font-bold uppercase tracking-wider">
                        Skor Total
                      </p>

                      <p className="text-4xl font-bold text-[#21479B] dark:text-white">
                        {result.total_score}
                      </p>

                      <p className="text-[12px] text-muted-foreground mt-1">
                        Syarat Lulus: 70/100
                      </p>
                    </CardContent>
                  </Card>

                  {/* BENAR SALAH */}
                  <div className="grid grid-cols-2 gap-2">

                    <Card className="bg-green-50 dark:bg-green-900/20 border-none">
                      <CardContent className="text-center">
                        <p className="text-[12px] text-green-600 dark:text-green-400 font-bold uppercase">
                          Benar
                        </p>

                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                          {result.score_persepsi + result.score_wawasan + result.score_pengetahuan}
                        </p>

                        <p className="text-[12px] text-muted-foreground">Soal</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-red-50 dark:bg-red-900/20 border-none">
                      <CardContent className="text-center">
                        <p className="text-[12px] text-red-600 dark:text-red-400 font-bold uppercase">
                          Salah
                        </p>

                        <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                          {65 - (result.score_persepsi + result.score_wawasan + result.score_pengetahuan)}
                        </p>

                        <p className="text-[12px] text-muted-foreground">Soal</p>
                      </CardContent>
                    </Card>

                  </div>
                </div>

                {/* RINCIAN */}
                <Card className="bg-muted/50 border-none w-full">
                  <CardContent className="px-6 text-left">
                    <p className="text-[12px] text-muted-foreground font-bold tracking-wider mb-2">
                      Rincian Nilai Per Sesi
                    </p>

                    <div className="space-y-3">
                      {[
                        { label: 'Persepsi Bahaya', score: result.score_persepsi, total: 25 },
                        { label: 'Wawasan', score: result.score_wawasan, total: 20 },
                        { label: 'Pengetahuan', score: result.score_pengetahuan, total: 20 },
                      ].map(({ label, score, total }) => (
                        <div key={label}>

                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium">{label}</span>

                            <span className="font-bold flex gap-1">
                              <span className="text-green-600 dark:text-green-400">{score}</span>
                              <span className="text-muted-foreground">/ {total}</span>
                            </span>
                          </div>

                          <div className="w-full h-1 bg-red-400 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-600 dark:bg-green-400 rounded-full"
                              style={{ width: `${(score / total) * 100}%` }}
                            />
                          </div>

                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* MOTIVATION SECTION */}
                <div className={`w-full p-4 rounded-xl border ${isPassed
                  ? 'bg-green-50 border-green-100 dark:bg-green-900/10 dark:border-green-900/20'
                  : 'bg-red-50 border-red-100 dark:bg-red-900/10 dark:border-red-900/20'}`}>
                  <p className={`text-sm leading-relaxed ${isPassed ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
                    {isPassed
                      ? "Selamat! Anda telah menunjukkan pemahaman yang sangat baik terhadap aturan dan persepsi bahaya. Terus pertahankan kedisiplinan Anda di jalan raya!"
                      : "Jangan berkecil hati! Kegagalan adalah langkah menuju keberhasilan. Pelajari kembali materi yang masih kurang dikuasai dan coba lagi dengan semangat baru!"}
                  </p>
                </div>

                {/* BUTTON */}
                <div className="flex flex-col sm:flex-row gap-2 w-full">

                  <Button
                    onClick={() => router.push("/quiz")}
                    className="flex-1 py-4 rounded-xl bg-[#21479B] hover:bg-[#1a3778] text-white font-semibold text-sm shadow-md"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" /> Coba Lagi
                  </Button>

                  <Button
                    onClick={() => router.push("/")}
                    variant="outline"
                    className="flex-1 py-4 rounded-xl border font-semibold text-sm hover:bg-muted"
                  >
                    <Home className="mr-2 h-4 w-4" /> Ke Beranda
                  </Button>

                </div>

              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Donation & Feedback */}
        <div className="lg:col-span-5 w-full space-y-4 order-2">
          {/* Donation Card */}
          <Card className="border-none shadow-xl bg-[#21479B] text-white overflow-hidden relative group">
            <CardContent className="p-6 relative z-10">
              <div className="flex flex-col md:flex-row gap-6 items-center">

                {/* LEFT */}
                <div className="flex-1 space-y-4 text-left">

                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/20 text-[12px] font-bold uppercase tracking-wider backdrop-blur-md">
                      <Coffee className="h-3 w-3" /> Support
                    </div>

                    <h2 className="text-xl md:text-xl font-black leading-tight">
                      Dukung Kami Tetap Gratis
                    </h2>

                    <p className="text-blue-100 text-xs">
                      Bantu kami mengembangkan simulasi ujian SIM agar tetap gratis
                      dan bermanfaat bagi semua orang.
                    </p>
                  </div>

                  <div className="space-y-2 text-xs text-blue-50/80">
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 h-4 w-4 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <span className="text-[9px] font-bold text-white">1</span>
                      </div>
                      <p>Membantu biaya server dan pemeliharaan.</p>
                    </div>

                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 h-4 w-4 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <span className="text-[9px] font-bold text-white">2</span>
                      </div>
                      <p>Mendukung pembaruan soal berkala.</p>
                    </div>
                  </div>

                  <Button
                    onClick={() => window.open("https://tako.id/fahmi.shoib", "_blank")}
                    className="w-full md:w-auto py-4 px-6 rounded-xl bg-white text-[#21479B] hover:bg-blue-50 font-semibold text-sm shadow-lg transition-all active:scale-95"
                  >
                    <Heart className="mr-2 h-4 w-4 fill-red-500 text-red-500" />
                    Kirim Dukungan
                  </Button>

                </div>

                {/* RIGHT - QR */}
                <div className="bg-white rounded-xl p-4 shadow-inner flex flex-col items-center gap-2 group/qr">

                  <div className="relative">
                    <div className="bg-white w-32 h-32 rounded-lg flex items-center justify-center overflow-hidden group-hover/qr:border-[#21479B]/30 transition-colors">
                      <img
                        src="https://quickchart.io/qr?text=https%3A%2F%2Ftako.id%2Ffahmi.shoib&size=256&centerImageUrl=https%3A%2F%2Fassets.tako.id%2Fbadges%2Fqr.png"
                        alt="Donation QR Code"
                        className="w-full h-full object-contain group-hover/qr:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow animate-bounce">
                      TERIMA KASIH
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-[#21479B] font-bold text-[10px] uppercase tracking-wider mb-0">
                      Dukungan Sukarela
                    </p>
                  </div>

                </div>

              </div>
            </CardContent>
          </Card>

          {/* Feedback Section */}
          <FeedbackForm
            defaultName={result.participant_name}
            defaultEmail={result.participant_email}
          />
        </div>
      </div>
    </div>
  )
}
