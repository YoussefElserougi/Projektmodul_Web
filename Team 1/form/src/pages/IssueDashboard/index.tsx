import { MultiStepForm } from "./components/form/MultiStepForm";

export const IssueDashboard = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden py-12 px-4">
      {/* Ambient glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl relative z-10">
        <MultiStepForm />
      </div>
    </main>
  );
};
