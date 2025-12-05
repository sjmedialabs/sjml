import { getCollection, ObjectId } from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export interface AdminUser {
  _id?: ObjectId
  email: string
  password: string
  name?: string
  role: "admin" | "superadmin"
  createdAt: Date
  updatedAt: Date
}

export async function findAdminByEmail(email: string): Promise<AdminUser | null> {
  const collection = await getCollection<AdminUser>("admins")
  return collection.findOne({ email: email.toLowerCase() })
}

export async function findAdminById(id: string): Promise<AdminUser | null> {
  const collection = await getCollection<AdminUser>("admins")
  return collection.findOne({ _id: new ObjectId(id) })
}

export async function createAdmin(data: {
  email: string
  password: string
  name?: string
  role?: "admin" | "superadmin"
}): Promise<AdminUser> {
  const collection = await getCollection<AdminUser>("admins")
  const hashedPassword = await bcrypt.hash(data.password, 12)
  const now = new Date()
  const admin: Omit<AdminUser, "_id"> = {
    email: data.email.toLowerCase(),
    password: hashedPassword,
    name: data.name || "",
    role: data.role || "admin",
    createdAt: now,
    updatedAt: now,
  }
  const result = await collection.insertOne(admin as AdminUser)
  return { ...admin, _id: result.insertedId }
}

export async function validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword)
}

export async function updateAdminPassword(id: string, newPassword: string): Promise<boolean> {
  const collection = await getCollection<AdminUser>("admins")
  const hashedPassword = await bcrypt.hash(newPassword, 12)
  const result = await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { password: hashedPassword, updatedAt: new Date() } },
  )
  return result.modifiedCount === 1
}

export async function ensureDefaultAdmin(): Promise<void> {
  const existingAdmin = await findAdminByEmail("admin@sjmedialabs.com")
  if (!existingAdmin) {
    await createAdmin({
      email: "admin@sjmedialabs.com",
      password: "SJMedia@2025",
      name: "Admin",
      role: "superadmin",
    })
  }
}
