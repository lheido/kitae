import { LocalBackend } from '@kitae/local-backend'
import { Backend } from '@kitae/shared/backend'
import { BackendSettings } from '@kitae/shared/types'

const backends: Record<'local', typeof Backend> = {
  local: LocalBackend
}

export function getBackend(settings: BackendSettings): Backend {
  return new backends[settings.name](settings)
}
