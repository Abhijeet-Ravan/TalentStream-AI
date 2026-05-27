import { RecruiterSidebar } from './RecruiterSidebar';
import { RecruiterTopbar } from './RecruiterTopbar';

export const RecruiterShell = (props: {
  children: React.ReactNode;
}) => (
  <div className="min-h-screen bg-background text-foreground">
    <div className="flex min-h-screen">
      <RecruiterSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <RecruiterTopbar />

        <main className="
          flex-1 px-4 py-6
          md:p-8
        "
        >
          <div className="mx-auto w-full max-w-7xl">
            {props.children}
          </div>
        </main>
      </div>
    </div>
  </div>
);
