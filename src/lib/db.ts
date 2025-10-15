import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const buildDatabaseUrl = () => {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL
  }

  const projectDbPath = path.join(process.cwd(), 'db', 'custom.db')

  if (process.env.VERCEL) {
    const tmpDbPath = path.join('/tmp', 'prisma.db')

    try {
      if (!fs.existsSync(tmpDbPath)) {
        fs.copyFileSync(projectDbPath, tmpDbPath)
      }
    } catch (error) {
      console.error('[Prisma] Failed to hydrate tmp database', error)
    }

    const vercelUrl = `file:${tmpDbPath}`
    process.env.DATABASE_URL = vercelUrl
    return vercelUrl
  }

  const localUrl = `file:${projectDbPath}`
  process.env.DATABASE_URL = localUrl
  return localUrl
}

const databaseUrl = buildDatabaseUrl()

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
