import type { MockMatchScoreResult } from './types';
import type { candidatesSchema, jobsSchema } from '@/models/Schema';

type JobLike = typeof jobsSchema.$inferSelect;
type CandidateLike = typeof candidatesSchema.$inferSelect;

const normalize = (value: string) => value.trim().toLowerCase();

const getSkillNames = (candidate: CandidateLike) =>
  candidate.skills.map(skill => skill.name);

const getTier = (score: number) => {
  if (score >= 90) {
    return 'high_priority';
  }

  if (score >= 80) {
    return 'recommended';
  }

  if (score >= 65) {
    return 'review';
  }

  return 'low_fit';
};

export const calculateMockMatchScore = (
  job: JobLike,
  candidate: CandidateLike,
): MockMatchScoreResult => {
  const candidateSkills = getSkillNames(candidate);
  const candidateSkillSet = new Set(candidateSkills.map(normalize));
  const requiredSkills = job.requiredSkills ?? [];
  const preferredSkills = job.preferredSkills ?? [];
  const skillsMatched = requiredSkills.filter(skill => candidateSkillSet.has(normalize(skill)));
  const preferredMatched = preferredSkills.filter(skill => candidateSkillSet.has(normalize(skill)));
  const skillsMissing = requiredSkills.filter(skill => !candidateSkillSet.has(normalize(skill)));
  const requiredScore = requiredSkills.length === 0
    ? 25
    : Math.round((skillsMatched.length / requiredSkills.length) * 35);
  const preferredScore = preferredSkills.length === 0
    ? 10
    : Math.round((preferredMatched.length / preferredSkills.length) * 15);
  const experienceScore = candidate.experienceYears >= job.experienceMin
    && candidate.experienceYears <= job.experienceMax
    ? 20
    : Math.max(8, 20 - Math.abs(candidate.experienceYears - job.experienceMax) * 2);
  const locationScore = normalize(candidate.location).includes(normalize(job.location).split(',')[0] ?? '')
    ? 10
    : 6;
  const noticeScore = candidate.noticePeriod.includes('30') ? 10 : candidate.noticePeriod.includes('45') ? 8 : 5;
  const sourceScore = candidate.source === 'employee_referral' || candidate.source === 'internal' ? 10 : 7;
  const score = Math.max(
    0,
    Math.min(100, requiredScore + preferredScore + experienceScore + locationScore + noticeScore + sourceScore),
  );

  return {
    confidence: Math.min(95, Math.max(65, score + 5)),
    evidenceSnippets: [
      `${skillsMatched.length} must-have skills matched`,
      `${candidate.experienceYears} years experience against ${job.experienceMin}-${job.experienceMax} year range`,
      `${candidate.source.replace('_', ' ')} source signal`,
    ],
    explanation: `${candidate.name} scored ${score}% for ${job.title} based on skill overlap, experience fit, location, notice period, and source signal.`,
    featureScores: {
      experience: experienceScore,
      location: locationScore,
      noticePeriod: noticeScore,
      preferredSkills: preferredScore,
      requiredSkills: requiredScore,
      source: sourceScore,
    },
    industryFit: preferredMatched.length > 0 ? 'Strong adjacent skill and industry signal.' : 'Industry signal needs recruiter validation.',
    negativeSignals: skillsMissing.length > 0 ? [`Missing: ${skillsMissing.join(', ')}`] : [],
    rubricVersion: 'mock-v1',
    score,
    scoreBreakdown: {
      preferredMatched,
      requiredMatched: skillsMatched,
    },
    skillsMatched,
    skillsMissing,
    tenureFit: experienceScore >= 18 ? 'Experience is inside target range.' : 'Experience is outside target range.',
    tier: getTier(score),
  };
};
