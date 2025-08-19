"use client"

import { useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Star, StarHalf, Globe, Languages, RefreshCcw, BadgeCheck, Download, Smartphone, MonitorSmartphone,
  Play, Heart, Share2, Clock, ChevronDown, Lock, CheckCircle2
} from "lucide-react"

/* ------------------------------ mock data ------------------------------ */
/** Replace with a fetch by slug later */
type Lecture = { id: string; title: string; duration: string; preview?: boolean }
type Section = { id: string; title: string; lectures: Lecture[] }
type Review = { id: string; user: string; rating: number; text: string; date: string }
type Course = {
  title: string
  subtitle: string
  rating: number
  reviews: number
  students: number
  lastUpdated: string
  language: string
  captions: string[]
  includes: string[]
  priceINR: number
  oldPriceINR?: number
  whatYouWillLearn: string[]
  requirements: string[]
  description: string
  sections: Section[]
  instructor: {
    name: string
    title: string
    avatar: string
    rating: number
    students: number
    courses: number
    bio: string
  },
  reviewsList: Review[]
  previewMp4?: string

}

const sample: Course = {
  title: "AI for Everyone: Practical ChatGPT Workflows",
  subtitle: "Automate tasks, ideate faster, and build reliable AI prompts with hands-on projects.",
  rating: 4.7,
  reviews: 51623,
  students: 213_000,
  lastUpdated: "2025-05",
  language: "English",
  captions: ["English", "Spanish", "Hindi"],
  includes: [
    "10 hours on-demand video",
    "12 articles",
    "24 downloadable resources",
    "Mobile & TV access",
    "Certificate of completion",
    "30-day money-back guarantee",
  ],
  priceINR: 569, oldPriceINR: 3089,
  whatYouWillLearn: [
    "Craft dependable prompts for research, writing, and coding",
    "Automate spreadsheets & docs with AI agents",
    "Design a personal knowledge workflow using ChatGPT",
    "Ethical & safe usage patterns for teams",
  ],
  requirements: [
    "No prior AI knowledge required",
    "Basic computer literacy (copy/paste, files, spreadsheets)",
    "A free ChatGPT account (or any LLM access)",
  ],
  description:
    "In this course, you'll learn practical systems to turn AI into a daily productivity tool. We cover prompt patterns, evaluation, and building repeatable workflows for research, writing, and light automation. Projects include a research brief generator, inbox triage assistant, and spreadsheet automations.",
  sections: [
    {
      id: "s1",
      title: "Getting Started",
      lectures: [
        { id: "l1", title: "Welcome & course tour", duration: "05:12", preview: true },
        { id: "l2", title: "Setting up your accounts", duration: "07:40" },
        { id: "l3", title: "Prompt mindset & rules", duration: "09:02" },
      ],
    },
    {
      id: "s2",
      title: "Prompt Patterns",
      lectures: [
        { id: "l4", title: "Chain-of-Thought & trees", duration: "11:18" },
        { id: "l5", title: "Research briefs (project)", duration: "13:40", preview: true },
        { id: "l6", title: "Summaries, outlines, drafts", duration: "08:51" },
      ],
    },
  ],
  instructor: {
    name: "Aisha Khan",
    title: "Productivity engineer & AI educator",
    avatar: "https://i.pravatar.cc/150?img=58",
    rating: 4.8,
    students: 180_000,
    courses: 8,
    bio: "Aisha has built AI-assisted workflows for teams across consulting and SaaS. She teaches pragmatic systems that stick.",
  },
  reviewsList: [
    { id: "r1", user: "Dev Sharma", rating: 5, text: "Tight, practical, no fluff. The templates are gold.", date: "2 weeks ago" },
    { id: "r2", user: "Sonal M.", rating: 4, text: "Loved the projects. Would like more advanced agent demos.", date: "1 month ago" },
  ],
  previewMp4: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",

}

/* ------------------------------ helpers ------------------------------ */
const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-")

