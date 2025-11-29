import { getCollection, ObjectId } from "@/lib/mongodb"

export interface Lead {
  _id?: ObjectId
  name: string
  email: string
  phone?: string
  company?: string
  subject?: string
  message?: string
  service?: string
  budget?: string
  source: "website" | "website_popup" | "contact_form" | "meta_ads" | "google_ads" | "manual" | "other"
  status: "new" | "contacted" | "qualified" | "converted" | "lost"
  campaign?: {
    platform?: string
    campaignId?: string
    campaignName?: string
    adSetId?: string
    adSetName?: string
    adId?: string
    adName?: string
  }
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export async function getLeads(): Promise<Lead[]> {
  const collection = await getCollection<Lead>("leads")
  return collection.find({}).sort({ createdAt: -1 }).toArray()
}

export async function getLeadById(id: string): Promise<Lead | null> {
  const collection = await getCollection<Lead>("leads")
  return collection.findOne({ _id: new ObjectId(id) })
}

export async function addLead(lead: Omit<Lead, "_id" | "createdAt" | "updatedAt">): Promise<Lead> {
  const collection = await getCollection<Lead>("leads")
  const now = new Date()
  const newLead = {
    ...lead,
    status: lead.status || "new",
    createdAt: now,
    updatedAt: now,
  }
  const result = await collection.insertOne(newLead as Lead)
  return { ...newLead, _id: result.insertedId } as Lead
}

export async function updateLead(id: string, data: Partial<Lead>): Promise<Lead | null> {
  const collection = await getCollection<Lead>("leads")
  const { _id, ...updateData } = data as any
  await collection.updateOne({ _id: new ObjectId(id) }, { $set: { ...updateData, updatedAt: new Date() } })
  return getLeadById(id)
}

export async function deleteLead(id: string): Promise<boolean> {
  const collection = await getCollection<Lead>("leads")
  const result = await collection.deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount === 1
}
