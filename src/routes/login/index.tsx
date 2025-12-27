import { component$ } from "@builder.io/qwik";
import { authClient } from "~/lib/auth-client";

export default component$(() => {
    return (
        <div>
            <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick$={async () => {
                const data = await authClient.signIn.social({
                    provider: "github",
                    callbackURL: "http://localhost:5173",
                })
                console.log(JSON.stringify(data, null, 2))
            }}>login github</button>
        </div>
    )
})