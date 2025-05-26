import { createFileRoute } from '@tanstack/react-router'
import Desktop from '@/components/Desktop'

export const Route = createFileRoute('/desktop')({
  component: App,
})

function App() {
  return (
    <Desktop />
  )
}
