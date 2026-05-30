// src/features/recruitment/jobs/components/JobForm.tsx

'use client';

import type { Department } from '../../types';
import type { JobFormPayload } from '../validations';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  cosmoLocations,
  departmentSubFunctions,
  educationOptions,
  noticePeriodOptions,
  recruitmentDepartments,
  reportingManagers,
} from '../../domain-options';
import { createJob } from '../actions';
import { employmentTypes, jobFormSchema } from '../validations';

type FieldErrors = Partial<Record<keyof JobFormPayload, string>>;

const employmentTypeLabels: Record<(typeof employmentTypes)[number], string> = {
  contract: 'Contract',
  full_time: 'Full time',
  intern: 'Intern',
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

const parseNumber = (value: FormDataEntryValue | null) => {
  const textValue = String(value ?? '').trim();

  return textValue ? Number(textValue) : Number.NaN;
};

const getTextValue = (formData: FormData, key: string) => String(formData.get(key) ?? '');
const getTextValues = (formData: FormData, key: string) => formData.getAll(key).map(value => String(value));

const buildPayload = (formData: FormData): JobFormPayload => ({
  avoidIndustries: parseOptionalList(formData.get('avoidIndustries')),
  department: getTextValue(formData, 'department') as JobFormPayload['department'],
  description: getTextValue(formData, 'description'),
  education: getTextValues(formData, 'education') as JobFormPayload['education'],
  employmentType: getTextValue(formData, 'employmentType') as JobFormPayload['employmentType'],
  experienceMax: parseNumber(formData.get('experienceMax')),
  experienceMin: parseNumber(formData.get('experienceMin')),
  locations: getTextValues(formData, 'locations') as JobFormPayload['locations'],
  noticePeriod: getTextValue(formData, 'noticePeriod') as JobFormPayload['noticePeriod'],
  preferredIndustries: parseList(formData.get('preferredIndustries')),
  preferredSkills: parseList(formData.get('preferredSkills')),
  reportingManager: getTextValue(formData, 'reportingManager') as JobFormPayload['reportingManager'],
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
  const [selectedDepartment, setSelectedDepartment] = useState<Department | ''>('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const subFunctions = selectedDepartment ? departmentSubFunctions[selectedDepartment] : [];

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
            <select
              className={inputClassName}
              name="department"
              defaultValue=""
              onChange={event => setSelectedDepartment(event.target.value as Department)}
            >
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
            <select
              key={selectedDepartment}
              className={inputClassName}
              disabled={!selectedDepartment}
              name="subFunction"
              defaultValue=""
            >
              <option disabled value="">Select sub-function</option>
              {subFunctions.map(subFunction => (
                <option key={subFunction} value={subFunction}>
                  {subFunction}
                </option>
              ))}
            </select>
            <FieldError message={errors.subFunction} />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium">Job type</span>
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
            <select className={inputClassName} name="reportingManager" defaultValue="">
              <option disabled value="">Select manager</option>
              {reportingManagers.map(manager => (
                <option key={manager.id} value={manager.id}>
                  {manager.name}
                </option>
              ))}
            </select>
            <FieldError message={errors.reportingManager} />
          </label>

          <div className="
            space-y-2
            md:col-span-2
          "
          >
            <span className="text-sm font-medium">Locations</span>
            <div className="
              grid gap-2 rounded-md border p-3
              md:grid-cols-2
            "
            >
              {cosmoLocations.map(location => (
                <label
                  key={location}
                  className="flex items-center gap-2 text-sm"
                >
                  <input name="locations" type="checkbox" value={location} />
                  <span>{location}</span>
                </label>
              ))}
            </div>
            <FieldError message={errors.locations} />
          </div>
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

          <div className="space-y-2">
            <span className="text-sm font-medium">Education</span>
            <div className="
              grid gap-2 rounded-md border p-3
              sm:grid-cols-2
            "
            >
              {educationOptions.map(education => (
                <label
                  key={education}
                  className="flex items-center gap-2 text-sm"
                >
                  <input name="education" type="checkbox" value={education} />
                  <span>{education}</span>
                </label>
              ))}
            </div>
            <FieldError message={errors.education} />
          </div>

          <label className="space-y-1.5">
            <span className="text-sm font-medium">Notice period</span>
            <select className={inputClassName} name="noticePeriod" defaultValue="">
              <option disabled value="">Select notice period</option>
              {noticePeriodOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
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
