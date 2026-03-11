'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Car, Bike, ClipboardCheck } from "lucide-react"

export function StartQuizModal() {
  const [open, setOpen] = useState(false)
  const [simType, setSimType] = useState("C")
  const router = useRouter()

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    // simType is now from state

    if (!name || !email || !simType) return

    // Store in sessionStorage to survive reloads easily
    sessionStorage.setItem('quiz_participant', JSON.stringify({ name, email, simType }))

    router.push('/quiz')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            size="lg"
            className="bg-[#21479B] hover:bg-[#1a3778] text-white text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full shadow-lg flex items-center gap-2 group w-full sm:w-auto justify-center"
          >
            <ClipboardCheck className="h-5 sm:h-6 w-5 sm:w-6" />
            Mulai Simulasi Tes
          </Button>
        }
      >
        Mulai Simulasi Tes
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Data Peserta</DialogTitle>
          <DialogDescription>
            Silakan masukkan data diri Anda sebelum memulai simulasi ujian teori SIM.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input id="name" name="name" placeholder="Masukkan nama Anda" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="contoh@email.com" required />
            </div>

            <div className="grid gap-2 mt-2">
              <Label className="mb-2">Pilih Jenis SIM</Label>
              <div className="grid grid-cols-2 gap-4">

                <button
                  type="button"
                  onClick={() => setSimType("C")}
                  className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${simType === "C"
                    ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 font-bold shadow-sm"
                    : "border-muted bg-white dark:bg-transparent text-muted-foreground hover:border-muted-foreground"
                    }`}
                >
                  <Bike className={`h-6 w-6 ${simType === "C" ? "scale-110" : ""}`} />
                  <span>SIM C (Motor)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSimType("A")}
                  className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${simType === "A"
                    ? "border-[#21479B] bg-blue-50 dark:bg-blue-900/20 text-[#21479B] dark:text-blue-500 font-bold shadow-sm"
                    : "border-muted bg-white dark:bg-transparent text-muted-foreground hover:border-muted-foreground"
                    }`}
                >
                  <Car className={`h-6 w-6 ${simType === "A" ? "scale-110" : ""}`} />
                  <span>SIM A (Mobil)</span>
                </button>

              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full bg-[#21479B] hover:bg-[#1a3778] text-white">Mulai Ujian</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
