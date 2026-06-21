import { createContext, type ReactNode } from "react"

export const ScrollContainerContext = createContext<{ current: HTMLElement | null } | null>(null)

export function ScrollContainerProvider({
  children,
  container,
}: {
  children: ReactNode
  container: { current: HTMLElement | null }
}) {
  return (
    <ScrollContainerContext.Provider value={container}>
      {children}
    </ScrollContainerContext.Provider>
  )
}
