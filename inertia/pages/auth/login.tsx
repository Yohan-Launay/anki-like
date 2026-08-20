import { Form } from '@adonisjs/inertia/react'
import { Link } from '@adonisjs/inertia/react'

export default function Login() {
  return (
    <div className="form-container">
      <div>
        <h1>Connexion</h1>
        <p>Un seul compte, pour tes révisions du jour.</p>
      </div>

      <div>
        <Form route="session.store">
          {({ errors }) => (
            <>
              <div>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="username"
                  data-invalid={errors.email ? 'true' : undefined}
                />
                {errors.email && <div>{errors.email}</div>}
              </div>

              <div>
                <label htmlFor="password">Mot de passe</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="current-password"
                />
                {errors.password ? <span>{errors.password}</span> : ''}
              </div>

              <div>
                <button type="submit">Se connecter</button>
              </div>
            </>
          )}
        </Form>
        <p className="form-switch">
          Pas encore de compte ? <Link route="new_account.create">Créer un compte</Link>
        </p>
      </div>
    </div>
  )
}
