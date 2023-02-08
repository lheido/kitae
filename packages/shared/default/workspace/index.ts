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
      },
      spacing: [
        { name: '0', value: '0px' },
        { name: '0.5', value: '2px' },
        { name: '1', value: '4px' },
        { name: '1.5', value: '6px' },
        { name: '2', value: '8px' },
        { name: '2.5', value: '10px' },
        { name: '3', value: '12px' },
        { name: '3.5', value: '14px' },
        { name: '4', value: '16px' },
        { name: '4.5', value: '18px' },
        { name: '5', value: '20px' },
        { name: '6', value: '24px' },
        { name: '7', value: '28px' },
        { name: '8', value: '32px' },
        { name: '9', value: '36px' },
        { name: '10', value: '40px' },
        { name: '11', value: '44px' },
        { name: '12', value: '48px' },
        { name: '14', value: '56px' },
        { name: '16', value: '64px' },
        { name: '20', value: '80px' },
        { name: '24', value: '96px' },
        { name: '28', value: '112px' },
        { name: '32', value: '128px' },
        { name: '36', value: '144px' },
        { name: '40', value: '160px' },
        { name: '44', value: '176px' },
        { name: '48', value: '192px' },
        { name: '52', value: '208px' },
        { name: '56', value: '224px' },
        { name: '60', value: '240px' },
        { name: '64', value: '256px' },
        { name: '72', value: '288px' },
        { name: '80', value: '320px' },
        { name: '96', value: '384px' }
      ],
      rounded: [
        { name: 'rounded-none', value: '0px' },
        { name: 'rounded-sm', value: '0.125rem' },
        { name: 'rounded', value: '0.25rem' },
        { name: 'rounded-md', value: '0.375rem' },
        { name: 'rounded-lg', value: '0.5rem' },
        { name: 'rounded-xl', value: '0.75rem' },
        { name: 'rounded-2xl', value: '1rem' },
        { name: 'rounded-3xl', value: '1.5rem' },
        { name: 'rounded-full', value: '9999px' }
      ]
    }
  ]
}
