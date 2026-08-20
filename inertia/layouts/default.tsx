import { type Data } from '@generated/data'
import { toast, Toaster } from 'sonner'
import { usePage } from '@inertiajs/react'
import { type ReactElement, useEffect } from 'react'
import { Form, Link } from '@adonisjs/inertia/react'

export default function Layout({ children }: { children: ReactElement<Data.SharedProps> }) {
  const { url, flash } = usePage()
  useEffect(() => {
    toast.dismiss()
  }, [url])

  useEffect(() => {
    if (flash.error) {
      toast.error(flash.error)
    }
    if (flash.success) {
      toast.success(flash.success)
    }
  })

  return (
    <>
      <header>
        <div>
          <div>
            <Link route="home" className="brand">
              Mémoire
            </Link>
          </div>
          <div>
            <nav>
              {children.props.user ? (
                <>
                  <Link route="home">Aujourd’hui</Link>
                  <Link route="study.show" className="button button-sm">
                    Réviser
                  </Link>
                  <span className="avatar">{children.props.user.initials}</span>
                  <Form route="session.destroy">
                    <button type="submit" className="nav-button">
                      Déconnexion
                    </button>
                  </Form>
                </>
              ) : (
                <>
                  <Link route="new_account.create">Inscription</Link>
                  <Link route="session.create">Connexion</Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <Toaster position="top-center" richColors />
    </>
  )
}
