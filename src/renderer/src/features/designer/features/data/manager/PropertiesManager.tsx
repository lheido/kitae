import { ComponentData } from '@kitae/shared/types'
import {
  Draggable,
  draggable,
  DragPlaceholder,
  droppable,
  useDnD
} from '@renderer/features/drag-n-drop'
import { useHistory } from '@renderer/features/history'
import { Component, createEffect, createMemo, For, JSX, Match, Show, Switch } from 'solid-js'
import ComponentSpacingProperty from '../../properties/forms/ComponentSpacingProperty'
import ComponentTextProperty from '../../properties/forms/ComponentTextProperty'
import NameProperty from '../../properties/forms/NameProperty'
import { useDesignerState } from '../../state/designer.state'
import { samePath } from '../../utils/same-path.util'
import { walker } from '../../utils/walker.util'

!!droppable && false
!!draggable && false

const PropertiesManager: Component = () => {
  let containerRef!: HTMLDivElement
  const [state] = useDesignerState()
  const [dnd, , dropped] = useDnD()
  const [history] = useHistory()
  const data = createMemo(() => walker(state.data, state.current) as ComponentData)
  createEffect(() => {
    const event = dropped()
    if (!event) return
    const { droppable, data, index } = event
    if (droppable && data) {
      data.types.forEach((t) => {
        switch (t) {
          case 'kitae/move-config': {
            const draggable = JSON.parse(data.getData(t)) as Draggable
            const isSamePath = samePath(draggable.path, [...droppable.path, 'children', index])
            if (draggable.id === droppable.id || isSamePath) break
            console.log(draggable)
            // makeChange({
            //   handler: DesignerHistoryHandlers.MOVE_COMPONENT_DATA,
            //   path: draggable.path,
            //   changes: [draggable.path, [...droppable.path, 'children', index]]
            // })
            break
          }
          case 'kitae/add-config': {
            const draggable = JSON.parse(data.getData(t)) as Draggable
            console.log(draggable)
            // makeChange({
            //   handler: DesignerHistoryHandlers.ADD_COMPONENT_DATA,
            //   path: [...droppable.path, 'children', index],
            //   changes: JSON.parse(JSON.stringify(draggable.data))
            // })
            break
          }
        }
      })
    }
  })
  return (
    <div class="flex flex-col flex-1 gap-2 h-full">
      <Show when={!['text'].includes(data().type)}>
        <NameProperty />
      </Show>
      <div
        ref={containerRef}
        class="flex flex-col flex-1 gap-2"
        // @ts-ignore - directive
        use:droppable={{ enabled: true, id: 'root', path: [...state.current, 'config'], x: 0 }}
      >
        <Show when={!!dnd.droppable && dnd.position && dnd.position.y > 0}>
          <DragPlaceholder
            position={dnd.position!}
            offsetTop={containerRef?.getBoundingClientRect().top ?? 0}
          />
        </Show>
        <For each={data().config ?? []}>
          {(config, index): JSX.Element => (
            <Switch>
              <Match when={config.type === 'text'}>
                <ComponentTextProperty index={index()} />
              </Match>
              <Match when={config.type === 'padding'}>
                <ComponentSpacingProperty prefix="padding" index={index()} />
              </Match>
              <Match when={config.type === 'margin'}>
                <ComponentSpacingProperty prefix="margin" index={index()} />
              </Match>
            </Switch>
          )}
        </For>
      </div>
    </div>
  )
}

export default PropertiesManager

// const RecursiveComponentItem: Component<ItemProps> = (props: ItemProps) => {
//   let containerRef: HTMLUListElement | undefined
//   const [property, classes, button] = splitProps(props, ['path', 'data', 'depth'], ['class'])
//   const [state] = useDesignerState()
//   const [dnd] = useDnD()
//   const isActive = createMemo(() => samePath(state.current, property.path))
//   const leftPadding = createMemo(() => {
//     return property.depth * 16 + 8
//   })
//   const isDropEnabled = createMemo(
//     // () => dnd.draggable?.id !== component.data.id && component.data.children !== undefined
//     () => true
//   )
//   // const [, { makeChange }] = useHistory()
//   // const deleteComponent = (): void => {
//   //   const p: Path = JSON.parse(JSON.stringify(component.path))
//   //   const previous = JSON.parse(JSON.stringify(walker(state.data, p)))
//   //   makeChange({
//   //     path: p,
//   //     changes: previous,
//   //     handler: DesignerHistoryHandlers.DELETE_COMPONENT_DATA
//   //   })
//   // }
//   return (
//     <li
//       // @ts-ignore - directive
//       // eslint-disable-next-line solid/jsx-no-undef
//       use:droppable={{
//         enabled: isDropEnabled(),
//         // TODO: id: property.data.id,
//         path: property.path,
//         root: false,
//         x: leftPadding() + 16,
//         container: containerRef
//       }}
//     >
//       <For each={property.data}>
//         {(config): JSX.Element => (
//           <Switch>
//             <Match when={config.type === 'text'}>
//               <ComponentTextProperty />
//             </Match>
//           </Switch>
//         )}
//       </For>
//       {/* <button
//         class={twMerge(
//           'flex px-2 gap-2 py-1 w-full rounded items-center text-left whitespace-nowrap',
//           'border border-transparent bg-base-200',
//           'hover:bg-secondary-focus hover:bg-opacity-30',
//           'focus-visible:outline-none focus-visible:bg-secondary-focus focus-visible:bg-opacity-30',
//           classes.class
//         )}
//         classList={{
//           '!border-secondary': isActive()
//         }}
//         style={{
//           'padding-left': `${leftPadding()}px`
//         }}
//         {...button}
//         // @ts-ignore - directive
//         // eslint-disable-next-line solid/jsx-no-undef
//         use:draggable={{
//           format: 'kitae/move-component',
//           effect: 'move',
//           // TODO: id: property.data.id,
//           path: property.path
//         }}
//       >
//         <Icon icon={componentTypeIconMap[property.data.type]} class="w-3 h-3 opacity-50" />
//         <span class="flex-1 max-w-[200px] text-ellipsis whitespace-nowrap overflow-hidden">
//           {property.data.type}
//         </span>
//       </button> */}
//       {/* <Show when={property.data.children}>
//         <ul ref={containerRef} class="relative flex flex-col gap-0.5 pb-1">
//           <Show when={property.data.children!.length > 0}>
//             <For each={property.data.children}>
//               {(child, index): JSX.Element => (
//                 <RecursiveComponentItem
//                   path={[...property.path, 'children', index()]}
//                   data={child}
//                   depth={property.depth + 1}
//                   disableDrop={!isDropEnabled()}
//                 />
//               )}
//             </For>
//           </Show>
//         </ul>
//       </Show> */}
//     </li>
//   )
// }

