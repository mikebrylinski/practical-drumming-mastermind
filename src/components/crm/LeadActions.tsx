import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { ApplicationStatus } from '../../lib/supabase/types'
import type { CRMLead } from '../../lib/crm/types'

const APP_STATUSES: ApplicationStatus[] = ['new', 'contacted', 'accepted', 'rejected']

const EMAIL_TEMPLATES = [
  { id: 'welcome_email', label: 'Welcome' },
  { id: 'application_received', label: 'Application received' },
  { id: 'session_join_link', label: 'Session join link' },
]

const btn =
  'rounded-full px-3.5 py-1.5 font-garamond text-xs tracking-[0.1em] uppercase transition'

async function callAction(payload: Record<string, unknown>) {
  await fetch('/api/crm/action', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export function LeadActions({
  lead,
  onLocalUpdate,
}: {
  lead: CRMLead
  onLocalUpdate: (patch: Partial<CRMLead>) => void
}) {
  const [note, setNote] = useState(lead.note ?? '')
  const [appStatus, setAppStatus] = useState<ApplicationStatus>(lead.applicationStatus ?? 'new')
  const [template, setTemplate] = useState(EMAIL_TEMPLATES[0].id)
  const [flash, setFlash] = useState<string | null>(null)

  useEffect(() => {
    setNote(lead.note ?? '')
    setAppStatus(lead.applicationStatus ?? 'new')
  }, [lead.userId, lead.note, lead.applicationStatus])

  function notify(msg: string) {
    setFlash(msg)
    window.setTimeout(() => setFlash(null), 2200)
  }

  async function markContacted() {
    onLocalUpdate({ contacted: true, applicationStatus: 'contacted' })
    await callAction({ action: 'contacted', userId: lead.userId, email: lead.email })
    notify('Marked contacted')
  }

  async function saveNote() {
    onLocalUpdate({ note })
    await callAction({ action: 'note', userId: lead.userId, email: lead.email, note })
    notify('Note saved')
  }

  async function updateStatus(status: ApplicationStatus) {
    setAppStatus(status)
    onLocalUpdate({ applicationStatus: status })
    await callAction({
      action: 'application_status',
      userId: lead.userId,
      email: lead.email,
      applicationStatus: status,
    })
    notify('Application updated')
  }

  async function sendEmail() {
    if (!lead.email) {
      notify('No email on file')
      return
    }
    const res = await fetch('/api/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ template, to: lead.email, data: { name: lead.name } }),
    })
    const json = await res.json().catch(() => ({}))
    notify(json.status === 'skipped' ? 'Email logged (Resend off)' : 'Email sent')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-garamond text-xs tracking-[0.16em] text-gold/80 uppercase">
          Quick actions
        </p>
        {flash ? <span className="font-garamond text-xs text-gold">{flash}</span> : null}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={markContacted}
          className={`${btn} ${
            lead.contacted
              ? 'bg-gold/20 text-gold ring-1 ring-gold/40'
              : 'border border-white/15 text-mist/70 hover:border-gold/40 hover:text-gold'
          }`}
        >
          {lead.contacted ? 'Contacted ✓' : 'Mark contacted'}
        </button>
        <Link
          to="/book/discovery-call"
          className={`${btn} border border-white/15 text-mist/70 hover:border-gold/40 hover:text-gold`}
        >
          Open booking link
        </Link>
      </div>

      <div>
        <label className="font-garamond text-xs tracking-[0.14em] text-mist/45 uppercase">
          Application status
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {APP_STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => updateStatus(s)}
              className={`${btn} ${
                appStatus === s
                  ? 'bg-gold/20 text-gold ring-1 ring-gold/40'
                  : 'border border-white/12 text-mist/55 hover:text-mist'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="font-garamond text-xs tracking-[0.14em] text-mist/45 uppercase">
          Internal note
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          className="mt-2 w-full resize-y rounded-lg border border-white/12 bg-charcoal/50 px-3 py-2 font-garamond text-sm text-mist outline-none focus:border-gold/40"
          placeholder="Add a private note…"
        />
        <button
          type="button"
          onClick={saveNote}
          className={`${btn} mt-2 border border-white/15 text-mist/70 hover:border-gold/40 hover:text-gold`}
        >
          Save note
        </button>
      </div>

      <div>
        <label className="font-garamond text-xs tracking-[0.14em] text-mist/45 uppercase">
          Send email
        </label>
        <div className="mt-2 flex gap-2">
          <select
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="flex-1 rounded-lg border border-white/12 bg-charcoal/50 px-3 py-1.5 font-garamond text-sm text-mist outline-none focus:border-gold/40"
          >
            {EMAIL_TEMPLATES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={sendEmail}
            className="rounded-lg bg-gold px-4 py-1.5 font-garamond text-xs tracking-[0.12em] text-void uppercase transition hover:bg-gold/90"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
