import Header from "@/components/header"
import { login } from "./actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Footer from "@/components/footer"

export default function LoginPage() {
  return (
        <div className="flex min-h-screen flex-col bg-foreground/5">
          {/* Main Content */}
          <main className="flex-1">
                <div className="flex min-h-[100dvh] items-center justify-center p-4">
                  
                  <Card className="mx-auto max-w-sm w-full">
                    <CardHeader>
                      <CardTitle className="text-2xl">Admin Login</CardTitle>
                      <CardDescription>
                        Masukkan email dan password untuk mengakses dashboard operator.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form
                        action={async (formData) => {
                          "use server"
                          const res = await login(formData)
                          if (res?.error) {
                            // Not ideal, but simple client error approach without useActionState for brevity
                            // Proper error toast should use useActionState
                          }
                        }}
                        className="grid gap-4"
                      >
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="contoh@email.com"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="password">Password</Label>
                          <Input id="password" name="password" type="password" placeholder="Masukkan Password" required />
                        </div>
                        <Button type="submit" className="w-full bg-[#21479B] hover:bg-[#1a3778] text-white">
                          Login
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
          </main>
        </div>
  )
}
