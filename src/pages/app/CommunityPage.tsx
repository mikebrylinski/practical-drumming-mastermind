import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { MembersLayout } from '../../components/members/MembersLayout'
import { MembersCard } from '../../components/members/MembersCard'
import { useAuth } from '../../lib/auth/AuthProvider'
import { adminRequestHeaders } from '../../lib/auth/accessToken'
import type { CommunityPost, CommunityReply, Profile } from '../../lib/supabase/types'

type PostWithAuthor = CommunityPost & { author?: Pick<Profile, 'full_name' | 'email'> }
type ReplyWithAuthor = CommunityReply & { author?: Pick<Profile, 'full_name' | 'email'> }

const LOCAL_STORAGE_KEY = 'pdm-community-v1'

const inputClass =
  'w-full rounded-lg border border-white/12 bg-charcoal/40 px-4 py-2.5 font-garamond text-sm text-mist outline-none focus:border-gold/45'

const deleteBtnClass =
  'shrink-0 font-garamond text-xs tracking-[0.08em] text-red-300/80 uppercase underline decoration-red-300/30 underline-offset-2 transition hover:text-red-200 disabled:opacity-50'

const MOCK_POSTS: PostWithAuthor[] = [
  {
    id: 'p1',
    user_id: 'u1',
    title: 'Ghost note exercise from last session',
    body: 'Has anyone been working through the push-pull ghost note drill Mike shared? Would love to hear what clicked for you.',
    created_at: new Date(Date.now() - 3600e3).toISOString(),
    updated_at: new Date(Date.now() - 3600e3).toISOString(),
    author: { full_name: 'Jordan Lee', email: 'jordan@example.com' },
  },
]

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const hrs = Math.round(diff / 3600000)
  if (hrs < 1) return 'just now'
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.round(hrs / 24)}d ago`
}

function readLocalPosts(): PostWithAuthor[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as { posts?: PostWithAuthor[] }
    return parsed.posts ?? []
  } catch {
    return []
  }
}

function writeLocalPosts(posts: PostWithAuthor[]) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ posts }))
}

function readLocalReplies(postId: string): ReplyWithAuthor[] {
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_KEY}-replies-${postId}`)
    if (!raw) return []
    return JSON.parse(raw) as ReplyWithAuthor[]
  } catch {
    return []
  }
}

function writeLocalReplies(postId: string, replies: ReplyWithAuthor[]) {
  localStorage.setItem(`${LOCAL_STORAGE_KEY}-replies-${postId}`, JSON.stringify(replies))
}

