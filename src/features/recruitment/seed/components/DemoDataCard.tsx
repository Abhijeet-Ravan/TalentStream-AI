'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { seedRecruitmentDemoData } from '../actions';

export const DemoDataCard = (props: {
  counts: {
    applications: number;
    candidates: number;
    handoffs: number;
    interviewFeedback: number;
    interviews: number;
    jobs: number;
    screeningSessions: number;
  };
}) => {
  const [message, setMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  return (
    <section className="rounded-lg border bg-card">
      <div className="border-b px-4 py-3">
        <h2 className="text-base font-semibold text-foreground">Demo Data</h2>
      </div>
      <div className="space-y-4 p-4">
        <p className="text-sm text-muted-foreground">
          Seed the active Clerk organization with development/demo recruitment data.
          This does not call external services.
        </p>
        <div className="
          grid gap-3
          sm:grid-cols-2
          xl:grid-cols-4
        "
        >
          {Object.entries(props.counts).map(([label, value]) => (
            <div key={label} className="rounded-md border bg-secondary p-3">
              <div className="
                text-xs font-semibold text-muted-foreground uppercase
              "
              >
                {label.replace(/([A-Z])/g, ' $1')}
              </div>
              <div className="mt-1 text-lg font-semibold text-foreground">{value}</div>
            </div>
          ))}
        </div>
        <Button
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              try {
                const result = await seedRecruitmentDemoData();
                setMessage(result.alreadySeeded
                  ? 'Demo data already exists for this organization.'
                  : 'Demo data seeded. Refresh the page to see updated counts.');
              } catch (error) {
                setMessage(error instanceof Error ? error.message : 'Unable to seed demo data.');
              }
            });
          }}
          type="button"
        >
          {isPending ? 'Seeding...' : 'Seed demo data'}
        </Button>
        {message && <div className="text-sm text-muted-foreground">{message}</div>}
      </div>
    </section>
  );
};
