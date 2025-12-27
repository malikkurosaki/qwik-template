import { component$, Resource } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { MatAccountBoxRound } from "@qwikest/icons/material";
import apiContract from "~/lib/api-contract";

export const useListUser = routeLoader$(async ({ request, query }) => {
  const refreshKey = query.get("r") ?? "initial";

  console.log("refresh:", refreshKey);

  const cookie = request.headers.get("cookie") ?? "";
  const { data } = await apiContract.api.users.list.get({
    headers: { cookie },
    fetch: {
      credentials: "include"
    }
  })
  return data?.data
})

export default component$(() => {
  return (
    <div class="space-y-4">
      <h1 class="text-2xl font-bold">Users</h1>
      <ListUser />
    </div>
  );
});

const ListUser = component$(() => {
  const listUser = useListUser()
  return (
    <div class="space-y-4 bg-white p-4 rounded shadow ">
      <h2 class="text-xl font-bold">List User</h2>
      <Resource value={listUser} onPending={() => <div>Loading...</div>} onResolved={(listUser) => (
        <ul>
          {listUser?.map((user) => (
            <li key={user.id}>
              <div class="flex items-center gap-2">
                <MatAccountBoxRound />
                <p class="w-1/3">{(user.name)}</p>
                <p >{user.email}</p>
              </div>
              
            </li>
          ))}
        </ul>
      )} />
    </div>
  );
});