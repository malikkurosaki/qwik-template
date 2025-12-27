import { createAuthClient } from "better-auth/client"
export const authClient = createAuthClient({
    baseURL: import.meta.env.PUBLIC_BASE_URL,
    trustedOrigins: [
        "http://localhost:5173",
        "http://localhost:3000",
    ]
})