export function CommunityPage() {
  const { useSeedData, profile, session, mockMode, isAdmin } = useAuth()
  const userId = session?.user?.id ?? profile?.id ?? null
  const authorLabel = profile?.full_name || profile?.email?.split('@')[0] || 'You'

  const [posts, setPosts] = useState<PostWithAuthor[]>(useSeedData ? MOCK_POSTS : [])
  const [loading, setLoading] = useState(!useSeedData)
  const [selectedId, setSelectedId] = useState<string | null>(useSeedData ? MOCK_POSTS[0]?.id ?? null : null)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [replyBody, setReplyBody] = useState('')
  const [replies, setReplies] = useState<ReplyWithAuthor[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [localOnly, setLocalOnly] = useState(false)

  const loadPosts = useCallback(async () => {
    if (useSeedData) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const headers = await adminRequestHeaders(session, mockMode && !session)
      const res = await fetch('/api/community/posts', { headers })
      const json = await res.json().catch(() => null)

      if (res.ok && json?.ok) {
        setLocalOnly(false)
        setPosts(json.posts ?? [])
        return
      }

      if (res.status === 503 || json?.error?.includes('not set up')) {
        const local = readLocalPosts()
        setLocalOnly(true)
        setPosts(local)
        setError(null)
        return
      }

      setError(json?.error || 'Could not load community posts.')
    } catch {
      const local = readLocalPosts()
      setLocalOnly(true)
      setPosts(local)
      setError('Community API unreachable. Using local drafts until the server is running.')
    } finally {
      setLoading(false)
    }
  }, [useSeedData, session, mockMode])

  useEffect(() => {
    void loadPosts()
  }, [loadPosts])

  useEffect(() => {
    if (posts.length === 0) {
      setSelectedId(null)
      return
    }
    setSelectedId((current) => (current && posts.some((p) => p.id === current) ? current : posts[0].id))
  }, [posts])

  const loadReplies = useCallback(
    async (postId: string) => {
      if (useSeedData || localOnly) {
        setReplies(readLocalReplies(postId))
        return
      }

      try {
        const headers = await adminRequestHeaders(session, mockMode && !session)
        const res = await fetch(`/api/community/replies?post_id=${encodeURIComponent(postId)}`, {
          headers,
        })
        const json = await res.json().catch(() => null)
        if (res.ok && json?.ok) {
          setReplies(json.replies ?? [])
          return
        }
        setReplies(readLocalReplies(postId))
      } catch {
        setReplies(readLocalReplies(postId))
      }
    },
    [useSeedData, localOnly, session, mockMode],
  )

  useEffect(() => {
    if (selectedId) void loadReplies(selectedId)
  }, [selectedId, loadReplies])

  async function createPost(e: FormEvent) {
    e.preventDefault()
    if (!title.trim() || !body.trim() || !userId) return
    setBusy(true)
    setError(null)
    try {
      const newPost: PostWithAuthor = {
        id: `local-${Date.now()}`,
        user_id: userId,
        title: title.trim(),
        body: body.trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        author: { full_name: authorLabel, email: profile?.email ?? '' },
      }

      if (useSeedData || localOnly) {
        setPosts((prev) => {
          const next = [newPost, ...prev]
          writeLocalPosts(next)
          return next
        })
        setSelectedId(newPost.id)
        setTitle('')
        setBody('')
        return
      }

      const headers = await adminRequestHeaders(session, mockMode && !session)
      const res = await fetch('/api/community/posts', {
        method: 'POST',
        headers,
        body: JSON.stringify({ title: title.trim(), body: body.trim() }),
      })
      const json = await res.json().catch(() => null)
      if (!res.ok || !json?.ok) {
        if (res.status === 503) {
          setLocalOnly(true)
          setPosts((prev) => {
            const next = [newPost, ...prev]
            writeLocalPosts(next)
            return next
          })
          setSelectedId(newPost.id)
          setTitle('')
          setBody('')
          setError('Saved locally — run the community SQL migration in Supabase to persist posts.')
          return
        }
        setError(json?.error || 'Could not create post.')
        return
      }

      setTitle('')
      setBody('')
      void loadPosts()
    } finally {
      setBusy(false)
    }
  }

  async function submitReply(e: FormEvent) {
    e.preventDefault()
    if (!selectedId || !replyBody.trim() || !userId) return
    setBusy(true)
    setError(null)
    try {
      const newReply: ReplyWithAuthor = {
        id: `local-reply-${Date.now()}`,
        post_id: selectedId,
        user_id: userId,
        body: replyBody.trim(),
        created_at: new Date().toISOString(),
        author: { full_name: authorLabel, email: profile?.email ?? '' },
      }

      if (useSeedData || localOnly) {
        setReplies((prev) => {
          const next = [...prev, newReply]
          writeLocalReplies(selectedId, next)
          return next
        })
        setReplyBody('')
        return
      }

      const headers = await adminRequestHeaders(session, mockMode && !session)
      const res = await fetch('/api/community/replies', {
        method: 'POST',
        headers,
        body: JSON.stringify({ post_id: selectedId, body: replyBody.trim() }),
      })
      const json = await res.json().catch(() => null)
      if (!res.ok || !json?.ok) {
        if (res.status === 503) {
          setLocalOnly(true)
          setReplies((prev) => {
            const next = [...prev, newReply]
            writeLocalReplies(selectedId, next)
            return next
          })
          setReplyBody('')
          return
        }
        setError(json?.error || 'Could not post reply.')
        return
      }

      setReplyBody('')
      void loadReplies(selectedId)
    } finally {
      setBusy(false)
    }
  }

  async function deletePost(postId: string) {
    if (!isAdmin || !window.confirm('Delete this discussion and all replies?')) return
    setBusy(true)
    setError(null)
    try {
      if (useSeedData || localOnly) {
        setPosts((prev) => {
          const next = prev.filter((p) => p.id !== postId)
          writeLocalPosts(next)
          return next
        })
        localStorage.removeItem(`${LOCAL_STORAGE_KEY}-replies-${postId}`)
        if (selectedId === postId) {
          setReplies([])
        }
        return
      }

      const headers = await adminRequestHeaders(session, mockMode && !session)
      const res = await fetch(`/api/community/posts?id=${encodeURIComponent(postId)}`, {
        method: 'DELETE',
        headers,
      })
      const json = await res.json().catch(() => null)
      if (!res.ok || !json?.ok) {
        setError(json?.error || 'Could not delete post.')
        return
      }
      if (selectedId === postId) {
        setReplies([])
      }
      void loadPosts()
    } finally {
      setBusy(false)
    }
  }

  async function deleteReply(replyId: string) {
    if (!isAdmin || !selectedId || !window.confirm('Delete this reply?')) return
    setBusy(true)
    setError(null)
    try {
      if (useSeedData || localOnly) {
        setReplies((prev) => {
          const next = prev.filter((r) => r.id !== replyId)
          writeLocalReplies(selectedId, next)
          return next
        })
        return
      }

      const headers = await adminRequestHeaders(session, mockMode && !session)
      const res = await fetch(`/api/community/replies?id=${encodeURIComponent(replyId)}`, {
        method: 'DELETE',
        headers,
      })
      const json = await res.json().catch(() => null)
      if (!res.ok || !json?.ok) {
        setError(json?.error || 'Could not delete reply.')
        return
      }
      void loadReplies(selectedId)
    } finally {
      setBusy(false)
    }
  }

  const selected = posts.find((p) => p.id === selectedId)

  return (
    <MembersLayout activeId="community">
      {error ? (
        <p className="mb-4 rounded-lg border border-amber-400/30 bg-amber-400/10 px-4 py-3 font-garamond text-sm text-amber-100/90">
          {error}
        </p>
      ) : null}
      {localOnly && !error ? (
        <p className="mb-4 rounded-lg border border-white/10 bg-charcoal/40 px-4 py-3 font-garamond text-sm text-mist/55">
          Community database tables are not set up yet. Posts are saved in this browser only. Run{' '}
          <code className="text-gold">supabase/migrations/community_forum.sql</code> in the Supabase SQL
          editor to enable shared posts.
        </p>
      ) : null}

      <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="space-y-4">
          <MembersCard title="New discussion">
            <form onSubmit={createPost} className="space-y-3">
              <input
                className={inputClass}
                placeholder="Topic title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
              />
              <textarea
                className={`${inputClass} min-h-24 resize-y`}
                placeholder="Share a question, insight, or update…"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                maxLength={4000}
              />
              <button
                type="submit"
                disabled={busy || !title.trim() || !body.trim() || !userId}
                className="rounded-full bg-gold px-5 py-2 font-garamond text-xs tracking-[0.14em] text-void uppercase hover:bg-gold/90 disabled:opacity-50"
              >
                Post to community
              </button>
            </form>
          </MembersCard>

          <MembersCard title="Discussions">
            {loading ? (
              <p className="font-garamond text-sm text-mist/40">Loading…</p>
            ) : posts.length === 0 ? (
              <p className="font-garamond text-sm text-mist/50">No posts yet — start the conversation.</p>
            ) : (
              <ul className="divide-y divide-white/[0.06]">
                {posts.map((post) => (
                  <li key={post.id} className="flex items-start gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedId(post.id)}
                      className={`min-w-0 flex-1 px-1 py-3 text-left transition ${
                        selectedId === post.id ? 'text-gold' : 'text-mist hover:text-gold'
                      }`}
                    >
                      <p className="font-garamond text-base font-medium">{post.title}</p>
                      <p className="mt-1 line-clamp-2 font-garamond text-sm text-mist/55">{post.body}</p>
                      <p className="mt-2 font-garamond text-xs text-mist/40">
                        {post.author?.full_name || 'Member'} · {relativeTime(post.created_at)}
                      </p>
                    </button>
                    {isAdmin ? (
                      <button
                        type="button"
                        onClick={() => void deletePost(post.id)}
                        disabled={busy}
                        className={`${deleteBtnClass} px-1 py-3`}
                      >
                        Delete
                      </button>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </MembersCard>
        </div>

        <MembersCard title={selected ? selected.title : 'Select a thread'}>
          {selected ? (
            <div>
              <div className="flex items-start justify-between gap-3">
                <p className="font-garamond text-base leading-relaxed text-mist/70">{selected.body}</p>
                {isAdmin ? (
                  <button
                    type="button"
                    onClick={() => void deletePost(selected.id)}
                    disabled={busy}
                    className={deleteBtnClass}
                  >
                    Delete thread
                  </button>
                ) : null}
              </div>
              <p className="mt-2 font-garamond text-xs text-mist/40">
                {selected.author?.full_name || 'Member'} · {relativeTime(selected.created_at)}
              </p>

              <div className="mt-6 border-t border-white/10 pt-4">
                <h3 className="font-garamond text-sm tracking-[0.14em] text-mist/50 uppercase">Replies</h3>
                {replies.length === 0 ? (
                  <p className="mt-2 font-garamond text-sm text-mist/40">No replies yet.</p>
                ) : (
                  <ul className="mt-3 space-y-3">
                    {replies.map((r) => (
                      <li key={r.id} className="rounded-lg border border-white/10 bg-charcoal/30 px-3 py-2">
                        <div className="flex items-start justify-between gap-3">
                          <p className="font-garamond text-sm text-mist/75">{r.body}</p>
                          {isAdmin ? (
                            <button
                              type="button"
                              onClick={() => void deleteReply(r.id)}
                              disabled={busy}
                              className={deleteBtnClass}
                            >
                              Delete
                            </button>
                          ) : null}
                        </div>
                        <p className="mt-1 font-garamond text-xs text-mist/40">
                          {r.author?.full_name || 'Member'} · {relativeTime(r.created_at)}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}

                <form onSubmit={submitReply} className="mt-4 space-y-2">
                  <textarea
                    className={`${inputClass} min-h-20 resize-y`}
                    placeholder="Write a reply…"
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={busy || !replyBody.trim() || !userId}
                    className="rounded-full border border-gold/40 px-4 py-2 font-garamond text-xs tracking-[0.14em] text-gold uppercase hover:bg-gold/10 disabled:opacity-50"
                  >
                    Reply
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <p className="font-garamond text-sm text-mist/50">
              Choose a discussion from the list, or{' '}
              <Link to="/dashboard" className="text-gold underline">
                return to dashboard
              </Link>
              .
            </p>
          )}
        </MembersCard>
      </div>
    </MembersLayout>
  )
}
