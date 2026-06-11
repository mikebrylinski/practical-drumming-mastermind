import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { MembersCard } from '../../components/members/MembersCard'
import { MembersLayout } from '../../components/members/MembersLayout'
import { useAuth } from '../../lib/auth/AuthProvider'
import {
  removeAvatar,
  saveProfileContact,
  uploadAvatar,
  validateAvatarFile,
} from '../../lib/profile/saveProfile'
import { isSupabaseConfigured } from '../../lib/supabase/client'

const inputClass =
  'w-full rounded-lg border border-white/12 bg-charcoal/40 px-4 py-2.5 font-garamond text-mist placeholder:text-mist/35 outline-none transition focus:border-gold/45'

const labelClass = 'font-garamond text-xs tracking-[0.18em] text-mist/45 uppercase'

const goldBtn =
  'inline-flex min-h-11 min-w-[9rem] items-center justify-center rounded-full bg-gold px-6 font-garamond text-sm tracking-[0.16em] uppercase text-void transition hover:bg-gold/90 disabled:opacity-50'

const ghostBtn =
  'inline-flex min-h-11 min-w-[9rem] items-center justify-center rounded-full border border-white/15 px-5 font-garamond text-sm tracking-[0.14em] text-mist/70 uppercase transition hover:border-gold/35 hover:text-gold disabled:opacity-50'

function initialsFromName(name: string, email: string): string {
  const source = name.trim() || email.trim()
  if (!source) return '?'
  const parts = source.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  return source.slice(0, 2).toUpperCase()
}

