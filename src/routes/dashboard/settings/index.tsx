import { $, component$, useSignal, useStore, useTask$ } from "@builder.io/qwik";
import { routeLoader$, useNavigate } from "@builder.io/qwik-city";
import { MatContentCopyRound, MatDeleteRound } from "@qwikest/icons/material";
import dayjs from "dayjs";
import apiContract from "~/lib/api-contract";

export const useLoadListApikey = routeLoader$(
    async ({ request, query }) => {
        const refreshKey = query.get("r") ?? "initial";

        console.log("refresh:", refreshKey);

        const cookie = request.headers.get("cookie") ?? "";

        const { data } = await apiContract.api.settings.apikey.get({
            fetch: {
                credentials: "include",
                headers: { cookie }
            }
        });

        return data?.data;
    }
);

export default component$(() => {
    return (
        <div class="space-y-4">
            <h1 class="text-2xl font-bold">Settings</h1>
            <CreateApikey />
            <ListApikey />

        </div>
    );
});


const ListApikey = component$(() => {
    const loader = useLoadListApikey();

    // ⬇️ copy sekali dari loader
    const listApikey = useStore<{ items: typeof loader.value }>({
        items: loader.value ?? [],
    });

    useTask$(({ track }) => {
        track(() => loader.value);
        listApikey.items = loader.value ?? [];
    });
    return (
        <div class="space-y-4 bg-white p-4 rounded shadow ">
            <h1 class="text-2xl font-bold">List Apikey</h1>
            {listApikey.items?.map((item) => (
                <div key={item.id} class="flex items-center justify-between">
                    <p class="font-bold text-left w-1/3">{item.name}</p>
                    <p class="text-slate-500 text-left w-1/3">{item.description}</p>
                    <p class="text-slate-500 text-left w-1/3">{dayjs(item.expiredAt).format("YYYY-MM-DD HH:mm")}</p>
                    {/* copy button */}
                    <div class="flex gap-2 items-center justify-center">
                        {/* <button class="text-slate-500" onClick$={() => {
                            navigator.clipboard.writeText(item.token ?? "")
                            alert("Copied to clipboard")
                        }}>Copy</button> */}
                        <MatContentCopyRound class="text-slate-500" onClick$={() => {
                            navigator.clipboard.writeText(item.token ?? "")
                            alert("Copied to clipboard")
                        }} />
                        <MatDeleteRound class="text-red-500" onClick$={async () => {
                            await apiContract.api.settings["delete-apikey"].post({
                                id: item.id
                            }, {
                                fetch: {
                                    credentials: "include"
                                }
                            })

                            listApikey.items = listApikey.items!.filter(
                                (i) => i.id !== item.id
                            );
                        }} />
                    </div>
                </div>
            ))}
        </div>
    )
})

const CreateApikey = component$(() => {
    const loading = useSignal(false)
    const nav = useNavigate();
    const formData = useStore({
        name: "",
        description: "",
        expiredAt: dayjs().add(1, "year").format("YYYY-MM-DD")
    })

    const handleSubmit = $(async () => {
        try {
            loading.value = true
            const { data } = await apiContract.api.settings.apikey.post({
                name: formData.name,
                description: formData.description,
                expiredAt: formData.expiredAt
            }, {
                fetch: {
                    credentials: "include"
                }
            })
            console.log(data?.data)
            await nav(`/dashboard/settings?r=${Date.now()}`);
        } catch (error) {
            console.log(error)
        } finally {
            loading.value = false
        }
    })


    return (
        <div class="space-y-4 bg-white p-4 rounded shadow ">
            <h1 class="text-2xl font-bold">Create Apikey</h1>
            <div class="max-w-md flex flex-col gap-2">
                <input value={formData.name} onInput$={(e) => {
                    formData.name = (e.target as any).value
                }} type="text" class="rounded border border-slate-300 p-2" placeholder="Name" name="name" />
                <input value={formData.description} onInput$={(e) => {
                    formData.description = (e.target as any).value
                }} type="text" class="rounded border border-slate-300 p-2" placeholder="Description" name="description" />
                <input value={formData.expiredAt} onInput$={(e) => {
                    formData.expiredAt = (e.target as any).value
                }} type="date" class="rounded border border-slate-300 p-2" placeholder="Expired At" name="expiredAt" />
                <button disabled={loading.value} class={["rounded bg-slate-900 px-3 py-2 text-white cursor-pointer", loading.value ? "opacity-50 cursor-wait" : ""]} onClick$={handleSubmit}>Create</button>
            </div>
        </div>
    );
});