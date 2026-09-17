import Link from "next/link";

export default function CTA() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-gray-900 px-8 py-16 text-center text-white shadow-2xl sm:px-16">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-indigo-300">
          Your next opportunity starts here
        </p>

        <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
          Stop guessing. Start preparing smarter.
        </h2>

        <p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-400">
          Let AI help you understand the role, identify what to improve, and
          prepare for the conversation ahead.
        </p>

        <Link
          href="/dashboard"
          className="mt-6 inline-block rounded-full bg-white px-7 py-3 font-medium text-gray-900 transition hover:scale-105"
        >
          Analyze a Job
        </Link>
      </div>
    </section>
  );
}
