'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { createCandidate } from '../actions';
import { candidateSources, formatSource } from '../utils';

const parseSkills = (value: FormDataEntryValue | null) =>
  String(value ?? '')
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
    .map(name => ({ level: 'proficient' as const, name, years: 1 }));

export const CandidateForm = () => {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(async () => {
          try {
            const candidate = await createCandidate({
              currentCompany: String(formData.get('currentCompany') ?? ''),
              currentRole: String(formData.get('currentRole') ?? ''),
              email: String(formData.get('email') ?? ''),
              expectedSalary: String(formData.get('expectedSalary') ?? ''),
              experienceYears: Number(formData.get('experienceYears')),
              location: String(formData.get('location') ?? ''),
              name: String(formData.get('name') ?? ''),
              noticePeriod: String(formData.get('noticePeriod') ?? ''),
              openToWork: formData.get('openToWork') === 'on',
              phone: String(formData.get('phone') ?? ''),
              resumeUrl: String(formData.get('resumeUrl') || undefined),
              skills: parseSkills(formData.get('skills')),
              source: formData.get('source'),
              sourceConfidence: Number(formData.get('sourceConfidence') || 75),
              sourceUrl: String(formData.get('sourceUrl') || undefined),
            });
            router.push(`/recruiter/candidates/${candidate.id}`);
          } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Unable to create candidate.');
          }
        });
      }}
    >
      {message && (
        <div className="rounded-lg border bg-card p-3 text-sm text-destructive">
          {message}
        </div>
      )}
      <section className="rounded-lg border bg-card">
        <div className="border-b px-4 py-3">
          <h2 className="text-base font-semibold text-foreground">Candidate Profile</h2>
        </div>
        <div className="
          grid gap-4 p-4
          md:grid-cols-2
        "
        >
          <input name="name" placeholder="Candidate name" />
          <input name="email" placeholder="Email" type="email" />
          <input name="phone" placeholder="Phone" />
          <input name="location" placeholder="Location" />
          <input name="currentRole" placeholder="Current role" />
          <input name="currentCompany" placeholder="Current company" />
          <input min="0" name="experienceYears" placeholder="Experience years" type="number" />
          <input name="expectedSalary" placeholder="Expected salary" />
          <input name="noticePeriod" placeholder="Notice period" />
          <select name="source" defaultValue="linkedin">
            {candidateSources.map(source => (
              <option key={source} value={source}>{formatSource(source)}</option>
            ))}
          </select>
          <input name="skills" placeholder="Skills, comma separated" />
          <input name="resumeUrl" placeholder="Resume URL optional" />
          <input name="sourceUrl" placeholder="Source URL optional" />
          <input max="100" min="0" name="sourceConfidence" placeholder="Source confidence" type="number" />
          <label className="flex items-center gap-2 text-sm">
            <input name="openToWork" type="checkbox" />
            Open to work
          </label>
        </div>
      </section>
      <div className="flex justify-end">
        <Button disabled={isPending} type="submit">
          {isPending ? 'Saving...' : 'Add Candidate'}
        </Button>
      </div>
    </form>
  );
};
