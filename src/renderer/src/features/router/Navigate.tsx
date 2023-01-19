/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentProps, JSX, splitProps, untrack } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { navigate } from './store'

interface NavigateComponentProps extends ComponentProps<any> {
  tag?: string
  to: string
}

export type NavigateProxyComponent<T> = (props: T & NavigateComponentProps) => JSX.Element
export type NavigateProxy = typeof NavigateComponent & {
  // <Navigate.button />
  [K in keyof JSX.IntrinsicElements]: NavigateProxyComponent<JSX.IntrinsicElements[K]>
}

export const NavigateComponent = (props: NavigateComponentProps): any => {
  const [local, others] = splitProps(props, ['tag', 'to'])
  const clickHandler = (): void => navigate(local.to)
  return (
    <Dynamic component={untrack(() => local.tag || 'button')} onClick={clickHandler} {...others} />
  )
}

const Navigate = new Proxy(NavigateComponent, {
  get:
    (_, tag: string): NavigateProxyComponent<any> =>
    (props: any) => {
      return <NavigateComponent {...props} tag={tag} />
    }
}) as NavigateProxy

export default Navigate
