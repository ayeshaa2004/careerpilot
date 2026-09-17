const steps = [
  {
    number: "01",
    title: "Add your resume",
    description:
      "Upload your resume or paste its contents so CareerPilot can understand your experience and skills.",
  },
  {
    number: "02",
    title: "Add the job",
    description: "Paste the job description for the role you're interested in.",
  },
  {
    number: "03",
    title: "Get AI insights",
    description:
      "CareerPilot analyzes both and gives you personalized skill gaps, insights, and interview preparation.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-indigo-600">
            How it works
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            From application to preparation.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-gray-600">
            Three simple steps to turn a job description into a personalized
            preparation plan.
          </p>
        </div>

        <div className="relative mt-16 grid gap-10 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="relative text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-900 text-lg font-semibold text-white shadow-lg">
                {step.number}
              </div>

              <h3 className="mt-7 text-xl font-semibold text-gray-900">
                {step.title}
              </h3>

              <p className="mx-auto mt-4 max-w-sm leading-7 text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
