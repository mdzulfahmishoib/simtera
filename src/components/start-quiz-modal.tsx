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
import { Car, Bike, ClipboardCheck, Crown } from "lucide-react"

export function StartQuizModal() {
  const [open, setOpen] = useState(false)
  const [simType, setSimType] = useState("C")
  const [module, setModule] = useState("Acak")
  const router = useRouter()

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const email = formData.get('email') as string

    if (!name || !email || !simType || !module) return

    // Store in sessionStorage to survive reloads easily
    sessionStorage.setItem('quiz_participant', JSON.stringify({ name, email, simType, module }))

    router.push('/quiz')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            size="lg"
            className="w-fit bg-[#21479B] hover:bg-[#1a3778] text-white text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-2xl shadow-lg flex items-center gap-2 group justify-center transition-transform hover:scale-[1.02] active:scale-95"
          >
            <ClipboardCheck className="h-5 w-5" />
            Mulai Simulasi Tes
          </Button>
        }
      >
        Mulai Simulasi Tes
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Data Peserta</DialogTitle>
          <DialogDescription>
            Silakan masukkan data diri Anda sebelum memulai simulasi ujian teori SIM.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nama Lengkap<span className="text-red-500">*</span></Label>
              <Input id="name" name="name" className="h-9" placeholder="Masukkan nama Anda" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email<span className="text-red-500">*</span></Label>
              <Input id="email" name="email" className="h-9" type="email" placeholder="contoh@email.com" required />
            </div>

            <div className="grid gap-2">
              <Label>Pilih Jenis SIM</Label>
              <div className="grid grid-cols-2 gap-4">

                <button
                  type="button"
                  onClick={() => setSimType("C")}
                  className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all transition-transform hover:scale-[1.02] active:scale-95 ${simType === "C"
                    ? "border-orange-500 bg-orange-500 text-white font-bold shadow-sm"
                    : "border-muted bg-white dark:bg-transparent text-muted-foreground hover:border-orange-500 hover:text-orange-500"
                    }`}
                >
                  <Bike className={`h-6 w-6 ${simType === "C" ? "scale-110" : ""}`} />
                  <span>SIM C (Motor)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSimType("A")}
                  className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all transition-transform hover:scale-[1.02] active:scale-95 ${simType === "A"
                    ? "border-[#21479B] bg-[#21479B] text-white font-bold shadow-sm"
                    : "border-muted bg-white dark:bg-transparent text-muted-foreground hover:border-[#21479B] hover:text-[#21479B]"
                    }`}
                >
                  <Car className={`h-6 w-6 ${simType === "A" ? "scale-110" : ""}`} />
                  <span>SIM A (Mobil)</span>
                </button>

              </div>
            </div>

            {/* Pilihan Modul */}
            <div className="flex flex-col gap-3 mb-4">
              <div className="flex items-center justify-between">
                <Label className="tracking-wider text-black dark:text-white leading-none">
                  Pilih Modul
                </Label>

                {/* Tombol Acak */}
                <button
                  type="button"
                  onClick={() => setModule("Acak")}
                  className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-xs font-medium transition-transform hover:scale-[1.02] active:scale-95 ${module === "Acak"
                    ? "border-[#21479B] bg-[#21479B] text-white shadow-sm"
                    : "border-input bg-background hover:border-accent-foreground text-muted-foreground"
                    /* Hapus translate-y-1 di atas agar tidak merusak alignment vertikal */
                    }`}
                >
                  <span>Acak</span>
                  {/* Lingkaran dengan Icon Crown */}
                  <div className={`flex items-center justify-center w-5 h-5 rounded-full transition-colors ${module === "Acak"
                    ? "bg-yellow-500"
                    : "bg-yellow-500/10"
                    }`}>
                    <Crown className={`h-3 w-3 ${module === "Acak"
                      ? "text-black"
                      : "text-yellow-500"
                      }`} />
                  </div>
                </button>
              </div>

              {/* Daftar Modul (Tanpa Acak) */}
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                {["Modul 1", "Modul 2", "Modul 3", "Modul 4"].map((mod) => (
                  <button
                    key={mod}
                    type="button"
                    onClick={() => setModule(mod)}
                    className={`w-full sm:flex-1 px-3 py-1.5 rounded-md border transition-all text-xs font-medium ${module === mod
                      ? "border-[#21479B] bg-[#21479B] text-white shadow-sm"
                      : "border-input bg-background hover:border-accent-foreground text-muted-foreground"
                      }`}
                  >
                    {mod}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full h-10 bg-[#21479B] hover:bg-[#1a3778] text-white transition-transform hover:scale-[1.02] active:scale-95">Mulai Ujian</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
