import { component$, QRL, Signal, Slot, useSignal } from "@builder.io/qwik";
import {
  DocumentHead,
  Link,
  routeLoader$,
  useLocation,
} from "@builder.io/qwik-city";
import {
  MatAccountBoxRound,
  MatMenuFilled,
} from "@qwikest/icons/material";
import { authClient } from "~/lib/auth-client";

/* ================================
   AUTH GUARD
================================ */
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

/* ================================
   LAYOUT
================================ */
export default component$(() => {
  const session = useSession();
  const loc = useLocation(); // 🔥 ACTIVE ROUTE
  const open = useSignal(false);
  const openModalMenu = useSignal(false);

  const isActive = (path: string) => {
    const current = loc.url.pathname.replace(/\/$/, "");

    // dashboard root HARUS exact
    if (path === "/dashboard") {
      return current === "/dashboard";
    }

    // sub-routes boleh startsWith
    return current === path || current.startsWith(path + "/");
  };


  return (
    <div class="flex h-screen bg-slate-100">
      {/* Overlay mobile */}
      {open.value && (
        <div
          class="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick$={() => (open.value = false)}
        />
      )}

      {/* Sidebar */}
      <aside
        class={[
          "fixed z-40 h-full w-64 bg-slate-900 text-white transition-transform md:static md:translate-x-0",
          open.value ? "translate-x-0" : "-translate-x-full",
        ]}
      >
        <div class="p-4 font-bold text-lg border-b border-slate-700">
          My Dashboard
        </div>

        <nav class="flex flex-col gap-1 p-2">
          <NavItem
            href="/dashboard"
            label="Dashboard"
            active={isActive("/dashboard")}
            onClick$={() => (open.value = false)}
          />

          <NavItem
            href="/dashboard/users"
            label="Users"
            active={isActive("/dashboard/users")}
            onClick$={() => (open.value = false)}
          />

          <NavItem
            href="/dashboard/settings"
            label="Settings"
            active={isActive("/dashboard/settings")}
            onClick$={() => (open.value = false)}
          />
        </nav>
      </aside>

      {/* Main */}
      <div class="flex flex-1 flex-col">
        {/* Topbar */}
        <header class="flex items-center justify-between border-b bg-white px-4 py-3">
          <button
            class="md:hidden rounded bg-slate-900 px-3 py-2 text-white"
            onClick$={() => (open.value = true)}
          >
            <MatMenuFilled />
          </button>

          <div class="font-semibold">Welcome 👋</div>

          <div class="flex items-center gap-2 text-sm text-slate-600">
            <MatAccountBoxRound
              class="w-5 h-5 cursor-pointer"
              onClick$={() => (openModalMenu.value = true)}
            />
            {session.value.user?.email}
          </div>
        </header>

        {/* Content */}
        <main class="flex-1 overflow-y-auto p-4">
          <Slot />
        </main>
      </div>

      <ModalMenu openSignal={openModalMenu} />
    </div>
  );
});

/* ================================
   NAV ITEM (REUSABLE)
================================ */
const NavItem = component$(
  ({
    href,
    label,
    active,
    onClick$,
  }: {
    href: string;
    label: string;
    active: boolean;
    onClick$?: QRL<() => void>;
  }) => {
    return (
      <Link
        href={href}
        onClick$={onClick$}
        class={[
          "relative rounded px-3 py-2 pl-4 transition",
          active
            ? "bg-slate-700 font-semibold"
            : "hover:bg-slate-700",
        ]}
      >
        {active && (
          <span class="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-r" />
        )}
        {label}
      </Link>
    );
  }
);

/* ================================
   MODAL MENU
================================ */
export const ModalMenu = component$(
  ({ openSignal }: { openSignal: Signal<boolean> }) => {
    return (
      <div
        class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        style={{ display: openSignal.value ? "block" : "none" }}
        onClick$={() => (openSignal.value = false)}
      >
        <div
          class="fixed bg-slate-900 text-white z-50 w-64 h-64
                 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                 rounded shadow-lg"
          onClick$={(e) => e.stopPropagation()}
        >
          <div class="p-4 font-bold text-lg border-b border-slate-700">
            My Dashboard
          </div>
          <button
            class="w-full p-4 text-left hover:bg-slate-700"
            onClick$={async () => {
              await authClient.signOut()
              openSignal.value = false
              window.location.href = "/login"
            }}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }
);

/* ================================
   HEAD
================================ */
export const head: DocumentHead = {
  title: "Dashboard",
};
