import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { AppCard, AdminShell } from '../../components/app/AdminShell'
import { useAuth } from '../../lib/auth/AuthProvider'
import { adminRequestHeaders } from '../../lib/auth/accessToken'

type ContactType = 'Lead' | 'Student' | 'Prospect' | 'Other'

type Contact = {
  id: string
  name: string
  email: string | null
  phone: string | null
  type: ContactType
  notes: string | null
  created_at: string
}

const CONTACT_TYPES: ContactType[] = ['Lead', 'Student', 'Prospect', 'Other']

const TYPE_BADGE: Record<ContactType, string> = {
  Lead: 'bg-orange-500/15 text-orange-300 ring-orange-400/40',
  Student: 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/40',
  Prospect: 'bg-blue-500/15 text-blue-300 ring-blue-400/30',
  Other: 'bg-white/8 text-mist/60 ring-white/10',
}

const LOCAL_KEY = 'pdm_admin_contacts'

const inputClass =
  'rounded-lg border border-white/12 bg-charcoal/40 px-3 py-2 font-garamond text-sm text-mist outline-none focus:border-gold/45'

function loadLocal(): Contact[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    return raw ? (JSON.parse(raw) as Contact[]) : []
  } catch {
    return []
  }
}

function saveLocal(contacts: Contact[]) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(contacts))
  } catch {
    /* ignore */
  }
}

function makeId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `c_${Date.now()}_${Math.random().toString(36).slice(2)}`
}

function initials(name: string) {
  const parts = (name || '?').trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return (name || '?').slice(0, 2).toUpperCase()
}

