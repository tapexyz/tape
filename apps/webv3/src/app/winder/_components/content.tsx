"use client";

import { components } from ".";

export const Content = () => {
  return (
    <div className="space-y-10 scroll-smooth border-border p-6 md:border-r">
      {components.map(({ id, label, component }) => (
        <div key={id} id={id} className="scroll-mt-32">
          <h2>{label}</h2>
          <div className="mt-4 rounded-rounded bg-card p-6">{component()}</div>
        </div>
      ))}
    </div>
  );
};
