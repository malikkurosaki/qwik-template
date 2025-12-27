import cors from "@elysiajs/cors";
import jwt from "@elysiajs/jwt";
import swagger from "@elysiajs/swagger";
import Elysia, { Context } from "elysia";
import { auth } from "~/lib/auth";
import { midleware } from "./middleware";
import ApiSetting from "./settings";
import ApiUser from "./users";

const SECRET = Bun.env.JWT_SECRET
if (!SECRET) {
    throw new Error("JWT_SECRET is not defined");
}

const AuthApp = new Elysia()
    .all("/auth/*", ({ request }) => auth.handler(request));

const DocsApp = new Elysia()
    .use(swagger({
        path: "/docs",

    }))

const ApiApp = new Elysia({
    prefix: "/api",
    tags: ["api"]
})
    .use(cors({
        origin: ["http://localhost:5173", "http://localhost:3000"]
    }))
    .use(jwt({
        name: 'jwt',
        secret: SECRET,
    }))
    .use(DocsApp)
    .use(AuthApp)
    .use(midleware)
    .get("/user", async (ctx: Context) => {
        try {
            const session = await auth.api.getSession({
                headers: ctx.request.headers
            })

            // console.log(session)
            return { data: session }
        } catch (error) {
            console.log(error)
        }

        return { data: "test apa ini" }

    })
    .use(ApiSetting)
    .use(ApiUser)


export default ApiApp;
export type ApiAppType = typeof ApiApp;