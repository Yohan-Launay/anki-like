/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

router.get('/', [controllers.Home, 'index']).as('home')

router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create'])
    router.post('signup', [controllers.NewAccount, 'store'])

    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])
  })
  .use(middleware.guest())

router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy'])

    router.get('study', [controllers.Study, 'show']).as('study.show')
    router.post('study/fast', [controllers.Study, 'startFast']).as('study.fast')
    router.post('cards/:id/review', [controllers.Study, 'review']).as('study.review')

    router.get('decks/create', [controllers.Decks, 'create']).as('decks.create')
    router.post('decks/example', [controllers.Decks, 'example']).as('decks.example')
    router.post('decks/import', [controllers.Decks, 'import']).as('decks.import')
    router.post('decks', [controllers.Decks, 'store']).as('decks.store')
    router.get('decks/:id/export', [controllers.Decks, 'export']).as('decks.export')
    router.get('decks/:id', [controllers.Decks, 'show']).as('decks.show')
    router.get('decks/:id/edit', [controllers.Decks, 'edit']).as('decks.edit')
    router.post('decks/:id', [controllers.Decks, 'update']).as('decks.update')
    router.delete('decks/:id', [controllers.Decks, 'destroy']).as('decks.destroy')
    router.post('decks/:id/cards', [controllers.Cards, 'store']).as('cards.store')

    router.get('cards/:id/edit', [controllers.Cards, 'edit']).as('cards.edit')
    router.post('cards/:id/flag', [controllers.Cards, 'flag']).as('cards.flag')
    router.post('cards/:id', [controllers.Cards, 'update']).as('cards.update')
    router.delete('cards/:id', [controllers.Cards, 'destroy']).as('cards.destroy')
  })
  .use(middleware.auth())
