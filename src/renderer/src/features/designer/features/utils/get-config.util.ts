import { ComponentConfig } from '@kitae/shared/types'

export const getConfig = (config: ComponentConfig[], type: string): ComponentConfig | undefined => {
  return config && config.find((item) => item.type === type)
}
