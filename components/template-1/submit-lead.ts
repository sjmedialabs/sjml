import type { Template1LeadFormValues } from "./default-data"

export async function submitTemplate1Lead(
  values: Template1LeadFormValues,
  source: "website" | "website_popup",
) {
  const response = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: values.fullName,
      email: values.businessEmail,
      phone: values.phoneNumber,
      message: values.message,
      subject: "Template 1 enquiry",
      source,
      page: window.location.pathname,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to submit your enquiry. Please try again.")
  }
}
