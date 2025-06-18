import { Suspense } from 'react'
import RedirectPage from './RedirectPage'

export default function RedirectPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RedirectPage />
    </Suspense>
  )
}