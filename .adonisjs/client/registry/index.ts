/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'home': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [{"old":"/","type":0,"val":"/","end":""}],
    types: placeholder as Registry['home']['types'],
  },
  'new_account.create': {
    methods: ["GET","HEAD"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.create']['types'],
  },
  'new_account.store': {
    methods: ["POST"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.store']['types'],
  },
  'session.create': {
    methods: ["GET","HEAD"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.create']['types'],
  },
  'session.store': {
    methods: ["POST"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.store']['types'],
  },
  'session.destroy': {
    methods: ["POST"],
    pattern: '/logout',
    tokens: [{"old":"/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['session.destroy']['types'],
  },
  'study.show': {
    methods: ["GET","HEAD"],
    pattern: '/study',
    tokens: [{"old":"/study","type":0,"val":"study","end":""}],
    types: placeholder as Registry['study.show']['types'],
  },
  'study.fast': {
    methods: ["POST"],
    pattern: '/study/fast',
    tokens: [{"old":"/study/fast","type":0,"val":"study","end":""},{"old":"/study/fast","type":0,"val":"fast","end":""}],
    types: placeholder as Registry['study.fast']['types'],
  },
  'study.review': {
    methods: ["POST"],
    pattern: '/cards/:id/review',
    tokens: [{"old":"/cards/:id/review","type":0,"val":"cards","end":""},{"old":"/cards/:id/review","type":1,"val":"id","end":""},{"old":"/cards/:id/review","type":0,"val":"review","end":""}],
    types: placeholder as Registry['study.review']['types'],
  },
  'decks.create': {
    methods: ["GET","HEAD"],
    pattern: '/decks/create',
    tokens: [{"old":"/decks/create","type":0,"val":"decks","end":""},{"old":"/decks/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['decks.create']['types'],
  },
  'decks.example': {
    methods: ["POST"],
    pattern: '/decks/example',
    tokens: [{"old":"/decks/example","type":0,"val":"decks","end":""},{"old":"/decks/example","type":0,"val":"example","end":""}],
    types: placeholder as Registry['decks.example']['types'],
  },
  'decks.import': {
    methods: ["POST"],
    pattern: '/decks/import',
    tokens: [{"old":"/decks/import","type":0,"val":"decks","end":""},{"old":"/decks/import","type":0,"val":"import","end":""}],
    types: placeholder as Registry['decks.import']['types'],
  },
  'decks.store': {
    methods: ["POST"],
    pattern: '/decks',
    tokens: [{"old":"/decks","type":0,"val":"decks","end":""}],
    types: placeholder as Registry['decks.store']['types'],
  },
  'decks.export': {
    methods: ["GET","HEAD"],
    pattern: '/decks/:id/export',
    tokens: [{"old":"/decks/:id/export","type":0,"val":"decks","end":""},{"old":"/decks/:id/export","type":1,"val":"id","end":""},{"old":"/decks/:id/export","type":0,"val":"export","end":""}],
    types: placeholder as Registry['decks.export']['types'],
  },
  'decks.show': {
    methods: ["GET","HEAD"],
    pattern: '/decks/:id',
    tokens: [{"old":"/decks/:id","type":0,"val":"decks","end":""},{"old":"/decks/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['decks.show']['types'],
  },
  'decks.edit': {
    methods: ["GET","HEAD"],
    pattern: '/decks/:id/edit',
    tokens: [{"old":"/decks/:id/edit","type":0,"val":"decks","end":""},{"old":"/decks/:id/edit","type":1,"val":"id","end":""},{"old":"/decks/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['decks.edit']['types'],
  },
  'decks.update': {
    methods: ["POST"],
    pattern: '/decks/:id',
    tokens: [{"old":"/decks/:id","type":0,"val":"decks","end":""},{"old":"/decks/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['decks.update']['types'],
  },
  'decks.destroy': {
    methods: ["DELETE"],
    pattern: '/decks/:id',
    tokens: [{"old":"/decks/:id","type":0,"val":"decks","end":""},{"old":"/decks/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['decks.destroy']['types'],
  },
  'cards.store': {
    methods: ["POST"],
    pattern: '/decks/:id/cards',
    tokens: [{"old":"/decks/:id/cards","type":0,"val":"decks","end":""},{"old":"/decks/:id/cards","type":1,"val":"id","end":""},{"old":"/decks/:id/cards","type":0,"val":"cards","end":""}],
    types: placeholder as Registry['cards.store']['types'],
  },
  'cards.edit': {
    methods: ["GET","HEAD"],
    pattern: '/cards/:id/edit',
    tokens: [{"old":"/cards/:id/edit","type":0,"val":"cards","end":""},{"old":"/cards/:id/edit","type":1,"val":"id","end":""},{"old":"/cards/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['cards.edit']['types'],
  },
  'cards.flag': {
    methods: ["POST"],
    pattern: '/cards/:id/flag',
    tokens: [{"old":"/cards/:id/flag","type":0,"val":"cards","end":""},{"old":"/cards/:id/flag","type":1,"val":"id","end":""},{"old":"/cards/:id/flag","type":0,"val":"flag","end":""}],
    types: placeholder as Registry['cards.flag']['types'],
  },
  'cards.update': {
    methods: ["POST"],
    pattern: '/cards/:id',
    tokens: [{"old":"/cards/:id","type":0,"val":"cards","end":""},{"old":"/cards/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['cards.update']['types'],
  },
  'cards.destroy': {
    methods: ["DELETE"],
    pattern: '/cards/:id',
    tokens: [{"old":"/cards/:id","type":0,"val":"cards","end":""},{"old":"/cards/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['cards.destroy']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
