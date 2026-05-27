import { StickyBanner } from '@/features/landing/StickyBanner';
import { Link } from '@/libs/I18nNavigation';

export const DemoBanner = () => (
  <StickyBanner>
    TalentStream AI recruiter workspace -
    {' '}
    <Link href="/sign-up">Create your recruiter account</Link>
  </StickyBanner>
);
