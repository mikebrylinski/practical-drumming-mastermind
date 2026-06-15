import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppCard, AdminShell } from '../../components/app/AdminShell'
import { useAuth } from '../../lib/auth/AuthProvider'
import { adminRequestHeaders } from '../../lib/auth/accessToken'
import { formatDateTime } from '../../lib/datetime'
import type { SessionRecording } from '../../lib/supabase/types'

const PAGE_SIZE = 25

const MOCK: SessionRecording[] = [
  {
    id: 'rec-1',
    session_id: null,
    room_name: 'cohort-spring',
    title: 'Week 3 — Groove & Feel',
    egress_id: null,
    status: 'complete',
    filepath: null,
    playback_url: null,
    duration_seconds: 3600,
    started_by: null,
    started_at: new Date(Date.now() - 864e5).toISOString(),
    ended_at: null,
    error_message: null,
    is_published: true,
    created_at: new Date().toISOString(),
  },
]

function isVaultReady(rec: SessionRecording) {
  return rec.status === 'complete' && Boolean(rec.playback_url || rec.filepath)
}

export function AdminVaultPage() {
  const { session, isAdmin, useSeedData, mockMode } = useAuth()
  const demoAdmin = isAdmin && (useSeedData || mockMode)
  const [recordings, setRecordings] = useState<SessionRecording[]>(useSeedData ? MOCK : [])
  const [totalCount, setTotalCount] = useState(useSeedData ? MOCK.length : 0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(!useSeedData)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [schemaWarning, setSchemaWarning] = useState<string | null>(null)
  const [titleDrafts, setTitleDrafts] = useState<Record<string, string>>({})

  const pageCount = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const rangeStart = totalCount === 0 ? 0 : page * PAGE_SIZE + 1
  const rangeEnd = Math.min((page + 1) * PAGE_SIZE, totalCount)

  const load = useCallback(async () => {
    if (useSeedData) {
      setTotalCount(MOCK.length)
      setRecordings(MOCK)
      setTitleDrafts(Object.fromEntries(MOCK.map((r) => [r.id, r.title || r.room_name])))
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    setSchemaWarning(null)
    try {
      const offset = page * PAGE_SIZE
      const headers = await adminRequestHeaders(session, demoAdmin)
      const res = await fetch(
        `/api/recordings/list?status=all&limit=${PAGE_SIZE}&offset=${offset}&admin=1`,
        { headers },
      )
      const json = await res.json()
      if (!res.ok || !json.ok) {
        throw new Error(json.error || 'Could not load recordings')
      }
      if (json.schemaWarning) setSchemaWarning(json.schemaWarning)
      const rows = (json.recordings ?? []) as SessionRecording[]
      setRecordings(rows)
      setTotalCount(json.total ?? rows.length)
      setTitleDrafts(
        Object.fromEntries(rows.map((r) => [r.id, r.title || r.room_name])),
      )
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not load recordings'
      setError(
        message.includes('is_published')
          ? 'Vault publish column missing — run supabase/migrations/20250614_platform_updates.sql'
          : message,
      )
      setRecordings([])
      setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }, [session, demoAdmin, useSeedData, page])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    if (page > 0 && page >= pageCount) {
      setPage(Math.max(0, pageCount - 1))
    }
  }, [page, pageCount])

  async function patchRecording(id: string, patch: { is_published?: boolean; title?: string }) {
    if (useSeedData) {
      setRecordings((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                ...(typeof patch.is_published === 'boolean'
                  ? { is_published: patch.is_published }
                  : {}),
                ...(typeof patch.title === 'string' ? { title: patch.title } : {}),
              }
            : r,
        ),
      )
      return true
    }

    setBusyId(id)
    setError(null)
    try {
      const headers = await adminRequestHeaders(session, demoAdmin)
      const res = await fetch('/api/recordings/update', {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ id, ...patch }),
      })
      const json = await res.json()
      if (!res.ok || !json.ok) {
        throw new Error(json.error || 'Update failed')
      }
      await load()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed')
      return false
    } finally {
      setBusyId(null)
    }
  }

  async function toggleVault(rec: SessionRecording) {
    if (!isVaultReady(rec) && !rec.is_published) {
      setError('Recording must finish processing before it can be added to the member vault.')
      return
    }
    await patchRecording(rec.id, { is_published: !rec.is_published })
  }

  async function saveTitle(rec: SessionRecording) {
    const next = titleDrafts[rec.id]?.trim() || rec.room_name
    if ((rec.title || rec.room_name) === next) return
    await patchRecording(rec.id, { title: next })
  }

  return (
    <AdminShell
      eyebrow="Admin"
      title="Video vault"
      subtitle="Publish session recordings to the member Video Vault at /vault."
      wide
    >
      <AppCard className="mb-6">
        <p className="font-garamond text-sm leading-relaxed text-mist/65">
          Recordings appear here after you record a live room. When a recording is{' '}
          <strong className="text-mist">complete</strong>, set a title and click{' '}
          <strong className="text-mist">Add to member vault</strong> — it will show on{' '}
          <Link to="/vault" className="text-gold underline decoration-gold/30 underline-offset-2">
            the member Video Vault
          </Link>
          .
        </p>
      </AppCard>

      {schemaWarning ? (
        <p className="mb-4 font-garamond text-sm text-amber-300/90">{schemaWarning}</p>
      ) : null}

      {error ? (
        <p className="mb-4 font-garamond text-sm text-red-400/90">{error}</p>
      ) : null}

      {loading ? (
        <p className="font-garamond text-mist/40">Loading…</p>
      ) : totalCount === 0 ? (
        <p className="font-garamond text-mist/50">
          No recordings yet. Start recording from a live cohort or call room.
        </p>
      ) : (
        <>
          <div className="overflow-hidden rounded-xl border border-white/10">
            <table className="w-full text-left font-garamond text-sm">
              <thead className="bg-charcoal/40 text-mist/45 uppercase tracking-[0.14em]">
                <tr>
                  <th className="px-5 py-3">Title</th>
                  <th className="px-5 py-3">Room</th>
                  <th className="px-5 py-3">Recorded</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">In vault</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {recordings.map((r) => {
                  const inVault = r.is_published === true
                  const ready = isVaultReady(r)
                  return (
                    <tr key={r.id} className="border-t border-white/[0.06]">
                      <td className="px-5 py-3">
                        <input
                          value={titleDrafts[r.id] ?? r.title ?? r.room_name}
                          onChange={(e) =>
                            setTitleDrafts((prev) => ({ ...prev, [r.id]: e.target.value }))
                          }
                          onBlur={() => void saveTitle(r)}
                          disabled={busyId === r.id}
                          className="w-full min-w-[12rem] rounded-lg border border-white/10 bg-charcoal/40 px-2.5 py-1.5 font-garamond text-sm text-mist outline-none focus:border-gold/45 disabled:opacity-50"
                        />
                      </td>
                      <td className="px-5 py-3 text-mist/55">{r.room_name}</td>
                      <td className="px-5 py-3 text-mist/65">
                        {formatDateTime(r.started_at)}
                      </td>
                      <td className="px-5 py-3 text-xs uppercase tracking-[0.1em] text-mist/55">
                        {r.status}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`rounded-full px-3 py-0.5 text-xs uppercase tracking-[0.12em] ${
                            inVault
                              ? 'bg-emerald-500/15 text-emerald-300'
                              : 'bg-white/8 text-mist/45'
                          }`}
                        >
                          {inVault ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex flex-wrap items-center justify-end gap-3">
                          {r.playback_url ? (
                            <a
                              href={r.playback_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gold underline decoration-gold/30 underline-offset-2"
                            >
                              Preview
                            </a>
                          ) : null}
                          <button
                            type="button"
                            disabled={busyId === r.id || (!inVault && !ready)}
                            onClick={() => void toggleVault(r)}
                            className="font-garamond text-sm text-gold underline decoration-gold/30 underline-offset-2 disabled:opacity-40"
                            title={
                              !inVault && !ready
                                ? 'Available when recording status is complete'
                                : undefined
                            }
                          >
                            {inVault ? 'Remove from vault' : 'Add to member vault'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 font-garamond text-sm text-mist/55">
            <span>
              Showing {rangeStart}–{rangeEnd} of {totalCount}
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg px-3 py-1 hover:text-gold disabled:opacity-40"
              >
                Previous
              </button>
              <span>
                Page {page + 1} of {pageCount}
              </span>
              <button
                type="button"
                disabled={page >= pageCount - 1}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg px-3 py-1 hover:text-gold disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </AdminShell>
  )
}
