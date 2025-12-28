import { eq } from "drizzle-orm";
import Elysia from "elysia";
import { db } from "~/db";
import { account, user } from "~/db/schema";

const ApiUser = new Elysia({
    prefix: "/users",
    tags: ["users"]
})
    .get("/list", async () => {
        const data = await db.select({
            id: user.id,
            name: user.name,
            email: user.email,
            providerId: account.providerId
        }).from(user).leftJoin(account, () => eq(account.userId, user.id))
        return { data }
    })

export default ApiUser
