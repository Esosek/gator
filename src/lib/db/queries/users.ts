import { eq } from 'drizzle-orm'
import { db } from '..'
import { users } from '../schema'

export type User = typeof users.$inferSelect

export async function createUser(name: string) {
  try {
    const [result] = await db.insert(users).values({ name: name }).returning()
    return result
  } catch (error) {
    throw new Error('Creating user in db failed')
  }
}

export async function getUser(name: string) {
  try {
    const [result] = await db.select().from(users).where(eq(users.name, name))
    return result
  } catch (error) {
    throw new Error('Getting user from db failed')
  }
}

export async function deleteAllUsers() {
  try {
    await db.delete(users)
  } catch (error) {
    throw new Error('Deleting users from db failed')
  }
}

export async function getUsers() {
  try {
    const result = await db.select({ username: users.name }).from(users)
    return result
  } catch (error) {
    throw new Error('Getting all users from db failed')
  }
}
