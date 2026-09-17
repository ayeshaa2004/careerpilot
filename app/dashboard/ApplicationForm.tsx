"use client";

import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export default function ApplicationForm() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  type Analysis = {
    summary: string;
    relevantSkills: string[];
    skillGaps: string[];
    relevantExperience: string[];
    improvements: string[];
    interviewQuestions: string[];
  };

  const extractPdfText = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer,
    }).promise;

    let text = "";

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();

      const pageText = content.items
        .map((item) => ("str" in item ? item.str : ""))
        .join(" ");

      text += pageText + "\n";
    }

    return text;
  };

  const extractDocxText = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();

    const result = await mammoth.extractRawText({
      arrayBuffer,
    });

    return result.value;
  };
  const handleAnalyze = async () => {
    setLoading(true);
    setError("");
    setAnalysis(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resume,
          jobDescription,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setAnalysis(data.analysis);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div className="mt-10 rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-indigo-500" />

          <p className="text-sm font-medium text-indigo-900">
            AI analysis ready
          </p>
        </div>

        <p className="mt-1 pl-5 text-sm text-indigo-700/70">
          Add your resume and job description to begin your personalized
          analysis.
        </p>
      </div>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        {/* Resume */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Upload Resume
          </label>

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={async (e) => {
              const file = e.target.files?.[0] || null;

              if (!file) return;

              setResumeFile(file);
              setUploading(true);

              try {
                if (file.type === "application/pdf") {
                  const text = await extractPdfText(file);
                  setResume(text);
                } else if (
                  file.type ===
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                ) {
                  const text = await extractDocxText(file);
                  setResume(text);
                }
              } catch (error) {
                console.error("Failed to extract resume text:", error);
              } finally {
                setUploading(false);
              }
            }}
            className="block w-full rounded-xl border border-gray-200 bg-white p-3 text-sm"
          />

          {resumeFile && (
            <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-sm font-medium text-gray-800">
                {uploading ? "Reading resume..." : "Resume uploaded"}
              </p>

              <p className="mt-1 text-xs text-gray-500">{resumeFile.name}</p>
            </div>
          )}
          <p className="mt-2 text-xs text-gray-500">
            PDF or DOCX files are supported.
          </p>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Your Resume
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Paste your resume content below.
              </p>
            </div>

            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
              Step 1
            </span>
          </div>

          <textarea
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            placeholder="Paste your resume here..."
            className="mt-6 min-h-72 w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          <p className="mt-2 text-right text-xs text-gray-400">
            {resume.length} characters
          </p>
        </div>

        {/* Job Description */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Job Description
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Paste the role you are applying for.
              </p>
            </div>

            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
              Step 2
            </span>
          </div>

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            className="mt-6 min-h-72 w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          <p className="mt-2 text-right text-xs text-gray-400">
            {jobDescription.length} characters
          </p>
        </div>
        <div className="lg:col-span-2 flex justify-center pt-2">
          <button
            onClick={handleAnalyze}
            disabled={loading || !resume.trim() || !jobDescription.trim()}
            className="rounded-full bg-gray-900 px-8 py-3.5 font-medium text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "Analyzing..." : "Analyze Application →"}{" "}
          </button>
        </div>
      </section>
      {error && (
        <div className="lg:col-span-2 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
          {error}
        </div>
      )}
      {analysis && (
        <div className="lg:col-span-2 space-y-6">
          {/* Summary */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-indigo-600">AI Analysis</p>

            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              Application Overview
            </h2>

            <p className="mt-4 leading-7 text-gray-600">{analysis.summary}</p>
          </div>

          {/* Skills */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">
                Relevant Skills
              </h3>

              <div className="mt-4 flex flex-wrap gap-2">
                {analysis.relevantSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">
                Skill Gaps
              </h3>

              <ul className="mt-4 space-y-3">
                {analysis.skillGaps.map((gap, index) => (
                  <li key={index} className="text-sm leading-6 text-gray-600">
                    • {gap}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Experience */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">
              Relevant Experience
            </h3>

            <ul className="mt-4 space-y-3">
              {analysis.relevantExperience.map((experience, index) => (
                <li key={index} className="text-sm leading-7 text-gray-600">
                  • {experience}
                </li>
              ))}
            </ul>
          </div>

          {/* Improvements */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">
              Areas to Improve
            </h3>

            <ul className="mt-4 space-y-3">
              {analysis.improvements.map((improvement, index) => (
                <li key={index} className="text-sm leading-7 text-gray-600">
                  • {improvement}
                </li>
              ))}
            </ul>
          </div>

          {/* Interview Questions */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">
              Interview Questions
            </h3>

            <div className="mt-5 space-y-4">
              {analysis.interviewQuestions.map((question, index) => (
                <div key={index} className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                    Question {String(index + 1).padStart(2, "0")}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-gray-700">
                    {question}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
