import { getSupabaseAdmin } from './supabaseAdmin.js'
import { resolveAdminFromRequest, resolveUserFromRequest } from './authRequest.js'

export function isMissingCommunityTableError(error) {
  const msg = String(error?.message || error || '').toLowerCase()
  return msg.includes('community_posts') && (msg.includes('does not exist') || msg.includes('schema cache'))
}

export async function verifyMemberRequest(req) {
  if (req.headers['x-demo-admin'] === 'true') {
    return {
      ok: true,
      userId: '00000000-0000-0000-0000-000000000001',
      demo: true,
    }
  }

  const { user, error } = await resolveUserFromRequest(req)
  if (!user) {
    return {
      ok: false,
      status: error === 'Missing authorization token' ? 401 : 401,
      error: error || 'Unauthorized',
    }
  }

  return { ok: true, userId: user.id, demo: false }
}

export async function verifyAdminRequest(req) {
  if (req.headers['x-demo-admin'] === 'true') {
    return { ok: true, userId: '00000000-0000-0000-0000-000000000001', demo: true }
  }

  const result = await resolveAdminFromRequest(req)
  if (!result.ok || !result.user) {
    return {
      ok: false,
      status: result.error === 'Admin access required' ? 403 : 401,
      error: result.error || 'Admin access required',
    }
  }

  return { ok: true, userId: result.user.id, demo: false }
}

function mapPost(row) {
  const profile = row.profiles
  return {
    id: row.id,
    user_id: row.user_id,
    title: row.title,
    body: row.body,
    created_at: row.created_at,
    updated_at: row.updated_at,
    author: profile
      ? { full_name: profile.full_name, email: profile.email }
      : undefined,
  }
}

function mapReply(row) {
  const profile = row.profiles
  return {
    id: row.id,
    post_id: row.post_id,
    user_id: row.user_id,
    body: row.body,
    created_at: row.created_at,
    author: profile
      ? { full_name: profile.full_name, email: profile.email }
      : undefined,
  }
}

export async function listCommunityPosts() {
  const admin = getSupabaseAdmin()
  if (!admin) {
    return { ok: true, mock: true, posts: [] }
  }

  const { data, error } = await admin
    .from('community_posts')
    .select('id, user_id, title, body, created_at, updated_at, profiles(full_name, email)')
    .order('created_at', { ascending: false })

  if (error) {
    if (isMissingCommunityTableError(error)) {
      return { ok: false, status: 503, error: 'Community tables are not set up yet.' }
    }
    console.error('[community/posts]', error)
    return { ok: false, status: 500, error: 'Could not load posts' }
  }

  return { ok: true, posts: (data ?? []).map(mapPost) }
}

export async function createCommunityPost(userId, { title, body }) {
  const admin = getSupabaseAdmin()
  if (!admin) {
    return { ok: false, status: 503, error: 'Community is not configured' }
  }

  const { data, error } = await admin
    .from('community_posts')
    .insert({
      user_id: userId,
      title: title.trim(),
      body: body.trim(),
    })
    .select('id, user_id, title, body, created_at, updated_at, profiles(full_name, email)')
    .single()

  if (error) {
    if (isMissingCommunityTableError(error)) {
      return { ok: false, status: 503, error: 'Community tables are not set up yet.' }
    }
    console.error('[community/posts create]', error)
    return { ok: false, status: 500, error: error.message || 'Could not create post' }
  }

  return { ok: true, post: mapPost(data) }
}

export async function listCommunityReplies(postId) {
  const admin = getSupabaseAdmin()
  if (!admin) {
    return { ok: true, mock: true, replies: [] }
  }

  const { data, error } = await admin
    .from('community_replies')
    .select('id, post_id, user_id, body, created_at, profiles(full_name, email)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  if (error) {
    if (isMissingCommunityTableError(error)) {
      return { ok: false, status: 503, error: 'Community tables are not set up yet.' }
    }
    console.error('[community/replies]', error)
    return { ok: false, status: 500, error: 'Could not load replies' }
  }

  return { ok: true, replies: (data ?? []).map(mapReply) }
}

export async function createCommunityReply(userId, { postId, body }) {
  const admin = getSupabaseAdmin()
  if (!admin) {
    return { ok: false, status: 503, error: 'Community is not configured' }
  }

  const { data, error } = await admin
    .from('community_replies')
    .insert({
      post_id: postId,
      user_id: userId,
      body: body.trim(),
    })
    .select('id, post_id, user_id, body, created_at, profiles(full_name, email)')
    .single()

  if (error) {
    if (isMissingCommunityTableError(error)) {
      return { ok: false, status: 503, error: 'Community tables are not set up yet.' }
    }
    console.error('[community/replies create]', error)
    return { ok: false, status: 500, error: error.message || 'Could not create reply' }
  }

  return { ok: true, reply: mapReply(data) }
}

export async function deleteCommunityPost(postId) {
  const admin = getSupabaseAdmin()
  if (!admin) {
    return { ok: false, status: 503, error: 'Community is not configured' }
  }

  const { error } = await admin.from('community_posts').delete().eq('id', postId)
  if (error) {
    if (isMissingCommunityTableError(error)) {
      return { ok: false, status: 503, error: 'Community tables are not set up yet.' }
    }
    console.error('[community/posts delete]', error)
    return { ok: false, status: 500, error: error.message || 'Could not delete post' }
  }

  return { ok: true }
}

export async function deleteCommunityReply(replyId) {
  const admin = getSupabaseAdmin()
  if (!admin) {
    return { ok: false, status: 503, error: 'Community is not configured' }
  }

  const { error } = await admin.from('community_replies').delete().eq('id', replyId)
  if (error) {
    if (isMissingCommunityTableError(error)) {
      return { ok: false, status: 503, error: 'Community tables are not set up yet.' }
    }
    console.error('[community/replies delete]', error)
    return { ok: false, status: 500, error: error.message || 'Could not delete reply' }
  }

  return { ok: true }
}
