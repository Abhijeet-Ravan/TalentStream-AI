import type { CandidateSkill } from '../../types';

export const CandidateSkills = (props: {
  skills: CandidateSkill[];
}) => (
  <section className="rounded-lg border bg-card">
    <div className="border-b px-4 py-3">
      <h2 className="text-base font-semibold text-foreground">
        Skills
      </h2>
    </div>
    <div className="grid gap-3 p-4">
      {props.skills.map(skill => (
        <div
          key={skill.name}
          className="
            flex items-center justify-between gap-3 rounded-md border
            bg-secondary px-3 py-2
          "
        >
          <div>
            <div className="text-sm font-semibold text-foreground">
              {skill.name}
            </div>
            <div className="text-xs text-muted-foreground">
              {skill.years}
              {' years'}
            </div>
          </div>
          <span className="
            rounded-md border bg-card px-2 py-0.5 text-xs font-semibold
            text-muted-foreground capitalize
          "
          >
            {skill.level}
          </span>
        </div>
      ))}
    </div>
  </section>
);
