import { db } from '@/libs/DB';
import {
  applicationsSchema,
  candidatesSchema,
  interviewsSchema,
  jobsSchema,
  matchScoresSchema,
  screeningSessionsSchema,
} from '@/models/Schema';
import {
  applications,
  candidates,
  interviews,
  jobs,
  matchScores,
  screeningSessions,
} from '../mock-data';
import { normalizePipelineStage } from '../stage-utils';

export type DemoSeedCounts = {
  applications: number;
  candidates: number;
  handoffs: number;
  interviewFeedback: number;
  interviews: number;
  jobs: number;
  matchScores: number;
  screeningSessions: number;
};

const defaultDescription = 'Demo role seeded from the TalentStream AI mock recruitment dataset.';
const defaultResponsibilities = 'Own role outcomes, collaborate with hiring stakeholders, and progress candidates through the recruiting workflow.';

export const seedFromMockData = async (input: {
  createdById: string;
  organizationId: string;
}): Promise<DemoSeedCounts> => {
  const insertedJobs = await db
    .insert(jobsSchema)
    .values(jobs.map(job => ({
      avoidIndustries: [],
      createdById: input.createdById,
      department: job.department,
      description: defaultDescription,
      education: 'Relevant degree or equivalent experience preferred.',
      employmentType: job.employmentType,
      experienceMax: job.experienceMax,
      experienceMin: job.experienceMin,
      location: job.location,
      noticePeriod: '30 to 60 days',
      openPositions: job.openPositions,
      organizationId: input.organizationId,
      preferredIndustries: ['Manufacturing', 'Industrial Products'],
      preferredSkills: job.preferredSkills,
      reportingManager: 'Demo Hiring Manager',
      requiredSkills: job.requiredSkills,
      responsibilities: defaultResponsibilities,
      salaryMax: job.experienceMax * 4,
      salaryMin: job.experienceMin * 3,
      status: job.status,
      subFunction: job.department,
      title: job.title,
    })))
    .returning();
  const jobIdByMockId = new Map(jobs.map((job, index) => [job.id, insertedJobs[index]?.id]));

  const insertedCandidates = await db
    .insert(candidatesSchema)
    .values(candidates.map(candidate => ({
      capturedAt: new Date(candidate.createdAt),
      createdById: input.createdById,
      currentCompany: candidate.currentCompany,
      currentRole: candidate.currentRole,
      email: candidate.email,
      expectedSalary: candidate.expectedSalary,
      experienceYears: candidate.experienceYears,
      location: candidate.location,
      name: candidate.name,
      noticePeriod: candidate.noticePeriod,
      openToWork: candidate.status === 'active',
      organizationId: input.organizationId,
      phone: candidate.phone,
      recentSignals: [candidate.matchReason],
      skills: candidate.skills,
      source: candidate.source,
      sourceConfidence: Math.min(95, candidate.matchScore),
      sourceMetadata: { seededFrom: 'mock-data' },
    })))
    .returning();
  const candidateIdByMockId = new Map(candidates.map((candidate, index) => [
    candidate.id,
    insertedCandidates[index]?.id,
  ]));

  const insertedApplications = await db
    .insert(applicationsSchema)
    .values(applications.flatMap((application) => {
      const jobId = jobIdByMockId.get(application.jobId);
      const candidateId = candidateIdByMockId.get(application.candidateId);

      if (!jobId || !candidateId) {
        return [];
      }

      return [{
        candidateId,
        currentStage: normalizePipelineStage(application.currentStage),
        jobId,
        organizationId: input.organizationId,
        status: application.status,
      }];
    }))
    .returning();
  const applicationIdByMockId = new Map(applications.map((application, index) => [
    application.id,
    insertedApplications[index]?.id,
  ]));

  const insertedMatchScores = await db
    .insert(matchScoresSchema)
    .values(matchScores.flatMap((score) => {
      const mockApplication = applications.find(application =>
        application.candidateId === score.candidateId && application.jobId === score.jobId,
      );
      const applicationId = mockApplication ? applicationIdByMockId.get(mockApplication.id) : undefined;

      if (!applicationId) {
        return [];
      }

      return [{
        applicationId,
        confidence: Math.min(95, score.overallScore + 3),
        evidenceSnippets: score.strengths,
        explanation: score.summary,
        featureScores: {
          compensation: score.compensationScore,
          experience: score.experienceScore,
          location: score.locationScore,
          requiredSkills: score.skillScore,
        },
        industryFit: 'Seeded industry fit from mock data.',
        negativeSignals: score.gaps,
        organizationId: input.organizationId,
        rubricVersion: 'mock-seed-v1',
        score: score.overallScore,
        scoreBreakdown: {},
        skillsMatched: score.strengths,
        skillsMissing: score.gaps,
        tenureFit: 'Seeded tenure fit from mock data.',
        tier: score.overallScore >= 88 ? 'high_priority' : 'recommended',
      }];
    }))
    .returning();

  const insertedScreenings = await db
    .insert(screeningSessionsSchema)
    .values(screeningSessions.flatMap((session) => {
      const mockApplication = applications.find(application =>
        application.candidateId === session.candidateId && application.jobId === session.jobId,
      );
      const applicationId = mockApplication ? applicationIdByMockId.get(mockApplication.id) : undefined;

      if (!applicationId) {
        return [];
      }

      return [{
        applicationId,
        attemptCount: 1,
        candidateQuestions: [],
        organizationId: input.organizationId,
        provider: 'mock',
        recommendation: session.status === 'completed' ? 'Proceed after recruiter validation' : undefined,
        resumeCrossCheck: {},
        score: session.status === 'completed' ? 86 : undefined,
        status: session.status,
        structuredSummary: {},
        summary: session.summary,
        transcript: session.summary,
      }];
    }))
    .returning();

  const insertedInterviews = await db
    .insert(interviewsSchema)
    .values(interviews.flatMap((interview) => {
      const mockApplication = applications.find(application =>
        application.candidateId === interview.candidateId && application.jobId === interview.jobId,
      );
      const applicationId = mockApplication ? applicationIdByMockId.get(mockApplication.id) : undefined;

      if (!applicationId) {
        return [];
      }

      return [{
        applicationId,
        interviewerId: 'mock-hiring-manager',
        interviewerName: interview.interviewers.join(', '),
        organizationId: input.organizationId,
        scheduledAt: interview.scheduledAt ? new Date(interview.scheduledAt) : new Date(),
        status: interview.status,
      }];
    }))
    .returning();

  return {
    applications: insertedApplications.length,
    candidates: insertedCandidates.length,
    handoffs: 0,
    interviewFeedback: 0,
    interviews: insertedInterviews.length,
    jobs: insertedJobs.length,
    matchScores: insertedMatchScores.length,
    screeningSessions: insertedScreenings.length,
  };
};
