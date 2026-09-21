import { Form } from '@adonisjs/inertia/react'
import { BoltIcon } from '~/components/icons'

export default function Fast10Button({
  deckId,
  className = 'button button-secondary',
  label = 'Fast 10',
}: {
  deckId: number
  className?: string
  label?: string
}) {
  return (
    <Form route="study.fast" className="fast-10-form">
      {({ processing }) => (
        <>
          <input type="hidden" name="deckId" value={deckId} />
          <button
            type="submit"
            className={className}
            disabled={processing}
            title="10 cartes au hasard"
          >
            <BoltIcon />
            {processing ? '…' : label}
          </button>
        </>
      )}
    </Form>
  )
}
