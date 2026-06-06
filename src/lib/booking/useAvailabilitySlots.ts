import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../auth/AuthProvider'
import { supabase } from '../supabase/client'
import { loadSlots as loadStoredSlots } from './slotStore'
import type { AvailabilitySlot } from '../supabase/types'

export function dayKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

export function useAvailabilitySlots(slug: string) {
  const { useSeedData } = useAuth()
  const [slots, setSlots] = useState<AvailabilitySlot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function load() {
      if (useSeedData || !supabase) {
        if (active) {
          const now = Date.now()
          setSlots(
            loadStoredSlots().filter(
              (s) =>
                s.slug === slug &&
                !s.is_booked &&
                new Date(s.starts_at).getTime() >= now,
            ),
          )
          setLoading(false)
        }
        return
      }
      const { data } = await supabase
        .from('availability_slots')
        .select('*')
        .eq('slug', slug)
        .eq('is_booked', false)
        .gte('starts_at', new Date().toISOString())
        .order('starts_at', { ascending: true })
      if (!active) return
      setSlots((data as AvailabilitySlot[]) ?? [])
      setLoading(false)
    }
    void load()
    return () => {
      active = false
    }
  }, [slug, useSeedData])

  const slotsByDay = useMemo(() => {
    const map = new Map<string, AvailabilitySlot[]>()
    for (const s of slots) {
      const key = dayKey(new Date(s.starts_at))
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(s)
    }
    for (const list of map.values()) {
      list.sort((a, b) => a.starts_at.localeCompare(b.starts_at))
    }
    return map
  }, [slots])

  return { slots, slotsByDay, loading }
}
