import { DateTime } from 'luxon'
import { readFile } from 'node:fs/promises'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import Deck from '#models/deck'
import Card from '#models/card'
import { deckImportFileValidator, deckValidator, importedDeckValidator } from '#validators/deck'
import DeckTransformer from '#transformers/deck_transformer'
import CardTransformer from '#transformers/card_transformer'
import StudyService from '#services/study_service'
import { DEFAULT_EASE, CARDS_PER_PAGE } from '#services/srs_service'
import { STARTER_CARDS, STARTER_DECK_NAME } from '#services/starter_deck'
import { cardCreatePayload, filenameForDeck, serializeDeck } from '#services/deck_export'

export default class DecksController {
  async create({ inertia }: HttpContext) {
    return inertia.render('decks/create', {})
  }

  async store({ auth, request, response, session }: HttpContext) {
    const payload = await request.validateUsing(deckValidator)
    const deck = await Deck.create({
      userId: auth.user!.id,
      name: payload.name,
      description: payload.description || null,
      newCardsPerDay: payload.newCardsPerDay ?? 15,
    })

    session.flash('success', 'Paquet créé')
    return response.redirect().toRoute('decks.show', { id: deck.id })
  }

  async show({ auth, params, request, inertia }: HttpContext) {
    const deck = await StudyService.ownedDeck(auth.user!.id, params.id)
    const query = String(request.input('q', '')).trim()
    const page = Math.max(1, Number.parseInt(String(request.input('page', 1)), 10) || 1)
    const cardsQuery = Card.query().where('deckId', deck.id).orderBy('createdAt', 'desc')

    if (query) {
      const term = query.replace(/[%_]/g, '')
      cardsQuery.where((builder) => {
        builder
          .where('front', 'like', `%${term}%`)
          .orWhere('back', 'like', `%${term}%`)
          .orWhere('explanation', 'like', `%${term}%`)
      })
    }

    const paginator = await cardsQuery.paginate(page, CARDS_PER_PAGE)
    const stats = await StudyService.stats(auth.user!.id, deck.id)

    return inertia.render('decks/show', {
      deck: DeckTransformer.transform(deck),
      cards: CardTransformer.transform(paginator.all()),
      stats,
      filters: { q: query },
      pagination: {
        page: paginator.currentPage,
        lastPage: paginator.lastPage,
        total: paginator.total,
        perPage: paginator.perPage,
      },
    })
  }

  async edit({ auth, params, inertia }: HttpContext) {
    const deck = await StudyService.ownedDeck(auth.user!.id, params.id)

    return inertia.render('decks/edit', {
      deck: DeckTransformer.transform(deck),
    })
  }

  async update({ auth, params, request, response, session }: HttpContext) {
    const deck = await StudyService.ownedDeck(auth.user!.id, params.id)
    const payload = await request.validateUsing(deckValidator)

    await deck
      .merge({
        name: payload.name,
        description: payload.description || null,
        newCardsPerDay: payload.newCardsPerDay ?? deck.newCardsPerDay,
      })
      .save()

    session.flash('success', 'Paramètres enregistrés')
    return response.redirect().toRoute('decks.show', { id: deck.id })
  }

  async destroy({ auth, params, response, session }: HttpContext) {
    const deck = await StudyService.ownedDeck(auth.user!.id, params.id)
    await deck.delete()

    session.flash('success', 'Paquet supprimé')
    return response.redirect().toRoute('home')
  }

  async example({ auth, response, session }: HttpContext) {
    const deck = await Deck.firstOrCreate(
      { userId: auth.user!.id, name: STARTER_DECK_NAME },
      {
        userId: auth.user!.id,
        name: STARTER_DECK_NAME,
        description: 'Phrases du quotidien, français → anglais.',
        newCardsPerDay: 15,
      }
    )

    const existing = await Card.query().where('deckId', deck.id).select('front')
    const existingFronts = new Set(existing.map((card) => card.front))
    const toCreate = STARTER_CARDS.filter((card) => !existingFronts.has(card.front))

    if (toCreate.length > 0) {
      const now = DateTime.utc()
      await deck.related('cards').createMany(
        toCreate.map((card) => ({
          front: card.front,
          back: card.back,
          explanation: card.explanation ?? null,
          dueAt: now,
          interval: 0,
          ease: DEFAULT_EASE,
          repetitions: 0,
          lapses: 0,
        }))
      )
    }

    session.flash(
      'success',
      toCreate.length > 0
        ? `${toCreate.length} carte${toCreate.length > 1 ? 's' : ''} ajoutée${toCreate.length > 1 ? 's' : ''} — tu peux réviser`
        : 'Le paquet d’anglais est déjà complet'
    )
    return response.redirect().toRoute('decks.show', { id: deck.id })
  }

  async export({ auth, params, response }: HttpContext) {
    const deck = await StudyService.ownedDeck(auth.user!.id, params.id)
    const cards = await Card.query().where('deckId', deck.id).orderBy('createdAt', 'asc')
    const payload = serializeDeck(deck, cards)
    const filename = filenameForDeck(deck.name)

    response.header('Content-Type', 'application/json; charset=utf-8')
    response.header('Content-Disposition', `attachment; filename="${filename}"`)
    return response.send(JSON.stringify(payload, null, 2))
  }

  async import({ auth, request, response, session }: HttpContext) {
    const { file } = await request.validateUsing(deckImportFileValidator)
    if (!file.tmpPath) {
      session.flash('error', 'Impossible de lire le fichier')
      return response.redirect().toRoute('home')
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(await readFile(file.tmpPath, 'utf8'))
    } catch {
      session.flash('error', 'Fichier JSON invalide')
      return response.redirect().toRoute('home')
    }

    let payload: Awaited<ReturnType<typeof importedDeckValidator.validate>>
    try {
      payload = await importedDeckValidator.validate(parsed)
    } catch {
      session.flash('error', 'Ce JSON n’est pas un paquet Mémoire (nom + cartes front/back)')
      return response.redirect().toRoute('home')
    }

    const deck = await db.transaction(async (trx) => {
      const created = await Deck.create(
        {
          userId: auth.user!.id,
          name: payload.deck.name,
          description: payload.deck.description || null,
          newCardsPerDay: payload.deck.newCardsPerDay ?? 15,
        },
        { client: trx }
      )

      await Card.createMany(
        payload.cards.map((card) => ({
          deckId: created.id,
          ...cardCreatePayload(card),
        })),
        { client: trx }
      )

      return created
    })

    session.flash('success', `Paquet importé · ${payload.cards.length} cartes`)
    return response.redirect().toRoute('decks.show', { id: deck.id })
  }
}
