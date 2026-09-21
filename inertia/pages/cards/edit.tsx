import { type Data } from '@generated/data'
import { type InertiaProps } from '~/types'
import { Form, Link } from '@adonisjs/inertia/react'

export default function EditCard({
  card,
  deck,
}: InertiaProps<{ card: Data.Card; deck: Data.Deck }>) {
  return (
    <div className="page page-narrow">
      <p className="eyebrow">
        <Link route="home">Accueil</Link> /{' '}
        <Link route="decks.show" routeParams={{ id: deck.id }}>
          {deck.name}
        </Link>{' '}
        / Modifier la carte
      </p>
      <h1>Modifier la carte</h1>
      {card.flagged ? (
        <p className="lede flagged-note">
          Signalée pendant une révision. Enregistrer enlève le signalement.
        </p>
      ) : null}

      <Form route="cards.update" routeParams={{ id: card.id }} className="stack-form">
        {({ errors }) => (
          <>
            <div>
              <label htmlFor="front">Recto</label>
              <textarea
                name="front"
                id="front"
                rows={4}
                defaultValue={card.front}
                data-invalid={errors.front ? 'true' : undefined}
              />
              {errors.front && <div>{errors.front}</div>}
            </div>
            <div>
              <label htmlFor="back">Verso</label>
              <textarea
                name="back"
                id="back"
                rows={4}
                defaultValue={card.back}
                data-invalid={errors.back ? 'true' : undefined}
              />
              {errors.back && <div>{errors.back}</div>}
            </div>
            <div>
              <label htmlFor="explanation">Explication (optionnel)</label>
              <textarea
                name="explanation"
                id="explanation"
                rows={3}
                defaultValue={card.explanation ?? ''}
                placeholder="Contexte, exemple, nuance…"
                data-invalid={errors.explanation ? 'true' : undefined}
              />
              {errors.explanation && <div>{errors.explanation}</div>}
            </div>
            <button type="submit">Enregistrer la carte</button>
          </>
        )}
      </Form>
    </div>
  )
}
