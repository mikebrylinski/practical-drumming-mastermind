import type { ReactNode } from 'react'
import { STAGE_THEME, heatBand, HEAT_THEME } from '../../lib/crm/scoring'
import type { CRMLead } from '../../lib/crm/types'
import { LeadTimeline } from './LeadTimeline'

export function LeadDetail({
  lead,
  actions,
}: {
  lead: CRMLead | null
  actions?: ReactNode
}) {
  if (!lead) {
    return (
      <div className="flex h-full min-h-[20rem] items-center justify-center rounded-xl border border-white/10 bg-charcoal/50">
        <p className="font-garamond text-sm text-mist/40">Select a lead to view details.</p>
      </div>
    )
  }

  const band = heatBand(lead.intentScore)
  const theme = HEAT_THEME[band]
  const stage = STAGE_THEME[lead.stage]

  return (
    <div
      className={`rounded-xl border border-white/10 bg-charcoal/50 ring-1 ${theme.ring} ${theme.glow}`}
    >
      <div className="border-b border-white/[0.06] p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-garamond text-xl text-mist">{lead.name}</h3>
            <p className="truncate font-garamond text-sm text-mist/45">
              {lead.email || (lead.isAnonymous ? 'anonymous visitor' : '—')}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs uppercase tracking-[0.12em] ring-1 ${stage.className}`}
          >
            {stage.label}
          </span>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline justify-between">
            <span className="font-garamond text-xs tracking-[0.14em] text-mist/45 uppercase">
              Intent score
            </span>
            <span className={`font-bebas text-2xl ${theme.text}`}>{lead.intentScore}</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/8">
            <div
              className={`h-full rounded-full transition-all ${theme.bar}`}
              style={{ width: `${lead.intentScore}%` }}
            />
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-2 font-garamond text-sm">
          <div>
            <dt className="text-mist/40">Role</dt>
            <dd className="text-mist/80 capitalize">{lead.role}</dd>
          </div>
          <div>
            <dt className="text-mist/40">Booking</dt>
            <dd className="text-mist/80">{lead.bookingStatus ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-mist/40">Application</dt>
            <dd className="text-mist/80">{lead.applicationStatus ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-mist/40">Last activity</dt>
            <dd className="text-mist/80">{new Date(lead.lastActivity).toLocaleString()}</dd>
          </div>
        </dl>
      </div>

      {actions ? <div className="border-b border-white/[0.06] p-5">{actions}</div> : null}

      <div className="p-5">
        <p className="mb-4 font-garamond text-xs tracking-[0.16em] text-gold/80 uppercase">
          Activity timeline
        </p>
        <LeadTimeline events={lead.events} />
      </div>
    </div>
  )
}
