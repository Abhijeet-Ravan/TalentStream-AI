'use client';

import type { LucideIcon } from 'lucide-react';
import { Link, usePathname } from '@/libs/I18nNavigation';
import { cn } from '@/utils/Helpers';

export const RecruiterNavItem = (props: {
  href: string;
  label: string;
  icon: LucideIcon;
}) => {
  const pathname = usePathname();
  const isActive = pathname === props.href || pathname.startsWith(`${props.href}/`);
  const Icon = props.icon;

  return (
    <Link
      href={props.href}
      className={cn(
        `
          flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium
          text-muted-foreground transition-colors
          hover:bg-accent hover:text-accent-foreground
          focus-visible:ring-[3px] focus-visible:ring-ring/20
          focus-visible:outline-none
        `,
        isActive && `
          bg-primary text-primary-foreground
          hover:bg-primary-hover hover:text-primary-foreground
        `,
      )}
    >
      <Icon className="size-4" />
      <span>{props.label}</span>
    </Link>
  );
};
