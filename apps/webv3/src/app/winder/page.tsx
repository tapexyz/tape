"use client";

import { Content } from "./_components/content";
import { Header } from "./_components/header";
import { Sidebar } from "./_components/sidebar";

export default function WinderPage() {
  return (
    <div className="container min-h-screen max-w-6xl overflow-x-hidden md:overflow-x-visible">
      <Header />
      <div className="md:grid md:grid-cols-[250px_1fr]">
        <Sidebar />
        <Content />
      </div>
    </div>
  );
}