export function ProfilePage() {
  const {
    profile,
    session,
    useSeedData,
    mockMode,
    role,
    setMockRole,
    signOut,
    seedSignInAsAdmin,
    refreshProfile,
    setLocalProfile,
  } = useAuth()
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [removePhoto, setRemovePhoto] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    setFullName(profile?.full_name ?? '')
    setPhone(profile?.phone ?? '')
    setLocation(profile?.location ?? '')
    setBio(profile?.bio ?? '')
    setAvatarUrl(profile?.avatar_url ?? null)
    setPendingFile(null)
    setPreviewUrl(null)
    setRemovePhoto(false)
  }, [profile])

  useEffect(() => {
    if (!pendingFile) {
      setPreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(pendingFile)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [pendingFile])

  const displayAvatar = previewUrl || (removePhoto ? null : avatarUrl)
  const initials = useMemo(
    () => initialsFromName(fullName, profile?.email ?? ''),
    [fullName, profile?.email],
  )
  const canPersist = isSupabaseConfigured && !useSeedData && Boolean(session?.user?.id)

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const validation = validateAvatarFile(file)
    if (validation) {
      setError(validation)
      return
    }
    setError(null)
    setPendingFile(file)
    setRemovePhoto(false)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    setNotice(null)

    const input = {
      full_name: fullName,
      phone,
      location,
      bio,
    }

    if (!fullName.trim()) {
      setBusy(false)
      setError('Name is required.')
      return
    }

    if (useSeedData || mockMode) {
      setLocalProfile({
        ...input,
        avatar_url: removePhoto ? null : previewUrl || avatarUrl,
      })
      setPendingFile(null)
      setRemovePhoto(false)
      setBusy(false)
      setNotice('Profile updated (demo mode — not saved to a database).')
      return
    }

    const userId = session?.user?.id
    if (!userId) {
      setBusy(false)
      setError('You must be signed in to update your profile.')
      return
    }

    let nextAvatarUrl: string | null | undefined = undefined

    if (removePhoto) {
      const removed = await removeAvatar(userId)
      if (removed.error) {
        setBusy(false)
        setError(removed.error)
        return
      }
      nextAvatarUrl = null
    } else if (pendingFile) {
      const uploaded = await uploadAvatar(userId, pendingFile)
      if (uploaded.error || !uploaded.url) {
        setBusy(false)
        setError(uploaded.error ?? 'Could not upload photo.')
        return
      }
      nextAvatarUrl = uploaded.url
    }

    const saved = await saveProfileContact(userId, input, nextAvatarUrl)
    setBusy(false)

    if (saved.error || !saved.profile) {
      setError(saved.error ?? 'Could not save profile.')
      return
    }

    setLocalProfile(saved.profile)
    await refreshProfile()
    setPendingFile(null)
    setRemovePhoto(false)
    setNotice('Profile saved.')
  }

  async function handleSignOut() {
    await signOut()
    navigate('/', { replace: true })
  }

  return (
    <MembersLayout activeId="settings">
      <div className="mx-auto w-full max-w-md px-1 sm:px-0">
        <header className="mb-6 text-center sm:mb-8">
          <p className="font-garamond text-xs tracking-[0.28em] text-gold uppercase">Account</p>
          <h1 className="mt-2 font-bebas text-3xl tracking-wide text-mist md:text-4xl">Your profile</h1>
          <p className="mx-auto mt-2 max-w-sm font-garamond text-sm leading-relaxed text-mist/55">
            Photo and contact details for the mastermind club.
          </p>
        </header>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <MembersCard>
            <div className="flex flex-col items-center text-center">
              <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-gold/25 bg-charcoal/80 shadow-[0_0_0_1px_rgba(201,165,92,0.15)] sm:h-32 sm:w-32">
                {displayAvatar ? (
                  <img src={displayAvatar} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gold/15 font-bebas text-3xl tracking-wide text-gold">
                    {initials}
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  className={ghostBtn}
                  onClick={() => fileRef.current?.click()}
                  disabled={busy}
                >
                  {displayAvatar ? 'Change photo' : 'Upload photo'}
                </button>
                {displayAvatar ? (
                  <button
                    type="button"
                    className={ghostBtn}
                    disabled={busy}
                    onClick={() => {
                      setPendingFile(null)
                      setRemovePhoto(true)
                      setError(null)
                    }}
                  >
                    Remove
                  </button>
                ) : null}
              </div>

              <p className="mt-3 font-garamond text-xs text-mist/40">
                JPG, PNG, WebP, or GIF · 5 MB max
              </p>

              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleFileChange}
              />

              {role ? (
                <span className="mt-4 inline-flex rounded-full border border-gold/25 bg-gold/10 px-3 py-1 font-garamond text-[0.65rem] tracking-[0.18em] text-gold uppercase">
                  {role}
                </span>
              ) : null}
            </div>

            <div className="mt-8 space-y-4 border-t border-white/[0.06] pt-6">
              <div>
                <label className={labelClass} htmlFor="profile-name">
                  Full name
                </label>
                <input
                  id="profile-name"
                  className={`${inputClass} mt-2`}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoComplete="name"
                  required
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="profile-email">
                  Email
                </label>
                <input
                  id="profile-email"
                  className={`${inputClass} mt-2 opacity-70`}
                  value={profile?.email ?? ''}
                  readOnly
                  aria-readonly="true"
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="profile-phone">
                  Phone
                </label>
                <input
                  id="profile-phone"
                  className={`${inputClass} mt-2`}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  placeholder="Optional"
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="profile-location">
                  Location
                </label>
                <input
                  id="profile-location"
                  className={`${inputClass} mt-2`}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  autoComplete="address-level2"
                  placeholder="City, state / country"
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="profile-bio">
                  Bio
                </label>
                <textarea
                  id="profile-bio"
                  className={`${inputClass} mt-2 min-h-24 resize-y`}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="A short note about your drumming goals or background"
                  maxLength={500}
                />
              </div>
            </div>
          </MembersCard>

          {error ? (
            <p className="text-center font-garamond text-sm text-red-400/90">{error}</p>
          ) : null}
          {notice ? (
            <p className="text-center font-garamond text-sm text-gold/90">{notice}</p>
          ) : null}

          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
            <button type="submit" className={`${goldBtn} w-full sm:w-auto`} disabled={busy}>
              {busy ? 'Saving…' : canPersist ? 'Save profile' : 'Save (demo)'}
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className={`${ghostBtn} w-full sm:w-auto`}
            >
              Sign out
            </button>
          </div>

          {useSeedData && !seedSignInAsAdmin ? (
            <MembersCard className="text-center">
              <p className="font-garamond text-xs tracking-[0.2em] text-gold uppercase">
                Demo role switch
              </p>
              <div className="mt-3 flex justify-center gap-2">
                {(['member', 'admin'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setMockRole(r)}
                    className={`rounded-full px-4 py-1.5 font-garamond text-sm uppercase tracking-[0.14em] transition ${
                      role === r
                        ? 'bg-gold/20 text-gold ring-1 ring-gold/40'
                        : 'bg-white/5 text-mist/55 hover:text-mist'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </MembersCard>
          ) : null}
        </form>
      </div>
    </MembersLayout>
  )
}
