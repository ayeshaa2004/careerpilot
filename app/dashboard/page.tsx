import { auth } from "@clerk/nextjs/server";
import Navbar from "../components/shared/Navbar";
import ApplicationForm from "./ApplicationForm";

export default async function Dashboard() {
  await auth.protect();

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#fafafa] px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-medium text-indigo-600">
            CareerPilot
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900">
            Analyze your next opportunity.
          </h1>

          <p className="mt-3 max-w-2xl text-gray-600">
            Add your resume and a job description to get personalized AI
            insights.
          </p>

          <ApplicationForm />
        </div>
      </main>
    </>
  );
}