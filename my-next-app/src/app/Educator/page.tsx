"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Star,
  Users,
  IndianRupee,
  FilePenLine,
  Play,
} from "lucide-react"

/* ----------------------------- helpers ----------------------------- */

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
})

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-")

type Course = {
  id: string
  title: string
  poster: string
  status: "draft" | "published"
  rating?: number
  students?: number
  priceINR?: number
  oldPriceINR?: number
  progress?: number // drafts only
  updated?: string  // drafts only
}

/* ----------------------------- mock data ----------------------------- */

const courses: Course[] = [
  {
    id: "1",
    title: "AI for Everyone: Practical ChatGPT Workflows",
    poster:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
    status: "published",
    rating: 4.7,
    students: 213000,
    priceINR: 569,
    oldPriceINR: 3089,
  },
  {
    id: "2",
    title: "Concise Business Writing with AI",
    poster:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
    status: "published",
    rating: 4.8,
    students: 1463,
    priceINR: 649,
    oldPriceINR: 2599,
  },
  {
    id: "3",
    title: "Prompt Patterns Masterclass",
    poster:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
    status: "draft",
    progress: 62,
    updated: "2 days ago",
  },
  {
    id: "4",
    title: "Camera Presence for Founders",
    poster:
      "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?q=80&w=1200&auto=format&fit=crop",
    status: "draft",
    progress: 35,
    updated: "1 week ago",
  },
]

/* ----------------------------- components ----------------------------- */

function Kpi({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <Card className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur">
      <CardContent className="p-4 flex items-center gap-3">
        <span className="rounded-xl bg-foreground/5 p-2">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-xl font-semibold">{value}</div>
        </div>
      </CardContent>
    </Card>
  )
}

function CourseCard({ c }: { c: Course }) {
  const router = useRouter()
  const href =
    c.status === "published"
      ? `/courses/${slugify(c.title)}`
      : `/instructor/courses/${slugify(c.title)}/edit`

  const discount =
    c.oldPriceINR && c.priceINR
      ? Math.max(0, Math.round(((c.oldPriceINR - c.priceINR) / c.oldPriceINR) * 100))
      : 0

  const go = () => router.push(href)

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={go}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && go()}
      className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur shadow-sm hover:shadow-md transition"
    >
      <div className="relative overflow-hidden rounded-t-2xl" style={{ aspectRatio: "16/9" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={c.poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/35" />

        {/* status + action hint */}
        <div className="absolute left-2 top-2 flex items-center gap-2">
          <Badge className="rounded-full bg-white/90 text-foreground hover:bg-white">
            {c.status === "published" ? "Published" : "Saved"}
          </Badge>
        </div>

        <div className="absolute right-2 bottom-2 rounded-full bg-white/95 p-2 shadow">
          {c.status === "published" ? <Play className="h-4 w-4" /> : <FilePenLine className="h-4 w-4" />}
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold leading-snug line-clamp-2">{c.title}</h3>

        {c.status === "published" ? (
          <>
            <div className="mt-2 flex items-center gap-2 text-sm">
              <span className="font-semibold">{c.rating?.toFixed(1)}</span>
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-xs text-muted-foreground">
                <Users className="inline h-3.5 w-3.5 mr-1" />
                {c.students?.toLocaleString()} students
              </span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <span className="text-lg font-extrabold">{inr.format(c.priceINR ?? 0)}</span>
              {c.oldPriceINR ? (
                <span className="text-sm text-muted-foreground line-through">
                  {inr.format(c.oldPriceINR)}
                </span>
              ) : null}
              {discount > 0 && <Badge className="rounded-full">-{discount}%</Badge>}
            </div>
          </>
        ) : (
          <>
            <div className="mt-3 text-xs text-muted-foreground">
              Last edited {c.updated ?? "—"}
            </div>
            <div className="mt-2">
              <Progress value={c.progress ?? 0} />
              <div className="mt-1 text-xs text-muted-foreground">
                {Math.round(c.progress ?? 0)}% complete — click to continue editing
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

/* ------------------------------ page ------------------------------ */

export default function EducatorDashboardPage() {
  const [tab, setTab] = useState<"all" | "saved" | "published">("all")

  const published = useMemo(() => courses.filter((c) => c.status === "published"), [])
  const saved = useMemo(() => courses.filter((c) => c.status === "draft"), [])

  return (
    <main className="min-h-screen">
      <Sidebar />

      <section className="md:pl-[84px]">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <header className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Educator Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Manage your saved and published courses
              </p>
            </div>
            <Button onClick={() => (window.location.href = "/instructor/courses/new")}>
              Create course
            </Button>
          </header>

          {/* KPIs */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi label="Published courses" value={published.length.toString()} icon={Play} />
            <Kpi label="Saved (drafts)" value={saved.length.toString()} icon={FilePenLine} />
            <Kpi
              label="Total students"
              value={published.reduce((n, c) => n + (c.students ?? 0), 0).toLocaleString()}
              icon={Users}
            />
            <Kpi
              label="Top price"
              value={inr.format(
                published.reduce((m, c) => Math.max(m, c.priceINR ?? 0), 0)
              )}
              icon={IndianRupee}
            />
          </div>

          {/* Tabs */}
          <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3 rounded-xl">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {courses.map((c) => (
                  <CourseCard key={c.id} c={c} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="saved" className="mt-6">
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {saved.length ? saved.map((c) => <CourseCard key={c.id} c={c} />) : (
                  <Card className="rounded-2xl p-6 text-sm text-muted-foreground">
                    You don’t have any drafts. Create a new course to get started.
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="published" className="mt-6">
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {published.length ? published.map((c) => <CourseCard key={c.id} c={c} />) : (
                  <Card className="rounded-2xl p-6 text-sm text-muted-foreground">
                    No published courses yet.
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  )
}
