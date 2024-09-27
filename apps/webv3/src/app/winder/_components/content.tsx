import { components } from ".";

export const Content = () => {
  return (
    <div className="space-y-10 border-border p-6 md:border-r">
      {components.map(({ id, label, component }) => (
        <div key={id} id={id} className="scroll-mt-[105px]">
          <h2>{label}</h2>
          <div className="mt-4 rounded-rounded bg-primary-foreground p-6">
            {component()}
          </div>
        </div>
      ))}
    </div>
  );
};
