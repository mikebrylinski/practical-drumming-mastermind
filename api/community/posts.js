import { handleOptions } from '../livekit/_lib.js'
import {
  createCommunityPost,
  deleteCommunityPost,
  listCommunityPosts,
  verifyAdminRequest,
  verifyMemberRequest,
} from '../../server/lib/communityForum.js'

export default async function handler(req, res) {
  if (handleOptions(req, res)) return

  try {
    if (req.method === 'GET') {
      const auth = await verifyMemberRequest(req)
      if (!auth.ok) {
        return res.status(auth.status || 401).json({ ok: false, error: auth.error })
      }

      const result = await listCommunityPosts()
      if (!result.ok) {
        return res.status(result.status || 500).json({ ok: false, error: result.error })
      }
      return res.status(200).json({ ok: true, posts: result.posts, mock: result.mock === true })
    }

    if (req.method === 'POST') {
      const auth = await verifyMemberRequest(req)
      if (!auth.ok) {
        return res.status(auth.status || 401).json({ ok: false, error: auth.error })
      }

      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
      const title = String(body.title || '').trim()
      const text = String(body.body || '').trim()
      if (!title || !text) {
        return res.status(400).json({ ok: false, error: 'Title and body are required' })
      }

      const result = await createCommunityPost(auth.userId, { title, body: text })
      if (!result.ok) {
        return res.status(result.status || 500).json({ ok: false, error: result.error })
      }
      return res.status(200).json({ ok: true, post: result.post })
    }

    if (req.method === 'DELETE') {
      const auth = await verifyAdminRequest(req)
      if (!auth.ok) {
        return res.status(auth.status || 403).json({ ok: false, error: auth.error })
      }

      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
      const id = String(req.query?.id || body.id || '').trim()
      if (!id) {
        return res.status(400).json({ ok: false, error: 'id is required' })
      }

      const result = await deleteCommunityPost(id)
      if (!result.ok) {
        return res.status(result.status || 500).json({ ok: false, error: result.error })
      }
      return res.status(200).json({ ok: true })
    }

    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  } catch (err) {
    console.error('[community/posts]', err)
    return res.status(500).json({ ok: false, error: 'Server error' })
  }
}
