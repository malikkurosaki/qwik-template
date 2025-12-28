import { component$, useSignal } from "@builder.io/qwik";
import { BsGithub } from "@qwikest/icons/bootstrap";
import { authClient } from "~/lib/auth-client";

export default component$(() => {
    const loading = useSignal(false);

    return (
        <div class="min-h-screen flex items-center justify-center bg-slate-100">
            <div class="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
                {/* Header */}
                <div class="mb-6 text-center">
                    <h1 class="text-2xl font-bold text-slate-900">Welcome Back</h1>
                    <p class="mt-1 text-sm text-slate-500">
                        Sign in to continue to your dashboard
                    </p>
                </div>

                {/* Button */}
                <button
                    disabled={loading.value}
                    onClick$={async () => {
                        loading.value = true;
                        await authClient.signIn.social({
                            provider: "github",
                            callbackURL: "http://localhost:5173",
                        });
                    }}
                    class={[
                        "flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300",
                        "bg-slate-900 px-4 py-3 text-white font-medium transition",
                        "hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400",
                        loading.value
                            ? "cursor-wait opacity-70"
                            : "cursor-pointer",
                    ]}
                >
                    <BsGithub class="h-5 w-5" />
                    {loading.value ? "Redirecting..." : "Continue with GitHub"}
                </button>

                {/* Footer */}
                <p class="mt-6 text-center text-xs text-slate-400">
                    By signing in, you agree to our Terms & Privacy Policy
                </p>
            </div>
        </div>
    );
});
