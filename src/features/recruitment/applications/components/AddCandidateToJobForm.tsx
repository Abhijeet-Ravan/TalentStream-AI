'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { createApplication } from '../actions';

export const AddCandidateToJobForm = (props: {
  candidates: { id: string; name: string }[];
  jobId: string;
}) => {
  const [message, setMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  if (props.candidates.length === 0) {
    return (
      <div className="
        rounded-lg border bg-card p-4 text-sm text-muted-foreground
      "
      >
        No available candidates to add.
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
              candidateId: formData.get('candidateId'),
              jobId: props.jobId,
            });
            setMessage('Candidate added and scored.');
          } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Unable to add candidate.');
          }
        });
      }}
    >
      <div className="mb-3 text-sm font-semibold text-foreground">Add Candidate</div>
      <div className="flex gap-3">
        <select className="h-10 flex-1 px-3 text-sm" name="candidateId">
          {props.candidates.map(candidate => (
            <option key={candidate.id} value={candidate.id}>{candidate.name}</option>
          ))}
        </select>
        <Button disabled={isPending} type="submit">{isPending ? 'Adding...' : 'Add'}</Button>
      </div>
      {message && <div className="mt-3 text-sm text-muted-foreground">{message}</div>}
    </form>
  );
};
