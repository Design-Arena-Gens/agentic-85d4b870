import { collectJobs, type AggregatedJob } from "../lib/jobs";

export const revalidate = 1800;

const profile = {
  name: "Marwen Slimen",
  experience: "1.5+ years",
  skills: [
    "Digital marketing",
    "Content creation",
    "Social media management",
    "Videography & video editing",
    "Graphic design",
    "WordPress development",
    "SEO basics",
  ],
  preferredCountries: ["United Kingdom", "Netherlands", "Belgium", "Ireland", "Italy"],
};

const formatDate = (iso?: string) => {
  if (!iso) return "Date not listed";
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return "Date not listed";
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
  }).format(parsed);
};

const pickApplyLink = (job: AggregatedJob) =>
  job.externalApplyUrl ?? job.applyUrl ?? job.linkedinUrl;

const VisaBadge = ({ label }: { label: string }) => (
  <span
    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
      label.includes("not")
        ? "bg-zinc-100 text-zinc-700"
        : "bg-emerald-100 text-emerald-700"
    }`}
  >
    {label}
  </span>
);

const JobCard = ({ job }: { job: AggregatedJob }) => {
  const applyHref = pickApplyLink(job);

  return (
    <article className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 group-hover:text-blue-700">
            <a href={job.linkedinUrl} target="_blank" rel="noreferrer">
              {job.title}
            </a>
          </h3>
          <p className="text-sm text-zinc-600">
            {job.company} • {job.location}
          </p>
        </div>
        <VisaBadge label={job.visaStatusLabel} />
      </div>

      <dl className="mt-4 space-y-1 text-sm text-zinc-600">
        <div className="flex items-center gap-2">
          <dt className="font-medium text-zinc-500">Country</dt>
          <dd>{job.country}</dd>
        </div>
        <div className="flex items-center gap-2">
          <dt className="font-medium text-zinc-500">Fit</dt>
          <dd>{job.roleLabel}</dd>
        </div>
        <div className="flex items-center gap-2">
          <dt className="font-medium text-zinc-500">Posted</dt>
          <dd>{formatDate(job.postedAt)}</dd>
        </div>
      </dl>

      <p className="mt-4 text-sm leading-relaxed text-zinc-700">{job.reason}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={applyHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Apply Directly
        </a>
        <a
          href={job.linkedinUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-full border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:border-blue-400 hover:text-blue-700"
        >
          View on LinkedIn
        </a>
      </div>
    </article>
  );
};

export default async function Home() {
  const jobs = await collectJobs();

  return (
    <div className="min-h-screen bg-slate-950 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-12 text-slate-50">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6">
        <header className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-lg backdrop-blur">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1 text-sm font-medium text-emerald-200">
                🚀 Job-Search Assistant — Global Marketing Roles
              </span>
              <h1 className="text-3xl font-semibold text-white md:text-4xl">
                Opportunities aligned with {profile.name}&apos;s creative marketing profile
              </h1>
              <p className="text-base text-slate-200 md:text-lg">
                Scanning LinkedIn job listings across {profile.preferredCountries.join(", ")} for
                full-time on-site roles that can offer visa sponsorship possibilities.
              </p>
              <div className="flex flex-wrap gap-2 text-sm text-slate-200">
                <span className="rounded-full border border-white/20 px-3 py-1">
                  Experience: {profile.experience}
                </span>
                <span className="rounded-full border border-white/20 px-3 py-1">
                  Primary Skills: {profile.skills.slice(0, 3).join(", ")}…
                </span>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-inner">
              <p className="text-2xl font-bold text-white">{jobs.length}</p>
              <p className="text-sm text-slate-300">
                Matching roles captured in the latest scan (refreshes hourly)
              </p>
            </div>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          {jobs.length === 0 && (
            <div className="col-span-full rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-200">
              No suitable roles found at the moment. Try refreshing shortly—the assistant keeps
              watching LinkedIn for new postings.
            </div>
          )}
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </section>
      </main>
    </div>
  );
}
