import {
  component$,
  createContextId,
  useContextProvider,
  useStore,
  useTask$,
  useVisibleTask$,
} from "@builder.io/qwik";

/* ================================
   TYPES
================================ */
export interface ToastState {
  message: string | null;
  visible: boolean;
}

/* ================================
   CONTEXT (OPTIONAL)
================================ */
const ToastContext = createContextId<ToastState>("toast");

/* ================================
   WINDOW API
================================ */
declare global {
  interface Window {
    __toast__?: ToastState;
    __toastQueue__?: string[];
  }
}

/* ================================
   PUBLIC API
================================ */
export const showToast = (message: string) => {
  if (typeof window === "undefined") return;

  if (!window.__toast__) {
    window.__toastQueue__ ??= [];
    window.__toastQueue__!.push(message);
    return;
  }

  window.__toast__.message = message;
  window.__toast__.visible = true;
};

/* ================================
   PROVIDER + UI
================================ */
export const ToastProvider = component$(() => {
  const toast = useStore<ToastState>({
    message: null,
    visible: false,
  });

  useContextProvider(ToastContext, toast);

  // 🔥 register on client
  useVisibleTask$(() => {
    window.__toast__ = toast;
    window.__toastQueue__ ??= [];

    if (window.__toastQueue__.length > 0) {
      toast.message = window.__toastQueue__.shift()!;
      toast.visible = true;
    }
  });

  // auto hide + next queue
  useTask$(({ track, cleanup }) => {
    track(() => toast.visible);
    if (!toast.visible) return;

    const timer = setTimeout(() => {
      toast.visible = false;
      toast.message = null;

      const next = window.__toastQueue__?.shift();
      if (next) {
        setTimeout(() => {
          toast.message = next;
          toast.visible = true;
        }, 100);
      }
    }, 3000);

    cleanup(() => clearTimeout(timer));
  });

  return (
    <div
      class={[
        "fixed bottom-4 left-1/2 z-50 rounded-lg px-4 py-3 shadow-lg",
        "bg-slate-900 text-white transition-all duration-300",
        toast.visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-2 pointer-events-none",
      ]}
    >
      {toast.message}
    </div>
  );
});
