import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  ACTIVITY_PHOTO_MAX_BYTES,
  activityPhotoExtensionMatchesMime,
  createActivityPhotoPath,
  isOwnedActivityPhotoPath,
  validateActivityPhoto,
} from '../lib/activity-photo'
import { getAuthenticatedLandingPath } from '../lib/auth-routing'
import {
  activityStepOrders,
  completedStepOrders,
  setCompletedStepOrder,
} from '../lib/execution-steps'
import {
  relationshipSetupSchema,
  toggleLimitedSelection,
} from '../lib/onboarding'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const source = (path: string) => readFileSync(resolve(root, path), 'utf8')

test('onboarding RPC is a later, retry-safe production migration', () => {
  const migrations = source('supabase/migrations/012_create_solo_relationship_rpc.sql')
  assert.match(migrations, /CREATE OR REPLACE FUNCTION public\.create_solo_relationship/)
  assert.match(migrations, /pg_advisory_xact_lock/)
  assert.match(migrations, /IF EXISTS[\s\S]*public\.relationship_members[\s\S]*RETURN;/)
  assert.match(migrations, /pg_catalog\.to_jsonb\(p_love_languages\)/)
  assert.match(migrations, /pg_catalog\.to_jsonb\(p_interests\)/)
  assert.match(migrations, /REVOKE ALL[\s\S]*FROM PUBLIC/)
  assert.match(migrations, /GRANT EXECUTE[\s\S]*TO authenticated/)
  assert.throws(() => source('supabase/migrations/009_create_solo_relationship_rpc.sql'))
})

test('fresh authenticated users land on onboarding and members retain safe redirects', () => {
  assert.equal(getAuthenticatedLandingPath(false, '/plans/123'), '/onboarding')
  assert.equal(getAuthenticatedLandingPath(true, null), '/dashboard')
  assert.equal(getAuthenticatedLandingPath(true, '/plans/123'), '/plans/123')
  assert.equal(getAuthenticatedLandingPath(true, '//example.com'), '/dashboard')
  assert.equal(getAuthenticatedLandingPath(true, 'https://example.com'), '/dashboard')

  const login = source('app/actions/auth.ts')
  const dashboard = source('app/dashboard/page.tsx')
  assert.match(login, /from\('relationship_members'\)/)
  assert.match(login, /getAuthenticatedLandingPath/)
  assert.match(dashboard, /from\('relationship_members'\)/)
  assert.match(dashboard, /if \(!membership\)[\s\S]*redirect\('\/onboarding'\)/)
})

test('floating check-in link points only at the real route', () => {
  const floating = source('components/ui/floating-checkin.tsx')
  assert.match(floating, /href="\/check-in"/)
  assert.doesNotMatch(floating, /check-in\/new/)
})

test('activity photos use private execution ownership end to end', () => {
  const migration = source('supabase/migrations/011_add_image_to_activities.sql')
  assert.match(migration, /ALTER TABLE public\.plan_executions[\s\S]*activity_photo_path TEXT/)
  assert.doesNotMatch(migration, /ALTER TABLE public\.activities[\s\S]*image_url/)
  assert.match(migration, /'activity_images',[\s\S]*false,[\s\S]*5242880/)
  assert.match(migration, /ARRAY\['image\/jpeg', 'image\/png', 'image\/webp'\]/)
  assert.match(migration, /FOR SELECT[\s\S]*execution\.user_id = \(SELECT auth\.uid\(\)\)/)
  assert.match(migration, /FOR INSERT[\s\S]*execution\.user_id = \(SELECT auth\.uid\(\)\)/)
  assert.match(migration, /FOR DELETE[\s\S]*execution\.user_id = \(SELECT auth\.uid\(\)\)/)
  assert.doesNotMatch(
    migration,
    /CREATE POLICY "Activity[^"]+"\s+ON storage\.objects\s+FOR UPDATE/,
  )

  const page = source('app/(main)/activities/[planId]/page.tsx')
  const view = source('components/activities/ActivityView.tsx')
  assert.match(page, /execution\.activity_photo_path/)
  assert.match(page, /createSignedUrl/)
  assert.match(page, /initialPhotoUrl=\{initialPhotoUrl\}/)
  assert.match(view, /type="file"/)
  assert.match(view, /aria-label="Chọn ảnh hoạt động"/)
  assert.match(view, /useState<string \| null>\(initialPhotoUrl\)/)
})

