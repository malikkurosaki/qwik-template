import {
  component$,
  useStore,
  useVisibleTask$,
} from "@builder.io/qwik";

/* ================================
   TYPES
================================ */
export interface DialogState {
  title: string | null;
  message: string | null;
  visible: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

/* ================================
   WINDOW API
================================ */
declare global {
  interface Window {
    __dialog__?: DialogState;
    __dialogQueue__?: Omit<DialogState, "visible">[];
  }
}

/* ================================
   PUBLIC API
================================ */
export const openDialog = (opts: {
  title?: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}) => {
  if (typeof window === "undefined") return;

  window.__dialogQueue__ ??= [];
  window.__dialogQueue__.push({
    title: opts.title ?? "Confirmation",
    message: opts.message,
    onConfirm: opts.onConfirm,
    onCancel: opts.onCancel,
  });

  // flush langsung jika dialog siap
  if (window.__dialog__ && !window.__dialog__.visible) {
    const next = window.__dialogQueue__.shift();
    if (next) Object.assign(window.__dialog__, next, { visible: true });
  }
};

/* ================================
   PROVIDER
================================ */
export const DialogProvider = component$(() => {
  const dialog = useStore<DialogState>({
    title: null,
    message: null,
    visible: false,
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    window.__dialog__ = dialog;
    window.__dialogQueue__ ??= [];

    // 🔥 flush queue once on mount
    const next = window.__dialogQueue__.shift();
    if (next) Object.assign(dialog, next, { visible: true });
  });

  if (!dialog.visible) return null;

  return (
    <div class="backdrop-blur-sm fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick$={() => dialog.visible = false}>
      <div class="w-full max-w-md rounded-lg bg-white shadow-xl" onClick$={(e) => e.stopPropagation()}>
        <div class="border-b px-4 py-3 font-semibold">
          {dialog.title}
        </div>

        <div class="px-4 py-4">{dialog.message}</div>

        <div class="flex justify-end gap-2 border-t px-4 py-3">
          <button
            class="px-3 py-2"
            onClick$={() => {
              dialog.visible = false;
              dialog.onCancel?.();
            }}
          >
            Cancel
          </button>

          <button
            class="rounded bg-blue-600 px-4 py-2 text-white"
            onClick$={() => {
              dialog.visible = false;
              dialog.onConfirm?.();
            }}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
});
