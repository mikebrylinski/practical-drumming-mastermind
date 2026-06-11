#!/usr/bin/env node
/**
 * Seed cohorts + the next N weeks of weekly live sessions into Supabase.
 * Idempotent: skips cohorts/sessions that already exist.
 *
 * Usage: node --env-file-if-exists=.env scripts/seed-cohort-sessions.mjs
 *        WEEKS=6 node --env-file-if-exists=.env scripts/seed-cohort-sessions.mjs
 */
import { createClient } from '@supabase/supabase-js'
import {
  COHORT_DEFINITIONS,
  buildUpcomingWeeklySessions,
} from './lib/cohortSchedule.mjs'

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const weeks = Number(process.env.WEEKS) || 6

if (!url || !serviceKey) {
  console.error('Missing SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env')
  process.exit(1)
}

const admin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

async function ensureCohort(def) {
  const { data: existing } = await admin
    .from('cohorts')
    .select('id, name')
    .eq('livekit_room_name', def.room)
    .maybeSingle()

  if (existing?.id) {
    console.log(`  cohort exists: ${existing.name}`)
    return existing.id
  }

  const startsAt = new Date(Date.now() - def.startsDaysAgo * 864e5).toISOString()
  const { data: inserted, error } = await admin
    .from('cohorts')
    .insert({
      name: def.name,
      description: def.description,
      starts_at: startsAt,
      livekit_room_name: def.room,
    })
    .select('id')
    .single()

  if (error || !inserted) {
    throw new Error(`Failed to create cohort ${def.name}: ${error?.message || 'unknown'}`)
  }
  console.log(`  created cohort: ${def.name}`)
  return inserted.id
}

async function ensureSessions(cohortId, def) {
  const planned = buildUpcomingWeeklySessions(def, weeks)
  let added = 0
  let skipped = 0

  for (const row of planned) {
    const { data: dup } = await admin
      .from('sessions')
      .select('id')
      .eq('cohort_id', cohortId)
      .eq('scheduled_at', row.scheduled_at)
      .maybeSingle()

    if (dup?.id) {
      skipped += 1
      continue
    }

    const { error } = await admin.from('sessions').insert({
      cohort_id: cohortId,
      title: row.title,
      scheduled_at: row.scheduled_at,
      livekit_room_name: row.livekit_room_name,
    })

    if (error) {
      throw new Error(`Failed to insert session ${row.title}: ${error.message}`)
    }
    added += 1
  }

  console.log(`  sessions: +${added} new, ${skipped} already scheduled`)
}

async function main() {
  console.log(`Seeding cohorts + next ${weeks} weekly sessions…`)
  for (const def of COHORT_DEFINITIONS) {
    console.log(`\n${def.name}`)
    const cohortId = await ensureCohort(def)
    await ensureSessions(cohortId, def)
  }
  console.log('\nDone.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
