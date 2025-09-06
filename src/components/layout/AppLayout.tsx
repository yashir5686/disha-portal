
"use client";

import Link from "next/link";
import {
  Book,
  Calendar,
  DollarSign,
  Home,
  Lightbulb,
  Menu,
  School,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/icons";
import type { ReactNode } from "react";

const navigationItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/quiz", label: "Recommendation Quiz", icon: Lightbulb },
  { href: "/colleges", label: "Colleges", icon: School },
  { href: "/courses", label: "Courses & Careers", icon: Book },
  { href: "/scholarships", label: "Scholarships", icon: DollarSign },
  { href: "/timeline", label: "Timeline", icon: Calendar },
  { href: "/resources", label: "Study Resources", icon: Book },
  { href: "/profile", label: "Profile", icon: User },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const navLinks = (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {navigationItems.map(({ href, label, icon: Icon }) => (
        <Link
          key={label}
          href={href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
            pathname === href && "bg-muted text-primary"
          )}
        >
          <Icon className="h-4 w-4" />
          {label}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold font-headline">
              <Logo className="h-6 w-6 text-primary" />
              <span>Disha Portal</span>
            </Link>
          </div>
          <div className="flex-1">
            {navLinks}
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link href="/" className="flex items-center gap-2 font-semibold font-headline">
                        <Logo className="h-6 w-6 text-primary" />
                        <span>Disha Portal</span>
                    </Link>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {navLinks}
                </div>
            </SheetContent>
          </Sheet>
           <div className="flex items-center gap-2 font-semibold font-headline md:hidden">
              <Logo className="h-6 w-6 text-primary" />
              <span>Disha Portal</span>
            </div>
        </header>
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
