'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { QuestionCategory, createQuestion } from "./actions"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Plus } from "lucide-react"

export function CreateQuestionModal() {
  const [open, setOpen] = useState(false)
  const [category, setCategory] = useState<QuestionCategory>("Persepsi Bahaya")
  const [loading, setLoading] = useState(false)

  const [opt1, setOpt1] = useState("")
  const [opt2, setOpt2] = useState("")
  const [opt3, setOpt3] = useState("")

  async function handleAction(formData: FormData) {
    if (!category) {
      toast.error('Please select a category')
      return
    }
    formData.append('category', category)
    setLoading(true)
    const res = await createQuestion(formData)
    setLoading(false)

    if (res?.error) {
      toast.error(res.error)
    } else {
      toast.success("Question created successfully")
      setOpen(false)
      // Reset local opts
      setOpt1("")
      setOpt2("")
      setOpt3("")
    }
  }

  const isPersepsi = category === 'Persepsi Bahaya'

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button className="bg-[#21479B] hover:bg-[#1a3778] text-white" />}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Question
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Question</DialogTitle>
          <DialogDescription>
            Add a new question to the bank. Upload media if needed.
          </DialogDescription>
        </DialogHeader>
        <form
          action={handleAction}
          className="space-y-4"
          onKeyDown={(e) => {
            // Submit on Enter (but not in textarea unless it's Ctrl+Enter)
            if (e.key === 'Enter') {
              const target = e.target as HTMLElement;
              const isTextarea = target.tagName.toLowerCase() === 'textarea';

              if (isTextarea) {
                if (e.ctrlKey || e.metaKey) {
                  e.preventDefault();
                  target.closest('form')?.requestSubmit();
                }
              } else {
                // For regular inputs and other elements
                e.preventDefault();
                target.closest('form')?.requestSubmit();
              }
            }
          }}
        >

          {/* Gunakan w-full agar kontainer utama selalu memenuhi lebar layar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">

            {/* Row 1 / Col 1 */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={(v) => setCategory(v as QuestionCategory)} defaultValue="Persepsi Bahaya">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Persepsi Bahaya">Persepsi Bahaya</SelectItem>
                  <SelectItem value="Wawasan">Wawasan</SelectItem>
                  <SelectItem value="Pengetahuan">Pengetahuan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Row 2 / Col 2 - Hapus justify-self-center agar penuh di mobile */}
            <div className="space-y-2">
              <Label htmlFor="sim_type">SIM Type</Label>
              <Select name="sim_type" defaultValue="C" required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select SIM Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="C">SIM C (Motor)</SelectItem>
                  <SelectItem value="A">SIM A (Mobil)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Row 3 / Col 3 - Hapus justify-self-end agar penuh di mobile */}
            <div className="space-y-2">
              <Label htmlFor="module">Modul</Label>
              <Select name="module" defaultValue="Modul 4" required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Modul" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Modul 1">Modul 1</SelectItem>
                  <SelectItem value="Modul 2">Modul 2</SelectItem>
                  <SelectItem value="Modul 3">Modul 3</SelectItem>
                  <SelectItem value="Modul 4">Modul 4</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </div>

          <div className="space-y-2">
            <Label htmlFor="text">Question Text</Label>
            <Textarea
              id="text"
              name="text"
              placeholder="Enter the question text here..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="media">Media File (Optional - Image/MP4)</Label>
              <Input id="media" name="media" type="file" accept="image/*,video/mp4" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="external_url">External URL (Image / YouTube)</Label>
              <Input id="external_url" name="external_url" placeholder="https://i.ibb.co.com/... or https://youtube.com/..." />
            </div>
          </div>

          {isPersepsi && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="audio" className="flex items-center gap-2">
                  Audio File
                  <span className="text-xs text-muted-foreground font-normal">(Auto-play saat tes)</span>
                </Label>
                <Input id="audio" name="audio" type="file" accept="audio/*" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="external_audio_url">External Audio URL (Optional)</Label>
                <Input id="external_audio_url" name="external_audio_url" placeholder="https://..." />
              </div>
            </div>
          )}

          {category && (
            <Card className="p-4 bg-muted/50 space-y-4">
              <h4 className="font-semibold text-sm mb-0">Options & Answer</h4>

              {isPersepsi ? null : (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="option_1">Option A</Label>
                    <Input id="option_1" name="option_1" value={opt1} onChange={(e) => setOpt1(e.target.value)} required className="bg-white dark:bg-transparent" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="option_2">Option B</Label>
                    <Input id="option_2" name="option_2" value={opt2} onChange={(e) => setOpt2(e.target.value)} required className="bg-white dark:bg-transparent" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="option_3">Option C</Label>
                    <Input id="option_3" name="option_3" value={opt3} onChange={(e) => setOpt3(e.target.value)} className="bg-white dark:bg-transparent" />
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-2 border-t">
                <Label htmlFor="correct_answer">Correct Answer</Label>
                <Select name="correct_answer" required>
                  <SelectTrigger className="w-full px-3 py-2 bg-white dark:bg-transparent">
                    <SelectValue placeholder="Pilih jawaban benar" />
                  </SelectTrigger>
                  <SelectContent>
                    {isPersepsi ? (
                      <>
                        <SelectItem value="Mengurangi Kecepatan">Mengurangi Kecepatan</SelectItem>
                        <SelectItem value="Melakukan Pengereman">Melakukan Pengereman</SelectItem>
                        <SelectItem value="Mempertahankan Kecepatan (Stabil)">Mempertahankan Kecepatan (Stabil)</SelectItem>
                      </>
                    ) : (
                      <>
                        {opt1 && <SelectItem value={opt1}>{opt1}</SelectItem>}
                        {opt2 && <SelectItem value={opt2}>{opt2}</SelectItem>}
                        {opt3 && <SelectItem value={opt3}>{opt3}</SelectItem>}
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </Card>
          )}

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Question'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
