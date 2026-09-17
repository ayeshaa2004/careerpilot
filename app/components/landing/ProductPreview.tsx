export default function ProductPreview() {
  return (
    <section className="px-6 pb-24">
      <div className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">
          {/* Top bar */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
            </div>

            <p className="text-sm font-medium text-gray-500">
              CareerPilot Dashboard
            </p>

            <div className="w-16" />
          </div>

          {/* Dashboard */}
          <div className="grid min-h-[420px] md:grid-cols-[220px_1fr]">
            {/* Sidebar */}
            <aside className="hidden border-r border-gray-200 bg-gray-50 p-5 md:block">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Workspace
              </p>

              <div className="mt-5 space-y-2">
                <div className="rounded-xl bg-white px-4 py-3 text-sm font-medium shadow-sm">
                  New Analysis
                </div>

                <div className="px-4 py-3 text-sm text-gray-500">
                  Saved Applications
                </div>

                <div className="px-4 py-3 text-sm text-gray-500">
                  Interview Coach
                </div>
              </div>
            </aside>

            {/* Main content */}
            <div className="p-6 md:p-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Good morning 👋</p>
                  <h2 className="mt-1 text-2xl font-bold text-gray-900">
                    Analyze your next opportunity
                  </h2>
                </div>

                <div className="hidden rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 sm:block">
                  AI Ready
                </div>
              </div>

              <div className="mt-8 grid gap-5 md:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 p-5">
                  <p className="text-sm font-medium text-gray-500">
                    Your Resume
                  </p>

                  <div className="mt-4 rounded-xl bg-gray-50 p-4">
                    <p className="font-medium text-gray-800">
                      Ayesha_Aziz_Resume.pdf
                    </p>
                    <p className="mt-1 text-sm text-gray-400">
                      Ready for analysis
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 p-5">
                  <p className="text-sm font-medium text-gray-500">
                    Job Description
                  </p>

                  <div className="mt-4 rounded-xl bg-gray-50 p-4">
                    <p className="font-medium text-gray-800">
                      Frontend Developer
                    </p>
                    <p className="mt-1 text-sm text-gray-400">
                      React · TypeScript · Next.js
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-gray-900 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">
                      AI Analysis
                    </p>
                    <p className="mt-1 font-medium">
                      Your personalized insights are ready.
                    </p>
                  </div>

                  <div className="rounded-full bg-white/10 px-4 py-2 text-sm">
                    View results →
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-sm text-gray-400">
          A smarter way to prepare for your next opportunity.
        </p>
      </div>
    </section>
  );
}