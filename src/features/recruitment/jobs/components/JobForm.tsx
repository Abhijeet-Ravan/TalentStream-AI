'use client';

import type { JobFormPayload } from '../validations';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { recruitmentDepartments } from '../../domain-options';
import { createJob } from '../actions';
import { employmentTypes, jobFormSchema } from '../validations';

type FieldErrors = Partial<Record<keyof JobFormPayload, string>>;

const employmentTypeLabels: Record<(typeof employmentTypes)[number], string> = {
  consultant: 'Consultant',
  contract: 'Contract',
  full_time: 'Full time',
};

const parseList = (value: FormDataEntryValue | null) =>
  String(value ?? '')
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);

const parseOptionalList = (value: FormDataEntryValue | null) => {
  const items = parseList(value);

  return items.length > 0 ? items : undefined;
};

const parseNumber = (value: FormDataEntryValue | null) => Number(value ?? Number.NaN);

const getTextValue = (formData: FormData, key: string) => String(formData.get(key) ?? '');

const buildPayload = (formData: FormData): JobFormPayload => ({
  avoidIndustries: parseOptionalList(formData.get('avoidIndustries')),
  department: getTextValue(formData, 'department') as JobFormPayload['department'],
  description: getTextValue(formData, 'description'),
  education: getTextValue(formData, 'education'),
  employmentType: getTextValue(formData, 'employmentType') as JobFormPayload['employmentType'],
  experienceMax: parseNumber(formData.get('experienceMax')),
  experienceMin: parseNumber(formData.get('experienceMin')),
  location: getTextValue(formData, 'location'),
  noticePeriod: getTextValue(formData, 'noticePeriod'),
  preferredIndustries: parseList(formData.get('preferredIndustries')),
  preferredSkills: parseList(formData.get('preferredSkills')),
  reportingManager: getTextValue(formData, 'reportingManager'),
  requiredSkills: parseList(formData.get('requiredSkills')),
  responsibilities: getTextValue(formData, 'responsibilities'),
  salaryMax: parseNumber(formData.get('salaryMax')),
  salaryMin: parseNumber(formData.get('salaryMin')),
  subFunction: getTextValue(formData, 'subFunction'),
  title: getTextValue(formData, 'title'),
});

const getFieldErrors = (issues: { message: string; path: PropertyKey[] }[]) =>
  issues.reduce<FieldErrors>((errors, issue) => {
    const fieldName = issue.path[0];

    if (typeof fieldName === 'string' && !(fieldName in errors)) {
      return {
        ...errors,
        [fieldName]: issue.message,
      };
    }

    return errors;
  }, {});

const FieldError = (props: {
  message?: string;
}) => props.message
  ? (
      <div className="text-xs font-medium text-destructive">
        {props.message}
      </div>
    )
  : null;

const inputClassName = 'h-10 w-full px-3 text-sm';
const textareaClassName = 'min-h-28 w-full px-3 py-2 text-sm';

