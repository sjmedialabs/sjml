import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
})

function formatValue(val: unknown): string {
  if (Array.isArray(val)) return val.length > 0 ? val.join(", ") : "—"
  if (typeof val === "string") return val.trim() || "—"
  return "—"
}

function sectionHtml(title: string, fields: { label: string; value: unknown }[]): string {
  const rows = fields
    .map(
      (f) =>
        `<tr><td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:500;width:40%;vertical-align:top;color:#374151">${f.label}</td><td style="padding:8px 12px;border:1px solid #e5e7eb;color:#1f2937">${formatValue(f.value)}</td></tr>`
    )
    .join("")
  return `<h2 style="margin:24px 0 8px;font-size:16px;color:#e63946">${title}</h2><table style="width:100%;border-collapse:collapse;margin-bottom:16px">${rows}</table>`
}

export async function sendDigitalMarketingFormEmail(data: Record<string, unknown>) {
  const body = [
    sectionHtml("1. Company Information", [
      { label: "Company Name", value: data.companyName },
      { label: "Contact Person", value: data.contactPerson },
      { label: "Email", value: data.email },
      { label: "Phone", value: data.phone },
      { label: "Website", value: data.website },
    ]),
    sectionHtml("2. Project Overview", [
      { label: "Industry", value: data.industry },
      { label: "Product Name(s)", value: data.productName },
      { label: "Product Description", value: data.businessDesc },
      { label: "Product Stage", value: data.productStage },
      { label: "USP", value: data.usp },
      { label: "Pricing Model", value: data.pricingModel },
      { label: "Primary Business Goals", value: data.goals },
      { label: "Goals Details", value: data.goalsDetails },
      { label: "Business Model", value: data.businessType },
      { label: "Years in Operation", value: data.yearsInOperation },
      { label: "Monthly Budget Range", value: data.budget },
      { label: "Timeline", value: data.timeline },
      { label: "Revenue Target", value: data.revenueTarget },
      { label: "User/Signup Target", value: data.userTarget },
      { label: "Target CPA", value: data.costPerLead },
      { label: "Customer LTV", value: data.customerLTV },
    ]),
    sectionHtml("3. Current Marketing Status", [
      { label: "Has Website", value: data.hasWebsite },
      { label: "Social Media Links", value: data.socialMediaLinks },
      { label: "Existing Channels", value: data.channels },
      { label: "Previous Campaigns", value: data.campaigns },
      { label: "Analytics Tools", value: data.analytics },
      { label: "Google Analytics Access", value: data.googleAnalytics },
      { label: "Conversion Tracking", value: data.conversionTracking },
      { label: "Google Ads Account", value: data.googleAdsAccount },
      { label: "Meta Business Manager", value: data.metaBusinessManager },
    ]),
    sectionHtml("4. Services Required", [
      { label: "Selected Services", value: data.services },
    ]),
    sectionHtml("5. Target Audience Details", [
      { label: "Target Geography", value: data.targetGeography },
      { label: "Customer Type", value: data.targetCustomerType },
      { label: "Age Group", value: data.ageGroup },
      { label: "Gender Focus", value: data.genderFocus },
      { label: "Income Level", value: data.demographics },
      { label: "Decision Makers", value: data.decisionMakers },
      { label: "Technical Level", value: data.technicalLevel },
      { label: "Pain Points", value: data.painPoints },
      { label: "Audience Hangouts", value: data.interests },
    ]),
    sectionHtml("6. Competitor Analysis", [
      { label: "Main Competitors", value: data.competitors },
      { label: "Strengths/Weaknesses", value: data.compStrengths },
    ]),
    sectionHtml("7. Brand Guidelines", [
      { label: "Brand Tone", value: data.brandVoice },
      { label: "Has Brand Guidelines", value: data.hasBrandGuidelines },
      { label: "Brand Assets", value: data.brandAssets },
    ]),
    sectionHtml("8. Success Metrics", [
      { label: "KPIs", value: data.successMetrics },
      { label: "Target ROAS", value: data.expectedROAS },
      { label: "Expected Timeline", value: data.expectedTimeline },
      { label: "Reporting Frequency", value: data.reportingFrequency },
    ]),
    sectionHtml("9. Budget & Investment", [
      { label: "Yearly Marketing Budget", value: data.yearlyMarketingBudget },
      { label: "Monthly Ad Spend", value: data.monthlyAdSpend },
      { label: "Promotional Budget", value: data.promotionalBudget },
      { label: "Budget Allocation", value: data.budgetAllocation },
      { label: "Budget Flexibility", value: data.budgetFlexibility },
      { label: "Previous Spend", value: data.previousMarketingSpend },
      { label: "Approval Process", value: data.budgetApprovalProcess },
      { label: "Budget Notes", value: data.budgetNotes },
    ]),
    sectionHtml("10. Custom Software Development", [
      { label: "Offers Software Dev", value: data.offerSoftwareDev },
      { label: "Technologies", value: data.technologies },
      { label: "Tech Stack Details", value: data.techStackDetails },
      { label: "Industries Served", value: data.industriesServed },
      { label: "Min Ticket Size", value: data.minTicketSize },
      { label: "Project Types", value: data.projectTypes },
      { label: "Team Size", value: data.teamSize },
      { label: "Avg Project Duration", value: data.avgProjectDuration },
    ]),
    sectionHtml("11. Additional Information", [
      { label: "Challenges/Expectations", value: data.challenges },
      { label: "Additional Info", value: data.additionalInfo },
    ]),
  ].join("")

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:Arial,sans-serif;max-width:800px;margin:0 auto;padding:20px;background:#f9fafb"><h1 style="color:#e63946;font-size:20px;border-bottom:2px solid #e63946;padding-bottom:8px">New Digital Marketing Requirement Form Submission</h1><p style="color:#6b7280;font-size:14px">Submitted on ${new Date().toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}</p>${body}</body></html>`

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@sjmedialabs.com",
    to: "sridhar@sjmedialabs.com",
    subject: "New Digital Marketing Requirement Form Submission",
    html,
  })
}

