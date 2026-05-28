type MockLlmScoringInput = {
  candidateName: string;
  jobTitle: string;
  transcript: string;
  requiredSkills: string[];
  candidateSkills: string[];
  experienceYears?: number | null;
  noticePeriod?: string | null;
};

const includesSkill = (transcript: string, skill: string) =>
  transcript.toLowerCase().includes(skill.toLowerCase());

export const scoreMockTranscriptWithLlm = async (
  input: MockLlmScoringInput,
) => {
  const confirmedRequiredSkills = input.requiredSkills.filter(skill =>
    includesSkill(input.transcript, skill),
  );

  const confirmedResumeSkills = input.candidateSkills.filter(skill =>
    includesSkill(input.transcript, skill),
  );

  const missingRequiredSkills = input.requiredSkills.filter(skill =>
    !confirmedRequiredSkills.includes(skill),
  );

  const requiredSkillScore = input.requiredSkills.length === 0
    ? 25
    : Math.round((confirmedRequiredSkills.length / input.requiredSkills.length) * 30);

  const resumeVerificationScore = input.candidateSkills.length === 0
    ? 18
    : Math.round((confirmedResumeSkills.length / input.candidateSkills.length) * 25);

  const explanationDepthScore = input.transcript.toLowerCase().includes('production')
    || input.transcript.toLowerCase().includes('implementation')
    || input.transcript.toLowerCase().includes('debugging')
    ? 20
    : 12;

  const availabilityScore = input.noticePeriod ? 10 : 6;
  const communicationScore = 12;

  const riskPenalty = missingRequiredSkills.length >= 3 ? 8 : 0;

  const score = Math.max(
    45,
    Math.min(
      94,
      requiredSkillScore
      + resumeVerificationScore
      + explanationDepthScore
      + availabilityScore
      + communicationScore
      - riskPenalty,
    ),
  );

  const recommendation = score >= 85
    ? 'Strong proceed to recruiter review'
    : score >= 75
      ? 'Proceed after recruiter validation'
      : score >= 65
        ? 'Hold for recruiter calibration'
        : 'Do not proceed without manual review';

  const qualificationTag = score >= 80
    ? 'qualified'
    : score >= 65
      ? 'borderline'
      : 'not_qualified';

  return {
    candidateQuestions: [
      'Can you share a deeper example of your strongest project?',
      'Which required skill have you used most recently?',
      'What team size and ownership level did you have?',
    ],
    qualificationTag,
    recommendation,
    resumeCrossCheck: {
      confirmedClaims: confirmedResumeSkills,
      contradictedClaims: [],
      result: missingRequiredSkills.length >= 3 ? 'partial_match' : 'mock_match',
      summary: `${confirmedResumeSkills.length} resume skills were supported by the transcript. ${missingRequiredSkills.length} required skills need recruiter follow-up.`,
      unverifiedClaims: input.candidateSkills.filter(skill =>
        !confirmedResumeSkills.includes(skill),
      ),
    },
    score,
    sentiment: 'positive',
    structuredSummary: {
      availabilityCaptured: Boolean(input.noticePeriod),
      communicationClarity: communicationScore,
      experienceYears: input.experienceYears ?? null,
      explanationDepthScore,
      confirmedRequiredSkills,
      confirmedResumeSkills,
      missingRequiredSkills,
      requiredSkillScore,
      resumeVerificationScore,
      rubricVersion: 'mock-transcript-llm-v1',
    },
    summary: `${input.candidateName} completed an AI screening for ${input.jobTitle}. The mock LLM found ${confirmedRequiredSkills.length} required skills and ${confirmedResumeSkills.length} resume skills supported by the transcript. Recommendation: ${recommendation}.`,
  };
};
