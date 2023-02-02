import { Motion } from '@motionone/solid'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-solid'
import {
  Component,
  ComponentProps,
  createEffect,
  createSignal,
  JSX,
  Show,
  splitProps,
  untrack
} from 'solid-js'
import { twMerge } from 'tailwind-merge'
import AnimatedArrowDown from './AnimatedArrowDown'
import Icon from './Icon'

interface AccordionProps extends ComponentProps<'section'> {
  label: string | JSX.Element
  icon?: string
  accordionId: string
  opened: boolean
  headerSlot?: JSX.Element
  basis: string
  contentClass?: string
}

const Accordion: Component<AccordionProps> = (props: AccordionProps) => {
  const [component, classes, container] = splitProps(
    props,
    ['label', 'icon', 'opened', 'accordionId', 'headerSlot', 'children', 'basis'],
    ['class', 'contentClass']
  )
  const [expanded, setExpanded] = createSignal(untrack(() => component.opened))
  const [scrolling, isScrolling] = createSignal(false)
  const [headerHeight, setHeaderHeight] = createSignal(0)
  const [ids, setIds] = createSignal({ header: '', content: '' })
  let contentRef: HTMLDivElement | undefined
  let headerRef: HTMLDivElement | undefined
  createEffect(() => {
    setIds({
      header: `${component.accordionId}-header`,
      content: `${component.accordionId}-content`
    })
    if (contentRef && headerRef) {
      setHeaderHeight(headerRef.offsetHeight)
    }
    setExpanded(component.opened)
  })
  return (
    <Motion.section
      ref={contentRef}
      animate={{
        flexBasis: expanded() ? `${component.basis}` : `${headerHeight()}px`
      }}
      transition={{ duration: 0.4 }}
      {...container}
      class={twMerge('overflow-hidden relative', classes.class)}
      style={{
        'min-height': `${headerHeight()}px`,
        'flex-basis': !component.opened ? `${headerHeight()}px` : `${component.basis}`
      }}
    >
      <header
        ref={headerRef}
        class="flex items-center absolute top-0 left-0 w-full z-10"
        classList={{ 'shadow shadow-base-300': scrolling() }}
      >
        <h1 class="contents">
          <button
            type="button"
            id={ids().header}
            aria-controls={ids().content}
            aria-expanded={expanded()}
            class="px-2 py-1 flex-1 flex gap-2 items-center hover:bg-base-300 transition-colors"
            onClick={(): boolean => setExpanded((prev) => !prev)}
          >
            <Show when={component.icon}>
              <Icon icon={component.icon as string} class="w-4 h-4 opacity-50" />
            </Show>
            <span class="flex-1 text-left text-ellipsis whitespace-nowrap overflow-hidden">
              {component.label}
            </span>
            <AnimatedArrowDown initial={component.opened} state={expanded()} class="h-4 w-4" />
          </button>
        </h1>
        {component.headerSlot}
      </header>
      <Motion
        animate={{
          height: expanded() ? `100%` : `0`,
          opacity: expanded() ? 1 : 0
        }}
        transition={{ duration: 0.4 }}
        role="region"
        id={ids().content}
        aria-labelledby={ids().header}
        style={{ 'padding-top': `${headerHeight()}px` }}
      >
        <OverlayScrollbarsComponent
          defer
          options={{ scrollbars: { autoHide: 'leave', autoHideDelay: 0 } }}
          class="h-full"
          events={{ scroll: ({ elements }) => isScrolling(elements().viewport.scrollTop !== 0) }}
        >
          <div class={twMerge('p-2', classes.contentClass)}>{component.children}</div>
        </OverlayScrollbarsComponent>
      </Motion>
    </Motion.section>
  )
}

export default Accordion
