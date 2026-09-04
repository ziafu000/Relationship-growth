export const ACTIVITY_PHOTO_BUCKET = 'activity_images'
export const ACTIVITY_PHOTO_MAX_BYTES = 5 * 1024 * 1024
export const ACTIVITY_PHOTO_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const

type ActivityPhotoMimeType = (typeof ACTIVITY_PHOTO_MIME_TYPES)[number]

type FileDescriptor = {
  type: string
  size: number
}

const extensionByMimeType: Record<ActivityPhotoMimeType, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

export function validateActivityPhoto(file: FileDescriptor): string | null {
  if (!ACTIVITY_PHOTO_MIME_TYPES.includes(file.type as ActivityPhotoMimeType)) {
    return 'Chỉ hỗ trợ ảnh JPEG, PNG hoặc WebP.'
  }

  if (file.size <= 0) {
    return 'Ảnh đã chọn không có nội dung.'
  }

  if (file.size > ACTIVITY_PHOTO_MAX_BYTES) {
    return 'Ảnh phải nhỏ hơn hoặc bằng 5 MB.'
  }

  return null
}

export function createActivityPhotoPath(
  userId: string,
  executionId: string,
  mimeType: string,
  objectId: string,
): string {
  const extension = extensionByMimeType[mimeType as ActivityPhotoMimeType]
  if (!extension) {
    throw new Error('Unsupported activity photo type')
  }

  return `${userId}/${executionId}/${objectId}.${extension}`
}

export function isOwnedActivityPhotoPath(
  path: string,
  userId: string,
  executionId: string,
): boolean {
  const escapedUserId = escapeRegExp(userId)
  const escapedExecutionId = escapeRegExp(executionId)
  return new RegExp(
    `^${escapedUserId}/${escapedExecutionId}/[0-9a-f-]+\\.(?:jpg|png|webp)$`,
    'i',
  ).test(path)
}

export function activityPhotoExtensionMatchesMime(
  path: string,
  mimeType: string,
): boolean {
  const extension = extensionByMimeType[mimeType as ActivityPhotoMimeType]
  return Boolean(extension && path.toLowerCase().endsWith(`.${extension}`))
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
