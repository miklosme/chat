import { nanoid } from 'nanoid'

// 3 chars only because db uses fix length
type IDTypes = 'thr' | 'msg' | 'doc'

export function createId<T extends IDTypes>(label: T): `${T}-${string}` {
  if (!label) throw new Error('label is required')

  return `${label}-${nanoid()}`
}
