import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AppCard, AdminShell } from '../../components/app/AdminShell'
import { useAuth } from '../../lib/auth/AuthProvider'
import { ConfirmDialog, useConfirm } from '../../components/ui/ConfirmDialog'
import { DateTimePicker } from '../../components/ui/DateTimePicker'
import { formatDateTime } from '../../lib/datetime'
import { supabase } from '../../lib/supabase/client'
import type { Booking } from '../../lib/supabase/types'

const inputClass =
  'rounded-lg border border-white/12 bg-charcoal/40 px-3 py-2 font-garamond text-sm text-mist outline-none focus:border-gold/45'

function genRoomName(): string {
  return `call-${Math.random().toString(16).slice(2, 10)}`
}

const MOCK: Booking[] = [
  {
    id: 'b1',
    slot_id: null,
    user_id: null,
    name: 'Jordan Vega',
    email: 'jordan@example.com',
    livekit_room_name: 'call-ab12cd34',
    status: 'confirmed',
    starts_at: new Date(Date.now() + 2 * 864e5).toISOString(),
    created_at: new Date().toISOString(),
  },
]

const statusColor: Record<Booking['status'], string> = {
  confirmed: 'bg-emerald-500/15 text-emerald-300',
  cancelled: 'bg-red-500/15 text-red-300',
  completed: 'bg-white/8 text-mist/50',
}

export function AdminBookings() {
  const { useSeedData } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>(useSeedData ? MOCK : [])
  const [loading, setLoading] = useState(!useSeedData)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [startsAt, setStartsAt] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { confirm, dialogProps } = useConfirm()

  const load = useCallback(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    setLoading(true)
    supabase
      .from('bookings')
      .select('*')
      .order('starts_at', { ascending: true })
      .then(({ data }) => {
        setBookings((data as Booking[]) ?? [])
        setLoading(false)
      })
  }, [useSeedData])

  useEffect(() => {
    load()
  }, [load])

  async function createBooking(e: FormEvent) {
    e.preventDefault()
    if (!email || !startsAt) return
    setCreating(true)
    setError(null)
    try {
      const room = genRoomName()
      const row = {
        name: name.trim() || null,
        email: email.trim(),
        starts_at: new Date(startsAt).toISOString(),
        status: 'confirmed' as const,
        livekit_room_name: room,
      }
      if (supabase && !useSeedData) {
        const { error: insErr } = await supabase.from('bookings').insert(row)
        if (insErr) throw new Error(insErr.message)
        load()
      } else {
        setBookings((prev) =>
          [
            {
              id: `local-${Date.now()}`,
              slot_id: null,
              user_id: null,
              created_at: new Date().toISOString(),
              ...row,
            },
            ...prev,
          ].sort((a, b) => (a.starts_at ?? '').localeCompare(b.starts_at ?? '')),
        )
      }
      setName('')
      setEmail('')
      setStartsAt('')
      setShowForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create booking')
    } finally {
      setCreating(false)
    }
  }

  async function cancel(id: string) {
    const ok = await confirm({
      title: 'Cancel this booking?',
      message: 'The guest will lose access to the call. This cannot be undone.',
      confirmLabel: 'Cancel booking',
      cancelLabel: 'Keep it',
      danger: true,
    })
    if (!ok) return
    setBusyId(id)
    try {
      await fetch('/api/bookings/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: id }),
      })
      if (supabase && !useSeedData) load()
      else
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b)),
        )
    } finally {
      setBusyId(null)
    }
  }

  return (
    <AdminShell
      eyebrow="Admin"
      title="Bookings"
      wide
      actions={
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="flex min-h-10 items-center gap-2 rounded-full bg-gold px-5 font-garamond text-sm tracking-[0.14em] text-void uppercase transition hover:bg-gold/90"
        >
          {showForm ? 'Close' : '+ New booking'}
        </button>
      }
    >
      {showForm ? (
        <AppCard className="mb-6">
          <h3 className="font-garamond text-lg text-mist">Add a booking</h3>
          <form onSubmit={createBooking} className="mt-4 flex flex-wrap items-end gap-3">
            <label className="font-garamond text-xs text-mist/55">
              Name
              <input
                className={`${inputClass} mt-1 block w-48`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Guest name"
              />
            </label>
            <label className="font-garamond text-xs text-mist/55">
              Email
              <input
                type="email"
                required
                className={`${inputClass} mt-1 block w-56`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="guest@example.com"
              />
            </label>
            <label className="font-garamond text-xs text-mist/55">
              Date &amp; time
              <DateTimePicker
                value={startsAt}
                onChange={setStartsAt}
                className="mt-1 w-60"
              />
            </label>
            <button
              type="submit"
              disabled={creating}
              className="flex min-h-10 items-center justify-center rounded-full bg-gold px-6 font-garamond text-sm tracking-[0.14em] text-void uppercase transition hover:bg-gold/90 disabled:opacity-50"
            >
              {creating ? 'Creating…' : 'Create booking'}
            </button>
            {error ? (
              <p className="w-full font-garamond text-sm text-red-400/90">{error}</p>
            ) : null}
          </form>
          <p className="mt-3 font-garamond text-xs text-mist/40">
            A video room is generated automatically for each booking.
          </p>
        </AppCard>
      ) : null}

      {loading ? (
        <p className="font-garamond text-mist/40">Loading…</p>
      ) : bookings.length === 0 ? (
        <p className="font-garamond text-mist/50">No bookings yet.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-left font-garamond text-sm">
            <thead className="bg-charcoal/40 text-mist/45 uppercase tracking-[0.14em]">
              <tr>
                <th className="px-5 py-3">When</th>
                <th className="px-5 py-3">Guest</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Room</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-t border-white/[0.06]">
                  <td className="px-5 py-3 text-mist">
                    {b.starts_at ? formatDateTime(b.starts_at) : '—'}
                  </td>
                  <td className="px-5 py-3 text-mist/65">
                    {b.name || '—'}
                    <span className="block text-xs text-mist/35">{b.email}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-3 py-0.5 text-xs uppercase tracking-[0.14em] ${statusColor[b.status]}`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {b.livekit_room_name ? (
                      <Link
                        to={`/room/${b.livekit_room_name}`}
                        className="text-gold underline decoration-gold/30 underline-offset-2"
                      >
                        Open
                      </Link>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-5 py-3 text-right">
                    {b.status === 'confirmed' ? (
                      <button
                        type="button"
                        onClick={() => cancel(b.id)}
                        disabled={busyId === b.id}
                        className="font-garamond text-sm text-mist/50 transition hover:text-red-300 disabled:opacity-50"
                      >
                        {busyId === b.id ? '…' : 'Cancel'}
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmDialog {...dialogProps} />
    </AdminShell>
  )
}
