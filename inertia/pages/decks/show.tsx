import { type Data } from '@generated/data'
import { type InertiaProps } from '~/types'
import { Form, Link, useRouter } from '@adonisjs/inertia/react'
import GearIcon from '~/components/gear_icon'
import { PencilIcon, PlayIcon, PlusIcon, TrashIcon } from '~/components/icons'
import { useEffect, useState } from 'react'

const MIN_SEARCH_CHARS = 2

type ShowDeckProps = InertiaProps<{
  deck: Data.Deck
  cards: Data.Card[]
  stats: {
    dueCount: number
    newCount: number
    reviewCount: number
  }
  filters: { q: string }
  pagination: {
    page: number
    lastPage: number
    total: number
    perPage: number
  }
}>

export default function ShowDeck({ deck, cards, stats, filters, pagination }: ShowDeckProps) {
  const listQs = (page: number) => {
    const qs: Record<string, string> = {}
    if (filters.q) {
      qs.q = filters.q
    }
    if (page > 1) {
      qs.page = String(page)
    }
    return qs
  }

  return (
    <div className="page">
      <p className="eyebrow">
        <Link route="home">Accueil</Link> / {deck.name}
      </p>

      <div className="section-header">
        <div>
          <h1>{deck.name}</h1>
          {deck.description ? <p className="lede">{deck.description}</p> : null}
          <p className="muted">
            {stats.dueCount} à réviser · {pagination.total} carte{pagination.total > 1 ? 's' : ''} ·{' '}
            {deck.newCardsPerDay} nouvelle{deck.newCardsPerDay > 1 ? 's' : ''} / jour
          </p>
        </div>
        <div className="actions">
          {stats.dueCount > 0 ? (
            <Link route="study.show" qs={{ deck: String(deck.id) }} className="button">
              <PlayIcon size={16} />
              Réviser
            </Link>
          ) : null}
          <Link
            route="decks.edit"
            routeParams={{ id: deck.id }}
            className="icon-button"
            title="Paramètres"
            aria-label="Paramètres du paquet"
          >
            <GearIcon />
          </Link>
        </div>
      </div>

      <section className="panel">
        <h2>Ajouter une carte</h2>
        <p className="muted">
          Recto = la question. Verso = la réponse. L’explication est optionnelle (contexte, exemple,
          prononciation…).
        </p>
        <Form
          route="cards.store"
          routeParams={{ id: deck.id }}
          className="card-form"
          resetOnSuccess
        >
          {({ errors, processing }) => (
            <>
              <div>
                <label htmlFor="front">Recto</label>
                <textarea
                  name="front"
                  id="front"
                  rows={3}
                  placeholder="Je voudrais…"
                  data-invalid={errors.front ? 'true' : undefined}
                />
                {errors.front && <div>{errors.front}</div>}
              </div>
              <div>
                <label htmlFor="back">Verso</label>
                <textarea
                  name="back"
                  id="back"
                  rows={3}
                  placeholder="I would like…"
                  data-invalid={errors.back ? 'true' : undefined}
                />
                {errors.back && <div>{errors.back}</div>}
              </div>
              <div className="field-wide">
                <label htmlFor="explanation">Explication (optionnel)</label>
                <textarea
                  name="explanation"
                  id="explanation"
                  rows={2}
                  placeholder="Polite request. Often followed by a noun: I would like a coffee."
                  data-invalid={errors.explanation ? 'true' : undefined}
                />
                {errors.explanation && <div>{errors.explanation}</div>}
              </div>
              <button type="submit" disabled={processing}>
                <PlusIcon size={16} />
                {processing ? 'Ajout…' : 'Ajouter'}
              </button>
            </>
          )}
        </Form>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Cartes</h2>
        </div>

        <DeckSearch deckId={deck.id} query={filters.q} resultCount={pagination.total} />

        {cards.length === 0 ? (
          <p className="muted">
            {filters.q
              ? 'Aucune carte ne correspond à cette recherche.'
              : 'Aucune carte pour l’instant.'}
          </p>
        ) : (
          <>
            <ul className="card-list">
              {cards.map((card) => (
                <li key={card.id}>
                  <div>
                    <strong>{card.front}</strong>
                    <span>{card.back}</span>
                    {card.explanation ? (
                      <em className="card-explanation">{card.explanation}</em>
                    ) : null}
                  </div>
                  <div className="actions">
                    <Link
                      route="cards.edit"
                      routeParams={{ id: card.id }}
                      className="button button-secondary button-sm"
                    >
                      <PencilIcon />
                      Modifier
                    </Link>
                    <Form
                      route="cards.destroy"
                      routeParams={{ id: card.id }}
                      onSubmit={(event) => {
                        if (!confirm('Supprimer cette carte ?')) {
                          event.preventDefault()
                        }
                      }}
                    >
                      <button type="submit" className="button button-danger-ghost button-sm">
                        <TrashIcon />
                        Supprimer
                      </button>
                    </Form>
                  </div>
                </li>
              ))}
            </ul>

            {pagination.lastPage > 1 ? (
              <nav className="pagination" aria-label="Pagination">
                {pagination.page > 1 ? (
                  <Link
                    route="decks.show"
                    routeParams={{ id: deck.id }}
                    qs={listQs(pagination.page - 1)}
                    className="button button-secondary"
                  >
                    Précédent
                  </Link>
                ) : (
                  <span />
                )}
                <span>
                  Page {pagination.page} / {pagination.lastPage}
                </span>
                {pagination.page < pagination.lastPage ? (
                  <Link
                    route="decks.show"
                    routeParams={{ id: deck.id }}
                    qs={listQs(pagination.page + 1)}
                    className="button button-secondary"
                  >
                    Suivant
                  </Link>
                ) : (
                  <span />
                )}
              </nav>
            ) : null}
          </>
        )}
      </section>
    </div>
  )
}

function DeckSearch({
  deckId,
  query,
  resultCount,
}: {
  deckId: number
  query: string
  resultCount: number
}) {
  const router = useRouter()
  const [value, setValue] = useState(query)
  const term = value.trim()
  const waitingForMore = term.length > 0 && term.length < MIN_SEARCH_CHARS

  useEffect(() => {
    const nextQuery = term.length >= MIN_SEARCH_CHARS ? term : ''
    if (nextQuery === query) {
      return
    }

    const timer = window.setTimeout(() => {
      router.get(
        {
          route: 'decks.show',
          routeParams: { id: deckId },
          qs: nextQuery ? { q: nextQuery } : {},
        },
        {},
        {
          preserveState: true,
          preserveScroll: true,
          replace: true,
        }
      )
    }, 300)

    return () => window.clearTimeout(timer)
  }, [deckId, query, router, term])

  return (
    <div className="search-form">
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Chercher un mot, une phrase…"
        aria-label="Rechercher dans le paquet"
        autoComplete="off"
      />
      {value ? (
        <button type="button" className="button button-ghost button-sm" onClick={() => setValue('')}>
          Effacer
        </button>
      ) : null}
      {waitingForMore ? (
        <p className="muted search-summary">Encore une lettre pour lancer la recherche.</p>
      ) : null}
      {query ? (
        <p className="muted search-summary">
          {resultCount} résultat{resultCount > 1 ? 's' : ''} pour « {query} »
        </p>
      ) : null}
    </div>
  )
}
