import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
import ApplicationForm from "../ApplicationForm";

Object.defineProperty(File.prototype, "arrayBuffer", {
  configurable: true,
  value: async function () {
    return new ArrayBuffer(0);
  },
});

jest.mock("pdfjs-dist", () => ({
  GlobalWorkerOptions: {
    workerSrc: "",
  },
  getDocument: jest.fn(),
}));

jest.mock("mammoth", () => ({
  extractRawText: jest.fn(),
}));

afterEach(() => {
  jest.restoreAllMocks();
});

describe("ApplicationForm", () => {
  test("renders resume and job description fields", () => {
    render(<ApplicationForm />);

    expect(
      screen.getByPlaceholderText("Paste your resume here..."),
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Paste the job description here..."),
    ).toBeInTheDocument();
  });

  test("analyze button is disabled when fields are empty", () => {
    render(<ApplicationForm />);

    const button = screen.getByRole("button", {
      name: /analyze application/i,
    });

    expect(button).toBeDisabled();
  });

  test("analyze button becomes enabled when both fields have text", async () => {
    const user = userEvent.setup();

    render(<ApplicationForm />);

    const resumeInput = screen.getByPlaceholderText(
      "Paste your resume here...",
    );

    const jobDescriptionInput = screen.getByPlaceholderText(
      "Paste the job description here...",
    );

    await user.type(resumeInput, "Frontend Developer with React experience.");

    await user.type(
      jobDescriptionInput,
      "Looking for a React developer with TypeScript experience.",
    );

    const button = screen.getByRole("button", {
      name: /analyze application/i,
    });

    expect(button).toBeEnabled();
  });
  test("shows AI analysis results after successful API response", async () => {
    const user = userEvent.setup();

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        analysis: {
          summary: "Strong match for the frontend role.",
          relevantSkills: ["React", "TypeScript"],
          skillGaps: ["Testing"],
          relevantExperience: ["Built a React application."],
          improvements: ["Improve testing knowledge."],
          interviewQuestions: ["Explain React state management."],
        },
      }),
    });

    render(<ApplicationForm />);

    await user.type(
      screen.getByPlaceholderText("Paste your resume here..."),
      "React developer with TypeScript experience.",
    );

    await user.type(
      screen.getByPlaceholderText("Paste the job description here..."),
      "Looking for a React developer.",
    );

    await user.click(
      screen.getByRole("button", {
        name: /analyze application/i,
      }),
    );

    expect(await screen.findByText("Application Overview")).toBeInTheDocument();

    expect(
      screen.getByText("Strong match for the frontend role."),
    ).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText(/Testing/)).toBeInTheDocument();
    expect(
      screen.getByText("Explain React state management."),
    ).toBeInTheDocument();
  });
  test("shows loading state while analysis is in progress", async () => {
    const user = userEvent.setup();

    global.fetch = jest.fn(() => new Promise(() => {})) as jest.Mock;

    render(<ApplicationForm />);

    await user.type(
      screen.getByPlaceholderText("Paste your resume here..."),
      "React developer with TypeScript experience.",
    );

    await user.type(
      screen.getByPlaceholderText("Paste the job description here..."),
      "Looking for a React developer.",
    );

    await user.click(
      screen.getByRole("button", {
        name: /analyze application/i,
      }),
    );

    expect(screen.getByText("Analyzing...")).toBeInTheDocument();
  });
  test("shows an error message when analysis fails", async () => {
    const user = userEvent.setup();

    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({
        error: "Something went wrong.",
      }),
    }) as jest.Mock;

    render(<ApplicationForm />);

    await user.type(
      screen.getByPlaceholderText("Paste your resume here..."),
      "React developer with TypeScript experience.",
    );

    await user.type(
      screen.getByPlaceholderText("Paste the job description here..."),
      "Looking for a React developer.",
    );

    await user.click(
      screen.getByRole("button", {
        name: /analyze application/i,
      }),
    );

    expect(
      await screen.findByText("Something went wrong."),
    ).toBeInTheDocument();
  });
  test("extracts text when a PDF resume is uploaded", async () => {
    const user = userEvent.setup();

    const mockGetDocument = jest.fn().mockReturnValue({
      promise: Promise.resolve({
        numPages: 1,
        getPage: jest.fn().mockResolvedValue({
          getTextContent: jest.fn().mockResolvedValue({
            items: [{ str: "Ayesha Aziz" }, { str: "React Developer" }],
          }),
        }),
      }),
    });

    jest.mocked(pdfjsLib.getDocument).mockImplementation(mockGetDocument);

    render(<ApplicationForm />);

    const file = new File(["fake pdf content"], "resume.pdf", {
      type: "application/pdf",
    });
    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    await user.upload(fileInput, file);
    expect(await screen.findByText("Resume uploaded")).toBeInTheDocument();
    expect(screen.getByText("resume.pdf")).toBeInTheDocument();
  });
  test("extracts text when a DOCX resume is uploaded", async () => {
    const user = userEvent.setup();

    jest.mocked(mammoth.extractRawText).mockResolvedValue({
      value: "Ayesha Aziz\nFrontend Developer",
      messages: [],
    });

    render(<ApplicationForm />);

    const file = new File(["fake docx content"], "resume.docx", {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    await user.upload(fileInput, file);

    expect(await screen.findByText("Resume uploaded")).toBeInTheDocument();

    expect(screen.getByText("resume.docx")).toBeInTheDocument();
  });
});
