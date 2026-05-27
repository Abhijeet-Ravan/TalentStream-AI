'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { createApplication } from '../actions';

export const AddToJobForm = (props: {
  candidateId: string;
  jobs: { id: string; title: string }[];
}) => {
  const [message, setMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  if (props.jobs.length === 0) {
    return (
      <div className="
        rounded-lg border bg-card p-4 text-sm text-muted-foreground
      "
      >
        Create a job before adding this candidate to an application.
      </div>
    );
  }

  return (
    <form
      className="rounded-lg border bg-card p-4"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(async () => {
          try {
            await createApplication({
              candidateId: props.candidateId,
              jobId: formData.get('jobId'),
            });
            setMessage('Candidate added to job and match score generated.');
          } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Unable to create application.');
          }
        });
      }}
    >
      <div className="mb-3 text-sm font-semibold text-foreground">
        Add to Job
      </div>
      <div className="flex gap-3">
        <select className="h-10 flex-1 px-3 text-sm" name="jobId">
          {props.jobs.map(job => (
            <option key={job.id} value={job.id}>{job.title}</option>
          ))}
        </select>
        <Button disabled={isPending} type="submit">
          {isPending ? 'Adding...' : 'Add'}
        </Button>
      </div>
      {message && <div className="mt-3 text-sm text-muted-foreground">{message}</div>}
    </form>
  );
};
