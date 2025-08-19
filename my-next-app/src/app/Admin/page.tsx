"use client"

import { useMemo, useState } from "react"
import { Sidebar } from "@/components/Sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Separator } from "@/components/ui/separator"
import { TrendingUp, TrendingDown, Users, LineChart as LineChartIcon, Wallet, Rocket } from "lucide-react"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"

/* ---------- helpers ---------- */
const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
})

type RangeKey = "3m" | "30d" | "7d"
const rangeDays: Record<RangeKey, number> = { "3m": 90, "30d": 30, "7d": 7 }

const monthFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" })

function makeData(days = 120) {
  // fake but smooth-ish traffic
  const out: { date: string; mobile: number; desktop: number }[] = []
  const today = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const base = 250 + Math.sin(i / 4) * 80 + Math.random() * 40
    const mobile = Math.round(base + Math.random() * 60)
    const desktop = Math.round(base * 0.75 + Math.random() * 40)
    out.push({ date: monthFmt.format(d), mobile, desktop })
  }
  return out
}

const fullSeries = makeData(120)

/* ---------- small UI bits ---------- */
function KpiCard({
  title,
  value,
  deltaPct,
  trend,
  icon: Icon,
  note,
}: {
  title: string
  value: string
  deltaPct: number
  trend: "up" | "down"
  icon: any
  note: string
}) {
  const positive = trend === "up"
  return (
    <Card className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{title}</p>
          <span className="rounded-lg bg-foreground/5 p-2">
            <Icon className="h-4 w-4" />
          </span>
        </div>

        <div className="mt-3 flex items-end gap-2">
          <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
          <Badge
            variant="secondary"
            className={`rounded-full px-2 py-0.5 text-xs ${
              positive ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300"
                       : "bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300"
            }`}
          >
            {positive ? <TrendingUp className="mr-1 inline h-3 w-3" /> : <TrendingDown className="mr-1 inline h-3 w-3" />}
            {Math.abs(deltaPct)}%
          </Badge>
        </div>

        <p className="mt-2 text-xs text-muted-foreground">{note}</p>
      </CardContent>
    </Card>
  )
}

function TimeRangeToggle({
  value,
  onChange,
}: {
  value: RangeKey
  onChange: (v: RangeKey) => void
}) {
  return (
    <ToggleGroup type="single" value={value} onValueChange={(v) => v && onChange(v as RangeKey)} className="gap-2">
      {[
        { v: "3m", label: "Last 3 months" },
        { v: "30d", label: "Last 30 days" },
        { v: "7d", label: "Last 7 days" },
      ].map((opt) => (
        <ToggleGroupItem
          key={opt.v}
          value={opt.v}
          className="h-9 rounded-full border bg-card px-3 text-xs data-[state=on]:bg-foreground data-[state=on]:text-background first:rounded-full last:rounded-full"
        >
          {opt.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

/* ---------- main page ---------- */
export default function AdminDashboard() {
  const [range, setRange] = useState<RangeKey>("3m")
  const data = useMemo(() => fullSeries.slice(-rangeDays[range]), [range])

  // some summary numbers (mock)
  const revenue = inr.format(125000)
  const newCustomers = 1234
  const activeAccounts = 45678
  const growthRate = 4.5

  return (
    <main className="min-h-screen">
      <Sidebar />

      <section className="md:pl-[84px]">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <header className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Overview for the selected period</p>
            </div>
          </header>

          {/* KPI grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              title="Total Revenue"
              value={revenue}
              deltaPct={12.5}
              trend="up"
              icon={Wallet}
              note="Trending up this month • Visitors for the last 6 months"
            />
            <KpiCard
              title="New Customers"
              value={newCustomers.toLocaleString()}
              deltaPct={20}
              trend="down"
              icon={Users}
              note="Down 20% this period • Acquisition needs attention"
            />
            <KpiCard
              title="Active Accounts"
              value={activeAccounts.toLocaleString()}
              deltaPct={12.5}
              trend="up"
              icon={LineChartIcon}
              note="Strong user retention • Engagement exceeded targets"
            />
            <KpiCard
              title="Growth Rate"
              value={`${growthRate}%`}
              deltaPct={4.5}
              trend="up"
              icon={Rocket}
              note="Steady performance increase • Meets growth projections"
            />
          </div>

          <Separator className="my-8" />

          {/* Traffic / Visitors */}
          <Card className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur">
            <CardContent className="p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">Total Visitors</h2>
                  <p className="text-xs text-muted-foreground">Total for the selected range</p>
                </div>
                <TimeRangeToggle value={range} onChange={setRange} />
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="mobileFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="currentColor" stopOpacity={0.45} />
                        <stop offset="100%" stopColor="currentColor" stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="desktopFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="currentColor" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="currentColor" stopOpacity={0.04} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid stroke="hsl(var(--border))" strokeOpacity={0.4} vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      minTickGap={30}
                      tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "10px",
                        color: "hsl(var(--foreground))",
                      }}
                      labelClassName="text-xs"
                      formatter={(v: number, k: string) => [v.toLocaleString(), k === "mobile" ? "Mobile" : "Desktop"]}
                    />

                    {/* Mobile series */}
                    <Area
                      type="monotone"
                      dataKey="mobile"
                      stroke="currentColor"
                      fill="url(#mobileFill)"
                      strokeWidth={2}
                      className="text-rose-500"
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                    {/* Desktop series */}
                    <Area
                      type="monotone"
                      dataKey="desktop"
                      stroke="currentColor"
                      fill="url(#desktopFill)"
                      strokeWidth={2}
                      className="text-orange-500"
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* simple legend */}
              <div className="mt-4 flex items-center gap-4 text-sm">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  Mobile
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-orange-500" />
                  Desktop
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
