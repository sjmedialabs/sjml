import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { clientPromise } from "@/lib/mongodb"
import InsightsClient from "./insights-client"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function InsightsPage() {
  let posts: any[] = []
  let categories: string[] = ["All"]

  try {
    // Fetch insights directly from MongoDB
    const client = await clientPromise
    const db = client.db("sjmedialabs")
    const insights = await db.collection("insights").find({ published: true }).sort({ date: -1 }).toArray()
    
    // Serialize MongoDB _id and extract categories
    const categoriesSet = new Set<string>()
    posts = insights.map(insight => {
      if (insight.category) categoriesSet.add(insight.category)
      return {
        ...insight,
        _id: insight._id.toString(),
        id: insight._id.toString(),
      }
    })
    
    categories = ["All", ...Array.from(categoriesSet)]
  } catch (error) {
    console.error("Failed to fetch insights:", error)
  }

  const hero = {
    title: "Insights & Resources",
    subtitle: "Expert perspectives on branding, marketing, and digital transformation.",
  }

  const newsletter = {
    title: "Subscribe to Our Newsletter",
    description: "Get the latest insights and resources delivered to your inbox.",
    buttonText: "Subscribe",
  }
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <InsightsClient posts={posts} categories={categories} hero={hero} newsletter={newsletter} />
      <Footer />
    </main>
  )
}
