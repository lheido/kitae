/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentProps, JSX, splitProps, untrack } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { twMerge } from 'tailwind-merge'

interface ButtonComponentProps extends ComponentProps<'button'> {
  tag?: string
}

export type ButtonProxyComponent<T> = (props: T & ButtonComponentProps) => JSX.Element
export type ButtonProxy = typeof ButtonComponent & {
  // <Button.button />
  [K in keyof JSX.IntrinsicElements]: ButtonProxyComponent<JSX.IntrinsicElements[K]>
}

export const ButtonComponent = (props: ButtonComponentProps): any => {
  const [local, classes, others] = splitProps(props, ['tag'], ['class'])
  return (
    <Dynamic
      component={untrack(() => local.tag || 'button')}
      {...others}
      class={twMerge('btn', classes.class)}
    />
  )
}

const Button = new Proxy(ButtonComponent, {
  get:
    (_, tag: string): ButtonProxyComponent<any> =>
    (props: any) => {
      return <ButtonComponent {...props} tag={tag} />
    }
}) as ButtonProxy

export default Button
