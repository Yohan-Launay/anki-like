import { Form, Link } from '@adonisjs/inertia/react'

export default function CreateDeck() {
  return (
    <div className="page page-narrow">
      <p className="eyebrow">
        <Link route="home">Accueil</Link> / Nouveau paquet
      </p>
      <h1>Créer un paquet</h1>
      <p className="lede">Un paquet = un thème. Exemple : Anglais, vocabulaire CSS, capitales…</p>

      <Form route="decks.store" className="stack-form">
        {({ errors }) => (
          <>
            <div>
              <label htmlFor="name">Nom</label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Anglais"
                autoFocus
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
                placeholder="Phrases du quotidien, français → anglais"
                data-invalid={errors.description ? 'true' : undefined}
              />
              {errors.description && <div>{errors.description}</div>}
            </div>
            <button type="submit">Créer le paquet</button>
          </>
        )}
      </Form>
    </div>
  )
}
