// lauout.tsx
import { component$, Slot } from "@builder.io/qwik";
import { DialogProvider } from "~/components/LocalDialog";
import { ToastProvider } from "~/components/LocalToast";
import { provideGlobalState } from "~/lib/state/globalctx";

export default component$(() => {

    provideGlobalState()
    return (
        <div>
            <Slot />
            <DialogProvider />
            <ToastProvider />

        </div>
    )
})
