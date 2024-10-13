import { createLazyFileRoute } from "@tanstack/react-router";
import { HomePage } from "./~home/page";

export const Route = createLazyFileRoute("/")({
  component: HomePage
});
