"use client"

import { useState } from "react"
import { login } from "./actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    try {
      const res = await login(formData)
      if (res?.error) {
        toast.error(res.error)
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-foreground/5">
      {/* Main Content */}
      <main className="flex-1">
        <div className="flex min-h-[100dvh] items-center justify-center p-4">
          <Card className="mx-auto max-w-sm w-full">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-primary dark:text-white">Admin Login</CardTitle>
              <CardDescription>
                Masukkan email dan password untuk mengakses dashboard operator.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                action={handleSubmit}
                className="grid gap-4"
              >
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="contoh@email.com"
                    autoFocus={true}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan Password"
                      required
                      className="pr-10"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Sembunyikan password" : "Tampilkan password"}
                      </span>
                    </Button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#21479B] hover:bg-[#1a3778] text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