test('activity photo validation, paths, and limits reject invalid uploads', () => {
  assert.equal(validateActivityPhoto({ type: 'image/jpeg', size: 1024 }), null)
  assert.equal(validateActivityPhoto({ type: 'image/png', size: ACTIVITY_PHOTO_MAX_BYTES }), null)
  assert.match(validateActivityPhoto({ type: 'image/gif', size: 1024 }) ?? '', /JPEG/)
  assert.match(validateActivityPhoto({ type: 'image/webp', size: 0 }) ?? '', /không có nội dung/)
  assert.match(
    validateActivityPhoto({ type: 'image/webp', size: ACTIVITY_PHOTO_MAX_BYTES + 1 }) ?? '',
    /5 MB/,
  )

  const userId = '00000000-0000-0000-0000-000000000001'
  const executionId = '00000000-0000-0000-0000-000000000002'
  const objectId = 'abcdef01-0000-0000-0000-000000000003'
  const path = createActivityPhotoPath(userId, executionId, 'image/webp', objectId)
  assert.equal(path, `${userId}/${executionId}/${objectId}.webp`)
  assert.equal(isOwnedActivityPhotoPath(path, userId, executionId), true)
  assert.equal(isOwnedActivityPhotoPath(path, `${userId}-other`, executionId), false)
  assert.equal(isOwnedActivityPhotoPath(`${userId}/${executionId}/../x.webp`, userId, executionId), false)
  assert.equal(activityPhotoExtensionMatchesMime(path, 'image/webp'), true)
  assert.equal(activityPhotoExtensionMatchesMime(path, 'image/png'), false)
})

test('step completion and deselection helpers are idempotent', () => {
  assert.deepEqual(setCompletedStepOrder([1], 2, true), [1, 2])
  assert.deepEqual(setCompletedStepOrder([1, 2], 2, true), [1, 2])
  assert.deepEqual(setCompletedStepOrder([1, 2, 3], 2, false), [1, 3])
  assert.deepEqual(setCompletedStepOrder([1, 3], 2, false), [1, 3])
  assert.deepEqual(completedStepOrders([{ step_id: 2 }, { step_id: 2 }, { step_id: 3 }]), [2, 3])
  assert.deepEqual(activityStepOrders([{}, { order: 4 }]), [1, 4])

  const action = source('app/actions/executions.ts')
  const migration = source('supabase/migrations/011_add_image_to_activities.sql')
  assert.match(action, /p_completed: completed/)
  assert.match(migration, /set_plan_execution_step_completion/)
  assert.match(migration, /WHERE item\.value->>'step_id' IS DISTINCT FROM p_step_order::TEXT/)
})

test('long dashboard emails are constrained on mobile', () => {
  const dashboard = source('app/dashboard/page.tsx')
  assert.match(dashboard, /flex w-full min-w-0/)
  assert.match(dashboard, /min-w-0 truncate text-sm/)
  assert.match(dashboard, /className="shrink-0"/)
})

test('authenticated pages have a main landmark and repaired orange contrast', () => {
  const layout = source('app/(main)/layout.tsx')
  const plans = source('app/(main)/plans/[goalId]/page.tsx')
  const card = source('components/plans/PlanCard.tsx')
  assert.match(layout, /<main id="main-content">\{children\}<\/main>/)
  assert.match(plans, /text-orange-700/)
  assert.match(card, /text-orange-700 hover:text-orange-800/)
  assert.match(card, /bg-orange-700 hover:bg-orange-800 text-white/)
})

test('onboarding enforces the stated three-to-five interests in schema and controls', () => {
  const valid = {
    relationshipType: 'new',
    city: 'hanoi',
    loveLanguages: ['quality_time'],
    interests: ['coffee', 'art', 'food'],
  }
  assert.equal(relationshipSetupSchema.safeParse(valid).success, true)
  assert.equal(relationshipSetupSchema.safeParse({ ...valid, interests: ['coffee'] }).success, false)
  assert.equal(
    relationshipSetupSchema.safeParse({
      ...valid,
      interests: ['coffee', 'art', 'food', 'nature', 'music', 'sports'],
    }).success,
    false,
  )
  assert.deepEqual(toggleLimitedSelection(['a', 'b', 'c', 'd', 'e'], 'f', 5), ['a', 'b', 'c', 'd', 'e'])

  const onboarding = source('app/(auth)/onboarding/page.tsx')
  assert.match(onboarding, /Chọn 3-5 sở thích/)
  assert.match(onboarding, /disabled=\{interests\.length < 3 \|\| interests\.length > 5 \|\| loading\}/)
  assert.match(onboarding, /disabled=\{interests\.length >= 5 && !interests\.includes\(interest\.id\)\}/)
})
