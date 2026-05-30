import type { Department } from './types';

export const recruitmentDepartments = [
  'Sales',
  'Operations',
  'Supply Chain',
  'Finance',
  'HR',
  'IT',
  'R&D',
  'Marketing',
  'Legal',
  'Plant Maintenance',
  'Manufacturing',
  'Maintenance',
  'Information Technology',
  'Research and Development',
] satisfies Department[];

export const departmentSubFunctions = {
  'Finance': ['Plant Finance', 'Costing', 'FP&A', 'Accounts Payable', 'Treasury'],
  'HR': ['Talent Acquisition', 'HR Business Partnering', 'Learning and Development', 'Compensation and Benefits'],
  'IT': ['Enterprise Applications', 'Infrastructure', 'Service Desk', 'Information Security'],
  'Legal': ['Contracts', 'Compliance', 'Corporate Legal'],
  'Maintenance': ['Utilities', 'Mechanical Maintenance', 'Electrical Maintenance', 'Instrumentation'],
  'Manufacturing': ['Production', 'Process Engineering', 'Quality', 'EHS'],
  'Marketing': ['Brand Marketing', 'Trade Marketing', 'Digital Marketing', 'Market Research'],
  'Operations': ['Plant Operations', 'Production', 'Quality', 'Process Excellence'],
  'Plant Maintenance': ['Mechanical Maintenance', 'Electrical Maintenance', 'Utilities', 'Automation'],
  'R&D': ['Polymer Science', 'Product Development', 'Application Development', 'Lab Trials'],
  'Sales': ['B2B Sales', 'Key Accounts', 'International Sales', 'Channel Sales', 'Institutional Sales'],
  'Information Technology': ['Enterprise Applications', 'Infrastructure', 'Service Desk', 'Information Security'],
  'Research and Development': ['Polymer Science', 'Product Development', 'Application Development', 'Lab Trials'],
  'Supply Chain': ['Demand Planning', 'Procurement', 'Logistics', 'Warehouse Operations', 'Import Export'],
} satisfies Record<Department, string[]>;

export const cosmoLocations = [
  'New Delhi Corporate Office',
  'Mumbai Office',
  'Aurangabad Plant',
  'Karjan Plant',
  'Waluj Plant',
  'Pune Office',
  'Bengaluru Office',
  'Hyderabad Office',
] as const;

export const educationOptions = [
  'Diploma',
  'BE/B.Tech',
  'ME/M.Tech',
  'B.Sc',
  'M.Sc',
  'MBA/PGDM',
  'CA',
  'CMA',
  'LLB',
] as const;

export const noticePeriodOptions = [
  { label: 'Immediate', value: 'immediate' },
  { label: '30 days', value: '30_days' },
  { label: '60 days', value: '60_days' },
  { label: '90 days', value: '90_days' },
] as const;

export const reportingManagers = [
  { id: 'anita-shah', name: 'Anita Shah' },
  { id: 'meera-joshi', name: 'Meera Joshi' },
  { id: 'nitin-patil', name: 'Nitin Patil' },
  { id: 'suresh-nair', name: 'Suresh Nair' },
] as const;
