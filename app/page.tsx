import Link from "next/link";
import { ArrowRight, Sparkle, MagnifyingGlass, Funnel, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

export default function HomePage() {
  return (
    <main className="marketing-mode relative min-h-[100dvh] overflow-hidden bg-[var(--background)] selection:bg-[var(--accent)] selection:text-black">
      <div className="absolute inset-0 bg-grid-pattern opacity-60" />
      
      {/* Floating Top Nav */}
      <nav className="absolute left-1/2 top-6 z-50 flex w-[calc(100%-3rem)] max-w-5xl -translate-x-1/2 items-center justify-between rounded-full border-2 border-[var(--ink)] bg-white/90 px-6 py-3 shadow-[4px_4px_0px_var(--ink)] backdrop-blur-md sm:w-[calc(100%-4rem)] sm:px-8 sm:py-4">
        <div className="flex items-center gap-2.5">
          <img
            src="/vibely_logo.png"
            className="h-8 w-8 rounded-lg object-cover border border-black shadow-[1.5px_1.5px_0px_black]"
            alt="Vibely logo"
          />
          <span className="text-2xl font-black tracking-tight text-[var(--ink)]">Vibely.</span>
        </div>
        <div className="hidden items-center gap-10 text-sm font-bold uppercase tracking-wider text-[var(--ink)] md:flex">
          <Link href="#how-it-works" className="hover:text-[var(--muted)]">Product</Link>
          <Link href="#proof" className="hover:text-[var(--muted)]">Creators</Link>
          <Link href="/dashboard" className="hover:text-[var(--muted)]">Brand Login</Link>
        </div>
        <Link
          href="/dashboard"
          className="btn-marketing px-6 py-3 text-sm"
        >
          Join
          <ArrowUpRight size={16} weight="bold" className="ml-1" />
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex min-h-[95dvh] flex-col items-center justify-center px-6 pt-32 text-center sm:pt-24">
        {/* Stickers (absolute positioned for poster effect) */}
        <div className="absolute left-[8%] top-[25%] hidden rotate-[-4deg] xl:block">
          <div className="sticker">
            <MagnifyingGlass size={18} weight="bold" />
            Find Real Influence
          </div>
        </div>
        <div className="absolute right-[10%] top-[40%] hidden rotate-[6deg] xl:block">
          <div className="sticker bg-[#ffb8e0]">
            <Funnel size={18} weight="bold" />
            Skip the noise
          </div>
        </div>

        <div className="mb-8 inline-flex items-center gap-2 rounded-full border-2 border-[var(--ink)] bg-[var(--accent)] px-4 py-2 text-xs font-black uppercase tracking-widest text-[var(--ink)] shadow-[2px_2px_0px_var(--ink)] sm:text-sm">
          <Sparkle size={16} weight="fill" />
          Creator Commerce, Made Magnetic
        </div>

        <h1 className="mx-auto max-w-5xl text-[14vw] font-black leading-[0.85] tracking-tight text-[var(--ink)] sm:text-[6.5rem] lg:text-[8.5rem]">
          BRIEF IT.<br />
          <span className="relative inline-block text-[var(--brand-surface)] [text-shadow:-2px_-2px_0_var(--ink),2px_-2px_0_var(--ink),-2px_2px_0_var(--ink),2px_2px_0_var(--ink),6px_6px_0px_var(--ink)]">
            MATCH IT.
            <div className="absolute -right-8 -top-8 hidden rotate-[12deg] sm:block">
              <div className="sticker bg-[#fff8db] shadow-[4px_4px_0px_var(--ink)]">
                <span className="text-[10px] font-black uppercase tracking-wider text-[var(--muted)]">Hello, I am</span>
                <br />
                <span className="text-base">Your next top creator</span>
              </div>
            </div>
          </span><br />
          SHIP IT.
        </h1>

        <p className="mx-auto mt-10 max-w-2xl text-lg font-bold leading-snug text-[var(--ink)] sm:text-2xl">
          Creators curate. Brands get discovered.<br />
          People find what is worth the vibe.
        </p>

        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
          <Link
            href="/dashboard"
            className="btn-marketing flex h-16 items-center justify-center gap-2 px-10 text-lg shadow-[4px_4px_0px_var(--ink)] hover:shadow-[6px_6px_0px_var(--ink)] active:shadow-[2px_2px_0px_var(--ink)]"
          >
            Start Matchmaking
            <ArrowRight size={20} weight="bold" />
          </Link>
        </div>
      </section>

      {/* How it Works Strip */}
      <section id="how-it-works" className="relative z-10 border-y-2 border-[var(--ink)] bg-[var(--panel)] px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 flex flex-col items-center justify-between gap-6 md:flex-row">
            <h2 className="text-4xl font-black uppercase tracking-tight text-[var(--ink)] sm:text-5xl">How Vibely Works</h2>
            <div className="rounded-full border-2 border-[var(--ink)] bg-[var(--background)] px-6 py-2 text-sm font-bold shadow-[2px_2px_0px_var(--ink)]">
              3 Simple Steps
            </div>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { num: "01", title: "Brief the bot", desc: "Tell Vibely your goals, audience, and budget. Our AI understands plain English and complex campaign needs." },
              { num: "02", title: "Get matched", desc: "Our AI scans 12K+ creators, catches inflated audience signals, and scores them for you instantly." },
              { num: "03", title: "Connect & Ship", desc: "Review the top matches, draft personalized outreach with one click, and launch your campaign." },
            ].map((step, i) => (
              <div key={i} className="flex flex-col gap-6 rounded-3xl border-2 border-[var(--ink)] bg-[var(--background)] p-8 shadow-[6px_6px_0px_var(--ink)] transition-transform hover:-translate-y-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[var(--ink)] bg-[var(--accent)] text-3xl font-black shadow-[2px_2px_0px_var(--ink)]">
                  {step.num}
                </div>
                <div>
                  <h3 className="mb-3 text-2xl font-black uppercase text-[var(--ink)]">{step.title}</h3>
                  <p className="font-semibold text-[var(--muted)]">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proof / Transition */}
      <section id="proof" className="relative z-10 bg-[var(--background)] px-6 py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-5xl font-black uppercase tracking-tight text-[var(--ink)] sm:text-7xl">
            Ready to find<br />your perfect match?
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-xl font-bold text-[var(--muted)]">
            Join thousands of brands who have stopped searching and started shipping.
          </p>
          <div className="mt-12 flex justify-center">
            <Link
              href="/dashboard"
              className="btn-marketing flex h-20 items-center justify-center gap-3 px-12 text-2xl shadow-[6px_6px_0px_var(--ink)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_var(--ink)] active:translate-y-1 active:shadow-[2px_2px_0px_var(--ink)]"
            >
              Open Dashboard
              <ArrowUpRight size={28} weight="bold" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
