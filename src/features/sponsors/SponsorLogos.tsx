import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { LogoCloud } from '@/features/landing/LogoCloud';
import arcjetLogoDark from '@/public/assets/images/arcjet-dark.svg';
import arcjetLogoLight from '@/public/assets/images/arcjet-light.svg';
import clerkLogoDark from '@/public/assets/images/clerk-logo-dark.png';
import clerkLogoWhite from '@/public/assets/images/clerk-logo-white.png';
import codeRabbitLogoDark from '@/public/assets/images/coderabbit-logo-dark.svg';
import codeRabbitLogoLight from '@/public/assets/images/coderabbit-logo-light.svg';
import crowdinLogoDark from '@/public/assets/images/crowdin-dark.png';
import crowdinLogoWhite from '@/public/assets/images/crowdin-white.png';
import sentryLogoDark from '@/public/assets/images/sentry-dark.png';
import sentryLogoWhite from '@/public/assets/images/sentry-white.png';

export const SponsorLogos = () => {
  const t = useTranslations('SponsorLogos');

  return (
    <LogoCloud text={t('sponsored_by')}>
      <a
        href="https://clerk.com"
        target="_blank"
        rel="noopener"
      >
        <Image
          src={clerkLogoDark}
          alt={t('clerk_logo')}
          className="dark:hidden"
          width={130}
        />
        <Image
          src={clerkLogoWhite}
          alt={t('clerk_logo')}
          className="
            hidden
            dark:block
          "
          width={130}
        />
      </a>

      <a
        href="https://sentry.io/for/nextjs/"
        target="_blank"
        rel="noopener"
      >
        <Image
          src={sentryLogoDark}
          alt={t('sentry_logo')}
          className="dark:hidden"
          width={130}
        />
        <Image
          src={sentryLogoWhite}
          alt={t('sentry_logo')}
          className="
            hidden
            dark:block
          "
          width={130}
        />
      </a>

      <a
        href="https://l.crowdin.com/next-js"
        target="_blank"
        rel="noopener"
      >
        <Image
          src={crowdinLogoDark}
          alt={t('crowdin_logo')}
          className="dark:hidden"
          width={130}
        />
        <Image
          src={crowdinLogoWhite}
          alt={t('crowdin_logo')}
          className="
            hidden
            dark:block
          "
          width={130}
        />
      </a>

      <a
        href="https://launch.arcjet.com/Q6eLbRE"
        target="_blank"
        rel="noopener"
      >
        <Image
          src={arcjetLogoLight}
          alt={t('arcjet_logo')}
          className="dark:hidden"
          width={130}
        />
        <Image
          src={arcjetLogoDark}
          alt={t('arcjet_logo')}
          className="
            hidden
            dark:block
          "
          width={130}
        />
      </a>

      <a
        href="https://www.coderabbit.ai"
        target="_blank"
        rel="noopener"
      >
        <Image
          src={codeRabbitLogoLight}
          alt={t('coderabbit_logo')}
          className="dark:hidden"
          width={130}
        />
        <Image
          src={codeRabbitLogoDark}
          alt={t('coderabbit_logo')}
          className="
            hidden
            dark:block
          "
          width={130}
        />
      </a>
    </LogoCloud>
  );
};
