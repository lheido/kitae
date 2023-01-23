import { Motion } from '@motionone/solid'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-solid'
import { Component, ComponentProps, createSignal, JSX, onMount, splitProps } from 'solid-js'
import { twMerge } from 'tailwind-merge'
import AnimatedArrowDown from './AnimatedArrowDown'

interface AccordionProps extends ComponentProps<'section'> {
  label: string
  accordionId: string
  opened: boolean
  headerSlot?: JSX.Element
  basis: string
}

const Accordion: Component<AccordionProps> = (props: AccordionProps) => {
  const [component, classes, container] = splitProps(
    props,
    ['label', 'opened', 'accordionId', 'headerSlot', 'children', 'basis'],
    ['class']
  )
  const [expanded, setExpanded] = createSignal(true)
  const [scrolling, isScrolling] = createSignal(false)
  const [headerHeight, setHeaderHeight] = createSignal(0)
  const [ids, setIds] = createSignal({ header: '', content: '' })
  let contentRef: HTMLDivElement | undefined
  let headerRef: HTMLDivElement | undefined
  onMount(() => {
    if (contentRef && headerRef) {
      setHeaderHeight(headerRef.offsetHeight)
    }
    setExpanded(component.opened)
    setIds({
      header: `${component.accordionId}-header`,
      content: `${component.accordionId}-content`
    })
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
            class="px-2 py-1 flex-1 flex justify-center items-center hover:bg-base-300 transition-colors"
            onClick={(): boolean => setExpanded((prev) => !prev)}
          >
            <span class="flex-1 text-left">{component.label}</span>
            <AnimatedArrowDown state={expanded()} class="h-4 w-4" />
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
          class="h-full"
          events={{ scroll: ({ elements }) => isScrolling(elements().viewport.scrollTop !== 0) }}
        >
          <div class="p-2 pr-3">{component.children}</div>
        </OverlayScrollbarsComponent>
      </Motion>
    </Motion.section>
  )
}

export default Accordion