export async function sendRestaurantMarketingFormEmail(data: Record<string, unknown>) {
  const body = [
    sectionHtml("1. Restaurant Information", [
      { label: "Restaurant Name", value: data.restaurantName },
      { label: "Contact Person", value: data.contactPerson },
      { label: "Email", value: data.email },
      { label: "Phone", value: data.phone },
      { label: "Website", value: data.website },
    ]),
    sectionHtml("2. Restaurant Overview", [
      { label: "Cuisine Type", value: data.cuisineType },
      { label: "Restaurant Type", value: data.restaurantType },
      { label: "Number of Locations", value: data.numberOfLocations },
      { label: "Primary Location Address", value: data.primaryLocationAddress },
      { label: "Google Maps Link", value: data.googleMapsLink },
      { label: "Brand Voice / Tone", value: data.brandVoice },
      { label: "USP", value: data.usp },
      { label: "Average Price Range", value: data.avgPriceRange },
      { label: "Signature Menu Items", value: data.signatureMenuItems },
      { label: "Menu Categories", value: data.menuCategories },
      { label: "Menu Link / PDF", value: data.menuLink },
    ]),
    sectionHtml("3. Marketing Objectives", [
      { label: "Primary Marketing Goal", value: data.primaryGoal },
      { label: "Secondary Goals", value: data.secondaryGoals },
      { label: "Campaign Timeline", value: data.campaignTimeline },
      { label: "Campaign Start Date", value: data.campaignStartDate },
      { label: "Specific KPI Targets", value: data.specificKPITargets },
    ]),
    sectionHtml("4. Target Audience", [
      { label: "Target Age Group", value: data.targetAgeGroup },
      { label: "Target Demographics", value: data.targetDemographics },
      { label: "Household Income Level", value: data.householdIncome },
      { label: "Geographic Target Radius", value: data.geographicRadius },
      { label: "Customer Interests & Behavior", value: data.customerInterests },
    ]),
    sectionHtml("5. Digital Marketing Channels", [
      { label: "Selected Channels", value: data.channels },
    ]),
    sectionHtml("6. Content Strategy", [
      { label: "Content Types Required", value: data.contentTypes },
      { label: "Posting Frequency", value: data.postingFrequency },
    ]),
    sectionHtml("7. Budget & Allocation", [
      { label: "Monthly Budget Range", value: data.monthlyBudget },
      { label: "Yearly Budget Range", value: data.yearlyBudget },
      { label: "Monthly Ad Spend", value: data.monthlyAdSpend },
      { label: "Budget Flexibility", value: data.budgetFlexibility },
      { label: "Budget Allocation Preferences", value: data.budgetAllocation },
    ]),
    sectionHtml("8. Success Metrics (KPIs)", [
      { label: "KPIs", value: data.kpis },
      { label: "Target ROAS", value: data.targetROAS },
      { label: "Reporting Frequency", value: data.reportingFrequency },
    ]),
    sectionHtml("9. Current Marketing Status", [
      { label: "Website Status", value: data.websiteStatus },
      { label: "Social Media Links", value: data.socialMediaLinks },
      { label: "Analytics Tools", value: data.analyticsTools },
      { label: "Google Analytics Access", value: data.googleAnalyticsAccess },
      { label: "Conversion Tracking", value: data.conversionTracking },
    ]),
    sectionHtml("10. Competitor Analysis", [
      { label: "Main Competitors", value: data.mainCompetitors },
      { label: "Competitor Strengths / Weaknesses", value: data.competitorStrengths },
    ]),
    sectionHtml("11. Additional Requirements", [
      { label: "Special Requests / Notes", value: data.specialRequests },
      { label: "Preferred Communication", value: data.preferredCommunication },
      { label: "Urgency Level", value: data.urgencyLevel },
    ]),
  ].join("")

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:Arial,sans-serif;max-width:800px;margin:0 auto;padding:20px;background:#f9fafb"><h1 style="color:#e63946;font-size:20px;border-bottom:2px solid #e63946;padding-bottom:8px">New Restaurant Marketing Requirement Form Submission</h1><p style="color:#6b7280;font-size:14px">Submitted on ${new Date().toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}</p>${body}</body></html>`

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@sjmedialabs.com",
    to: "sridhar@sjmedialabs.com",
    subject: "New Restaurant Marketing Requirement Form Submission",
    html,
  })
}
