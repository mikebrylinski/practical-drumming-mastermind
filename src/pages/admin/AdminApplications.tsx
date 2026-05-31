import { useEffect, useState } from 'react'
import { AdminShell } from '../../components/app/AdminShell'
import { supabase } from '../../lib/supabase/client'
import type { Application, ApplicationStatus } from '../../lib/supabase/types'

const MOCK_APPS: Application[] = [
  {
    id: 'a1',
    user_id: null,
    email: 'jordan@example.com',
    full_name: 'Jordan Vega',
    type: 'book-a-call',
    answers: {},
    status: 'new',
    notes: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'a2',
    user_id: null,
    email: 'sasha@example.com',
    full_name: 'Sasha Lin',
    type: 'apply',
    answers: {},
    status: 'contacted',
    notes: null,
    created_at: new Date(Date.now() - 2 * 864e5).toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const STATUSES: ApplicationStatus[] = ['new', 'contacted', 'accepted', 'rejected']

const statusColor: Record<ApplicationStatus, string> = {
  new: 'bg-blue-500/15 text-blue-300 ring-blue-400/30',
  contacted: 'bg-amber-500/15 text-amber-300 ring-amber-400/30',
  accepted: 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/30',
  rejected: 'bg-red-500/15 text-red-300 ring-red-400/30',
}

export function AdminApplications() {
  const [apps, setApps] = useState<Application[]>(MOCK_APPS)
  const [loading, setLoading] = useState(Boolean(supabase))

  useEffect(() => {
    if (!supabase) return
    let active = true
    supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (!active) return
        if (data) setApps(data as Application[])
        setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  async function updateStatus(id: string, status: ApplicationStatus) {
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
    if (supabase) {
      await supabase
        .from('applications')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
    }
  }

  return (
    <AdminShell eyebrow="Admin" title="Applications" wide>
      {loading ? (
        <p className="font-garamond text-mist/40">Loading…</p>
      ) : (
        <div className="space-y-3">
          {apps.map((a) => (
            <div
              key={a.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-charcoal/50 px-5 py-4"
            >
              <div className="min-w-0">
                <p className="font-garamond text-base text-mist">{a.full_name || a.email}</p>
                <p className="font-garamond text-sm text-mist/45">
                  {a.email} · {a.type || 'application'} ·{' '}
                  {new Date(a.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.14em] ring-1 ${statusColor[a.status]}`}
                >
                  {a.status}
                </span>
                <select
                  value={a.status}
                  onChange={(e) => updateStatus(a.id, e.target.value as ApplicationStatus)}
                  className="rounded-lg border border-white/12 bg-charcoal/60 px-3 py-1.5 font-garamond text-sm text-mist outline-none focus:border-gold/40"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  )
}
