import { type Data } from '@generated/data'
import { type InertiaProps } from '~/types'
import { Form, Link } from '@adonisjs/inertia/react'
import { useEffect, useState } from 'react'

type StudyProps = InertiaProps<{
  card: Data.Card | null
  remaining: number
  deckId: number | null
}>

export default function StudyShow({ card, remaining, deckId }: StudyProps) {
  if (!card) {
    return (
      <div className="page page-narrow study-done">
        <p className="eyebrow">Session</p>
        <h1>C’est tout pour aujourd’hui.</h1>
        <p className="lede">
          Reviens demain — ou ajoute quelques cartes si tu as encore deux minutes.
        </p>
        <div className="actions">
          <Link route="home" className="button">
            Retour à l’accueil
          </Link>
        </div>
      </div>
    )
  }

  return <StudyCard key={card.id} card={card} remaining={remaining} deckId={deckId} />
}

function StudyCard({
  card,
  remaining,
  deckId,
}: {
  card: Data.Card
  remaining: number
  deckId: number | null
}) {
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }

      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault()
        setFlipped(true)
        return
      }

      if (!flipped) {
        return
      }

      const ratingByKey: Record<string, string> = {
        '1': 'again',
        '2': 'hard',
        '3': 'good',
        '4': 'easy',
      }
      const rating = ratingByKey[event.key]
      if (rating) {
        event.preventDefault()
        document.getElementById(`rate-${rating}`)?.click()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [flipped])

  return (
    <div className="page study-page">
      <p className="eyebrow">
        <Link route="home">Accueil</Link>
        {deckId ? (
          <>
            {' '}
            /{' '}
            <Link route="decks.show" routeParams={{ id: deckId }}>
              Paquet
            </Link>
          </>
        ) : null}{' '}
        · {remaining} restante{remaining > 1 ? 's' : ''}
      </p>

      <button type="button" className="flashcard" onClick={() => setFlipped(true)}>
        <span className="flashcard-label">{flipped ? 'Verso' : 'Recto'}</span>
        <span className="flashcard-text">{flipped ? card.back : card.front}</span>
        {flipped && card.explanation ? (
          <span className="flashcard-explanation">{card.explanation}</span>
        ) : null}
        {!flipped ? <span className="flashcard-hint">Espace ou clic pour retourner</span> : null}
      </button>

      {flipped ? (
        <div className="rating-bar">
          <RatingButton
            rating="again"
            label="Encore"
            shortcut="1"
            title="Revient à la fin de la session"
            deckId={deckId}
            cardId={card.id}
          />
          <RatingButton rating="hard" label="Difficile" shortcut="2" deckId={deckId} cardId={card.id} />
          <RatingButton rating="good" label="Bien" shortcut="3" deckId={deckId} cardId={card.id} />
          <RatingButton rating="easy" label="Facile" shortcut="4" deckId={deckId} cardId={card.id} />
        </div>
      ) : (
        <div className="study-actions">
          <button type="button" className="button button-lg" onClick={() => setFlipped(true)}>
            Voir la réponse
            <kbd>Espace</kbd>
          </button>
        </div>
      )}
    </div>
  )
}

function RatingButton({
  rating,
  label,
  shortcut,
  title,
  deckId,
  cardId,
}: {
  rating: 'again' | 'hard' | 'good' | 'easy'
  label: string
  shortcut: string
  title?: string
  deckId: number | null
  cardId: number
}) {
  return (
    <Form route="study.review" routeParams={{ id: cardId }}>
      {({ processing }) => (
        <>
          <input type="hidden" name="rating" value={rating} />
          {deckId ? <input type="hidden" name="deckId" value={deckId} /> : null}
          <button
            type="submit"
            id={`rate-${rating}`}
            className={`rating rating-${rating}`}
            disabled={processing}
            title={title}
          >
            <span>{label}</span>
            <kbd>{shortcut}</kbd>
          </button>
        </>
      )}
    </Form>
  )
}