function Stars({ value, size = 16 }: { value: number; size?: number }) {
  const full = Math.floor(value)
  const half = value - full >= 0.5
  return (
    <div className="inline-flex items-center">
      {Array.from({ length: 5 }).map((_, i) =>
        i < full ? (
          <Star key={i} className="text-amber-400 fill-amber-400" style={{ width: size, height: size }} />
        ) : i === full && half ? (
          <StarHalf key={i} className="text-amber-400 fill-amber-400" style={{ width: size, height: size }} />
        ) : (
          <Star key={i} className="text-muted-foreground" style={{ width: size, height: size }} />
        )
      )}
    </div>
  )
}

/* ------------------------------ layout ------------------------------ */
export default function CourseDetailPage() {
  const params = useParams<{ slug: string }>()
  const router = useRouter()

  const [previewOpen, setPreviewOpen] = useState(false)

  function handlePlayPreview() {
    if (!course.previewMp4) return
    setPreviewOpen(true)
    // optional: scroll the preview into view
    setTimeout(() => {
      document.getElementById("course-preview")?.scrollIntoView({ behavior: "smooth", block: "center" })
    }, 0)
  }

  // In real app fetch by params.slug. Here we just use sample:
  const course = sample

  const totalLectures = useMemo(() => course.sections.reduce((n, s) => n + s.lectures.length, 0), [course])
  const totalLength = useMemo(
    () => course.sections.flatMap(s => s.lectures).reduce((m, l) => {
      const [mm, ss] = l.duration.split(":").map(Number)
      return m + (mm * 60 + ss)
    }, 0),
    [course]
  )
  const totalLengthH = `${Math.floor(totalLength / 3600)}h ${Math.round((totalLength % 3600) / 60)}m`

  return (
    <main className="min-h-screen">
      {/* Sticky topbar (mobile) */}
      <div className="lg:hidden sticky top-0 z-40 border-b bg-background/80 backdrop-blur px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium line-clamp-1">{course.title}</div>
          <Button size="sm" onClick={() => alert("Added to cart")}>Add to cart</Button>
        </div>
      </div>

      {/* One grid that spans the whole page: LEFT content + RIGHT sticky card */}
      <div className="mx-auto max-w-7xl px-6 py-8 lg:py-10 lg:grid lg:grid-cols-[1fr_360px] lg:gap-8">
        {/* LEFT: hero + all body content */}
        <div className="min-w-0">
          {/* HERO (no inner grid/aside here) */}
          <section className="bg-gradient-to-b from-muted/40 to-background -mx-6 px-6 py-8 lg:mx-0 lg:rounded-2xl">
            <nav className="mb-2 text-xs text-muted-foreground">
              Home / Courses /{" "}
              <span className="text-foreground">
                {params?.slug?.toString().replaceAll("-", " ")}
              </span>
            </nav>

            <h1 className="text-3xl lg:text-4xl font-bold leading-tight">{course.title}</h1>
            <p className="mt-2 text-muted-foreground">{course.subtitle}</p>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <span className="font-semibold">{course.rating.toFixed(1)}</span>
                <Stars value={course.rating} />
                <a className="underline decoration-dotted cursor-pointer">
                  ({course.reviews.toLocaleString()} ratings)
                </a>
                <span>· {course.students.toLocaleString()} students</span>
              </div>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <RefreshCcw className="h-3.5 w-3.5" /> Last updated {course.lastUpdated}
              </span>
              <span className="inline-flex items-center gap-1">
                <Globe className="h-3.5 w-3.5" /> {course.language}
              </span>
              <span className="inline-flex items-center gap-1">
                <Languages className="h-3.5 w-3.5" /> Subtitles: {course.captions.join(", ")}
              </span>
            </div>
          </section>

          {/* ▶️ Course preview shown under the title */}
          {previewOpen && course.previewMp4 && (
            <div id="course-preview" className="mt-4 rounded-2xl overflow-hidden border bg-card/50">
              <div className="flex items-center justify-between px-3 py-2">
                <div className="text-sm font-medium">Course preview</div>
                <Button variant="ghost" size="sm" onClick={() => setPreviewOpen(false)}>
                  Close
                </Button>
              </div>
              <div className="relative aspect-video bg-black">
                <video
                  src={course.previewMp4}
                  className="absolute inset-0 h-full w-full object-cover"
                  controls
                  autoPlay
                  playsInline
                  muted  // helps autoplay across browsers
                />
              </div>
            </div>
          )}


          {/* BODY */}
          <section className="py-10">
            {/* What you'll learn */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>What you'll learn</CardTitle>
                <CardDescription>Concrete outcomes you can expect</CardDescription>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-3">
                {course.whatYouWillLearn.map((w, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                    <p className="text-sm">{w}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Course content */}
            <Card className="mt-6 rounded-2xl">
              <CardHeader>
                <CardTitle>Course content</CardTitle>
                <CardDescription>
                  {course.sections.length} sections • {totalLectures} lectures • {totalLengthH} total length
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="space-y-3 mb-4">
                  {course.sections.map((s) => (
                    <AccordionItem key={s.id} value={s.id} className="rounded-xl border px-3">
                      <AccordionTrigger className="py-3 hover:no-underline">
                        <div className="flex w-full items-center justify-between">
                          <span className="font-medium">{s.title}</span>
                          <span className="text-xs text-muted-foreground">{s.lectures.length} lectures</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="pb-3">
                          {s.lectures.map((l) => (
                            <li key={l.id} className="flex items-center justify-between gap-3 px-1 py-2 text-sm">
                              <div className="flex items-center gap-2 min-w-0">
                                {l.preview ? <Play className="h-4 w-4" /> : <Lock className="h-4 w-4 text-muted-foreground" />}
                                <span className="truncate">{l.title}</span>
                                {l.preview && <Badge className="rounded-full">Preview</Badge>}
                              </div>
                              <span className="text-xs text-muted-foreground">{l.duration}</span>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* Requirements & Description */}
            <div className="mt-6 grid lg:grid-cols-2 gap-6">
              <Card className="rounded-2xl">
                <CardHeader><CardTitle>Requirements</CardTitle></CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2 text-sm">
                    {course.requirements.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardHeader><CardTitle>Description</CardTitle></CardHeader>
                <CardContent>
                  <ReadMore text={course.description} />
                </CardContent>
              </Card>
            </div>

            {/* Instructor */}
            <Card className="mt-6 rounded-2xl">
              <CardHeader>
                <CardTitle>Instructor</CardTitle>
                <CardDescription>About your instructor</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={course.instructor.avatar} />
                  <AvatarFallback>{course.instructor.name.split(" ").map(s => s[0]).join("")}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="font-semibold">{course.instructor.name}</div>
                  <div className="text-sm text-muted-foreground">{course.instructor.title}</div>
                  <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Stars value={course.instructor.rating} /> {course.instructor.rating.toFixed(1)} Instructor rating
                    </span>
                    <span>{course.instructor.students.toLocaleString()} students</span>
                    <span>{course.instructor.courses} courses</span>
                  </div>
                  <p className="mt-3 text-sm">{course.instructor.bio}</p>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card className="mt-6 rounded-2xl">
              <CardHeader>
                <CardTitle>Student feedback</CardTitle>
                <CardDescription>What learners say</CardDescription>
              </CardHeader>
              <CardContent className="grid lg:grid-cols-[220px_1fr] gap-6">
                <div className="flex flex-col items-center justify-center">
                  <div className="text-5xl font-bold">{course.rating.toFixed(1)}</div>
                  <Stars value={course.rating} size={20} />
                  <div className="mt-1 text-xs text-muted-foreground">{course.reviews.toLocaleString()} ratings</div>
                  <div className="mt-4 w-full space-y-1">
                    {[5, 4, 3, 2, 1].map((n, i) => (
                      <div key={n} className="flex items-center gap-2">
                        <span className="w-5 text-xs">{n}</span>
                        <Progress value={Math.max(5 - i, 1) * 18} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  {course.reviewsList.map(r => (
                    <div key={r.id} className="rounded-xl border p-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8"><AvatarFallback>{r.user[0]}</AvatarFallback></Avatar>
                        <div className="text-sm font-medium">{r.user}</div>
                        <span className="ml-2"><Stars value={r.rating} /></span>
                        <span className="ml-auto text-xs text-muted-foreground">{r.date}</span>
                      </div>
                      <p className="mt-2 text-sm">{r.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Mobile purchase (non-sticky) */}
            <aside className="lg:hidden mt-6">
              <PurchaseCard course={course} onPlayPreview={handlePlayPreview} />
            </aside>
          </section>
        </div>

        {/* RIGHT: sticky purchase/video detail card (desktop) */}
        <aside className="hidden lg:block">
          <div className="sticky top-6">
            <PurchaseCard course={course} onPlayPreview={handlePlayPreview} />
          </div>
        </aside>
      </div>
    </main>

  )
}

/* --------------------------- subcomponents --------------------------- */

function ReadMore({ text }: { text: string }) {
  const [open, setOpen] = useState(false)
  const short = text.length > 420 ? text.slice(0, 420) + "…" : text
  return (
    <div className="text-sm">
      <p>{open ? text : short}</p>
      {text.length > 420 && (
        <Button variant="link" className="px-0" onClick={() => setOpen(!open)}>
          {open ? "Show less" : "Show more"}
        </Button>
      )}
    </div>
  )
}

function PurchaseCard({ course, onPlayPreview }: { course: Course; onPlayPreview?: () => void }) {
  const router = useRouter()
  const [play, setPlay] = useState(false)
  const price = inr.format(course.priceINR)
  const old = course.oldPriceINR ? inr.format(course.oldPriceINR) : undefined
  const discount = course.oldPriceINR ? Math.max(0, Math.round(((course.oldPriceINR - course.priceINR) / course.oldPriceINR) * 100)) : 0

  return (
    <Card className="sticky top-6 rounded-2xl overflow-hidden">
      {/* Poster / Preview */}
      <div className="relative aspect-video w-full bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <Button
          size="icon"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full h-12 w-12"
          onClick={(e) => { e.stopPropagation(); onPlayPreview?.(); }}
          aria-label="Play preview"
        >
          <Play className="h-5 w-5" />
        </Button>
        <button
          className="absolute right-3 bottom-3 rounded-full bg-white/90 px-3 py-1 text-xs shadow"
          onClick={(e) => { e.stopPropagation(); router.push(`/courses/${slugify(course.title)}`) }}
        >
          View details
        </button>
      </div>

      <CardContent className="p-5">
        <div className="flex items-end gap-3">
          <div className="text-3xl font-extrabold">{price}</div>
          {old && <div className="text-sm text-muted-foreground line-through">{old}</div>}
          {discount > 0 && <Badge className="rounded-full">-{discount}%</Badge>}
        </div>

        <div className="mt-3 grid gap-2">
          <Button className="w-full">Buy now</Button>
          <Button variant="secondary" className="w-full">Add to cart</Button>
        </div>

        <p className="mt-3 text-xs text-muted-foreground inline-flex items-center gap-1">
          <RefreshCcw className="h-3 w-3" /> 30-day money-back guarantee
        </p>

        <Separator className="my-4" />

        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2"><Clock className="h-4 w-4" />  {course.includes[0]}</li>
          <li className="flex items-center gap-2"><Download className="h-4 w-4" /> {course.includes[2]}</li>
          <li className="flex items-center gap-2"><MonitorSmartphone className="h-4 w-4" /> Mobile & TV access</li>
          <li className="flex items-center gap-2"><BadgeCheck className="h-4 w-4" /> Certificate of completion</li>
        </ul>
      </CardContent>

      <CardFooter className="flex gap-2 p-5 pt-0">
        <Button variant="outline" className="w-full">Share</Button>
        <Button variant="outline" className="w-full">Gift this course</Button>
      </CardFooter>
    </Card>
  )
}
