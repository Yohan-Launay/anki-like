import '@adonisjs/inertia/types'

import type React from 'react'
import type { Prettify } from '@adonisjs/core/types/common'

type ExtractProps<T> =
  T extends React.FC<infer Props>
    ? Prettify<Omit<Props, 'children'>>
    : T extends React.Component<infer Props>
      ? Prettify<Omit<Props, 'children'>>
      : never

declare module '@adonisjs/inertia/types' {
  export interface InertiaPages {
    'auth/login': ExtractProps<(typeof import('../../inertia/pages/auth/login.tsx'))['default']>
    'auth/signup': ExtractProps<(typeof import('../../inertia/pages/auth/signup.tsx'))['default']>
    'cards/edit': ExtractProps<(typeof import('../../inertia/pages/cards/edit.tsx'))['default']>
    'decks/create': ExtractProps<(typeof import('../../inertia/pages/decks/create.tsx'))['default']>
    'decks/edit': ExtractProps<(typeof import('../../inertia/pages/decks/edit.tsx'))['default']>
    'decks/show': ExtractProps<(typeof import('../../inertia/pages/decks/show.tsx'))['default']>
    'errors/not_found': ExtractProps<(typeof import('../../inertia/pages/errors/not_found.tsx'))['default']>
    'errors/server_error': ExtractProps<(typeof import('../../inertia/pages/errors/server_error.tsx'))['default']>
    'home': ExtractProps<(typeof import('../../inertia/pages/home.tsx'))['default']>
    'study/show': ExtractProps<(typeof import('../../inertia/pages/study/show.tsx'))['default']>
  }
}
