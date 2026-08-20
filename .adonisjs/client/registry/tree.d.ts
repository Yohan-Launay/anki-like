/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  home: typeof routes['home']
  newAccount: {
    create: typeof routes['new_account.create']
    store: typeof routes['new_account.store']
  }
  session: {
    create: typeof routes['session.create']
    store: typeof routes['session.store']
    destroy: typeof routes['session.destroy']
  }
  study: {
    show: typeof routes['study.show']
    review: typeof routes['study.review']
  }
  decks: {
    create: typeof routes['decks.create']
    example: typeof routes['decks.example']
    import: typeof routes['decks.import']
    store: typeof routes['decks.store']
    export: typeof routes['decks.export']
    show: typeof routes['decks.show']
    edit: typeof routes['decks.edit']
    update: typeof routes['decks.update']
    destroy: typeof routes['decks.destroy']
  }
  cards: {
    store: typeof routes['cards.store']
    edit: typeof routes['cards.edit']
    update: typeof routes['cards.update']
    destroy: typeof routes['cards.destroy']
  }
}
