import { component$ } from "@builder.io/qwik";

export default component$(() => {
  return (
    <div class="space-y-4">
      <h1 class="text-2xl font-bold">Dashboard</h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="rounded bg-white p-4 shadow">
          <p class="text-sm text-slate-500">Users</p>
          <p class="text-2xl font-bold">1,234</p>
        </div>

        <div class="rounded bg-white p-4 shadow">
          <p class="text-sm text-slate-500">Revenue</p>
          <p class="text-2xl font-bold">$9,876</p>
        </div>

        <div class="rounded bg-white p-4 shadow">
          <p class="text-sm text-slate-500">Errors</p>
          <p class="text-2xl font-bold text-red-600">3</p>
        </div>
      </div>
    </div>
  );
});
