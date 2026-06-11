import { supabase } from '../supabase/client'
import type { Profile } from '../supabase/types'

export const PROFILE_FIELDS =
  'id, email, full_name, role, avatar_url, phone, location, bio, created_at'

export type ProfileContactInput = {
  full_name: string
  phone: string
  location: string
  bio: string
}

const AVATAR_BUCKET = 'avatars'
const MAX_AVATAR_BYTES = 5 * 1024 * 1024
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

function extForFile(file: File): string {
  const fromName = file.name.split('.').pop()?.toLowerCase()
  if (fromName && ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(fromName)) {
    return fromName === 'jpeg' ? 'jpg' : fromName
  }
  if (file.type === 'image/jpeg') return 'jpg'
  if (file.type === 'image/png') return 'png'
  if (file.type === 'image/webp') return 'webp'
  if (file.type === 'image/gif') return 'gif'
  return 'jpg'
}

export function validateAvatarFile(file: File): string | null {
  if (!ALLOWED_TYPES.has(file.type)) {
    return 'Use a JPG, PNG, WebP, or GIF image.'
  }
  if (file.size > MAX_AVATAR_BYTES) {
    return 'Image must be 5 MB or smaller.'
  }
  return null
}

export async function uploadAvatar(
  userId: string,
  file: File,
): Promise<{ url: string | null; error: string | null }> {
  if (!supabase) return { url: null, error: 'Supabase is not configured.' }

  const validation = validateAvatarFile(file)
  if (validation) return { url: null, error: validation }

  const path = `${userId}/avatar.${extForFile(file)}`
  const { error } = await supabase.storage.from(AVATAR_BUCKET).upload(path, file, {
    upsert: true,
    contentType: file.type,
    cacheControl: '3600',
  })

  if (error) return { url: null, error: error.message }

  const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path)
  return { url: `${data.publicUrl}?t=${Date.now()}`, error: null }
}

export async function removeAvatar(userId: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Supabase is not configured.' }

  const { data, error: listError } = await supabase.storage.from(AVATAR_BUCKET).list(userId)
  if (listError) return { error: listError.message }

  const paths = (data ?? []).map((obj) => `${userId}/${obj.name}`)
  if (paths.length > 0) {
    const { error } = await supabase.storage.from(AVATAR_BUCKET).remove(paths)
    if (error) return { error: error.message }
  }

  return { error: null }
}

export async function saveProfileContact(
  userId: string,
  input: ProfileContactInput,
  avatarUrl?: string | null,
): Promise<{ profile: Profile | null; error: string | null }> {
  if (!supabase) return { profile: null, error: 'Supabase is not configured.' }

  const patch: Record<string, string | null> = {
    full_name: input.full_name.trim(),
    phone: input.phone.trim() || null,
    location: input.location.trim() || null,
    bio: input.bio.trim() || null,
  }

  if (avatarUrl !== undefined) {
    patch.avatar_url = avatarUrl
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(patch)
    .eq('id', userId)
    .select(PROFILE_FIELDS)
    .maybeSingle()

  if (error) return { profile: null, error: error.message }
  return { profile: (data as Profile) ?? null, error: null }
}
