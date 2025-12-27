import Elysia from "elysia";
import { db } from "~/db";
import { user } from "~/db/schema";

const ApiUser = new Elysia({
    prefix: "/users",
    tags: ["users"]
})
    .get("/list", async () => {
        const data = await db.select().from(user)
        return { data }
    })

export default ApiUser
