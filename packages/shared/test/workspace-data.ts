import { ComponentData, WorkspaceData } from '../types'

export const customComponentId = crypto.randomUUID()
export const customComponentSlotId = crypto.randomUUID()

export const customComponentData: ComponentData = {
  id: customComponentId,
  name: 'Custom Component',
  type: 'custom',
  config: [],
  children: [
    {
      id: customComponentSlotId,
      name: 'Slot',
      type: 'slot',
      config: [],
      children: []
    }
  ]
}

export const pageComponents: Record<string, ComponentData> = {
  home: {
    id: crypto.randomUUID(),
    name: 'Home',
    type: 'page',
    config: [],
    children: []
  },
  header: {
    id: crypto.randomUUID(),
    name: 'Header',
    type: 'container',
    config: [
      {
        type: 'semantic',
        data: 'header'
      },
      {
        type: 'padding',
        data: {
          left: 4,
          right: 4,
          top: 4,
          bottom: 4
        }
      },
      {
        type: 'backgroundColor',
        data: 'primary'
      },
      {
        type: 'color',
        data: 'primary-content'
      }
    ],
    children: []
  },
  main: {
    id: crypto.randomUUID(),
    name: 'Main',
    type: 'container',
    config: [
      {
        type: 'semantic',
        data: 'main'
      }
    ],
    children: []
  },
  footer: {
    id: crypto.randomUUID(),
    name: 'Footer',
    type: 'container',
    config: [
      {
        type: 'semantic',
        data: 'footer'
      }
    ],
    children: []
  },
  title: {
    id: crypto.randomUUID(),
    name: 'Title',
    type: 'text',
    config: [
      {
        type: 'text',
        data: 'Hello World'
      },
      {
        type: 'semantic',
        data: 'h1'
      }
    ]
  },
  container: {
    id: crypto.randomUUID(),
    name: 'Container',
    type: 'container',
    config: [],
    children: []
  },
  content: {
    id: crypto.randomUUID(),
    name: 'Content',
    type: 'container',
    config: [],
    children: []
  },
  custom: {
    id: crypto.randomUUID(),
    name: 'Custom',
    type: 'custom',
    ref: customComponentId,
    config: [],
    children: []
  },
  customSlot: {
    id: crypto.randomUUID(),
    name: 'Slot Text',
    type: 'text',
    config: [
      {
        type: 'text',
        data: 'This is the footer'
      }
    ]
  }
}

export const mockWorkspaceData: WorkspaceData = {
  components: [customComponentData],
  driver: 'astro',
  pages: [],
  theme: {
    colors: {
      primary: 'hsl(158deg, 64%, 32%)',
      'primary-focus': 'hsl(158deg, 64%, 28%)',
      'primary-content': 'hsl(158deg, 64%, 100%)',
      secondary: 'hsl(198deg, 64%, 32%)',
      'secondary-focus': 'hsl(198deg, 64%, 28%)',
      'secondary-content': 'hsl(198deg, 64%, 100%)',
      alert: 'hsl(5deg, 91%, 32%)',
      'alert-focus': 'hsl(5deg, 91%, 28%)',
      'alert-content': 'hsl(5deg, 91%, 100%)',
      neutral: 'hsl(0deg, 0%, 32%)',
      'neutral-focus': 'hsl(0deg, 0%, 28%)',
      'neutral-content': 'hsl(0deg, 0%, 100%)',
      base: 'hsl(0deg, 0%, 100%)',
      'base-content': 'hsl(0deg, 0%, 32%)',
      'base-100': 'hsl(0deg, 0%, 100%)',
      'base-200': 'hsl(0deg, 0%, 96%)',
      'base-300': 'hsl(0deg, 0%, 92%)'
    },
    fontFamilies: {
      sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
    },
    spacing: {
      '0': '0px',
      '0.5': '2px',
      '1': '4px',
      '1.5': '6px',
      '2': '8px',
      '2.5': '10px',
      '3': '12px',
      '3.5': '14px',
      '4': '16px',
      '4.5': '18px',
      '5': '20px',
      '6': '24px',
      '7': '28px',
      '8': '32px',
      '9': '36px',
      '10': '40px',
      '11': '44px',
      '12': '48px',
      '14': '56px',
      '16': '64px',
      '20': '80px',
      '24': '96px',
      '28': '112px',
      '32': '128px',
      '36': '144px',
      '40': '160px',
      '44': '176px',
      '48': '192px',
      '52': '208px',
      '56': '224px',
      '60': '240px',
      '64': '256px',
      '72': '288px',
      '80': '320px',
      '96': '384px'
    },
    sizing: {
      '0': '0px',
      px: '1px',
      '0.5': '0.125rem',
      '1': '0.25rem',
      '1.5': '0.375rem',
      '2': '0.5rem',
      '2.5': '0.625rem',
      '3': '0.75rem',
      '3.5': '0.875rem',
      '4': '1rem',
      '5': '1.25rem',
      '6': '1.5rem',
      '7': '1.75rem',
      '8': '2rem',
      '9': '2.25rem',
      '10': '2.5rem',
      '11': '2.75rem',
      '12': '3rem',
      '14': '3.5rem',
      '16': '4rem',
      '20': '5rem',
      '24': '6rem',
      '28': '7rem',
      '32': '8rem',
      '36': '9rem',
      '40': '10rem',
      '44': '11rem',
      '48': '12rem',
      '52': '13rem',
      '56': '14rem',
      '60': '15rem',
      '64': '16rem',
      '72': '18rem',
      '80': '20rem',
      '96': '24rem'
    },
    rounded: {
      'rounded-none': '0px',
      'rounded-sm': '0.125rem',
      rounded: '0.25rem',
      'rounded-md': '0.375rem',
      'rounded-lg': '0.5rem',
      'rounded-xl': '0.75rem',
      'rounded-2xl': '1rem',
      'rounded-3xl': '1.5rem',
      'rounded-full': '9999px'
    },
    extends: {}
  }
}

export const mockWorkspaceDataWithPage: WorkspaceData = {
  ...mockWorkspaceData,
  pages: [
    {
      ...pageComponents.home,
      children: [
        { ...pageComponents.header, children: [{ ...pageComponents.title }] },
        {
          ...pageComponents.main,
          children: [{ ...pageComponents.container, children: [{ ...pageComponents.content }] }]
        },
        {
          ...pageComponents.footer,
          children: [
            {
              ...pageComponents.custom,
              slots: {
                [customComponentSlotId]: [{ ...pageComponents.customSlot }]
              }
            }
          ]
        }
      ]
    }
  ]
}

export const expectedCssClasses =
  '.bg-primary {background-color: hsl(158deg, 64%, 32%)} .text-primary-content {color: hsl(158deg, 64%, 100%)} .p-4 {padding: 16px}'

export const expectedFirstPageHTML = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${pageComponents.home.name}</title>
    <style>${expectedCssClasses}</style>
  </head>
  <body>
    <header class="bg-primary text-primary-content p-4"><h1>Hello World</h1></header>
    <main><div><div></div></div></main>
    <footer><span>This is the footer</span></footer>
  </body>
</html>
`
