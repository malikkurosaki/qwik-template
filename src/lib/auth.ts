import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db"; // your drizzle instance
import { bearer } from "better-auth/plugins";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg"
    }),
    plugins: [bearer()],
    trustedOrigins: [
        "http://localhost:5173",
        "http://localhost:3002",
    ],
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
    },
    
});