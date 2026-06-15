import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AppCard, AdminShell } from '../../components/app/AdminShell'
import { useAuth } from '../../lib/auth/AuthProvider'
import { adminRequestHeaders } from '../../lib/auth/accessToken'
import { ConfirmDialog, useConfirm } from '../../components/ui/ConfirmDialog'
import { DateTimePicker } from '../../components/ui/DateTimePicker'
import { formatDateTime } from '../../lib/datetime'
import { supabase } from '../../lib/supabase/client'
import type { Booking } from '../../lib/supabase/types'

const inputClass =
  'rounded-lg border border-white/12 bg-charcoal/40 px-3 py-2 font-garamond text-sm text-mist outline-none focus:border-gold/45'

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
    hidden: false,
    created_at: new Date().toISOString(),
  },
]

const PAGE_SIZE = 25

const statusColor: Record<Booking['status'], string> = {
  confirmed: 'bg-emerald-500/15 text-emerald-300',
  cancelled: 'bg-red-500/15 text-red-300',
  completed: 'bg-white/8 text-mist/50',
}

function sortBookingsNewestFirst(items: Booking[]) {
  return [...items].sort((a, b) => b.created_at.localeCompare(a.created_at))
}

export function AdminBookings() {
  const { useSeedData, session, isAdmin, mockMode } = useAuth()
  const demoAdmin = isAdmin && (useSeedData || mockMode)
  const [bookings, setBookings] = useState<Booking[]>(useSeedData ? MOCK : [])
  const [totalCount, setTotalCount] = useState(useSeedData ? MOCK.length : 0)
  const [loading, setLoading] = useState(!useSeedData)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [startsAt, setStartsAt] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [showHidden, setShowHidden] = useState(false)
  const { confirm, dialogProps } = useConfirm()

  const load = useCallback(async () => {
    if (!supabase || useSeedData) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const from = page * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    let query = supabase
      .from('bookings')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (!showHidden) {
      query = query.eq('hidden', false)
    }

    const { data, count, error: loadError } = await query.range(from, to)

    if (loadError) {
      console.error('[AdminBookings load]', loadError)
      setError(loadError.message.includes('hidden')
        ? 'Bookings hide column missing — run supabase/migrations/20250614_platform_updates.sql'
        : loadError.message)
      setBookings([])
      setTotalCount(0)
    } else {
      setBookings(sortBookingsNewestFirst((data as Booking[]) ?? []))
      setTotalCount(count ?? 0)
    }

    setLoading(false)
  }, [page, showHidden, useSeedData])

  const seedVisible = sortBookingsNewestFirst(
    (useSeedData ? bookings : []).filter((b) => showHidden || !b.hidden),
  )
  const seedPageCount = Math.max(1, Math.ceil(seedVisible.length / PAGE_SIZE))
  const pageCount = useSeedData
    ? seedPageCount
    : Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const pageItems = useSeedData
    ? seedVisible.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)
    : bookings
  const displayTotal = useSeedData ? seedVisible.length : totalCount
  const rangeStart = displayTotal === 0 ? 0 : page * PAGE_SIZE + 1
  const rangeEnd = Math.min((page + 1) * PAGE_SIZE, displayTotal)

  useEffect(() => {
    if (useSeedData) return
    void load()
  }, [load, useSeedData])

  useEffect(() => {
    if (page > 0 && page >= pageCount) {
      setPage(Math.max(0, pageCount - 1))
    }
  }, [page, pageCount])

  async function createBooking(e: FormEvent) {
    e.preventDefault()
    if (!email || !startsAt) return
    setCreating(true)
    setError(null)
    setFormSuccess(null)
    try {
      const headers = await adminRequestHeaders(session, demoAdmin)
      const res = await fetch('/api/admin/bookings/create', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          startsAt,
        }),
      })
      const json = await res.json()
      if (!res.ok || !json.ok) throw new Error(json.error || 'Could not create booking')

      if (supabase && !useSeedData) {
        setPage(0)
        await load()
      } else if (json.booking) {
        setBookings((prev) =>
          sortBookingsNewestFirst([
            {
              id: json.booking.id,
              slot_id: json.booking.slot_id ?? null,
              user_id: json.booking.user_id ?? null,
              created_at: json.booking.created_at ?? new Date().toISOString(),
              hidden: json.booking.hidden ?? false,
              name: json.booking.name,
              email: json.booking.email,
              starts_at: json.booking.starts_at,
              status: json.booking.status,
              livekit_room_name: json.booking.livekit_room_name,
            },
            ...prev,
          ]),
        )
      }

      const emailStatus = json.email?.guest
      if (emailStatus === 'sent') {
        setFormSuccess('Booking created — confirmation email sent with the room link.')
      } else if (emailStatus === 'skipped') {
        setFormSuccess('Booking created. Set RESEND_API_KEY in .env to send confirmation emails.')
      } else if (emailStatus === 'error') {
        setFormSuccess('Booking created, but the confirmation email failed to send.')
      } else {
        setFormSuccess('Booking created.')
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
      if (supabase && !useSeedData) await load()
      else
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b)),
        )
    } finally {
      setBusyId(null)
    }
  }

  async function hideBooking(id: string) {
    const ok = await confirm({
      title: 'Hide this booking?',
      message: 'It will be removed from the default list but kept in the database.',
      confirmLabel: 'Hide',
    })
    if (!ok) return
    setBusyId(id)
    setError(null)
    try {
      if (supabase && !useSeedData) {
        const headers = await adminRequestHeaders(session, demoAdmin)
        const res = await fetch('/api/admin/bookings/update', {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ id, hidden: true }),
        })
        const json = await res.json()
        if (!res.ok || !json.ok) {
          throw new Error(json.error || 'Could not hide booking')
        }
        await load()
      } else {
        setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, hidden: true } : b)))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not hide booking')
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
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 font-garamond text-sm text-mist/55">
            <input
              type="checkbox"
              checked={showHidden}
              onChange={(e) => {
                setShowHidden(e.target.checked)
                setPage(0)
              }}
            />
            Show hidden
          </label>
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="flex min-h-10 items-center gap-2 rounded-full bg-gold px-5 font-garamond text-sm tracking-[0.14em] text-void uppercase transition hover:bg-gold/90"
          >
            {showForm ? 'Close' : '+ New booking'}
          </button>
        </div>
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
            {formSuccess ? (
              <p className="w-full font-garamond text-sm text-emerald-300/90">{formSuccess}</p>
            ) : null}
          </form>
          <p className="mt-3 font-garamond text-xs text-mist/40">
            A video room is generated automatically and the guest receives a confirmation email with the join link.
          </p>
        </AppCard>
      ) : null}

      {error && !showForm ? (
        <p className="mb-4 font-garamond text-sm text-red-400/90">{error}</p>
      ) : null}

      {loading ? (
        <p className="font-garamond text-mist/40">Loading…</p>
      ) : displayTotal === 0 ? (
        <p className="font-garamond text-mist/50">No bookings yet.</p>
      ) : (
        <>
        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-left font-garamond text-sm">
            <thead className="bg-charcoal/40 text-mist/45 uppercase tracking-[0.14em]">
              <tr>
                <th className="px-5 py-3">Booked</th>
                <th className="px-5 py-3">When</th>
                <th className="px-5 py-3">Guest</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Room</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((b) => (
                <tr key={b.id} className={`border-t border-white/[0.06] ${b.hidden ? 'opacity-50' : ''}`}>
                  <td className="px-5 py-3 text-mist/45 text-xs">
                    {formatDateTime(b.created_at)}
                  </td>
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
                    <div className="flex flex-wrap items-center justify-end gap-3">
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
                    {!b.hidden ? (
                      <button
                        type="button"
                        onClick={() => hideBooking(b.id)}
                        disabled={busyId === b.id}
                        className="font-garamond text-sm text-mist/50 transition hover:text-gold disabled:opacity-50"
                      >
                        Hide
                      </button>
                    ) : (
                      <span className="font-garamond text-xs uppercase tracking-[0.12em] text-mist/35">
                        Hidden
                      </span>
                    )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 font-garamond text-sm text-mist/55">
          <span>
            Showing {rangeStart}–{rangeEnd} of {displayTotal}
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg px-3 py-1 hover:text-gold disabled:opacity-40"
            >
              Previous
            </button>
            <span>
              Page {page + 1} of {pageCount}
            </span>
            <button
              type="button"
              disabled={page >= pageCount - 1}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg px-3 py-1 hover:text-gold disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
        </>
      )}
      <ConfirmDialog {...dialogProps} />
    </AdminShell>
  )
}
