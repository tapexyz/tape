import { FollowingPage } from "@/components/following/page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/_home/following")({
  component: FollowingPage
});
