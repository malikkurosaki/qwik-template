import { component$, Slot } from "@builder.io/qwik";
import { provideGlobalState } from "~/lib/state/globalctx";

export default component$(() => {
    provideGlobalState()
    return (
        <div>
            <Slot />
        </div>
    )
})