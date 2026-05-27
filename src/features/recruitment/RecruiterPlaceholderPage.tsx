import { TitleBar } from '@/features/dashboard/TitleBar';

export const RecruiterPlaceholderPage = (props: {
  title: string;
  description: string;
}) => (
  <>
    <TitleBar
      title={props.title}
      description={props.description}
    />

    <div className="rounded-md border bg-card p-6">
      <div className="text-sm font-medium text-muted-foreground">
        TalentStream AI recruiter workspace placeholder.
      </div>
    </div>
  </>
);
