'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { scheduleMockInterview } from '../actions';

export const ScheduleInterviewForm = (props: {
  applications: { candidateName: string; id: string; jobTitle: string }[];
}) => {
  const [message, setMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  if (props.applications.length === 0) {
    return (
      <div className="
        rounded-lg border bg-card p-4 text-sm text-muted-foreground
      "
      >
        Create an application before scheduling interviews.
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
            await scheduleMockInterview({
              applicationId: formData.get('applicationId'),
              interviewerId: String(formData.get('interviewerId') ?? 'demo-manager'),
              interviewerName: String(formData.get('interviewerName') ?? 'Demo Manager'),
              scheduledAt: formData.get('scheduledAt'),
            });
            setMessage('Interview scheduled.');
          } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Unable to schedule interview.');
          }
        });
      }}
    >
      <h2 className="text-base font-semibold text-foreground">Schedule Interview</h2>
      <div className="mt-3 grid gap-3">
        <select name="applicationId">
          {props.applications.map(application => (
            <option key={application.id} value={application.id}>
              {application.candidateName}
              {' · '}
              {application.jobTitle}
            </option>
          ))}
        </select>
        <input name="interviewerName" placeholder="Interviewer name" />
        <input name="interviewerId" placeholder="Interviewer ID" />
        <input name="scheduledAt" type="datetime-local" />
        <Button disabled={isPending} type="submit">
          {isPending ? 'Scheduling...' : 'Schedule'}
        </Button>
        {message && <div className="text-sm text-muted-foreground">{message}</div>}
      </div>
    </form>
  );
};
