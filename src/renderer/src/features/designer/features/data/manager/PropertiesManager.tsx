import { ComponentConfig, ComponentData, Path } from '@kitae/shared/types'
import { defaultStateProperties } from '@renderer/features/designer/default-properties'
import {
  Draggable,
  draggable,
  DragPlaceholder,
  droppable,
  useDnD
} from '@renderer/features/drag-n-drop'
import { Component, createEffect, createMemo, For, JSX, Match, Show, Switch } from 'solid-js'
import { makeAddConfigChange, makeMoveConfigChange } from '../../history/property.events'
import ComponentColorsProperty from '../../properties/forms/ComponentColorsProperty'
import ComponentRoundedProperty from '../../properties/forms/ComponentRoundedProperty'
import ComponentSpacingProperty from '../../properties/forms/ComponentSpacingProperty'
import ComponentTextProperty from '../../properties/forms/ComponentTextProperty'
import NameProperty from '../../properties/forms/NameProperty'
import { useDesignerState } from '../../state/designer.state'
import { samePath } from '../../utils/same-path.util'
import { walker } from '../../utils/walker.util'

!!droppable && false
!!draggable && false

const [state] = useDesignerState()

interface PropertyRendererProps {
  config: ComponentConfig
  index: number
  path: Path
}

const PropertyRenderer: Component<PropertyRendererProps> = (props: PropertyRendererProps) => {
  return (
    <Switch>
      <Match when={props.config.type === 'text'}>
        <ComponentTextProperty path={props.path} />
      </Match>
      <Match when={props.config.type === 'padding'}>
        <ComponentSpacingProperty prefix="padding" path={props.path} />
      </Match>
      <Match when={props.config.type === 'margin'}>
        <ComponentSpacingProperty prefix="margin" path={props.path} />
      </Match>
      <Match when={props.config.type === 'backgroundColor'}>
        <ComponentColorsProperty prefix="backgroundColor" path={props.path} />
      </Match>
      <Match when={props.config.type === 'color'}>
        <ComponentColorsProperty prefix="color" path={props.path} />
      </Match>
      <Match when={props.config.type === 'rounded'}>
        <ComponentRoundedProperty path={props.path} />
      </Match>
      <Match when={defaultStateProperties.map((p) => p.type).includes(props.config.type)}>
        <section class="flex flex-col bg-base-200 rounded-lg min-h-[42px]">
          <header class="px-2 flex items-center mb-1">
            <h1
              class="flex-1 cursor-move select-none italic text-lg flex gap-2 items-center capitalize"
              // @ts-ignore - directive
              use:draggable={{
                format: 'kitae/move-config',
                effect: 'move',
                id: crypto.randomUUID(),
                path: props.path,
                enabled: true
              }}
            >
              {props.config.type}
            </h1>
          </header>
          <div
            class="flex-1 flex flex-col gap-2 pl-4 pr-0"
            // @ts-ignore - directive
            use:droppable={{
              enabled: true,
              id: crypto.randomUUID(),
              path: [...props.path, 'data', 'config'],
              x: 16
            }}
          >
            <For each={(props.config.data as { config: ComponentConfig[] })?.config ?? []}>
              {(childConfig, index): JSX.Element => (
                <PropertyRenderer
                  config={childConfig}
                  index={index()}
                  path={[...props.path, 'data', 'config', index()]}
                />
              )}
            </For>
          </div>
        </section>
      </Match>
    </Switch>
  )
}

const PropertiesManager: Component = () => {
  let containerRef!: HTMLDivElement
  const [dnd, , dropped] = useDnD()
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
            const isSamePath = samePath(draggable.path, [...droppable.path, index])
            if (draggable.id === droppable.id || isSamePath) break
            makeMoveConfigChange({
              path: draggable.path,
              changes: [draggable.path, [...droppable.path, index]]
            })
            break
          }
          case 'kitae/add-config': {
            const draggable = JSON.parse(data.getData(t)) as Draggable
            const config = walker<ComponentConfig[]>(state.data, droppable.path)
            if (config!.find((c) => c.type === (draggable.data as ComponentConfig).type)) break
            makeAddConfigChange({
              path: [...droppable.path, index],
              changes: JSON.parse(JSON.stringify(draggable.data))
            })
            break
          }
        }
      })
    }
  })
  const displayDragPlaceholder = createMemo(() => {
    if (!dnd.draggable) return false
    if (!dnd.position) return false
    const rect = containerRef!.getBoundingClientRect()
    return (
      dnd.position.eventX >= rect.x &&
      dnd.position.eventX <= rect.x + rect.width &&
      dnd.position.y > 0
    )
  })
  return (
    <div class="flex flex-col flex-1 gap-2 h-full">
      <Show when={!['text'].includes(data()?.type)}>
        <NameProperty />
      </Show>
      <div class="flex flex-col flex-1 relative">
        <Show when={displayDragPlaceholder()}>
          <DragPlaceholder
            position={dnd.position!}
            offsetTop={containerRef?.getBoundingClientRect().top ?? 0}
          />
        </Show>
        <div
          ref={containerRef}
          class="flex flex-col flex-1 gap-2"
          // @ts-ignore - directive
          use:droppable={{ enabled: true, id: 'root', path: [...state.current, 'config'], x: 0 }}
        >
          <For each={data()?.config ?? []}>
            {(config, index): JSX.Element => (
              <PropertyRenderer
                config={config}
                index={index()}
                path={[...state.current, 'config', index()]}
              />
            )}
          </For>
        </div>
      </div>
    </div>
  )
}

export default PropertiesManager
