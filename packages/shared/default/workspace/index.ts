// import { theme } from 'tailwindcss/defaultConfig'
import crypto from 'crypto'
import { WorkspaceData } from '../../types'

// console.log(theme)

export const defaultWorkspaceData: WorkspaceData = {
  components: [],
  driver: 'astro',
  pages: [
    {
      id: crypto.randomUUID(),
      name: 'index',
      type: 'page',
      config: [],
      children: [
        {
          id: crypto.randomUUID(),
          name: 'Header',
          type: 'container',
          config: [
            {
              type: 'semantic',
              data: 'header'
            }
          ],
          children: [
            {
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
            }
          ]
        },
        {
          id: crypto.randomUUID(),
          name: 'Main',
          type: 'container',
          config: [],
          children: [
            {
              id: crypto.randomUUID(),
              name: 'Button',
              type: 'button',
              config: [],
              children: [
                {
                  id: crypto.randomUUID(),
                  name: 'Button Text',
                  type: 'text',
                  config: [
                    {
                      type: 'text',
                      data: 'Click Me'
                    },
                    {
                      type: 'semantic',
                      data: 'span'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ],
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
      none: '0px',
      sm: '0.125rem',
      base: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      '3xl': '1.5rem',
      full: '9999px'
    },
    extends: {}
  }
}
