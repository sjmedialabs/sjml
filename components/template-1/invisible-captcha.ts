type Grecaptcha = {
  ready: (callback: () => void) => void
  render: (
    container: HTMLElement,
    options: {
      sitekey: string
      size: "invisible"
      badge?: "bottomright" | "bottomleft" | "inline"
      callback: (token: string) => void
      "error-callback"?: () => void
    },
  ) => number
  execute: (widgetId: number) => void
  reset: (widgetId: number) => void
}

declare global {
  interface Window {
    grecaptcha?: Grecaptcha
  }
}

let scriptPromise: Promise<void> | null = null

const pending = new WeakMap<
  HTMLElement,
  { resolve: (token: string) => void; reject: (error: Error) => void }
>()

function loadRecaptchaScript() {
  if (window.grecaptcha) return Promise.resolve()
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.src = "https://www.google.com/recaptcha/api.js?render=explicit"
    script.async = true
    script.defer = true
    script.dataset.recaptcha = "invisible"
    script.onload = () => resolve()
    script.onerror = () => {
      scriptPromise = null
      reject(new Error("Captcha failed to load"))
    }
    document.head.appendChild(script)
  })

  return scriptPromise
}

export async function executeInvisibleCaptcha(container: HTMLElement, siteKey: string) {
  await loadRecaptchaScript()
  const grecaptcha = window.grecaptcha
  if (!grecaptcha) throw new Error("Captcha failed to load")

  await new Promise<void>((resolve) => grecaptcha.ready(resolve))

  let widgetId = container.dataset.widgetId
  if (!widgetId) {
    const id = grecaptcha.render(container, {
      sitekey: siteKey,
      size: "invisible",
      badge: "bottomright",
      callback: (token) => {
        pending.get(container)?.resolve(token)
        pending.delete(container)
        grecaptcha.reset(id)
      },
      "error-callback": () => {
        pending.get(container)?.reject(new Error("Captcha verification failed"))
        pending.delete(container)
        grecaptcha.reset(id)
      },
    })
    widgetId = String(id)
    container.dataset.widgetId = widgetId
  }

  return new Promise<string>((resolve, reject) => {
    pending.set(container, { resolve, reject })
    grecaptcha.execute(Number(widgetId))
  })
}
