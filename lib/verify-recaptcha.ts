export async function verifyRecaptcha(token: string) {
  const secret = process.env.RECAPTCHA_SECRET_KEY
  if (!secret || !token) return false

  const body = new URLSearchParams({
    secret,
    response: token,
  })

  const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  })

  if (!response.ok) return false
  const result = (await response.json()) as { success?: boolean }
  return result.success === true
}
