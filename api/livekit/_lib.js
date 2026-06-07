import { randomUUID } from 'node:crypto'
import {
  EgressClient,
  EncodedFileOutput,
  EncodedFileType,
  EgressStatus,
  S3Upload,
} from 'livekit-server-sdk'
import { getSupabaseAdmin } from '../../server/lib/supabaseAdmin.js'

export function parseBody(req) {
  return typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
}

export function getLiveKitHttpUrl() {
  const url = process.env.LIVEKIT_URL || process.env.VITE_LIVEKIT_URL || null
  if (!url) return null
  return url.replace(/^ws/, 'http')
}

export function getLiveKitCredentials() {
  const apiKey = process.env.LIVEKIT_API_KEY
  const apiSecret = process.env.LIVEKIT_API_SECRET
  const httpUrl = getLiveKitHttpUrl()
  if (!apiKey || !apiSecret || !httpUrl) return null
  return { apiKey, apiSecret, httpUrl }
}

export function getEgressClient() {
  const creds = getLiveKitCredentials()
  if (!creds) return null
  return new EgressClient(creds.httpUrl, creds.apiKey, creds.apiSecret)
}

export function isEgressStorageConfigured() {
  const bucket = process.env.LIVEKIT_EGRESS_S3_BUCKET
  const accessKey = process.env.LIVEKIT_EGRESS_S3_ACCESS_KEY
  const secret = process.env.LIVEKIT_EGRESS_S3_SECRET
  if (bucket && accessKey && secret) return true
  return process.env.LIVEKIT_EGRESS_USE_CLOUD_STORAGE === 'true'
}

export function buildRecordingFileOutput(roomName, recordingId) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const filepath = `recordings/${roomName}/${stamp}-${recordingId.slice(0, 8)}.mp4`

  const bucket = process.env.LIVEKIT_EGRESS_S3_BUCKET
  const accessKey = process.env.LIVEKIT_EGRESS_S3_ACCESS_KEY
  const secret = process.env.LIVEKIT_EGRESS_S3_SECRET
  const region = process.env.LIVEKIT_EGRESS_S3_REGION || 'us-east-1'
  const endpoint = process.env.LIVEKIT_EGRESS_S3_ENDPOINT

  if (bucket && accessKey && secret) {
    const s3 = new S3Upload({
      accessKey,
      secret,
      bucket,
      region,
      ...(endpoint ? { endpoint } : {}),
    })
    return new EncodedFileOutput({
      fileType: EncodedFileType.MP4,
      filepath,
      output: { case: 's3', value: s3 },
    })
  }

  return new EncodedFileOutput({
    fileType: EncodedFileType.MP4,
    filepath,
  })
}

export function playbackUrlFromEgress(info) {
  const file = info?.fileResults?.[0] || info?.file
  return file?.location || null
}

export function filepathFromEgress(info) {
  const file = info?.fileResults?.[0] || info?.file
  return file?.filename || null
}

export function durationFromEgress(info) {
  const file = info?.fileResults?.[0] || info?.file
  if (!file?.duration) return null
  return Math.round(Number(file.duration))
}

export async function verifyAdminRequest(req) {
  const admin = getSupabaseAdmin()

  if (!admin) {
    if (req.headers['x-demo-admin'] === 'true') {
      return { ok: true, userId: 'demo-admin', demo: true }
    }
    return { ok: false, status: 503, error: 'Admin auth not configured' }
  }

  const authHeader = req.headers.authorization || req.headers.Authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return { ok: false, status: 401, error: 'Missing authorization token' }
  }

  const token = authHeader.slice(7)
  const {
    data: { user },
    error,
  } = await admin.auth.getUser(token)
  if (error || !user) {
    return { ok: false, status: 401, error: 'Invalid or expired session' }
  }

  const { data: profile } = await admin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (profile?.role !== 'admin') {
    return { ok: false, status: 403, error: 'Admin access required' }
  }

  return { ok: true, userId: user.id }
}

export function applyCors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Demo-Admin')
}

export function handleOptions(req, res) {
  if (req.method === 'OPTIONS') {
    applyCors(req, res)
    res.status(204).end()
    return true
  }
  return false
}

export async function findActiveRecording(admin, roomName) {
  const { data } = await admin
    .from('session_recordings')
    .select('*')
    .eq('room_name', roomName)
    .in('status', ['starting', 'active', 'processing'])
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  return data
}

export async function syncRecordingFromEgress(admin, egressClient, recording) {
  if (!recording?.egress_id || !egressClient) return recording

  const infos = await egressClient.listEgress({ egressId: recording.egress_id })
  const info = infos?.[0]
  if (!info) return recording

  const patch = {}
  if (info.status === EgressStatus.EGRESS_COMPLETE) {
    patch.status = 'complete'
    patch.playback_url = playbackUrlFromEgress(info)
    patch.filepath = filepathFromEgress(info) || recording.filepath
    patch.duration_seconds = durationFromEgress(info)
    patch.ended_at = new Date().toISOString()
  } else if (
    info.status === EgressStatus.EGRESS_FAILED ||
    info.status === EgressStatus.EGRESS_ABORTED
  ) {
    patch.status = 'failed'
    patch.error_message = info.error || 'Recording failed'
    patch.ended_at = new Date().toISOString()
  } else if (info.status === EgressStatus.EGRESS_ACTIVE) {
    patch.status = 'active'
  }

  if (Object.keys(patch).length === 0) return recording

  const { data } = await admin
    .from('session_recordings')
    .update(patch)
    .eq('id', recording.id)
    .select('*')
    .maybeSingle()
  return data || { ...recording, ...patch }
}

export function newRecordingId() {
  return randomUUID()
}
