import { GoogleGenAI, Type } from '@google/genai';
import { Env } from '@/libs/Env';

type GeminiScoringInput = {
  candidateName: string;
  candidateSkills: string[];
  experienceYears?: number | null;
  jobDescription: string;
  jobTitle: string;
  noticePeriod?: string | null;
  requiredSkills: string[];
  resumeText: string;
  transcript: string;
};

const ai = new GoogleGenAI({
  apiKey: Env.GEMINI_API_KEY,
});

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    candidateQuestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    qualificationTag: {
      type: Type.STRING,
    },
    recommendation: {
      type: Type.STRING,
    },
    resumeCrossCheck: {
      type: Type.OBJECT,
      properties: {
        confirmedClaims: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        contradictedClaims: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        result: {
          type: Type.STRING,
        },
        summary: {
          type: Type.STRING,
        },
        unverifiedClaims: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
      required: [
        'confirmedClaims',
        'contradictedClaims',
        'result',
        'summary',
        'unverifiedClaims',
      ],
    },
    score: {
      type: Type.NUMBER,
    },
    sentiment: {
      type: Type.STRING,
    },
    structuredSummary: {
      type: Type.OBJECT,
      properties: {
        communicationClarity: { type: Type.NUMBER },
        experienceFit: { type: Type.NUMBER },
        explanationDepth: { type: Type.NUMBER },
        jdSkillCoverage: { type: Type.NUMBER },
        resumeClaimVerification: { type: Type.NUMBER },
        riskScore: { type: Type.NUMBER },
        rubricVersion: { type: Type.STRING },
      },
      required: [
        'communicationClarity',
        'experienceFit',
        'explanationDepth',
        'jdSkillCoverage',
        'resumeClaimVerification',
        'riskScore',
        'rubricVersion',
      ],
    },
    summary: {
      type: Type.STRING,
    },
  },
  required: [
    'candidateQuestions',
    'qualificationTag',
    'recommendation',
    'resumeCrossCheck',
    'score',
    'sentiment',
    'structuredSummary',
    'summary',
  ],
};

export const scoreTranscriptWithGemini = async (input: GeminiScoringInput) => {
  const prompt = `
You are an AI recruitment screening evaluator.

Evaluate the candidate using ONLY the provided transcript, resume/profile text, and job description.

Return a strict JSON object matching the provided schema.

Scoring rules:
- score must be 0 to 100.
- Do not reward a candidate just for saying "yes".
- Look for evidence, explanation depth, examples, and consistency.
- Compare transcript claims against resume/profile text.
- Compare transcript evidence against JD required skills.
- Identify contradictions and unverified claims.
- Keep the recommendation useful for a recruiter, not a final hiring decision.

Candidate name:
${input.candidateName}

Job title:
${input.jobTitle}

Required skills:
${input.requiredSkills.join(', ') || 'Not provided'}

Candidate/resume skills:
${input.candidateSkills.join(', ') || 'Not provided'}

Candidate experience:
${input.experienceYears ?? 'Not provided'}

Notice period:
${input.noticePeriod ?? 'Not provided'}

Resume/profile text:
${input.resumeText}

Job description:
${input.jobDescription}

Transcript:
${input.transcript}
`;

  const response = await ai.models.generateContent({
    model: Env.GEMINI_MODEL,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema,
      temperature: 0.2,
    },
  });

  if (!response.text) {
    throw new Error('Gemini returned an empty scoring response.');
  }

  const parsed = JSON.parse(response.text) as {
    candidateQuestions: string[];
    qualificationTag: string;
    recommendation: string;
    resumeCrossCheck: {
      confirmedClaims: string[];
      contradictedClaims: string[];
      result: string;
      summary: string;
      unverifiedClaims: string[];
    };
    score: number;
    sentiment: string;
    structuredSummary: Record<string, unknown>;
    summary: string;
  };

  return {
    ...parsed,
    score: Math.max(0, Math.min(100, Math.round(parsed.score))),
    structuredSummary: {
      ...parsed.structuredSummary,
      rubricVersion: 'gemini-transcript-screening-v1',
    },
  };
};
