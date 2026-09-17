import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  await auth.protect();
  try {
    const { resume, jobDescription } = await req.json();

    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",

      messages: [
        {
          role: "system",
          content:
            "You are an AI career assistant that analyzes resumes against job descriptions.",
        },
        {
          role: "user",
          content: `
Analyze the candidate's resume against the job description.

Be factual and only use information present in the resume or job description.

RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}
`,
        },
      ],

      response_format: {
        type: "json_schema",
        json_schema: {
          name: "career_analysis",
          strict: true,

          schema: {
            type: "object",

            properties: {
              summary: {
                type: "string",
              },

              relevantSkills: {
                type: "array",
                items: {
                  type: "string",
                },
              },

              skillGaps: {
                type: "array",
                items: {
                  type: "string",
                },
              },

              relevantExperience: {
                type: "array",
                items: {
                  type: "string",
                },
              },

              improvements: {
                type: "array",
                items: {
                  type: "string",
                },
              },

              interviewQuestions: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },

            required: [
              "summary",
              "relevantSkills",
              "skillGaps",
              "relevantExperience",
              "improvements",
              "interviewQuestions",
            ],

            additionalProperties: false,
          },
        },
      },
    });

    const analysis = response.choices[0]?.message?.content;

    return Response.json({
      analysis: JSON.parse(analysis || "{}"),
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Something went wrong.",
      },
      { status: 500 },
    );
  }
}
