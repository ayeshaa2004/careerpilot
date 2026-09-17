import { POST } from "@/app/api/analyze/route";
import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";
import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

global.Request = class Request {
  body: string;

  constructor(
    public url: string,
    public init?: RequestInit,
  ) {
    this.body = init?.body?.toString() || "";
  }

  async json() {
    return JSON.parse(this.body);
  }
} as unknown as typeof Request;
class TestResponse {
  body: string;
  status: number;

  constructor(body: unknown, init?: ResponseInit) {
    this.body = body?.toString() || "";
    this.status = init?.status || 200;
  }

  async json() {
    return JSON.parse(this.body);
  }

  static json(data: unknown, init?: ResponseInit) {
    return new TestResponse(JSON.stringify(data), init);
  }
}

global.Response = TestResponse as unknown as typeof Response;



jest.mock("groq-sdk", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn(),
      },
    },
  })),
}));

jest.mock("@clerk/nextjs/server", () => ({
  auth: {
    protect: jest.fn(),
  },
}));
const mockCreate = (Groq as unknown as jest.Mock).mock.results[0].value.chat
  .completions.create as jest.Mock;

describe("POST /api/analyze", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns AI analysis successfully", async () => {
    mockCreate.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              summary: "Strong match for the role.",
              relevantSkills: ["React", "TypeScript"],
              skillGaps: ["Testing"],
              relevantExperience: ["Built React applications."],
              improvements: ["Improve testing knowledge."],
              interviewQuestions: [
                "Explain React state management.",
                "How do you handle API errors?",
                "Why would you use TypeScript?",
              ],
            }),
          },
        },
      ],
    });

    const request = new Request("http://localhost:3000/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resume: "React developer with TypeScript experience.",
        jobDescription: "Looking for a React developer.",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.analysis).toBeDefined();

    expect(data.analysis.summary).toBe("Strong match for the role.");

    expect(data.analysis.relevantSkills).toEqual(["React", "TypeScript"]);

    expect(data.analysis.skillGaps).toEqual(["Testing"]);

    expect(data.analysis.interviewQuestions).toHaveLength(3);
  });

  test("sends resume and job description to Groq", async () => {
    mockCreate.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              summary: "Good match.",
              relevantSkills: ["React"],
              skillGaps: [],
              relevantExperience: [],
              improvements: [],
              interviewQuestions: [],
            }),
          },
        },
      ],
    });

    const resume = "Frontend developer with React experience.";
    const jobDescription = "Looking for a React developer.";

    const request = new Request("http://localhost:3000/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resume,
        jobDescription,
      }),
    });

    await POST(request);

    expect(mockCreate).toHaveBeenCalledTimes(1);

    const call = mockCreate.mock.calls[0][0];

    expect(call.model).toBe("openai/gpt-oss-120b");
    expect(call.messages[1].content).toContain(resume);
    expect(call.messages[1].content).toContain(jobDescription);
  });

  test("calls Clerk authentication protection", async () => {
    mockCreate.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              summary: "Good match.",
              relevantSkills: [],
              skillGaps: [],
              relevantExperience: [],
              improvements: [],
              interviewQuestions: [],
            }),
          },
        },
      ],
    });

    const request = new Request("http://localhost:3000/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resume: "React developer",
        jobDescription: "React developer needed",
      }),
    });

    await POST(request);

    expect(auth.protect).toHaveBeenCalledTimes(1);
  });

  test("returns 500 when Groq API fails", async () => {
    mockCreate.mockRejectedValue(new Error("Groq API failed"));

    const request = new Request("http://localhost:3000/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resume: "React developer",
        jobDescription: "React developer needed",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);

    expect(data).toEqual({
      error: "Something went wrong.",
    });
  });

  test("returns 500 when the request body is invalid", async () => {
    const request = new Request("http://localhost:3000/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: "invalid json",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);

    expect(data).toEqual({
      error: "Something went wrong.",
    });
  });
});
