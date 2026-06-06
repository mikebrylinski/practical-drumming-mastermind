import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AppCard, AdminShell } from '../../components/app/AdminShell'
import { useAuth } from '../../lib/auth/AuthProvider'
import { ConfirmDialog, useConfirm } from '../../components/ui/ConfirmDialog'
import { DateTimePicker } from '../../components/ui/DateTimePicker'
import { supabase } from '../../lib/supabase/client'
import { cohortRoomName, slugify } from '../../lib/slug'
import { buildDemoCohorts } from '../../lib/demo/cohorts'
import type { Cohort } from '../../lib/supabase/types'

const inputClass =
  'rounded-lg border border-white/12 bg-charcoal/50 px-3 py-2 font-garamond text-sm text-mist outline-none focus:border-gold/45'

export function AdminCohorts() {
  const { useSeedData } = useAuth()
  const [cohorts, setCohorts] = useState<Cohort[]>(() =>
    useSeedData ? buildDemoCohorts() : [],
  )
  const [loading, setLoading] = useState(!useSeedData)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [startsAt, setStartsAt] = useState('')
  const [room, setRoom] = useState('')
  const [busy, setBusy] = useState(false)
  const { confirm, dialogProps } = useConfirm()

  const load = useCallback(() => {
    if (useSeedData || !supabase) {
      setLoading(false)
      return
    }
    setLoading(true)
    supabase
      .from('cohorts')
      .select('*')
      .order('starts_at', { ascending: true })
      .then(({ data }) => {
        setCohorts((data as Cohort[]) ?? [])
        setLoading(false)
      })
  }, [useSeedData])

  useEffect(() => {
    load()
  }, [load])

  async function addCohort(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setBusy(true)
    const livekit_room_name = (room.trim() ? slugify(room) : `cohort-${slugify(name)}`) || null
    const row = {
      name: name.trim(),
      description: description.trim() || null,
      starts_at: startsAt ? new Date(startsAt).toISOString() : null,
      livekit_room_name,
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
      setName('')
      setDescription('')
      setStartsAt('')
      setRoom('')
    } finally {
      setBusy(false)
    }
  }

  async function removeCohort(id: string, cohortName: string) {
    const ok = await confirm({
      title: 'Delete cohort?',
      message: `"${cohortName}" and its room link will be removed. This cannot be undone.`,
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

  return (
    <AdminShell eyebrow="Admin" title="Cohorts" subtitle="Live mentorship groups & rooms." wide>
      <div className="grid gap-6 lg:grid-cols-[24rem_minmax(0,1fr)]">
        <AppCard className="h-fit">
          <h3 className="font-garamond text-lg text-mist">New cohort</h3>
          <form onSubmit={addCohort} className="mt-4 space-y-3">
            <label className="block font-garamond text-xs text-mist/55">
              Name
              <input
                className={`${inputClass} mt-1 w-full`}
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                value={startsAt}
                onChange={setStartsAt}
                className="mt-1 w-full"
                placeholder="Select start date"
              />
            </label>
            <label className="block font-garamond text-xs text-mist/55">
              Live room name
              <input
                className={`${inputClass} mt-1 w-full`}
                placeholder={name ? `cohort-${slugify(name)}` : 'auto from name'}
                value={room}
                onChange={(e) => setRoom(e.target.value)}
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
            <div className="grid gap-4 sm:grid-cols-2">
              {cohorts.map((c) => (
                <AppCard key={c.id} className="flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-garamond text-lg font-medium text-mist">{c.name}</h3>
                    <button
                      type="button"
                      onClick={() => removeCohort(c.id, c.name)}
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
      <ConfirmDialog {...dialogProps} />
    </AdminShell>
  )
}
