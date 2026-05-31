import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminShell } from '../../components/app/AdminShell'
import { supabase } from '../../lib/supabase/client'
import type { Profile } from '../../lib/supabase/types'

const MOCK_MEMBERS: Profile[] = [
  { id: 'u1', email: 'jordan@example.com', full_name: 'Jordan Vega', role: 'member' },
  { id: 'u2', email: 'sasha@example.com', full_name: 'Sasha Lin', role: 'member' },
  { id: 'u3', email: 'admin@example.com', full_name: 'Mike Malinin', role: 'admin' },
]

export function AdminMembers() {
  const [members, setMembers] = useState<Profile[]>(MOCK_MEMBERS)
  const [loading, setLoading] = useState(Boolean(supabase))

  useEffect(() => {
    if (!supabase) return
    let active = true
    supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (!active) return
        if (data) setMembers(data as Profile[])
        setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <AdminShell eyebrow="Admin" title="Members" wide>
      {loading ? (
        <p className="font-garamond text-mist/40">Loading…</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-left font-garamond text-sm">
            <thead className="bg-charcoal/40 text-mist/45 uppercase tracking-[0.14em]">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-t border-white/[0.06]">
                  <td className="px-5 py-3 text-mist">{m.full_name || '—'}</td>
                  <td className="px-5 py-3 text-mist/65">{m.email}</td>
                  <td className="px-5 py-3 text-gold uppercase tracking-[0.12em]">{m.role}</td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      to={`/admin/member/${m.id}`}
                      className="text-gold underline decoration-gold/30 underline-offset-2"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  )
}
