import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { clientPromise } from "@/lib/mongodb"
import { getPageContent } from "@/lib/models/content"
import InsightsClient from "./insights-client"

export const revalidate = 0 // Disabled - always fetch fresh admin data

export default async function InsightsPage() {
  let posts: any[] = []
  let categories: string[] = ["All"]
  let content

  try {
    // Fetch page content
    content = await getPageContent("insights")
    if (!content) {
      throw new Error("Insights page content not found")
    }

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
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center px-4">
          <h2 className="text-2xl font-bold text-white mb-4">Content Not Available</h2>
          <p className="text-[#888]">Insights page content has not been set up yet. Please contact the administrator.</p>
        </div>
      </main>
    )
  }

  const hero = content.hero
  const newsletter = content.newsletter
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <InsightsClient posts={posts} categories={categories} hero={hero} newsletter={newsletter} />
      <Footer />
    </main>
  )
}
