import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Thread',
}

export default function Thread({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>Thread id: {params.id}</h1>
    </div>
  )
}