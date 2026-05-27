'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { completeMockScreening, queueScreening } from '../actions';

export const ScreeningActions = (props: {
  applicationId: string;
}) => {
  const [message, setMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  const run = (action: 'queue' | 'complete') => {
    startTransition(async () => {
      try {
        if (action === 'queue') {
          await queueScreening(props.applicationId);
        } else {
          await completeMockScreening(props.applicationId);
        }
        setMessage(action === 'queue' ? 'Queued.' : 'Completed.');
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Action failed.');
      }
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button disabled={isPending} onClick={() => run('queue')} size="sm" type="button" variant="outline">
        Queue
      </Button>
      <Button disabled={isPending} onClick={() => run('complete')} size="sm" type="button">
        Complete Mock
      </Button>
      {message && <span className="text-xs text-muted-foreground">{message}</span>}
    </div>
  );
};
