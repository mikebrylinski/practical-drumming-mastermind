#!/usr/bin/env node
/**
 * Verify LiveKit egress → Supabase Storage S3 config.
 * Usage: node --env-file-if-exists=.env scripts/check-storage.mjs
 */
import { getEgressS3Config, isEgressStorageConfigured } from '../server/lib/recordingStorage.js'

const missing = []
const { accessKey, secret, bucket, endpoint, region } = getEgressS3Config()

if (!bucket) missing.push('SUPABASE_STORAGE_BUCKET')
if (!endpoint) missing.push('SUPABASE_URL (for auto endpoint) or SUPABASE_STORAGE_S3_ENDPOINT')
if (!accessKey) missing.push('SUPABASE_STORAGE_S3_ACCESS_KEY')
if (!secret) missing.push('SUPABASE_STORAGE_S3_SECRET_KEY')

console.log('Recording storage check')
console.log('  bucket:  ', bucket || '(missing)')
console.log('  endpoint:', endpoint || '(missing)')
console.log('  region:  ', region)
console.log('  access:  ', accessKey ? `${accessKey.slice(0, 8)}…` : '(missing)')
console.log('  secret:  ', secret ? 'set' : '(missing)')

if (isEgressStorageConfigured()) {
  console.log('\n✓ Egress storage is configured')
  process.exit(0)
}

console.error('\n✗ Egress storage is NOT configured')
if (missing.length) {
  console.error('Missing:', missing.join(', '))
}
console.error('\nCreate S3 keys: Supabase Dashboard → Project Settings → Storage → S3 Connection')
console.error('Then add SUPABASE_STORAGE_S3_ACCESS_KEY and SUPABASE_STORAGE_S3_SECRET_KEY to .env and Vercel.')
process.exit(1)
