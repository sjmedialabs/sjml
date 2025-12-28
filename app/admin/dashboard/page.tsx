import DashboardWrapper from "./dashboard-wrapper"

export const dynamic = "force-dynamic" // Admin pages should always be fresh

export default async function AdminDashboardPage(props: { searchParams: Promise<{ section?: string }> }) {
  const searchParams = await props.searchParams
  const section = searchParams.section || "overview"

  return (
    <DashboardWrapper section={section} />
  )
}
