import { ThemeData } from '@kitae/shared/types'
import { Accessor, createMemo } from 'solid-js'
import { useDesignerState } from '../../state/designer.state'

export const getCurrentThemeIndex = (): (() => number) => {
  const [state] = useDesignerState()
  const memo = createMemo(() => (state.current[1] as number) ?? 0)
  return memo
}

export const getCurrentTheme = (indexAccessor?: Accessor<number>): (() => ThemeData) => {
  const [state] = useDesignerState()
  const memo = createMemo(() => {
    const index = indexAccessor ? indexAccessor() : getCurrentThemeIndex()()
    return state.data!.themes[index]
  })
  return memo
}

export const getCurrentThemeName = (indexAccessor?: Accessor<number>): (() => string) => {
  const [state] = useDesignerState()
  const memo = createMemo(() => {
    const index = indexAccessor ? indexAccessor() : getCurrentThemeIndex()()
    return state.data!.themes[index].name
  })
  return memo
}
