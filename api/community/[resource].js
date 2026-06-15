import communityPostsHandler from '../../server/lib/routes/communityPosts.js'
import communityRepliesHandler from '../../server/lib/routes/communityReplies.js'

const routes = {
  posts: communityPostsHandler,
  replies: communityRepliesHandler,
}

export default async function handler(req, res) {
  const route = routes[req.query?.resource]
  if (!route) {
    return res.status(404).json({ ok: false, error: 'Unknown community resource' })
  }
  return route(req, res)
}
