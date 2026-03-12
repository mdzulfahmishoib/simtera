"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Timer, AlertCircle, UserCheck, CheckCircle2, XCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { submitQuizResult } from "./actions"
import { toast } from "sonner"
import { ThemeToggle } from "@/components/theme-toggle"
import Header from "@/components/header"

type Question = {
  id: string
  category: string
  text: string
  media_url: string | null
  media_type: string | null
  audio_url: string | null
  options: string[]
  correct_answer: string
  module: string
}

export default function QuizPage() {
  const router = useRouter()
  const [participant, setParticipant] = useState<any>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isQuizStarted, setIsQuizStarted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // 1. Check for participant data
  useEffect(() => {
    const data = sessionStorage.getItem("quiz_participant")
    if (!data) {
      router.push("/")
      return
    }
    setParticipant(JSON.parse(data))
  }, [router])

  // 2. Fetch Questions
  useEffect(() => {
    if (!participant) return

    async function fetchQuestions() {
      const supabase = createClient()
      const simType = participant.simType // 'A' or 'C'
      const selectedModule = participant.module // 'Modul 1', 'Modul 2', 'Modul 3', 'Modul 4', or 'Acak'

      // Fisher-Yates shuffle for better randomness
      const shuffleArray = (array: any[]) => {
        const newArray = [...array]
        for (let i = newArray.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
        }
        return newArray
      }

      // Fetch all candidate questions for the sim type to avoid multiple Supabase calls
      const { data: allQuestions, error } = await supabase
        .from("questions")
        .select("*")
        .eq("sim_type", simType)

      if (error || !allQuestions || allQuestions.length === 0) {
        toast.error("Gagal mengambil soal atau bank soal kosong")
        setQuestions([])
        setLoading(false)
        return
      }

      const getQuestionsForCategory = (category: string, totalRequired: number) => {
        const categoryPool = allQuestions.filter(q => q.category === category)

        if (selectedModule !== "Acak") {
          // Filter by specific module and pick requested number
          const modulePool = categoryPool.filter(q => q.module === selectedModule)
          return shuffleArray(modulePool).slice(0, totalRequired)
        } else {
          // "Acak" logic: Ensure balanced representation from all 4 modules
          const modules = ["Modul 1", "Modul 2", "Modul 3", "Modul 4"]
          const perModule = Math.floor(totalRequired / modules.length)
          const extra = totalRequired % modules.length

          let selected: Question[] = []
          const poolsByModule: Record<string, Question[]> = {}

          modules.forEach(m => {
            poolsByModule[m] = shuffleArray(categoryPool.filter(q => q.module === m))
          })

          modules.forEach((m, i) => {
            const countNeeded = perModule + (i < extra ? 1 : 0)
            selected = [...selected, ...poolsByModule[m].slice(0, countNeeded)]
          })

          // If we have fewer than totalRequired (e.g. some modules have fewer questions), fill from remaining pool
          if (selected.length < totalRequired) {
            const selectedIds = new Set(selected.map(s => s.id))
            const leftovers = shuffleArray(categoryPool.filter(q => !selectedIds.has(q.id)))
            selected = [...selected, ...leftovers.slice(0, totalRequired - selected.length)]
          }

          // Final shuffle within the category to mix modules
          return shuffleArray(selected)
        }
      }

      const qPersepsi = getQuestionsForCategory("Persepsi Bahaya", 25)
      const qWawasan = getQuestionsForCategory("Wawasan", 20)
      const qPengetahuan = getQuestionsForCategory("Pengetahuan", 20)

      const all = [...qPersepsi, ...qWawasan, ...qPengetahuan]
      setQuestions(all)
      setLoading(false)

      if (all.length > 0) {
        setTimeLeft(25)
      }
    }

    fetchQuestions()
  }, [participant])

  const currentQuestion = questions[currentIndex]

  // 4. Audio Control Logic
  const startAudioContext = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => { })
    }
  }

  // Auto-play audio for Persepsi Bahaya questions
  useEffect(() => {
    if (!isQuizStarted || !currentQuestion || currentQuestion.category !== 'Persepsi Bahaya' || !currentQuestion.audio_url) return

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current.src = currentQuestion.audio_url
      audioRef.current.load()

      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn("Autoplay blocked or failed:", error)
        })
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [currentIndex, currentQuestion, isQuizStarted])

  // 5. Submit Logic
  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true)

    const result = await submitQuizResult({
      participant_name: participant.name,
      participant_email: participant.email,
      sim_type: participant.simType,
      module: participant.module,
      answers: answers
    })

    if (result.error) {
      toast.error(result.error)
      setIsSubmitting(false)
    } else {
      sessionStorage.setItem("last_result_id", result.id)
      router.push("/result")
    }
  }, [answers, participant, router])

  // 3. Auto Next Logic
  const handleNext = useCallback(async () => {
    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex)

      // Set new timer wawasan dan pengetahuan
      setTimeLeft(35)
    } else {
      // Final submit
      handleSubmit()
    }
  }, [currentIndex, questions, handleSubmit])

  // 4. Timer countdown — only mutates timeLeft, no side effects
  useEffect(() => {
    if (!isQuizStarted || loading || isSubmitting || timeLeft <= 0 || questions.length === 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, loading, isSubmitting, questions.length, isQuizStarted])

  // 4b. When timer hits 0, advance to next question (outside setter to avoid Router update during render)
  useEffect(() => {
    if (timeLeft === 0 && !loading && !isSubmitting && questions.length > 0) {
      handleNext()
    }
  }, [timeLeft, loading, isSubmitting, questions.length, handleNext])



  if (loading || !participant) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[400px] w-full max-w-4xl" />
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center text-center p-6">
        <div className="space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold">Bank Soal Kosong</h2>
          <p className="text-muted-foreground">Admin belum mengunggah soal ke database.</p>
          <Button onClick={() => router.push("/")}>Kembali</Button>
        </div>
      </div>
    )
  }

  if (!isQuizStarted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
        <Header />
        <Card className="mt-18 relative w-full max-w-md shadow-xl border-none overflow-hidden">
          <div className="absolute top-0 left-0 h-1.5 w-full bg-[#21479B]" />

          <CardContent className="p-6 sm:p-8">
            <div className="text-center mb-6">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#21479B] dark:text-blue-500 uppercase">
                Siap Memulai?
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Simulasi Tes Ujian Teori SIM {participant.simType}
              </p>
            </div>

            {/* Participant Info */}
            <div className="mb-2 p-4 rounded-lg bg-muted/30 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <UserCheck className="h-4 w-4 text-[#21479B] dark:text-blue-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#21479B] dark:text-blue-500">
                  Konfirmasi Peserta
                </h3>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-foreground">{participant.name}</p>
                <p className="text-xs text-muted-foreground">{participant.email}</p>
              </div>
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                  Informasi Penting
                </h3>
              </div>

              <ul className="space-y-2 text-[13px] text-amber-900/80 dark:text-amber-200/70">
                <li className="flex items-center justify-between">
                  <span>Paket Modul</span>
                  <span className="font-bold text-amber-900 dark:text-amber-100">{participant.module}</span>
                </li>
                <li className="flex items-center justify-between border-t border-amber-200/50 pt-2 dark:border-amber-900/30">
                  <span>Durasi Per Soal</span>
                  <span className="font-bold text-amber-900 dark:text-amber-100">25-35 Detik</span>
                </li>
                <li className="flex items-center justify-between border-t border-amber-200/50 pt-2 dark:border-amber-900/30">
                  <span>Nilai Minimal</span>
                  <span className="font-bold text-amber-900 dark:text-amber-100">70/100</span>
                </li>
                <li className="flex items-center justify-between border-t border-amber-200/50 pt-2 dark:border-amber-900/30">
                  <span>Pastikan Koneksi Internet Stabil</span>
                  <span className="font-bold text-amber-900 dark:text-amber-100">Paket Data/WiFi</span>
                </li>
                <li className="flex items-center justify-between border-t border-amber-200/50 pt-2 dark:border-amber-900/30">
                  <span>Volume Audio</span>
                  <span className="font-bold text-amber-900 dark:text-amber-100">Wajib Aktif</span>
                </li>

              </ul>
            </div>

            <div className="space-y-2">
              <Button
                className="w-full py-6 text-base font-bold bg-[#21479B] hover:bg-[#1a3778] text-white rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-95"
                onClick={() => {
                  startAudioContext()
                  setIsQuizStarted(true)
                }}
              >
                Mulai Ujian Sekarang
              </Button>

              <Button
                variant="outline"
                className="w-full py-6 text-base font-bold rounded-xl border-2 transition-all active:scale-95"
                onClick={() => router.push("/")}
              >
                Batal
              </Button>

              <p className="text-center text-[10px] leading-relaxed text-muted-foreground italic">
                *Waktu akan segera berjalan setelah tombol diklik.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const progress = ((currentIndex + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with Progress bar */}
      <header className="fixed top-0 w-full bg-background/95 backdrop-blur border-b z-50">
        <div className="container mx-auto px-4 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-[#21479B] text-white px-3 py-1 rounded font-bold text-sm">
                SOAL {currentIndex + 1} / {questions.length}
              </div>
              <div className="text-muted-foreground text-sm">
                {currentQuestion.category}
              </div>
              <ThemeToggle hideText className="bg-transparent border-none hover:bg-muted" />
            </div>

            <div className={`flex items-center gap-3 font-mono text-xl font-bold ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-[#21479B] dark:text-blue-500'}`}>
              <div className="flex items-center gap-1.5">
                <Timer className="h-5 w-5" />
                {timeLeft}S
              </div>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </header>

      {/* Main Quiz Area */}
      <main className="flex-1 mt-28 px-4 mb-6">
        <div className="container mx-auto max-w-6xl">
          <Card className="shadow-sm border-none overflow-hidden">
            <div className="flex flex-col md:flex-row gap-0 md:gap-7">
              {/* Left Side - Media */}
              {currentQuestion.media_url && (
                <div className="w-full md:w-1/2 bg-transparent aspect-video md:aspect-auto flex items-center justify-center">
                  {currentQuestion.media_type === "video" ? (
                    <video
                      src={currentQuestion.media_url}
                      className="w-full h-full object-contain"
                      controls
                      autoPlay
                      playsInline
                      webkit-playsinline="true"
                    />
                  ) : (
                    <img
                      src={currentQuestion.media_url}
                      className="w-full h-full object-contain"
                      alt="Question Media"
                    />
                  )}
                </div>
              )}

              {/* Right Side - Question, Options & Button */}
              <div className={`flex flex-col ${currentQuestion.media_url ? 'w-full md:w-1/2' : 'w-full'}`}>
                <CardContent className="p-5 md:p-5 space-y-8 flex-1">
                  <h2 className="text-lg md:text-lg font-semibold mb-3">
                    {currentQuestion.text}
                  </h2>

                  <div className="grid gap-3">

                    {currentQuestion.options.map((opt, i) => {
                      const letter = String.fromCharCode(65 + i)
                      const isSelected = answers[currentQuestion.id] === opt
                      const isCorrect = opt === currentQuestion.correct_answer
                      const hasAnswered = !!answers[currentQuestion.id]

                      let stateClasses = "border-border"
                      let badgeClasses = "bg-muted text-muted-foreground"

                      if (hasAnswered) {
                        if (isCorrect) {
                          stateClasses = "border-green-500 bg-green-50/50 dark:bg-green-900/20 dark:border-green-400"
                          badgeClasses = "bg-green-500 text-white"
                        } else if (isSelected) {
                          stateClasses = "border-red-500 bg-red-50/50 dark:bg-red-900/20 dark:border-red-400"
                          badgeClasses = "bg-red-500 text-white"
                        } else {
                          stateClasses = "border-border opacity-50"
                        }
                      } else if (isSelected) {
                        stateClasses = "border-[#21479B] bg-blue-50/50 dark:bg-blue-900/20 dark:border-blue-400"
                        badgeClasses = "bg-[#21479B] text-white"
                      }

                      return (
                        <button
                          key={i}
                          type="button"
                          disabled={hasAnswered || isSubmitting}
                          onClick={() => setAnswers(prev => ({ ...prev, [currentQuestion.id]: opt }))}
                          className={`flex items-center justify-start p-3 rounded-xl border-2 transition-all w-full text-left
                            ${!hasAnswered ? 'cursor-pointer hover:bg-muted/50 active:scale-[0.99]' : 'cursor-default'}
                            ${stateClasses}`}
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <span className={`flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-lg font-bold text-sm transition-colors ${badgeClasses}`}>
                              {letter}
                            </span>
                            <span className={`text-base font-medium transition-colors 
                              ${hasAnswered && isCorrect ? 'text-green-700 dark:text-green-300' : 'text-foreground'}
                              ${hasAnswered && isSelected && !isCorrect ? 'text-red-700 dark:text-red-300' : ''}
                              ${!hasAnswered && isSelected ? 'text-[#21479B] dark:text-blue-300' : ''}`}>
                              {opt}
                            </span>
                          </div>

                          {hasAnswered && isCorrect && (
                            <CheckCircle2 className="h-5 w-5 text-green-500 ml-auto animate-in zoom-in duration-300" />
                          )}
                          {hasAnswered && isSelected && !isCorrect && (
                            <XCircle className="h-5 w-5 text-red-500 ml-auto animate-in zoom-in duration-300" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </CardContent>

                {/* Action Button & Placeholder Alert */}
                <div className="flex justify-end p-3 md:p-6 pt-0">
                  {answers[currentQuestion.id] ? (
                    <div className="w-full md:w-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <Button
                        onClick={handleNext}
                        disabled={isSubmitting}
                        className="bg-[#21479B] hover:bg-[#1a3778] text-white px-8 py-6 rounded-xl text-lg w-full md:w-auto shadow-lg shadow-blue-900/10 transition-all active:scale-95"
                      >
                        {isSubmitting ? 'Menyimpan...' : (currentIndex === questions.length - 1 ? 'Selesaikan Tes ✓' : 'Soal Selanjutnya →')}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 px-6 py-4 rounded-xl bg-muted/50 border border-muted text-muted-foreground w-full md:w-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <AlertCircle className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm md:text-base font-medium">Silakan pilih jawaban untuk melanjutkan</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>

      {/* Hidden audio element for persistent context */}
      <audio ref={audioRef} className="hidden" preload="auto" />
    </div>
  )
}
