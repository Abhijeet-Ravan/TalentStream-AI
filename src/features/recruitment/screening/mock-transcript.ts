type MockTranscriptInput = {
  candidateName: string;
  jobTitle: string;
  currentRole?: string | null;
  currentCompany?: string | null;
  experienceYears?: number | null;
  noticePeriod?: string | null;
  requiredSkills: string[];
  candidateSkills: string[];
};

export const getMockTranscriptFromExternalApi = async (
  input: MockTranscriptInput,
) => {
  const topRequiredSkills = input.requiredSkills.slice(0, 4);
  const topCandidateSkills = input.candidateSkills.slice(0, 5);
  const discussedSkills = [...new Set([
    ...topRequiredSkills,
    ...topCandidateSkills,
  ])].slice(0, 6);

  const transcript = [
    `Agent: Hi ${input.candidateName}, this is your AI screening for the ${input.jobTitle} role. I will ask about your resume, skills, experience, and availability.`,
    `Candidate: Sure, happy to discuss my background.`,
    `Agent: Your profile mentions ${topCandidateSkills.join(', ') || 'several relevant skills'}. Can you explain where you used these?`,
    `Candidate: I have worked with ${discussedSkills.join(', ') || 'the mentioned skills'} in my previous role as ${input.currentRole ?? 'a candidate'}. I used them in production work, collaborated with teams, and handled practical implementation challenges.`,
    `Agent: The job requires ${topRequiredSkills.join(', ') || 'role-specific skills'}. Which of these are you strongest in?`,
    `Candidate: I am strongest in ${topRequiredSkills.slice(0, 2).join(' and ') || 'the core requirements'}. I can explain the workflows, tradeoffs, and debugging steps because I have used them directly.`,
    `Agent: Can you describe one project or responsibility from your resume in detail?`,
    `Candidate: In my role at ${input.currentCompany ?? 'my previous company'}, I owned implementation work, coordinated with stakeholders, and improved delivery quality. My experience is around ${input.experienceYears ?? 'several'} years.`,
    `Agent: What is your current notice period?`,
    `Candidate: My notice period is ${input.noticePeriod ?? 'open for discussion'}.`,
    `Agent: Do you have any questions for the recruiter?`,
    `Candidate: I would like to understand the team structure, project expectations, and growth path for this role.`,
  ].join('\n\n');

  return {
    externalSessionId: `mock-screening-session-${Date.now()}`,
    provider: 'mock-transcript-api',
    recordingUrl: 'https://example.com/mock-recording.mp3',
    transcript,
  };
};
