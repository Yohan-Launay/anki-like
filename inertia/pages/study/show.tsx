import { type Data } from '@generated/data'
import { type InertiaProps } from '~/types'
import { Form, Link } from '@adonisjs/inertia/react'
import { useEffect, useState } from 'react'
import Fast10Button from '~/components/fast_10_button'
import { FlagIcon } from '~/components/icons'
import RatingHelp from '~/components/rating_help'

type StudyProps = InertiaProps<{
  card: Data.Card | null
  remaining: number
  deckId: number | null
  mode: 'fast' | null
}>

export default function StudyShow({ card, remaining, deckId, mode }: StudyProps) {
  if (!card) {
    return (
      <div className="page page-narrow study-done">
        <p className="eyebrow">{mode === 'fast' ? 'Fast 10' : 'Session'}</p>
        <h1>{mode === 'fast' ? 'Round terminé.' : 'C’est tout pour aujourd’hui.'}</h1>
        <p className="lede">
          {mode === 'fast'
            ? 'Dix cartes au hasard, c’est fait. Tu peux en relancer un, ou revenir aux révisions du jour.'
            : 'Reviens demain — ou ajoute quelques cartes si tu as encore deux minutes.'}
        </p>
        <div className="actions">
          {mode === 'fast' && deckId ? (
            <Fast10Button deckId={deckId} className="button" label="Encore 10" />
          ) : null}
          <Link route="home" className="button button-secondary">
            Retour à l’accueil
          </Link>
        </div>
      </div>
    )
  }

  return (
    <StudyCard key={card.id} card={card} remaining={remaining} deckId={deckId} mode={mode} />
  )
}

function StudyCard({
  card,
  remaining,
  deckId,
  mode,
}: {
  card: Data.Card
  remaining: number
  deckId: number | null
  mode: 'fast' | null
}) {
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }

      if (document.querySelector('dialog[open]')) {
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
      <div className="study-heading">
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
          · {mode === 'fast' ? 'Fast 10 · ' : ''}
          {remaining} restante{remaining > 1 ? 's' : ''}
        </p>
        <RatingHelp />
      </div>

      <button type="button" className="flashcard" onClick={() => setFlipped(true)}>
        <span className="flashcard-label">{flipped ? 'Verso' : 'Recto'}</span>
        <span className="flashcard-text">{flipped ? card.back : card.front}</span>
        {flipped && card.explanation ? (
          <span className="flashcard-explanation">{card.explanation}</span>
        ) : null}
        {!flipped ? (
          <>
            <span className="flashcard-hint hint-keyboard">Espace ou clic pour retourner</span>
            <span className="flashcard-hint hint-touch">Appuie pour retourner</span>
          </>
        ) : null}
      </button>

      {flipped ? (
        <div className="rating-bar">
          <RatingButton
            rating="again"
            label="Encore"
            shortcut="1"
            title="Tu ne savais pas — revient dans cette session"
            deckId={deckId}
            mode={mode}
            cardId={card.id}
          />
          <RatingButton
            rating="hard"
            label="Difficile"
            shortcut="2"
            title="Trouvé, mais ça a coincé — demain"
            deckId={deckId}
            mode={mode}
            cardId={card.id}
          />
          <RatingButton
            rating="good"
            label="Bien"
            shortcut="3"
            title="Réponse normale — le rythme habituel"
            deckId={deckId}
            mode={mode}
            cardId={card.id}
          />
          <RatingButton
            rating="easy"
            label="Facile"
            shortcut="4"
            title="Évident — dans plusieurs jours"
            deckId={deckId}
            mode={mode}
            cardId={card.id}
          />
        </div>
      ) : (
        <div className="study-actions">
          <button type="button" className="button button-lg" onClick={() => setFlipped(true)}>
            Voir la réponse
            <kbd>Espace</kbd>
          </button>
        </div>
      )}

      <Form route="cards.flag" routeParams={{ id: card.id }} className="study-flag">
        {({ processing }) => (
          <>
            {deckId ? <input type="hidden" name="deckId" value={deckId} /> : null}
            {mode === 'fast' ? <input type="hidden" name="mode" value="fast" /> : null}
            <button type="submit" className="button button-ghost button-sm" disabled={processing}>
              <FlagIcon />
              {processing ? 'Envoi…' : 'Signaler une erreur'}
            </button>
          </>
        )}
      </Form>
    </div>
  )
}

function RatingButton({
  rating,
  label,
  shortcut,
  title,
  deckId,
  mode,
  cardId,
}: {
  rating: 'again' | 'hard' | 'good' | 'easy'
  label: string
  shortcut: string
  title?: string
  deckId: number | null
  mode: 'fast' | null
  cardId: number
}) {
  return (
    <Form route="study.review" routeParams={{ id: cardId }}>
      {({ processing }) => (
        <>
          <input type="hidden" name="rating" value={rating} />
          {deckId ? <input type="hidden" name="deckId" value={deckId} /> : null}
          {mode === 'fast' ? <input type="hidden" name="mode" value="fast" /> : null}
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
