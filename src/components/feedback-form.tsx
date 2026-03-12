"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { RotateCw, MessageSquarePlus, Send, ShieldCheck } from "lucide-react"
import { toast } from "sonner"
import { submitFeedback } from "@/app/result/actions"

interface FeedbackFormProps {
  defaultName?: string
  defaultEmail?: string
}

export function FeedbackForm({ defaultName, defaultEmail }: FeedbackFormProps) {
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState("")
  const [captchaInput, setCaptchaInput] = useState("")
  const [captchaCode, setCaptchaCode] = useState("")

  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    let result = ""
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setCaptchaCode(result)
  }

  useEffect(() => {
    generateCaptcha()
  }, [])

  const handleSubmit = async (formData: FormData) => {
    if (captchaInput.toUpperCase() !== captchaCode) {
      toast.error("Captcha salah. Silakan coba lagi.")
      generateCaptcha()
      setCaptchaInput("")
      return
    }

    setLoading(true)

    // Add default values since they are no longer in visible inputs
    if (defaultName) formData.append("participant_name", defaultName)
    if (defaultEmail) formData.append("participant_email", defaultEmail)

    const res = await submitFeedback(formData)

    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success("Terima kasih! Masukan Anda telah terkirim.")
      setContent("")
      setCaptchaInput("")
      generateCaptcha()
      const form = document.getElementById("feedback-form") as HTMLFormElement
      form?.reset()
    }
    setLoading(false)
  }

  const isButtonDisabled = loading || !content.trim() || !captchaInput.trim()

  return (
    <Card className="border-none shadow-lg bg-white dark:bg-transparent overflow-hidden">
      <CardContent className="py-4 px-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-md bg-orange-500/10 text-orange-600 dark:bg-orange-400/20 dark:text-orange-300">
            <MessageSquarePlus className="h-4 w-4" />
          </div>
          <h3 className="font-semibold text-base md:text-xl text-md">Berikan Masukan atau Koreksi Soal</h3>
        </div>

        <p className="text-md text-muted-foreground mb-4">
          Punya kritik, saran, atau menemukan kesalahan pada soal simulasi tes SIM ini ? Kirimkan masukan Anda melalui form ini.
        </p>

        <form
          id="feedback-form"
          action={handleSubmit}
          className="space-y-4"
        >
          <div className="space-y-1">
            <Textarea
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tuliskan kritik, saran, atau koreksi Anda di sini..."
              required
              className="min-h-[90px] text-sm bg-muted/50 border border-muted-foreground/30 resize-none p-2.5 rounded-md
              focus-visible:ring-1 focus-visible:ring-[#21479B]/30 focus-visible:border-[#21479B]"
            />
          </div>

          {/* CAPTCHA SECTION */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground ml-1 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" /> Verifikasi Keamanan
            </label>

            <div className="flex items-center gap-2">
              <div className="bg-muted px-3 py-1.5 rounded-md font-mono font-black text-[#21479B] tracking-[4px] select-none text-sm border border-dashed border-[#21479B] flex items-center justify-center min-w-[80px] dark:text-blue-300">
                {captchaCode}
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-[#21479B]"
                onClick={generateCaptcha}
                title="Refresh Captcha"
              >
                <RotateCw className="h-3.5 w-3.5" />
              </Button>

              <Input
                type="text"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                placeholder="Kode"
                className="h-8 text-sm bg-muted/50 border-none w-24 text-center font-bold uppercase"
                maxLength={4}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isButtonDisabled}
            className={`w-full h-9 text-sm font-semibold rounded-lg transition-all active:scale-[0.98] ${isButtonDisabled
              ? 'bg-gray-200 text-gray-500 border border-gray-300 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600'
              : 'bg-[#21479B] hover:bg-[#1a3778] text-white dark:bg-[#2b5ad1] dark:hover:bg-[#234bb0]'
              }`}
          >
            {loading ? "Mengirim..." : (
              <>
                <Send className="mr-1.5 h-3.5 w-3.5" />
                Kirim Masukan
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
