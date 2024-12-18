import { SignInPage } from "@/components/sign-in/page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth-hoc/sign-in")({
  component: SignInPage
});
