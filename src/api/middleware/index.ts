import jwt, { type JWTPayloadSpec } from '@elysiajs/jwt'
import { eq } from 'drizzle-orm'
import Elysia from 'elysia'
import { db } from '~/db'
import { user } from '~/db/schema'
import { auth } from '~/lib/auth'

const secret = process.env.JWT_SECRET

if (!secret) {
  throw new Error('JWT_SECRET is not defined')
}

export function midleware(app: Elysia) {
  if (!secret) {
    throw new Error('JWT_SECRET is not defined')
  }
  return app
    .use(
      jwt({
        name: 'jwt',
        secret,
      })
    )
    .derive(async ({ headers, jwt, request }) => {
      let token: string | undefined

      const userSession = await auth.api.getSession({
        headers: headers as unknown as HeadersInit
      })

      if (userSession?.user) {
        return { user: userSession.user }
      }

      // 🔸 Ambil token dari Header (case-insensitive)
      const possibleHeaders = [
        'authorization',
        'Authorization',
        'x-token',
        'X-Token',
      ]

      for (const key of possibleHeaders) {
        const value = headers[key]
        if (typeof value === 'string') {
          token = value.startsWith('Bearer ') ? value.slice(7) : value
          break
        }
      }

      // 🔸 Tidak ada token
      if (!token) {
        console.warn(`[AUTH] No token found for ${request.method} ${request.url}`)
        return { user: null }
      }

      // 🔸 Verifikasi token
      try {
        const decoded = (await jwt.verify(token)) as JWTPayloadSpec

        if (!decoded?.sub) {
          console.warn('[AUTH] Token missing sub field:', decoded)
          return { user: null }
        }

        const usr = await db.select().from(user).where(eq(user.id, decoded.sub))

        if (!user) {
          console.warn('[AUTH] User not found for sub:', decoded.sub)
          return { user: null }
        }

        return { user: usr[0] }
      } catch (err) {
        console.warn('[AUTH] Invalid JWT token:', err)
        return { user: null }
      }
    })
    .onBeforeHandle(({ user, set, request }) => {
      if (!user) {
        console.warn(
          `[AUTH] Unauthorized access: ${request.method} ${request.url}`
        )
        set.status = 401
        return { error: 'Unauthorized' }
      }
    })
}
