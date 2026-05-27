'use server';

import { createInterviewFeedback } from '../interviews/actions';
import { submitInterviewFeedbackSchema } from './validations';

export const submitInterviewFeedback = async (input: unknown) => {
  const payload = submitInterviewFeedbackSchema.parse(input);

  return createInterviewFeedback(payload);
};
