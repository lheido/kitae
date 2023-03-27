import { UserSettings } from '@kitae/shared/types'
import { createStore } from 'solid-js/store'
import { api } from '../api'

export const [userSettings, setUserSettings] = createStore<UserSettings>({
  useCmdUI: false
})

export const getUserSettings = async (): Promise<void> => {
  setUserSettings((await api.getUserSettings()) as UserSettings)
}

export const saveUserSettings = async (settings: UserSettings): Promise<void> => {
  await api.setUserSettings(settings)
}