export function AdminContacts() {
  const { session, isAdmin, mockMode, useSeedData } = useAuth()
  const demoAdmin = isAdmin && (useSeedData || mockMode)

  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  // 'api' = persisted via Supabase; 'local' = browser-only fallback.
  const [backend, setBackend] = useState<'api' | 'local'>('local')

  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [type, setType] = useState<ContactType>('Lead')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const headers = await adminRequestHeaders(session, demoAdmin)
      const res = await fetch('/api/admin/contacts', { headers })
      const json = await res.json()
      if (res.ok && json.ok && !json.demo) {
        setContacts((json.contacts as Contact[]) ?? [])
        setBackend('api')
        return
      }
      throw new Error('fallback')
    } catch {
      setContacts(loadLocal())
      setBackend('local')
    } finally {
      setLoading(false)
    }
  }, [session, demoAdmin])

  useEffect(() => {
    void load()
  }, [load])

  function resetForm() {
    setName('')
    setEmail('')
    setPhone('')
    setType('Lead')
    setNotes('')
  }

  async function addContact(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    setError(null)

    const payload = {
      name: name.trim(),
      email: email.trim() || null,
      phone: phone.trim() || null,
      type,
      notes: notes.trim() || null,
    }

    if (backend === 'api') {
      try {
        const headers = await adminRequestHeaders(session, demoAdmin)
        const res = await fetch('/api/admin/contacts', {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        })
        const json = await res.json()
        if (!res.ok || !json.ok) throw new Error(json.error || 'Could not save contact')
        if (json.contact) setContacts((c) => [json.contact as Contact, ...c])
        else await load()
        resetForm()
        setShowForm(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not save contact')
      } finally {
        setSaving(false)
      }
      return
    }

    // Local fallback
    const next: Contact = {
      id: makeId(),
      ...payload,
      created_at: new Date().toISOString(),
    }
    const updated = [next, ...contacts]
    setContacts(updated)
    saveLocal(updated)
    resetForm()
    setShowForm(false)
    setSaving(false)
  }

  async function deleteContact(id: string) {
    if (backend === 'api') {
      const prev = contacts
      setContacts((c) => c.filter((x) => x.id !== id))
      try {
        const headers = await adminRequestHeaders(session, demoAdmin)
        const res = await fetch(`/api/admin/contacts?id=${encodeURIComponent(id)}`, {
          method: 'DELETE',
          headers,
        })
        const json = await res.json()
        if (!res.ok || !json.ok) throw new Error()
      } catch {
        setContacts(prev)
        setError('Could not delete contact')
      }
      return
    }
    const updated = contacts.filter((x) => x.id !== id)
    setContacts(updated)
    saveLocal(updated)
  }

  return (
    <AdminShell
      eyebrow="Admin"
      title="Contacts"
      subtitle="Your directory of leads, students, and prospects."
      wide
      actions={
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="flex min-h-10 items-center gap-2 rounded-full bg-gold px-5 font-garamond text-sm tracking-[0.14em] text-void uppercase transition hover:bg-gold/90"
        >
          {showForm ? 'Close' : '+ Add contact'}
        </button>
      }
    >
      {showForm ? (
        <AppCard className="mb-6">
          <h3 className="font-garamond text-lg text-mist">New contact</h3>
          <form onSubmit={addContact} className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="font-garamond text-xs text-mist/55">
              Name *
              <input
                required
                className={`${inputClass} mt-1 block w-full`}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label className="font-garamond text-xs text-mist/55">
              Type
              <select
                className={`${inputClass} mt-1 block w-full`}
                value={type}
                onChange={(e) => setType(e.target.value as ContactType)}
              >
                {CONTACT_TYPES.map((t) => (
                  <option key={t} value={t} className="bg-charcoal">
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <label className="font-garamond text-xs text-mist/55">
              Email
              <input
                type="email"
                className={`${inputClass} mt-1 block w-full`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="font-garamond text-xs text-mist/55">
              Phone
              <input
                className={`${inputClass} mt-1 block w-full`}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>
            <label className="font-garamond text-xs text-mist/55 sm:col-span-2">
              Notes
              <textarea
                rows={2}
                className={`${inputClass} mt-1 block w-full resize-y`}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </label>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="flex min-h-10 items-center justify-center rounded-full bg-gold px-6 font-garamond text-sm tracking-[0.14em] text-void uppercase transition hover:bg-gold/90 disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save contact'}
              </button>
            </div>
          </form>
          {error ? <p className="mt-3 font-garamond text-sm text-red-400/90">{error}</p> : null}
        </AppCard>
      ) : null}

      {loading ? (
        <p className="font-garamond text-mist/40">Loading contacts…</p>
      ) : contacts.length === 0 ? (
        <AppCard>
          <p className="font-garamond text-mist/55">No contacts yet.</p>
          <p className="mt-1 font-garamond text-sm text-mist/40">
            Use “Add contact” to create your first entry.
          </p>
        </AppCard>
      ) : (
        <>
          <p className="mb-3 font-garamond text-sm text-mist/40">{contacts.length} contacts</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {contacts.map((c) => (
              <AppCard key={c.id} className="group relative h-full">
                <button
                  type="button"
                  onClick={() => deleteContact(c.id)}
                  aria-label={`Delete ${c.name}`}
                  className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-full text-mist/30 opacity-0 transition hover:bg-white/8 hover:text-red-300 group-hover:opacity-100"
                >
                  ✕
                </button>
                <div className="flex items-center gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gold/15 font-garamond text-sm text-gold ring-1 ring-gold/25">
                    {initials(c.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-garamond text-base text-mist">{c.name}</p>
                    <span
                      className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.1em] ring-1 ${TYPE_BADGE[c.type]}`}
                    >
                      {c.type}
                    </span>
                  </div>
                </div>
                <div className="mt-3 space-y-1 font-garamond text-sm">
                  {c.email ? (
                    <a href={`mailto:${c.email}`} className="block truncate text-gold/90 hover:text-gold">
                      {c.email}
                    </a>
                  ) : null}
                  {c.phone ? (
                    <a href={`tel:${c.phone}`} className="block truncate text-mist/65 hover:text-mist">
                      {c.phone}
                    </a>
                  ) : null}
                </div>
                {c.notes ? (
                  <p className="mt-3 line-clamp-3 font-garamond text-sm leading-relaxed text-mist/55">
                    {c.notes}
                  </p>
                ) : null}
                <p className="mt-3 font-garamond text-xs text-mist/35">
                  Added {new Date(c.created_at).toLocaleDateString()}
                </p>
              </AppCard>
            ))}
          </div>
        </>
      )}
    </AdminShell>
  )
}
