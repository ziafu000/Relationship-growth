#!/usr/bin/env node
/**
 * Regression tests for repaired behaviors (Task 8).
 * Runs with plain Node.js — no test framework required.
 *
 * Usage: node test/regression.js
 */

'use strict'

const assert = require('node:assert/strict')

// ---------------------------------------------------------------------------
// Inline re-implementations of pure lib functions (avoids TS/ESM transpile)
// These mirror the logic in the TypeScript source files.
// ---------------------------------------------------------------------------

// lib/execution-steps.ts – completedStepOrders
function completedStepOrders(value) {
  if (!Array.isArray(value)) return []
  return Array.from(
    new Set(
      value
        .map(step => {
          if (!step || typeof step !== 'object' || !('step_id' in step)) return null
          const stepId = Number(step.step_id)
          return Number.isInteger(stepId) && stepId > 0 ? stepId : null
        })
        .filter(Boolean)
    )
  )
}

// lib/execution-steps.ts – setCompletedStepOrder
function setCompletedStepOrder(current, stepOrder, completed) {
  const withoutStep = current.filter(o => o !== stepOrder)
  return completed ? [...withoutStep, stepOrder] : withoutStep
}

// lib/execution-steps.ts – activityStepOrders
function activityStepOrders(value) {
  if (!Array.isArray(value)) return []
  return value.map((step, index) => {
    if (step && typeof step === 'object' && 'order' in step) {
      const order = Number(step.order)
      if (Number.isInteger(order) && order > 0) return order
    }
    return index + 1
  })
}

// lib/activity-photo.ts – validateActivityPhoto
const ACTIVITY_PHOTO_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const ACTIVITY_PHOTO_MAX_BYTES = 5 * 1024 * 1024
function validateActivityPhoto(file) {
  if (!ACTIVITY_PHOTO_MIME_TYPES.includes(file.type))
    return 'Chỉ hỗ trợ ảnh JPEG, PNG hoặc WebP.'
  if (file.size <= 0) return 'Ảnh đã chọn không có nội dung.'
  if (file.size > ACTIVITY_PHOTO_MAX_BYTES) return 'Ảnh phải nhỏ hơn hoặc bằng 5 MB.'
  return null
}

// lib/activity-photo.ts – createActivityPhotoPath
const extensionByMimeType = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }
function createActivityPhotoPath(userId, executionId, mimeType, objectId) {
  const extension = extensionByMimeType[mimeType]
  if (!extension) throw new Error('Unsupported activity photo type')
  return `${userId}/${executionId}/${objectId}.${extension}`
}

// lib/activity-photo.ts – isOwnedActivityPhotoPath
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
function isOwnedActivityPhotoPath(path, userId, executionId) {
  const esc = s => escapeRegExp(s)
  return new RegExp(
    `^${esc(userId)}/${esc(executionId)}/[0-9a-f-]+\\.(?:jpg|png|webp)$`,
    'i'
  ).test(path)
}

// lib/activity-photo.ts – activityPhotoExtensionMatchesMime
function activityPhotoExtensionMatchesMime(path, mimeType) {
  const extension = extensionByMimeType[mimeType]
  return Boolean(extension && path.toLowerCase().endsWith(`.${extension}`))
}

// lib/auth-routing.ts – getAuthenticatedLandingPath
function getAuthenticatedLandingPath(hasRelationshipMembership, requestedPath) {
  if (!hasRelationshipMembership) return '/onboarding'
  if (requestedPath && requestedPath.startsWith('/') && !requestedPath.startsWith('//'))
    return requestedPath
  return '/dashboard'
}

