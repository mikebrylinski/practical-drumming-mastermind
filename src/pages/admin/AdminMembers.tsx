import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AppCard, AdminShell } from '../../components/app/AdminShell'
import { useAuth } from '../../lib/auth/AuthProvider'
import { adminRequestHeaders } from '../../lib/auth/accessToken'
import { supabase } from '../../lib/supabase/client'
import type { Profile } from '../../lib/supabase/types'

const inputClass =
  'rounded-lg border border-white/12 bg-charcoal/40 px-3 py-2 font-garamond text-sm text-mist outline-none focus:border-gold/45'

const MOCK_MEMBERS: Profile[] = [
  { id: 'u1', email: 'jordan@example.com', full_name: 'Jordan Vega', role: 'member' },
  { id: 'u2', email: 'sasha@example.com', full_name: 'Sasha Lin', role: 'member' },
  { id: 'u3', email: 'admin@example.com', full_name: 'Mike Malinin', role: 'admin' },
]

export function AdminMembers() {
  const { useSeedData, session, isAdmin, mockMode } = useAuth()
  const demoAdmin = isAdmin && (useSeedData || mockMode)
  const [members, setMembers] = useState<Profile[]>(MOCK_MEMBERS)
  const [loading, setLoading] = useState(!useSeedData)
  const [showForm, setShowForm] = useState(false)
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [creating, setCreating] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (useSeedData || !supabase) return
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
  }, [useSeedData])

  async function addMember(e: FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setCreating(true)
    setFormError(null)
    setFormSuccess(null)
    try {
      const headers = await adminRequestHeaders(session, demoAdmin)
      const res = await fetch('/api/admin/members/create', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          email: email.trim(),
          full_name: fullName.trim(),
        }),
      })
      const json = await res.json()
      if (!res.ok || !json.ok) {
        throw new Error(json.error || 'Could not add member')
      }
      setFormSuccess(
        json.existing
          ? 'Existing user updated.'
          : 'Invitation sent — they will receive an email to set their password.',
      )
      setEmail('')
      setFullName('')
      if (supabase && !useSeedData) {
        const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
        if (data) setMembers(data as Profile[])
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not add member')
    } finally {
      setCreating(false)
    }
  }

  return (
    <AdminShell
      eyebrow="Admin"
      title="Members"
      wide
      actions={
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="flex min-h-10 items-center gap-2 rounded-full bg-gold px-5 font-garamond text-sm tracking-[0.14em] text-void uppercase transition hover:bg-gold/90"
        >
          {showForm ? 'Close' : '+ Add member'}
        </button>
      }
    >
      {showForm ? (
        <AppCard className="mb-6">
          <h3 className="font-garamond text-lg text-mist">Invite a member</h3>
          <form onSubmit={addMember} className="mt-4 flex flex-wrap items-end gap-3">
            <label className="font-garamond text-xs text-mist/55">
              Email
              <input
                type="email"
                required
                className={`${inputClass} mt-1 block w-56`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="font-garamond text-xs text-mist/55">
              Full name
              <input
                className={`${inputClass} mt-1 block w-48`}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </label>
            <button
              type="submit"
              disabled={creating}
              className="flex min-h-10 items-center justify-center rounded-full bg-gold px-6 font-garamond text-sm tracking-[0.14em] text-void uppercase transition hover:bg-gold/90 disabled:opacity-50"
            >
              {creating ? 'Sending…' : 'Send invite'}
            </button>
          </form>
          {formError ? (
            <p className="mt-3 font-garamond text-sm text-red-400/90">{formError}</p>
          ) : null}
          {formSuccess ? (
            <p className="mt-3 font-garamond text-sm text-emerald-300/90">{formSuccess}</p>
          ) : null}
        </AppCard>
      ) : null}

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
