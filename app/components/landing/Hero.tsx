import Link from "next/link";
export default function Hero() {
  return (
    <section className="px-8 py-24 text-center">
      <div className="mx-auto max-w-4xl">
        <p className="mb-6 text-sm font-medium uppercase tracking-[0.2em] text-indigo-600">
          AI-powered career assistant
        </p>

        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
          Turn job descriptions into
          <span className="block text-indigo-600">
            your interview advantage.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
          Analyze your resume against any job, discover skill gaps, and prepare
          smarter with personalized AI-powered insights.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/dashboard"
            className="rounded-full bg-black px-7 py-3 font-medium text-white transition hover:scale-105"
          >
            Analyze a Job
          </Link>

          <button className="rounded-full border border-gray-300 px-7 py-3 font-medium transition hover:bg-gray-100">
            See how it works
          </button>
        </div>
      </div>
    </section>
  );
}
