import { component$ } from "@builder.io/qwik";
import { Link, routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import apiContract from "~/lib/api-contract";
import { authClient } from "~/lib/auth-client";


export const useSession = routeLoader$(async ({ request, redirect }) => {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: {
        cookie: request.headers.get("cookie") ?? "",
      },
    },
  });

  if (!session.data) {
    throw redirect(302, "/login");
  }

  return session.data;
});



export default component$(() => {

  const sessionLoader = useSession()

  return (
    <div class="flex flex-col gap-8 p-4">
      <h1 class="text-2xl font-bold">Hi 👋</h1>
      {JSON.stringify(sessionLoader.value, null, 2)}
      <div class="flex gap-2">
        <button class="rounded bg-slate-900 px-3 py-2 text-white cursor-pointer" onClick$={async () => {

          const data = await apiContract.api.user.get({
            fetch: {
              credentials: "include"
            }
          })
          console.log(JSON.stringify(data, null, 2))
        }}>test api</button>
        <button class="rounded bg-slate-900 px-3 py-2 text-white cursor-pointer" onClick$={async () => {

          await authClient.signOut()
          console.log("logout")
          window.location.reload()
        }}>logout</button>
        {/* dashboard */}
        <Link class="rounded bg-slate-900 px-3 py-2 text-white cursor-pointer" href="/dashboard">Dashboard</Link>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
