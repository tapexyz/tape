import { TermsPage } from "@/components/terms/page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout-hoc/terms/")({
  component: TermsPage
});
