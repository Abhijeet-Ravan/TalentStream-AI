'use client';

import type { Candidate, Job } from '../../types';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { completeMockScreening, queueScreening } from '../actions';
import { ScreeningCallSession } from './ScreeningCallSession';

export const ScreeningActions = (props: {
  applicationId: string;
  candidate?: Candidate;
  job?: Job;
  hasSession?: boolean;
}) => {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  const run = (action: 'queue' | 'complete') => {
    startTransition(async () => {
      try {
        if (action === 'queue') {
          await queueScreening(props.applicationId);
          setMessage('Screening queued.');
        } else {
          await completeMockScreening(props.applicationId);
          setMessage('Mock screening completed.');
        }

        router.refresh();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Action failed.');
      }
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        disabled={isPending}
        onClick={() => run('queue')}
        size="sm"
        type="button"
        variant={props.hasSession ? 'outline' : 'default'}
      >
        {props.hasSession ? 'Requeue' : 'Queue Screening'}
      </Button>

      {props.candidate && props.job && (
        <ScreeningCallSession
          applicationId={props.applicationId}
          candidate={props.candidate}
          job={props.job}
        />
      )}

      <Button
        disabled={isPending}
        onClick={() => run('complete')}
        size="sm"
        type="button"
        variant="outline"
      >
        Complete Mock
      </Button>

      {message && (
        <span className="text-xs text-muted-foreground">
          {message}
        </span>
      )}
    </div>
  );
};
