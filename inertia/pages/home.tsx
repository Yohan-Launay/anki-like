import { type Data } from '@generated/data'
import { type InertiaProps } from '~/types'
import { Form, Link } from '@adonisjs/inertia/react'
import { usePage } from '@inertiajs/react'
import GearIcon from '~/components/gear_icon'
import { PlayIcon, PlusIcon, UploadIcon } from '~/components/icons'

type HomeProps = InertiaProps<{
  decks?: Data.Deck[]
  stats?: {
    dueCount: number
    newCount: number
    reviewCount: number
  }
}>

export default function Home({ decks = [], stats }: HomeProps) {
  const { user } = usePage().props

  if (!user) {
    return <Landing />
  }

  return (
    <div className="page">
      <section className="session-hero">
        <p className="eyebrow">Aujourd’hui</p>
        <h1>
          {stats && stats.dueCount > 0
            ? `${stats.dueCount} carte${stats.dueCount > 1 ? 's' : ''} à revoir`
            : 'Rien à réviser pour le moment'}
        </h1>
        <p>
          {stats && stats.dueCount > 0
            ? `${stats.reviewCount} révision${stats.reviewCount > 1 ? 's' : ''} · ${stats.newCount} nouvelle${stats.newCount > 1 ? 's' : ''}`
            : 'Ajoute des cartes, ou reviens demain. Le plus important, c’est d’ouvrir l’app.'}
        </p>
        {stats && stats.dueCount > 0 ? (
          <Link route="study.show" className="button button-lg">
            <PlayIcon />
            Commencer la session
          </Link>
        ) : (
          <Link route="decks.create" className="button button-lg button-secondary">
            <PlusIcon />
            Créer un paquet
          </Link>
        )}
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Paquets</h2>
          <div className="actions">
            <ImportJsonButton />
            <Link route="decks.create" className="button button-secondary">
              <PlusIcon />
              Nouveau paquet
            </Link>
          </div>
        </div>

        {decks.length === 0 ? (
          <div className="empty-state">
            <h3>Ton premier paquet</h3>
            <p>
              Commence par l’anglais, ou crée un paquet vide et ajoute tes propres cartes — comme
              sur Anki.
            </p>
            <div className="actions">
              <Form route="decks.example">
                {({ processing }) => (
                  <button type="submit" className="button" disabled={processing}>
                    {processing ? 'Ajout…' : 'Ajouter le paquet d’anglais'}
                  </button>
                )}
              </Form>
              <Link route="decks.create" className="button button-secondary">
                <PlusIcon />
                Créer le mien
              </Link>
            </div>
          </div>
        ) : (
          <div className="deck-grid">
            {decks.map((deck) => (
              <article className="deck-card" key={deck.id}>
                <div className="deck-card-top">
                  <Link route="decks.show" routeParams={{ id: deck.id }} className="deck-card-body">
                    <h3>{deck.name}</h3>
                    {deck.description ? <p>{deck.description}</p> : null}
                    <div className="deck-meta">
                      <span>
                        {deck.dueCount} due{deck.dueCount > 1 ? 's' : ''}
                      </span>
                      <span>
                        {deck.cardsCount} carte{deck.cardsCount > 1 ? 's' : ''}
                      </span>
                    </div>
                  </Link>
                  <Link
                    route="decks.edit"
                    routeParams={{ id: deck.id }}
                    className="icon-button"
                    title="Paramètres"
                    aria-label={`Paramètres de ${deck.name}`}
                  >
                    <GearIcon />
                  </Link>
                </div>
                {deck.dueCount > 0 ? (
                  <Link route="study.show" qs={{ deck: String(deck.id) }} className="button">
                    <PlayIcon size={16} />
                    Réviser
                  </Link>
                ) : (
                  <span className="deck-caught-up">À jour</span>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function ImportJsonButton() {
  return (
    <Form route="decks.import" className="import-form" encType="multipart/form-data">
      {({ errors, processing }) => (
        <>
          <label className={`button button-secondary${processing ? ' is-disabled' : ''}`}>
            <UploadIcon />
            {processing ? 'Import…' : 'Importer'}
            <input
              type="file"
              name="file"
              accept=".json,application/json"
              disabled={processing}
              onChange={(event) => {
                if (event.currentTarget.files?.length) {
                  event.currentTarget.form?.requestSubmit()
                }
              }}
            />
          </label>
          {errors.file ? <div className="field-error">{errors.file}</div> : null}
        </>
      )}
    </Form>
  )
}

function Landing() {
  return (
    <>
      <div className="hero">
        <p className="eyebrow">À la place des réseaux</p>
        <h1>Quelques cartes, tous les jours.</h1>
        <p>
          Un Anki personnel : tu ajoutes ce que tu veux retenir, l’app te le ressort au bon moment.
          Idéal pour l’anglais, ou n’importe quoi d’autre.
        </p>
        <div className="hero-actions">
          <Link route="new_account.create" className="button button-lg">
            Créer un compte
          </Link>
          <Link route="session.create" className="button button-lg button-secondary">
            Se connecter
          </Link>
        </div>
      </div>

      <div className="cards">
        <div>
          <h3>Paquets & cartes</h3>
          <p>Recto / verso, comme sur Anki. Tu écris tes questions, tu apprends tes réponses.</p>
        </div>
        <div>
          <h3>Répétition espacée</h3>
          <p>Encore, Difficile, Bien, Facile. Ce que tu rates revient vite. Le reste s’éloigne.</p>
        </div>
        <div>
          <h3>Une session courte</h3>
          <p>Ouvre l’app, révise le tas du jour, ferme. Dix minutes valent mieux qu’un feed.</p>
        </div>
      </div>
    </>
  )
}
