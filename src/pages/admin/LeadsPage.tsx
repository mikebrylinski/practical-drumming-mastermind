import { useEffect, useMemo, useState } from 'react'
import { AdminShell } from '../../components/app/AdminShell'
import { LeadFilters } from '../../components/crm/LeadFilters'
import { LeadDetail } from '../../components/crm/LeadDetail'
import { LeadActions } from '../../components/crm/LeadActions'
import { getLeads } from '../../lib/crm/getLeads'
import { applyFilters, defaultFilters, type LeadFilterState } from '../../lib/crm/filters'
import { STAGE_THEME, heatBand, HEAT_THEME } from '../../lib/crm/scoring'
import type { CRMLead } from '../../lib/crm/types'
import { supabase } from '../../lib/supabase/client'

type SortKey = 'score' | 'recent'

function LeadRow({
  lead,
  active,
  onSelect,
}: {
  lead: CRMLead
  active: boolean
  onSelect: () => void
}) {
  const band = heatBand(lead.intentScore)
  const theme = HEAT_THEME[band]
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition ${
        active ? 'bg-white/[0.06] ring-1 ring-white/10' : 'hover:bg-white/[0.03]'
      } ${band === 'urgent' ? theme.glow : ''}`}
    >
      <span className={`h-9 w-1 shrink-0 rounded-full ${theme.bar}`} aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="truncate font-garamond text-sm text-mist">{lead.name}</p>
        <p className="truncate font-garamond text-xs text-mist/40">
          {lead.email || (lead.isAnonymous ? 'anonymous' : '—')}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className={`font-bebas text-xl leading-none ${theme.text}`}>
          {lead.intentScore}
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.1em] ring-1 ${STAGE_THEME[lead.stage].className}`}
        >
          {STAGE_THEME[lead.stage].label}
        </span>
      </div>
    </button>
  )
}

export function LeadsPage() {
  const [leads, setLeads] = useState<CRMLead[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<LeadFilterState>(defaultFilters)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [sort, setSort] = useState<SortKey>('score')
  const [live, setLive] = useState(false)

  useEffect(() => {
    let active = true
    function refresh() {
      getLeads().then((data) => {
        if (!active) return
        setLeads(data)
        setSelectedId((prev) => prev ?? data[0]?.userId ?? null)
        setLoading(false)
      })
    }
    refresh()

    const sb = supabase
    if (!sb) return () => {
      active = false
    }

    // Chunk 7: live CRM updates via Supabase Realtime.
    let timer: number | undefined
    const debouncedRefresh = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(refresh, 400)
    }
    const channel = sb
      .channel('crm-leads')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'lead_events' }, debouncedRefresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, debouncedRefresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, debouncedRefresh)
      .subscribe((status) => setLive(status === 'SUBSCRIBED'))

    return () => {
      active = false
      window.clearTimeout(timer)
      sb.removeChannel(channel)
    }
  }, [])

  const visible = useMemo(() => {
    const filtered = applyFilters(leads, filters)
    const sorted = [...filtered].sort((a, b) =>
      sort === 'score'
        ? b.intentScore - a.intentScore
        : b.lastActivity.localeCompare(a.lastActivity),
    )
    return sorted
  }, [leads, filters, sort])

  const selected = leads.find((l) => l.userId === selectedId) ?? null

  function patchLead(userId: string, patch: Partial<CRMLead>) {
    setLeads((prev) => prev.map((l) => (l.userId === userId ? { ...l, ...patch } : l)))
  }

  return (
    <AdminShell
      eyebrow="Admin"
      title="CRM Leads"
      subtitle="Stripe Radar meets HubSpot — funnel intelligence for the mastermind."
      wide
      actions={
        <span
          className={`flex items-center gap-2 rounded-full px-3 py-1.5 font-garamond text-xs tracking-[0.16em] uppercase ${
            live
              ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30'
              : 'bg-white/5 text-mist/45'
          }`}
        >
          <span
            className={`size-2 rounded-full ${live ? 'animate-pulse bg-emerald-400' : 'bg-mist/40'}`}
            aria-hidden
          />
          {live ? 'Live' : supabase ? 'Offline' : 'Demo'}
        </span>
      }
    >
      <LeadFilters value={filters} onChange={setFilters} />

      {loading ? (
        <p className="font-garamond text-mist/40">Loading leads…</p>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
          <div className="rounded-xl border border-white/10 bg-charcoal/50">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
              <span className="font-garamond text-xs tracking-[0.16em] text-mist/45 uppercase">
                {visible.length} leads
              </span>
              <div className="flex gap-1">
                {(['score', 'recent'] as SortKey[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSort(s)}
                    className={`rounded-full px-3 py-1 font-garamond text-xs uppercase tracking-[0.1em] transition ${
                      sort === s ? 'bg-gold/20 text-gold' : 'text-mist/45 hover:text-mist'
                    }`}
                  >
                    {s === 'score' ? 'Intent' : 'Recent'}
                  </button>
                ))}
              </div>
            </div>
            <div className="max-h-[70vh] space-y-1 overflow-y-auto p-2">
              {visible.length === 0 ? (
                <p className="p-4 font-garamond text-sm text-mist/40">No leads match.</p>
              ) : (
                visible.map((lead) => (
                  <LeadRow
                    key={lead.userId}
                    lead={lead}
                    active={lead.userId === selectedId}
                    onSelect={() => setSelectedId(lead.userId)}
                  />
                ))
              )}
            </div>
          </div>

          <LeadDetail
            lead={selected}
            actions={
              selected ? (
                <LeadActions
                  lead={selected}
                  onLocalUpdate={(patch) => patchLead(selected.userId, patch)}
                />
              ) : undefined
            }
          />
        </div>
      )}
    </AdminShell>
  )
}
