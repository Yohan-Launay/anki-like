import { useEffect, useId, useRef, type MouseEvent } from 'react'
import { HelpIcon } from '~/components/icons'

const RATINGS_HELP = [
  {
    key: '1',
    name: 'Encore',
    chip: 'again',
    summary: 'Tu ne savais pas.',
    detail: 'La carte revient tout de suite, à la fin de cette session. On recommence demain si besoin.',
  },
  {
    key: '2',
    name: 'Difficile',
    chip: 'hard',
    summary: 'Tu as trouvé, mais ça a coincé.',
    detail: 'Elle revient demain (un peu plus tard si tu la connais déjà).',
  },
  {
    key: '3',
    name: 'Bien',
    chip: 'good',
    summary: 'Réponse normale, sans forcer.',
    detail: 'Nouvelle carte : demain, puis de plus en plus loin. C’est le choix par défaut.',
  },
  {
    key: '4',
    name: 'Facile',
    chip: 'easy',
    summary: 'Évident, presque trop.',
    detail: 'Elle revient dans plusieurs jours. À utiliser si tu la connais vraiment par cœur.',
  },
] as const

export default function RatingHelp() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        dialogRef.current?.close()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function open() {
    dialogRef.current?.showModal()
  }

  function closeOnBackdrop(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === dialogRef.current) {
      dialogRef.current.close()
    }
  }

  return (
    <>
      <button
        type="button"
        className="icon-button rating-help-trigger"
        onClick={open}
        title="À quoi servent les boutons ?"
        aria-haspopup="dialog"
        aria-label="À quoi servent Encore, Difficile, Bien et Facile ?"
      >
        <HelpIcon />
      </button>

      <dialog
        ref={dialogRef}
        className="help-modal"
        aria-labelledby={titleId}
        onClick={closeOnBackdrop}
      >
        <div className="help-modal-card">
          <p className="eyebrow">Révision</p>
          <h2 id={titleId}>Comment noter une carte</h2>
          <p className="help-modal-lede">
            Après le verso, choisis selon l’effort — pas selon si la phrase est jolie.
          </p>
          <ul className="help-rating-list">
            {RATINGS_HELP.map((rating) => (
              <li key={rating.key}>
                <span className={`help-chip help-chip-${rating.chip}`}>
                  {rating.name} <kbd>{rating.key}</kbd>
                </span>
                <strong>{rating.summary}</strong>
                <span>{rating.detail}</span>
              </li>
            ))}
          </ul>
          <button type="button" className="button" onClick={() => dialogRef.current?.close()}>
            Compris
          </button>
        </div>
      </dialog>
    </>
  )
}
