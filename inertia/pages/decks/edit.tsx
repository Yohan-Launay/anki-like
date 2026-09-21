import { type Data } from '@generated/data'
import { type InertiaProps } from '~/types'
import { Form, Link } from '@adonisjs/inertia/react'
import { DownloadIcon, TrashIcon } from '~/components/icons'

export default function DeckSettings({ deck }: InertiaProps<{ deck: Data.Deck }>) {
  return (
    <div className="page page-narrow">
      <p className="eyebrow">
        <Link route="home">Accueil</Link> /{' '}
        <Link route="decks.show" routeParams={{ id: deck.id }}>
          {deck.name}
        </Link>{' '}
        / Paramètres
      </p>
      <h1>Paramètres du paquet</h1>
      <p className="lede">Nom, description, et combien de nouvelles cartes par jour.</p>

      <Form route="decks.update" routeParams={{ id: deck.id }} className="stack-form">
        {({ errors }) => (
          <>
            <div>
              <label htmlFor="name">Nom</label>
              <input
                type="text"
                name="name"
                id="name"
                defaultValue={deck.name}
                data-invalid={errors.name ? 'true' : undefined}
              />
              {errors.name && <div>{errors.name}</div>}
            </div>
            <div>
              <label htmlFor="description">Description (optionnel)</label>
              <textarea
                name="description"
                id="description"
                rows={3}
                defaultValue={deck.description ?? ''}
                data-invalid={errors.description ? 'true' : undefined}
              />
              {errors.description && <div>{errors.description}</div>}
            </div>
            <div>
              <label htmlFor="newCardsPerDay">Nouvelles cartes par jour</label>
              <input
                type="number"
                name="newCardsPerDay"
                id="newCardsPerDay"
                min={0}
                max={50}
                defaultValue={deck.newCardsPerDay}
                data-invalid={errors.newCardsPerDay ? 'true' : undefined}
              />
              {errors.newCardsPerDay && <div>{errors.newCardsPerDay}</div>}
              <p className="field-hint">
                10 à 15 est un bon rythme. Ça limite aussi les révisions du jour. 0 = uniquement
                les révisions (plafonnées à 15).
              </p>
            </div>
            <button type="submit">Enregistrer</button>
          </>
        )}
      </Form>

      <section className="export-zone">
        <h2>Exporter</h2>
        <p className="muted">
          Télécharge un fichier JSON (cartes et progression). Tu pourras le réimporter plus tard.
        </p>
        <a href={`/decks/${deck.id}/export`} className="button button-secondary">
          <DownloadIcon />
          Télécharger le JSON
        </a>
      </section>

      <section className="danger-zone">
        <h2>Zone dangereuse</h2>
        <p className="muted">Supprime le paquet et toutes ses cartes. Irréversible.</p>
        <Form
          route="decks.destroy"
          routeParams={{ id: deck.id }}
          onSubmit={(event) => {
            if (!confirm('Supprimer ce paquet et toutes ses cartes ?')) {
              event.preventDefault()
            }
          }}
        >
          <button type="submit" className="button button-danger">
            <TrashIcon />
            Supprimer le paquet
          </button>
        </Form>
      </section>
    </div>
  )
}
