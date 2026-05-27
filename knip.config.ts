import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  // Files to exclude from Knip analysis
  ignore: [
    'checkly.config.ts',
    'src/components/ui/*',
    'src/libs/I18n.ts',
    'src/types/Auth.ts',
  ],
  // Dependencies to ignore during analysis
  ignoreDependencies: [
    '@clerk/shared',
    '@swc/helpers', // Avoid error in CI: "`npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync."
  ],
  // Transitional recruiter UI batches intentionally introduced these ahead of their consumers.
  ignoreIssues: {
    'src/features/dashboard/PageMessage.tsx': ['files'],
    'src/features/recruitment/mock-data.ts': ['exports'],
    'src/features/recruitment/types.ts': ['types'],
    'src/features/recruitment/compliance/actions.ts': ['files'],
    'src/features/recruitment/hiring-manager/actions.ts': ['files'],
    'src/features/recruitment/notifications/actions.ts': ['files'],
  },
  // Include custom Playwright test file suffixes
  playwright: {
    entry: ['tests/**/*.@(integ|e2e).ts'],
  },
  // Binaries to ignore during analysis
  ignoreBinaries: [
    'production', // False positive raised with dotenv-cli
  ],
  compilers: {
    css: (text: string) => [...text.matchAll(/(?<=@)import[^;]+/g)].join('\n'),
  },
  treatConfigHintsAsErrors: true,
};

export default config;
