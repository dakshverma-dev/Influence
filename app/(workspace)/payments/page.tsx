"use client";

import { useAppState } from "@/components/providers/app-state-provider";
import { formatCurrency } from "@/lib/utils";

const payoutRows = [
  { creator: "Riya Ray", amount: 85000, status: "Pending" },
  { creator: "Arjun Veer", amount: 130000, status: "Completed" },
  { creator: "Prisha Sen", amount: 68000, status: "Pending" },
];

export default function PaymentsPage() {
  const { showToast } = useAppState();

  return (
    <div className="space-y-6">
      <section className="card-panel p-6 sm:p-8">
        <p className="eyebrow">Payments</p>
        <h1 className="mt-4 section-title">Interactive mock payouts for the demo.</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">
          No real payment rails here by design, but the page still responds and reads like a live operations surface.
        </p>
      </section>

      <section className="grid gap-4">
        {payoutRows.map((payout) => (
          <article key={payout.creator} className="card-panel p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xl font-semibold text-[var(--ink)]">{payout.creator}</p>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {formatCurrency(payout.amount)} / {payout.status}
                </p>
              </div>
              <button
                type="button"
                onClick={() => showToast("Payment simulated")}
                className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white"
              >
                Pay now
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
