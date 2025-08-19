"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ShoppingBag,
  BookOpen,
  Library,
  Users,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { href: "/Student", icon: Home, label: "Student Dashboard" },
  { href: "/store", icon: ShoppingBag, label: "Store" },
  { href: "/courses", icon: BookOpen, label: "Courses" },
  { href: "/library", icon: Library, label: "Library" },
  { href: "/Educator", icon: Users, label: "Educator" },
  { href: "/settings", icon: Settings, label: "Settings" },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[84px] flex-col items-center gap-4 border-r bg-card/60 backdrop-blur p-3">
      {/* logo */}
      <Link href="/" aria-label="Dashboard home" className="mt-2">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-foreground text-background text-sm font-bold">
          LMS
        </div>
      </Link>

      {/* nav */}
      <TooltipProvider delayDuration={150}>
        <nav className="mt-4 grid gap-3">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active =
              pathname === href || (href !== "/" && pathname?.startsWith(href));
            return (
              <Tooltip key={href}>
                <TooltipTrigger asChild>
                  <Link
                    href={href}
                    aria-label={label}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "grid h-12 w-12 place-items-center rounded-full transition-colors outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      active
                        ? "bg-foreground text-background shadow"
                        : "bg-muted hover:bg-accent text-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="px-2 py-1 text-xs">
                  {label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
      </TooltipProvider>

      {/* profile */}
      <div className="mt-auto mb-3">
        <Link
          href="/profile"
          className="block rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://i.pravatar.cc/48?img=5"
            alt="You"
            className="h-12 w-12 rounded-full object-cover ring-2 ring-foreground/10"
          />
        </Link>
      </div>
    </aside>
  );
}
