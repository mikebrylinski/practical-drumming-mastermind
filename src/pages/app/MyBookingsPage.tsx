import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppCard, AppShell } from '../../components/app/AppShell'
import { ConfirmDialog, useConfirm } from '../../components/ui/ConfirmDialog'
import { formatDateTime } from '../../lib/datetime'
import { supabase } from '../../lib/supabase/client'
import { useAuth } from '../../lib/auth/AuthProvider'
import type { Booking } from '../../lib/supabase/types'

const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    slot_id: null,
    user_id: null,
    name: 'Demo Member',
    email: 'demo@practicaldrumming.dev',
    livekit_room_name: 'call-demo-1234',
    status: 'confirmed',
    starts_at: new Date(Date.now() + 3 * 864e5).toISOString(),
    created_at: new Date().toISOString(),
  },
]

const statusColor: Record<Booking['status'], string> = {
  confirmed: 'text-emerald-300',
  cancelled: 'text-red-300',
  completed: 'text-mist/50',
}

export function MyBookingsPage() {
  const { session, useSeedData } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>(useSeedData ? MOCK_BOOKINGS : [])
  const [loading, setLoading] = useState(!useSeedData)
  const [busyId, setBusyId] = useState<string | null>(null)
  const { confirm, dialogProps } = useConfirm()

  const load = useCallback(() => {
    if (useSeedData || !supabase || !session?.user) return
    setLoading(true)
    supabase
      .from('bookings')
      .select('*')
      .eq('user_id', session.user.id)
      .order('starts_at', { ascending: true })
      .then(({ data }) => {
        if (data) setBookings(data as Booking[])
        setLoading(false)
      })
  }, [session, useSeedData])

  useEffect(() => {
    load()
  }, [load])

  async function cancel(id: string) {
    const ok = await confirm({
      title: 'Cancel this call?',
      message: 'You can always book another time afterwards.',
      confirmLabel: 'Cancel call',
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
      if (useSeedData) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b)),
        )
      } else {
        load()
      }
    } finally {
      setBusyId(null)
    }
  }

  return (
    <AppShell
      eyebrow="Bookings"
      title="My bookings"
      subtitle="Your scheduled calls and live rooms."
      actions={
        <Link
          to="/book/discovery-call"
          className="rounded-full bg-gold px-5 py-2 font-garamond text-sm tracking-[0.14em] text-void uppercase transition hover:bg-gold/90"
        >
          Book a call
        </Link>
      }
    >
      {loading ? (
        <p className="font-garamond text-mist/40">Loading…</p>
      ) : bookings.length === 0 ? (
        <p className="font-garamond text-mist/50">You have no bookings yet.</p>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <AppCard key={b.id} className="flex flex-wrap items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-garamond text-base text-mist">
                  {b.starts_at ? formatDateTime(b.starts_at) : 'Scheduled call'}
                </p>
                <p className={`mt-1 font-garamond text-xs uppercase tracking-[0.16em] ${statusColor[b.status]}`}>
                  {b.status}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {b.status === 'confirmed' && b.livekit_room_name ? (
                  <Link
                    to={`/room/${b.livekit_room_name}`}
                    className="rounded-full bg-gold px-4 py-2 font-garamond text-sm tracking-[0.14em] text-void uppercase transition hover:bg-gold/90"
                  >
                    Join
                  </Link>
                ) : null}
                {b.status === 'confirmed' ? (
                  <button
                    type="button"
                    onClick={() => cancel(b.id)}
                    disabled={busyId === b.id}
                    className="rounded-full border border-white/15 px-4 py-2 font-garamond text-sm tracking-[0.14em] text-mist/60 uppercase transition hover:border-red-400/40 hover:text-red-300 disabled:opacity-50"
                  >
                    {busyId === b.id ? '…' : 'Cancel'}
                  </button>
                ) : null}
              </div>
            </AppCard>
          ))}
        </div>
      )}
      <ConfirmDialog {...dialogProps} />
    </AppShell>
  )
}