// const PropertiesList: Component = () => {
//   let containerRef: HTMLUListElement | undefined
//   const [state] = useDesignerState()
//   const [, { makeChange }] = useHistory()
//   const [dnd, , dropped] = useDnD()
//   const pageIndex = createMemo(() => {
//     return state.data?.pages.findIndex((p) => p.id === state.page) ?? 0
//   })
//   const pageChildren = (): ComponentData[] => {
//     return state.data?.pages.find((p) => p.id === state.page)?.children ?? []
//   }
//   createEffect(() => {
//     const event = dropped()
//     if (!event) return
//     const { droppable, data, index } = event
//     if (droppable && data) {
//       data.types.forEach((t) => {
//         switch (t) {
//           case 'kitae/move-component': {
//             const draggable = JSON.parse(data.getData(t)) as Draggable
//             const isSamePath = samePath(draggable.path, [...droppable.path, 'children', index])
//             if (draggable.id === droppable.id || isSamePath) break
//             makeChange({
//               handler: DesignerHistoryHandlers.MOVE_COMPONENT_DATA,
//               path: draggable.path,
//               changes: [draggable.path, [...droppable.path, 'children', index]]
//             })
//             break
//           }
//           case 'kitae/add-component': {
//             const draggable = JSON.parse(data.getData(t)) as Draggable
//             makeChange({
//               handler: DesignerHistoryHandlers.ADD_COMPONENT_DATA,
//               path: [...droppable.path, 'children', index],
//               changes: JSON.parse(JSON.stringify(draggable.data))
//             })
//             break
//           }
//           case 'Files':
//             // @TODO: Handle files (create a new Image component for each file, also what to do with the files? added to the project? I don't now yet)
//             console.log(data.files)
//             break
//           case 'text/html':
//             // @TODO: Try to parse the html and create a new component for each element
//             break
//           case 'text/plain':
//           case 'text/uri-list':
//             // @TODO: Handle text (could a text component, a link component, or a external kitae component)
//             console.log(data.getData(t))
//             break
//         }
//       })
//     }
//   })
//   return (
//     <>
//       <ul
//         ref={containerRef}
//         class="min-w-full relative w-max py-8 flex flex-col gap-0.5"
//         // @ts-ignore - directive
//         use:droppable={{ enabled: true, id: 'root', path: ['pages', pageIndex()], x: 0 }}
//       >
//         <Show when={!!dnd.droppable && dnd.position && dnd.position.y > 0}>
//           <DragPlaceholder
//             position={dnd.position!}
//             offsetTop={containerRef?.getBoundingClientRect().top ?? 0}
//           />
//         </Show>
//         <For each={pageChildren()}>
//           {(component, i): JSX.Element => (
//             <RecursiveComponentItem
//               path={['pages', pageIndex(), 'children', i()]}
//               data={component}
//               depth={0}
//             />
//           )}
//         </For>
//       </ul>
//     </>
//   )
// }

// interface StructureManagerProps {
//   scrollTop: number
// }

// const StructureManager: Component<StructureManagerProps> = (props: StructureManagerProps) => {
//   const [state] = useDesignerState()
//   const pageName = createMemo(() => {
//     return state.data?.pages.find((p) => p.id === state.page)?.name ?? ''
//   })
//   const rounded = (): number => {
//     return 8 - Math.max(0, Math.min(8, props.scrollTop * 0.1))
//   }
//   const badgeOpacity = (): number => {
//     return Math.max(0, Math.min(1, (props.scrollTop - 130) * 0.02))
//   }
//   return (
//     <section class="relative bg-base-200 rounded-lg min-h-screen">
//       <header
//         class="px-2 py-1 flex-1 flex gap-2 items-center sticky top-0 z-[201] bg-base-200 rounded-t-lg"
//         style={{
//           'border-top-left-radius': `${rounded()}px`,
//           'border-top-right-radius': `${rounded()}px`
//         }}
//       >
//         <Icon icon="structure" class="h-4 w-4 opacity-50" />
//         <h1 class="flex-1">Structure</h1>
//         <Badge style={{ opacity: badgeOpacity() }}>{pageName()}</Badge>
//       </header>
//       <OverlayScrollbarsComponent
//         defer
//         options={{
//           overflow: { x: 'scroll', y: 'visible-hidden' },
//           scrollbars: { autoHide: 'leave', autoHideDelay: 0 }
//         }}
//         class="h-[calc(100%-32px)]"
//       >
//         <PropertiesList />
//       </OverlayScrollbarsComponent>
//     </section>
//   )
// }

// export default StructureManager
