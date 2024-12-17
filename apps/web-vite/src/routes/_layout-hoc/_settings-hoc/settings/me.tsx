import { Me } from "@/components/settings/me";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout-hoc/_settings-hoc/settings/me")({
  component: Me
});
