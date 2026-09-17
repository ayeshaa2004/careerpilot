const features = [
  {
    number: "01",
    title: "Analyze your fit",
    description:
      "Compare your resume with a job description and understand how your experience matches the role.",
  },
  {
    number: "02",
    title: "Discover skill gaps",
    description:
      "See the skills and technologies mentioned in the role that are missing or less visible in your resume.",
  },
  {
    number: "03",
    title: "Prepare with AI",
    description:
      "Get personalized interview questions and practical feedback based on the role you're applying for.",
  },
];

export default function Features() {
  return (
    <section id="features" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-indigo-600">
            What CareerPilot does
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Everything you need to approach a job with confidence.
          </h2>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.number}
              className="group rounded-3xl border border-gray-200 bg-white p-8 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <span className="text-sm font-semibold text-indigo-600">
                {feature.number}
              </span>

              <h3 className="mt-8 text-xl font-semibold text-gray-900">
                {feature.title}
              </h3>

              <p className="mt-4 leading-7 text-gray-600">
                {feature.description}
              </p>

              <div className="mt-8 h-px w-12 bg-gray-200 transition-all duration-300 group-hover:w-20" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}