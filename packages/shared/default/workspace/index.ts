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
