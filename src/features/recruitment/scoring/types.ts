export type MockMatchScoreResult = {
  confidence: number;
  evidenceSnippets: string[];
  explanation: string;
  featureScores: Record<string, number>;
  industryFit: string;
  negativeSignals: string[];
  rubricVersion: string;
  score: number;
  scoreBreakdown: Record<string, unknown>;
  skillsMatched: string[];
  skillsMissing: string[];
  tenureFit: string;
  tier: string;
};
