import assert from 'node:assert/strict'
import test from 'node:test'

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
  createStepCompletionController,
  setCompletedStepOrder,
} from '../lib/execution-steps'
import {
  relationshipSetupSchema,
  toggleLimitedSelection,
} from '../lib/onboarding'

test('fresh authenticated users land on onboarding and members retain safe redirects', () => {
  assert.equal(getAuthenticatedLandingPath(false, '/plans/123'), '/onboarding')
  assert.equal(getAuthenticatedLandingPath(true, null), '/dashboard')
  assert.equal(getAuthenticatedLandingPath(true, '/plans/123'), '/plans/123')
  assert.equal(getAuthenticatedLandingPath(true, '//example.com'), '/dashboard')
  assert.equal(getAuthenticatedLandingPath(true, 'https://example.com'), '/dashboard')
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
})

test('step mutations serialize and the latest optimistic intent wins', async () => {
  const calls: Array<{ completed: boolean; release: () => void }> = []
  const published: number[][] = []
  const controller = createStepCompletionController(
    [],
    (_stepOrder, completed) => new Promise((resolve) => {
      calls.push({ completed, release: () => resolve({ completedSteps: completed ? [1] : [] }) })
    }),
    (steps) => published.push(steps),
  )

  const select = controller.toggle(1)
  const deselect = controller.toggle(1)
  assert.deepEqual(published, [[1], []])
  assert.equal(calls.length, 0)
  await Promise.resolve()
  assert.equal(calls.length, 1)
  assert.equal(calls[0].completed, true)
  calls[0].release()
  await assert.doesNotReject(async () => {
    for (let attempt = 0; attempt < 10 && calls.length < 2; attempt += 1) {
      await new Promise<void>((resolve) => setImmediate(resolve))
    }
    assert.equal(calls.length, 2)
  })
  assert.equal(calls.length, 2)
  assert.equal(calls[1].completed, false)
  calls[1].release()
  await Promise.all([select, deselect])
  assert.deepEqual(published.at(-1), [])
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
})
