import { Content } from "./content";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

export const WinderPage = () => {
  return (
    <div className="container mx-auto min-h-screen max-w-6xl overflow-x-hidden md:overflow-x-visible">
      <Header />
      <div className="min-w-[300px] md:grid md:grid-cols-[250px_1fr]">
        <Sidebar />
        <Content />
      </div>
    </div>
  );
};
