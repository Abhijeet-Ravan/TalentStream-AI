'use client';

import { UserButton } from '@clerk/nextjs';
import { Bell, Search } from 'lucide-react';
import { useLocale } from 'next-intl';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { OrganizationMenu } from '@/features/dashboard/OrganizationMenu';
import { getI18nPath } from '@/utils/Helpers';

export const RecruiterTopbar = () => {
  const locale = useLocale();

  return (
    <header className="border-b bg-card">
      <div className="
        flex min-h-16 items-center gap-3 px-4
        md:px-8
      "
      >
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-foreground">
            Recruiter Console
          </div>
          <div className="text-xs font-medium text-muted-foreground">
            Jobs, candidates, pipeline, and AI recruiting operations
          </div>
        </div>

        <div className="
          relative hidden w-full max-w-md
          lg:block
        "
        >
          <Search className="
            pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2
            text-muted-foreground
          "
          />
          <input
            aria-label="Search"
            className="
              h-10 w-full rounded-md border border-input bg-card pr-3 pl-9
              text-sm outline-none
              placeholder:text-muted-foreground
              focus-visible:border-ring focus-visible:ring-[3px]
              focus-visible:ring-ring/20
            "
            placeholder="Search candidates, jobs, workflows..."
            type="search"
          />
        </div>

        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="size-4" />
        </Button>

        <LocaleSwitcher />

        <Separator
          orientation="vertical"
          className="
            hidden h-5
            md:block
          "
        />

        <OrganizationMenu />

        <UserButton
          userProfileMode="navigation"
          userProfileUrl={getI18nPath('/dashboard/user-profile', locale)}
          afterSwitchSessionUrl="/recruiter/dashboard"
          appearance={{
            elements: {
              rootBox: 'px-1 py-1',
            },
          }}
        />
      </div>

      <div className="
        border-t px-4 py-3
        lg:hidden
      "
      >
        <div className="relative">
          <Search className="
            pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2
            text-muted-foreground
          "
          />
          <input
            aria-label="Search"
            className="
              h-10 w-full rounded-md border border-input bg-card pr-3 pl-9
              text-sm outline-none
              placeholder:text-muted-foreground
              focus-visible:border-ring focus-visible:ring-[3px]
              focus-visible:ring-ring/20
            "
            placeholder="Search candidates, jobs, workflows..."
            type="search"
          />
        </div>
      </div>
    </header>
  );
};
