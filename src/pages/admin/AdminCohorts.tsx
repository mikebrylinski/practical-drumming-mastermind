import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AppCard, AdminShell } from '../../components/app/AdminShell'
import { useAuth } from '../../lib/auth/AuthProvider'
import { ConfirmDialog, useConfirm } from '../../components/ui/ConfirmDialog'
import { DateTimePicker } from '../../components/ui/DateTimePicker'
import { formatDateTime } from '../../lib/datetime'
import { supabase } from '../../lib/supabase/client'
import { cohortRoomName, slugify } from '../../lib/slug'
import { buildDemoCohorts } from '../../lib/demo/cohorts'
import type { Cohort, Session } from '../../lib/supabase/types'

const inputClass =
  'rounded-lg border border-white/12 bg-charcoal/40 px-3 py-2 font-garamond text-sm text-mist outline-none focus:border-gold/45'

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

export function AdminCohorts() {
  const { useSeedData } = useAuth()
  const [cohorts, setCohorts] = useState<Cohort[]>(() =>
    useSeedData ? buildDemoCohorts() : [],
  )
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(!useSeedData)
  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  })

  const [cohortName, setCohortName] = useState('')
  const [description, setDescription] = useState('')
  const [cohortStartsAt, setCohortStartsAt] = useState('')
  const [cohortRoom, setCohortRoom] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  const [sessionTitle, setSessionTitle] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [sessionCohortId, setSessionCohortId] = useState('')
  const [roomName, setRoomName] = useState('')

  const [busy, setBusy] = useState(false)
  const { confirm, dialogProps } = useConfirm()

  const load = useCallback(() => {
    if (useSeedData || !supabase) {
      setLoading(false)
      return
    }
    setLoading(true)
    Promise.all([
      supabase.from('cohorts').select('*').order('starts_at', { ascending: true }),
      supabase.from('sessions').select('*').order('scheduled_at', { ascending: true }),
    ]).then(([cohortRes, sessRes]) => {
      setCohorts((cohortRes.data as Cohort[]) ?? [])
      setSessions((sessRes.data as Session[]) ?? [])
      setLoading(false)
    })
  }, [useSeedData])

  useEffect(() => {
    load()
  }, [load])

  const sessionsByDay = useMemo(() => {
    const map = new Map<string, Session[]>()
    for (const s of sessions) {
      if (!s.scheduled_at) continue
      const key = dayKey(new Date(s.scheduled_at))
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(s)
    }
    return map
  }, [sessions])

  const calendarCells = useMemo(() => {
    const year = viewMonth.getFullYear()
    const month = viewMonth.getMonth()
    const startWeekday = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const cells: (Date | null)[] = []
    for (let i = 0; i < startWeekday; i += 1) cells.push(null)
    for (let d = 1; d <= daysInMonth; d += 1) cells.push(new Date(year, month, d))
    return cells
  }, [viewMonth])

  const selectedKey = selectedDate ? dayKey(selectedDate) : null
  const daySessions = selectedKey ? (sessionsByDay.get(selectedKey) ?? []) : []

  async function addCohort(e: FormEvent) {
    e.preventDefault()
    if (!cohortName.trim()) return
    setBusy(true)
    const livekit_room_name =
      (cohortRoom.trim() ? slugify(cohortRoom) : `cohort-${slugify(cohortName)}`) || null
    const row = {
      name: cohortName.trim(),
      description: description.trim() || null,
      starts_at: cohortStartsAt ? new Date(cohortStartsAt).toISOString() : null,
      livekit_room_name,
      image_url: imageUrl.trim() || null,
    }
    try {
      if (supabase && !useSeedData) {
        await supabase.from('cohorts').insert(row)
        load()
      } else {
        setCohorts((prev) => [
          ...prev,
          { id: `local-${Date.now()}`, created_at: new Date().toISOString(), ...row },
        ])
      }
      setCohortName('')
      setDescription('')
      setCohortStartsAt('')
      setCohortRoom('')
      setImageUrl('')
    } finally {
      setBusy(false)
    }
  }

  async function removeCohort(id: string, name: string) {
    const ok = await confirm({
      title: 'Delete cohort?',
      message: `"${name}" and its room link will be removed. This cannot be undone.`,
      confirmLabel: 'Delete',
      danger: true,
    })
    if (!ok) return
    if (supabase && !useSeedData) {
      await supabase.from('cohorts').delete().eq('id', id)
      load()
    } else {
      setCohorts((prev) => prev.filter((c) => c.id !== id))
    }
  }

  async function addSession(e: FormEvent) {
    e.preventDefault()
    if (!sessionTitle.trim() || !scheduledAt) return
    setBusy(true)
    const livekit_room_name =
      roomName.trim() || `session-${slugify(sessionTitle)}-${Date.now().toString(36).slice(-4)}`
    const row = {
      title: sessionTitle.trim(),
      scheduled_at: new Date(scheduledAt).toISOString(),
      cohort_id: sessionCohortId || null,
      livekit_room_name,
    }
    try {
      if (supabase && !useSeedData) {
        await supabase.from('sessions').insert(row)
        load()
      } else {
        setSessions((prev) => [
          ...prev,
          { id: `local-${Date.now()}`, created_at: new Date().toISOString(), ...row },
        ])
      }
      setSessionTitle('')
      setScheduledAt('')
      setRoomName('')
    } finally {
      setBusy(false)
    }
  }

  async function removeSession(id: string, sessionTitle: string) {
    const ok = await confirm({
      title: 'Delete session?',
      message: `"${sessionTitle}" will be removed from the calendar.`,
      confirmLabel: 'Delete',
      danger: true,
    })
    if (!ok) return
    if (supabase && !useSeedData) {
      await supabase.from('sessions').delete().eq('id', id)
      load()
    } else {
      setSessions((prev) => prev.filter((s) => s.id !== id))
    }
  }

  return (
    <AdminShell
      eyebrow="Admin"
      title="Cohorts & sessions"
      subtitle="Manage live cohort rooms and schedule sessions on the calendar."
      wide
    >
      <section className="mb-10">
        <h2 className="font-garamond text-xs tracking-[0.22em] text-gold uppercase">Cohorts</h2>
        <div className="mt-4 grid gap-6 lg:grid-cols-[24rem_minmax(0,1fr)]">
          <AppCard className="h-fit">
            <h3 className="font-garamond text-lg text-mist">New cohort</h3>
            <form onSubmit={addCohort} className="mt-4 space-y-3">
              <label className="block font-garamond text-xs text-mist/55">
                Name
                <input
                  className={`${inputClass} mt-1 w-full`}
                  value={cohortName}
                  onChange={(e) => setCohortName(e.target.value)}
                  required
                />
              </label>
              <label className="block font-garamond text-xs text-mist/55">
                Description
                <textarea
                  rows={2}
                  className={`${inputClass} mt-1 w-full resize-y`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </label>
              <label className="block font-garamond text-xs text-mist/55">
                Start date
                <DateTimePicker
                  value={cohortStartsAt}
                  onChange={setCohortStartsAt}
                  className="mt-1 w-full"
                  placeholder="Select start date"
                />
              </label>
              <label className="block font-garamond text-xs text-mist/55">
                Live room name
                <input
                  className={`${inputClass} mt-1 w-full`}
                  placeholder={cohortName ? `cohort-${slugify(cohortName)}` : 'auto from name'}
                  value={cohortRoom}
                  onChange={(e) => setCohortRoom(e.target.value)}
                />
              </label>
              <label className="block font-garamond text-xs text-mist/55">
                Preview image URL
                <input
                  className={`${inputClass} mt-1 w-full`}
                  placeholder="/logo-dd-footer.png"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </label>
              <button
                type="submit"
                disabled={busy}
                className="flex min-h-10 w-full items-center justify-center rounded-full bg-gold px-5 font-garamond text-sm tracking-[0.16em] text-void uppercase transition hover:bg-gold/90 disabled:opacity-50"
              >
                {busy ? 'Creating…' : 'Create cohort'}
              </button>
            </form>
          </AppCard>

          <div>
            {loading ? (
              <p className="font-garamond text-mist/40">Loading…</p>
            ) : cohorts.length === 0 ? (
              <p className="font-garamond text-mist/50">No cohorts yet. Create one on the left.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {cohorts.map((c) => (
                  <AppCard key={c.id} className="flex flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-garamond text-lg font-medium text-mist">{c.name}</h3>
                      <button
                        type="button"
                        onClick={() => void removeCohort(c.id, c.name)}
                        className="shrink-0 font-garamond text-xs text-mist/40 transition hover:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                    {c.description ? (
                      <p className="mt-1.5 line-clamp-2 font-garamond text-sm text-mist/55">
                        {c.description}
                      </p>
                    ) : null}
                    <p className="mt-3 font-garamond text-xs tracking-[0.14em] text-gold/70 uppercase">
                      Room: {cohortRoomName(c)}
                    </p>
                    {c.starts_at ? (
                      <p className="mt-1 font-garamond text-xs text-mist/40">
                        Starts {new Date(c.starts_at).toLocaleDateString()}
                      </p>
                    ) : null}
                    <Link
                      to={`/room/${cohortRoomName(c)}`}
                      className="mt-4 flex min-h-9 items-center justify-center rounded-full border border-gold/40 px-4 font-garamond text-xs tracking-[0.14em] text-gold uppercase transition hover:bg-gold/10"
                    >
                      Open live room
                    </Link>
                  </AppCard>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-garamond text-xs tracking-[0.22em] text-gold uppercase">
          Session calendar
        </h2>
        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <AppCard>
            <div className="mb-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() =>
                  setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))
                }
                className="rounded-lg px-2 py-1 text-mist/60 hover:text-gold"
              >
                ←
              </button>
              <span className="font-garamond text-mist">
                {MONTH_NAMES[viewMonth.getMonth()]} {viewMonth.getFullYear()}
              </span>
              <button
                type="button"
                onClick={() =>
                  setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))
                }
                className="rounded-lg px-2 py-1 text-mist/60 hover:text-gold"
              >
                →
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center font-garamond text-xs text-mist/45">
              {WEEKDAYS.map((d, i) => (
                <span key={i}>{d}</span>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-7 gap-1">
              {calendarCells.map((cell, i) => {
                if (!cell) return <div key={`e-${i}`} />
                const key = dayKey(cell)
                const count = sessionsByDay.get(key)?.length ?? 0
                const selected = selectedKey === key
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedDate(cell)}
                    className={`aspect-square rounded-lg font-garamond text-sm transition ${
                      selected
                        ? 'bg-gold/20 text-gold ring-1 ring-gold/40'
                        : count
                          ? 'bg-white/8 text-mist hover:bg-white/12'
                          : 'text-mist/50 hover:bg-white/5'
                    }`}
                  >
                    {cell.getDate()}
                    {count > 0 ? (
                      <span className="mx-auto mt-0.5 block size-1 rounded-full bg-gold" />
                    ) : null}
                  </button>
                )
              })}
            </div>

            {selectedDate ? (
              <div className="mt-6 border-t border-white/10 pt-4">
                <h3 className="font-garamond text-sm tracking-[0.14em] text-mist/55 uppercase">
                  Sessions on {selectedDate.toLocaleDateString()}
                </h3>
                {daySessions.length === 0 ? (
                  <p className="mt-2 font-garamond text-sm text-mist/40">No sessions scheduled.</p>
                ) : (
                  <ul className="mt-3 space-y-2">
                    {daySessions.map((s) => {
                      const cohort = cohorts.find((c) => c.id === s.cohort_id)
                      return (
                        <li
                          key={s.id}
                          className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-charcoal/30 px-3 py-2"
                        >
                          <div>
                            <p className="font-garamond text-sm text-mist">{s.title}</p>
                            <p className="font-garamond text-xs text-mist/40">
                              {s.scheduled_at ? formatDateTime(s.scheduled_at) : '—'}
                              {cohort ? ` · ${cohort.name}` : ''}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {s.livekit_room_name ? (
                              <Link
                                to={`/room/${s.livekit_room_name}`}
                                className="text-xs text-gold underline"
                              >
                                Room
                              </Link>
                            ) : null}
                            <button
                              type="button"
                              onClick={() => void removeSession(s.id, s.title)}
                              className="text-xs text-mist/45 hover:text-red-300"
                            >
                              Delete
                            </button>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            ) : null}
          </AppCard>

          <AppCard className="h-fit">
            <h3 className="font-garamond text-lg text-mist">New session</h3>
            <form onSubmit={addSession} className="mt-4 space-y-3">
              <label className="block font-garamond text-xs text-mist/55">
                Title
                <input
                  required
                  className={`${inputClass} mt-1 block w-full`}
                  value={sessionTitle}
                  onChange={(e) => setSessionTitle(e.target.value)}
                />
              </label>
              <label className="block font-garamond text-xs text-mist/55">
                Scheduled time
                <DateTimePicker
                  value={scheduledAt}
                  onChange={setScheduledAt}
                  className="mt-1 w-full"
                />
              </label>
              <label className="block font-garamond text-xs text-mist/55">
                Cohort
                <select
                  className={`${inputClass} mt-1 block w-full`}
                  value={sessionCohortId}
                  onChange={(e) => setSessionCohortId(e.target.value)}
                >
                  <option value="">None</option>
                  {cohorts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block font-garamond text-xs text-mist/55">
                Room name (optional)
                <input
                  className={`${inputClass} mt-1 block w-full`}
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Auto-generated if blank"
                />
              </label>
              <button
                type="submit"
                disabled={busy || loading}
                className="w-full rounded-full bg-gold py-2.5 font-garamond text-sm tracking-[0.14em] text-void uppercase hover:bg-gold/90 disabled:opacity-50"
              >
                {busy ? 'Saving…' : 'Add session'}
              </button>
            </form>
          </AppCard>
        </div>
      </section>

      <ConfirmDialog {...dialogProps} />
    </AdminShell>
  )
}
