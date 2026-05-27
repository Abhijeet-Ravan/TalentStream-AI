'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { submitInterviewFeedback } from '../actions';

export const InterviewFeedbackForm = (props: {
  applicationId: string;
  interviewId: string;
}) => {
  const [message, setMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="space-y-3 rounded-lg border bg-card p-4"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(async () => {
          try {
            await submitInterviewFeedback({
              applicationId: props.applicationId,
              communication: Number(formData.get('communication')),
              concerns: String(formData.get('concerns') ?? ''),
              cultureFit: Number(formData.get('cultureFit')),
              domainFit: Number(formData.get('domainFit')),
              interviewId: props.interviewId,
              nextRoundRecommendation: formData.get('nextRoundRecommendation'),
              overallRecommendation: formData.get('overallRecommendation'),
              reviewerId: String(formData.get('reviewerId') ?? 'mock-reviewer'),
              reviewerName: String(formData.get('reviewerName') ?? 'Demo Reviewer'),
              strengths: String(formData.get('strengths') ?? ''),
              technicalCompetency: Number(formData.get('technicalCompetency')),
            });
            setMessage('Feedback submitted.');
          } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Unable to submit feedback.');
          }
        });
      }}
    >
      <div className="
        grid gap-3
        sm:grid-cols-2
      "
      >
        <input name="reviewerName" placeholder="Reviewer name" />
        <input name="reviewerId" placeholder="Reviewer ID" />
        <select name="overallRecommendation" defaultValue="hire">
          <option value="strong_hire">Strong hire</option>
          <option value="hire">Hire</option>
          <option value="no_hire">No hire</option>
          <option value="strong_no_hire">Strong no hire</option>
        </select>
        <select name="nextRoundRecommendation" defaultValue="proceed">
          <option value="proceed">Proceed</option>
          <option value="hold">Hold</option>
          <option value="reject">Reject</option>
        </select>
        {['technicalCompetency', 'domainFit', 'communication', 'cultureFit'].map(field => (
          <input key={field} defaultValue="4" max="5" min="1" name={field} type="number" />
        ))}
      </div>
      <textarea className="w-full px-3 py-2 text-sm" name="strengths" placeholder="Strengths" />
      <textarea className="w-full px-3 py-2 text-sm" name="concerns" placeholder="Concerns" />
      <Button disabled={isPending} type="submit">
        {isPending ? 'Submitting...' : 'Submit Feedback'}
      </Button>
      {message && <div className="text-sm text-muted-foreground">{message}</div>}
    </form>
  );
};