export const JobForm = () => {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = buildPayload(new FormData(event.currentTarget));
    const result = jobFormSchema.safeParse(payload);

    if (!result.success) {
      setErrors(getFieldErrors(result.error.issues));
      setSuccessMessage('');
      return;
    }

    startTransition(async () => {
      try {
        setErrors({});
        const job = await createJob({
          ...result.data,
          openPositions: 1,
          status: 'open',
        });
        setSuccessMessage('Job saved.');
        router.push(`/recruiter/jobs/${job.id}`);
      } catch (error) {
        setSuccessMessage(error instanceof Error ? error.message : 'Unable to save job.');
      }
    });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {successMessage && (
        <div className="
          rounded-lg border border-success/20 bg-success/10 px-4 py-3 text-sm
          font-medium text-success
        "
        >
          {successMessage}
        </div>
      )}

      <section className="rounded-lg border bg-card">
        <div className="border-b px-4 py-3">
          <h2 className="text-base font-semibold text-foreground">
            Role Setup
          </h2>
        </div>
        <div className="
          grid gap-4 p-4
          md:grid-cols-2
        "
        >
          <label className="space-y-1.5">
            <span className="text-sm font-medium">Job title</span>
            <input className={inputClassName} name="title" placeholder="Production Engineer" />
            <FieldError message={errors.title} />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium">Department</span>
            <select className={inputClassName} name="department" defaultValue="">
              <option disabled value="">Select department</option>
              {recruitmentDepartments.map(department => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
            <FieldError message={errors.department} />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium">Sub-function</span>
            <input className={inputClassName} name="subFunction" placeholder="Plant operations" />
            <FieldError message={errors.subFunction} />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium">Location</span>
            <input className={inputClassName} name="location" placeholder="Pune, Maharashtra" />
            <FieldError message={errors.location} />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium">Employment type</span>
            <select className={inputClassName} name="employmentType" defaultValue="">
              <option disabled value="">Select job type</option>
              {employmentTypes.map(employmentType => (
                <option key={employmentType} value={employmentType}>
                  {employmentTypeLabels[employmentType]}
                </option>
              ))}
            </select>
            <FieldError message={errors.employmentType} />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium">Reporting manager</span>
            <input className={inputClassName} name="reportingManager" placeholder="Nitin Patil" />
            <FieldError message={errors.reportingManager} />
          </label>
        </div>
      </section>

      <section className="rounded-lg border bg-card">
        <div className="border-b px-4 py-3">
          <h2 className="text-base font-semibold text-foreground">
            Experience and Compensation
          </h2>
        </div>
        <div className="
          grid gap-4 p-4
          md:grid-cols-2
          xl:grid-cols-4
        "
        >
          <label className="space-y-1.5">
            <span className="text-sm font-medium">Experience min</span>
            <input className={inputClassName} min="0" name="experienceMin" type="number" />
            <FieldError message={errors.experienceMin} />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium">Experience max</span>
            <input className={inputClassName} min="0" name="experienceMax" type="number" />
            <FieldError message={errors.experienceMax} />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium">CTC min</span>
            <input className={inputClassName} min="1" name="salaryMin" type="number" />
            <FieldError message={errors.salaryMin} />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium">CTC max</span>
            <input className={inputClassName} min="1" name="salaryMax" type="number" />
            <FieldError message={errors.salaryMax} />
          </label>
        </div>
      </section>

      <section className="rounded-lg border bg-card">
        <div className="border-b px-4 py-3">
          <h2 className="text-base font-semibold text-foreground">
            Candidate Criteria
          </h2>
        </div>
        <div className="
          grid gap-4 p-4
          md:grid-cols-2
        "
        >
          <label className="space-y-1.5">
            <span className="text-sm font-medium">Must-have skills</span>
            <textarea className={textareaClassName} name="requiredSkills" placeholder="Lean Manufacturing, OEE, Root Cause Analysis" />
            <FieldError message={errors.requiredSkills} />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium">Nice-to-have skills</span>
            <textarea className={textareaClassName} name="preferredSkills" placeholder="Six Sigma, SAP PP, Kaizen" />
            <FieldError message={errors.preferredSkills} />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium">Preferred industries</span>
            <input className={inputClassName} name="preferredIndustries" placeholder="Automotive, Industrial Manufacturing" />
            <FieldError message={errors.preferredIndustries} />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium">Avoid industries</span>
            <input className={inputClassName} name="avoidIndustries" placeholder="IT services, Retail" />
            <FieldError message={errors.avoidIndustries} />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium">Education</span>
            <input className={inputClassName} name="education" placeholder="BE Mechanical preferred" />
            <FieldError message={errors.education} />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium">Notice period</span>
            <input className={inputClassName} name="noticePeriod" placeholder="30 to 60 days" />
            <FieldError message={errors.noticePeriod} />
          </label>
        </div>
      </section>

      <section className="rounded-lg border bg-card">
        <div className="border-b px-4 py-3">
          <h2 className="text-base font-semibold text-foreground">
            Role Brief
          </h2>
        </div>
        <div className="grid gap-4 p-4">
          <label className="space-y-1.5">
            <span className="text-sm font-medium">Description</span>
            <textarea className="min-h-32 w-full px-3 py-2 text-sm" name="description" placeholder="Summarize the role, business context, and hiring mandate." />
            <FieldError message={errors.description} />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium">Responsibilities</span>
            <textarea className="min-h-36 w-full px-3 py-2 text-sm" name="responsibilities" placeholder="List the core operating responsibilities and success expectations." />
            <FieldError message={errors.responsibilities} />
          </label>
        </div>
      </section>

      <div className="flex justify-end gap-3">
        <Button disabled={isPending} type="submit">
          {isPending ? 'Saving...' : 'Save Job'}
        </Button>
      </div>
    </form>
  );
};
