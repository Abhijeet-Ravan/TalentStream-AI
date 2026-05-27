'use client';

import type { PipelineStage } from '../../types';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { updateApplicationStage, updateApplicationStatus } from '../../applications/actions';
import { shareWithHiringManagerMock } from '../../handoffs/actions';
import { getNextPipelineStage } from '../../stage-utils';

export const PipelineCardActions = (props: {
  applicationId: string;
  currentStage: PipelineStage;
}) => {
  const [message, setMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  const run = (action: 'handoff' | 'next' | 'reject') => {
    startTransition(async () => {
      try {
        if (action === 'next') {
          await updateApplicationStage(props.applicationId, getNextPipelineStage(props.currentStage));
        } else if (action === 'handoff') {
          await shareWithHiringManagerMock({
            applicationIds: [props.applicationId],
            channel: 'email',
            contextNote: 'Mock handoff created from pipeline card.',
            managerEmail: 'hiring.manager@example.com',
            managerId: 'mock-manager',
            managerName: 'Demo Hiring Manager',
          });
        } else {
          await updateApplicationStage(props.applicationId, 'rejected');
          await updateApplicationStatus(props.applicationId, 'rejected');
        }
        setMessage(action === 'next' ? 'Moved.' : action === 'handoff' ? 'Shared.' : 'Rejected.');
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Action failed.');
      }
    });
  };

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <Button disabled={isPending} onClick={() => run('next')} size="sm" type="button" variant="outline">
        Move next
      </Button>
      <Button disabled={isPending} onClick={() => run('reject')} size="sm" type="button" variant="outline">
        Reject
      </Button>
      <Button disabled={isPending} onClick={() => run('handoff')} size="sm" type="button" variant="outline">
        Share
      </Button>
      {message && <span className="text-xs text-muted-foreground">{message}</span>}
    </div>
  );
};
