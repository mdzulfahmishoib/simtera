import Link from "next/link";
import { ShieldCheck, Heart } from "lucide-react"; 
import { cn } from "@/lib/utils"; 
import { buttonVariants } from "@/components/ui/button-variants"
import { ThemeToggle } from "./theme-toggle"; 

export default function Header() {
  return (
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
  );
}