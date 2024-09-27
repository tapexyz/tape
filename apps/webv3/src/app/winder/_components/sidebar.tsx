import { components } from ".";

export const Sidebar = () => {
  return (
    <aside className="no-scrollbar sticky top-[80px] bottom-0 z-10 hidden h-[calc(100vh-80px)] overflow-y-auto border-border px-6 py-4 md:block md:border-x">
      <ul className="w-full space-y-0.5">
        {components.map(({ id, label }) => (
          <li key={id}>
            <a
              className="-mx-3 flex rounded-rounded px-3 py-2 text-primary/70 capitalize no-underline outline-none hover:bg-secondary"
              href={`#${id}`}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
};
