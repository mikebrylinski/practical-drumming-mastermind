import type { LeadFilterState } from '../../lib/crm/filters'
import { defaultFilters } from '../../lib/crm/filters'

const selectClass =
  'rounded-lg border border-white/12 bg-charcoal/50 px-3 py-1.5 font-garamond text-sm text-mist outline-none focus:border-gold/40'

const labelClass = 'font-garamond text-xs tracking-[0.14em] text-mist/45 uppercase'

export function LeadFilters({
  value,
  onChange,
}: {
  value: LeadFilterState
  onChange: (next: LeadFilterState) => void
}) {
  function patch(p: Partial<LeadFilterState>) {
    onChange({ ...value, ...p })
  }

  return (
    <div className="mb-5 rounded-xl border border-white/10 bg-charcoal/50 p-4">
      <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
        <div className="min-w-[14rem]">
          <span className={labelClass}>
            Intent score: {value.scoreMin}–{value.scoreMax}
          </span>
          <div className="mt-2 flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={100}
              value={value.scoreMin}
              onChange={(e) =>
                patch({ scoreMin: Math.min(Number(e.target.value), value.scoreMax) })
              }
              className="w-full accent-[var(--color-gold)]"
            />
            <input
              type="range"
              min={0}
              max={100}
              value={value.scoreMax}
              onChange={(e) =>
                patch({ scoreMax: Math.max(Number(e.target.value), value.scoreMin) })
              }
              className="w-full accent-[var(--color-gold)]"
            />
          </div>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Stage</span>
          <select
            className={selectClass}
            value={value.stage}
            onChange={(e) => patch({ stage: e.target.value as LeadFilterState['stage'] })}
          >
            <option value="all">All</option>
            <option value="cold">Cold</option>
            <option value="warm">Warm</option>
            <option value="hot">Hot</option>
            <option value="converted">Converted</option>
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Booking</span>
          <select
            className={selectClass}
            value={value.booking}
            onChange={(e) => patch({ booking: e.target.value as LeadFilterState['booking'] })}
          >
            <option value="all">All</option>
            <option value="has">Has booking</option>
            <option value="none">No booking</option>
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Application</span>
          <select
            className={selectClass}
            value={value.application}
            onChange={(e) =>
              patch({ application: e.target.value as LeadFilterState['application'] })
            }
          >
            <option value="all">All</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Last activity</span>
          <select
            className={selectClass}
            value={value.activity}
            onChange={(e) => patch({ activity: e.target.value as LeadFilterState['activity'] })}
          >
            <option value="all">Any time</option>
            <option value="24h">Last 24h</option>
            <option value="7d">Last 7 days</option>
            <option value="stale">Stale (7d+)</option>
          </select>
        </label>

        <button
          type="button"
          onClick={() => onChange({ ...defaultFilters })}
          className="ml-auto rounded-full border border-white/15 px-4 py-1.5 font-garamond text-xs tracking-[0.14em] text-mist/60 uppercase transition hover:text-mist"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
