"use client"

import { useMemo, useState } from "react"
import { v4 as uuid } from "uuid"
import { Sidebar } from "@/components/Sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import {
  Plus,
  Save,
  Upload,
  Trash2,
  ChevronUp,
  ChevronDown,
  Video,
  Link2,
  Layers,
  Library,
} from "lucide-react"

/* ----------------------------- types ----------------------------- */
type Resource = { id: string; label: string; url: string }
type Lecture = {
  id: string
  title: string
  duration?: string
  preview: boolean
  videoUrl?: string
  resources: Resource[]
  notes?: string
}
type Section = { id: string; title: string; lectures: Lecture[] }

type CourseForm = {
  title: string
  slug: string
  smallDescription: string
  description: string
  price: string
  level: "beginner" | "intermediate" | "advanced"
  category: string
  thumbnail?: File | null
  published: boolean
  sections: Section[]
}

/* --------------------------- utilities --------------------------- */
const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")

/* ----------------------------- page ------------------------------ */
export default function EditCourseLecturesPage() {
  const [tab, setTab] = useState<"basic" | "structure">("basic")
  const [form, setForm] = useState<CourseForm>({
    title: "Subscribe today!!",
    slug: "subscribe-today",
    smallDescription: "Quick overview about the course.",
    description: "",
    price: "1499",
    level: "beginner",
    category: "ai",
    thumbnail: null,
    published: false,
    sections: [
      {
        id: uuid(),
        title: "Getting Started",
        lectures: [
          { id: uuid(), title: "Welcome & Orientation", preview: true, duration: "3:12", resources: [] },
          { id: uuid(), title: "Installing the Tools", preview: false, duration: "7:40", resources: [] },
        ],
      },
    ],
  })

  const totalLectures = useMemo(
    () => form.sections.reduce((sum, s) => sum + s.lectures.length, 0),
    [form.sections]
  )

  /* ----------------------- handlers: basic info ----------------------- */
  const handleTitle = (v: string) => setForm((f) => ({ ...f, title: v }))
  const generateSlug = () => setForm((f) => ({ ...f, slug: slugify(f.title) }))

  /* --------------------- handlers: structure edit --------------------- */
  const addSection = () =>
    setForm((f) => ({
      ...f,
      sections: [...f.sections, { id: uuid(), title: `New Section ${f.sections.length + 1}`, lectures: [] }],
    }))

  const removeSection = (sid: string) =>
    setForm((f) => ({ ...f, sections: f.sections.filter((s) => s.id !== sid) }))

  const updateSectionTitle = (sid: string, title: string) =>
    setForm((f) => ({
      ...f,
      sections: f.sections.map((s) => (s.id === sid ? { ...s, title } : s)),
    }))

  const addLecture = (sid: string) =>
    setForm((f) => ({
      ...f,
      sections: f.sections.map((s) =>
        s.id === sid
          ? {
              ...s,
              lectures: [
                ...s.lectures,
                { id: uuid(), title: `New lecture ${s.lectures.length + 1}`, preview: false, resources: [] },
              ],
            }
          : s
      ),
    }))

  const removeLecture = (sid: string, lid: string) =>
    setForm((f) => ({
      ...f,
      sections: f.sections.map((s) =>
        s.id === sid ? { ...s, lectures: s.lectures.filter((l) => l.id !== lid) } : s
      ),
    }))

  const updateLecture = (sid: string, lid: string, patch: Partial<Lecture>) =>
    setForm((f) => ({
      ...f,
      sections: f.sections.map((s) =>
        s.id === sid
          ? { ...s, lectures: s.lectures.map((l) => (l.id === lid ? { ...l, ...patch } : l)) }
          : s
      ),
    }))

  const moveLecture = (sid: string, lid: string, dir: "up" | "down") =>
    setForm((f) => {
      const sections = f.sections.map((s) => {
        if (s.id !== sid) return s
        const idx = s.lectures.findIndex((l) => l.id === lid)
        if (idx < 0) return s
        const next = [...s.lectures]
        const swapWith = dir === "up" ? idx - 1 : idx + 1
        if (swapWith < 0 || swapWith >= next.length) return s
        ;[next[idx], next[swapWith]] = [next[swapWith], next[idx]]
        return { ...s, lectures: next }
      })
      return { ...f, sections }
    })

  /* ----------------------------- actions ----------------------------- */
  const saveDraft = () => {
    console.log("SAVING DRAFT", form)
    alert("Draft saved (console) ✔")
  }
  const publishCourse = () => {
    console.log("PUBLISH", form)
    alert("Publish (console) 🚀")
  }

  return (
    <main className="min-h-screen">
      <Sidebar />
      <section className="md:pl-[84px]">
        <div className="mx-auto max-w-6xl px-6 py-6">
          {/* Top bar */}
          <div className="sticky top-0 z-10 -mx-6 mb-6 bg-background/70 px-6 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-bold">
                  Edit Course: <span className="underline decoration-primary">{form.title}</span>
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={saveDraft}>
                  <Save className="mr-2 h-4 w-4" /> Save 
                </Button>
                <Button onClick={publishCourse}>
                  <Library className="mr-2 h-4 w-4" /> Publish
                </Button>
              </div>
            </div>
          </div>

          <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-xl">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="structure">Course Structure</TabsTrigger>
            </TabsList>

            {/* -------------------------- BASIC INFO -------------------------- */}
            <TabsContent value="basic" className="mt-6">
              <Card className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur">
                <CardContent className="p-6">
                  <h3 className="mb-1 text-base font-semibold">Basic Info</h3>
                  <p className="mb-5 text-sm text-muted-foreground">
                    Provide basic information about the course
                  </p>

                  <div className="grid gap-5">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        placeholder="Write a compelling course title"
                        value={form.title}
                        onChange={(e) => handleTitle(e.target.value)}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="slug">Slug</Label>
                      <div className="flex gap-2">
                        <Input id="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
                        <Button type="button" onClick={generateSlug} title="Generate from title">
                          Generate Slug
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="small">Small Description</Label>
                      <Textarea
                        id="small"
                        placeholder="One or two lines"
                        value={form.smallDescription}
                        onChange={(e) => setForm({ ...form, smallDescription: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="desc">Description</Label>
                      <Textarea
                        id="desc"
                        placeholder="Explain what students will learn"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        rows={6}
                      />
                    </div>

                    <Separator />

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="grid gap-2">
                        <Label>Price (INR)</Label>
                        <Input
                          inputMode="numeric"
                          value={form.price}
                          onChange={(e) => setForm({ ...form, price: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Level</Label>
                        <Select
                          value={form.level}
                          onValueChange={(v: any) => setForm({ ...form, level: v })}
                        >
                          <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Category</Label>
                        <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                          <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ai">AI</SelectItem>
                            <SelectItem value="dev">Development</SelectItem>
                            <SelectItem value="design">Design</SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="thumb">Thumbnail</Label>
                      <div className="flex items-center gap-2">
                        <Input id="thumb" type="file" accept="image/*" onChange={(e) => setForm({ ...form, thumbnail: e.target.files?.[0] ?? null })} />
                        <Button variant="secondary"><Upload className="mr-2 h-4 w-4" /> Upload</Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Switch
                        checked={form.published}
                        onCheckedChange={(v) => setForm({ ...form, published: v })}
                        id="published"
                      />
                      <Label htmlFor="published">Published</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ----------------------- COURSE STRUCTURE ----------------------- */}
            <TabsContent value="structure" className="mt-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  <h3 className="text-base font-semibold">Course Structure</h3>
                  <span className="text-sm text-muted-foreground">({totalLectures} lectures)</span>
                </div>
                <Button size="sm" onClick={addSection}>
                  <Plus className="mr-2 h-4 w-4" /> Add Section
                </Button>
              </div>

              <Accordion type="multiple" className="space-y-3">
                {form.sections.map((s, sIdx) => (
                  <AccordionItem key={s.id} value={s.id} className="rounded-xl border border-border/60 bg-card/70 backdrop-blur px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex w-full items-center gap-3">
                        <Input
                          value={s.title}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => updateSectionTitle(s.id, e.target.value)}
                          className="h-9"
                        />
                        <Button
                          size="icon"
                          variant="secondary"
                          onClick={(e) => { e.stopPropagation(); addLecture(s.id) }}
                          title="Add lecture"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => { e.stopPropagation(); removeSection(s.id) }}
                          title="Remove section"
                        >
                          <Trash2 className="h-4 w-4 text-rose-500" />
                        </Button>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent>
                      <div className="space-y-3 pb-4">
                        {s.lectures.map((l, lIdx) => (
                          <Card key={l.id} className="rounded-xl border border-border/60 bg-background/60">
                            <CardContent className="p-4">
                              <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2">
                                  <Video className="h-4 w-4 text-muted-foreground" />
                                  <Input
                                    value={l.title}
                                    onChange={(e) => updateLecture(s.id, l.id, { title: e.target.value })}
                                    className="h-9"
                                  />
                                  <div className="ml-auto flex items-center gap-1">
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      onClick={() => moveLecture(s.id, l.id, "up")}
                                      disabled={lIdx === 0}
                                      title="Move up"
                                    >
                                      <ChevronUp className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      onClick={() => moveLecture(s.id, l.id, "down")}
                                      disabled={lIdx === s.lectures.length - 1}
                                      title="Move down"
                                    >
                                      <ChevronDown className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      onClick={() => removeLecture(s.id, l.id)}
                                      title="Delete lecture"
                                    >
                                      <Trash2 className="h-4 w-4 text-rose-500" />
                                    </Button>
                                  </div>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-3">
                                  <div className="grid gap-1.5">
                                    <Label>Duration</Label>
                                    <Input
                                      placeholder="e.g. 7:40"
                                      value={l.duration ?? ""}
                                      onChange={(e) => updateLecture(s.id, l.id, { duration: e.target.value })}
                                    />
                                  </div>
                                  <div className="grid gap-1.5">
                                    <Label>Video URL</Label>
                                    <Input
                                      placeholder="https://…"
                                      value={l.videoUrl ?? ""}
                                      onChange={(e) => updateLecture(s.id, l.id, { videoUrl: e.target.value })}
                                    />
                                  </div>
                                  <div className="flex items-center gap-2 pt-6">
                                    <Switch
                                      checked={l.preview}
                                      onCheckedChange={(v) => updateLecture(s.id, l.id, { preview: v })}
                                      id={`preview-${l.id}`}
                                    />
                                    <Label htmlFor={`preview-${l.id}`}>Free preview</Label>
                                  </div>
                                </div>

                                <div className="grid gap-1.5">
                                  <Label>Resources</Label>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      onClick={() =>
                                        updateLecture(s.id, l.id, {
                                          resources: [
                                            ...l.resources,
                                            { id: uuid(), label: "Resource", url: "" },
                                          ],
                                        })
                                      }
                                    >
                                      <Plus className="mr-2 h-4 w-4" /> Add resource
                                    </Button>
                                  </div>

                                  {l.resources.length > 0 && (
                                    <div className="mt-2 space-y-2">
                                      {l.resources.map((r) => (
                                        <div key={r.id} className="flex items-center gap-2">
                                          <Link2 className="h-4 w-4 text-muted-foreground" />
                                          <Input
                                            placeholder="Label"
                                            value={r.label}
                                            onChange={(e) =>
                                              updateLecture(s.id, l.id, {
                                                resources: l.resources.map((x) =>
                                                  x.id === r.id ? { ...x, label: e.target.value } : x
                                                ),
                                              })
                                            }
                                            className="h-9 w-40"
                                          />
                                          <Input
                                            placeholder="https://…"
                                            value={r.url}
                                            onChange={(e) =>
                                              updateLecture(s.id, l.id, {
                                                resources: l.resources.map((x) =>
                                                  x.id === r.id ? { ...x, url: e.target.value } : x
                                                ),
                                              })
                                            }
                                            className="h-9 flex-1"
                                          />
                                          <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() =>
                                              updateLecture(s.id, l.id, {
                                                resources: l.resources.filter((x) => x.id !== r.id),
                                              })
                                            }
                                            title="Remove"
                                          >
                                            <Trash2 className="h-4 w-4 text-rose-500" />
                                          </Button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                <div className="grid gap-1.5">
                                  <Label>Notes (optional)</Label>
                                  <Textarea
                                    rows={3}
                                    placeholder="Any instructor notes for this lecture"
                                    value={l.notes ?? ""}
                                    onChange={(e) => updateLecture(s.id, l.id, { notes: e.target.value })}
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}

                        {s.lectures.length === 0 && (
                          <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                            No lectures yet. Click <b>Add lecture</b> to start.
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  )
}
