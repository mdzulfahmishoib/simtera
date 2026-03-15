import Link from "next/link";
import { ShieldCheck, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button-variants"
import { ThemeToggle } from "./theme-toggle";

export default function Header() {
  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-[#21479B] dark:text-white text-xl hover:opacity-80 transition-opacity cursor-pointer"
        >
          <ShieldCheck className="h-8 w-8" />
          <span>SIMTERA</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="https://tako.id/fahmi.shoib"
            target="_blank"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "items-center gap-2 border-red-300 bg-red-50/50 text-red-700 hover:bg-red-200/50 hover:text-red-800 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
            )}
          >
            <Heart className="h-4 w-4 fill-current animate-pulse" />
            <span>Donasi</span>
          </Link>
          <div className="flex items-center gap-2 border-l pl-2 border-muted">
            <ThemeToggle hideText />
          </div>
        </div>
      </div>
    </header>
  );
}