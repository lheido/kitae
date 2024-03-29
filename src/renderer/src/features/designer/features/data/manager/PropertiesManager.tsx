import { ComponentConfig, ComponentData, Path } from '@kitae/shared/types'
import { samePath, walker } from '@kitae/shared/utils'
import { defaultStateProperties } from '@renderer/features/designer/default-properties'
import {
  DragPlaceholder,
  Draggable,
  draggable,
  droppable,
  useDnD
} from '@renderer/features/drag-n-drop'
import { Component, For, JSX, Match, Show, Switch, createEffect, createMemo } from 'solid-js'
import { makeAddConfigChange, makeMoveConfigChange } from '../../history/property.events'
import ComponentColorsProperty from '../../properties/forms/ComponentColorsProperty'
import ComponentFlexItemProperty from '../../properties/forms/ComponentFlexItemProperty'
import ComponentFlexProperty from '../../properties/forms/ComponentFlexProperty'
import ComponentGapProperty from '../../properties/forms/ComponentGapProperty'
import ComponentRoundedProperty from '../../properties/forms/ComponentRoundedProperty'
import ComponentSemanticProperty from '../../properties/forms/ComponentSemanticProperty'
import ComponentSizingProperty from '../../properties/forms/ComponentSizingProperty'
import ComponentSpacingProperty from '../../properties/forms/ComponentSpacingProperty'
import ComponentTextProperty from '../../properties/forms/ComponentTextProperty'
import NameProperty from '../../properties/forms/NameProperty'
import ComponentProperty from '../../properties/forms/helpers/ComponentProperty'
import { useDesignerState } from '../../state/designer.state'

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
      <Match when={props.config.type === 'flex'}>
        <ComponentFlexProperty path={props.path} />
      </Match>
      <Match when={props.config.type === 'flexItem'}>
        <ComponentFlexItemProperty path={props.path} />
      </Match>
      <Match when={props.config.type === 'gap'}>
        <ComponentGapProperty path={props.path} />
      </Match>
      <Match when={props.config.type === 'height'}>
        <ComponentSizingProperty path={props.path} prefix="height" />
      </Match>
      <Match when={props.config.type === 'width'}>
        <ComponentSizingProperty path={props.path} prefix="width" />
      </Match>
      <Match when={props.config.type === 'semantic'}>
        <ComponentSemanticProperty path={props.path} />
      </Match>
      <Match when={defaultStateProperties.map((p) => p.type).includes(props.config.type)}>
        <ComponentProperty path={props.path} label={props.config.type}>
          <div
            class="flex-1 flex flex-col gap-2 pl-4 pr-0 min-h-[32px]"
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
        </ComponentProperty>
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
