export {}

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: { client_id: string; callback: (response: { credential: string }) => void }) => void
          renderButton: (
            parent: HTMLElement,
            options: {
              theme?: string
              size?: string
              text?: string
              shape?: string
              width?: string | number
              logo_alignment?: string
            },
          ) => void
          prompt?: () => void
        }
      }
    }
  }
}
