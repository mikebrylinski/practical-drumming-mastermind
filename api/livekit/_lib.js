import { randomUUID } from 'node:crypto'
import {
  EgressClient,
  EncodedFileOutput,
  EncodedFileType,
  EgressStatus,
  S3Upload,
} from 'livekit-server-sdk'
import { getSupabaseAdmin } from '../../server/lib/supabaseAdmin.js'
import { resolveAdminFromRequest } from '../../server/lib/authRequest.js'
import {
  getEgressS3Config,
  isEgressStorageConfigured,
  resolveRecordingPlaybackUrl,
} from '../../server/lib/recordingStorage.js'

export { isEgressStorageConfigured }

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

export function buildRecordingFileOutput(roomName, recordingId) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const filepath = `recordings/${roomName}/${stamp}-${recordingId.slice(0, 8)}.mp4`

  const { accessKey, secret, bucket, endpoint, region } = getEgressS3Config()
  if (accessKey && secret && bucket && endpoint) {
    const s3 = new S3Upload({
      accessKey,
      secret,
      bucket,
      region,
      endpoint,
      // Supabase S3 API requires path-style URLs; virtual-hosted style causes TLS failures.
      forcePathStyle: true,
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

/** Returns whether the caller is an admin (for UI flags). Does not reject the request. */
export async function resolveIsAdminFromRequest(req) {
  if (!getSupabaseAdmin()) {
    return req.headers['x-demo-admin'] === 'true'
  }
  const result = await resolveAdminFromRequest(req)
  return result.ok
}

export async function verifyAdminRequest(req) {
  if (!getSupabaseAdmin()) {
    if (req.headers['x-demo-admin'] === 'true') {
      return { ok: true, userId: 'demo-admin', demo: true }
    }
    return { ok: false, status: 503, error: 'Admin auth not configured' }
  }

  const result = await resolveAdminFromRequest(req)
  if (!result.ok || !result.user) {
    const status =
      result.error === 'Admin access required'
        ? 403
        : result.error === 'Missing authorization token'
          ? 401
          : 401
    return { ok: false, status, error: result.error || 'Unauthorized' }
  }

  return { ok: true, userId: result.user.id }
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

  if (patch.status === 'complete' && patch.filepath) {
    patch.playback_url =
      (await resolveRecordingPlaybackUrl(patch.filepath)) || patch.playback_url
  }

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
