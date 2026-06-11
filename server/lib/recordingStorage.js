import { getSupabaseAdmin } from './supabaseAdmin.js'

const DEFAULT_BUCKET = 'session-recordings'
const DEFAULT_REGION = 'us-east-1'
const SIGNED_URL_TTL_SECONDS = 60 * 60 * 24 * 7 // 7 days

function supabaseBaseUrl() {
  return process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || ''
}

function projectRefFromUrl(url) {
  try {
    return new URL(url).hostname.split('.')[0] || null
  } catch {
    return null
  }
}

export function getStorageBucket() {
  return process.env.SUPABASE_STORAGE_BUCKET || process.env.LIVEKIT_EGRESS_S3_BUCKET || DEFAULT_BUCKET
}

/** S3-compatible settings for LiveKit Egress (works with Supabase Storage S3 API). */
export function getEgressS3Config() {
  const accessKey =
    process.env.LIVEKIT_EGRESS_S3_ACCESS_KEY || process.env.SUPABASE_STORAGE_S3_ACCESS_KEY
  const secret =
    process.env.LIVEKIT_EGRESS_S3_SECRET || process.env.SUPABASE_STORAGE_S3_SECRET_KEY
  const bucket = getStorageBucket()
  const baseUrl = supabaseBaseUrl()
  const ref = projectRefFromUrl(baseUrl)
  const endpoint =
    process.env.LIVEKIT_EGRESS_S3_ENDPOINT ||
    process.env.SUPABASE_STORAGE_S3_ENDPOINT ||
    (ref ? `https://${ref}.storage.supabase.co/storage/v1/s3` : null)
  const region =
    process.env.LIVEKIT_EGRESS_S3_REGION ||
    process.env.SUPABASE_STORAGE_S3_REGION ||
    DEFAULT_REGION

  return { accessKey, secret, bucket, endpoint, region }
}

export function isEgressStorageConfigured() {
  const { accessKey, secret, bucket, endpoint } = getEgressS3Config()
  if (accessKey && secret && bucket && endpoint) return true
  return process.env.LIVEKIT_EGRESS_USE_CLOUD_STORAGE === 'true'
}

export function isStoragePublic() {
  return process.env.SUPABASE_STORAGE_PUBLIC === 'true'
}

export function publicStorageObjectUrl(filepath) {
  if (!filepath) return null
  const base = supabaseBaseUrl().replace(/\/$/, '')
  if (!base) return null
  return `${base}/storage/v1/object/public/${getStorageBucket()}/${filepath.replace(/^\//, '')}`
}

export async function createSignedStorageUrl(filepath, expiresIn = SIGNED_URL_TTL_SECONDS) {
  if (!filepath) return null
  const admin = getSupabaseAdmin()
  if (!admin) return null

  const { data, error } = await admin.storage
    .from(getStorageBucket())
    .createSignedUrl(filepath.replace(/^\//, ''), expiresIn)

  if (error) {
    console.warn('[recordingStorage] signed URL failed:', error.message)
    return null
  }
  return data.signedUrl
}

/** Resolve a browser-playable URL for a stored recording object. */
export async function resolveRecordingPlaybackUrl(filepath) {
  if (!filepath) return null
  if (isStoragePublic()) {
    return publicStorageObjectUrl(filepath)
  }
  return createSignedStorageUrl(filepath)
}
