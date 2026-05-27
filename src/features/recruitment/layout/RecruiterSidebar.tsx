import {
  BarChart3,
  Bot,
  Briefcase,
  Calendar,
  Columns3,
  LayoutDashboard,
  Plus,
  Settings,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@/libs/I18nNavigation';
import { RecruiterNavItem } from './RecruiterNavItem';

const navItems = [
  {
    href: '/recruiter/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/recruiter/jobs',
    label: 'Jobs',
    icon: Briefcase,
  },
  {
    href: '/recruiter/candidates',
    label: 'Candidates',
    icon: Users,
  },
  {
    href: '/recruiter/pipeline',
    label: 'Pipeline',
    icon: Columns3,
  },
  {
    href: '/recruiter/screenings',
    label: 'AI Screening',
    icon: Bot,
  },
  {
    href: '/recruiter/interviews',
    label: 'Interviews',
    icon: Calendar,
  },
  {
    href: '/recruiter/analytics',
    label: 'Analytics',
    icon: BarChart3,
  },
  {
    href: '/recruiter/settings',
    label: 'Settings',
    icon: Settings,
  },
] as const;

export const RecruiterSidebar = () => (
  <aside className="
    hidden min-h-screen w-64 shrink-0 border-r bg-card px-4 py-5
    md:flex md:flex-col
  "
  >
    <div className="px-2">
      <div className="text-lg font-semibold text-foreground">
        TalentStream AI
      </div>
      <div className="
        mt-0.5 text-xs font-semibold tracking-wide text-muted-foreground
        uppercase
      "
      >
        Enterprise Recruitment
      </div>
    </div>

    <Button asChild className="mt-6 w-full justify-start">
      <Link href="/recruiter/jobs/new">
        <Plus className="size-4" />
        Post New Job
      </Link>
    </Button>

    <nav className="mt-6 flex flex-1 flex-col gap-1">
      {navItems.map(item => (
        <RecruiterNavItem
          key={item.href}
          href={item.href}
          label={item.label}
          icon={item.icon}
        />
      ))}
    </nav>
  </aside>
);
