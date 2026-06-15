import { handleOptions } from '../livekit/_lib.js'
import {
  createCommunityReply,
  deleteCommunityReply,
  listCommunityReplies,
  verifyAdminRequest,
  verifyMemberRequest,
} from '../../server/lib/communityForum.js'

export default async function handler(req, res) {
  if (handleOptions(req, res)) return

  try {
    const postId = req.query?.post_id || req.query?.postId

    if (req.method === 'GET') {
      const auth = await verifyMemberRequest(req)
      if (!auth.ok) {
        return res.status(auth.status || 401).json({ ok: false, error: auth.error })
      }

      if (!postId) {
        return res.status(400).json({ ok: false, error: 'post_id is required' })
      }
      const result = await listCommunityReplies(String(postId))
      if (!result.ok) {
        return res.status(result.status || 500).json({ ok: false, error: result.error })
      }
      return res.status(200).json({ ok: true, replies: result.replies, mock: result.mock === true })
    }

    if (req.method === 'POST') {
      const auth = await verifyMemberRequest(req)
      if (!auth.ok) {
        return res.status(auth.status || 401).json({ ok: false, error: auth.error })
      }

      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
      const resolvedPostId = String(body.post_id || body.postId || postId || '').trim()
      const text = String(body.body || '').trim()
      if (!resolvedPostId || !text) {
        return res.status(400).json({ ok: false, error: 'post_id and body are required' })
      }

      const result = await createCommunityReply(auth.userId, { postId: resolvedPostId, body: text })
      if (!result.ok) {
        return res.status(result.status || 500).json({ ok: false, error: result.error })
      }
      return res.status(200).json({ ok: true, reply: result.reply })
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

      const result = await deleteCommunityReply(id)
      if (!result.ok) {
        return res.status(result.status || 500).json({ ok: false, error: result.error })
      }
      return res.status(200).json({ ok: true })
    }

    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  } catch (err) {
    console.error('[community/replies]', err)
    return res.status(500).json({ ok: false, error: 'Server error' })
  }
}
