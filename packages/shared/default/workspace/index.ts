// import { theme } from 'tailwindcss/defaultConfig'
import crypto from 'crypto'
import { WorkspaceData } from '../../types'

// console.log(theme)

export const defaultWorkspaceData: WorkspaceData = {
  components: [],
  pages: [
    {
      id: crypto.randomUUID(),
      name: 'Home',
      type: 'container',
      children: [
        {
          id: crypto.randomUUID(),
          name: 'Header',
          type: 'container',
          config: {
            semantic: 'header'
          },
          children: [
            {
              id: crypto.randomUUID(),
              name: 'Title',
              type: 'text',
              config: {
                text: 'Hello World',
                semantic: 'h1'
              }
            }
          ]
        },
        {
          id: crypto.randomUUID(),
          name: 'Main',
          type: 'container',
          children: [
            {
              id: crypto.randomUUID(),
              name: 'Button',
              type: 'button',
              children: [
                {
                  id: crypto.randomUUID(),
                  name: 'Button Text',
                  type: 'text',
                  config: {
                    text: 'Click Me',
                    semantic: 'span'
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  themes: [
    {
      id: crypto.randomUUID(),
      name: 'default',
      colors: [
        { name: 'primary', value: 'hsl(158deg, 64%, 32%)' },
        { name: 'primary-focus', value: 'hsl(158deg, 64%, 28%)' },
        { name: 'primary-content', value: 'hsl(158deg, 64%, 100%)' },
        { name: 'secondary', value: 'hsl(198deg, 64%, 32%)' },
        { name: 'secondary-focus', value: 'hsl(198deg, 64%, 28%)' },
        { name: 'secondary-content', value: 'hsl(198deg, 64%, 100%)' },
        { name: 'alert', value: 'hsl(5deg, 91%, 32%)' },
        { name: 'alert-focus', value: 'hsl(5deg, 91%, 28%)' },
        { name: 'alert-content', value: 'hsl(5deg, 91%, 100%)' },
        { name: 'base-100', value: 'hsl(270deg, 10%, 32%)' },
        { name: 'base-200', value: 'hsl(270deg, 10%, 16%)' },
        { name: 'base-300', value: 'hsl(270deg, 10%, 12%)' },
        { name: 'base-content', value: 'hsl(270deg, 10%, 100%)' }
      ],
      fonts: {
        family: [
          {
            name: 'sans',
            value:
              'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'
          },
          { name: 'serif', value: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' },
          {
            name: 'mono',
            value:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
          }
        ]
      }
    }
  ]
}
