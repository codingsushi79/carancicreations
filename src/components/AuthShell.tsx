import Link from "next/link";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

export function AuthShell({ eyebrow, title, description, children }: Props) {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden px-5 py-16 sm:px-8 sm:py-24">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_-15%,rgba(168,153,104,0.14),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_35%_at_100%_85%,rgba(60,45,30,0.22),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_0%_60%,rgba(40,35,28,0.18),transparent)]" />
      </div>

      <div className="relative mx-auto w-full max-w-md">
        <p className="text-center text-xs font-medium uppercase tracking-[0.35em] text-[#a89968]">
          {eyebrow}
        </p>
        <h1 className="mt-4 text-center font-serif text-3xl font-medium tracking-tight text-[#f5f2ed] sm:text-4xl">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-center text-sm leading-relaxed text-zinc-500">
          {description}
        </p>

        <div className="mt-10 rounded-2xl border border-white/[0.1] bg-[#121110]/80 p-8 shadow-[0_28px_90px_-28px_rgba(0,0,0,0.9)] ring-1 ring-white/[0.04] backdrop-blur-md sm:p-10">
          {children}
        </div>

        <p className="mt-10 text-center">
          <Link
            href="/home"
            className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
          >
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
