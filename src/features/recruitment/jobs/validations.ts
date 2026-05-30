import type { Department, EmploymentType } from '../types';
import { z } from 'zod';
import {
  cosmoLocations,
  departmentSubFunctions,
  educationOptions,
  noticePeriodOptions,
  recruitmentDepartments,
  reportingManagers,
} from '../domain-options';

export const employmentTypes = [
  'full_time',
  'contract',
  'intern',
] as const satisfies EmploymentType[];

const departmentValues = recruitmentDepartments as [Department, ...Department[]];
const employmentTypeValues = employmentTypes as [EmploymentType, ...EmploymentType[]];
const locationValues = [...cosmoLocations] as [string, ...string[]];
const educationValues = [...educationOptions] as [string, ...string[]];
const noticePeriodValues = noticePeriodOptions.map(option => option.value) as [string, ...string[]];
const reportingManagerValues = reportingManagers.map(manager => manager.id) as [string, ...string[]];

export const jobFormSchema = z.object({
  avoidIndustries: z.array(z.string().trim().min(1)).optional(),
  department: z.enum(departmentValues),
  description: z.string().trim().min(40, 'Role brief should be at least 40 characters.'),
  education: z.array(z.enum(educationValues)).min(1, 'Select at least one education requirement.'),
  employmentType: z.enum(employmentTypeValues),
  experienceMax: z.number().int().nonnegative(),
  experienceMin: z.number().int().nonnegative(),
  locations: z.array(z.enum(locationValues)).min(1, 'Select at least one Cosmo location.'),
  noticePeriod: z.enum(noticePeriodValues),
  preferredIndustries: z.array(z.string().trim().min(1)).min(1, 'Add at least one preferred industry.'),
  preferredSkills: z.array(z.string().trim().min(1)).min(1, 'Add at least one nice-to-have skill.'),
  reportingManager: z.enum(reportingManagerValues, 'Select a reporting manager.'),
  requiredSkills: z.array(z.string().trim().min(1)).min(1, 'Add at least one must-have skill.'),
  responsibilities: z.string().trim().min(40, 'Responsibilities should be at least 40 characters.'),
  salaryMax: z.number().int().positive(),
  salaryMin: z.number().int().positive(),
  subFunction: z.string().trim().min(1, 'Select a sub-function.'),
  title: z.string().trim().min(3, 'Job title is required.'),
}).refine(data => data.experienceMax >= data.experienceMin, {
  message: 'Maximum experience must be greater than or equal to minimum experience.',
  path: ['experienceMax'],
}).refine(data => data.salaryMax >= data.salaryMin, {
  message: 'Maximum CTC must be greater than or equal to minimum CTC.',
  path: ['salaryMax'],
}).refine(data => departmentSubFunctions[data.department].includes(data.subFunction), {
  message: 'Select a valid sub-function for the department.',
  path: ['subFunction'],
});

export type JobFormPayload = z.infer<typeof jobFormSchema>;
