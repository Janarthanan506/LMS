"use client"

import { Sidebar } from "@/components/Sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Star, Boxes, Laptop, Film, Briefcase, Package, Play, Heart } from "lucide-react"
import { useRouter } from "next/navigation"


/* ---------- currency helper ---------- */
const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
})

/* ---------- types ---------- */
type VideoCourseCardProps = {
  tint?: "rose" | "amber" | "violet" | "teal"
  title: string
  instructors: string
  rating: number
  reviews: number
  priceNow: number
  priceWas: number
  badge?: string
  src: string
  poster?: string
}

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-")


/* ===================== video card (restyled) ===================== */
function VideoCourseCard({
  tint = "rose",
  title,
  instructors,
  rating,
  reviews,
  priceNow,
  priceWas,
  badge,
  src,        // kept for future but unused here
  poster,     // used as placeholder image
}: VideoCourseCardProps) {
  const router = useRouter()

  // gradient ring color by tint
  const ringMap: Record<NonNullable<VideoCourseCardProps["tint"]>, string> = {
    rose: "from-rose-400/40",
    amber: "from-amber-400/40",
    violet: "from-violet-400/40",
    teal: "from-teal-400/40",
  }

  const discount =
    priceWas > 0 ? Math.max(0, Math.round(((priceWas - priceNow) / priceWas) * 100)) : 0

  const href = `/courses/${slugify(title)}`

  const goToDetail = () => router.push(href)

  return (
    <div className={`group rounded-2xl bg-gradient-to-br ${ringMap[tint]} to-transparent p-[1.2px] transition`}>
      <Card className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur shadow-sm transition group-hover:shadow-lg group-hover:ring-1 group-hover:ring-foreground/10">
        <CardContent className="p-3">
          {/* media: placeholder poster, whole area navigates */}
          <div
            className="relative overflow-hidden rounded-xl cursor-pointer"
            style={{ aspectRatio: "16 / 9" }}
            role="button"
            tabIndex={0}
            aria-label={`Open ${title} course details`}
            onClick={goToDetail}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && goToDetail()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                poster ??
                "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop"
              }
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* soft vignette */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/35" />

            {/* wishlist (doesn't navigate) */}
            <button
              aria-label="Add to wishlist"
              className="absolute right-2 top-2 z-10 rounded-full bg-white/90 p-2 shadow hover:bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <Heart className="h-4 w-4" />
            </button>

            {/* “View course” chip on hover */}
            <div className="absolute left-3 bottom-3 z-10">
              <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-medium shadow transition group-hover:translate-y-[-1px]">
                View course →
              </span>
            </div>

            {/* corner chips (optional meta) */}
            <div className="absolute left-2 top-2 flex gap-2">
              <span className="rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-medium text-white">
                Preview
              </span>
              <span className="rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-medium text-white">
                1080p
              </span>
            </div>
          </div>

          {/* body */}
          <div className="p-3">
            <div className="flex items-start gap-2">
              <h3 className="text-[17px] font-semibold leading-snug">{title}</h3>
              {badge ? (
                <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                  {badge}
                </span>
              ) : null}
            </div>

            <p className="mt-1 text-sm text-muted-foreground truncate">{instructors}</p>

            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm font-semibold">{rating.toFixed(1)}</span>
              <div className="flex items-center gap-[2px]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">({reviews.toLocaleString()})</span>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <span className="text-lg font-extrabold">{inr.format(priceNow)}</span>
              <span className="text-sm text-muted-foreground line-through">{inr.format(priceWas)}</span>
              {discount > 0 && (
                <span className="rounded-md bg-foreground/5 px-2 py-0.5 text-xs font-medium">Save {discount}%</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function CategoryPills() {
  const cats = [
    { value: "all", icon: Boxes, label: "All" },
    { value: "it", icon: Laptop, label: "IT & Software" },
    { value: "media", icon: Film, label: "Media Training" },
    { value: "biz", icon: Briefcase, label: "Business" },
    { value: "interior", icon: Package, label: "Interior" },
  ]

  return (
    <ToggleGroup type="single" defaultValue="all" className="flex flex-wrap gap-3">
      {cats.map(({ value, icon: Icon, label }) => (
        <ToggleGroupItem
          key={value}
          value={value}
          className="h-11 gap-2 border bg-card px-6
                     !rounded-full first:!rounded-full last:!rounded-full
                     data-[state=on]:bg-foreground data-[state=on]:text-background"
        >
          <Badge variant="secondary" className="rounded-full px-2 py-1">
            <Icon className="h-4 w-4" />
          </Badge>
          <span className="text-sm font-medium">{label}</span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

/* ------------------------- Page component ------------------------- */

export default function StudentDashboard() {
  return (
    <main className="min-h-screen">
      <Sidebar />

      <section className="md:pl-[84px]">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <header className="mb-8">
            <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight">
              Invest in your <br /> education
            </h1>
          </header>

          <CategoryPills />

          <h2 className="mt-8 mb-3 text-sm font-medium text-muted-foreground">Most popular</h2>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            <VideoCourseCard
              tint="rose"
              title="AI for Everyone: Practical ChatGPT Workflows"
              instructors="Aisha Khan, Rahul Dev"
              rating={4.8}
              reviews={51623}
              priceNow={569}
              priceWas={3089}
              badge="Popular"
              src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
              poster="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop"
            />
            <VideoCourseCard
              tint="amber"
              title="Concise Business Writing with AI"
              instructors="Sanjay Mehta"
              rating={4.9}
              reviews={1463}
              priceNow={649}
              priceWas={2599}
              badge="Editors’ pick"
              src="https://www.w3schools.com/html/mov_bbb.mp4"
              poster="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop"
            />
            <VideoCourseCard
              tint="violet"
              title="Media Training: Present on Camera"
              instructors="Priya Sharma, Team Leap"
              rating={4.9}
              reviews={6726}
              priceNow={799}
              priceWas={3499}
              src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
              poster="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop"
            />
            <VideoCourseCard
              tint="teal"
              title="Interior Basics: Design Any Room in 10 Steps"
              instructors="Arun Rao"
              rating={5.0}
              reviews={8735}
              priceNow={999}
              priceWas={3999}
              badge="Top rated"
              src="https://www.w3schools.com/html/movie.mp4"
              poster="https://images.unsplash.com/photo-1493666438817-866a91353ca9?q=80&w=1200&auto=format&fit=crop"
            />
          </div>

          <Separator className="my-10" />
          <p className="text-sm text-muted-foreground">Featured course</p>
        </div>
      </section>
    </main>
  )
}
