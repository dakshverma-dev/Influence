import { defaultBrandProfile } from "@/lib/constants";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <section className="card-panel p-6 sm:p-8">
        <p className="eyebrow">Settings</p>
        <h1 className="mt-4 section-title">Static brand profile for the MVP.</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">
          This stays display-only for hackathon scope, but the page still feels like a real place brands would configure their account.
        </p>
      </section>

      <section className="card-panel grid gap-4 p-6 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium text-[var(--ink)]">
          Brand name
          <input
            readOnly
            value={defaultBrandProfile.name}
            className="rounded-2xl border border-[var(--border)] bg-[var(--panel-soft)] px-4 py-3 text-[var(--muted)] outline-none"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-[var(--ink)]">
          Industry
          <input
            readOnly
            value={defaultBrandProfile.industry}
            className="rounded-2xl border border-[var(--border)] bg-[var(--panel-soft)] px-4 py-3 text-[var(--muted)] outline-none"
          />
        </label>
        <label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-[var(--ink)]">
          Logo placeholder
          <input
            readOnly
            value={defaultBrandProfile.logo}
            className="rounded-2xl border border-[var(--border)] bg-[var(--panel-soft)] px-4 py-3 text-[var(--muted)] outline-none"
          />
        </label>
      </section>
    </div>
  );
}
