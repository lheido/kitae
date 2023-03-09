/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentProps, JSX, splitProps, untrack } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { historyBack } from './store'

interface HistoryBackComponentProps extends ComponentProps<any> {
  tag?: string
}

export type HistoryBackProxyComponent<T> = (props: T & HistoryBackComponentProps) => JSX.Element
export type HistoryBackProxy = typeof HistoryBackComponent & {
  // <HistoryBack.button />
  [K in keyof JSX.IntrinsicElements]: HistoryBackProxyComponent<JSX.IntrinsicElements[K]>
}

export const HistoryBackComponent = (props: HistoryBackComponentProps): any => {
  const [local, others] = splitProps(props, ['tag'])
  return (
    <Dynamic
      component={untrack(() => local.tag || 'button')}
      onClick={(): void => historyBack()}
      {...others}
    />
  )
}

const HistoryBack = new Proxy(HistoryBackComponent, {
  get:
    (_, tag: string): HistoryBackProxyComponent<any> =>
    (props: any) => {
      return <HistoryBackComponent {...props} tag={tag} />
    }
}) as HistoryBackProxy

export default HistoryBack
