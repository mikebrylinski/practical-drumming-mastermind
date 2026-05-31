import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AppCard, AdminShell } from '../../components/app/AdminShell'
import { supabase } from '../../lib/supabase/client'
import type { Booking, Profile } from '../../lib/supabase/types'

export function AdminMemberDetail() {
  const { id } = useParams<{ id: string }>()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(Boolean(supabase))

  useEffect(() => {
    if (!supabase || !id) {
      setLoading(false)
      return
    }
    let active = true
    async function load() {
      const [{ data: p }, { data: b }] = await Promise.all([
        supabase!.from('profiles').select('*').eq('id', id).maybeSingle(),
        supabase!.from('bookings').select('*').eq('user_id', id).order('starts_at'),
      ])
      if (!active) return
      setProfile((p as Profile) ?? null)
      setBookings((b as Booking[]) ?? [])
      setLoading(false)
    }
    void load()
    return () => {
      active = false
    }
  }, [id])

  return (
    <AdminShell
      eyebrow="Admin"
      title="Member detail"
      actions={
        <Link
          to="/admin/members"
          className="rounded-full border border-white/15 px-4 py-2 font-garamond text-sm tracking-[0.14em] text-mist/60 uppercase transition hover:text-mist"
        >
          Back
        </Link>
      }
    >
      {loading ? (
        <p className="font-garamond text-mist/40">Loading…</p>
      ) : !profile ? (
        <p className="font-garamond text-mist/50">
          Member <code className="text-gold">{id}</code> not found (or running in demo mode).
        </p>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          <AppCard>
            <h3 className="font-garamond text-lg text-mist">{profile.full_name || profile.email}</h3>
            <p className="mt-1 font-garamond text-sm text-mist/55">{profile.email}</p>
            <p className="mt-3 font-garamond text-xs tracking-[0.16em] text-gold uppercase">
              {profile.role}
            </p>
          </AppCard>
          <AppCard>
            <h3 className="font-garamond text-base text-mist/80">Bookings</h3>
            {bookings.length === 0 ? (
              <p className="mt-2 font-garamond text-sm text-mist/45">No bookings.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {bookings.map((b) => (
                  <li key={b.id} className="font-garamond text-sm text-mist/65">
                    {b.starts_at ? new Date(b.starts_at).toLocaleString() : 'Call'} — {b.status}
                  </li>
                ))}
              </ul>
            )}
          </AppCard>
        </div>
      )}
    </AdminShell>
  )
}