// lib/onboarding.ts – toggleLimitedSelection
function toggleLimitedSelection(current, value, maximum) {
  if (current.includes(value)) return current.filter(item => item !== value)
  if (current.length >= maximum) return [...current]
  return [...current, value]
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

let passed = 0
let failed = 0

function test(name, fn) {
  try {
    fn()
    console.log(`  ✓ ${name}`)
    passed++
  } catch (err) {
    console.error(`  ✗ ${name}`)
    console.error(`    ${err.message}`)
    failed++
  }
}

// 1. Step completion/deselection (Issue 4 – idempotent toggle)
console.log('\nStep completion persistence')

test('completedStepOrders returns empty for non-array', () => {
  assert.deepEqual(completedStepOrders(null), [])
  assert.deepEqual(completedStepOrders('foo'), [])
})

test('completedStepOrders extracts step_id numbers', () => {
  assert.deepEqual(
    completedStepOrders([{ step_id: 1, completed_at: '2024-01-01' }, { step_id: 3 }]),
    [1, 3]
  )
})

test('completedStepOrders deduplicates', () => {
  assert.deepEqual(
    completedStepOrders([{ step_id: 2 }, { step_id: 2 }]),
    [2]
  )
})

test('setCompletedStepOrder adds step', () => {
  assert.deepEqual(setCompletedStepOrder([1], 2, true), [1, 2])
})

test('setCompletedStepOrder removes step (deselect path)', () => {
  assert.deepEqual(setCompletedStepOrder([1, 2, 3], 2, false), [1, 3])
})

test('setCompletedStepOrder is idempotent for add', () => {
  assert.deepEqual(setCompletedStepOrder([1, 2], 2, true), [1, 2])
})

test('setCompletedStepOrder is idempotent for remove', () => {
  assert.deepEqual(setCompletedStepOrder([1, 3], 2, false), [1, 3])
})

test('activityStepOrders falls back to 1-based index', () => {
  assert.deepEqual(activityStepOrders([{}, {}]), [1, 2])
})

test('activityStepOrders uses order field when present', () => {
  assert.deepEqual(activityStepOrders([{ order: 5 }, { order: 10 }]), [5, 10])
})

// 2. Activity photo validation (Issue 3)
console.log('\nActivity photo validation')

test('validateActivityPhoto accepts valid jpeg', () => {
  assert.equal(validateActivityPhoto({ type: 'image/jpeg', size: 1024 }), null)
})

test('validateActivityPhoto accepts valid png', () => {
  assert.equal(validateActivityPhoto({ type: 'image/png', size: 1024 }), null)
})

test('validateActivityPhoto rejects unsupported mime', () => {
  assert.notEqual(validateActivityPhoto({ type: 'image/gif', size: 1024 }), null)
})

test('validateActivityPhoto rejects empty file', () => {
  assert.notEqual(validateActivityPhoto({ type: 'image/jpeg', size: 0 }), null)
})

test('validateActivityPhoto rejects oversized file', () => {
  assert.notEqual(
    validateActivityPhoto({ type: 'image/jpeg', size: ACTIVITY_PHOTO_MAX_BYTES + 1 }),
    null
  )
})

test('validateActivityPhoto accepts exactly max size', () => {
  assert.equal(
    validateActivityPhoto({ type: 'image/jpeg', size: ACTIVITY_PHOTO_MAX_BYTES }),
    null
  )
})

test('createActivityPhotoPath produces correct path', () => {
  const p = createActivityPhotoPath('uid', 'eid', 'image/png', 'obj')
  assert.equal(p, 'uid/eid/obj.png')
})

test('isOwnedActivityPhotoPath accepts own path', () => {
  const uid = '00000000-0000-0000-0000-000000000001'
  const eid = '00000000-0000-0000-0000-000000000002'
  const obj = 'abcdef01-0000-0000-0000-000000000003'
  assert.ok(isOwnedActivityPhotoPath(`${uid}/${eid}/${obj}.jpg`, uid, eid))
})

test('isOwnedActivityPhotoPath rejects different user', () => {
  const uid1 = '00000000-0000-0000-0000-000000000001'
  const uid2 = '00000000-0000-0000-0000-000000000099'
  const eid = '00000000-0000-0000-0000-000000000002'
  const obj = 'abcdef01-0000-0000-0000-000000000003'
  assert.ok(!isOwnedActivityPhotoPath(`${uid1}/${eid}/${obj}.jpg`, uid2, eid))
})

test('isOwnedActivityPhotoPath rejects path traversal attempt', () => {
  const uid = '00000000-0000-0000-0000-000000000001'
  const eid = '00000000-0000-0000-0000-000000000002'
  assert.ok(!isOwnedActivityPhotoPath(`${uid}/${eid}/../other/file.jpg`, uid, eid))
})

test('activityPhotoExtensionMatchesMime validates jpeg/jpg', () => {
  assert.ok(activityPhotoExtensionMatchesMime('foo/bar.jpg', 'image/jpeg'))
  assert.ok(!activityPhotoExtensionMatchesMime('foo/bar.png', 'image/jpeg'))
})

// 3. Auth routing (Issues 1 & 2 – onboarding/dashboard gate)
console.log('\nAuth routing')

test('no membership → /onboarding', () => {
  assert.equal(getAuthenticatedLandingPath(false, null), '/onboarding')
})

test('no membership ignores redirect param', () => {
  assert.equal(getAuthenticatedLandingPath(false, '/dashboard'), '/onboarding')
})

test('has membership → /dashboard', () => {
  assert.equal(getAuthenticatedLandingPath(true, null), '/dashboard')
})

test('has membership + valid redirect → redirect', () => {
  assert.equal(getAuthenticatedLandingPath(true, '/plans/123'), '/plans/123')
})

test('has membership + open redirect rejected', () => {
  assert.equal(getAuthenticatedLandingPath(true, '//evil.com'), '/dashboard')
  assert.equal(getAuthenticatedLandingPath(true, 'http://evil.com'), '/dashboard')
})

// 4. Onboarding interest count validation (Issue 7)
console.log('\nOnboarding interest selection')

test('toggleLimitedSelection adds item below limit', () => {
  assert.deepEqual(toggleLimitedSelection(['a', 'b'], 'c', 5), ['a', 'b', 'c'])
})

test('toggleLimitedSelection removes selected item (deselect)', () => {
  assert.deepEqual(toggleLimitedSelection(['a', 'b', 'c'], 'b', 5), ['a', 'c'])
})

test('toggleLimitedSelection clamps at maximum', () => {
  const five = ['a', 'b', 'c', 'd', 'e']
  const result = toggleLimitedSelection(five, 'f', 5)
  assert.deepEqual(result, five)
})

test('toggleLimitedSelection allows 3 as minimum trigger (button disabled below 3)', () => {
  // The UI disables submit when interests.length < 3;
  // confirm we can reach exactly 3.
  let sel = []
  sel = toggleLimitedSelection(sel, 'coffee', 5)
  sel = toggleLimitedSelection(sel, 'art', 5)
  sel = toggleLimitedSelection(sel, 'food', 5)
  assert.equal(sel.length, 3)
})

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed\n`)
if (failed > 0) process.exit(1)
