'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { recordMockHiringManagerDecision } from '../actions';

export const HandoffDecisionPanel = (props: {
  applicationId: string;
  handoffId: string;
}) => {
  const [message, setMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="flex flex-wrap gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(async () => {
          try {
            await recordMockHiringManagerDecision({
              applicationId: props.applicationId,
              decision: formData.get('decision'),
              handoffId: props.handoffId,
              reason: 'Mock hiring manager response captured by recruiter.',
            });
            setMessage('Decision recorded.');
          } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Unable to record decision.');
          }
        });
      }}
    >
      <select className="h-9 px-2 text-sm" name="decision" defaultValue="approve_round_1">
        <option value="approve_round_1">Approve round 1</option>
        <option value="hold">Hold</option>
        <option value="reject">Reject</option>
      </select>
      <Button disabled={isPending} size="sm" type="submit">Record</Button>
      {message && <span className="text-xs text-muted-foreground">{message}</span>}
    </form>
  );
};
