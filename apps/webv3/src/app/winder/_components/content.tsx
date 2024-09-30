"use client";
import { IntroSection } from "./intro";
import { base, components } from "./map";

const ContentItem = ({ id, label, component }: (typeof base)[0]) => (
  <div key={id} id={id} className="scroll-mt-32 space-y-9">
    <div className="space-y-4">
      <h2 className="font-serif text-3xl">{label}</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae pariatur
        veniam sit laudantium officiis laborum! Saepe nihil numquam tempore non
        molestias.
      </p>
    </div>
    <div className="rounded-card border border-primary/20 border-dashed p-6">
      {component()}
    </div>
  </div>
);

export const Content = () => {
  const contentItems = [...base, ...components];

  return (
    <div className="space-y-10 scroll-smooth border-custom p-6 md:border-r">
      <IntroSection />
      {contentItems.map(({ id, label, component }) => (
        <ContentItem key={id} id={id} label={label} component={component} />
      ))}
    </div>
  );
};
