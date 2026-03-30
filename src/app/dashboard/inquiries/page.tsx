import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  updateInquiryFromForm,
  updateInquiryNoteForm,
} from "@/app/actions/dashboard";
import { DeleteInquiryForm } from "@/components/dashboard/DeleteInquiryForm";

export const dynamic = "force-dynamic";

export default async function DashboardInquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-500">
        Contact form submissions and job requests from the site. Update status
        as you work each lead.
      </p>
      <div className="space-y-4">
        {inquiries.length === 0 ? (
          <p className="text-zinc-600">No inquiries yet.</p>
        ) : (
          inquiries.map((q) => (
            <article
              key={q.id}
              className="rounded-xl border border-white/[0.08] bg-[#121110]/40 p-5"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    q.kind === "JOB"
                      ? "bg-violet-500/20 text-violet-200"
                      : "bg-sky-500/20 text-sky-200"
                  }`}
                >
                  {q.kind === "JOB" ? "Job request" : "Contact"}
                </span>
                <span className="text-xs text-zinc-600">
                  {new Date(q.createdAt).toLocaleString()}
                </span>
              </div>
              <h2 className="mt-3 font-medium text-zinc-200">{q.name}</h2>
              <p className="text-sm text-zinc-500">
                <a href={`mailto:${q.email}`} className="text-[#a89968] hover:underline">
                  {q.email}
                </a>
                {q.phone ? ` · ${q.phone}` : ""}
              </p>
              {q.projectType ? (
                <p className="mt-2 text-sm text-zinc-400">
                  Type: {q.projectType}
                </p>
              ) : null}
              {q.kind === "JOB" ? (
                <div className="mt-2 grid gap-1 text-sm text-zinc-500 sm:grid-cols-2">
                  {q.eventDate ? <p>Date: {q.eventDate}</p> : null}
                  {q.location ? <p>Location: {q.location}</p> : null}
                  {q.budget ? <p>Budget: {q.budget}</p> : null}
                </div>
              ) : null}
              <div className="mt-4 rounded-lg border border-white/[0.06] bg-black/20 p-3">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-400">
                  {q.message}
                </p>
              </div>
              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
                {q.kind === "JOB" ? (
                  <Link
                    href={`/dashboard/invoices?inquiryId=${q.id}`}
                    className="inline-flex rounded-lg border border-[#a89968]/40 bg-[#a89968]/10 px-3 py-1.5 text-xs font-medium text-[#d4c4a8] hover:bg-[#a89968]/20"
                  >
                    Create invoice from this job
                  </Link>
                ) : null}
                <form action={updateInquiryFromForm} className="flex flex-wrap items-center gap-2">
                  <input type="hidden" name="id" value={q.id} />
                  <label className="text-xs text-zinc-500">Status</label>
                  <select
                    name="status"
                    defaultValue={q.status}
                    className="rounded-lg border border-white/[0.1] bg-white/[0.05] px-3 py-1.5 text-sm text-zinc-200"
                  >
                    <option value="NEW">New</option>
                    <option value="IN_PROGRESS">In progress</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                  <button
                    type="submit"
                    className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/[0.05]"
                  >
                    Save status
                  </button>
                </form>
                <DeleteInquiryForm id={q.id} />
              </div>
              <form action={updateInquiryNoteForm} className="mt-4 space-y-2">
                <input type="hidden" name="id" value={q.id} />
                <label className="block text-xs text-zinc-500">
                  Internal note (only your team sees this)
                </label>
                <textarea
                  name="internalNote"
                  rows={2}
                  defaultValue={q.internalNote ?? ""}
                  className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-zinc-200"
                />
                <button
                  type="submit"
                  className="rounded-lg border border-[#a89968]/30 px-3 py-1.5 text-xs text-[#d4c4a8] hover:bg-[#a89968]/10"
                >
                  Save note
                </button>
              </form>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
