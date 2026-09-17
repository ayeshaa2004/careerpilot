export default function Footer() {
  return (
    <footer className="border-t border-gray-200 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 sm:flex-row">
        <div>
          <p className="text-lg font-bold text-gray-900">CareerPilot</p>
          <p className="mt-1 text-sm text-gray-500">
            Prepare smarter. Apply with confidence.
          </p>
        </div>

        <p className="text-sm text-gray-400">
          © 2026 CareerPilot. Built with Next.js & AI.
        </p>
      </div>
    </footer>
  );
}
