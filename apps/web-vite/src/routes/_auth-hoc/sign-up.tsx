import { SignUpPage } from "@/components/sign-up/page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth-hoc/sign-up")({
  component: SignUpPage
});
