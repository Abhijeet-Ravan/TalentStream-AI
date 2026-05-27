import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { RecruiterShell } from '@/features/recruitment/layout/RecruiterShell';

type RecruiterLayoutProps = {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
};

export const metadata: Metadata = {
  title: 'TalentStream AI Recruiter',
  description: 'Recruiter operations workspace for TalentStream AI.',
};

export default async function RecruiterLayout(props: RecruiterLayoutProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <RecruiterShell>
      {props.children}
    </RecruiterShell>
  );
}

export const dynamic = 'force-dynamic';
