import { JWTPayloadSpec } from "@elysiajs/jwt";
import { User } from "better-auth";
import dayjs from "dayjs";
import { eq } from "drizzle-orm";
import Elysia, { t } from "elysia";
import { db } from "~/db";
import { apikey } from "~/db/schema";

type JWT = {
    sign(data: Record<string, string | number> & JWTPayloadSpec): Promise<string>
    verify(
        jwt?: string
    ): Promise<false | (Record<string, string | number> & JWTPayloadSpec)>
}

const NINETY_YEARS = 60 * 60 * 24 * 365 * 90

const ApiSetting = new Elysia({
    tags: ["settings"],
    prefix: "/settings"
})
    .get("/apikey", async (ctx) => {
        const { user }: { user: User } = ctx as any
        const list = await db.select().from(apikey).where(eq(apikey.userId, user.id))
        return { data: list }
    }, {
        detail: {
            summary: "Get Apikey",
            description: "Get Apikey"
        }
    })
    .post("/apikey", async (ctx) => {

        const { name, description, expiredAt } = ctx.body
        const { user }: { user: User } = ctx as any
        const { sign } = (ctx as any).jwt as JWT

        const exp = expiredAt
            ? Math.floor(new Date(expiredAt).getTime() / 1000) // jika dikirim
            : Math.floor(Date.now() / 1000) + NINETY_YEARS // default 90 tahun

        const token = await sign({
            sub: user.id,
            aud: 'user',
            exp: exp,
            payload: JSON.stringify({
                name,
                description,
                expiredAt,
            }),
        })

        await db.insert(apikey).values({
            id: crypto.randomUUID(),
            name,
            description,
            token,
            expiredAt: expiredAt ? dayjs(expiredAt).toDate() : dayjs().add(NINETY_YEARS, 'year').toDate(),
            userId: user.id,
            createdAt: dayjs().toDate(),
            updatedAt: dayjs().toDate(),
        })

        return { data: token }
    }, {
        body: t.Object({
            name: t.String(),
            description: t.String(),
            expiredAt: t.String()
        }),
        detail: {
            summary: "Create Apikey",
            description: "Create Apikey"
        }
    })
    .post("/delete-apikey", async (ctx) => {
        const { id } = ctx.body
        await db.delete(apikey).where(eq(apikey.id, id))
        return { data: id }
    }, {
        body: t.Object({
            id: t.String(),
        }),
        detail: {
            summary: "Delete Apikey",
            description: "Delete Apikey"
        }
    })

export default ApiSetting
