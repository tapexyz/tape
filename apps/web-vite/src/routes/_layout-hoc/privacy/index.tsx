import { PrivacyPage } from "@/components/privacy/page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout-hoc/privacy/")({
  component: PrivacyPage
});
